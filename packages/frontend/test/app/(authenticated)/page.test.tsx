import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteProvider } from "@/app/(authenticated)/context/NoteProvider";
import { LabelProvider } from "@/app/(authenticated)/context/LabelProvider";
import Home from "@/app/(authenticated)/page";

// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

jest.mock("@/app/(authenticated)/components/InputForm", () => () => <div data-testid="inputform">InputForm</div>);
jest.mock("@/app/(authenticated)/components/Note", () => (props: any) => <div data-testid="note">Note: {props.title}</div>);
jest.mock("@/app/(authenticated)/components/TableNote", () => (props: any) => <div data-testid="tablenote">TableNote: {props.title}</div>);

jest.mock("@/app/(authenticated)/context/LabelProvider", () => {
    return {
        ...jest.requireActual("@/app/(authenticated)/context/LabelProvider"),
        useLabelContext: () => ({
            labels: mockLabels,
        }),
        LabelProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

jest.mock("@/app/(authenticated)/context/SearchWordProvider", () => ({
    useSearchWordContext: () => ({
        searchWord: "",
    }),
}));

jest.mock("@/app/(authenticated)/context/NoteProvider", () => ({
    useNoteContext: () => ({
        notes: [
            { id: "1", title: "Note1", content: "Test note", label_id: "", createdate: "", updatedate: "", is_locked: false },
        ],
        setNotes: jest.fn(),
        fetchNotes: jest.fn(),
    }),
}));

jest.mock("@/app/(authenticated)/context/TableNoteProvider", () => ({
    useTableNoteContext: () => ({
        tableNotes: [
            {
                id: "1",
                title: "TableNote1",
                label_id: "",
                createdate: "",
                updatedate: "",
                is_locked: false,
                columns: [],
                rowCells: [],
            },
        ],
        setTableNotes: jest.fn(),
        fetchTableNotes: jest.fn(),
    }),
}));

// fetch モック
global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve(["Work", "Personal"]),
    })
) as jest.Mock;

describe("Top Page", () => {
    it("NoteとTableNoteが表示される", async () => {
        render(
            <Home />
        );

        expect(screen.getByTestId("note")).toBeInTheDocument();
        expect(screen.getByTestId("inputform")).toBeInTheDocument();
        expect(screen.getByTestId("tablenote")).toBeInTheDocument();

    })
})