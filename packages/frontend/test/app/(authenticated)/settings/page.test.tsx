import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "@/app/(authenticated)/settings/page";

// グローバル fetch モック
beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn((url: string) => {
        if (url.includes("/api/password")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            password_id: "12345",
                            password_hashed: "$2b$10$EIX",
                        },
                    ]),
            });
        }
        return Promise.reject("unknown endpoint");
    });
});

// fetch モック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(["Work", "Personal"]),
    })
) as jest.Mock;

describe("Top Page", () => {
    it("NoteとTableNoteが表示される", async () => {
        render(
            <Home />
        );

        expect(screen.getByText("設定")).toBeInTheDocument();
        expect(screen.getByText("パスワード設定")).toBeInTheDocument();
        expect(screen.getByText("ノートにロックをかけるときのパスワードを設定できます")).toBeInTheDocument();

    });

    it("保存ボタンをクリックしたとき、/api/passwordにGETリクエストが送信される", async () => {
        render(
            <Home />
        );

        const passwordInput = await screen.getByTestId("passwordinput");
        fireEvent.change(passwordInput.querySelector("input")!, {
            target: { value: "testpassword" },
        });

        const saveButton = await screen.getByTestId("save");
        fireEvent.click(saveButton);

        expect(fetch).toHaveBeenCalledWith("/api/password", expect.any(Object));
    });

});