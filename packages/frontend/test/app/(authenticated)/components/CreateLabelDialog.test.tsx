import React, { act } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import CreateLabelDialog from "@/app/(authenticated)/components/CreateLabelDialog";
import { LabelProvider } from "@/app/(authenticated)/context/LabelProvider";
import { NoteProvider } from "@/app/(authenticated)/context/NoteProvider";
import userEvent from '@testing-library/user-event';
import { SnackbarProvider } from "@/app/(authenticated)/context/SnackbarProvider";
import { LocaleProvider } from "@/app/context/LocaleProvider";

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

jest.mock("next/navigation", () => ({
    ...jest.requireActual("next/navigation"),
    useRouter: () => ({
        push: jest.fn(),
        replace: jest.fn(),
        prefetch: jest.fn(),
    }),
}));

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
            <LocaleProvider>
                <SnackbarProvider>
                    <NoteProvider>
                        <LabelProvider>
                            <CreateLabelDialog open={true} onClose={mockOnClose} />
                        </LabelProvider>
                    </NoteProvider>
                </SnackbarProvider>
            </LocaleProvider>
        );
        expect(screen.getByTestId("label_input_labels")).toBeVisible();
    });

    it("ラベル名を入力できる", async () => {
        const user = userEvent.setup();
        render(
            <LocaleProvider>
                <SnackbarProvider>
                    <NoteProvider>
                        <LabelProvider>
                            <CreateLabelDialog open={true} onClose={mockOnClose} />
                        </LabelProvider>
                    </NoteProvider>
                </SnackbarProvider>
            </LocaleProvider>
        );
        const input = screen.getByTestId("label-input");
        await user.type(input, "新しいラベル");
        expect(input).toHaveValue("新しいラベル");
    });

    it("キャンセルボタンでonCloseが呼ばれる", async () => {
        render(
            <LocaleProvider>
                <SnackbarProvider>
                    <NoteProvider>
                        <LabelProvider>
                            <CreateLabelDialog open={true} onClose={mockOnClose} />
                        </LabelProvider>
                    </NoteProvider>
                </SnackbarProvider>
            </LocaleProvider>
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId("button_close"));
        });
        expect(mockOnClose).toHaveBeenCalled();
    });
});