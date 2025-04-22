"use client";

import React, { useState } from "react";

import {
    Box,
    TextField,
    Paper,
    Button,
    Collapse,
    Grid,
    Typography,
} from '@mui/material';
import { Content } from "next/font/google";

export default function Note() {

    const [expanded, setExpand] = useState(false);
    const [title, setTitle] = useState("");
    const [inputContent, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState<{ title: String, content: String }[]>([]);

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const handleExpand = () => { setExpand(true) };
    const handleCollapse = () => {
        setExpand(false);
        setTitle("");
        setContent("");
    }

    const handleFormClick = () => {
        setIsEditing(true); // フォームがクリックされたときに編集モードにする 
    }

    const handleButtonClick = () => {
        if (!socket) {
            // WebSocketサーバに接続
            const newSocket = new WebSocket("ws://localhost:4000");
            newSocket.onopen = () => {
                console.log("Connected to server");
                //console.log("inputValue: ", inputValue);
                //newSocket.send(inputValue);
            }
            setSocket(newSocket);
            newSocket.onmessage = (event) => {
                console.log("message from server: ", event.data);
            }
            newSocket.onerror = (error) => {
                console.error("WebSocket Error: ", error);
            }
            newSocket.onclose = () => {
                console.log("WebSocket closed");
            }
        } else {
            // 既存の接続を使用してデータ送信
            //socket.send(inputValue);
        }

        setIsEditing(false); // 送信後に編集モードを解除
    }



    return (
        <Paper elevation={3}
            sx={{
                p: 2,
                width: '100%',
                maxWidth: 600,
                margin: 'auto',
                mt: 4,
                cursor: 'text',
            }}
            onClick={handleExpand}>
            <Collapse in={expanded}>
                <TextField
                    placeholder="タイトル"
                    fullWidth
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    sx={{ mb: 1 }}
                />
            </Collapse>
            <TextField
                placeholder="メモを入力..."
                fullWidth
                multiline
                minRows={expanded ? 5 : 1}
                variant="standard"
                value={inputContent}
                onChange={(e) => setContent(e.target.value)}
            />
            <Collapse in={expanded}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                    <Button onClick={handleButtonClick}>保存</Button>
                    <Button onClick={handleCollapse}>キャンセル</Button>
                </Box>
            </Collapse>
        </Paper>
    )
}