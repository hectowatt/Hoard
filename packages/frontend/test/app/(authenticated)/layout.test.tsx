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

// ThemeProvider をモック
const setModeMock = jest.fn();
jest.mock("@/app/context/ThemeProvider", () => {
    const originalModule = jest.requireActual("@/app/context/ThemeProvider");
    return {
        ...originalModule,
        useThemeMode: jest.fn(() => ({
            mode: "light",
            setMode: setModeMock,
        })),
        ThemeModeContext: {
            Provider: ({ children }: { children: React.ReactNode }) => (
                <div data-testid="mocked-theme-provider">{children}</div>
            ),
        },
    };
});

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
        expect(screen.getByTestId("noteicon")).toBeInTheDocument();
        expect(screen.getByTestId("labelicon")).toBeInTheDocument();
        expect(screen.getByTestId("trashicon")).toBeInTheDocument();
        expect(screen.getByTestId("settingicon")).toBeInTheDocument();

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

        // setMode が呼ばれていることを確認（状態変更はモック内で直接反映されないため）
        expect(setModeMock).toHaveBeenCalled();
    });

    it("ラベルアイテムがクリックされたとき、ダイアログが表示される", async () => {
        render(
            <AuthenticatedLayout>
                <div>Label Dialog Test</div>
            </AuthenticatedLayout>
        );

        const labelButton = screen.getByTestId("labelicon");
        fireEvent.click(labelButton);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
        });
    });
});
