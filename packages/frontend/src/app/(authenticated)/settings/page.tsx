"use client";


import React, { useEffect, useState } from "react";
import { Box, Button, Container, TextField, Typography, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTranslation } from "react-i18next";
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import i18n from "@/app/lib/i18n";

// 設定ページのコンテンツ
export default function Home() {
  const [prevNotePasswordString, setPrevNotePasswordString] = useState("");
  const [notePasswordString, setNotePasswordString] = useState("");
  const [newUsernameString, setNewUsernameString] = useState("");
  const [prevPasswordString, setPrevPasswordString] = useState("");
  const [newPasswordString, setNewPasswordString] = useState("");
  const [isPasswordExist, setIsPasswordExist] = useState(false);
  const [notePasswordId, setNotePasswordId] = useState("");
  const { t } = useTranslation();
  const availableLangs = Object.keys(i18n.options.resources || {});
  const langNames: Record<string, string> = {
    ja: "日本語",
    en: "English",
    // 必要なら他言語を追加
  };

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

  // ノートパスワードの保存処理
  const handleSavePassword = async () => {
    if (notePasswordString.trim() === "") {
      alert(t("message_new_notepassword_must_be_set"));
      return;
    }

    if (isPasswordExist) {
      if (prevNotePasswordString.trim() === "") {
        alert(t("message_current_notepassword_must_be_set"));
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
            alert(t("message_notepassword_saved"));
            setNotePasswordString(""); // 入力フィールドをクリア
            setPrevNotePasswordString("");
          } else {
            alert(t("message_failed_to_save_notepassword"));
          }
        } else {
          alert(t("message_incorrect_current_notepassword"));
        }
      } else {
        alert(t("message_error_occured"));
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
        alert(t("message_notepassword_regist"));
        setNotePasswordString(""); // 入力フィールドをクリア
        setIsPasswordExist(true);
        if (result?.password_id) {
          setNotePasswordId(result.password_id); // 新しいIDをセット
        }
      } else {
        alert(t("message_failed_to_regist_notepassword"));
      }
    }

  };

  // アカウント情報の更新処理
  const handleSaveAccountInfo = async () => {
    if (!newUsernameString && !newPasswordString) {
      alert(t("message_username_or_password_must_be_set"));
      return;
    }

    if (newPasswordString && !prevPasswordString) {
      alert(t("message_new_password_must_be_set_when_change"));
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
            alert(t("message_user_settings_saved"));
            setNewUsernameString("");
            setPrevPasswordString("");
            setNewPasswordString("");
          } else {
            alert(t("message_failed_to_save_user_info"));
          }
        } else {
          alert(t("message_incorrect_current_password"));
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
        alert(t("message_user_info_saved"));
        setNewUsernameString("");
        setPrevPasswordString("");
        setNewPasswordString("");
      } else {
        alert(t("message_failed_to_save_user_info"));
      }
    }
  }

  // 言語切り替え処理
  const chageLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("i18nextLng", lang);
  };

  return (

    <Container>
      <h1>{t("label_settings")}</h1>

      {/* 言語設定 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 4 }}>
        <LanguageOutlinedIcon></LanguageOutlinedIcon>
        <h3>{t("label_language_settings")}</h3>
      </Box>
      <p>{t("label_language_settings_desc")}</p>
      <FormControl size="small" sx={{ minWidth: 120 }} data-testid="lang_select">
        <InputLabel id="select-lang">{t("label_select_language")}</InputLabel>
        <Select
          labelId="select-lang"
          value={i18n.language || ""}
          onChange={(e) => chageLanguage(String(e.target.value))}
          label={t("label_select_language")}
          renderValue={(selected: string) => {
            if (!selected) return <em>{t("dropdown_no_languages")}</em>;
            return langNames[selected] ?? selected;
          }}
        >
          {availableLangs.map((lng) => (
            <MenuItem key={lng} value={lng}>
              {langNames[lng] ?? lng}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* ユーザ設定 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Person2OutlinedIcon />
        <h3>{t("label_user_settings")}</h3>
      </Box>
      <p>{t("label_user_settings_desc")}</p>
      <form>
        <TextField
          id="new-username"
          variant="outlined"
          value={newUsernameString}
          onChange={(e) => setNewUsernameString(e.target.value)}
          size="small"
          placeholder={t("placeholder_new_username")}
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
          placeholder={t("placeholder_current_password")}
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
          placeholder={t("placeholder_new_password")}
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
        <Button onClick={handleSaveAccountInfo} variant="contained" data-testid="userinfosave">{t("button_save")}</Button>
      </form>

      {/* ノートパスワード設定 */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 4 }}>
        <LockOutlinedIcon></LockOutlinedIcon>
        <h3>{t("label_note_password_settings")}</h3>
      </Box>
      <p>{t("label_note_password_settings_desc")}</p>
      {isPasswordExist ? (
        <form>
          <TextField
            id="password-confirm"
            variant="outlined"
            value={prevNotePasswordString}
            onChange={(e) => setPrevNotePasswordString(e.target.value)}
            size="small"
            placeholder={t("placeholder_current_note_password")}
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
            placeholder={t("placeholder_new_note_password")}
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
          <Button onClick={handleSavePassword} variant="contained" data-testid="notepasswordsave">{t("button_save")}</Button>
        </form>
      ) : (
        <form>
          <TextField
            id="password-setting"
            variant="outlined"
            value={notePasswordString}
            onChange={(e) => setNotePasswordString(e.target.value)}
            size="small"
            placeholder={t("placeholder_new_note_password")}
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
          <Button onClick={handleSavePassword} variant="contained" data-testid="notepasswordsave">{t("button_save")}</Button>
        </form>
      )}

      {/* TODO: テーマ選択のUIをここに追加 */}


    </Container >

  );
};