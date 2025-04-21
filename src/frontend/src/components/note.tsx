"use client";

import React, { useState } from "react";

import {
    Box,
    TextField,
    Paper,
    Button,
    Collapse,
    Grid,
    Typography,
} from '@mui/material';

export default function Note() {

    const [expanded, setExpanded] = useState(false);
    const [title, setTitle] = useState("");
    const [inputContent, setContent] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [notes, setNotes] = useState<{ title: String, content: String }[]>([]);

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const handleExpanded = () => { setExpanded(true) };
    const handleCollapse = () => {
        setExpanded(false);
        setTitle("");
        setContent("");
    }

    const handleFormClick = () => {
        setIsEditing(true); // フォームがクリックされたときに編集モードにする 
    }

    const handleButtonClick = () => {
        if (!socket) {
            // WebSocketサーバに接続
            const newSocket = new WebSocket("ws://localhost:4000");
            newSocket.onopen = () => {
                console.log("Connected to server");
                //console.log("inputValue: ", inputValue);
                //newSocket.send(inputValue);
            }
            setSocket(newSocket);
            newSocket.onmessage = (event) => {
                console.log("message from server: ", event.data);
            }
            newSocket.onerror = (error) => {
                console.error("WebSocket Error: ", error);
            }
            newSocket.onclose = () => {
                console.log("WebSocket closed");
            }
        } else {
            // 既存の接続を使用してデータ送信
            //socket.send(inputValue);
        }

        setIsEditing(false); // 送信後に編集モードを解除
    }


    return (
        <div className="border border-gray-400 rounded-md p-4 hover:shadow-md transition-shadow duration-200">
        </div>
    )
}