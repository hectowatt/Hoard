import { Router } from 'express';
import { AppDataSource } from '../data-source.js';
import TableNoteCell from '../entities/TableNoteCell.js';
import TableNoteColumn from '../entities/TableNoteColumn.js';
import Note from '../entities/Note.js';
import bcrypt from "bcrypt";
import { table } from 'console';
import { EntityManager } from 'typeorm';

const router = Router();

// 【INSERT】テーブルノート登録API
router.post('/', async (req, res) => {
    const { title, columns, rowCells, label, is_locked } = req.body;

    if (!title && !columns && !rowCells) {
        return res.status(400).json({ error: "Must set tablenote title, columns, rows" });
    }

    try {
        // TODO: noteテーブルと各TableNote用テーブルにすべてinsertができてからcommitにしたい
        await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            // Noteテーブルにデータを登録
            const noteRepository = transactionalEntityManager.getRepository(Note);
            const newNote = noteRepository.create({
                title: title,
                content: "", // テーブルノートではcontentは使用しない
                label_id: label || null, // ラベルがない場合はnullを設定
                is_locked: is_locked || false, // ロック状態を設定
                is_table: true, // テーブルノートであることを示す
                createdate: new Date(),
                updatedate: new Date()
            });
            const savedNote = await noteRepository.save(newNote);

            // columnの登録
            const columnRepository = transactionalEntityManager.getRepository(TableNoteColumn);
            const columnIdMap: { [key: string]: string } = {};
            for (const col of columns) {
                const { id, ...colData } = col; // idを除外
                const newColumn = columnRepository.create(
                    {
                        name: col.name,
                        order: col.order ?? 0,
                        note: savedNote
                    }
                );

                const savedColumn = await columnRepository.save(newColumn);
                columnIdMap[col.id] = savedColumn.id; // カラム名とIDのマッピングを作成
            }

            // rowCellの登録
            const cellRepository = transactionalEntityManager.getRepository(TableNoteCell);
            for (let rowIndex = 0; rowIndex < rowCells.length; rowIndex++) {
                const row = rowCells[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const cell = row[colIndex];
                    const { id, ...cellData } = cell; // idを除外
                    // クライアントのcolumnIdからDBのcolumnIdに変換
                    const dbColumnId = columnIdMap[cell.columnId];
                    const newCell = cellRepository.create({
                        row_index: rowIndex,
                        value: cell.value,
                        note: savedNote,
                        column: { id: dbColumnId },
                    });
                    await cellRepository.save(newCell);
                }
            }

            console.log('TableNote inserted with ID: ', savedNote.id);
        });
        res.status(201).json({ message: "Save TableNote success!" });
    } catch (error) {
        console.error("Error saving TableNote:", error);
        res.status(500).json({ error: "Failed to save TableNote" });
    }
});

// 【SELECT】テーブルノートid取得API
router.get('/', async (req, res) => {
    const { id } = req.query;
    try {
        const NoteRepository = AppDataSource.getRepository(Note);
        const tableNote = await NoteRepository.findOneBy({ id: id })

        if (!tableNote) {
            return res.status(404).json({ error: "Table note not found" });
        }
        res.status(200).json(tableNote);
    } catch (error) {
        console.error("Error fetching TableNote:", error);
        res.status(500).json({ error: 'Failed to fetch TableNote' });
    }
});

// 【UPDATE】テーブルノート更新API
router.put('/', async (req, res) => {
    const { id, newTitle, newColumns, newRows, newLabel, is_locked } = req.body;
    try {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOneBy({ id: id });
        if (!note) {
            return res.status(404).json({ error: "note not found" });
        }
        const newNote = noteRepository.create({
            id: id,
            title: newTitle,
            content: "", // テーブルノートではcontentは使用しない
            label_id: newLabel || null, // ラベルがない場合はnullを設定
            is_locked: is_locked || false, // ロック状態を設定
            updatedate: new Date()
        })

        await noteRepository.save(newNote);

        // TODO: columnsとcellの更新
        res.status(200).json({ message: "note updated successfully" });
    } catch (error) {
        console.error("Error update TableNote:", error);
        res.status(500).json({ error: "Failed to update TableNote" });
    }
});

export default router;