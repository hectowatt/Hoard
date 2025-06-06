import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import pg from 'pg';
import { AppDataSource } from './data-source.js';
import Notes from './entities/Note.js';
import Label from './entities/Label.js';

const { Pool } = pg;
const app = express();
const port = 4000;

// JSONボディのパースを有効にする
app.use(express.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'mydatabase',
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

// WebSocket接続時の処理
wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// TypeORMの初期化
AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization", err);
});

// ルートにアクセスされたときの処理
app.get('/', (req, res) => {
  res.send('WebSocket Server is running');
});

// 【SELECT】Notes全件取得API
app.get('/api/notes', async (req, res) => {
  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    // Notesを全件取得する
    const notes = await noteRepository.find();
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// 【INSERT】Notes登録API
app.post('/api/notes', async (req, res) => {
  const { title, content, label } = req.body;

  console.log("insert label:", label);
  if (!title || !content) {
    return res.status(400).json({ error: "must set title and content" });
  }

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const newNote = noteRepository.create({
      title: title,
      content: content,
      label: label || null, // ラベルがない場合はnullを設定
      createdate: new Date(),
      updatedate: new Date(),
    });
    const savedNote = await noteRepository.save(newNote);

    console.log('Message inserted with ID: ', savedNote.id);
    res.status(201).json({ message: "save note success!", note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "failed to save note" });
  }
});

// 【UPDATE】Notes更新用API
app.put('/api/notes', async (req, res) => {
  const { id, title, content, label } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "must set title and content" });
  }

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const note = await noteRepository.findOneBy({ id: id });
    if (!note) {
      return res.status(404).json({ error: "can't find note" });
    }
    note.content = content;
    note.title = title;
    console.log("update label:", label);
    note.label = label;
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
app.delete('/api/notes/:id', async (req, res) => {
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

// 【INSERT】ラベル登録API
app.post('/api/labels', async (req, res) => {
  const { labelName } = req.body;

  if (!labelName) {
    return res.status(400).json({ error: "must set labelname" });
  }

  try {
    const labelRepository = AppDataSource.getRepository(Label);
    const newLabel = labelRepository.create({
      labelname: labelName,
      createdate: new Date()
    });
    const savedLabel = await labelRepository.save(newLabel);

    console.log('Label inserted with ID: ', savedLabel.id);
    res.status(201).json({ message: "save label success!", label: savedLabel });
  } catch (error) {
    console.error("Error saving label:", error);
    res.status(500).json({ error: "failed to save label" });
  }
});

// 【SELECT】label全件取得API
app.get('/api/labels', async (req, res) => {
  try {
    const labelRepository = AppDataSource.getRepository(Label);
    // Notesを全件取得する
    const labels = await labelRepository.find();
    res.status(200).json(labels);
  } catch (error) {
    console.error("Error fetching labels:", error);
    res.status(500).json({ error: 'Failed to fetch labels' });
  }
});

// 【DELETE】ラベル削除API
app.delete('/api/labels/:id', async (req, res) => {
  const { id } = req.params;
  console.log("delete label id: ", id);
  try {
    const labelRepository = AppDataSource.getRepository(Label);
    const label = await labelRepository.findOneBy({ id: id });
    if (!label) {
      return res.status(404).json({ error: "Label not found" });
    }
    await labelRepository.remove(label);
    res.status(200).json({ message: "Label deleted successfully" });
  } catch (error) {
    console.error("Error deleting label:", error);
    res.status(500).json({ error: "Failed to delete label" });
  }
}
);