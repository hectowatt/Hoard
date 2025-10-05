import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, IconButton, DialogContentText } from "../../../../node_modules/@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useLabelContext } from "@/app/(authenticated)/context/LabelProvider";
import { useNoteContext } from "@/app/(authenticated)/context/NoteProvider";

interface LabelDialogProps {
    open: boolean;
    onClose: () => void;
    notes?: { id: string, title: string, content: string, label_id: string, createdate: string, updatedate: string }[];
}

// ナビゲーションバー左のラベル編集用ダイアログコンポーネント
export default function CreateLabelDialog({ open, onClose }: LabelDialogProps) {
    const [input, setInput] = useState("");
    const { labels, fetchLabels } = useLabelContext();
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [targetLabelId, setTargetLabelId] = useState<string | null>(null);
    const { notes } = useNoteContext();

    const isLabelUsed = (labelId: string) => !!notes && notes.some(note => note.label_id === labelId);

    // 保存ボタン押下処理
    const handleAdd = async () => {
        if (!input.trim()) {
            console.log("ラベル名は必須です");
            return
        }
        try {

            const response = await fetch("/api/labels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    labelName: input,
                }),
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to save label");
            }

            const result = await response.json();
            console.log("Save success!", result);

            setInput(""); // 入力フィールドをクリア
            await fetchLabels(); // ラベルを再取得して更新

        } catch (error) {
            console.error("Error saving note:", error);
        }
    }

    // 「はい」選択時
    const handleConfirmDelete = async () => {
        if (targetLabelId) {
            await onDeleteLabel(targetLabelId);
            setTargetLabelId(null);
            setConfirmOpen(false);
        }
    };

    // 「いいえ」選択時
    const handleCancel = () => {
        setTargetLabelId(null);
        setConfirmOpen(false);
    };

    // ラベル削除処理
    const onDeleteLabel = async (labelId: string) => {
        try {
            const response = await fetch('/api/labels/' + labelId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to delete label");
            }
            const result = await response.json();
            console.log("Delete success!", result);
            // ラベル削除後、状態を更新

            // ラベルの状態を更新
            fetchLabels();
        } catch (error) {

        }
    }

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
                <DialogTitle>ラベルを編集</DialogTitle>
                <DialogContent>
                    <TextField
                        label="新しいラベルを作成"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
                        fullWidth
                        margin="dense"
                    />
                    <List>
                        {labels && labels.map(label => (
                            <ListItem
                                key={label.id}
                                secondaryAction={
                                    <IconButton edge="end" onClick={() => {
                                        if (isLabelUsed(label.id)) {
                                            setTargetLabelId(label.id);
                                            setConfirmOpen(true);
                                        } else {
                                            console.log("islabelused", isLabelUsed(label.id));
                                            onDeleteLabel(label.id);
                                        }
                                    }}>
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemText primary={label.labelname} />
                            </ListItem>
                        ))}
                    </List>
                </DialogContent >
                <DialogActions>
                    <Button onClick={handleAdd} variant="contained">追加</Button>
                    <Button onClick={onClose} variant="contained">閉じる</Button>
                </DialogActions>
            </Dialog >
            {/* 確認ダイアログ */}
            < Dialog open={confirmOpen} onClose={handleCancel} >
                <DialogTitle>ラベル削除の確認</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        このラベルはノートに付与されています。本当に削除しますか？
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleConfirmDelete} color="error" variant="contained">はい</Button>
                    <Button onClick={handleCancel}>いいえ</Button>
                </DialogActions>
            </Dialog >
        </>
    );
}