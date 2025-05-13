import React from "react";
import { Paper, Typography } from "@mui/material";

interface NoteProps {
    title: string;
    content: string;
    createDate: string;
    updateDate: string;
}

const formatDate = (exString: string) => {
    console.log("exString:" + exString);
    const date = new Date(exString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
}

export default function Note({ title, content, createDate, updateDate }: NoteProps) {
    console.log("createDate:", createDate);
    console.log("updateDate:", updateDate);

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                {content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                作成日: {formatDate(createDate)}  更新日: {formatDate(updateDate)}
            </Typography>
        </Paper>
    );
}