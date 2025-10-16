import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import LoginLayout from "@/app/login/layout";

describe("LoginLayout", () => {
    it("childrenがContainer内に描画される", () => {
        render(
            <LoginLayout>
                <div data-testid="child">ログイン画面の子要素</div>
            </LoginLayout>
        );
        // Container内にchildrenが表示されているか
        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.getByText("ログイン画面の子要素")).toBeVisible();
    });
});