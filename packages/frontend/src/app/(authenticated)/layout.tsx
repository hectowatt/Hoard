"use client";

import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import Link from "next/link";

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
} from "@mui/material";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import LabelImportantOutlineRoundedIcon from "@mui/icons-material/LabelImportantOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import IconButton from "@mui/material/IconButton";
import { createTheme } from "@mui/material/styles";
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

const inter = Inter({ subsets: ["latin"] });

// サイドバー上部のアイコン
const aboveIcons = [<TextSnippetOutlinedIcon />, <LabelImportantOutlineRoundedIcon />];
// サイドバー下部のアイコン
const belowIcons = [<DeleteOutlineRoundedIcon />, <SettingsOutlinedIcon />];

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


const metadata: Metadata = {
	title: "Hoard",
	description: "A Notes app with table and password lock"
};

const drawerWidth = 240;




export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	const [labelDialogOpen, setLabelDialogOpen] = React.useState(false);
	const [labels, setLabels] = React.useState<string[]>([]);
	const [mode, setMode] = React.useState<"light" | "dark">("light");

	const router = useRouter();

	// カスタムテーマの作成
	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					primary: {
						main: "#e3a838", // プライマリカラーを設定
					},
					mode,
					...(mode === "dark"
						? {
							background: {
								default: "#2c2c2c",
								paper: "#2c2c2c",   // ダイアログやカードの背景も調整
							},
						}
						: {}),
				},
			}),
		[mode]
	);

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
		setMode((prev) => (prev === "light" ? "dark" : "light"));
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


	return (
		<html lang="en">
			<body className={inter.className}>
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
													backgroundColor: "#e3a838"
												}}
												color="primary"
											>
												<Toolbar sx={{ display: "flex", justifyContent: "center" }}>
													<Box sx={{ flexGrow: 1 }}>
														<img
															src="/Hoard_logo.png"
															alt="Hoard Logo"
															style={{ height: 29, objectFit: "contain" }}
														/>
													</Box>
													<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
														<SearchWordBar mode={mode} />
													</Box>
													<Box sx={{ flexGrow: 1 }} />
													<IconButton
														sx={{ position: "fixed", top: 12, right: 70, zIndex: 2000 }}
														onClick={toggleColorMode}
														color="inherit"
														data-testid="togglecolormode"
													>
														{mode === "dark" ? <Brightness2OutlinedIcon /> : <LightModeOutlinedIcon />}
													</IconButton>
													<IconButton
														sx={{ position: "fixed", top: 12, right: 15, zIndex: 2000 }}
														onClick={handleLogOut}
														color="inherit"
														data-testid="togglecolormode">
														<LogoutOutlinedIcon></LogoutOutlinedIcon>
													</IconButton>
												</Toolbar>
											</AppBar>
											<Drawer
												variant="permanent"
												sx={{
													width: drawerWidth,
													flexShrink: 0,
													[`& .MuiDrawer-paper`]: {
														width: drawerWidth,
														boxSizing: "border-box"
													}
												}}
											>
												<Toolbar />
												<Box sx={{ overflow: "auto" }}>
													<List>
														{navAboveItems.map(({ text, icon, href, dialog }) => (
															<ListItem key={text} disablePadding>
																{dialog ? (
																	<ListItemButton onClick={() => setLabelDialogOpen(true)}>
																		<ListItemIcon>{icon}</ListItemIcon>
																		<ListItemText primary={text} />
																	</ListItemButton>
																) : (
																	<ListItemButton component={Link} href={href!}>
																		<ListItemIcon>{icon}</ListItemIcon>
																		<ListItemText primary={text} />
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
																	<ListItemIcon>{icon}</ListItemIcon>
																	<ListItemText primary={text} />
																</ListItemButton>
															</ListItem>

														))}
													</List>
												</Box>
											</Drawer>
											<Box component="main" sx={{ flexGrow: 1, p: 3 }}>
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
			</body >
		</html >
	);
}
