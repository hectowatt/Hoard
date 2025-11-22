import React, { act } from "react";
import { render, screen, fireEvent, within, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

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
import TableNote from "@/app/(authenticated)/components/TableNote";
import TrashTableNote from "@/app/(authenticated)/components/TrashTableNote";
import i18n from "@/app/lib/i18n";


describe("TrashTableNote", () => {
    const mockOnRestore = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof fetchMock !== "undefined") {
            fetchMock.resetMocks();
            fetchMock.mockResponse(JSON.stringify({}));
        }
    });

    it("タイトル・内容・日付・ラベルが表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashTableNote id={"testid111"} title={"テストノート"} label_id={"label1"} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={false} onRestore={mockOnRestore} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );
        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText(/2025\/07\/05/)).toBeVisible();
        expect(screen.getByText(/2025\/07\/06/)).toBeVisible();
        expect(screen.getByText("仕事")).toBeVisible();
    });

    it("openがfalseのとき、タイトルと作成日、更新日が表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashTableNote id={"testid111"} title={"テストノート"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={false} onRestore={mockOnRestore} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText("テストノート")).toBeVisible();
        expect(screen.getByText(/2025\/07\/05/)).toBeVisible();
        expect(screen.getByText(/2025\/07\/06/)).toBeVisible();
    })

    it("クリックした時、復元、完全に削除、キャンセルボタンが表示される", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashTableNote id={"testid111"} title={"テストノート"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={false} onRestore={mockOnRestore} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        await act(async () => {
            fireEvent.click(screen.getByText("テストノート"));
        })

        expect(screen.getByRole("dialog")).toBeVisible();
        expect(screen.getByTestId("button_restore")).toBeVisible();
        expect(screen.getByTestId("button_permanently_delete")).toBeVisible();
        expect(screen.getByTestId("button_cancel")).toBeVisible();
    })



    it("フォーカスが外れたときに縮小化される", async () => {
        render(
            <>
                <NoteProvider>
                    <LabelProvider>
                        <TrashTableNote id={"testid111"} title={"テストノートタイトル"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={false} onRestore={mockOnRestore} onDelete={mockOnDelete} />
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

    it("ロックされているノートはロックされている旨がcontentに表示される", async () => {
        const lockedText = i18n.t("label_lockednote");
        render(
            <NoteProvider>
                <LabelProvider>
                    <TrashTableNote id={"testid111"} title={"テストノート"} label_id={""} createdate="2025-07-05 05:33:05.864" updatedate="2025-07-06 05:33:05.864" is_locked={true} onRestore={mockOnRestore} onDelete={mockOnDelete} />
                </LabelProvider>
            </NoteProvider>
        );

        expect(screen.getByText(lockedText)).toBeVisible();
    });

});