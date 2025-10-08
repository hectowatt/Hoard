"use client";


import React, { useEffect, useState } from "react";
import { Button, Container, TextField } from "@mui/material";

// 設定ページのコンテンツ
export default function Home() {
  const [prevPasswordString, setPrevPasswordString] = useState("");
  const [passwordString, setPasswordString] = useState("");
  const [isPasswordExist, setIsPasswordExist] = useState(false);
  const [passwordId, setPasswordId] = useState("");

  const fetchPasswordStatus = async () => {
    const responseSelect = await fetch("/api/password", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include"
    });

    if (responseSelect.ok) {
      const result = await responseSelect.json();
      if (result.password_id != null && result.password_id !== "") {
        setIsPasswordExist(true);
        setPasswordId(result.password_id);
      } else {
        setIsPasswordExist(false);
      }
    }
  };

  useEffect(() => {
    fetchPasswordStatus();
  }, []);

  // パスワードの保存処理
  const handleSavePassword = async () => {
    if (passwordString.trim() === "") {
      alert("新しいパスワードを入力してください");
      return;
    }

    if (isPasswordExist) {
      if (prevPasswordString.trim() === "") {
        alert("現在のパスワードを入力してください");
        return;
      }

      const responseCompare = await fetch("/api/password/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password_id: passwordId,
          passwordString: prevPasswordString
        }),
        credentials: "include"
      });

      console.log(responseCompare);

      if (responseCompare.ok) {
        const result = await responseCompare.json();
        const isMatch = result.isMatch;
        if (isMatch) {
          const response = await fetch("/api/password", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              password_id: passwordId,
              passwordString: passwordString
            }),
            credentials: "include"
          });

          if (response.ok) {
            alert("パスワードを更新しました！");
            setPasswordString(""); // 入力フィールドをクリア
            setPrevPasswordString("");
          } else {
            alert("パスワードの更新に失敗しました");
          }
        } else {
          alert("現在のパスワードが間違っています");
        }
      } else {
        alert("エラーが発生しました");
        return;
      }
    } else {
      // パスワードが未登録の場合は新規登録
      const response = await fetch("/api/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ passwordString: passwordString }),
        credentials: "include"
      });

      if (response.ok) {
        alert("パスワードを登録しました！");
        setPasswordString(""); // 入力フィールドをクリア
      } else {
        alert("パスワードの登録に失敗しました");
      }
    }

  }

  return (

    <Container>
      <h1>設定</h1>

      <h3>パスワード設定</h3>
      <p>ノートにロックをかけるときのパスワードを設定できます</p>
      {isPasswordExist ? (
        <form>
          <TextField
            id="password-confirm"
            variant="outlined"
            value={prevPasswordString}
            onChange={(e) => setPrevPasswordString(e.target.value)}
            size="small"
            placeholder="現在のパスワードを入力"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="prevpasswordinput"
          />
          <br />
          <TextField
            id="password-setting"
            variant="outlined"
            value={passwordString}
            onChange={(e) => setPasswordString(e.target.value)}
            size="small"
            placeholder="新しいパスワードを設定"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="passwordinput"
          />
          <Button onClick={handleSavePassword} variant="contained" sx={{ ml: 2 }} data-testid="save">保存</Button>
        </form>
      ) : (
        <form>
          <TextField
            id="password-setting"
            variant="outlined"
            value={passwordString}
            onChange={(e) => setPasswordString(e.target.value)}
            size="small"
            placeholder="新しいパスワードを設定"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="passwordinput"
          />
          <Button onClick={handleSavePassword} variant="contained" sx={{ ml: 2 }} data-testid="save">保存</Button>
        </form>
      )}

      {/* TODO: テーマ選択のUIをここに追加 */}


    </Container >

  );
}