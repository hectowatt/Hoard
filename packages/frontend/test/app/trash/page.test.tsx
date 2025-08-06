import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import Home from "../../../src/app/(authenticated)/trash/page";
import "@testing-library/jest-dom";

// モック：TrashNote, TrashTableNote
jest.mock("../../../src/components/TrashNote", () => (props: any) => (
    <div data-testid="trashnote">{props.title}</div>
));
jest.mock("../../../src/components/TrashTableNote", () => (props: any) => (
    <div data-testid="trashtablenote">{props.title}</div>
));

// モック：useLabelContext（ラベルは使われていないがエラー回避のため必要）
jest.mock("@/context/LabelProvider", () => ({
    useLabelContext: () => ({
        labels: [],
        fetchLabels: jest.fn(),
    }),
}));

// グローバル fetch モック
beforeEach(() => {
    (global.fetch as jest.Mock) = jest.fn((url: string) => {
        if (url.includes("/api/notes/trash")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "n1",
                            title: "Trash Note 1",
                            content: "Deleted content",
                            label_id: "",
                            is_locked: false,
                            createdate: "",
                            updatedate: "",
                        },
                    ]),
            });
        }

        if (url.includes("/api/tablenotes/trash")) {
            return Promise.resolve({
                ok: true,
                json: () =>
                    Promise.resolve([
                        {
                            id: "t1",
                            title: "Trash Table Note 1",
                            label_id: "",
                            is_locked: false,
                            createdate: "",
                            updatedate: "",
                        },
                    ]),
            });
        }

        return Promise.reject("unknown endpoint");
    });
});

describe("Trash Page", () => {
    it("renders trash notes and table notes", async () => {
        render(<Home />);

        // 最初のテキスト
        expect(screen.getByTestId("description")).toHaveTextContent("ゴミ箱内のノート");

        // 非同期描画を待つ
        await waitFor(() => {
            expect(screen.getByTestId("trashnote")).toHaveTextContent("Trash Note 1");
            expect(screen.getByTestId("trashtablenote")).toHaveTextContent("Trash Table Note 1");
        });

        // fetchが呼ばれていることを確認
        expect(fetch).toHaveBeenCalledWith("/api/notes/trash", expect.any(Object));
        expect(fetch).toHaveBeenCalledWith("/api/tablenotes/trash", expect.any(Object));
    });
});
