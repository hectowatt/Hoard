import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { NoteProvider } from "@/context/NoteProvider";
import { LabelProvider } from "@/context/LabelProvider";
import Home from "../../src/app/page";

// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

jest.mock("../../src/components/InputForm", () => () => <div data-testid="inputform">InputForm</div>);
jest.mock("../../src/components/Note", () => (props: any) => <div data-testid="note">Note: {props.title}</div>);
jest.mock("../../src/components/TableNote", () => (props: any) => <div data-testid="tablenote">TableNote: {props.title}</div>);

jest.mock("@/context/LabelProvider", () => {
    return {
        ...jest.requireActual("@/context/LabelProvider"),
        useLabelContext: () => ({
            labels: mockLabels,
        }),
        LabelProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

jest.mock("@/context/SearchWordProvider", () => ({
    useSearchWordContext: () => ({
        searchWord: "",
    }),
}));

jest.mock("@/context/NoteProvider", () => ({
    useNoteContext: () => ({
        notes: [
            { id: "1", title: "Note1", content: "Test note", label_id: "", createdate: "", updatedate: "", is_locked: false },
        ],
        setNotes: jest.fn(),
        fetchNotes: jest.fn(),
    }),
}));

jest.mock("@/context/TableNoteProvider", () => ({
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
        expect(screen.getByTestId("tablenote")).toBeVisible();

    })
})