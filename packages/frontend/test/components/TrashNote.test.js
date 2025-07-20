import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TrashNote from "../../src/components/TrashNote";
import { LabelProvider } from "@/context/LabelProvider";

// モックデータ
const mockNote = {
    id: "1",
    title: "テストノート",
    content: "これはテストノートです。",
    label_id: "label1",
    is_locked: false,
    createdate: "2024-07-01T12:00:00Z",
    updatedate: "2024-07-02T12:00:00Z",
    onRestore: jest.fn(),
    onDelete: jest.fn(),
};

// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

jest.mock("@/context/LabelProvider", () => {
    const actual = jest.requireActual("@/context/LabelProvider");
    return {
        ...actual,
        useLabelContext: () => ({
            labels: mockLabels,
        }),
    };
});

describe("TrashNote", () => {
    it("タイトル・内容・日付・ラベルが表示される", () => {
        render(
            <LabelProvider>
                <TrashNote {...mockNote} />
            </LabelProvider>
        );
        expect(screen.getByText("テストノート")).toBeInTheDocument();
        expect(screen.getByText("これはテストノートです。")).toBeInTheDocument();
        expect(screen.getByText(/作成日:/)).toBeInTheDocument();
        expect(screen.getByText(/更新日:/)).toBeInTheDocument();
        expect(screen.getByText("仕事")).toBeInTheDocument();
    });

    it("クリックでダイアログが開く", () => {
        render(
            <LabelProvider>
                <TrashNote {...mockNote} />
            </LabelProvider>
        );
        fireEvent.click(screen.getByText("テストノート"));
        expect(screen.getByRole("dialog")).toBeInTheDocument();
        expect(screen.getByText("復元")).toBeInTheDocument();
        expect(screen.getByText("完全に削除")).toBeInTheDocument();
    });

    it("復元ボタン・削除ボタンが押せる", () => {
        render(
            <LabelProvider>
                <TrashNote {...mockNote} />
            </LabelProvider>
        );
        fireEvent.click(screen.getByText("テストノート"));
        expect(screen.getByText("復元")).toBeInTheDocument();
        expect(screen.getByText("完全に削除")).toBeInTheDocument();
    });
});