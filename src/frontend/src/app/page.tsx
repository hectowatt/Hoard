"use client";

import InputForm from "../components/InputForm";
import Note from "@/components/Note";
import React, { use, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";
import { useNoteContext } from "@/context/NoteProvider";

export default function Home() {
  const { notes, setNotes, fetchNotes } = useNoteContext();
  const { labels, fetchLabels } = useLabelContext();

  useEffect(() => {
    fetchNotes();
  }, []);


  // メモ初期登録時のコールバック関数
  const handleInsert = (newId: string, newTitle: string, newContent: string, LabelId: string, is_locked: boolean) => {
    if (setNotes !== undefined) {
      setNotes(prevNote => [
        ...prevNote,
        {
          id: newId,
          title: newTitle,
          content: newContent,
          label_id: LabelId,
          createdate: new Date().toISOString(),
          updatedate: new Date().toISOString(),
          is_locked: is_locked,
        },
      ]);
    } else {
      console.error("setNotes is undefined");
    };
  }

  // メモ保存ボタン押下時のコールバック関数
  const handleSave = (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => {
    if (setNotes !== undefined) {
      setNotes(prevNote =>
        prevNote.map(
          note => note.id === id ? {
            ...note, title: newTitle, content: newContent, label_id: newLabel, updatedate: newUpdateDate
          }
            : note)
      );
    } else {
      console.error("setNotes is undefined");
    };
  }

  // メモ削除ボタン押下時のコールバック関数
  const handleDelete = (id: string) => {
    if (setNotes !== undefined) {
      setNotes(prevNote => prevNote.filter(note => note.id !== id));
    } else {
      console.error("setNotes is undefined");
    };

    if (labels === undefined) {
      return <div>Loading...</div>;
    }
  };

  return (
    <Container>
      <InputForm onInsert={handleInsert} />
      {/* メモ一覧表示 */}
      <Grid container spacing={2}>
        {notes.map((note, index) => (
          <Grid key={index}>
            {/* Noteコンポーネントを生成 */}
            <Note id={note.id} title={note.title} content={note.content} label_id={note.label_id} createdate={note.createdate} updatedate={note.updatedate} is_locked={note.is_locked} onSave={handleSave} onDelete={handleDelete} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}