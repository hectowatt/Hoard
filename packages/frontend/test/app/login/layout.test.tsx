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

    it("背景色が設定されている", () => {
        render(
            <LoginLayout>
                <div>dummy</div>
            </LoginLayout>
        );
        // bodyの背景色が指定通りか
        const body = document.querySelector("body");
        expect(body).toHaveStyle({ backgroundColor: "#e3a838" });
    });

    it("htmlタグのlang属性がjaである", () => {
        render(
            <LoginLayout>
                <div>dummy</div>
            </LoginLayout>
        );
        const html = document.querySelector("html");
        expect(html).toHaveAttribute("lang", "ja");
    });
});