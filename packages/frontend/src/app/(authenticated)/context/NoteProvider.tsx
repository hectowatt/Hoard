import React, { createContext, useContext, useState, useEffect } from "react";
import { useSnackbar } from "./SnackBarProvider";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

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
    const { showSnackbar } = useSnackbar();
    const { t } = useTranslation();
    const router = useRouter();

    // Noteを取得
    const fetchNotes = async () => {
        try {
            const response = await fetch("/api/notes", {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) {
                if (response.status === 401) {
                    console.error("Error fetching notes:");
                    showSnackbar(t("message_error_occured_redirect_login"), "warning");
                    router.push("/login");
                }
                throw new Error("Failed to fetch notes")
            };
            const data = await response.json();
            setNotes(data);
        } catch (error) {
            console.error("Error fetching notes:", error);
            showSnackbar(t("message_error_occured_redirect_login"), "warning");
            router.push("/login");
        }
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