import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import pg from 'pg';
import { AppDataSource } from './data-source.js';
import noteRoutes from './routes/NoteRoutes.js';
import labelRoutes from './routes/LabelRoutes.js';
import passwordRoutes from './routes/PasswordRoutes.js';
import { LessThan } from 'typeorm';
import Note from './entities/Note.js';

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

app.use('/api/notes', noteRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/password', passwordRoutes);


// 定期的に古いノートを削除する関数（７日経過したら削除）
async function deleteOldNotes() {
  const noteRepository = AppDataSource.getRepository(Note);
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  await noteRepository.delete({
    is_deleted: true,
    deletedate: LessThan(sevenDaysAgo)
  });
}

// サーバー起動時に定期実行（例: 1時間ごと）
setInterval(deleteOldNotes, 60 * 60 * 1000);