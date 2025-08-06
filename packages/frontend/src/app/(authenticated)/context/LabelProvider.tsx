import React, { createContext, useContext, useState, useCallback } from "react";

// ラベルをグローバルに保持するためのコンテキストプロバイダー
type Label = { id: string; labelname: string };

type LabelContextType = {
    labels: Label[];
    fetchLabels: () => Promise<void>;
};

const LabelContext = createContext<LabelContextType | undefined>(undefined);

export const useLabelContext = () => {
    const ctx = useContext(LabelContext);
    if (!ctx) throw new Error("useLabelContext must be used within a LabelProvider");
    return ctx;
};

export const LabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [labels, setLabels] = useState<Label[]>([]);

    const fetchLabels = useCallback(async () => {
        const response = await fetch("/api/labels", {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) throw new Error("Failed to fetch labels");
        const data = await response.json();
        setLabels(Array.isArray(data) ? data : []);
    }, []);

    React.useEffect(() => { fetchLabels(); }, [fetchLabels]);

    return (
        <LabelContext.Provider value={{ labels, fetchLabels }}>
            {children}
        </LabelContext.Provider>
    );
};