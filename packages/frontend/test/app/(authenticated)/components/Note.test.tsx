import React, { act } from "react";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Note from "@/app/(authenticated)/components/Note";

// ラベルコンテキストのモック
const mockLabels = [
    { id: "label1", labelname: "仕事" },
    { id: "label2", labelname: "プライベート" },
];

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
import i18n from "@/app/lib/i18n";


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
                    <Note id={"testid111"} title={"テストノート"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText("テストノートcontent")).toBeVisible();
        expect(screen.getByText(/2025\/07\/05/)).toBeVisible();
        expect(screen.getByText(/2025\/07\/06/)).toBeVisible();
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

        expect(screen.getByTestId("button_edit")).toBeVisible();
        expect(screen.getByTestId("button_delete")).toBeVisible();
        expect(screen.getByTestId("unlock")).toBeVisible();
    })

    it("編集モード時、タイトルを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByTestId("button_edit"));
        })

        const titleInput = screen.getByDisplayValue("テストノートタイトル") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(titleInput, { target: { value: "新しいタイトル" } });
        });

        expect(titleInput.value).toBe("新しいタイトル");

    });

    it("編集モード時、contentを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        })

        await act(async () => {
            fireEvent.click(screen.getByTestId("button_edit"));
        })

        const contentInput = screen.getByDisplayValue("テストノートcontent") as HTMLInputElement;

        await act(async () => {
            fireEvent.change(contentInput, { target: { value: "新しいcontent" } });
        });

        expect(contentInput.value).toBe("新しいcontent");

    });

    it("編集モード時、ラベルを編集できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={"label1"} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノートタイトル"));
        });

        await act(async () => {
            fireEvent.click(screen.getByTestId("button_edit"));
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
                        <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={"label1"} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
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
        const lockedText = i18n.t("label_lockednote");
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={false} onSave={mockOnSave} onDelete={mockOnDelete} />
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
            const texts = screen.getAllByText(lockedText);
            expect(texts.length).toBeGreaterThan(0);
            expect(texts[0]).toBeVisible();
        });
    });

    it("ロックされているノートはロックされている旨がcontentに表示される", async () => {
        const lockedText = i18n.t("label_lockednote");
        render(
            <NoteProvider>
                <LabelProvider>
                    <Note id={"testid111"} title={"テストノートタイトル"} content={"テストノートcontent"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-05 05:33:05.864" is_locked={true} onSave={mockOnSave} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText(lockedText)).toBeVisible();
    });

});