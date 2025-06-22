import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

interface Note {
    id: string;
    title: string;
    content: string;
    createdate: string;
    updatedate: string;
}

interface NotesTableProps {
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
}

export default function TableNote({ notes, onEdit, onDelete }: NotesTableProps) {
    const [columns, setColumns] = useState([{ id: 1, name: "カラム1" }]);
    const [rows, setRows] = useState([[""]]);

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
                                {col.name}
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