"use client";


import React, { useEffect, useState } from "react";
import { Button, Container, TextField } from "@mui/material";

// 設定ページのコンテンツ
export default function Home() {
  const [password, setPassword] = useState("");

  // パスワードの保存処理
  const handleSavePassword = () => {

  }

  return (

    <Container>
      <h1>設定</h1>

      {/* ここに設定項目を追加 */}
      <h3>パスワード設定</h3>
      <p>メモにロックをかけるときのパスワードを設定できます</p>
      <form>
        <TextField
          id="password-setting"
          variant="outlined"
          size="small"
          placeholder="パスワードを設定"
          sx={{
            width: "500px",
            borderRadius: "5px"
          }}
        />
        <Button variant="contained" sx={{ ml: 2 }}>保存</Button>
      </form>

      {/* TODO: テーマ選択のUIをここに追加 */}


    </Container >

  );
}