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
        render(<Home />);

        expect(screen.getByText("設定")).toBeInTheDocument();
        expect(screen.getByText("ユーザ設定")).toBeInTheDocument();
        expect(screen.getByText("ユーザ名とパスワードを変更できます。")).toBeInTheDocument();
        expect(screen.getByText("ノートパスワード設定")).toBeInTheDocument();
        expect(screen.getByText("ノートにロックをかけるときのパスワードを設定できます")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId("prevnotepasswordinput")).toBeInTheDocument();
        });

        expect(screen.getByTestId("prevpasswordinput")).toBeInTheDocument();
        expect(screen.getByTestId("passwordinput")).toBeInTheDocument();
        expect(screen.getByTestId("notepasswordinput")).toBeInTheDocument();
        expect(screen.getByTestId("userinfosave")).toBeInTheDocument();
        expect(screen.getByTestId("notepasswordsave")).toBeInTheDocument();
    });

    it("ユーザ情報保存ボタンをクリックしたとき、/api/userにリクエストが送信される", async () => {
        render(
            <Home />
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
            <Home />
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