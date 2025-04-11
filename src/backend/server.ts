import 'dotenv/config';
import express from 'express';
import { WebSocketServer} from 'ws';
import pg from 'pg';
import { AppDataSource } from './data-source.js';
import Notes from './entities/Notes.js';

const { Pool } = pg;
const app = express();
const port = 4000;

// PostgreSQL接続設定
const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'password',
  database: process.env.PG_DATABASE || 'mydatabase',
})

AppDataSource.initialize().then(() => {
  console.log("Data Source has been initialized!");
}).catch((err) => {
  console.error("Error during Data Source initialization", err);
})

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', async (message) => {
    const messageText:string = message.toString();
    console.log(`Received: ${message}`);
    // PostgreSQLに接続してクエリを実行
    try{
      const noteRepository = AppDataSource.getRepository(Notes);
      const newNote = noteRepository.create({ 
        title: messageText,
        content: messageText,
        createdate: new Date(),
        updatedate: new Date()});
      const savedNote = await noteRepository.save(newNote);
      
      console.log('Message inserted with ID: ', savedNote.id);
      ws.send('Message inserted successfully. ID: ${savedNote.id}');
    }catch(error){
      console.error("Error executing query:", error);
      ws.send("Error saving message to database");
    }

    ws.send(`Echo: ${message}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

app.get('/', (req, res) => {
  res.send('WebSocket Server is running');
});
