import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Note from "../../src/components/Note";
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

describe("Note", () => {
    const mockOnSave = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof fetchMock !== "undefined") {
            fetchMock.resetMocks();
            fetchMock.mockResponse(JSON.stringify({}));
        }
    });

    it("openがfalseのとき、タイトルとcontent、作成日、更新日が表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノート"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText("テストノートcontent")).toBeVisible();
        expect(screen.getByText("作成日: 2025/07/05")).toBeVisible();
        expect(screen.getByText("更新日: 2025/07/05")).toBeVisible();
    })

    it("クリックした時、編集、削除、ロックアイコンボタンが表示される", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノート"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノート"));
        })

        expect(screen.getByText("編集")).toBeVisible();
        expect(screen.getByText("削除")).toBeVisible();
        expect(screen.getByTestId("unlock")).toBeVisible();
    })

});