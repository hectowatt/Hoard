import request from 'supertest';
import { LessThan } from 'typeorm';
import { jest } from '@jest/globals';
import type { Request, Response, NextFunction } from "express";

jest.mock('../dist/entities/Note.js', () => ({
  __esModule: true,
  default: class Note {},
}));

jest.mock('../dist/entities/TableNote.js', () => ({
  __esModule: true,
  default: class TableNote {},
}));


// 各リポジトリに対応するモックを作成
const mockRepoNote = {
  delete: jest.fn((note) => Promise.resolve(note)),
};
const mockRepoTableNote = {
  delete: jest.fn((tableNote) => Promise.resolve(tableNote)),
};

const NoteModule = await import('../dist/entities/Note.js');
const TableNoteModule = await import('../dist/entities/TableNote.js');
const Note = NoteModule.default;
const TableNote = TableNoteModule.default;


const mockGetRepository = jest.fn((entity: any) => {
  console.log('getRepository called with:', entity);
  console.log('  typeof:', typeof entity);
  console.log('  name prop:', entity?.name);
  console.log('  constructor.name:', entity?.constructor?.name);
  // 比較を柔軟にしておく
  if (entity === TableNote || entity?.name === TableNote?.name || entity?.constructor?.name === TableNote?.name) return mockRepoTableNote;
  if (entity === Note || entity?.name === Note?.name || entity?.constructor?.name === Note?.name) return mockRepoNote;
  return {};
});


// DataSourceをモック化
jest.unstable_mockModule('../dist/DataSource.js', () => ({
  AppDataSource: {
    getRepository: mockGetRepository,
    initialize: jest.fn().mockImplementation(() => Promise.resolve(true)),
  },
}));

// モックが終わってから import
const { app, hoardserver, deleteOldNotes } = await import("../dist/server.js");
const AppDataSource = await import("../dist/DataSource.js");

describe('Server Tests', () => {

  beforeEach(() => {
    jest.clearAllMocks();
});

  // --- APIエンドポイントのテスト ---
  describe('API Endpoints', () => {
    it('GET / should respond with a welcome message', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.text).toBe('WebSocket Server is running');
    });
  });

  // --- ユーティリティ関数のテスト ---
  describe('deleteOldNotes Function', () => {
      // テスト全体で共有する変数を定義
  let app;
  let hoardserver;
  let deleteOldNotes;

  beforeAll(async () => {
    const serverModule = await import("../dist/server.js");
    deleteOldNotes = serverModule.deleteOldNotes;
    const result = await serverModule.startServer();
    hoardserver = result.server;
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

    it('should call delete on repositories for notes older than 7 days', async () => {
      // Date.now()を固定の日付にモックして、テストの再現性を確保
      const mockDate = new Date('2025-01-15T12:00:00Z');
      const dateSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockDate.getTime());

      // テスト対象の関数を実行
      await deleteOldNotes();

      // 1. AppDataSource.getRepositoryが正しいエンティティで呼び出されたか検証
      expect(mockGetRepository).toHaveBeenCalledWith(Note);
      expect(mockGetRepository).toHaveBeenCalledWith(TableNote);

      // 2. 各リポジトリのdeleteメソッドが1回ずつ呼び出されたか検証
      expect(mockRepoNote.delete).toHaveBeenCalledTimes(1);
      expect(mockRepoTableNote.delete).toHaveBeenCalledTimes(1);

      // Date.now()のモックを元に戻す
      dateSpy.mockRestore();
    });

    it('should not throw an error if the database operation fails', async () => {
      // deleteメソッドがエラーを投げるようにモック
      mockRepoNote.delete.mockImplementationOnce(() => Promise.reject(new Error('DB Error')));

      // console.errorをスパイして、エラーがログに出力されることを確認
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

      await deleteOldNotes();

      // エラーがコンソールに出力されたことを確認
      expect(consoleSpy).toHaveBeenCalledWith('Error deleting old notes:', expect.any(Error));

      // スパイを元に戻す
      consoleSpy.mockRestore();
    });
  });

});
