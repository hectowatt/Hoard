"use client";

import React from "react";
import { ThemeProvider, CssBaseline, Container, createTheme } from "@mui/material";
import { Metadata } from "next";

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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                maxWidth="sm"
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    minHeight: "100vh",
                    backgroundColor: "#e3a838",
                }}
            >
                {children}
            </Container>
        </ThemeProvider>
    );
}