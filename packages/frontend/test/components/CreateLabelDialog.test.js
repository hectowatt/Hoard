import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateLabelDialog from "../../src/components/CreateLabelDialog";

describe("CreateLabelDialog", () => {
    const mockOnClose = jest.fn();
    const mockOnLabelUpdate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("ダイアログが開いているときタイトルが表示される", () => {
        render(
            <CreateLabelDialog open={true} onClose={mockOnClose} onLabelUpdate={mockOnLabelUpdate} />
        );
        expect(screen.getByText("ラベルを作成")).toBeInTheDocument();
    });

    it("ラベル名を入力できる", () => {
        render(
            <CreateLabelDialog open={true} onClose={mockOnClose} onLabelUpdate={mockOnLabelUpdate} />
        );
        const input = screen.getByLabelText("ラベル名");
        fireEvent.change(input, { target: { value: "新しいラベル" } });
        expect(input.value).toBe("新しいラベル");
    });

    it("キャンセルボタンでonCloseが呼ばれる", () => {
        render(
            <CreateLabelDialog open={true} onClose={mockOnClose} onLabelUpdate={mockOnLabelUpdate} />
        );
        fireEvent.click(screen.getByText("キャンセル"));
        expect(mockOnClose).toHaveBeenCalled();
    });

    it("作成ボタンでonLabelUpdateが呼ばれる", async () => {
        render(
            <CreateLabelDialog open={true} onClose={mockOnClose} onLabelUpdate={mockOnLabelUpdate} />
        );
        const input = screen.getByLabelText("ラベル名");
        fireEvent.change(input, { target: { value: "新しいラベル" } });
        fireEvent.click(screen.getByText("作成"));
        // onLabelUpdateは非同期で呼ばれる場合があるため
        expect(mockOnLabelUpdate).toHaveBeenCalled();
    });
});