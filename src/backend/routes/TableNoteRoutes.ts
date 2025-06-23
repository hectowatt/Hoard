import { Router } from 'express';
import { AppDataSource } from '../data-source.js';
import TableNoteCell from '../entities/TableNoteCell.js';
import TableNoteColumn from '../entities/TableNoteColumn.js';
import Note from '../entities/Note.js';
import bcrypt from "bcrypt";

const router = Router();

// 【INSERT】テーブルノート登録API
router.post('/', async (req, res) => {
    const { title, columns, rows, label, is_locked} = req.body;

    if (!title && !columns && !rows) {
        return res.status(400).json({ error: "Must set tablenote title, columns, rows" });
    }

    try {
        // Noteテーブルにデータを登録
        const noteRepository = AppDataSource.getRepository(Note);
        const newNote = noteRepository.create({
            title: title,
            content: null, // テーブルノートではcontentは使用しない
            label_id: label || null, // ラベルがない場合はnullを設定
            is_locked: is_locked || false, // ロック状態を設定
            is_table: true, // テーブルノートであることを示す
            createdate: new Date(),
            updatedate: new Date()
        });
        const savedNote = await noteRepository.save(newNote);

        // TODO: columnsとcellの登録

        console.log('Note inserted with ID: ', savedNote.id);
        res.status(201).json({ message: "Save password success!" });
    } catch (error) {
        console.error("Error saving password:", error);
        res.status(500).json({ error: "Failed to save password" });
    }
});

// 【SELECT】テーブルノートid取得API
router.get('/', async (req, res) => {
    const{id} = req.query;
    try {
        const NoteRepository = AppDataSource.getRepository(Note);
        const tableNote = await NoteRepository.findOneBy({id: id})

        if(!tableNote){
            return res.status(404).json({ error: "Table note not found" });
        }
        res.status(200).json(tableNote);
    } catch (error) {
        console.error("Error fetching password:", error);
        res.status(500).json({ error: 'Failed to fetch password' });
    }
});

// 【UPDATE】テーブルノート更新API
router.put('/', async (req, res) => {
    const { id, newTitle, newColumns, newRows, newLabel, is_locked} = req.body;
    try {
        const noteRepository = AppDataSource.getRepository(Note);
        const note = await noteRepository.findOneBy({ id: id });
        if (!note) {
            return res.status(404).json({ error: "note not found" });
        }
        const newNote = noteRepository.create({
            id: id,
            title: newTitle,
            content: null, // テーブルノートではcontentは使用しない
            label_id: newLabel || null, // ラベルがない場合はnullを設定
            is_locked: is_locked || false, // ロック状態を設定
            updatedate: new Date()
        })

        await noteRepository.save(newNote);

        // TODO: columnsとcellの更新
        res.status(200).json({ message: "note updated successfully" });
    } catch (error) {
        console.error("Error update password:", error);
        res.status(500).json({ error: "Failed to update password" });
    }
});

export default router;