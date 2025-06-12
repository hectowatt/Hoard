import { Router } from 'express';
import { AppDataSource } from '../data-source.js';
import Notes from '../entities/Note.js';

const router = Router();

// 【SELECT】Notes全件取得API
router.get('/', async (req, res) => {
  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    // Notesを全件取得する
    const notes = await noteRepository.find({ where: { is_deleted: false }, order: { createdate: 'DESC' } });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 【INSERT】Notes登録API
router.post('/', async (req, res) => {
  const { title, content, label } = req.body;

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const newNote = noteRepository.create({
      title: title,
      content: content,
      label_id: label || null, // ラベルがない場合はnullを設定
      createdate: new Date(),
      updatedate: new Date(),
    });
    const savedNote = await noteRepository.save(newNote);

    console.log('Message inserted with ID: ', savedNote.id);
    res.status(201).json({ message: "save note success!", note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "Failed to save note" });
  }
});

// 【UPDATE】Notes更新用API
router.put('/', async (req, res) => {
  const { id, title, content, label } = req.body;

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Can't find note" });
    }
    note.content = content;
    note.title = title;
    note.label_id = label;
    note.updatedate = new Date();
    const updatedNote = await noteRepository.save(note);
    console.log('updated: ', updatedNote.updatedate);
    res.status(200).json({ message: "update note success!", note: updatedNote });
  } catch (error) {
    console.error("Error updating note", error);
    res.status(500).json({ error: "failed to update notes" });
  }
});

// 【DELETE】Notes削除用API
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    note.is_deleted = true; // 論理削除のためフラグを立てる
    note.deletedate = new Date(); // 削除日時を設定
    await noteRepository.save(note);
    res.status(200).json({ message: "Note moved to trash successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed moved to trash" });
  }
});


/************ TrashNote ************/

// 【SELECT】TrashNote取得API
router.get('/trash', async (req, res) => {
  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const notes = await noteRepository.find({ where: { is_deleted: true }, order: { deletedate: 'DESC' } });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching trash notes:", error);
    res.status(500).json({ error: 'Failed to fetch trash notes' });
  }
});

// 【DELETE】TrashNote削除用API
router.delete('/trash/:id', async (req, res) => {
  const { id } = req.params;
  console.log("delete id: ", id);
  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    await noteRepository.remove(note);
    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).json({ error: "Failed to delete note" });
  }
});

// 【UPDATE】Notes復元用API
router.put('/trash', async (req, res) => {
  const { id } = req.body;

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "Can't find note" });
    }
    note.is_deleted = false; // 論理削除フラグを解除
    note.deletedate = null; // 削除日時をnullに設定
    const restoredNote = await noteRepository.save(note);
    console.log('Note restored: ', restoredNote.updatedate);
    res.status(200).json({ message: "Restore note success!", note: restoredNote });
  } catch (error) {
    console.error("Error restoring note", error);
    res.status(500).json({ error: "Failed to restore notes" });
  }
});

export default router;