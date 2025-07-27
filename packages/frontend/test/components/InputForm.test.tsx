import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputForm from "../../src/components/InputForm";
import { LabelProvider } from "@/context/LabelProvider";
import { NoteProvider } from "@/context/NoteProvider";

// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

jest.mock("@/context/LabelProvider", () => {
    return {
        ...jest.requireActual("@/context/LabelProvider"),
        useLabelContext: () => ({
            labels: mockLabels,
        }),
        LabelProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe("InputForm", () => {
    const mockOnInsert = jest.fn();
    const mockOnInsertTableNote = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof fetchMock !== "undefined") {
            fetchMock.resetMocks();
            fetchMock.mockResponse(JSON.stringify({}));
        }
    });

    it("openがfalseのとき、プレースホルダが表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <InputForm onInsert={mockOnInsert} onInsertTableNote={mockOnInsertTableNote} />
                </LabelProvider>
            </NoteProvider>
        )

        expect(screen.getByPlaceholderText("ノートを入力...")).toBeVisible();
    });

    it("openがtrueのとき、タイトル入力フィールドが表示される", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <InputForm onInsert={mockOnInsert} onInsertTableNote={mockOnInsertTableNote} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByPlaceholderText("ノートを入力..."));
        });

        const titleInput = await screen.findByPlaceholderText("タイトル");
        expect(titleInput).toBeVisible();
    });
})