"use client";

import InputForm from "@/components/InputForm";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import Note from "@/components/Note";

// ルートページのコンテンツ
export default function Home() {
  const [notes, setNotes] = useState<{ title: string; content: string; createdate: string; updatedate: string }[]>([]);

  // 画面描画時にDBからメモを全件取得して表示する
  const fetchNotes = async () => {
    try {
      // バックエンドAPIからメモ情報を取得
      const response = await fetch("http://localhost:4000/api/notes", {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Get notes failed");
        return;
      }

      const data = await response.json();
      console.log("取得したデータ:", JSON.stringify(data, null, 2));
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <Container>
      <InputForm />
      {/* メモ一覧表示 */}
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Grid key={index}>
            {/* Noteコンポーネントを生成 */}
            <Note title={note.title} content={note.content} createdate={note.createdate} updatedate={note.updatedate} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}