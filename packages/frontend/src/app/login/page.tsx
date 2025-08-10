"use client";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import React, { useState } from "react";

export default function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        console.log("ログイン:", { username, password });
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({
                username: username,
                password: password
            })
        })

        if (response.ok) {
            console.log("ログイン成功");
        } else {
            const errorData = await response.json();
            alert("ログインに失敗しました: " + errorData.message);
        }
    };

    return (
        <>
            <img src="Hoard_logo.png" width={552} height={135} style={{ marginBottom: "20px" }}></img>
            <Paper elevation={3} sx={{ p: 4 }} style={{ backgroundColor: "#faebd7" }}>
                <Typography variant="h5" component="h1" gutterBottom>
                    ログイン
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="ユーザー名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                    />
                    <TextField
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        fullWidth
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                    >
                        ログイン
                    </Button>
                </Box>
            </Paper>
        </>
    );
}