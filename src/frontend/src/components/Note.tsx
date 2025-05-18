import React from "react";
import { Box, Paper, Typography, Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";

interface NoteProps {
    id: string;
    title: string;
    content: string;
    createdate: string;
    updatedate: string;
    onSave?: (id: string, newTitle: string, newContent:string, newUpdateDate: string) => void;
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

export default function Note({ id, title, content, createdate, updatedate, onSave }: NoteProps) {

    const [open, setOpen] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(title);
    const [editContent, setEditContent] = React.useState(content);
    const [isEditing, setIsEditing] = React.useState(false);
    const [updateDateAfterSaving, setUpdateDateAfterSaving] = React.useState(updatedate);

    const handleOpen = () => {
        setEditTitle(title);
        setEditContent(content);
        setOpen(true);
        setIsEditing(false);
    };
    const handleClose = () => setOpen(false);

    const handleEdit = () => setIsEditing(true);

    // 保存ボタン押下処理
    const handleSave = async () => {
        if (!editTitle.trim() || !editContent.trim()) {
                console.log("must set title and content");
                return;
        }
        try{
            const response = await fetch("http://localhost:4000/api/notes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: editTitle,
                    content: editContent,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save note");
            }

            const result = await response.json();
            console.log("Save success!", result);

            if(typeof onSave === "function"){
                console.log("id: ", id);
                console.log("新しいタイトル: ", editTitle);
                console.log("新しい内容: ", editContent);
                console.log("新しい更新日付: ", result.note.updatedate)
                onSave(id, editTitle, editContent, result.note.updatedate);
            }
        }catch(error){
            console.error("Error saving note", error);
            return;
        }
        setIsEditing(false);
        setEditTitle(editTitle);
        setEditContent(editContent);
        setUpdateDateAfterSaving(new Date().toISOString());
        setOpen(false);
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 400, wordWrap: "break-word", cursor: "pointer" }} onClick={handleOpen}>
                <Typography variant="h6" sx={{ mb: 1 }}>
                    {title}
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
                    <Box sx={{ mt: 2, textAlighn: "right" }}>
                        {isEditing ? (
                            <>
                                <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>保存</Button>
                                <Button onClick={() => setIsEditing(false)}>キャンセル</Button>

                            </>
                        ) : (
                            <Button onClick={handleEdit} variant="contained">編集</Button>
                        )}
                    </Box>
                </DialogContent>
            </Dialog>
        </>
    );
}