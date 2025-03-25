require('dotenv').config();
const express = require('express');
const WebSocket = require('ws');
const Pool = require('pg').Pool;
const Server = WebSocket.Server;

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

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

const wss = new Server({ server });

wss.on('connection', (ws) => {
  console.log('Client connected');
  
  ws.on('message', async (message) => {
    const messageText = message.toString();
    console.log(`Received: ${message}`);
    // PostgreSQLに接続してクエリを実行
    try{
      console.log('クエリを組み立てる前');
      console.log('PG_HOST:', process.env.PG_HOST);
      console.log('PG_PORT:', process.env.PG_PORT);
      console.log('PG_USER:', process.env.PG_USER);
      console.log('PG_PASSWORD:', process.env.PG_PASSWORD);
      console.log('PG_DATABASE:', process.env.PG_DATABASE);
      const query = 'INSERT INTO hoard.MESSAGE(NAME) VALUES ($1) RETURNING ID';
      const values = [messageText];
      console.log('Query values:',values);
      const result = await pool.query(query, values);
      console.log('Message inserted with ID: ', result.rows[0].id);

    }catch(error){
      console.error("Error executing query:", error);
      ws.send("Error executing query");
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
