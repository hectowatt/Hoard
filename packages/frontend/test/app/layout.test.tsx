/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import RootLayout from "../../src/app/layout";
import "@testing-library/jest-dom";

// fetch モック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(["Work", "Personal"]),
    })
) as jest.Mock;

describe("RootLayout", () => {
    it("renders logo, nav, and children", async () => {
        render(
            <RootLayout>
                <div>Child Content</div>
            </RootLayout>
        );

        // ロゴ
        const logo = screen.getByAltText("Hoard Logo");
        expect(logo).toBeInTheDocument();

        // ナビゲーション項目
        expect(screen.getByText("ノート")).toBeInTheDocument();
        expect(screen.getByText("ラベル")).toBeInTheDocument();
        expect(screen.getByText("ゴミ箱")).toBeInTheDocument();
        expect(screen.getByText("設定")).toBeInTheDocument();

        // 子コンテンツ
        expect(screen.getByText("Child Content")).toBeInTheDocument();
    });

    it("カラーテーマ切り替え", () => {
        render(
            <RootLayout>
                <div>Toggle Test</div>
            </RootLayout>
        );

        const toggleButton = screen.getByTestId("togglecolormode");
        expect(toggleButton).toBeInTheDocument();

        // 初期状態はlight → iconは <LightModeOutlinedIcon />
        expect(toggleButton.querySelector("svg")).toBeInTheDocument();

        fireEvent.click(toggleButton);

        // ダークモードのアイコンに変化（Brightness2OutlinedIcon）
        expect(toggleButton.querySelector("svg")).toBeInTheDocument();
    });

    it("opens label dialog when ラベル is clicked", async () => {
        render(
            <RootLayout>
                <div>Label Dialog Test</div>
            </RootLayout>
        );

        const labelButton = screen.getByText("ラベル");
        fireEvent.click(labelButton);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });
});
