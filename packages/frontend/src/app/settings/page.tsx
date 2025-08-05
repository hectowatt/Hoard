"use client";


import React, { useEffect, useState } from "react";
import { Button, Container, TextField } from "@mui/material";

// 設定ページのコンテンツ
export default function Home() {
  const [passwordString, setPasswordString] = useState("");


  // パスワードの保存処理
  const handleSavePassword = async () => {
    if (passwordString.trim() === "") {
      console.log("パスワードを入力してください");
      return;
    }

    const responseSelect = await fetch("/api/password", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (responseSelect.ok) {
      const result = await responseSelect.json();
      console.log("パスワード取得成功", result);
      if (result.password_id != null && result.password_id !== "") {
        // すでにパスワードが登録されている場合は更新
        console.log("パスワード登録済みのため更新");

        const password_id = result.password_id;

        console.log("password_id:", password_id);
        console.log("passwordString:", passwordString);

        const response = await fetch("/api/password", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            password_id: password_id,
            passwordString: passwordString
          })
        });

        if (response.ok) {
          console.log("update password success");
          setPasswordString(""); // 入力フィールドをクリア
        } else {
          console.error("failed to update password");
        }
      } else {
        // パスワードが未登録の場合は新規登録
        console.log("パスワード未登録のため新規登録");
        const response = await fetch("/api/password", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ passwordString: passwordString })
        });

        if (response.ok) {
          console.log("save password success");
          setPasswordString(""); // 入力フィールドをクリア
        } else {
          console.error("failed to save password");
        }
      }
    } else {
      console.error("failed to fetch password");
      return;
    }


  }

  return (

    <Container>
      <h1>設定</h1>

      {/* ここに設定項目を追加 */}
      <h3>パスワード設定</h3>
      <p>ノートにロックをかけるときのパスワードを設定できます</p>
      <form>
        <TextField
          id="password-setting"
          variant="outlined"
          value={passwordString}
          onChange={(e) => setPasswordString(e.target.value)}
          size="small"
          placeholder="パスワードを設定"
          sx={{
            width: "500px",
            borderRadius: "5px"
          }}
          data-testid="passwordinput"
        />
        <Button onClick={handleSavePassword} variant="contained" sx={{ ml: 2 }} data-testid="save">保存</Button>
      </form>

      {/* TODO: テーマ選択のUIをここに追加 */}


    </Container >

  );
}