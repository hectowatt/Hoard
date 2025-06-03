import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

interface LabelDialogProps {
    open: boolean;
    onClose: () => void;
}

// ナビゲーションバー左のラベル編集用ダイアログコンポーネント
export default function CreateLabelDialog({ open, onClose }: LabelDialogProps) {
    const [input, setInput] = useState("");
    const [labels, setLabels] = useState<string[]>([]);

    // TODO: 保存ボタン押下処理
    const handleAdd = async () => {
        if (!input.trim()) {
            console.log("ラベル名は必須です");
            return
        }


        try {

            const response = await fetch("http://localhost:4000/api/labels", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    labelName: input,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save label");
            }

            const result = await response.json();
            console.log("Save success!", result);

            setInput(""); // 入力フィールドをクリア
            setLabels(prevLabels => [...prevLabels, input]); // 新しいラベルを追加
            // メモ登録時のコールバック関数を呼び出す
            if (typeof onclose === "function") {
                onClose(); // ダイアログを閉じる
            }
        } catch (error) {
            console.error("Error saving note:", error);
        }
    }

    const onDeleteLabel = (label: string) => {
        setLabels(prevLabels => prevLabels.filter(l => l !== label));
    }

    return (
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
                    {labels.map(label => (
                        <ListItem
                            key={label}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => onDeleteLabel(label)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={label} />
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant="contained">閉じる</Button>
                <Button onClick={handleAdd} variant="contained">追加</Button>
            </DialogActions>
        </Dialog>
    );
}