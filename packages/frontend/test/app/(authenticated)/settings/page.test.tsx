import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/(authenticated)/settings/page";
import i18n from "@/app/lib/i18n";
import { SnackbarProvider } from "@/app/(authenticated)/context/SnackbarProvider";


// グローバル fetch モック
beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn((url: string) => {
        if (url.includes("/api/password")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve({
                        password_id: "12345",
                        password_hashed: "$2b$10$EIX",
                    }),
            });
        }
        return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([]),
        });
    });
});

describe("Setting Page", () => {
    it("説明文と入力欄、ボタンが表示される", async () => {
        const label_settings = i18n.t("label_settings");
        const label_user_settings = i18n.t("label_user_settings");
        const label_user_settings_desc = i18n.t("label_user_settings_desc");
        const label_note_password_settings = i18n.t("label_note_password_settings");
        const label_note_password_settings_desc = i18n.t("label_note_password_settings_desc");
        render(
            <SnackbarProvider>
                <Home />
            </SnackbarProvider>
        );

        expect(screen.getByText(label_settings)).toBeInTheDocument();
        expect(screen.getByText(label_user_settings)).toBeInTheDocument();
        expect(screen.getByText(label_user_settings_desc)).toBeInTheDocument();
        expect(screen.getByText(label_note_password_settings)).toBeInTheDocument();
        expect(screen.getByText(label_note_password_settings_desc)).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId("prevnotepasswordinput")).toBeInTheDocument();
        });

        expect(screen.getByTestId("lang_select")).toBeInTheDocument();
        expect(screen.getByTestId("prevpasswordinput")).toBeInTheDocument();
        expect(screen.getByTestId("passwordinput")).toBeInTheDocument();
        expect(screen.getByTestId("notepasswordinput")).toBeInTheDocument();
        expect(screen.getByTestId("userinfosave")).toBeInTheDocument();
        expect(screen.getByTestId("notepasswordsave")).toBeInTheDocument();
    });

    it("ユーザ情報保存ボタンをクリックしたとき、/api/userにリクエストが送信される", async () => {
        render(
            <SnackbarProvider>
                <Home />
            </SnackbarProvider>
        );

        const userNameInput = await screen.getByTestId("usernameinput");
        fireEvent.change(userNameInput.querySelector("input")!, {
            target: { value: "testusername" },
        });

        const saveButton = await screen.getByTestId("userinfosave");
        fireEvent.click(saveButton);

        expect(fetch).toHaveBeenCalledWith("/api/user", expect.any(Object));
    });


    it("ノートパスワード保存ボタンをクリックしたとき、/api/passwordにリクエストが送信される", async () => {
        render(
            <SnackbarProvider>
                <Home />
            </SnackbarProvider>
        );

        const notePasswordInput = await screen.getByTestId("notepasswordinput");
        fireEvent.change(notePasswordInput.querySelector("input")!, {
            target: { value: "testpassword" },
        });

        const saveButton = await screen.getByTestId("notepasswordsave");
        fireEvent.click(saveButton);

        expect(fetch).toHaveBeenCalledWith("/api/password", expect.any(Object));
    });

});