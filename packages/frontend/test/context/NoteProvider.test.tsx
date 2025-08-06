// NoteProvider.test.tsx
import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { NoteProvider, useNoteContext } from "@/app/(authenticated)/context/NoteProvider";
import "@testing-library/jest-dom";

// モックデータ
const mockNotes = [
    {
        id: "1",
        title: "テストノート1",
        content: "内容1",
        label_id: "label1",
        createdate: "2025-07-01",
        updatedate: "2025-07-02",
        is_locked: false,
    },
    {
        id: "2",
        title: "テストノート2",
        content: "内容2",
        label_id: "label2",
        createdate: "2025-07-03",
        updatedate: "2025-07-04",
        is_locked: true,
    },
];

// テスト用の子コンポーネント
const TestComponent = () => {
    const { notes } = useNoteContext();
    return (
        <ul>
            {notes.map((note) => (
                <li key={note.id}>
                    {note.title} - {note.content}
                </li>
            ))}
        </ul>
    );
};

describe("NoteProvider", () => {
    beforeEach(() => {
        global.fetch = jest.fn().mockResolvedValue({
            ok: true,
            json: async () => mockNotes,
        }) as jest.Mock;
    });

    it("fetchNotesでノートを取得し、コンテキストで提供する", async () => {
        render(
            <NoteProvider>
                <TestComponent />
            </NoteProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("テストノート1 - 内容1")).toBeInTheDocument();
            expect(screen.getByText("テストノート2 - 内容2")).toBeInTheDocument();
        });

        expect(global.fetch).toHaveBeenCalledWith("/api/notes");
    });
});
