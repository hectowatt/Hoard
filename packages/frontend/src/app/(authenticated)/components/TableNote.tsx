import React, { useEffect, useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField,
    Typography,
    Dialog,
    Box,
    DialogContent,
    DialogTitle,
FormControl,
    InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import { useLabelContext } from "@/app/(authenticated)/context/LabelProvider";
import NoEncryptionGmailerrorredOutlinedIcon from '@mui/icons-material/NoEncryptionGmailerrorredOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

interface Column {
    id: number;
    name: string;
    order?: number;
}

interface RowCell {
    id: number;
    rowIndex: number;
    value: string;
    columnId?: number;
}

interface tableNoteProps {
    id: string;
    title: string;
    label_id: string;
    is_locked: boolean;
    createdate: string;
    updatedate: string;
    columns: Column[];
    rowCells: RowCell[][];
    onSave: (id: string, newTitle: string, newLabel: string, is_locked: boolean, newUpdateDate: string, newColumn: Column[], newRowCells: RowCell[][]) => void;
    onDelete: (id: string) => void;
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

export default function TableNote({ id, title, label_id, is_locked, createdate, updatedate, columns, rowCells, onSave, onDelete }: tableNoteProps) {
    const [open, setOpen] = React.useState(false);
    const [editTitle, setEditTitle] = React.useState(title);
    const [isEditing, setIsEditing] = React.useState(false);
    const [editLabel, setEditLabel] = React.useState<string | null>(null);
    const { labels } = useLabelContext();
    const [isLocked, setIsLocked] = React.useState(false);
    const [inputPassword, setInputPassword] = React.useState("");
    const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false);
    const [passwordId, setPasswordId] = React.useState<string | null>(null);
    const [editColumns, setEditColumns] = useState<Column[]>(columns);
    const [editRowCells, setEditRowCells] = useState<RowCell[][]>(rowCells);


    // 初期状態でのタイトル設定
    useEffect(() => {
        setEditTitle(title);
        setEditLabel(label_id || null);
    }, [title, label_id]);

    // propsを変更用のstateに格納
    useEffect(() => {
        setEditColumns(columns);
    }, [columns]);

    useEffect(() => {
        setEditRowCells(rowCells);
    }, [rowCells]);


    // カラム追加
    // 既存のeditColumnsに新しいカラムを追加する
    // さらに、既存のRowCellの各行に対して末尾に新規セルを追加する
    const handleAddColumn = () => {
        const addColumnId = Date.now();
        if (editColumns.length >= 5) return;
        setEditColumns([...editColumns, { id: addColumnId, name: `カラム${editColumns.length + 1}` }]);
        setEditRowCells(editRowCells.map(rowCell => [...rowCell, { id: Date.now(), rowIndex: rowCell.length, value: "", columnId: addColumnId }]));
    };

    // カラム削除
    const handleDeleteColumn = (colIdx: number) => {
        if (editColumns.length <= 1) return;
        setEditColumns(editColumns.filter((_, idx) => idx !== colIdx));
        setEditRowCells(editRowCells.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // 行編集
    const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
        const updatedRows: RowCell[][] = editRowCells.map((row, index) =>
            index === rowIdx ? row.map((cell, c) => (c === colIdx ? { ...cell, value } : cell)) : row
        );
        setEditRowCells(updatedRows);
    };

    // 行削除
    const handleDeleteRow = (rowIdx: number) => {
        if (editRowCells.length <= 1) return;
        setEditRowCells(editRowCells.filter((_, idx) => idx !== rowIdx));
    };

    // 行追加
    // 既存のeditRowCellsに新しい行を追加する
    // 新しい行は、列の数分の新規セルを生成して追加する
    const handleAddRow = () => setEditRowCells([...editRowCells,
    editColumns.map((col, idx) => (
        {
            id: Date.now() + idx,
            rowIndex: editRowCells.length,
            value: "",
            columnId: col.id
        }
    ))]);


    // ラベル名を取得する関数
    const getLabelName = (id: string) => {
        if (!labels) return "";
        const found = labels.find(l => l.id === id);
        return found ? found.labelname : "";
    };

    // 画面描画時にノートロック状態を設定
    useEffect(() => {
        setIsLocked(is_locked);
    }, [is_locked]);

    const handleOpen = () => {
        setEditTitle(title);
        setOpen(true);
        setIsEditing(false);
    };

    // フォーカスが外れた時の処理
    const handleClose = () => {
        setIsEditing(false);
        setOpen(false)
    };

    // 編集時
    const handleEdit = () => setIsEditing(true);

    // ロックボタン押下処理
    const handleLock = async () => {
        if (isLocked) {
            // ロック解除時の処理

            // パスワードが存在するかチェック
            try {
                const responseSelect = await fetch("/api/password", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (responseSelect.ok) {
                    const resultSelect = await responseSelect.json();
                    console.log("パスワード取得成功", resultSelect);
                    if (resultSelect.password_id !== null && resultSelect.password_id !== "" && resultSelect.password_id !== undefined) {
                        // すでにパスワードが登録されている場合はパスワード入力を求める
                        setPasswordId(resultSelect.password_id);
                        // パスワード入力ダイアログを開く
                        setPasswordDialogOpen(true);
                    } else {
                        // パスワードが未登録の場合はロック解除できない
                        alert("パスワード未登録のためロックできません");
                    }

                } else {
                    console.error("failed to fetch password");
                }
            } catch (error) {
                console.error("Error fetching password", error);
                return;
            }
        } else {
            // ロック時の処理
            try {
                const responseSelect = await fetch("/api/password", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include"
                });

                if (responseSelect.ok) {
                    const resultSelect = await responseSelect.json();
                    console.log("パスワード取得成功", resultSelect);
                    if (resultSelect.password_id !== null && resultSelect.password_id !== "" && resultSelect.password_id !== undefined) {
                        // ロック時の処理
                        const responseLock = await fetch("/api/notes/lock", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: id,
                                isLocked: true, // ロック状態にする
                            }),
                            credentials: "include"
                        });
                        if (!responseLock.ok) {
                            console.error("Failed to lock note");
                            return;
                        }
                        setIsLocked(true);
                    } else {
                        // パスワードが未登録の場合はロックできない
                        alert("パスワード未登録のためロックできません");
                    }
                } else {
                    // パスワード取得に失敗した場合の処理
                    alert("パスワード取得に失敗しました。");
                }
            } catch (error) {
                console.error("Error locking note", error);
                return;
            }
        }
    };

    // ロック解除処理
    const hubdlePasswordSubmit = async () => {
        if (!inputPassword || inputPassword.trim() === "") {
            console.error("パスワードが入力されませんでした");
            return;
        }

        // 入力されたパスワードをもとに比較APIを呼び出す
        const responseCompare = await fetch("/api/password/compare", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password_id: passwordId,
                passwordString: inputPassword
            }),
            credentials: "include"
        });

        if (responseCompare.ok) {
            const result = await responseCompare.json();
            const isMatch = result.isMatch;
            if (isMatch) {
                try {
                    // パスワードが一致した場合、ロックを解除するAPIを呼び出す
                    console.log("パスワードが一致しました。ロックを解除します。");
                    const responseUnlock = await fetch("/api/tablenotes/lock", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: id,
                            isLocked: false, // ロック解除
                        }),
                        credentials: "include"
                    });
                    if (!responseUnlock.ok) {
                        throw new Error("Failed to unlock note");
                    }

                    setIsLocked(false);
                    setPasswordDialogOpen(false);
                    setInputPassword(""); // 入力フィールドをクリア
                } catch (error) {
                    console.error("Error unlocking note", error);
                    return;
                }
            }
        } else {
            console.error("failed to compare password");
            return;
        }
    }

    // テーブルノート保存処理
    const handleSaveTableNote = async () => {
        try {
            const response = await fetch("/api/tablenotes", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: id,
                    title: editTitle,
                    columns: editColumns,
                    rowCells: editRowCells,
                    label_id: editLabel,
                    is_locked: isLocked,
                }),
                credentials: "include"
            })

            if (!response.ok) {
                throw new Error("Failed to save table note");
            }

            const result = await response.json();
            console.log("Table note saved successfully!", result);
            setOpen(false);
            setEditColumns([{ id: 1, name: "カラム1", order: 1 }]);
            setEditRowCells([[{ id: 1, rowIndex: 0, value: "", columnId: 1 }]]);
            // テーブルノート登録時のコールバック関数を呼び出す
            if (typeof onSave === "function") {
                onSave(result.tableNote.id, result.tableNote.title, editLabel || "", isLocked, result.tableNote.updatedate, editColumns, editRowCells);
            }
        } catch (error) {
            console.error("Error saving table note:", error);
        }
    }

    // 削除ボタン押下処理
    const handleDelete = async () => {
        try {
            const response = await fetch(`http://localhost/api/tablenotes/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error("Failed to delete note");
            }
            const result = await response.json();
            console.log("Delete success!", result);

            if (typeof onDelete === "function") {
                onDelete(id);
            }

            setIsEditing(false);
            setOpen(false);

        } catch (error) {
            console.error("Error deleting note", error);
            return;
        }
    };

    return (
        <>
            <Paper elevation={3} sx={{ p: 2, maxWidth: 300, maxHeight: 200, wordWrap: "break-word", cursor: "pointer" }} onClick={handleOpen}>
                <Typography variant="h6" sx={title && title.trim() !== "" ? { mb: 1 } : { mb: 1, fontStyle: "italic", color: "#b0b0b0", fontWeight: "normal" }}>
                    {title && title.trim() !== "" ? title : "タイトルなし"}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        mb: 1,
                        whiteSpace: "pre-line",
                        maxHeight: 90,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: "vertical",
                    }}
                >{is_locked ? "このノートはロックされています" : <TableChartOutlinedIcon />}
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
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{isEditing && !isLocked ? (
                    <TextField
                        fullWidth
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        variant="standard" />
                ) : (
                    editTitle
                )}</DialogTitle>
                <DialogContent>
                    {isEditing && !isLocked ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {editColumns.map((col, idx) => (
                                            <TableCell key={col.id}>
                                                <TextField
                                                    value={col.name}
                                                    variant="outlined"
                                                    onChange={e => {
                                                        const newColumns = [...editColumns];
                                                        newColumns[idx] = { ...newColumns[idx], name: e.target.value };
                                                        setEditColumns(newColumns);
                                                    }}
                                                    sx={{ width: 200 }}
                                                />
                                                <IconButton size="small" onClick={() => handleDeleteColumn(idx)} disabled={editColumns.length <= 1}>
                                                    <DeleteIcon fontSize="small" data-testid="deletecolumnicon" />
                                                </IconButton>
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton onClick={handleAddColumn} disabled={editColumns.length >= 5}>
                                                <AddIcon data-testid="addColumnIcon" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {editRowCells.map((row, rowIdx) => (
                                        <TableRow key={rowIdx}>
                                            {row.map((cell, colIdx) => (
                                                <TableCell key={colIdx}>
                                                    <TextField
                                                        value={cell.value}
                                                        onChange={e => handleCellChange(rowIdx, colIdx, e.target.value)}
                                                        variant="outlined"
                                                        sx={{ width: 200 }}
                                                    />
                                                </TableCell>
                                            ))}
                                            <TableCell>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDeleteRow(rowIdx)}
                                                    disabled={editRowCells.length <= 1}
                                                    data-testid="deleterowicon"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button onClick={handleAddRow} sx={{ m: 2 }}><AddIcon data-testid="addRowIcon" /></Button>
                        </TableContainer>
                    ) : (
                        <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                            {isLocked ? "このノートはロックされています" : < TableChartOutlinedIcon />}
                        </Typography>
                    )
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
                    <Box sx={{ mt: 2, textAlignn: "right" }}>
                        {isEditing && !isLocked ? (
                            // 編集中でパスワードロックされていない場合
                            <>
                                <Button onClick={handleSaveTableNote} variant="contained" sx={{ mr: 1 }}>保存</Button>
                                <Button onClick={() => setIsEditing(false)} variant="contained">キャンセル</Button>
                                <FormControl size="small" sx={{ minWidth: 120, ml: 2 }} data-testid="label-select">
                                    <InputLabel id="select-label">ラベル</InputLabel>
                                    <Select
                                        labelId="select-label"
                                        value={editLabel ?? ""}
                                        onChange={e => setEditLabel(e.target.value === "" ? null : e.target.value)}
                                        label="ラベル"
                                        renderValue={(selected: string) => {
                                            if (!selected) return <em>ラベルなし</em>;
                                            const found = labels?.find(l => l.id === selected);
                                            return found ? found.labelname : "";
                                        }}
                                    >
                                        <MenuItem value="">
                                            <em>ラベルなし</em>
                                        </MenuItem>
                                        {labels && labels.map(option => (
                                            <MenuItem key={option.id} value={option.id}>{option.labelname}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                            </>
                        ) : !isLocked ? (
                            // 編集中でなく、パスワードロックされていない場合
                            <>
                                <Button onClick={handleEdit} variant="contained">編集</Button>
                                <Button onClick={handleDelete} variant="contained" sx={{ ml: 1 }}>削除</Button>
                                <IconButton
                                    onClick={handleLock}
                                    sx={{ ml: 1, color: isLocked ? "primary.main" : "text.secondary" }}>
                                    {isLocked ? <LockOutlinedIcon data-testid="lock" /> : <NoEncryptionGmailerrorredOutlinedIcon data-testid="unlock" />}
                                </IconButton>

                            </>
                        ) : (
                            // パスワードロックされている場合
                            <>
                                <Button onClick={handleDelete} variant="contained" sx={{ ml: 1 }}>削除</Button>
                                <IconButton
                                    onClick={handleLock}
                                    sx={{ ml: 1, color: isLocked ? "primary.main" : "text.secondary" }}>
                                    {isLocked ? <LockOutlinedIcon data-testid="lock" /> : <NoEncryptionGmailerrorredOutlinedIcon data-testid="unlock" />}
                                </IconButton>
                            </>
                        )}
                    </Box>
                </DialogContent>
            </Dialog >

            <Dialog open={passwordDialogOpen} onClose={() => setPasswordDialogOpen(false)}>
                <DialogTitle>パスワード入力</DialogTitle>
                <DialogContent>
                    <TextField
                        type="password"
                        label="パスワード"
                        autoComplete="new-password"
                        value={inputPassword}
                        onChange={(e) => setInputPassword(e.target.value)}
                        fullWidth
                        variant="standard"
                    />
                    <Button
                        onClick={hubdlePasswordSubmit}
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        ロック解除
                    </Button>
                    <Button onClick={() => setPasswordDialogOpen(false)} variant="contained" sx={{ mt: 2, ml: 1 }}>
                        キャンセル
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    );
}