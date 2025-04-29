"use client";

import type { Metadata } from "next";
import React from "react";
import { Inter } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

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
	Divider
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

const inter = Inter({ subsets: ["latin"] });

// サイドバー上部のアイコン
const aboveIcons = [<TextSnippetOutlinedIcon />, <LabelImportantOutlineRoundedIcon />];
// サイドバー下部のアイコン
const belowIcons = [<DeleteOutlineRoundedIcon />, <SettingsOutlinedIcon />];

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

const theme = createTheme({
	palette: {
		primary: {
			main: "#ffee58"
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
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ThemeProvider theme={theme}>
					<AppRouterCacheProvider>
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
										{["メモ", "ラベル"].map((text, index) => (
											<ListItem key={text} disablePadding>
												<ListItemButton>
													<ListItemIcon>{aboveIcons[index]}</ListItemIcon>
													<ListItemText primary={text} />
												</ListItemButton>
											</ListItem>
										))}
									</List>
									<Divider />
									<List>
										{["ごみ箱", "設定"].map((text, index) => (
											<ListItem key={text} disablePadding>
												<ListItemButton>
													<ListItemIcon>{belowIcons[index]}</ListItemIcon>
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
					</AppRouterCacheProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
