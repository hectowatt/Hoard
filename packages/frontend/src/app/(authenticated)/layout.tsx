"use client";

import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Link from "next/link";
import { useThemeMode } from "../context/ThemeProvider";

import {
	Box,
	CssBaseline,
	AppBar,
	Toolbar,
	Typography,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Table,
	useMediaQuery,
} from "@mui/material";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import LabelImportantOutlineRoundedIcon from "@mui/icons-material/LabelImportantOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import IconButton from "@mui/material/IconButton";
import { createTheme, useTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CreateLabelDialog from "@/app/(authenticated)/components/CreateLabelDialog";
import { LabelProvider } from "./context/LabelProvider";
import { NoteProvider } from "@/app/(authenticated)/context/NoteProvider";
import { TableNoteProvider } from "@/app/(authenticated)/context/TableNoteProvider";
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import Brightness2OutlinedIcon from '@mui/icons-material/Brightness2Outlined';
import { SearchWordProvider, useSearchWordContext } from "@/app/(authenticated)/context/SearchWordProvider";
import SearchWordBar from "@/app/(authenticated)/components/SearchWordBar";
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';

const inter = Inter({ subsets: ["latin"] });

// サイドバー上部のアイコン
const aboveIcons = [<TextSnippetOutlinedIcon data-testid="noteicon" />, <LabelImportantOutlineRoundedIcon data-testid="labelicon" />];
// サイドバー下部のアイコン
const belowIcons = [<DeleteOutlineRoundedIcon data-testid="trashicon" />, <SettingsOutlinedIcon data-testid="settingicon" />];

// サイドバー上部
const navAboveItems = [
	{ text: "ノート", icon: aboveIcons[0], href: "/" },
	{ text: "ラベル", icon: aboveIcons[1], dialog: true }
];

// サイドバー下部
const navBelowItems = [
	{ text: "ゴミ箱", icon: belowIcons[0], href: "/trash" },
	{ text: "設定", icon: belowIcons[1], href: "/settings" }
];

const drawerWidthOpen = 180;
const drawerWidthClosed = 60; // アイコンのみの時の幅

export default function AuthenticatedLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [labelDialogOpen, setLabelDialogOpen] = React.useState(false);
	const [labels, setLabels] = React.useState<string[]>([]);
	const { mode, setMode } = useThemeMode();
	const router = useRouter();
	const theme = useTheme();
	const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

	// useMediaQueryを使って画面サイズを判定
	const themeForMediaQuery = useTheme();
	// md (900px) より小さい画面で isSmallScreen が true になる
	const isSmallScreen = useMediaQuery(themeForMediaQuery.breakpoints.down("md"));

	// 現在のDrawerの幅をstateとして管理
	const currentDrawerWidth = isDrawerOpen ? drawerWidthOpen : drawerWidthClosed;

	//クライアントサイドでのみテーマを決定する
	React.useEffect(() => {
		const THEME_KEY = process.env.THEME_KEY ? process.env.THEME_KEY : "hoard_theme_mode";
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

	// モードが変わったら localStorage に保存
	React.useEffect(() => {
		if (mode) { // modeがnullでない場合のみ保存
			try {
				const THEME_KEY = process.env.THEME_KEY ? process.env.THEME_KEY : "hoard_theme_mode";
				window.localStorage.setItem(THEME_KEY, mode);
			} catch {
				// なにもしない
			}
		}
	}, [mode]);

	// ラベル一覧を取得する
	const fetchLabels = async () => {
		const response = await fetch("/api/labels", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include"
		});
		if (!response.ok) {
			throw new Error("Failed to fetch labels");
		}
		const data = await response.json();
		setLabels(data);
	};

	React.useEffect(() => {
		fetchLabels();
	}
		, []);

	const toggleColorMode = () => {
		setMode(mode === "light" ? "dark" : "light");
	};

	const handleLogOut = async () => {
		try {
			const response = await fetch("/api/logout", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include"
			})

			if (response.ok) {
				alert("ログアウトしました。");
				// ログアウト後はログインページにリダイレクト
				router.push("/login");
			}
		} catch (error) {
			console.error("Logout failed:", error);
			alert("ログアウトに失敗しました。");
		}
	}

	if (!mode) {
		return null;
	}

	return (
		<ThemeProvider theme={theme}>
			<AppRouterCacheProvider>
				<SearchWordProvider>
					<NoteProvider>
						<TableNoteProvider>
							<LabelProvider>
								<Box sx={{ display: "flex" }}>
									<CssBaseline />
									<AppBar
										position="fixed"
										sx={{
											zIndex: (theme) => theme.zIndex.drawer + 1,
											backgroundColor: "primary.main",
											transition: theme.transitions.create(["width", "margin"], {
												easing: theme.transitions.easing.sharp,
												duration: theme.transitions.duration.enteringScreen,
											}),
											paddingTop: 'env(safe-area-inset-top)',
										}}
									>
										<Toolbar sx={{ display: "flex", alignItems: "center", gap: 2 }}>
											<Box sx={{
												flexGrow: { xs: 0, md: 1 },
												flexShrink: 0,
											}}>
												{isSmallScreen ? <img
													src="/Hoard.png"
													alt="Hoard Icon"
													style={{ height: 29, objectFit: "contain", display: "block" }}
												/> :
													<img
														src="/Hoard_logo.png"
														alt="Hoard Logo"
														style={{ height: 29, objectFit: "contain", display: "block" }}
													/>}
											</Box>
											<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
												<SearchWordBar mode={mode} />
											</Box>
											<Box sx={{
												flexGrow: { xs: 0, md: 1 }, display: "flex",
												justifyContent: "flex-end",
											}} />
											<IconButton
												onClick={toggleColorMode}
												color="inherit"
												data-testid="togglecolormode"
											>
												{mode === "dark" ? <Brightness2OutlinedIcon data-testid="Brightness2OutlinedIcon" /> : <LightModeOutlinedIcon data-testid="LightModeOutlinedIcon" />}
											</IconButton>
											<IconButton
												onClick={handleLogOut}
												color="inherit"
												data-testid="togglecolormode">
												<LogoutOutlinedIcon></LogoutOutlinedIcon>
											</IconButton>
										</Toolbar>
									</AppBar>
									<Drawer
										variant="permanent"
										open={isDrawerOpen}
										sx={{
											// Drawerの幅を動的に設定
											width: currentDrawerWidth,
											flexShrink: 0,
											[`& .MuiDrawer-paper`]: {
												width: currentDrawerWidth,
												boxSizing: "border-box",
												overflowX: "hidden",
												transition: theme.transitions.create("width", {
													easing: theme.transitions.easing.sharp,
													duration: theme.transitions.duration.enteringScreen,
												}),
											}
										}}
									>
										<Toolbar />
										<Box sx={{ overflowY: "auto", overflowX: "hidden" }}>
											<List>
												<ListItemButton onClick={() => setIsDrawerOpen(!isDrawerOpen)}>
													<ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
														<MenuOutlinedIcon />
													</ListItemIcon>
												</ListItemButton>
												{navAboveItems.map(({ text, icon, href, dialog }) => (
													<ListItem key={text} disablePadding>
														{dialog ? (
															<ListItemButton onClick={() => setLabelDialogOpen(true)}>
																<ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
																	{icon}
																</ListItemIcon>
																{isDrawerOpen && <ListItemText primary={text} sx={{
																	opacity: isDrawerOpen ? 1 : 0,
																	whiteSpace: 'nowrap',
																	transition: (theme) => theme.transitions.create('opacity', {
																		duration: theme.transitions.duration.enteringScreen,
																	})
																}} />}
															</ListItemButton>
														) : (
															<ListItemButton component={Link} href={href!}>
																<ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
																	{icon}
																</ListItemIcon>
																{isDrawerOpen && <ListItemText primary={text} sx={{
																	opacity: isDrawerOpen ? 1 : 0,
																	whiteSpace: 'nowrap',
																	transition: (theme) => theme.transitions.create('opacity', {
																		duration: theme.transitions.duration.enteringScreen,
																	})
																}} />}
															</ListItemButton>
														)}
													</ListItem>
												))}
											</List>
											<Divider />
											<List>
												{navBelowItems.map(({ text, icon, href }) => (
													<ListItem key={text} disablePadding>
														<ListItemButton component={Link} href={href}>
															<ListItemIcon sx={{ minWidth: 0, justifyContent: 'center' }}>
																{icon}
															</ListItemIcon>
															{isDrawerOpen && <ListItemText primary={text} sx={{
																opacity: isDrawerOpen ? 1 : 0,
																whiteSpace: 'nowrap',
																transition: (theme) => theme.transitions.create('opacity', {
																	duration: theme.transitions.duration.enteringScreen,
																})
															}} />}
														</ListItemButton>
													</ListItem>
												))}
											</List>
										</Box>
									</Drawer>
									<Box component="main" sx={{
										flexGrow: 1, p: 3, width: `calc(100% - ${currentDrawerWidth}px)`,
										overflowX: 'hidden',
									}}>
										<Toolbar />
										{children}
									</Box>
								</Box>
								<CreateLabelDialog open={labelDialogOpen} onClose={() => setLabelDialogOpen(false)} />
							</LabelProvider>
						</TableNoteProvider>
					</NoteProvider>
				</SearchWordProvider>
			</AppRouterCacheProvider>
		</ThemeProvider>
	);
}
