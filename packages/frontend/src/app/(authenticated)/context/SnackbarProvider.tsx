"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

type SnackbarSeverity = "success" | "error" | "info" | "warning";

interface SnackbarMessage {
    message: string;
    severity: SnackbarSeverity;
}

interface SnackbarContextType {
    showSnackbar: (message: string, severity?: SnackbarSeverity) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false);
    const [snackbarData, setSnackbarData] = useState<SnackbarMessage>({
        message: "",
        severity: "info",
    });

    const showSnackbar = useCallback(
        (message: string, severity: SnackbarSeverity = "info") => {
            setSnackbarData({ message, severity });
            setOpen(true);
        },
        []
    );

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <SnackbarContext.Provider value={{ showSnackbar }}>
            {children}
            <Snackbar
                open={open}
                autoHideDuration={5000}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Alert
                    onClose={handleClose}
                    severity={snackbarData.severity}
                    sx={{ width: "100%" }}
                >
                    {snackbarData.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

export function useSnackbar() {
    const context = useContext(SnackbarContext);
    if (!context) {
        throw new Error("useSnackbar must be used within SnackBarProvider");
    }
    return context;
}