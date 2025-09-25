"use client";

import React from "react";
import { ThemeProvider, CssBaseline, Container, createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: "#e3a838",
        },
    },
});

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body style={{ backgroundColor: "#e3a838" }}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <Container
                        maxWidth="sm"
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            minHeight: "100vh",
                        }}
                    >
                        {children}
                    </Container>
                </ThemeProvider>
            </body>
        </html>
    );
}