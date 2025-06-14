"use client";

import React, { useEffect, useState } from "react";

import {
    Box,
    TextField,
    Paper,
    Button,
    Collapse,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    IconButton,
} from '@mui/material';
import { useLabelContext } from "@/context/LabelProvider";
import NoEncryptionGmailerrorredOutlinedIcon from '@mui/icons-material/NoEncryptionGmailerrorredOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface InputFormProps {
    onInsert: (newId: string, newTitle: string, newContent: string, newLabel: string) => void;
}

// トップページ上部の入力フォームコンポーネント
export default function InputForm({ onInsert }: InputFormProps) {

    const [expanded, setExpand] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [editLabelId, setEditLabelId] = React.useState<string | null>(null);
    const [isLocked, setIsLocked] = React.useState(false);

    const { labels } = useLabelContext();

    const blurTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

    const handleExpand = () => { setExpand(true) };
    const handleCollapse = () => {
        setExpand(false);
        setTitle("");
        setContent("");
    }


    // 保存ボタン押下処理
    const saveButtonClick = async () => {

        try {

            const response = await fetch("http://localhost:4000/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    label: editLabelId, // nullの場合はnullが送信される
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

            const insertedNoteId = result.note.id;

            // メモ登録時のコールバック関数を呼び出す
            if (typeof onInsert === "function") {
                onInsert(insertedNoteId, title, content, editLabelId || "");
            }
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

    // フォーカスが外れた場合、入力フォームを閉じる
    React.useEffect(() => {
        if (!isFocused) {
            setExpand(false);
        }
    }, [isFocused]);


    // TODO: テーブルノートの場合を追加する
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
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                        <Button onClick={saveButtonClick} sx={{ color: "#696969" }}>保存</Button>
                        <Button onClick={handleCollapse} sx={{ color: "#696969" }}>キャンセル</Button>
                        <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
                            <InputLabel id="select-label">ラベル</InputLabel>
                            <Select
                                labelId="select-label"
                                value={editLabelId ?? ""}
                                onChange={e => setEditLabelId(e.target.value === "" ? null : e.target.value)}
                                label="ラベル"
                                renderValue={(selected: string) => {
                                    if (!selected) return <em></em>;
                                    const found = labels?.find(l => l.id === selected);
                                    return found ? found.labelname : "";
                                }}
                            >
                                <MenuItem value="">
                                    <em>ラベルなし</em>
                                </MenuItem>
                                {(labels ?? []).map(option => (
                                    <MenuItem key={option.id} value={option.id}>{option.labelname}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <IconButton
                            onClick={() => setIsLocked(!isLocked)}
                            sx={{ ml: 1 }}>
                            {isLocked ? <LockOutlinedIcon /> : <NoEncryptionGmailerrorredOutlinedIcon />}
                        </IconButton>
                    </Box>
                </Collapse>
            </Paper >
        </Box >
    );
};