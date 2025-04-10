"use client";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import React from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <meta
          name="description"
          content="Generated by create next app"
        />
        <meta
          name="og:title"
          content="Create Next App"
        />
        <meta
          name="og:description"
          content="Generated by create next app"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        {/* サイドバー */}
        <aside
          className={`fixed top-0 left-0 h-full bg-gray-500 border-r border-gray-500 transition-transform duration-300 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          style={{ width: "250px", top: "48px" }}
        >
          <div className="p-4">

            <ul className="mt-4 space-y-2">
              <li>
                <button className="w-full text-left px-4 py-2 bg-black rounded hover:bg-gray-300">
                  メモ
                </button>
              </li>
              <li>
                <button className="w-full text-left px-4 py-2 bg-black rounded hover:bg-gray-300">
                  ゴミ箱
                </button>
              </li>
            </ul>
          </div>
        </aside>

        <div className="flex-1 ml-0 transition-all duration-300">
          <header className="flex justify-between px-4 py-2 bg-gray-500 text-black border-b border-gray-300">
            <div className="flex items-center" style={{ width: "230px" }}>
              <button
                className="flex flex-col justify-between h-5 w-7 bg-transparent border-none cursor-pointer"
                onClick={toggleSidebar}
                aria-label="Toggle Sidebar"
              >
                <span className="block h-1 w-full bg-white rounded"></span>
                <span className="block h-1 w-full bg-white rounded"></span>
                <span className="block h-1 w-full bg-white rounded"></span>
              </button>
              <h1 className="text-lg font-bold flex-1 ml-2">Hoard</h1>
            </div>
            <input
              type="text"
              placeholder="検索"
              className="ml-4 px-3 py-1 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </header>
          <main className="p-4">{children}</main>
        </div>
      </body>
    </html>
  );
}
