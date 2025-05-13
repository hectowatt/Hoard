"use client";

import React, { useState } from "react";

import {
    Box,
    TextField,
    Paper,
    Button,
    Collapse,
} from '@mui/material';

export default function InputForm() {

    const [expanded, setExpand] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleExpand = () => { setExpand(true) };
    const handleCollapse = () => {
        setExpand(false);
        setTitle("");
        setContent("");
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

            setTitle("");
            setContent("");
            setExpand(false);
        } catch (error) {
            console.error("Error saving note:", error);
        }

        setIsEditing(false);
    }

    // フォーカスが外れた場合
    const handleBlur = () => {
        blurTimeoutRef.current = setTimeout(() => {
            setIsFocused(false);
        }, 200);
    };

    // フォーカス時処理
    const handleFocus = () => {
        setIsFocused(true);
        if (blurTimeoutRef.current) {
            clearTimeout(blurTimeoutRef.current);
        }
    }

    React.useEffect(() => {
        if (!isFocused) {
            setExpand(false);
        }
    }, [isFocused]);


    return (
        <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 2 }}
            onBlur={handleBlur}
            onFocus={handleFocus}
            tabIndex={-1}>
            {/* 入力フォーム */}
            < Paper
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
            </Paper >
        </Box >
    );
};