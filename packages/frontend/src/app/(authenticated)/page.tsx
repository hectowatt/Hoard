"use client";

import InputForm from "./components/InputForm";
import Note from "@/app/(authenticated)/components/Note";
import React, { use, useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";
import { useLabelContext } from "@/app/(authenticated)/context/LabelProvider";
import { useNoteContext } from "@/app/(authenticated)/context/NoteProvider";
import { useTableNoteContext } from "@/app/(authenticated)/context/TableNoteProvider";
import TableNote from "@/app/(authenticated)/components/TableNote";
import { useSearchWordContext } from "@/app/(authenticated)/context/SearchWordProvider";
import { redirect } from "next/navigation";

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

  // label_idに紐づくlabelnameを取得する
  const getLabelNameById = (label_id: string) => {
    const label = labels.find(label => label.id === label_id);
    return label ? label.labelname : "";
  };

  const trimmedSearchWord = searchWord ? searchWord.trim().toLowerCase() : "";
  const filterdNotes = searchWord ? notes.filter(note => note.title.toLowerCase().includes(trimmedSearchWord) || note.content.toLowerCase().includes(trimmedSearchWord) || getLabelNameById(note.label_id).toLowerCase().includes(trimmedSearchWord)) : notes;
  const filterdTableNotes = searchWord ? tableNotes.filter(tableNote => tableNote.title.toLowerCase().includes(trimmedSearchWord) || tableNote.columns.some(column => column.name.toLowerCase().includes(trimmedSearchWord)) || tableNote.rowCells.some(row => row.some(cell => cell.value.toLowerCase().includes(trimmedSearchWord))) || getLabelNameById(tableNote.label_id).toLowerCase().includes(trimmedSearchWord)) : tableNotes;

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    fetchTableNotes();
  }, []);


  // ノート初期登録時のコールバック関数
  const handleInsert = (newId: string, newTitle: string, newContent: string, LabelId: string, is_locked: boolean) => {
    if (setNotes !== undefined) {
      setNotes(prevNote => {
        const newNotes = [
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
        ];
        return newNotes.sort((a, b) => new Date(b.updatedate).getTime() - new Date(a.updatedate).getTime());
      });
    } else {
      console.error("setNotes is undefined");
    };
  }

  // テーブルノート初期登録時のコールバック関数
  const handleInsertTableNote = (newId: string, newTitle: string, newLabel: string, is_locked: boolean, newColumn: Column[], newRowCells: RowCell[][]) => {
    if (setTableNotes !== undefined) {
      setTableNotes(prevTableNotes => {
        const newTableNotes = [
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
        ];
        return newTableNotes.sort((a, b) => new Date(b.updatedate).getTime() - new Date(a.updatedate).getTime()
        );
      });
    } else {
      console.error("setNotes is undefined");
    };
  }

  // ノート保存ボタン押下時のコールバック関数
  const handleSave = (id: string, newTitle: string, newContent: string, newLabel: string, newUpdateDate: string) => {
    if (setNotes !== undefined) {
      setNotes(prevNote => {
        const updatedNotes = prevNote.map(
          note => note.id === id ? {
            ...note, title: newTitle, content: newContent, label_id: newLabel, updatedate: newUpdateDate
          }
            : note
        );
        // updatedateの降順でソート
        return updatedNotes.sort((a, b) =>
          new Date(b.updatedate).getTime() - new Date(a.updatedate).getTime()
        );
      });
    } else {
      console.error("error in handleSave: setNotes is undefined");
    }
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
      setTableNotes(prevTableNote => {
        const newTableNotes = prevTableNote.map(
          tableNote => tableNote.id === id ? {
            ...tableNote, title: newTitle, label_id: newLabel, is_Locked: is_Locked, updatedate: newUpdateDate, columns: newColumn, rowCells: newRowCells
          }
            : tableNote);
        return newTableNotes.sort((a, b) => new Date(b.updatedate).getTime() - new Date(a.updatedate).getTime())
      }
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
            <Note {...note} onSave={handleSave} onDelete={handleDelete} data-testid="note" />
          </Grid>
        ))}
        {filterdTableNotes.map((tableNote, index) => (
          <Grid key={index}>
            {/* TableNoteコンポーネントを生成 */}
            <TableNote {...tableNote} onSave={handleSaveTableNote} onDelete={handleDeleteTableNote} data-testid="tablenote" />
          </Grid>
        ))}

      </Grid>
    </Container>
  );
}