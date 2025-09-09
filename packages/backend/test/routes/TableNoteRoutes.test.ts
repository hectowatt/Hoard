import request from "supertest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { jest } from '@jest/globals';
import { idText, server } from "typescript";

import Label from "../../dist/entities/Label.js";
import type TableNote from "../../entities/TableNote.js";
import type TableNoteColumn from "../../entities/TableNoteColumn.js";
import type TableNoteCell from "../../entities/TableNoteCell.js";
import type { Request, Response, NextFunction } from "express";
import { EntityManager } from "typeorm";

// Redis をモック
jest.unstable_mockModule("ioredis", () => ({
    Redis: jest.fn().mockImplementation(() => ({
        set: jest.fn().mockImplementation(() => Promise.resolve("OK")),
        get: jest.fn().mockImplementation(() => Promise.resolve("valid")),
    })),
}));

// ラベルのモック
const mockLabels: Label[] = [
    { id: "1", labelname: "work", createdate: new Date(), notes: [] },
    { id: "2", labelname: "study", createdate: new Date(), notes: [] }
];

// テーブルノートのモック
const mockTableNotes: TableNote[] = [
    { id: "1", title: "test title1", label_id: "1", label: mockLabels[0], is_deleted: false, deletedate: null, is_locked: false, createdate: new Date(), updatedate: new Date() },
    { id: "2", title: "test title2", label_id: "2", label: mockLabels[1], is_deleted: false, deletedate: null, is_locked: true, createdate: new Date(), updatedate: new Date() }
];

// テーブルノートのカラムのモック
const mockTableNoteColumns: TableNoteColumn[] = [
    { id: "1", name: "test column1", order: 1, tableNote: mockTableNotes[0] },
    { id: "2", name: "test column2", order: 2, tableNote: mockTableNotes[0] },
    { id: "3", name: "test column3", order: 1, tableNote: mockTableNotes[1] },
];

// テーブルノートのセルのモック
const mockTableNoteCells: TableNoteCell[] = [
    { id: "1", row_index: 0, value: "test cell1", tableNote: mockTableNotes[0], column: mockTableNoteColumns[0] },
    { id: "2", row_index: 0, value: "test cell2", tableNote: mockTableNotes[0], column: mockTableNoteColumns[1] },
    { id: "3", row_index: 0, value: "test cell3", tableNote: mockTableNotes[1], column: mockTableNoteColumns[2] },
    { id: "4", row_index: 1, value: "test cell4", tableNote: mockTableNotes[1], column: mockTableNoteColumns[2] },
];



// 削除済みノートのモック
const mockDeletedTableNotes = [
    { id: "3", title: "test title3", content: "test content3", label_id: "1", label: mockLabels[0], is_deleted: true, deletedate: new Date(), is_locked: false, createdate: new Date(), updatedate: new Date() }
];

// AuthMiddlewareをモック
jest.unstable_mockModule('../../dist/middleware/AuthMiddleware', () => ({
    authMiddleware: jest.fn((req: Request, res: Response, next: NextFunction) => {
        next();
    }),
}));

// TableNoteのリポジトリをモック
const mockRepoTableNote = {
    find: jest.fn(() => Promise.resolve(mockTableNotes)),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNotes[0].id) {
            return Promise.resolve(mockTableNotes[0]);
        } else if (id === mockTableNotes[1].id) {
            return Promise.resolve(mockTableNotes[1]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data: { title: string; label_id: null; createdate: Date; updatedate: Date; is_locked: boolean }) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNote: TableNote) => {
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
    remove: jest.fn((tableNote: TableNote) => Promise.resolve(tableNote)),
};

// TableNoteColumnのリポジトリをモック
const mockRepoTableNoteColumn = {
        find: jest.fn((options?: any) => {
        if (options?.where?.tableNote?.id === "1") {
            return Promise.resolve([mockTableNoteColumns[0],mockTableNoteColumns[1]]);
        }
        if (options?.where?.tableNote?.id === "2") {
            return Promise.resolve([
                mockTableNoteColumns[2]
            ]);
        }
        return Promise.resolve([]);
    }),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNoteColumns[0].id) {
            return Promise.resolve(mockTableNoteColumns[0]);
        } else if (id === mockTableNoteColumns[1].id) {
            return Promise.resolve(mockTableNoteColumns[1]);
        } else if (id === mockTableNoteColumns[2].id) {
            return Promise.resolve(mockTableNoteColumns[2]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data: { name: string; order: number; }) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNoteColumn: TableNoteColumn) => {
        return Promise.resolve({
            id: tableNoteColumn.id,
            name: tableNoteColumn.name,
            order: tableNoteColumn.order,
            tableNote: tableNoteColumn.tableNote,
        });
    }),
    remove: jest.fn((tableNoteColumn: TableNoteColumn) => Promise.resolve(tableNoteColumn)),
};

// TableNoteCellのリポジトリをモック
const mockRepoTableNoteCell = {
    find: jest.fn((options?: any) => {
        if (options?.where?.tableNote?.id) {
            return Promise.resolve(
                mockTableNoteCells.filter(
                    cell => cell.tableNote.id === options.where.tableNote.id
                )
            );
        }
        return Promise.resolve(mockTableNoteCells);
    }),
    findOneBy: jest.fn(({ id }) => {
        if (id === mockTableNoteCells[0][0].id) {
            return Promise.resolve(mockTableNoteCells[0]);
        } else if (id === mockTableNoteCells[0][1].id) {
            return Promise.resolve(mockTableNoteCells[1]);
        } else if (id === mockTableNoteCells[1][0].id) {
            return Promise.resolve(mockTableNoteCells[2]);
        }
        return Promise.resolve(null);
    }),
    create: jest.fn((data: { row_index: number; value: string }) => {
        return { id: 3, ...data };
    }),
    save: jest.fn((tableNoteCell: TableNoteCell) => {
        return Promise.resolve({
            id: tableNoteCell.id,
            row_index: tableNoteCell.row_index,
            value: tableNoteCell.value,
            tableNote: tableNoteCell.tableNote,
            column: tableNoteCell.column,
        });
    }),
    remove: jest.fn((tableNoteColumn: TableNoteColumn) => Promise.resolve(tableNoteColumn)),
};

const mockGetRepository = jest.fn((entity: { name: string }) => {
    console.log('getRepository called with:', entity?.name);
    // コンストラクタ名や静的プロパティで判定
    const entityName = entity.name;
    if (entityName === 'TableNote') return mockRepoTableNote;
    if (entityName === 'TableNoteColumn') return mockRepoTableNoteColumn;
    if (entityName === 'TableNoteCell') return mockRepoTableNoteCell;
    // デフォルトのフォールバック
    return {};
});

const mockTransaction = jest.fn(async (callback: (entityManager: EntityManager) => Promise<void>) => {
    const mockEntityManager = {
        getRepository: mockGetRepository,
    };
    await callback(mockEntityManager as unknown as EntityManager);
});

jest.unstable_mockModule("../../dist/DataSource.js", () => ({
    AppDataSource: {
        initialize: jest.fn<() => Promise<any>>().mockResolvedValue(true),
        getRepository: mockGetRepository,
        transaction: mockTransaction,
        destroy: jest.fn<() => Promise<any>>().mockResolvedValue(true),
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
        expect(response.body[0].id).toBe("1");
        expect(response.body[0].title).toBe("test title1");
        expect(response.body[0].label_id).toBe("1");
        expect(response.body[0].is_locked).toBe(false);
        expect(response.body[0]).toHaveProperty("createdate");
        expect(response.body[0]).toHaveProperty("updatedate");
        expect(response.body[0].columns[0].id).toBe("1");
        expect(response.body[0].columns[0].name).toBe("test column1");
        expect(response.body[0].columns[0].order).toBe(1);
        expect(response.body[0].columns[1].id).toBe("2");
        expect(response.body[0].columns[1].name).toBe("test column2");
        expect(response.body[0].columns[1].order).toBe(2);
        expect(response.body[0].rowCells[0][0].id).toBe("1");
        expect(response.body[0].rowCells[0][0].rowIndex).toBe(0);
        expect(response.body[0].rowCells[0][0].value).toBe("test cell1");
        expect(response.body[0].rowCells[0][0]).toHaveProperty("columnId");
        expect(response.body[0].rowCells[0][1].id).toBe("2");
        expect(response.body[0].rowCells[0][1].rowIndex).toBe(0);
        expect(response.body[0].rowCells[0][1].value).toBe("test cell2");
        expect(response.body[0].rowCells[0][1]).toHaveProperty("columnId");
        expect(response.body[0].rowCells[0][0].id).toBe("1");
        expect(response.body[0].rowCells[0][0].rowIndex).toBe(0);
        expect(response.body[0].rowCells[0][0].value).toBe("test cell1");
        expect(response.body[0].rowCells[0][0]).toHaveProperty("columnId");
        expect(response.body[0].rowCells[0][1].id).toBe("2");
        expect(response.body[0].rowCells[0][1].rowIndex).toBe(0);
        expect(response.body[0].rowCells[0][1].value).toBe("test cell2");
        expect(response.body[0].rowCells[0][1]).toHaveProperty("columnId");


        expect(response.body[1].id).toBe("2");
        expect(response.body[1].title).toBe("test title2");
        expect(response.body[1].label_id).toBe("2");
        expect(response.body[1].is_locked).toBe(true);
        expect(response.body[1]).toHaveProperty("createdate");
        expect(response.body[1]).toHaveProperty("updatedate");
        expect(response.body[1].columns[0].id).toBe("3");
        expect(response.body[1].columns[0].name).toBe("test column3");
        expect(response.body[1].columns[0].order).toBe(1);
        expect(response.body[1].rowCells[0][0].id).toBe("3");
        expect(response.body[1].rowCells[0][0].rowIndex).toBe(0);
        expect(response.body[1].rowCells[0][0].value).toBe("test cell3");
        expect(response.body[1].rowCells[1][0].id).toBe("4");
        expect(response.body[1].rowCells[1][0].rowIndex).toBe(1);
        expect(response.body[1].rowCells[1][0].value).toBe("test cell4");
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
})