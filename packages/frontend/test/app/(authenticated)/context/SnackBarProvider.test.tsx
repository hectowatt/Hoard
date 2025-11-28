import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SnackbarProvider, useSnackbar } from "@/app/(authenticated)/context/SnackBarProvider";

const TestComponent = () => {
    const { showSnackbar } = useSnackbar();

    return (
        <div>
            <button onClick={() => showSnackbar("Success message", "success")} data-testid="success-btn">
                Show Success
            </button>
            <button onClick={() => showSnackbar("Error message", "error")} data-testid="error-btn">
                Show Error
            </button>
            <button onClick={() => showSnackbar("Info message", "info")} data-testid="info-btn">
                Show Info
            </button>
            <button onClick={() => showSnackbar("Warning message", "warning")} data-testid="warning-btn">
                Show Warning
            </button>
            <button onClick={() => showSnackbar("Default message")} data-testid="default-btn">
                Show Default
            </button>
        </div>
    );
};

describe("SnackbarProvider", () => {
    it("Snackbarが正常にレンダリングされる", () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        expect(screen.getByTestId("success-btn")).toBeInTheDocument();
        expect(screen.getByTestId("error-btn")).toBeInTheDocument();
        expect(screen.getByTestId("info-btn")).toBeInTheDocument();
        expect(screen.getByTestId("warning-btn")).toBeInTheDocument();
        expect(screen.getByTestId("default-btn")).toBeInTheDocument();
    });

    it("showSnackbar でメッセージが表示される", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("success-btn");
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Success message")).toBeInTheDocument();
        });
    });

    it("severity が success の場合、正しいAlert が表示される", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("success-btn");
        await userEvent.click(button);

        await waitFor(() => {
            const alert = screen.getByRole("alert");
            expect(alert).toBeInTheDocument();
            expect(alert).toHaveClass("MuiAlert-standardSuccess");
        });
    });

    it("severity が error の場合、正しいAlert が表示される", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("error-btn");
        await userEvent.click(button);

        await waitFor(() => {
            const alert = screen.getByRole("alert");
            expect(alert).toHaveClass("MuiAlert-standardError");
        });
    });

    it("severity が warning の場合、正しいAlert が表示される", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("warning-btn");
        await userEvent.click(button);

        await waitFor(() => {
            const alert = screen.getByRole("alert");
            expect(alert).toHaveClass("MuiAlert-standardWarning");
        });
    });

    it("デフォルト severity は info である", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("default-btn");
        await userEvent.click(button);

        await waitFor(() => {
            const alert = screen.getByRole("alert");
            expect(alert).toHaveClass("MuiAlert-standardInfo");
        });
    });

    it("複数のメッセージが連続して表示できる", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const successBtn = screen.getByTestId("success-btn");
        const errorBtn = screen.getByTestId("error-btn");

        await userEvent.click(successBtn);
        await waitFor(() => {
            expect(screen.getByText("Success message")).toBeInTheDocument();
        });

        // クローズボタンを取得してクリック
        const closeButton = screen.getByRole("button", { name: /close/i });
        await userEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Success message")).not.toBeInTheDocument();
        });

        // 次のメッセージを表示
        await userEvent.click(errorBtn);
        await waitFor(() => {
            expect(screen.getByText("Error message")).toBeInTheDocument();
        });
    });

    it("Snackbar の閉じるボタンをクリックするとメッセージが非表示になる", async () => {
        render(
            <SnackbarProvider>
                <TestComponent />
            </SnackbarProvider>
        );

        const button = screen.getByTestId("success-btn");
        await userEvent.click(button);

        await waitFor(() => {
            expect(screen.getByText("Success message")).toBeInTheDocument();
        });

        const closeButton = screen.getByRole("button", { name: /close/i });
        await userEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText("Success message")).not.toBeInTheDocument();
        });
    });
});