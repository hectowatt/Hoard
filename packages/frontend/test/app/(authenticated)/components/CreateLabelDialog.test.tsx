import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateLabelDialog from "@/app/(authenticated)/components/CreateLabelDialog";
import { LabelProvider } from "@/app/(authenticated)/context/LabelProvider";
import { NoteProvider } from "@/app/(authenticated)/context/NoteProvider";

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

describe("CreateLabelDialog", () => {
    const mockOnClose = jest.fn();
    const mockOnLabelUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        if (typeof fetchMock !== "undefined") {
            fetchMock.resetMocks();
            fetchMock.mockResponse(JSON.stringify({}));
        }
    });

    it("ダイアログが開いているときタイトルが表示される", () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <CreateLabelDialog open={true} onClose={mockOnClose} />
                </LabelProvider>
            </NoteProvider>
        );
        expect(screen.getByText("ラベルを編集")).toBeVisible();
    });

    it("ラベル名を入力できる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <CreateLabelDialog open={true} onClose={mockOnClose} />
                </LabelProvider>
            </NoteProvider>
        );
        const input = screen.getByLabelText("新しいラベルを作成") as HTMLInputElement;
        await act(async () => {
            fireEvent.change(input, { target: { value: "新しいラベル" } });
        });
        expect(input.value).toBe("新しいラベル");
    });

    it("キャンセルボタンでonCloseが呼ばれる", async () => {
        render(
            <NoteProvider>
                <LabelProvider>
                    <CreateLabelDialog open={true} onClose={mockOnClose} />
                </LabelProvider>
            </NoteProvider>
        );
        await act(async () => {
            fireEvent.click(screen.getByText("閉じる"));
        });
        expect(mockOnClose).toHaveBeenCalled();
    });
});