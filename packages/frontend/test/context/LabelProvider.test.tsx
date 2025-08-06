// LabelProvider.test.tsx
import React from "react";
import { render, waitFor, screen } from "@testing-library/react";
import { LabelProvider, useLabelContext } from "@/app/(authenticated)/context/LabelProvider";
import "@testing-library/jest-dom";

const mockLabels = [
  { id: "1", labelname: "仕事" },
  { id: "2", labelname: "プライベート" },
];

type label = { id: string; labelname: string }

// テスト用の子コンポーネント
const TestComponent = () => {
  const { labels } = useLabelContext();
  return (
    <ul>
      {labels.map((label: label) => (
        <li key={label.id}>{label.labelname}</li>
      ))}
    </ul>
  );
};

describe("LabelProvider", () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => mockLabels,
    }) as jest.Mock;
  });

  it("fetchLabelsでAPIからラベルを取得し、コンテキスト経由で提供する", async () => {
    render(
      <LabelProvider>
        <TestComponent />
      </LabelProvider>
    );

    // fetch の完了と再レンダリングを待つ
    await waitFor(() => {
      expect(screen.getByText("仕事")).toBeInTheDocument();
      expect(screen.getByText("プライベート")).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/labels", expect.any(Object));
  });
});
