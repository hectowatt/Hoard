import React, { act } from "react";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Note from "@/app/(authenticated)/components/Note";
// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

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

const mockColumns: Column[] = [{ id: 1, name: "テストカラム1", order: 1 }];
const mockRowCells: RowCell[][] = [[{ id: 1, rowIndex: 0, value: "テストセル１", columnId: 1 }], [{ id: 1, rowIndex: 1, value: "テストセル２", columnId: 1 }]];

jest.mock("@/app/(authenticated)/context/LabelProvider", () => {
    return {
        ...jest.requireActual("@/app/(authenticated)/context/LabelProvider"),
        useLabelContext: () => ({
            labels: mockLabels,
        }),
        LabelProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

import { LabelProvider } from "@/app/(authenticated)/context/LabelProvider";
import { NoteProvider } from "@/app/(authenticated)/context/NoteProvider";
import TableNote from "@/app/(authenticated)/components/TableNote";


describe("TableNote", () => {
    const mockOnSave = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof fetchMock !== "undefined") {
            fetchMock.resetMocks();
            fetchMock.mockResponse(JSON.stringify({}));
        }
    });

    it("openがfalseのとき、タイトルと作成日、更新日が表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノート"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText("作成日: 2025/07/05")).toBeVisible();
        expect(screen.getByText("更新日: 2025/07/05")).toBeVisible();
    })

    it("クリックした時、編集、削除、ロックアイコンボタンが表示される", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノート"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
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

    it("編集モード時、タイトルを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByText("編集"));
        })

        const titleInput = screen.getByDisplayValue("テストノートタイトル") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: "新しいタイトル" } });
        });

        expect(titleInput.value).toBe("新しいタイトル");

    });

    it("編集モード時、columnを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByText("編集"));
        })

        const contentInput = screen.getByDisplayValue("テストカラム1") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(contentInput, { target: { value: "新しいカラム" } });
        });

        expect(contentInput.value).toBe("新しいカラム");

    });

    it("カラムの追加ができる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByText("編集"));
        })
        const addColumnButton = screen.getByTestId("addColumnIcon");

        await act(async () => {
            fireEvent.click(addColumnButton);
        });

        await waitFor(() => {
            expect(screen.getAllByTestId("column-input").length).toBeGreaterThan(mockColumns.length);
        });
    });

    it("編集モード時、rowCellを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByText("編集"));
        })

        const contentInput = screen.getByDisplayValue("テストセル１") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(contentInput, { target: { value: "新しいセル" } });
        });

        expect(contentInput.value).toBe("新しいセル");

    });

    it("編集モード時、ラベルを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={"label1"} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        });

        await act(async () => {
            fireEvent.click(screen.getByText("編集"));
        });


        fireEvent.mouseDown(screen.getByTestId("label-select").querySelector('[role="combobox"]')!);

        // リストが出現するのを待つ
        const option = await screen.findByText("プライベート");

        fireEvent.click(option);

        // 選択できたか確認
        expect(screen.getByTestId("label-select")).toHaveTextContent("プライベート");
    });

    it("フォーカスが外れたときに縮小化される", async () => {
        render(
            <>
                <NoteProvider>
                    <LabelProvider>
                        <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={"label1"} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                    </LabelProvider>
                </NoteProvider>
                <input data-testid="dummy-input" placeholder="ダミー入力" />
            </>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        });



        // DialogのBackdropを取得してクリック
        const backdrop = document.querySelector('.MuiBackdrop-root') as HTMLElement;
        expect(backdrop).toBeTruthy();

        fireEvent.mouseDown(backdrop);
        fireEvent.click(backdrop);


        await waitFor(() => {
            expect(screen.queryByRole("dialog")).toBeNull();
        });
    });

    it("ロックボタンをクリックするとロックされる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        });

        const lockIcon = screen.getByTestId("unlock");

        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: async () => ({ password_id: "dummy" }),
        }).mockResolvedValueOnce({
            ok: true,
            json: async () => ({}),
        });

        await act(async () => {
            fireEvent.click(lockIcon);
        });

        await waitFor(() => {
            const texts = screen.getAllByText("このノートはロックされています");
            expect(texts.length).toBeGreaterThan(0);
            expect(texts[0]).toBeVisible();
        });
    });

    it("ロックされているノートはロックされている旨がcontentに表示される", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={true} columns={mockColumns} rowCells={mockRowCells} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText("このノートはロックされています")).toBeVisible();
    });

});