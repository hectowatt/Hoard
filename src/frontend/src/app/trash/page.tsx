"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";
import TrashNote from "@/components/TrashNote";


// 削除されたNoteを表示するページコンテンツ
export default function Home() {
  const [trashNotes, setTrashNotes] = useState<{ id: string, title: string; content: string; label_id: string, createdate: string; updatedate: string }[]>([]);
  const { labels, fetchLabels } = useLabelContext();

  // 画面描画時にDBからメモを全件取得して表示する
  const fetchTrashNotes = async () => {
    try {
      // バックエンドAPIからメモ情報を取得
      const response = await fetch("http://localhost:4000/api/notes/trash", {
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
      console.log("selected trash data:", JSON.stringify(data, null, 2));
      setTrashNotes(data);
    } catch (error) {
      console.error("Error fetching trash notes", error);
    }
  };

  useEffect(() => {
    fetchTrashNotes();
  }, []);

  // メモ復元ボタン押下時のコールバック関数
  const handleSave = (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => {
    if (setTrashNotes !== undefined) {
      setTrashNotes(prevNote => prevNote.filter(note => note.id !== id));
    } else {
      console.error("setNotes is undefined");
    };
  }

  // メモ削除ボタン押下時のコールバック関数
  const handleDelete = (id: string) => {
    if (setTrashNotes !== undefined) {
      setTrashNotes(prevNote => prevNote.filter(note => note.id !== id));
    } else {
      console.error("setNotes is undefined");
    };

    if (labels === undefined) {
      return <div>Loading...</div>;
    }
  };

  return (
    <Container>
      <p>ゴミ箱内のメモは７日後に削除されます</p>
      <Grid container spacing={2}>
        {trashNotes.map(note => (
          <Grid key={note.id}>
            <TrashNote
              id={note.id}
              title={note.title}
              content={note.content}
              label_id={note.label_id}
              createdate={note.createdate}
              updatedate={note.updatedate}
              onRestore={handleSave}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}