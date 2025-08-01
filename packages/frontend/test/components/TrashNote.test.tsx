import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import TrashNote from "../../src/components/TrashNote";
import { LabelProvider } from "@/context/LabelProvider";
import { NoteProvider } from "@/context/NoteProvider";

jest.mock("@/context/LabelProvider", () => {
    return {
        ...jest.requireActual("@/context/LabelProvider"),
        useLabelContext: () => ({
            labels: mockLabels,
        }),
        LabelProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

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

beforeEach(() => {
    fetchMock.resetMocks();
    fetchMock.mockResponse(JSON.stringify({}));
});


describe("TrashNote", () => {
    it("タイトル・内容・日付・ラベルが表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashNote {...mockNote} />
                </LabelProvider>
            </NoteProvider>
        );
        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText("これはテストノートです。")).toBeVisible();
        expect(screen.getByText(/作成日:/)).toBeVisible();
        expect(screen.getByText(/更新日:/)).toBeVisible();
        expect(screen.getByText("仕事")).toBeVisible();
    });

    it("クリックでダイアログが開く", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashNote {...mockNote} />
                </LabelProvider>
            </NoteProvider>
        );
        await act(async () => {
            fireEvent.click(screen.getByText("テストノート"));
        });
        expect(screen.getByRole("dialog")).toBeVisible();
        expect(screen.getByText("復元")).toBeVisible();
        expect(screen.getByText("完全に削除")).toBeVisible();
    });

    it("復元ボタン・削除ボタンが押せる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashNote {...mockNote} />
                </LabelProvider>
            </NoteProvider>
        );
        await act(async () => {
            fireEvent.click(screen.getByText("テストノート"));
        });
        expect(screen.getByText("復元")).toBeVisible();
        expect(screen.getByText("完全に削除")).toBeVisible();
    });
});