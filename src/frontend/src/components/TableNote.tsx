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
import { useLabelContext } from "@/context/LabelProvider";
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


    // columnsやrowCellsが変わったら内部状態も更新
    useEffect(() => {
        setEditColumns(columns);
    }, [columns]);

    useEffect(() => {
        setEditRowCells(rowCells);
    }, [rowCells]);

    // カラム追加
    const handleAddColumn = () => {
        const addColumnId = Date.now();
        if (columns.length >= 5) return;
        setEditColumns([...columns, { id: addColumnId, name: `カラム${columns.length + 1}` }]);
        setEditRowCells(rowCells.map(rowCell => [...rowCell, { id: Date.now(), rowIndex: rowCell.length, value: "", columnId: addColumnId }]));
    };

    // カラム削除
    const handleDeleteColumn = (colIdx: number) => {
        if (columns.length <= 1) return;
        setEditColumns(columns.filter((_, idx) => idx !== colIdx));
        setEditRowCells(rowCells.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // セル編集
    const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
        const updatedRows: RowCell[][] = rowCells.map((row, index) =>
            index === rowIdx ? row.map((cell, c) => (c === colIdx ? { ...cell, value } : cell)) : row
        );
        setEditRowCells(updatedRows);
    };

    // 行追加
    const handleAddRow = () => setEditRowCells([...rowCells, Array(columns.length).fill("")]);


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
                const responseSelect = await fetch("http://localhost:4000/api/password", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
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
                const responseSelect = await fetch("http://localhost:4000/api/password", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                if (responseSelect.ok) {
                    const resultSelect = await responseSelect.json();
                    console.log("パスワード取得成功", resultSelect);
                    if (resultSelect.password_id !== null && resultSelect.password_id !== "" && resultSelect.password_id !== undefined) {
                        // ロック時の処理
                        const responseLock = await fetch("http://localhost:4000/api/notes/lock", {
                            method: "PUT",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                id: id,
                                isLocked: true, // ロック状態にする
                            })
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
        const responseCompare = await fetch("http://localhost:4000/api/password/compare", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password_id: passwordId,
                passwordString: inputPassword
            }),
        });

        if (responseCompare.ok) {
            const result = await responseCompare.json();
            const isMatch = result.isMatch;
            if (isMatch) {
                try {
                    // パスワードが一致した場合、ロックを解除するAPIを呼び出す
                    console.log("パスワードが一致しました。ロックを解除します。");
                    const responseUnlock = await fetch("http://localhost:4000/api/tablenotes/lock", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            id: id,
                            isLocked: false, // ロック解除
                        })
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
            const response = await fetch("http://localhost:4000/api/tablenotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    columns: editColumns,
                    rowCells: editRowCells,
                    label: editLabel,
                    is_locked: isLocked,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save table note");
            }

            const result = await response.json();
            console.log("Table note saved successfully!", result);
            setOpen(false);
            setEditColumns([{ id: 1, name: "カラム1", order: 1 }]);
            setEditRowCells([[{ id: 1, rowIndex: 0, value: "", columnId: 1 }]]);
            // ノート登録時のコールバック関数を呼び出す
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
            const response = await fetch(`http://localhost:4000/api/tablenotes/${id}`, {
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
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditing && !isLocked ? (
                    <TextField
                        fullWidth
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        variant="standard" />
                ) : (
                    title
                )}</DialogTitle>
                <DialogContent>
                    {isEditing && !isLocked ? (
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {columns.map((col, idx) => (
                                            <TableCell key={col.id}>
                                                <TextField
                                                    value={col.name}
                                                    variant="outlined"
                                                    onChange={e => {
                                                        const newColumns = [...columns];
                                                        newColumns[idx] = { ...newColumns[idx], name: e.target.value };
                                                        setEditColumns(newColumns);
                                                    }}
                                                    sx={{ width: 200 }}
                                                />
                                                <IconButton size="small" onClick={() => handleDeleteColumn(idx)} disabled={columns.length <= 1}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        ))}
                                        <TableCell>
                                            <IconButton onClick={handleAddColumn} disabled={columns.length >= 5}>
                                                <AddIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rowCells.map((row, rowIdx) => (
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button onClick={handleAddRow} sx={{ m: 2 }}><AddIcon /></Button>
                        </TableContainer>
                    )
                        : (
                            <Typography variant="body1" sx={{ whiteSpace: "pre-line", mb: 2 }}>
                                {isLocked ? "このノートはロックされています" : <LockOutlinedIcon />}
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
                                <FormControl size="small" sx={{ minWidth: 120, ml: 2 }}>
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
                                    {isLocked ? <LockOutlinedIcon /> : <NoEncryptionGmailerrorredOutlinedIcon />}
                                </IconButton>

                            </>
                        ) : (
                            // パスワードロックされている場合
                            <>
                                <Button onClick={handleDelete} variant="contained" sx={{ ml: 1 }}>削除</Button>
                                <IconButton
                                    onClick={handleLock}
                                    sx={{ ml: 1, color: isLocked ? "primary.main" : "text.secondary" }}>
                                    {isLocked ? <LockOutlinedIcon /> : <NoEncryptionGmailerrorredOutlinedIcon />}
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