import React from "react";
import { Paper, Typography } from "@mui/material";

interface NoteProps {
    title: string;
    content: string;
    createdate: string;
    updatedate: string;
}

// 日付をフォーマットする
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

export default function Note({ title, content, createdate, updatedate }: NoteProps) {
    console.log("createDate:", createdate);
    console.log("updateDate:", updatedate);

    return (
        <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
                {title}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1 }}>
                {content}
            </Typography>
            <Typography variant="caption" color="textSecondary">
                作成日: {formatDate(createdate)}  更新日: {formatDate(updatedate)}
            </Typography>
        </Paper>
    );
}