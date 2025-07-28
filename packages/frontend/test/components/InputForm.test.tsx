import React, { act } from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputForm from "../../src/components/InputForm";
import { LabelProvider } from "@/context/LabelProvider";
import { NoteProvider } from "@/context/NoteProvider";
import { time } from "console";

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

    it("openがtrueのとき、保存ボタンが表示される", async () => {
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

        const input = await screen.getByText("保存");
        expect(input).toBeVisible();
    });

    it("openがtrueのとき、キャンセルボタンが表示される", async () => {
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

        const input = await screen.getByText("キャンセル");
        expect(input).toBeVisible();
    });

    it("openがtrueのとき、ラベルのドロップダウンが表示される", async () => {
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

        const input = await screen.getByLabelText("ラベル");
        expect(input).toBeVisible();
    });

    it("openがtrueのとき、ロックアイコンが表示される", async () => {
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

        const input = await screen.getByTestId("unlock");
        expect(input).toBeInTheDocument();
    });

    it("openがtrueのとき、テーブルノートアイコンが表示される", async () => {
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

        const input = await screen.getByTestId("tablenote");
        expect(input).toBeInTheDocument();
    });

    it("タイトルを入力できる", async () => {
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
        const input = await screen.findByPlaceholderText("タイトル") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(input, { target: { value: "新しいタイトル" } });
        });

        expect(input.value).toBe("新しいタイトル");
    });

    it("contentを入力できる", async () => {
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
        const input = await screen.findByPlaceholderText("ノートを入力...") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(input, { target: { value: "新しい内容" } });
        });

        expect(input.value).toBe("新しい内容");
    });

    it("ロックとアンロックを切り替えられる", async () => {
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
        const unlockIcon = await screen.getByTestId("unlock");

        await act(async () => {
            fireEvent.click(unlockIcon);
        });

        const lockIcon = await screen.getByTestId("lock");

        expect(lockIcon).toBeInTheDocument();
    });

    it("テーブルノート編集画面を開くことができる", async () => {
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
        const tableNoteIcon = await screen.getByTestId("tablenote");

        await act(async () => {
            fireEvent.click(tableNoteIcon);
        });

        const column1 = await screen.getByDisplayValue("カラム1");

        await waitFor(() => {
            expect(column1).toBeVisible();
        });

    });

    it("フォーカスが外れたときに縮小化される", async () => {
        render(
            <>
                <NoteProvider>
                    <LabelProvider>
                        <InputForm onInsert={mockOnInsert} onInsertTableNote={mockOnInsertTableNote} />
                    </LabelProvider>
                </NoteProvider>
                <input data-testid="dummy-input" placeholder="ダミー入力" />
            </>
        );

        await act(async () => {
            const noteInput = screen.getByPlaceholderText("ノートを入力...");
            fireEvent.focus(noteInput);
        });

        await screen.findByPlaceholderText("タイトル");

        // dummyにフォーカスを移す
        const dummyInput = screen.getByTestId("dummy-input");
        await act(async () => {
            fireEvent.click(dummyInput);
        });

        // Collapse が閉じてタイトルが消えるのを確認
        await waitFor(() => {
            expect(screen.queryByPlaceholderText("タイトル")).not.toBeVisible();
        });
    });
})