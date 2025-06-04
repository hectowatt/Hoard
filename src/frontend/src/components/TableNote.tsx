import React from "react";
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button
} from "@mui/material";

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
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>タイトル</TableCell>
                        <TableCell>内容</TableCell>
                        <TableCell>作成日</TableCell>
                        <TableCell>更新日</TableCell>
                        <TableCell>操作</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {notes.map(note => (
                        <TableRow key={note.id}>
                            <TableCell>{note.title}</TableCell>
                            <TableCell>{note.content}</TableCell>
                            <TableCell>{note.createdate}</TableCell>
                            <TableCell>{note.updatedate}</TableCell>
                            <TableCell>
                                <Button variant="outlined" size="small" onClick={() => onEdit(note)}>編集</Button>
                                <Button variant="outlined" size="small" color="error" onClick={() => onDelete(note.id)} sx={{ ml: 1 }}>削除</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}