"use client"

import InputForm from "@/components/InputForm";
import styles from "./page.module.css";
import React, { useState } from "react";
import { Container } from "@mui/material";

// ルートページのコンテンツ
export default function Home() {


  return (
    <Container>
      <InputForm />
      {/* メモ一覧表示 */}

    </Container>
  );
}

// 画面描画時にDBからメモを全件取得して表示する
function getAllNotes() {
  // バックエンドAPIでメモを取得する

  // Noteコンポーネントにセット
}