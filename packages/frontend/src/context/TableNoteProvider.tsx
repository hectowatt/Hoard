import React, { createContext, useContext, useState, useEffect } from "react";

type tableNote = {
    id: string;
    title: string;
    label_id: string;
    createdate: string;
    updatedate: string;
    is_locked: boolean;
    columns: Column[];
    rowCells: RowCell[][];
};

type Column = {
    id: number;
    name: string;
    order?: number;
}

type RowCell = {
    id: number;
    rowIndex: number;
    value: string;
    columnId?: number;
}

const tableNoteContext = createContext<tableNoteContextType | undefined>(undefined);

type tableNoteContextType = {
    tableNotes: tableNote[];
    setTableNotes: React.Dispatch<React.SetStateAction<tableNote[]>>;
    fetchTableNotes: () => Promise<void>;
}

export const TableNoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [tableNotes, setTableNotes] = useState<tableNote[]>([]);


    // TableNoteを取得
    const fetchTableNotes = async () => {
        const response = await fetch("/api/tablenotes");
        if (!response.ok) throw new Error("Failed to fetch table notes");
        const data = await response.json();
        setTableNotes(data);
    }

    useEffect(() => { fetchTableNotes(); }, []);

    return (
        <tableNoteContext.Provider value={{ tableNotes, setTableNotes, fetchTableNotes }}>
            {children}
        </tableNoteContext.Provider >
    );
};

export function useTableNoteContext() {
    const ctx = useContext(tableNoteContext);
    if (!ctx) throw new Error("useTableNoteContext must be used within NoteProvider");
    return ctx;
}