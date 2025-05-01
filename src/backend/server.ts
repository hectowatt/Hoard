import 'dotenv/config';
import express from 'express';
import { WebSocketServer} from 'ws';
import pg from 'pg';
import { AppDataSource } from './data-source.js';
import Notes from './entities/Notes.js';

const { Pool } = pg;
const app = express();
const port = 4000;

// JSONボディのパースを有効にする
app.use(express.json());

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'mydatabase',
})

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
})

// ルートにアクセスされたときの処理
app.get('/', (req, res) => {
  res.send('WebSocket Server is running');
});

// Notes全件取得API
app.get('/api/notes', async (req, res) => {
  try{
    const noteRepository = AppDataSource.getRepository(Notes);
    // Notesを全件取得する
    const notes = await noteRepository.find();
    res.status(200).json(notes);
  }catch(error){
    console.error("Error fetching notes:", error);
    res.status(500).json({ error: 'Failed to fetch notes'});
  }
})

// Notes登録API
app.post('/api/notes', async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ error: "タイトルと内容は必須です" });
  }

  try {
    const noteRepository = AppDataSource.getRepository(Notes);
    const newNote = noteRepository.create({
      title: title,
      content: content,
      createdate: new Date(),
      updatedate: new Date(),
    });
    const savedNote = await noteRepository.save(newNote);

    console.log('Message inserted with ID: ', savedNote.id);
    res.status(201).json({ message: "メモが保存されました", note: savedNote });
  } catch (error) {
    console.error("Error saving note:", error);
    res.status(500).json({ error: "メモの保存に失敗しました" });
  }
})
