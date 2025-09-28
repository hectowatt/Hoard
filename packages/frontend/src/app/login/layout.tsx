"use client";

import React from "react";
import { ThemeProvider, CssBaseline, Container, createTheme, Box } from "@mui/material";
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
            <Box
                sx={{
                    minHeight: "100vh",
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    bgcolor: "#e3a838",
                }}
            >
                {children}
            </Box>
        </ThemeProvider>
    );
}