import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from '@jest/globals';
import { AppDataSource } from "../../dist/DataSource.js";
import { idText, server } from "typescript";

import type { Label } from "../../dist/entities/Label.js";
import { authMiddleware } from "../../middleware/AuthMiddleware.js";
import type { Request, Response, NextFunction } from "express";

// Redis をモック
jest.unstable_mockModule("ioredis", () => ({
  Redis: jest.fn().mockImplementation(() => ({
    set: jest.fn().mockImplementation(() => Promise.resolve("OK")),
    get: jest.fn().mockImplementation(() => Promise.resolve("valid")),
  })),
}));

// ラベルのモック
const mockLabels = [
    {id:"1", labelname: "work", createdate: new Date(), notes: []},
    {id:"2", labelname: "study", createdate: new Date(), notes: []}   
]

// AuthMiddlewareをモック
jest.unstable_mockModule('../../dist/middleware/AuthMiddleware', () => ({
    authMiddleware: jest.fn((req : Request, res: Response, next: NextFunction) => {
        next();
    }),
}));

// DataSource をモック
jest.unstable_mockModule("../../dist/DataSource.js", () => ({
  AppDataSource: {
    initialize: jest.fn().mockImplementation(() => Promise.resolve(true)),
    getRepository: jest.fn().mockReturnValue({
      find: jest.fn(() => {
        return Promise.resolve(mockLabels);
      }),
      findOneBy: jest.fn(({id}) => {
        if(id === mockLabels[0].id){
            return Promise.resolve(mockLabels[0]);
        }else if(id === mockLabels[1].id){
            return Promise.resolve(mockLabels[1]);
        }
        return Promise.resolve(null);
      }),
      create: jest.fn((data: { labelname: string; createdate: Date }) => {
        return { id:3, ...data}
      }),
      save: jest.fn((label: Label) => {
        return Promise.resolve({
          id: 3,
          labelname: label.labelname,
          createdate: new Date(),
        });
      }),
      remove: jest.fn((label: Label) => {
        return Promise.resolve(label);
      })
    }),
  },
}));

// モックが終わってから import
const { app, hoardserver } = await import("../../dist/server.js");

describe("/labels", () => {
    it("POST /labels should return 201 and message, registered label", async () => {
        const res = await request(app)
            .post("/api/labels")
            .send({ labelName: "test" });

        expect(res.status).toBe(201);

        expect(res.body.message).toBe("Save label success!");

        expect(res.body.label).toHaveProperty("id");
        expect(res.body.label.labelname).toBe("test");
    });

    it("GET /labels should return 200 and all labels", async() => {
        const res = await request(app)
        .get("/api/labels");

        expect(res.status).toBe(200);
        expect(res.body[0].id).toBe(1);
        expect(res.body[1].id).toBe(2);
        expect(res.body[0].labelname).toBe("work");
        expect(res.body[1].labelname).toBe("study");
        
    });

    it("DELETE /labels should return 200 and message", async() => {
      const res = await request(app)
      .delete("/api/labels/1");

      expect(res.status).toBe(200);
      expect(res.body.message).toBe("Label deleted successfully");
    });

    it("DELETE /labels with NOT exists label should return 404 and message", async() => {
      const res = await request(app)
      .delete("/api/labels/3");

      expect(res.status).toBe(404);
      expect(res.body.error).toBe("Label not found");
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