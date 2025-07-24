"use client";

import InputForm from "../components/InputForm";
import Note from "@/components/Note";
import React, { use, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "@/context/LabelProvider";
import { useNoteContext } from "@/context/NoteProvider";
import { useTableNoteContext } from "@/context/TableNoteProvider";
import TableNote from "@/components/TableNote";
import { useSearchWordContext } from "@/context/SearchWordProvider";

type Column = {
  id: number;
  name: string;
  order?: number;
}

type RowCell = {
  id: number;
  rowIndex: number;
  value: string;
  columnId?: number;
}

export default function Home() {
  const { notes, setNotes, fetchNotes } = useNoteContext();
  const { labels, fetchLabels } = useLabelContext();
  const { tableNotes, setTableNotes, fetchTableNotes } = useTableNoteContext();
  const { searchWord } = useSearchWordContext();

  const trimmedSearchWord = searchWord ? searchWord.trim().toLowerCase() : "";
  const filterdNotes = searchWord ? notes.filter(note => note.title.toLowerCase().includes(trimmedSearchWord) || note.content.toLowerCase().includes(trimmedSearchWord)) : notes;

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchTableNotes();
  }, []);


  // ノート初期登録時のコールバック関数
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
          is_locked: is_locked
        },
      ]);
    } else {
      console.error("setNotes is undefined");
    };
  }

  // テーブルノート初期登録時のコールバック関数
  const handleInsertTableNote = (newId: string, newTitle: string, newLabel: string, is_locked: boolean, newColumn: Column[], newRowCells: RowCell[][]) => {
    if (setTableNotes !== undefined) {
      setTableNotes(prevTableNotes => [
        ...prevTableNotes,
        {
          id: newId,
          title: newTitle,
          label_id: newLabel,
          createdate: new Date().toISOString(),
          updatedate: new Date().toISOString(),
          is_locked: is_locked,
          columns: newColumn,
          rowCells: newRowCells
        },
      ]);
    } else {
      console.error("setNotes is undefined");
    };
  }

  // ノート保存ボタン押下時のコールバック関数
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
      console.error("error in handleSave: setNotes is undefined");
    };
  }


  // ノート削除ボタン押下時のコールバック関数
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

  // テーブルノート保存ボタン押下時のコールバック関数
  const handleSaveTableNote = (id: string, newTitle: string, newLabel: string, is_Locked: boolean, newUpdateDate: string, newColumn: Column[], newRowCells: RowCell[][]) => {
    if (setTableNotes !== undefined) {
      setTableNotes(prevTableNote =>
        prevTableNote.map(
          tableNote => tableNote.id === id ? {
            ...tableNote, title: newTitle, label_id: newLabel, is_Locked: is_Locked, updatedate: newUpdateDate, columns: newColumn, rowCells: newRowCells
          }
            : tableNote)
      );
    } else {
      console.error("error in handleSave: setNotes is undefined");
    };
  }

  // テーブルノート削除ボタン押下時のコールバック関数
  const handleDeleteTableNote = (id: string) => {
    if (setTableNotes !== undefined) {
      setTableNotes(prevTableNote => prevTableNote.filter(tableNote => tableNote.id !== id));
    } else {
      console.error("setNotes is undefined");
    };

    if (labels === undefined) {
      return <div>Loading...</div>;
    }
  };

  return (
    <Container>
      <InputForm onInsert={handleInsert} onInsertTableNote={handleInsertTableNote} />
      {/* ノートとテーブルノート一覧表示 */}
      <Grid container spacing={2}>
        {filterdNotes.map((note, index) => (
          <Grid key={index}>
            {/* Noteコンポーネントを生成 */}
            <Note {...note} onSave={handleSave} onDelete={handleDelete} />
          </Grid>
        ))}
        {tableNotes.map((tableNote, index) => (
          <Grid key={index}>
            {/* TableNoteコンポーネントを生成 */}
            <TableNote {...tableNote} onSave={handleSaveTableNote} onDelete={handleDeleteTableNote} />
          </Grid>
        ))}

      </Grid>
    </Container>
  );
}