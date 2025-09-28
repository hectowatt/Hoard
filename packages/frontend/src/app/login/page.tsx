"use client";

import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";


export default function LoginPage() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isUserExists, setIsUserExists] = React.useState(false);
    const router = useRouter();

    // ログイン用処理
    const handleLogin = async () => {
        console.log("ログイン:", { username, password });
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: "include"
        })

        if (response.ok) {
            console.log("login success!");
            router.push("/");
        } else {
            const errorData = await response.json();
            alert("failed to login");
        }
    };

    // 初回ユーザ作成処理
    const handleRegistUser = async () => {
        const response = await fetch("/api/user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: username,
                password: password
            }),
            credentials: "include"
        })

        if (response.ok) {
            console.log("create user success!");
            router.push("/");
        } else {
            const errorData = await response.json();
            alert("failed to create user: " + errorData.message);
        }
    };

    // 既存ユーザ存在チェック
    const checkUserExists = async () => {
        const response = await fetch("/api/user/isexist", {
            method: "GET",
            credentials: "include"
        });
        if (response.ok) {
            const isExist = await response.json();
            if (isExist && isExist.exists === true) {
                setIsUserExists(true);
            }
        } else {
            console.error("failed to check user existence");
        };

    };

    useEffect(() => {
        checkUserExists();
    }, []);

    return (
        <Box sx={{
            minHeight: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: "#e3a838", p: 2,
        }}>
            <Image src="/Hoard_logo.png"
                alt="Logo"
                width={552}
                height={135}
                style={{
                    maxWidth: "100%", height: "auto",
                    marginBottom: "20px",
                }} />
            <Paper elevation={3} sx={{ p: 4 }} style={{ backgroundColor: "#faebd7" }}>
                <Typography
                    variant="h5"
                    component="h1"
                    gutterBottom> ログイン </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <TextField
                        label="ユーザー名"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        fullWidth
                        data-testid="username" />
                    <TextField
                        label="パスワード"
                        type="password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)} fullWidth data-testid="password" />
                    {isUserExists ? <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLogin}
                        data-testid="login"> ログイン </Button> :
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleRegistUser}
                            data-testid="makeuser"> ユーザ作成</Button>}
                </Box>
            </Paper>
        </Box>);
}