"use client";

import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";
import TrashNote from "@/components/TrashNote";
import TrashTableNote from "@/components/TrashTableNote";


// 削除されたNoteを表示するページコンテンツ
export default function Home() {
  const [trashNotes, setTrashNotes] = useState<{ id: string, title: string; content: string; label_id: string, is_locked: boolean, createdate: string; updatedate: string }[]>([]);
  const [trashTableNotes, setTrashTableNotes] = useState<{ id: string, title: string; label_id: string, is_locked: boolean, createdate: string; updatedate: string }[]>([]);
  const { labels, fetchLabels } = useLabelContext();

  // 画面描画時にDBからノートを全件取得して表示する
  const fetchTrashNotes = async () => {
    try {
      // バックエンドAPIからノート情報を取得
      const response = await fetch("/api/notes/trash", {
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

  // 画面描画時にDBからノートを全件取得して表示する
  const fetchTrashTableNotes = async () => {
    try {
      // バックエンドAPIからノート情報を取得
      const response = await fetch("/api/tablenotes/trash", {
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
      setTrashTableNotes(data);
    } catch (error) {
      console.error("Error fetching trash notes", error);
    }
  };

  useEffect(() => {
    fetchTrashTableNotes();
  }, []);

  // ノート復元ボタン押下時のコールバック関数
  const handleSave = (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => {
    if (setTrashNotes !== undefined) {
      setTrashNotes(prevNote => prevNote.filter(note => note.id !== id));
    } else {
      console.error("setNotes is undefined");
    };
  }

  // ノート削除ボタン押下時のコールバック関数
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

  // テーブルノート復元ボタン押下時のコールバック関数
  const handleSaveTableNote = (id: string, newTitle: string, newLabel: string, newUpdateDate: string) => {
    if (setTrashNotes !== undefined) {
      setTrashNotes(prevNote => prevNote.filter(note => note.id !== id));
    } else {
      console.error("setNotes is undefined");
    };
  }

  // テーブルノート削除ボタン押下時のコールバック関数
  const handleDeleteTableNote = (id: string) => {
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
      <p data-testid="description">ゴミ箱内のノートは７日後に削除されます</p>
      <Grid container spacing={2}>
        {trashNotes.map(note => (
          <Grid key={note.id}>
            <TrashNote
              id={note.id}
              title={note.title}
              content={note.content}
              label_id={note.label_id}
              is_locked={note.is_locked}
              createdate={note.createdate}
              updatedate={note.updatedate}
              onRestore={handleSave}
              onDelete={handleDelete}
              data-testid="trashnote"
            />
          </Grid>
        ))}
        {trashTableNotes.map(tableNote => (
          <Grid key={tableNote.id}>
            <TrashTableNote
              id={tableNote.id}
              title={tableNote.title}
              label_id={tableNote.label_id}
              is_locked={tableNote.is_locked}
              createdate={tableNote.createdate}
              updatedate={tableNote.updatedate}
              onRestore={handleSaveTableNote}
              onDelete={handleDeleteTableNote}
              data-testid="trashtablenote"
            />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}