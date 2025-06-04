"use client";

import InputForm from "@/components/InputForm";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import Note from "@/components/Note";

// ルートページのコンテンツ
export default function Home() {
  const [notes, setNotes] = useState<{ id: string, title: string; content: string; label: string; createdate: string; updatedate: string }[]>([]);

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
      console.log("selected data:", JSON.stringify(data, null, 2));
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // メモ初期登録時のコールバック関数
  const handleInsert = (newTitle: string, newContent: string) => {
    setNotes(prevNote => [
      ...prevNote,
      {
        id: new Date().toISOString(),
        title: newTitle,
        content: newContent,
        // TODO: メモ初期登録時でもラベルを登録できるようにしたい
        label: "",
        createdate: new Date().toISOString(),
        updatedate: new Date().toISOString(),
      },
    ]);
  };

  // メモ保存ボタン押下時のコールバック関数
  const handleSave = (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => {
    setNotes(prevNote =>
      prevNote.map(
        note => note.id === id ? {
          ...note, title: newTitle, content: newContent, label: newLabel, updatedate: newUpdateDate
        }
          : note)
    );
  };

  // メモ削除ボタン押下時のコールバック関数
  const handleDelete = (id: string) => {
    console.log("redraw after delete");
    setNotes(prevNote => prevNote.filter(note => note.id !== id));
  };

  return (
    <Container>
      <InputForm onInsert={handleInsert} />
      {/* メモ一覧表示 */}
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Grid key={index}>
            {/* Noteコンポーネントを生成 */}
            <Note id={note.id} title={note.title} content={note.content} label={note.label} createdate={note.createdate} updatedate={note.updatedate} onSave={handleSave} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}