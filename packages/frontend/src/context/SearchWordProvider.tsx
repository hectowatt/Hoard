import React, { Children, createContext, useContext } from "react";

type searchWordType = {
    searchWord: string;
    setSearchWord: React.Dispatch<React.SetStateAction<string>>;
};

const SearchWordContext = createContext<searchWordType | undefined>(undefined);

export function useSearchWordContext() {
    const ctx = useContext(SearchWordContext);
    console.log("useSearchWordContext called, ctx:", ctx);
    if (!ctx) throw new Error("SearchWordContext must be used within SearchWordProvider");
    return ctx;
}

export const SearchWordProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [searchWord, setSearchWord] = React.useState<string>("");
    console.log("SearchWordProvider initialized:", { searchWord, setSearchWord });

    return (
        <SearchWordContext.Provider value={{ searchWord, setSearchWord }}>
            {children}
        </SearchWordContext.Provider>
    );
}