import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AuthenticatedLayout from "@/app/(authenticated)/layout";
import "@testing-library/jest-dom";

// fetch モック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(["Work", "Personal"]),
    })
) as jest.Mock;

const mockedUseRouter = jest.fn();

jest.mock("next/navigation", () => ({
    useRouter: () => mockedUseRouter(),
    usePathname: jest.fn().mockReturnValue("/"),
    useServerInsertedHTML: jest.fn(),
}));

describe("RootLayout", () => {
    it("renders logo, nav, and children", async () => {
        render(
            <AuthenticatedLayout>
                <div>Child Content</div>
            </AuthenticatedLayout>
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
            <AuthenticatedLayout>
                <div>Toggle Test</div>
            </AuthenticatedLayout>
        );

        const toggleButtons = screen.getAllByTestId("togglecolormode");
        expect(toggleButtons.length).toBeGreaterThan(0);

        // 最初のトグルボタンを使う
        const toggleButton = toggleButtons[0];

        // 初期状態はlight → iconは <LightModeOutlinedIcon />
        expect(toggleButton.querySelector("svg[data-testid='LightModeOutlinedIcon']")).toBeInTheDocument();

        fireEvent.click(toggleButton);

        // ダークモードのアイコンに変化（Brightness2OutlinedIcon）
        expect(toggleButton.querySelector("svg[data-testid='Brightness2OutlinedIcon']")).toBeInTheDocument();
    });

    it("ラベルアイテムがクリックされたとき、ダイアログが表示される", async () => {
        render(
            <AuthenticatedLayout>
                <div>Label Dialog Test</div>
            </AuthenticatedLayout>
        );

        const labelButton = screen.getByText("ラベル");
        fireEvent.click(labelButton);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });
});
