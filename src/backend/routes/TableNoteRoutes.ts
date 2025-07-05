import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import TableNoteCell from '../entities/TableNoteCell.js';
import TableNoteColumn from '../entities/TableNoteColumn.js';
import TableNote from '../entities/TableNote.js';
import Note from '../entities/Note.js';
import { EntityManager } from 'typeorm';
import { table } from 'console';

const router = Router();



// 【INSERT】テーブルノート登録API
router.post('/', async (req, res) => {
    const { title, columns, rowCells, label, is_locked } = req.body;

    if (!title && !columns && !rowCells) {
        return res.status(400).json({ error: "Must set tablenote title, columns, rows" });
    }

    try {
        var savedTableNote: TableNote = null;

        await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            // table_noテーブルにデータを登録
            const tableNoteRepository = transactionalEntityManager.getRepository(TableNote);
            const newTableNote = tableNoteRepository.create({
                title: title,
                label_id: label || null, // ラベルがない場合はnullを設定
                is_locked: is_locked || false, // ロック状態を設定
                createdate: new Date(),
                updatedate: new Date()
            });
            savedTableNote = await tableNoteRepository.save(newTableNote);

            // columnの登録
            const columnRepository = transactionalEntityManager.getRepository(TableNoteColumn);
            const columnIdMap: { [key: string]: string } = {};
            for (const col of columns) {
                const newColumn = columnRepository.create(
                    {
                        name: col.name,
                        order: col.order ?? 0,
                        note: savedTableNote
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
                    // クライアントのcolumnIdからDBのcolumnIdに変換
                    const dbColumnId = columnIdMap[cell.columnId];
                    const newCell = cellRepository.create({
                        row_index: rowIndex,
                        value: cell.value,
                        note: savedTableNote,
                        column: { id: dbColumnId },
                    });
                    await cellRepository.save(newCell);
                }
            }

            console.log('TableNote inserted with ID: ', savedTableNote.id);
        });
        res.status(201).json({ message: "Save TableNote success!" , tableNote: savedTableNote});
    } catch (error) {
        console.error("Error saving TableNote:", error);
        res.status(500).json({ error: "Failed to save TableNote" });
    }
});

// 【SELECT】テーブルノート取得API
router.get('/', async (req, res) => {
    try {

        const tableNoteRepository = AppDataSource.getRepository(TableNote);
        const tableNotes = await tableNoteRepository.find({where: {is_deleted: false }, order: { createdate: 'DESC' }});
        if (!tableNotes) {
            return res.status(404).json({ error: "TableNote not found" });
        }

        // 返却するテーブルノートの配列
        let tableNoteArray: { id: string; title: string; is_locked: boolean; createdate: string; updatedate: string; columns: {id:string, name: string, order: number}[]; rowCells: {id: string,rowIndex: number,value: string,columnId?: string}[][] }[] = [];

        // 各テーブルノートのカラムとセルを取得
        for(var i=0; i< tableNotes.length; i++) {
            const tableNote = tableNotes[i];
            const columnRepository = AppDataSource.getRepository(TableNoteColumn);
            const cellRepository = AppDataSource.getRepository(TableNoteCell);
            const columns = await columnRepository.find({ where: { note: { id: tableNote.id } }, order: { order: 'ASC' } });
            const rowCells = await cellRepository.find({ where: { note: { id: tableNote.id } }, order: { row_index: 'ASC' } });
            // rowCellsをrow_indexごとにグループ化して2次元配列に変換
            const groupedRowCells: { id: string; rowIndex: number; value: string; columnId?: string }[][] = [];
            rowCells.forEach(cell => {
                const rowIdx = cell.row_index;
                if (!groupedRowCells[rowIdx]) groupedRowCells[rowIdx] = [];
                groupedRowCells[rowIdx].push({
                    id: cell.id,
                    rowIndex: cell.row_index,
                    value: cell.value,
                    columnId: cell.column ? cell.column.id : undefined
                });
            });
            tableNoteArray.push({
                id: tableNote.id,
                title: tableNote.title,
                is_locked: tableNote.is_locked,
                createdate: tableNote.createdate.toISOString(),
                updatedate: tableNote.updatedate.toISOString(),
                columns: columns.map(col => ({ id: col.id, name: col.name, order: col.order })),
                rowCells: groupedRowCells
            });
        }
        res.status(200).json(tableNoteArray);
    } catch (error) {
        console.error("Error fetching TableNote:", error);
        res.status(500).json({ error: 'Failed to fetch TableNote' });
    }
});
// 【UPDATE】テーブルノート更新API
router.put('/', async (req, res) => {
    const { id, newTitle, newColumns, newRows, newLabel, is_locked } = req.body;
    try {
        const tableNoteRepository = AppDataSource.getRepository(TableNote);
        const note = await tableNoteRepository.findOneBy({ id: id });
        if (!note) {
            return res.status(404).json({ error: "note not found" });
        }
        const newTableNote = tableNoteRepository.create({
            id: id,
            title: newTitle,
            label_id: newLabel || null, // ラベルがない場合はnullを設定
            is_locked: is_locked || false, // ロック状態を設定
            updatedate: new Date()
        })

        await tableNoteRepository.save(newTableNote);

        // TODO: columnsとcellの更新
        res.status(200).json({ message: "note updated successfully" });
    } catch (error) {
        console.error("Error update TableNote:", error);
        res.status(500).json({ error: "Failed to update TableNote" });
    }
});

// 【DELETE】Notes削除用API
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const tableNote = await tableNoteRepository.findOneBy({ id: id });
    if (!tableNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    tableNote.is_deleted = true; // 論理削除のためフラグを立てる
    tableNote.deletedate = new Date(); // 削除日時を設定
    await tableNoteRepository.save(tableNote);
    res.status(200).json({ message: "TableNote moved to trash successfully" });
  } catch (error) {
    console.error("Error deleting TableNote:", error);
    res.status(500).json({ error: "Failed moved to trash" });
  }
});

/************ TrashNote ************/

// 【SELECT】TrashNote取得API
router.get('/trash', async (req, res) => {
  try {
    const noteRepository = AppDataSource.getRepository(TableNote);
    const notes = await noteRepository.find({ where: { is_deleted: true }, order: { deletedate: 'DESC' } });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching trash TableNotes:", error);
    res.status(500).json({ error: 'Failed to fetch trash TableNotes' });
  }
});

// 【DELETE】TrashNote削除用API
router.delete('/trash/:id', async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const noteRepository = AppDataSource.getRepository(TableNote);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "TableNotes not found" });
    }
    await noteRepository.remove(note);
    res.status(200).json({ message: "TableNote deleted successfully" });
  } catch (error) {
    console.error("Error deleting TableNote:", error);
    res.status(500).json({ error: "Failed to delete TableNote" });
  }
});

// 【UPDATE】TableNote復元用API
router.put('/trash', async (req, res) => {
  const { id } = req.body;

  try {
    const noteRepository = AppDataSource.getRepository(TableNote);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Can't find TableNote" });
    }
    note.is_deleted = false; // 論理削除フラグを解除
    note.deletedate = null; // 削除日時をnullに設定
    const restoredNote = await noteRepository.save(note);
    console.log('Note restored: ', restoredNote.updatedate);
    res.status(200).json({ message: "Restore TableNote success!", note: restoredNote });
  } catch (error) {
    console.error("Error restoring TableNote", error);
    res.status(500).json({ error: "Failed to restore TableNotea" });
  }
});


// 【UPDATE】TableNoteロック状態更新用API
router.put('/lock', async (req, res) => {
  const { id, isLocked } = req.body;
  try {
    const noteRepository = AppDataSource.getRepository(TableNote);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Can't find TableNote" });
    }
    note.is_locked = isLocked; // ロック状態を更新
    const updatedNote = await noteRepository.save(note);
    console.log('Note lock state updated: ', updatedNote.is_locked);
    res.status(200).json({ message: "Update lock state success!", note: updatedNote });
  } catch (error) {
    console.error("Error updating lock state", error);
    res.status(500).json({ error: "Failed to update lock state" });
  }
});

export default router;