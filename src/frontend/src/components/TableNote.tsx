import React, { useState } from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, TextField
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

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
    columns: Column[];
    setColumns: React.Dispatch<React.SetStateAction<Column[]>>;
    rowCells: RowCell[][];
    setRowCells: React.Dispatch<React.SetStateAction<RowCell[][]>>;
}

export default function TableNote({ columns, setColumns, rowCells, setRowCells }: tableNoteProps) {


    // カラム追加
    const handleAddColumn = () => {
        const addColumnId = Date.now();
        if (columns.length >= 5) return;
        setColumns([...columns, { id: addColumnId, name: `カラム${columns.length + 1}` }]);
        setRowCells(rowCells.map(rowCell => [...rowCell, { id: Date.now(), rowIndex: rowCell.length, value: "", columnId: addColumnId }]));
    };

    // カラム削除
    const handleDeleteColumn = (colIdx: number) => {
        if (columns.length <= 1) return;
        setColumns(columns.filter((_, idx) => idx !== colIdx));
        setRowCells(rowCells.map(row => row.filter((_, idx) => idx !== colIdx)));
    };

    // セル編集
    const handleCellChange = (rowIdx: number, colIdx: number, value: string) => {
        const updatedRows: RowCell[][] = rowCells.map((row, index) =>
            index === rowIdx ? row.map((cell, c) => (c === colIdx ? { ...cell, value } : cell)) : row
        );
        setRowCells(updatedRows);
    };

    // 行追加
    const handleAddRow = () => setRowCells([...rowCells, Array(columns.length).fill("")]);

    return (
        <TableContainer component={Paper}>
            <TextField
                label="タイトル"
                variant="outlined"
                fullWidth
                margin="normal" />
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
                                        setColumns(newColumns);
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
    );
}