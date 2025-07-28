"use client";

import React, { useState } from "react";
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
    Dialog,
    TableContainer,
    TableBody,
    Table,
    TableCell,
    TableRow,
    TableHead,
} from '@mui/material';
import { useLabelContext } from "@/context/LabelProvider";
import NoEncryptionGmailerrorredOutlinedIcon from '@mui/icons-material/NoEncryptionGmailerrorredOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface InputFormProps {
    onInsert: (newId: string, newTitle: string, newContent: string, newLabel: string, isLocked: boolean) => void;
    onInsertTableNote: (newId: string, newTitle: string, newLabel: string, isLocked: boolean, newColumns: Column[], newRowCells: RowCell[][]) => void;
}

type Column = {
    id: number;
    name: string;
    order?: number;
}

type RowCell = {
    id: number;
    rowIndex: number;
    value: string;
    columnId?: number;
}

// トップページ上部の入力フォームコンポーネント
export default function InputForm({ onInsert, onInsertTableNote }: InputFormProps) {

    const [expanded, setExpand] = useState(false);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [editLabelId, setEditLabelId] = React.useState<string | null>(null);
    const [isLocked, setIsLocked] = React.useState(false);
    const [tableNoteOpen, setTableNoteOpen] = useState(false);

    const { labels } = useLabelContext();

    // テーブルノート用
    const [editColumns, setEditColumns] = useState<Column[]>([
        { id: 1, name: "カラム1", order: 1 }
    ]);
    const [editRowCells, setEditRowCells] = useState<RowCell[][]>([[{
        id: 1,
        rowIndex: 0,
        value: "",
        columnId: 1
    }]]);

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

            const response = await fetch("/api/notes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    content: content,
                    label: editLabelId, // nullの場合はnullが送信される
                    isLocked: isLocked, // ロック状態を送信
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

            // ノート登録時のコールバック関数を呼び出す
            if (typeof onInsert === "function") {
                onInsert(insertedNoteId, title, content, editLabelId || "", isLocked);
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

    // テーブルノート保存処理
    const handleSaveTableNote = async () => {
        try {
            const response = await fetch("/api/tablenotes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    title: title,
                    columns: editColumns,
                    rowCells: editRowCells,
                    label: editLabelId,
                    is_locked: isLocked,
                }),
            })

            if (!response.ok) {
                throw new Error("Failed to save table note");
            }

            const result = await response.json();
            console.log("Table note saved successfully!", result);
            setTableNoteOpen(false);
            setEditColumns([{ id: 1, name: "カラム1", order: 1 }]);
            setEditRowCells([[{ id: 1, rowIndex: 0, value: "", columnId: 1 }]]);
            // テーブルノート登録時のコールバック関数を呼び出す
            if (typeof onInsertTableNote === "function") {
                onInsertTableNote(result.tableNote.id, result.tableNote.title, editLabelId || "", isLocked, editColumns, editRowCells);
            }
        } catch (error) {
            console.error("Error saving table note:", error);
        }
    }

    // カラム追加
    // 既存のeditColumnsに新しいカラムを追加する
    // さらに、既存のRowCellの各行に対して末尾に新規セルを追加する
    const handleAddColumn = () => {
        const addColumnId = Date.now();
        if (editColumns.length >= 5) return;
        setEditColumns([...editColumns, { id: addColumnId, name: `カラム${editColumns.length + 1}` }]);
        setEditRowCells(editRowCells.map(editRowCell => [...editRowCell, { id: Date.now(), rowIndex: editRowCell.length, value: "", columnId: addColumnId }]));
    };

    // カラム削除
    const handleDeleteColumn = (colIdx: number) => {
        if (editColumns.length <= 1) return;
        setEditColumns(editColumns.filter((_, idx) => idx !== colIdx));
        setEditRowCells(editRowCells.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // セル編集
    const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
        const updatedRows: RowCell[][] = editRowCells.map((row, index) =>
            index === rowIdx ? row.map((cell, c) => (c === colIdx ? { ...cell, value } : cell)) : row
        );
        setEditRowCells(updatedRows);
    };

    // 行追加
    // 既存のeditRowCellsに新しい行を追加する
    // 新しい行は、列の数分の新規セルを生成して追加する
    const handleAddRow = () => {
        setEditRowCells([
            ...editRowCells,
            editColumns.map((col, idx) => ({
                id: Date.now() + idx,
                rowIndex: editRowCells.length,
                value: "",
                columnId: col.id,
            }))
        ]);
    };

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
                    placeholder="ノートを入力..."
                    fullWidth
                    multiline
                    minRows={expanded ? 3 : 1}
                    variant="standard"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
                <Collapse in={expanded}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 1 }}>
                        <Button onClick={saveButtonClick} variant="contained" sx={{ mr: 1 }}>保存</Button>
                        <Button onClick={handleCollapse} variant="contained">キャンセル</Button>
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
                            {isLocked ? <LockOutlinedIcon data-testid="ロック" /> : <NoEncryptionGmailerrorredOutlinedIcon data-testid="アンロック" />}
                        </IconButton>
                        <IconButton
                            onClick={() => setTableNoteOpen(true)}
                            sx={{ ml: 1 }}>
                            <TableChartOutlinedIcon />
                        </IconButton>
                    </Box>
                </Collapse>
            </Paper >
            <Dialog open={tableNoteOpen} onClose={() => setTableNoteOpen(false)} maxWidth="md" fullWidth>
                <TableContainer component={Paper}>
                    <TextField
                        label="タイトル"
                        variant="outlined"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        fullWidth
                        margin="normal" />
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
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                ))}
                                <TableCell>
                                    <IconButton onClick={handleAddColumn} disabled={editColumns.length >= 5}>
                                        <AddIcon />
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Button onClick={handleAddRow} sx={{ m: 2 }}><AddIcon /></Button>
                </TableContainer>
                <Box sx={{ textAlign: 'center', p: 2 }}>
                    <Button onClick={handleSaveTableNote} variant="contained" sx={{ mr: 2 }}>
                        保存
                    </Button>
                    <Button onClick={() => setTableNoteOpen(false)} variant="contained" >
                        キャンセル
                    </Button>
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
            </Dialog >
        </Box >
    );
};