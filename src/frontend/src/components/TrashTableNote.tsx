import React, { useEffect } from "react";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface trashNoteProps {
    id: string;
    title: string;
    label_id: string;
    isLocked: boolean;
    createdate: string;
    updatedate: string;
    onRestore?: (id: string, newTitle: string, newLabel: string, newUpdateDate: string) => void;
    onDelete?: (id: string) => void;
}

// 日付をフォーマットする
const formatDate = (exString: string) => {
    const date = new Date(exString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day}`;
}

// 削除ページに並ぶトラッシュテーブルノートコンポーネント
export default function TrashTableNote({ id, title, label_id, isLocked, createdate, updatedate, onRestore, onDelete }: trashNoteProps) {

    const [open, setOpen] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(title);
    const [isEditing, setIsEditing] = React.useState(false);
    const [updateDateAfterSaving, setUpdateDateAfterSaving] = React.useState(updatedate);
    const [editLabel, setEditLabel] = React.useState(label_id ?? "");

    const { labels } = useLabelContext();

    const handleOpen = () => {
        setEditTitle(title);
        setOpen(true);
        setIsEditing(false);
    };

    // フォーカスが外れた時の処理
    const handleClose = () => setOpen(false);

    // キャンセルボタン押下時
    const handleCancel = () => {
        setIsEditing(false);
        setOpen(false);
    };

    // 削除ボタン押下処理
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost/api/tablenotes/trash/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            const result = await response.json();
            console.log("Delete success!", result);

            if (typeof onDelete === "function") {
                onDelete(id);
            }

        } catch (error) {
            console.error("Error deleting note", error);
            return;
        }
    }


    // 復元ボタン押下処理
    const handleSave = async () => {
        try {
            const response = await fetch("/api/tablenotes/trash", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save note");
            }

            const result = await response.json();
            console.log("Restore success!", result);

            if (typeof onRestore === "function") {
                onRestore(id, editTitle, editLabel, result.note.updatedate);
            }
        } catch (error) {
            console.error("Error saving note", error);
            return;
        }
        setIsEditing(false);
        setEditTitle(editTitle);
        setUpdateDateAfterSaving(new Date().toISOString());
        setOpen(false);
    };

    // ラベル名を取得する関数
    const getLabelName = (id: string) => {
        if (!labels) return "";
        const found = labels.find(l => l.id === id);
        return found ? found.labelname : "";
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400, wordWrap: "break-word", cursor: "pointer" }} onClick={handleOpen}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    {title}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line" }}>
                    <LockOutlinedIcon />
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                    作成日: {formatDate(createdate)}
                </Typography>
                <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                    更新日: {formatDate(updatedate)}
                </Typography>
                {label_id && label_id.trim() !== "" && getLabelName(label_id) && (
                    <Typography variant="caption" color="textSecondary" sx={{ mb: 1, border: "1px solid #ccc", p: 0.5, borderRadius: 1 }}>
                        {getLabelName(label_id)}
                    </Typography>
                )}
            </Paper>
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle component="div" sx={{ mb: 1, pl: 2, pr: 2, ml: 1 }}>
                    <Typography variant="h6" sx={{ textAlign: "left" }}>
                        {title}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line" }}>
                        <LockOutlinedIcon />
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                        作成日: {formatDate(createdate)}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" sx={{ display: "block" }}>
                        更新日: {formatDate(updatedate)}
                    </Typography>
                    {label_id && label_id.trim() !== "" && getLabelName(label_id) && (
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, border: "1px solid #ccc", p: 0.5, borderRadius: 1 }}>
                            {getLabelName(label_id)}
                        </Typography>
                    )}
                    <Box sx={{ mt: 2, textAlighn: "right" }}>
                        <>
                            <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>復元</Button>
                            <Button onClick={handleDelete} variant="contained" sx={{ mr: 1 }}>完全に削除</Button>
                            <Button onClick={handleCancel} variant="contained">キャンセル</Button>
                        </>
                    </Box>
                </DialogContent>
            </Dialog >
        </>
    );
}