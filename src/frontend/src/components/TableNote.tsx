import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Column {
    id: number;
    name: string;
}

interface tableNoteProps {
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    rows: string[][];
    setRows: React.Dispatch<React.SetStateAction<string[][]>>;
}

export default function TableNote({ columns, setColumns, rows, setRows }: tableNoteProps) {


    // カラム追加
    const handleAddColumn = () => {
        if (columns.length >= 5) return;
        setColumns([...columns, { id: Date.now(), name: `カラム${columns.length + 1}` }]);
        setRows(rows.map(row => [...row, ""]));
    };

    // カラム削除
    const handleDeleteColumn = (colIdx: number) => {
        if (columns.length <= 1) return;
        setColumns(columns.filter((_, idx) => idx !== colIdx));
        setRows(rows.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // セル編集
    const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
        const updatedRows = rows.map((row, r) =>
            r === rowIdx ? row.map((cell, c) => (c === colIdx ? value : cell)) : row
        );
        setRows(updatedRows);
    };

    // 行追加
    const handleAddRow = () => setRows([...rows, Array(columns.length).fill("")]);

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        {columns.map((col, idx) => (
                            <TableCell key={col.id}>
                                <TextField
                                    value={col.name}
                                    variant="standard"
                                    onChange={e => {
                                        const newColumns = [...columns];
                                        newColumns[idx] = { ...newColumns[idx], name: e.target.value };
                                        setColumns(newColumns);
                                    }}
                                    sx={{ width: 80 }}
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
                    {rows.map((row, rowIdx) => (
                        <TableRow key={rowIdx}>
                            {row.map((cell, colIdx) => (
                                <TableCell key={colIdx}>
                                    <TextField
                                        value={cell}
                                        onChange={e => handleCellChange(rowIdx, colIdx, e.target.value)}
                                        variant="standard"
                                    />
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <Button onClick={handleAddRow} sx={{ m: 2 }}>行を追加</Button>
        </TableContainer>
    );
}