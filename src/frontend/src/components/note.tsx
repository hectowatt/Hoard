"use client";

import React, { useState } from "react";

export default function Note() {

    const [inputValue, setInputValue] = useState("");
    const [socket, setSocket] = useState<WebSocket | null>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(event.target.value);
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
    }


    return (
        <div>
            <form>
                <p>入力：
                    <input className="text-black"
                        type="text"
                        name="name"
                        value={inputValue}
                        onChange={handleInputChange}
                    >
                    </input>
                </p>
            </form>
            <p><button
                type="button"
                id="button1"
                className="border border-gray-400 px-4 py-2 rounded-md hover:bg-gray-500 hover:text-white active:bg-gray-700 active:border-blue-700 transition-colors duration-200 focus:outline-none"
                onClick={handleButtonClick}
            >
                送信
            </button>
            </p>
        </div>
    )
}