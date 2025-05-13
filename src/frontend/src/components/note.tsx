import React from "react";
import { Paper, Typography } from "@mui/material";

interface NoteProps {
    title: string;
    content: string;
    createDate: string;
    updateDate: string;
}

export default function Note({ title, content, createDate, updateDate }: NoteProps) {
    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                {content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                作成日: {createDate} / 更新日: {updateDate}
            </Typography>
        </Paper>
    );
}