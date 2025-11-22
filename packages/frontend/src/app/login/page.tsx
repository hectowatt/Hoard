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
import ThemeRegistry from "@/app/context/ThemeProvider";
import { useTranslation } from "react-i18next";


export default function LoginPage() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [isUserExists, setIsUserExists] = React.useState(false);
    const [isChecking, setIsChecking] = React.useState(true);
    const router = useRouter();
    const { t } = useTranslation();

    // ログイン用処理
    const handleLogin = async () => {
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
        try {
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
        } catch (error) {
            console.error("failed to check user existence");
        } finally {
            setIsChecking(false);
        }

    };

    useEffect(() => {
        checkUserExists();
    }, []);

    const renderButton = () => {
        if (isChecking) {
            // チェック中はローディングを表示するか、単にnullを返す
            return <Button variant="contained" disabled data-testid="loading">読み込み中...</Button>;
        }

        if (isUserExists) {
            return (
                <Button variant="contained" color="primary" onClick={handleLogin} data-testid="login">
                    {t("button_login")}
                </Button>
            );
        } else {
            return (
                <Button variant="contained" color="primary" onClick={handleRegistUser} data-testid="makeuser">
                    {t("button_create_user")}
                </Button>
            );
        }
    };

    return (
        <ThemeRegistry>
            <Box sx={{
                minHeight: "100vh",
                height: "100%",
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
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <TextField
                            label={t("placeholder_username")}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            fullWidth
                            data-testid="username"
                            variant="outlined"
                            InputProps={{
                                sx: {
                                    color: "#000000",
                                    "&::placeholder": {
                                        color: "#9e9e9e",
                                        opacity: 1, // ブラウザによる自動的な透過を防ぐ
                                    }
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: "#000000", // 通常時のラベル色
                                    // ★フォーカスが当たった時もラベル色を黒に固定
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    }
                                }
                            }}
                        />
                        <TextField
                            label={t("placeholder_password")}
                            type="password"
                            value={password}
                            variant="outlined"
                            onChange={(e) =>
                                setPassword(e.target.value)} fullWidth data-testid="password"
                            InputProps={{
                                sx: {
                                    color: "#000000",
                                    "&::placeholder": {
                                        color: "#9e9e9e",
                                        opacity: 1, // ブラウザによる自動的な透過を防ぐ
                                    }
                                },
                            }}
                            InputLabelProps={{
                                sx: {
                                    color: "#000000", // 通常時のラベル色
                                    // ★フォーカスが当たった時もラベル色を黒に固定
                                    "&.Mui-focused": {
                                        color: "#000000",
                                    }
                                }
                            }} />
                        {renderButton()}
                    </Box>
                </Paper>
            </Box>
        </ThemeRegistry>);
}