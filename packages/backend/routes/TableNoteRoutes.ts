import { Router } from 'express';
import { AppDataSource } from '../DataSource.js';
import TableNoteCell from '../entities/TableNoteCell.js';
import TableNoteColumn from '../entities/TableNoteColumn.js';
import TableNote from '../entities/TableNote.js';
import { authMiddleware } from '../middleware/AuthMiddleware.js';
import { EntityManager } from 'typeorm';

const router = Router();



// 【INSERT】テーブルノート登録API
router.post('/',authMiddleware, async (req, res) => {
    const { title, columns, rowCells, label_id, is_locked } = req.body;

    if (!title || !columns || !rowCells) {
        return res.status(400).json({ error: "Must set tablenote title, columns, rows" });
    }

    try {
        var savedTableNote: TableNote = null;

        await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            // table_noteテーブルにデータを登録
            const tableNoteRepository = transactionalEntityManager.getRepository(TableNote);
            const newTableNote = tableNoteRepository.create({
                title: title,
                label_id: label_id || null, // ラベルがない場合はnullを設定
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
                        tableNote: savedTableNote
                    }
                );

                const savedColumn = await columnRepository.save(newColumn);
                columnIdMap[col.id] = savedColumn.id; // カラム名とIDのマッピングを作成
            }

            // rowCellの登録
            const cellRepository = transactionalEntityManager.getRepository(TableNoteCell);
            for (let rowIdx = 0; rowIdx < rowCells.length; rowIdx++) {
                const row = rowCells[rowIdx];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const cell = row[colIndex];
                    // クライアントのcolumnIdからDBのcolumnIdに変換
                    const dbColumnId = columnIdMap[cell.columnId];
                    const newCell = cellRepository.create({
                        row_index: cell.rowIndex,
                        value: cell.value,
                        tableNote: savedTableNote,
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
router.get('/', authMiddleware, async (req, res) => {
    try {
        const tableNoteRepository = AppDataSource.getRepository(TableNote);
        const tableNotes = await tableNoteRepository.find({ where: { is_deleted: false }, order: { updatedate: 'DESC' } });
        if (!tableNotes) {
            return res.status(404).json({ error: "TableNote not found" });
        }

        // 返却するテーブルノートの配列
        let tableNoteArray: { id: string; title: string; label_id: string; is_locked: boolean; createdate: string; updatedate: string; columns: { id: string, name: string, order: number }[]; rowCells: { id: string, rowIndex: number, value: string, columnId?: string }[][] }[] = [];

        // 各テーブルノートのカラムとセルを取得
        for (var i = 0; i < tableNotes.length; i++) {
            const tableNote = tableNotes[i];
            const columnRepository = AppDataSource.getRepository(TableNoteColumn);
            const cellRepository = AppDataSource.getRepository(TableNoteCell);
            const columns = await columnRepository.find({ where: { tableNote: { id: tableNote.id } }, order: { order: 'ASC' } });
            const rowCells = await cellRepository.find({ where: { tableNote: { id: tableNote.id } }, relations: ['column'], order: { row_index: 'ASC' } });
            
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
                label_id: tableNote.label_id,
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
router.put('/', authMiddleware,async (req, res) => {
    const { id, title, columns, rowCells, label_id, is_locked } = req.body;
    try {
        await AppDataSource.transaction(async (transactionalEntityManager: EntityManager) => {
            const tableNoteRepository = transactionalEntityManager.getRepository(TableNote);
            const columnRepository = transactionalEntityManager.getRepository(TableNoteColumn);
            const cellRepository = transactionalEntityManager.getRepository(TableNoteCell);

            const tableNote = await tableNoteRepository.findOneBy({ id: id });
            if (!tableNote) {
                return res.status(404).json({ error: "tablenote not found" });
            }

            // ノート情報更新
            tableNote.title = title;
            tableNote.label_id = label_id || null;
            tableNote.is_locked = is_locked || false;
            tableNote.updatedate = new Date();
            await tableNoteRepository.save(tableNote);

            // --- カラムの更新 ---
            // 既存カラム取得
            const dbColumns = await columnRepository.find({ where: { tableNote: { id: tableNote.id } }, order: { order: 'ASC' } });
            // 既存カラムIDセット
            const dbColumnIds = dbColumns.map(col => col.id);
            // 新カラムIDセット（新規はidがない場合もあるので注意）
            const newColumnIds = columns.map(col => col.id).filter(Boolean);

            // 削除対象カラム
            const columnsToDelete = dbColumns.filter(col => !newColumnIds.includes(col.id));
            // 追加・更新対象カラム
            const columnsToUpsert = columns;

            // カラム削除
            for (const col of columnsToDelete) {
                await columnRepository.delete(col.id);
            }

            // カラム追加・更新
            const columnIdMap: { [key: string]: string } = {};
            for (const col of columnsToUpsert) {
                let savedColumn;
                if (col.id && dbColumnIds.includes(col.id)) {
                    // 既存カラムは更新
                    const existCol = await columnRepository.findOneBy({id: col.id});
                    if(existCol){
                      existCol.name = col.name;
                      existCol.order = col.order ?? 0;
                      savedColumn = await columnRepository.save(existCol);
                    }
                } else {
                    // 新規カラムは追加
                    const newCol = columnRepository.create({
                        name: col.name,
                        order: col.order ?? 0,
                        tableNote: tableNote
                    });
                    savedColumn = await columnRepository.save(newCol);
                }
                columnIdMap[col.id] = savedColumn.id;
            }

            // --- セルの更新 ---
            // 既存セル取得
            const dbCells = await cellRepository.find({ where: { tableNote: { id: tableNote.id } } });
            const dbCellIds = dbCells.map(cell => cell.id);

            // 新セルを1次元配列化
            const flatNewCells = rowCells.flat();

            // 削除対象セル
            const newCellIds = flatNewCells.map(cell => cell.id).filter(Boolean);
            const cellsToDelete = dbCells.filter(cell => !newCellIds.includes(cell.id));
            for (const cell of cellsToDelete) {
                await cellRepository.delete(cell.id);
            }

            // 追加・更新対象セル
            for (let rowIndex = 0; rowIndex < rowCells.length; rowIndex++) {
                const row = rowCells[rowIndex];
                for (let colIndex = 0; colIndex < row.length; colIndex++) {
                    const cell = row[colIndex];
                    // columnIdのマッピング
                    const dbColumnId = columnIdMap[cell.columnId] || cell.columnId;
                    if (cell.id && dbCellIds.includes(cell.id)) {
                        // 既存セルは更新
                      const existCell = await cellRepository.findOneBy({id: cell.id});
                      if(existCell){
                        existCell.row_index = rowIndex;
                        existCell.value = cell.value;
                        existCell.tableNote = tableNote;
                        const columnEntity = await columnRepository.findOneBy({ id: dbColumnId });
                        existCell.column = columnEntity;
                        await cellRepository.save(existCell);
                      }
                    } else {
                        // 新規セルは追加
                        const newCell = cellRepository.create({
                            row_index: rowIndex,
                            value: cell.value,
                            tableNote: tableNote,
                            column: { id: dbColumnId }
                        });
                        await cellRepository.save(newCell);
                    }
                }
            }

            // レスポンス用データ再取得
            const updatedColumns = await columnRepository.find({ where: { tableNote: { id: tableNote.id } }, order: { order: 'ASC' } });
            const updatedRowCells = await cellRepository.find({ where: { tableNote: { id: tableNote.id } }, order: { row_index: 'ASC' } });
            const groupedRowCells: { id: string; rowIndex: number; value: string; columnId?: string }[][] = [];
            updatedRowCells.forEach(cell => {
                const rowIdx = cell.row_index;
                if (!groupedRowCells[rowIdx]) groupedRowCells[rowIdx] = [];
                groupedRowCells[rowIdx].push({
                    id: cell.id,
                    rowIndex: cell.row_index,
                    value: cell.value,
                    columnId: cell.column ? cell.column.id : undefined
                });
            });

            res.status(200).json({
                message: "Save TableNote success!",
                tableNote: {
                    id: tableNote.id,
                    title: tableNote.title,
                    is_locked: tableNote.is_locked,
                    createdate: tableNote.createdate.toISOString(),
                    updatedate: tableNote.updatedate.toISOString(),
                    columns: updatedColumns.map(col => ({ id: col.id, name: col.name, order: col.order })),
                    rowCells: groupedRowCells
                }
            });
        });
    } catch (error) {
        console.error("Error update TableNote:", error);
        res.status(500).json({ error: "Failed to update TableNote" });
    }
});

// 【DELETE】Notes削除用API
router.delete('/:id',authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const tableNote = await tableNoteRepository.findOneBy({ id: id });
    if (!tableNote) {
      return res.status(404).json({ error: "tablenote not found" });
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
router.get('/trash',authMiddleware, async (req, res) => {
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
router.delete('/trash/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const tableNote = await tableNoteRepository.findOneBy({ id: id });
    if (!tableNote) {
      return res.status(404).json({ error: "TableNotes not found" });
    }
    await tableNoteRepository.remove(tableNote);
    res.status(200).json({ message: "TableNote deleted successfully" });
  } catch (error) {
    console.error("Error deleting TableNote:", error);
    res.status(500).json({ error: "Failed to delete TableNote" });
  }
});

// 【UPDATE】TableNote復元用API
router.put('/trash', authMiddleware, async (req, res) => {
  const { id } = req.body;

  try {
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const tableNote = await tableNoteRepository.findOneBy({ id: id });
    if (!tableNote) {
      return res.status(404).json({ error: "Can't find TableNote" });
    }
    tableNote.is_deleted = false; // 論理削除フラグを解除
    tableNote.deletedate = null; // 削除日時をnullに設定
    const restoredNote = await tableNoteRepository.save(tableNote);
    console.log('Note restored: ', restoredNote.updatedate);
    res.status(200).json({ message: "Restore TableNote success!", tablenote: restoredNote });
  } catch (error) {
    console.error("Error restoring TableNote", error);
    res.status(500).json({ error: "Failed to restore TableNote" });
  }
});


// 【UPDATE】TableNoteロック状態更新用API
router.put('/lock', authMiddleware, async (req, res) => {
  const { id, isLocked } = req.body;
  try {
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const tableNote = await tableNoteRepository.findOneBy({ id: id });
    if (!tableNote) {
      return res.status(404).json({ error: "Can't find TableNote" });
    }
    tableNote.is_locked = isLocked; // ロック状態を更新
    const updatedNote = await tableNoteRepository.save(tableNote);
    console.log('Note lock state updated: ', updatedNote.is_locked);
    res.status(200).json({ message: "Update lock state success!", tablenote: updatedNote });
  } catch (error) {
    console.error("Error updating lock state", error);
    res.status(500).json({ error: "Failed to update lock state" });
  }
});

export default router;