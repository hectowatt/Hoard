// NoteProvider.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { TableNoteProvider, useTableNoteContext } from "@/app/(authenticated)/context/TableNoteProvider"; // パスを調整してください
import "@testing-library/jest-dom";

type Column = {
    id: number;
    name: string;
    order?: number;
}

type RowCell = {
    id: number;
    rowIndex: number;
    value: string;
    columnId?: number;
}

type TableNote = {
    id: string;
    title: string;
    label_id: string;
    is_locked: boolean;
    createdate: string;
    updatedate: string;
    columns: Column[];
    rowCells: RowCell[][];
}

// モックデータ
const mockTableNotes: TableNote[] = [
    {
        id: "1",
        title: "テストテーブルノート１",
        label_id: "",
        is_locked: false,
        createdate: "2025-01-01",
        updatedate: "2025-01-02",
        columns: [{ id: 1, name: "カラム1", order: 1 }],
        rowCells: [[{ id: 1, rowIndex: 0, value: "セル１", columnId: 1 }], [{ id: 2, rowIndex: 1, value: "セル１", columnId: 1 }]]
    },
    {
        id: "2",
        title: "テストテーブルノート２",
        label_id: "",
        is_locked: false,
        createdate: "2025-01-01",
        updatedate: "2025-01-02",
        columns: [{ id: 1, name: "カラム1", order: 1 }],
        rowCells: [[{ id: 1, rowIndex: 0, value: "セル１", columnId: 1 }], [{ id: 2, rowIndex: 1, value: "セル１", columnId: 1 }]]
    }
];

// テスト用の子コンポーネント
const TestComponent = () => {
    const { tableNotes } = useTableNoteContext();
    return (
        <ul>
            {mockTableNotes.map((tableNote) => (
                <li key={tableNote.id}>
                    {tableNote.title}
                </li>
            ))}
        </ul>
    );
};

describe("NoteProvider", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockTableNotes,
        }) as jest.Mock;
    });

    it("fetchNotesでノートを取得し、コンテキストで提供する", async () => {
        render(
            <TableNoteProvider>
                <TestComponent />
            </TableNoteProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("テストテーブルノート１")).toBeInTheDocument();
            expect(screen.getByText("テストテーブルノート２")).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/tablenotes", { "credentials": "include", "headers": { "Content-Type": "application/json" }, "method": "GET" });
    });
});
