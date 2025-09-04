import request from "supertest";
import { jest } from '@jest/globals';
import { AppDataSource } from "../../dist/DataSource.js";
// Redis をモック
jest.unstable_mockModule("ioredis", () => ({
    Redis: jest.fn().mockImplementation(() => ({
        set: jest.fn().mockImplementation(() => Promise.resolve("OK")),
        get: jest.fn().mockImplementation(() => Promise.resolve("valid")),
    })),
}));
// ラベルのモック
const mockLabels = [
    { id: "1", labelname: "work", createdate: new Date(), notes: [] },
    { id: "2", labelname: "study", createdate: new Date(), notes: [] }
];
// ノートのモック
const mockNotes = [
    { id: "1", title: "test title1", content: "test content1", label_id: "1", label: mockLabels[0], is_deleted: false, deletedate: null, is_locked: false, createdate: new Date(), updatedate: new Date() },
    { id: "2", title: "test title2", content: "test content2", label_id: "2", label: mockLabels[1], is_deleted: false, deletedate: null, is_locked: true, createdate: new Date(), updatedate: new Date() }
];
// 削除済みノートのモック
const mockDeletedNotes = [
    { id: "3", title: "test title3", content: "test content3", label_id: "1", label: mockLabels[0], is_deleted: true, deletedate: new Date(), is_locked: false, createdate: new Date(), updatedate: new Date() }
];
// AuthMiddlewareをモック
jest.unstable_mockModule('../../dist/middleware/AuthMiddleware', () => ({
    authMiddleware: jest.fn((req, res, next) => {
        next();
    }),
}));
// DataSource をモック
const mockRepo = {
    find: jest.fn(() => Promise.resolve(mockNotes)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockNotes[0].id) {
            return Promise.resolve(mockNotes[0]);
        }
        else if (id === mockNotes[1].id) {
            return Promise.resolve(mockNotes[1]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((note) => {
        return Promise.resolve({
            id: note.id,
            title: note.title,
            content: note.content,
            label_id: note.label_id,
            is_locked: note.is_locked,
            createdate: new Date(),
            updatedate: new Date(),
            is_deleted: false,
            deletedate: null
        });
    }),
    remove: jest.fn((note) => Promise.resolve(note)),
};
jest.unstable_mockModule("../../dist/DataSource.js", () => ({
    AppDataSource: {
        initialize: jest.fn().mockImplementation(() => Promise.resolve(true)),
        getRepository: jest.fn().mockImplementation(() => mockRepo),
    },
}));
// モックが終わってから import
const { app, hoardserver } = await import("../../dist/server.js");
describe("NoteRoutes", () => {
    it("GET /notes should return 200 and all notes", async () => {
        const response = await request(app).get("/api/notes");
        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe("1");
        expect(response.body[0].title).toBe("test title1");
        expect(response.body[0].content).toBe("test content1");
        expect(response.body[0].label_id).toBe("1");
        expect(response.body[0].is_deleted).toBe(false);
        expect(response.body[0].deletedate).toBe(null);
        expect(response.body[0].is_locked).toBe(false);
        expect(response.body[0].label.id).toBe("1");
        expect(response.body[1].id).toBe("2");
        expect(response.body[1].title).toBe("test title2");
        expect(response.body[1].content).toBe("test content2");
        expect(response.body[1].label_id).toBe("2");
        expect(response.body[1].is_deleted).toBe(false);
        expect(response.body[1].deletedate).toBe(null);
        expect(response.body[1].is_locked).toBe(true);
        expect(response.body[1].label.id).toBe("2");
    });
    it("GET /notes and Error occured should return 500 and error message", async () => {
        mockRepo.find.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app).get("/api/notes");
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to fetch notes");
    });
    it("POST /notes should return 201 and message, registered note", async () => {
        const res = await request(app)
            .post("/api/notes")
            .send({ title: "test title3", content: "test content3", label: "1", isLocked: false });
        expect(res.status).toBe(201);
        expect(res.body.message).toBe("save note success!");
        expect(res.body.note).toHaveProperty("id");
        expect(res.body.note.title).toBe("test title3");
        expect(res.body.note.content).toBe("test content3");
        expect(res.body.note.label_id).toBe("1");
        expect(res.body.note.is_locked).toBe(false);
        expect(res.body.note.is_deleted).toBe(false);
        expect(res.body.note.deletedate).toBe(null);
        expect(res.body.note).toHaveProperty("createdate");
        expect(res.body.note).toHaveProperty("updatedate");
    });
    it("POST /notes and Error occured should return 500 and message", async () => {
        mockRepo.save.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app)
            .post("/api/notes")
            .send({ title: "test title3", content: "test content3", label: "1", isLocked: false });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to save note");
    });
    it("PUT /notes should return 200 and message, updated note", async () => {
        const response = await request(app)
            .put("/api/notes")
            .send({ id: "1", title: "updated title", content: "updated content", label: "2", isLocked: true });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("update note success!");
        expect(response.body.note.id).toBe("1");
        expect(response.body.note.title).toBe("updated title");
        expect(response.body.note.content).toBe("updated content");
        expect(response.body.note.label_id).toBe("2");
        expect(response.body.note.is_locked).toBe(true);
        expect(response.body.note).toHaveProperty("createdate");
        expect(response.body.note).toHaveProperty("updatedate");
    });
    it("PUT /notes with invalid id should return 404 and message", async () => {
        const response = await request(app)
            .put("/api/notes")
            .send({ id: "999", title: "updated title", content: "updated content", label: "2", isLocked: true });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Can't find note");
    });
    it("PUT /notes and Error occured should return 500 and message", async () => {
        mockRepo.findOneBy.mockImplementationOnce(() => Promise.reject(new Error("DB findOneBy error")));
        const response = await request(app)
            .put("/api/notes")
            .send({ id: "1", title: "updated title", content: "updated content", label: "2", isLocked: true });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("failed to update notes");
    });
    it("DELETE /notes should return 200 and message", async () => {
        const response = await request(app)
            .delete("/api/notes/1");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Note moved to trash successfully");
    });
    it("DELETE /notes with NOT exists note should return 404 and message", async () => {
        const response = await request(app)
            .delete("/api/notes/999");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("Note not found");
    });
    it("DELETE /notes and Error occured should return 500 and message", async () => {
        mockRepo.findOneBy.mockImplementationOnce(() => Promise.reject(new Error("DB findOneBy error")));
        const response = await request(app)
            .delete("/api/notes/1");
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to move note to trash");
    });
    /************ TrashNote ************/
    it("GET /notes/trash should return deleted notes", async () => {
        mockRepo.find.mockImplementationOnce(() => Promise.resolve(mockDeletedNotes));
        const response = await request(app)
            .get("/api/notes/trash");
        expect(response.status).toBe(200);
        expect(response.body[0].id).toBe("3");
        expect(response.body[0].title).toBe("test title3");
        expect(response.body[0].content).toBe("test content3");
        expect(response.body[0].label_id).toBe("1");
        expect(response.body[0].is_locked).toBe(false);
        expect(response.body[0].is_deleted).toBe(true);
        expect(response.body[0]).toHaveProperty("deletedate");
        expect(response.body[0]).toHaveProperty("createdate");
        expect(response.body[0]).toHaveProperty("updatedate");
    });
    it("GET /notes/trash and error occured should return 500 and message", async () => {
        mockRepo.find.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app)
            .get("/api/notes/trash");
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to fetch trash notes");
    });
    it("DELETE /notes/trash should return 200 and message", async () => {
        mockRepo.remove.mockImplementationOnce(() => Promise.resolve());
        const response = await request(app)
            .delete("/api/notes/trash/2");
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Note deleted successfully");
    });
    it("DELETE /notes/trash with NOT exist note should return 404 and message", async () => {
        const response = await request(app)
            .delete("/api/notes/trash/999");
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("TrashNote not found");
    });
    it("DELETE /notes/trash and error occured should return 500 and message", async () => {
        mockRepo.findOneBy.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app)
            .delete("/api/notes/trash/2");
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to delete note");
    });
    it("PUT /notes/trash should return 200 and message", async () => {
        mockRepo.findOneBy.mockImplementationOnce(() => Promise.resolve(mockDeletedNotes[0]));
        const response = await request(app)
            .put("/api/notes/trash")
            .send({ id: 3 });
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Restore note success!");
        expect(response.body.note.id).toBe("3");
        expect(response.body.note.is_deleted).toBe(false);
        expect(response.body.note.deletedate).toBe(null);
    });
    it("PUT /notes/trash with NOT exist note should return 404 and message", async () => {
        const response = await request(app)
            .put("/api/notes/trash")
            .send({ id: 999 });
        expect(response.status).toBe(404);
        expect(response.body.error).toBe("TrashNote not found");
    });
    it("PUT /notes/trash and error occured should return 500 and message", async () => {
        mockRepo.findOneBy.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app)
            .delete("/api/notes/trash/2");
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to delete note");
    });
    afterAll(async () => {
        if (hoardserver) {
            await new Promise((resolve, reject) => {
                hoardserver.close((err) => (err ? reject(err) : resolve()));
            });
        }
        ;
        if (AppDataSource.destroy && typeof AppDataSource.destroy === "function") {
            try {
                await AppDataSource.destroy();
            }
            catch (error) {
            }
        }
        ;
        jest.clearAllTimers();
    });
});
//# sourceMappingURL=NoteRoutes.test.js.map