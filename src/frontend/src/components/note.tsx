import React, { useState } from "react";

import {
    Grid,
    Typography,
    Container,
    Paper,
} from "@mui/material";

export default function Note() {

    const [notes, setNotes] = useState<{ title: String, content: String, createDate: String, updateDate: String }[]>([]);

    return (
        <Container>
            <Grid container spacing={2}>
                {notes.map((note, index) => (
                    <Grid>
                        <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                            {note.title && (
                                <Typography variant="h6" sx={{ mb: 1 }}>
                                    {note.title}
                                </Typography>
                            )}
                            <Typography variant="body1" whiteSpace="pre-line">
                                {note.content}
                            </Typography>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    )
}