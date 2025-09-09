import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { WebSocketServer } from 'ws';
import pg from 'pg';
import { AppDataSource } from './DataSource.js';
import loginRoutets from './routes/LoginRoutes.js';
import logoutRoutets from './routes/LogoutRoutes.js';
import hoardUserRoutes from './routes/HoardUserRoutes.js';
import noteRoutes from './routes/NoteRoutes.js';
import labelRoutes from './routes/LabelRoutes.js';
import passwordRoutes from './routes/PasswordRoutes.js';
import tableNoteRoutes from './routes/TableNoteRoutes.js';
import { LessThan } from 'typeorm';
import Note from './entities/Note.js';
import cookieParser from 'cookie-parser';
import TableNote from './entities/TableNote.js';
const { Pool } = pg;
export const app = express();
const port = 4000;
// JSONボディのパースを有効にする
app.use(express.json());
app.use(cors({
    origin: [
        'http://192.168.1.100:3500',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    Credential: true
}));
app.use(cookieParser());
// PostgreSQL接続設定
const pool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: process.env.PG_PORT || 5432,
    user: process.env.PG_USER || 'postgres',
    password: process.env.PG_PASSWORD || 'password',
    database: process.env.PG_DATABASE || 'mydatabase',
});
export const hoardserver = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
const wss = new WebSocketServer({ server: hoardserver });
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
app.use('/api/login', loginRoutets);
app.use('/api/logout', logoutRoutets);
app.use('/api/user', hoardUserRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/labels', labelRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/tablenotes', tableNoteRoutes);
// 定期的に古いノートを削除する関数（７日経過したら削除）
async function deleteOldNotes() {
    const noteRepository = AppDataSource.getRepository(Note);
    const tableNoteRepository = AppDataSource.getRepository(TableNote);
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    await noteRepository.delete({
        is_deleted: true,
        deletedate: LessThan(sevenDaysAgo)
    });
    await tableNoteRepository.delete({
        is_deleted: true,
        deletedate: LessThan(sevenDaysAgo)
    });
    console.log('Old notes deleted successfully');
}
// サーバー起動時に定期実行
if (process.env.NODE_ENV !== 'test') {
    setInterval(deleteOldNotes, 60 * 60 * 1000);
}
//# sourceMappingURL=server.js.map