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
                        password_id: "12345", // ← 配列ではなくオブジェクト！
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
        expect(screen.getByText("パスワード設定")).toBeInTheDocument();
        expect(screen.getByText("ノートにロックをかけるときのパスワードを設定できます")).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByTestId("prevpasswordinput")).toBeInTheDocument();
        });

        expect(screen.getByTestId("passwordinput")).toBeInTheDocument();
        expect(screen.getByTestId("save")).toBeInTheDocument();
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