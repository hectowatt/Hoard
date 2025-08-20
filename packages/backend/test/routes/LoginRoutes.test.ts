import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from "@jest/globals";
import { AppDataSource } from "../../dist/DataSource.js";
import { server } from "typescript";

// Redis をモック
jest.unstable_mockModule("ioredis", () => ({
  Redis: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockImplementation(() => Promise.resolve("OK")),
    get: jest.fn().mockImplementation(() => Promise.resolve("valid")),
  })),
}));

// ユーザのモック
const mockUser = {
  id: 1,
  username: "testuser",
  password: bcrypt.hashSync("password123", 10),
};

// DataSource をモック
jest.unstable_mockModule("../../dist/DataSource.js", () => ({
  AppDataSource: {
    initialize: jest.fn().mockImplementation(() => Promise.resolve(true)),
    getRepository: jest.fn().mockReturnValue({
      findOne: jest.fn(({ where }) => {
        if (where.username === mockUser.username) {
          return Promise.resolve(mockUser);
        }
        return Promise.resolve(null);
      }),
    }),
  },
}));

// モックが終わってから import
const { app, hoardserver } = await import("../../dist/server.js");


describe("POST /login", () => {
  it("should return 200 and set cookie when login succeeds", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "password123" });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Cookie がセットされているか
    expect(res.headers["set-cookie"]).toBeDefined();

    // JWT が有効か確認
    const cookie = res.headers["set-cookie"][0];
    const token = cookie.split(";")[0].replace("token=", "");
    const decoded = jwt.verify(token, process.env.SECRET || "hoard_secret");
    expect(decoded).toHaveProperty("id", mockUser.id);
  });

  it("should return 401 when password is wrong", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "testuser", password: "wrongpassword" });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it("should return 404 when user not found", async () => {
    const res = await request(app)
      .post("/api/login")
      .send({ username: "unknown", password: "password123" });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe("User not found");
  });

  afterAll(async () => {
    if (hoardserver) {
      await new Promise<void>((resolve, reject) => {
        hoardserver.close((err) => (err ? reject(err) : resolve()));
      });
    };


    if (AppDataSource.destroy && typeof AppDataSource.destroy === "function") {
      try {
        await AppDataSource.destroy();
      } catch (error) {
      }
    };

    jest.clearAllTimers();
  });
});
