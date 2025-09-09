import request from "supertest";
import { jest } from '@jest/globals';
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
// テーブルノートのモック
const mockTableNotes = [
    { id: "1", title: "test title1", label_id: "1", label: mockLabels[0], is_deleted: false, deletedate: null, is_locked: false, createdate: new Date(), updatedate: new Date() },
    { id: "2", title: "test title2", label_id: "2", label: mockLabels[1], is_deleted: false, deletedate: null, is_locked: true, createdate: new Date(), updatedate: new Date() }
];
// テーブルノートのカラムのモック
const mockTableNoteColumns = [
    { id: "1", name: "test column1", order: 1, tableNote: mockTableNotes[1] },
    { id: "2", name: "test column2", order: 2, tableNote: mockTableNotes[1] },
    { id: "3", name: "test column3", order: 1, tableNote: mockTableNotes[1] },
];
// テーブルノートのセルのモック
const mockTableNoteCells = [
    { id: "1", row_index: 0, value: "test cell1", tableNote: mockTableNotes[0], column: mockTableNoteColumns[0] },
    { id: "2", row_index: 1, value: "test cell2", tableNote: mockTableNotes[0], column: mockTableNoteColumns[1] },
    { id: "3", row_index: 0, value: "test cell3", tableNote: mockTableNotes[1], column: mockTableNoteColumns[2] },
];
// 削除済みノートのモック
const mockDeletedTableNotes = [
    { id: "3", title: "test title3", content: "test content3", label_id: "1", label: mockLabels[0], is_deleted: true, deletedate: new Date(), is_locked: false, createdate: new Date(), updatedate: new Date() }
];
// AuthMiddlewareをモック
jest.unstable_mockModule('../../dist/middleware/AuthMiddleware', () => ({
    authMiddleware: jest.fn((req, res, next) => {
        next();
    }),
}));
// TableNoteのリポジトリをモック
const mockRepoTableNote = {
    find: jest.fn(() => Promise.resolve(mockTableNotes)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNotes[0].id) {
            return Promise.resolve(mockTableNotes[0]);
        }
        else if (id === mockTableNotes[1].id) {
            return Promise.resolve(mockTableNotes[1]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNote) => {
        return Promise.resolve({
            id: tableNote.id,
            title: tableNote.title,
            label_id: tableNote.label_id,
            is_locked: tableNote.is_locked,
            createdate: new Date(),
            updatedate: new Date(),
            is_deleted: false,
            deletedate: null
        });
    }),
    remove: jest.fn((tableNote) => Promise.resolve(tableNote)),
};
// TableNoteColumnのリポジトリをモック
const mockRepoTableNoteColumn = {
    find: jest.fn(() => Promise.resolve(mockTableNoteColumns)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNoteColumns[0].id) {
            return Promise.resolve(mockTableNoteColumns[0]);
        }
        else if (id === mockTableNoteColumns[1].id) {
            return Promise.resolve(mockTableNoteColumns[1]);
        }
        else if (id === mockTableNoteColumns[2].id) {
            return Promise.resolve(mockTableNoteColumns[2]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNoteColumn) => {
        return Promise.resolve({
            id: tableNoteColumn.id,
            name: tableNoteColumn.name,
            order: tableNoteColumn.order,
            tableNote: tableNoteColumn.tableNote,
        });
    }),
    remove: jest.fn((tableNoteColumn) => Promise.resolve(tableNoteColumn)),
};
// TableNoteCellのリポジトリをモック
const mockRepoTableNoteCell = {
    find: jest.fn(() => Promise.resolve(mockTableNoteCells)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNoteCells[0].id) {
            return Promise.resolve(mockTableNoteCells[0]);
        }
        else if (id === mockTableNoteCells[1].id) {
            return Promise.resolve(mockTableNoteCells[1]);
        }
        else if (id === mockTableNoteCells[2].id) {
            return Promise.resolve(mockTableNoteCells[2]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNoteCell) => {
        return Promise.resolve({
            id: tableNoteCell.id,
            row_index: tableNoteCell.row_index,
            value: tableNoteCell.value,
            tableNote: tableNoteCell.tableNote,
            column: tableNoteCell.column,
        });
    }),
    remove: jest.fn((tableNoteColumn) => Promise.resolve(tableNoteColumn)),
};
const mockGetRepository = jest.fn((entity) => {
    console.log('getRepository called with:', entity?.name);
    // コンストラクタ名や静的プロパティで判定
    const entityName = entity.name;
    if (entityName === 'TableNote')
        return mockRepoTableNote;
    if (entityName === 'TableNoteColumn')
        return mockRepoTableNoteColumn;
    if (entityName === 'TableNoteCell')
        return mockRepoTableNoteCell;
    // デフォルトのフォールバック
    return {};
});
const mockTransaction = jest.fn(async (callback) => {
    const mockEntityManager = {
        getRepository: mockGetRepository,
    };
    await callback(mockEntityManager);
});
jest.unstable_mockModule("../../dist/DataSource.js", () => ({
    AppDataSource: {
        initialize: jest.fn().mockResolvedValue(true),
        getRepository: mockGetRepository,
        transaction: mockTransaction,
        destroy: jest.fn().mockResolvedValue(true),
    },
}));
// モックが終わってから import
const { app, hoardserver } = await import("../../dist/server.js");
const AppDataSource = await import("../../dist/DataSource.js");
describe("TableNoteRoutes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("POST /trashnotes should return 201 and message", async () => {
        const response = await request(app)
            .post("/api/tablenotes")
            .send({ title: "test title", columns: mockTableNoteColumns, rowCells: mockTableNoteCells, label_id: mockLabels[0].id, is_locked: false });
        expect(response.status).toBe(201);
        expect(response.body.message).toBe("Save TableNote success!");
        expect(response.body.tableNote).toHaveProperty("id");
        expect(response.body.tableNote.title).toBe("test title");
        expect(response.body.tableNote.label_id).toBe(mockLabels[0].id);
        expect(response.body.tableNote.is_locked).toBe(false);
        expect(response.body.tableNote).toHaveProperty("createdate");
        expect(response.body.tableNote).toHaveProperty("updatedate");
    });
    it("POST /trashnotes and error occured should return 500 and message", async () => {
        mockRepoTableNote.save.mockImplementationOnce(() => Promise.reject(new Error("DB find error")));
        const response = await request(app)
            .post("/api/tablenotes")
            .send({ title: "test title", columns: mockTableNoteColumns, rowCells: mockTableNoteCells, label_id: mockLabels[0].id, is_locked: false });
        expect(response.status).toBe(500);
        expect(response.body.error).toBe("Failed to save TableNote");
    });
    it("GET /trashnotes should return 200 and message", async () => {
        const response = await request(app)
            .get("/api/tablenotes");
        expect(response.status).toBe(200);
        expect(response.body[0]).toHaveProperty("id");
        expect(response.body[0].title).toBe("test title");
        expect(response.body[0].label_id).toBe(mockLabels[0].id);
        expect(response.body[0].is_locked).toBe(false);
        expect(response.body[0]).toHaveProperty("createdate");
        expect(response.body[0]).toHaveProperty("updatedate");
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
//# sourceMappingURL=TableNoteRoutes.test.js.map