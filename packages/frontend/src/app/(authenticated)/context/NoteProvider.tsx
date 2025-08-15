import React, { createContext, useContext, useState, useEffect } from "react";

type note = {
    id: string;
    title: string;
    content: string;
    label_id: string;
    createdate: string;
    updatedate: string;
    is_locked: boolean;
};

const NoteContext = createContext<noteContextType | undefined>(undefined);

type noteContextType = {
    notes: note[];
    setNotes?: React.Dispatch<React.SetStateAction<note[]>>;
    fetchNotes: () => Promise<void>;
}

export const NoteProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notes, setNotes] = useState<{ id: string, title: string; content: string; label_id: string; createdate: string; updatedate: string; is_locked: boolean; }[]>([]);

    // Noteを取得
    const fetchNotes = async () => {
        const response = await fetch("/api/notes", {
            method: "GET",
            credentials: "include"
        });
        if (!response.ok) throw new Error("Failed to fetch notes");
        const data = await response.json();
        setNotes(data);
    };

    useEffect(() => { fetchNotes(); }, []);

    return (
        <NoteContext.Provider value={{ notes, setNotes, fetchNotes }}>
            {children}
        </NoteContext.Provider >
    );
};

export function useNoteContext() {
    const ctx = useContext(NoteContext);
    if (!ctx) throw new Error("useNoteContext must be used within NoteProvider");
    return ctx;
}