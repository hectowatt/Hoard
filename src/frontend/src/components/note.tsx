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
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState<{ title: String, content: String, createDate: String, updateDate: String }[]>([]);

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

    // 画面表示時や保存ボタン押下時にメモを取得
    const fetchNotes = async () => {
        const response = await fetch("http://localhost:4000/api/notes",
            {
                method: "GET",
                headers: {
                    "content-type": "application/json",
                }
            }
        );

        if (!response.ok) {
            console.error("Get notes failed");
            return;
        }

        const data = await response.json();
        setNotes(data);
    }

    // 保存ボタン押下処理
    const saveButtonClick = async () => {
        if (!title.trim() || !content.trim()) {
            console.log("タイトルと内容は必須です");
            return
        }

        try {
            const response = await fetch("http://localhost:4000/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save note");
            }

            const result = await response.json();
            console.log("Save success!", result);

            setNotes((prevNotes) => [...prevNotes, result.note]);
            setTitle("");
            setContent("");
            setExpand(false);
        } catch (error) {
            console.error("Error saving note:", error);
        }

        setIsEditing(false);
    }


    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}>
            {/* 入力フォーム */}
            <Paper
                elevation={3}
                sx={{ p: 2, cursor: 'text', mb: 4 }}
                onClick={handleExpand}
            >
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
                    minRows={expanded ? 3 : 1}
                    variant="standard"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Collapse in={expanded}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
                        <Button onClick={saveButtonClick} sx={{ color: "#696969" }}>保存</Button>
                        <Button onClick={handleCollapse} sx={{ color: "#696969" }}>キャンセル</Button>
                    </Box>
                </Collapse>
            </Paper>

            {/* メモ一覧表示 */}
            <Grid container spacing={2}>
                {notes.map((note, index) => (
                    <Grid>
                        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                            {note.title && (
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {note.title}
                                </Typography>
                            )}
                            <Typography variant="body1" whiteSpace="pre-line">
                                {note.content}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};