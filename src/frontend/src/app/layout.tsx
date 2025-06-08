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
} from "@mui/material";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import LabelImportantOutlineRoundedIcon from "@mui/icons-material/LabelImportantOutlineRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import InputAdornment from "@mui/material/InputAdornment";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider } from "@mui/material/styles";
import CreateLabelDialog from "@/components/CreateLabelDialog";
import { LabelProvider } from "./context/LabelProvider";

const inter = Inter({ subsets: ["latin"] });

// サイドバー上部のアイコン
const aboveIcons = [<TextSnippetOutlinedIcon />, <LabelImportantOutlineRoundedIcon />];
// サイドバー下部のアイコン
const belowIcons = [<DeleteOutlineRoundedIcon />, <SettingsOutlinedIcon />];

// サイドバー上部
const navAboveItems = [
	{ text: "メモ", icon: aboveIcons[0], href: "/" },
	{ text: "ラベル", icon: aboveIcons[1], dialog: true }
];

// サイドバー下部
const navBelowItems = [
	{ text: "ゴミ箱", icon: belowIcons[0], href: "/trash" },
	{ text: "設定", icon: belowIcons[1], href: "/settings" }
];

// 検索バー
const searchBar = (
	<form>
		<TextField
			id="outlined-search-bar"
			variant="outlined"
			size="medium"
			placeholder="検索"
			sx={{
				width: "500px",
				backgroundColor: "#ffffff",
				borderRadius: "5px"
			}}
			InputProps={{
				endAdornment: (
					<InputAdornment position="end">
						<IconButton type="submit" aria-label="search">
							<SearchIcon style={{ fill: "gray" }} />
						</IconButton>
					</InputAdornment>
				)
			}}
		/>
	</form>
);

// カスタムテーマの作成
const theme = createTheme({
	palette: {
		primary: {
			main: "#6a5acd"
		},
		secondary: {
			main: "#F39809",
			light: "#f6ae54 ",
			contrastText: "#FFFFFF"
		}
	}
});

const metadata: Metadata = {
	title: "Hoard",
	description: "A Notes app with table and password lock"
};

const drawerWidth = 240;




export default function RootLayout({
	children
}: Readonly<{
	children: (props: { labels: string[], fetchLabels: () => Promise<void> }) => React.ReactNode;
}>) {
	const [labelDialogOpen, setLabelDialogOpen] = React.useState(false);
	const [labels, setLabels] = React.useState<string[]>([])

	// ラベル一覧を取得する
	const fetchLabels = async () => {
		const response = await fetch("http://localhost:4000/api/labels", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
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

	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider theme={theme}>
					<AppRouterCacheProvider>
						<LabelProvider>
							<Box sx={{ display: "flex" }}>
								<CssBaseline />
								<AppBar
									position="fixed"
									sx={{ zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "lemon yellow" }}
								>
									<Toolbar sx={{ display: "flex", justifyContent: "center" }}>
										<Box sx={{ flexGrow: 1 }}>
											<Typography variant="h6" noWrap component="div">
												Hoard
											</Typography>
										</Box>
										<Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>{searchBar}</Box>
										<Box sx={{ flexGrow: 1 }} />
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
							<CreateLabelDialog open={labelDialogOpen} onClose={() => setLabelDialogOpen(false)} onLabelUpdate={fetchLabels} />
						</LabelProvider>
					</AppRouterCacheProvider>
				</ThemeProvider>
			</body >
		</html >
	);
}
