import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, List, ListItem, ListItemText, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { stringify } from "querystring";

interface LabelDialogProps {
    open: boolean;
    onClose: () => void;
}

// ナビゲーションバー左のラベル編集用ダイアログコンポーネント
export default function CreateLabelDialog({ open, onClose }: LabelDialogProps) {
    const [input, setInput] = useState("");
    const [labels, setLabels] = useState<{ id: string, labelname: string, createDate: string }[]>([]);

    // 保存ボタン押下処理
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
            await fetchLabels(); // ラベルを再取得して更新

        } catch (error) {
            console.error("Error saving note:", error);
        }
    }

    // 画面表示時にラベル全件を取得する
    const fetchLabels = async () => {
        try {
            const response = await fetch("http://localhost:4000/api/labels", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch labels");
            }

            const data = await response.json();
            console.log("Fetched labels:", JSON.stringify(data, null, 2));
            setLabels(data); // ラベル名の配列に変換
        } catch (error) { }
    }


    // ラベル削除処理
    const onDeleteLabel = async (labelId: string) => {
        try {
            const response = await fetch('http://localhost:4000/api/labels/' + labelId, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (!response.ok) {
                throw new Error("Failed to delete label");
            }
            const result = await response.json();
            console.log("Delete success!", result);
            // ラベル削除後、状態を更新

            // ラベルの状態を更新
            setLabels(prevLabels => prevLabels.filter(l => l.id !== labelId));
        } catch (error) {

        }
    }

    useEffect(() => {
        if (open) {
            fetchLabels();
        }
    }, [open]);

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
                            key={label.id}
                            secondaryAction={
                                <IconButton edge="end" onClick={() => onDeleteLabel(label.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            }
                        >
                            <ListItemText primary={label.labelname} />
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