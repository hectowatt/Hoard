import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from '@jest/globals';
import { AppDataSource } from "../../dist/DataSource.js";
import { idText, server } from "typescript";

import type HoardUser from "../../dist/entities/HoardUser.js";
import { authMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Request, Response, NextFunction } from "express";
import { before } from "node:test";

// Redis をモック
jest.unstable_mockModule("ioredis", () => ({
    Redis: jest.fn().mockImplementation(() => ({
        set: jest.fn().mockImplementation(() => Promise.resolve("OK")),
        get: jest.fn().mockImplementation(() => Promise.resolve("valid")),
    })),
}));

// AuthMiddlewareをモック
jest.unstable_mockModule('../../dist/middleware/AuthMiddleware', () => ({
    authMiddleware: jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
}));

// テスト用のユーザーデータ
const mockHoardUser = [{
    id: "1",
    username: "testuser",
    password: "testpassword",
    createdate: new Date(),
    updatedate: new Date(),
}]

// DataSource をモック
const mockRepo = {
    find: jest.fn(() => Promise.resolve(mockHoardUser)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockHoardUser[0].id) {
            return Promise.resolve(mockHoardUser[0]);
        } else {
            return Promise.resolve(null);
        }
    }),
    create: jest.fn((data: { username: string; password: string; createdate: Date; updatedate: Date; }) => {
        return { id: 2, ...data };
    }),
    save: jest.fn((user: HoardUser) => {
        return Promise.resolve({
            id: 2,
            username: user.username,
            password: user.password,
            createdate: new Date(),
            updatedate: new Date(),
        });
    }),
    remove: jest.fn((user: HoardUser) => Promise.resolve(user)),
};

jest.unstable_mockModule("../../dist/DataSource.js", () => ({
    AppDataSource: {
        initialize: jest.fn().mockImplementation(() => Promise.resolve(true)),
        getRepository: jest.fn().mockImplementation(() => mockRepo),
    },
}));

// モックが終わってから import
const { app, hoardserver } = await import("../../dist/server.js");

describe("HoardUserRoutes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("GET /user/isexist should return boolean", async () => {
        const response = await request(app)
            .get("/api/user/isexist");
        expect(response.status).toBe(200);
        expect(response.body.exists).toBe(true);
    });

    it("GET /user should return 200 and user", async () => {
        const response = await request(app)
            .get("/api/user");

        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe("1");
        expect(response.body[0].username).toBe("testuser");
        expect(response.body[0].password).toBe("testpassword");
        expect(response.body[0]).toHaveProperty("createdate");
        expect(response.body[0]).toHaveProperty("updatedate");
    });

    it("POST /user should return 201 and message", async () => {
        const response = await request(app)
            .post("/api/user")
            .send({ username: "newuser", password: "newpassword" });

        expect(response.status).toBe(201);
        expect(response.body.message).toBe("regist user success!");
        const cookies = response.headers['set-cookie'];
        expect(cookies).toBeDefined();

        const cookieArray = Array.isArray(cookies) ? cookies : [cookies]; // ← ここが重要
        const tokenCookie = cookieArray.find(cookie => cookie.startsWith('token='));
        expect(tokenCookie).toBeDefined();
    });

    it("POST /user and error occured should return 500 and message", async () => {
        mockRepo.save.mockImplementationOnce(() => Promise.reject(new Error("DB save error")));

        const response = await request(app)
            .post("/api/user")
            .send({ username: "newuser", password: "newpassword" });

        expect(response.status).toBe(500);
        expect(response.body.message).toBe("Internal server error");
    });

    afterAll(async () => {
        if (hoardserver && hoardserver.listening)  {
            await new Promise<void>((resolve, reject) => {
                hoardserver.close((err) => (err ? reject(err) : resolve()));
            });
        };

        if (AppDataSource.destroy && typeof AppDataSource.destroy === "function") {
            try {
                await AppDataSource.destroy();
                console.log("DB connection destroyed");
            } catch (error) {
                console.error("DB destroy error:", error);
            }
        };

        jest.clearAllTimers();
    });


})