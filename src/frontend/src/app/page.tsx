"use client";

import InputForm from "../components/InputForm";
import Note from "@/components/Note";
import React, { use, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "../context/LabelProvider";

export default function Home() {
  const [notes, setNotes] = useState<{ id: string, title: string; content: string; label_id: string; createdate: string; updatedate: string }[]>([]);
  const { labels, fetchLabels } = useLabelContext();

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
      setNotes(data);
    } catch (error) {
      console.error("Error fetching notes", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);


  // メモ初期登録時のコールバック関数
  const handleInsert = (newId: string, newTitle: string, newContent: string, LabelId: string) => {

    setNotes(prevNote => [
      ...prevNote,
      {
        id: newId,
        title: newTitle,
        content: newContent,
        label_id: LabelId,
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
          ...note, title: newTitle, content: newContent, label_id: newLabel, updatedate: newUpdateDate
        }
          : note)
    );
  };

  // メモ削除ボタン押下時のコールバック関数
  const handleDelete = (id: string) => {
    setNotes(prevNote => prevNote.filter(note => note.id !== id));
  };

  if (labels === undefined) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <InputForm onInsert={handleInsert} />
      {/* メモ一覧表示 */}
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Grid key={index}>
            {/* Noteコンポーネントを生成 */}
            <Note id={note.id} title={note.title} content={note.content} label_id={note.label_id} createdate={note.createdate} updatedate={note.updatedate} onSave={handleSave} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}