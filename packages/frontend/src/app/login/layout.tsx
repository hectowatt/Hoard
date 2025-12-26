"use client";

import { Box } from '@mui/material';
import React from 'react';

const backgroundColor = '#e3a838';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Box
            component="main"
            sx={{
                minHeight: '100dvh',
                pt: 'env(safe-area-inset-top)',
                pb: 'env(safe-area-inset-bottom)',
                bgcolor: backgroundColor,
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            {children}
        </Box>
    );
}