import React, { Children, createContext, useContext } from "react";

type searchLabelType = {
    searchLabel: string;
    setSearchLabel: React.Dispatch<React.SetStateAction<string>>;
};

const SearchLabelContext = createContext<searchLabelType | undefined>(undefined);

export function useSearchLabelContext() {
    const ctx = useContext(SearchLabelContext);
    if (!ctx) throw new Error("SearchLabelContext must be used within SearchLabelProvider");
    return ctx;
}

export const SearchLabelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchLabel, setSearchLabel] = React.useState<string>("");

    return (
        <SearchLabelContext.Provider value={{ searchLabel, setSearchLabel }}>
            {children}
        </SearchLabelContext.Provider>
    );
}