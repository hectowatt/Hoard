"use client";

import React, { useState } from "react";

export default function Note() {

    const [inputValue, setInputValue] = useState("");
    const [isEditing, setIsEditing] = useState(false);
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(event.target.value);
    }

    const handleFormClick = () => {
        setIsEditing(true); // フォームがクリックされたときに編集モードにする 
    }

    const handleBlur = () => {
        if (inputValue === "") {
            setIsEditing(false); // 入力が空の場合は編集モードを解除
        }
    }

    const handleButtonClick = () => {
        if (!socket) {
            // WebSocketサーバに接続
            const newSocket = new WebSocket("ws://localhost:4000");
            newSocket.onopen = () => {
                console.log("Connected to server");
                console.log("inputValue: ", inputValue);
                newSocket.send(inputValue);
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
            socket.send(inputValue);
        }

        setInputValue(""); // 送信後に入力フィールドをクリア
        setIsEditing(false); // 送信後に編集モードを解除
    }


    return (
        <div className="border border-gray-400 rounded-md p-4 hover:shadow-md transition-shadow duration-200"
            onClick={handleFormClick}>
            {isEditing ? (
                <div>
                    <textarea
                        className="text-black w-full h-20 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        placeholder="入力を開始..."
                        autoFocus
                    />
                    <button
                        type="button"
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200"
                        onClick={handleButtonClick}
                    >
                        保存
                    </button>
                </div>
            ) : (
                <p className="text-gray-500">メモを入力...</p>
            )}
        </div>
    )
}