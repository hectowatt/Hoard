import React, { useEffect } from "react";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField, Button, FormControl, Select, MenuItem, InputLabel } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";

interface NoteProps {
    id: string;
    title: string;
    content: string;
    label_id: string;
    createdate: string;
    updatedate: string;
    onSave?: (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => void;
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

// トップページに並ぶメモコンポーネント
export default function Note({ id, title, content, label_id, createdate, updatedate, onSave, onDelete }: NoteProps) {

    const [open, setOpen] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(title);
    const [editContent, setEditContent] = React.useState(content);
    const [isEditing, setIsEditing] = React.useState(false);
    const [updateDateAfterSaving, setUpdateDateAfterSaving] = React.useState(updatedate);
    const [editLabel, setEditLabel] = React.useState(label_id ?? "");

    const { labels } = useLabelContext();

    const handleOpen = () => {
        setEditTitle(title);
        setEditContent(content);
        setOpen(true);
        setIsEditing(false);
    };

    // フォーカスが外れた時の処理
    const handleClose = () => setOpen(false);

    // 編集時
    const handleEdit = () => setIsEditing(true);

    // 削除ボタン押下処理
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost:4000/api/notes/${id}`, {
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


    // 保存ボタン押下処理
    const handleSave = async () => {
        if (!editTitle.trim() || !editContent.trim()) {
            console.log("must set title and content");
            return;
        }
        try {
            const response = await fetch("http://localhost:4000/api/notes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    title: editTitle,
                    content: editContent,
                    label: editLabel,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save note");
            }

            const result = await response.json();
            console.log("Save success!", result);

            if (typeof onSave === "function") {
                onSave(id, editTitle, editContent, editLabel, result.note.updatedate);
            }
        } catch (error) {
            console.error("Error saving note", error);
            return;
        }
        setIsEditing(false);
        setEditTitle(editTitle);
        setEditContent(editContent);
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
                <Typography variant="h6" sx={title && title.trim() !== "" ? { mb: 1 } : { mb: 1, fontStyle: "italic", color: "#b0b0b0", fontWeight: "normal" }}>
                    {title && title.trim() !== "" ? title : "タイトルなし"}
                </Typography>
                <Typography variant="body1" sx={{ mb: 1, whiteSpace: "pre-line" }}>
                    {content}
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
                <DialogTitle>{isEditing ? (
                    <TextField
                        fullWidth
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        variant="standard" />
                ) : (
                    title
                )}</DialogTitle>
                <DialogContent>
                    {isEditing ? (<TextField
                        fullWidth
                        multiline
                        rows={4}
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        variant="standard"
                        sx={{ mb: 2 }} />)
                        : (
                            <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                                {content}
                            </Typography>)
                    }
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
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>保存</Button>
                                <Button onClick={() => setIsEditing(false)} variant="contained">キャンセル</Button>
                                <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
                                    <InputLabel id="select-label">ラベル</InputLabel>
                                    <Select
                                        labelId="select-label"
                                        value={editLabel ?? ""}
                                        onChange={e => setEditLabel(e.target.value)}
                                        label="ラベル">
                                        {labels && labels.map(option => (
                                            <MenuItem key={option.id} value={option.id}>{option.labelname}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </>
                        ) : (
                            <>
                                <Button onClick={handleEdit} variant="contained">編集</Button>
                                <Button onClick={handleDelete} variant="contained" sx={{ ml: 1 }}>削除</Button>
                            </>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}