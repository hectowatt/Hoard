"use client";

import InputForm from "@/components/InputForm";
import styles from "./page.module.css";
import React, { useEffect, useState } from "react";
import { Container, Grid } from "@mui/material";

// ルートページのコンテンツ
export default function Home() {
  const [notes, setNotes] = useState<{ id: string, title: string; content: string; createdate: string; updatedate: string }[]>([]);

  return (
    <Container>
      {/* メモ一覧表示 */}
    </Container>
  );
}