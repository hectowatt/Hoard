"use client";


import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

// 設定ページのコンテンツ
export default function Home() {
  const [prevNotePasswordString, setPrevNotePasswordString] = useState("");
  const [notePasswordString, setNotePasswordString] = useState("");
  const [newUsernameString, setNewUsernameString] = useState("");
  const [prevPasswordString, setPrevPasswordString] = useState("");
  const [newPasswordString, setNewPasswordString] = useState("");
  const [isPasswordExist, setIsPasswordExist] = useState(false);
  const [notePasswordId, setNotePasswordId] = useState("");

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
        setNotePasswordId(result.password_id);
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
    if (notePasswordString.trim() === "") {
      alert("新しいパスワードを入力してください");
      return;
    }

    if (isPasswordExist) {
      if (prevNotePasswordString.trim() === "") {
        alert("現在のパスワードを入力してください");
        return;
      }

      const responseCompare = await fetch("/api/password/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password_id: notePasswordId,
          passwordString: prevNotePasswordString
        }),
        credentials: "include"
      });

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
              password_id: notePasswordId,
              passwordString: notePasswordString
            }),
            credentials: "include"
          });

          if (response.ok) {
            alert("パスワードを更新しました！");
            setNotePasswordString(""); // 入力フィールドをクリア
            setPrevNotePasswordString("");
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
        body: JSON.stringify({ passwordString: notePasswordString }),
        credentials: "include"
      });

      if (response.ok) {
        const result = await response.json();
        alert("パスワードを登録しました！");
        setNotePasswordString(""); // 入力フィールドをクリア
        setIsPasswordExist(true);
        if (result?.password_id) {
          setNotePasswordId(result.password_id); // 新しいIDをセット
        }
      } else {
        alert("パスワードの登録に失敗しました");
      }
    }

  };

  // アカウント情報の更新処理
  const handleSaveAccountInfo = async () => {
    if (!newUsernameString && !newPasswordString) {
      alert("ユーザ名かパスワードのいずれかを入力してください");
      return;
    }

    if (newPasswordString && !prevPasswordString) {
      alert("パスワードを変更する場合、現在のパスワードを入力してください");
      return;
    }

    if (newPasswordString) {
      const responseCompare = await fetch("/api/user/compare", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          passwordString: prevPasswordString
        }),
        credentials: "include"
      });

      if (responseCompare.ok) {
        const result = await responseCompare.json();
        const isMatch = result.isMatch;
        if (isMatch) {

          const response = await fetch("/api/user", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: newUsernameString,
              password: newPasswordString
            }),
            credentials: "include"
          });
          if (response.ok) {
            alert("アカウント情報を更新しました！");
            setNewUsernameString("");
            setPrevPasswordString("");
            setNewPasswordString("");
          } else {
            alert("アカウント情報の更新に失敗しました");
          }
        } else {
          alert("現在のパスワードが間違っています");
        }
      }
    } else {
      const response = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: newUsernameString,
          password: newPasswordString
        }),
        credentials: "include"
      });
      if (response.ok) {
        alert("アカウント情報を更新しました！");
        setNewUsernameString("");
        setPrevPasswordString("");
        setNewPasswordString("");
      } else {
        alert("アカウント情報の更新に失敗しました");
      }
    }
  }

  return (

    <Container>
      <h1>設定</h1>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Person2OutlinedIcon />
        <h3>ユーザ設定</h3>
      </Box>
      <p>ユーザ名とパスワードを変更できます。</p>
      <form>
        <TextField
          id="new-username"
          variant="outlined"
          value={newUsernameString}
          onChange={(e) => setNewUsernameString(e.target.value)}
          size="small"
          placeholder="新しいユーザ名を入力"
          sx={{
            width: {
              xs: "100%",
              sm: 350,
              md: 500,
            },
            borderRadius: "5px",
            mb: 1
          }}
          data-testid="usernameinput"
        />
        <br />
        <TextField
          id="new-password"
          variant="outlined"
          value={prevPasswordString}
          onChange={(e) => setPrevPasswordString(e.target.value)}
          size="small"
          placeholder="現在のパスワードを設定"
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
          id="new-password"
          variant="outlined"
          value={newPasswordString}
          onChange={(e) => setNewPasswordString(e.target.value)}
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
        <br />
        <Button onClick={handleSaveAccountInfo} variant="contained" data-testid="userinfosave">保存</Button>
      </form>



      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 4 }}>
        <LockOutlinedIcon></LockOutlinedIcon>
        <h3>ノートパスワード設定</h3>
      </Box>
      <p>ノートにロックをかけるときのパスワードを設定できます</p>
      {isPasswordExist ? (
        <form>
          <TextField
            id="password-confirm"
            variant="outlined"
            value={prevNotePasswordString}
            onChange={(e) => setPrevNotePasswordString(e.target.value)}
            size="small"
            placeholder="現在のノートパスワードを入力"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="prevnotepasswordinput"
          />
          <br />
          <TextField
            id="password-setting"
            variant="outlined"
            value={notePasswordString}
            onChange={(e) => setNotePasswordString(e.target.value)}
            size="small"
            placeholder="新しいノートパスワードを設定"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="notepasswordinput"
          />
          <br />
          <Button onClick={handleSavePassword} variant="contained" data-testid="notepasswordsave">保存</Button>
        </form>
      ) : (
        <form>
          <TextField
            id="password-setting"
            variant="outlined"
            value={notePasswordString}
            onChange={(e) => setNotePasswordString(e.target.value)}
            size="small"
            placeholder="新しいノートパスワードを設定"
            sx={{
              width: {
                xs: "100%",
                sm: 350,
                md: 500,
              },
              borderRadius: "5px",
              mb: 1
            }}
            data-testid="notepasswordinput"
          />
          <br />
          <Button onClick={handleSavePassword} variant="contained" data-testid="notepasswordsave">保存</Button>
        </form>
      )}

      {/* TODO: テーマ選択のUIをここに追加 */}


    </Container >

  );
};