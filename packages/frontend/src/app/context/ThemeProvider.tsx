'use client';

import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import React, { createContext, useCallback, useContext, useMemo } from 'react';

// テーマ管理用コンテキストを作成
export const ThemeModeContext = createContext<{
    mode: "light" | "dark";
    setMode: (mode: "light" | "dark") => Promise<void>;
} | undefined>(undefined);

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);
    if (!context) {
        throw new Error("useThemeMode must be used within a ThemeModeProvider");
    }
    return context;
};

const THEME_KEY = process.env.THEME_KEY ? process.env.THEME_KEY : "hoard_theme_mode";

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = React.useState<"light" | "dark" | null>(null);
    const themeForMediaQuery = useTheme();

    // クライアントサイドでlocalStorageからテーマモードを取得
    React.useEffect(() => {

        let determinedMode: "light" | "dark" = "light";

        const stored = window.localStorage.getItem(THEME_KEY);
        if (stored === "dark" || stored === "light") {
            determinedMode = stored;
        } else {
            // 未設定なら OS の設定を参照
            try {
                determinedMode = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            } catch {
                // 何もしない (デフォルトの"light"が使われる)
            }
        }
        setMode(determinedMode);
    }, []);

    const setModeHandler = useCallback(async (newMode: "light" | "dark") => {
        try {
            setMode(newMode);
        } catch (error) {
            console.error("Failed to set theme mode in localStorage", error);
        }
    }, []);

    const contextValue = useMemo(() => ({
        mode: mode as "light" | "dark",
        setMode: setModeHandler,
    }), [mode, setModeHandler]);

    if (mode === null) {
        return null;
    }

    const theme = createTheme({
        palette: {
            primary: {
                main: "#e3a838",
            },
            tonalOffset: 0,
            // modeがnullの場合は'light'をフォールバックとして使用
            mode: mode || 'light',
            ...(mode === "dark"
                ? {
                    primary: {
                        main: "#e3a838",
                    },
                    background: {
                        default: "#000000",
                        paper: "#000000",
                    },
                }
                : {}),
        },
        components: {
            MuiAppBar: {
                styleOverrides: {
                    root: ({ theme }) =>
                        theme.palette.mode === 'dark'
                            ? {
                                // elevationによる色の変化（オーバーレイ）を無効化
                                backgroundImage: 'none',
                                backgroundColor: theme.palette.primary.main,
                            }
                            : {},
                },
            }
        },
        transitions: {
            create: (props, options) => themeForMediaQuery.transitions.create(props, options),
        },
    });

    return (
        <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeModeContext.Provider value={contextValue}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </ThemeModeContext.Provider>
        </AppRouterCacheProvider>
    );
}