'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import i18n from '@/app/lib/i18n';

type LocaleContextType = {
    locale: string;
    setLocale: (lng: string) => void;
};

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export const useLocale = () => {
    const ctx = useContext(LocaleContext);
    if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
    return ctx;
};

export const LocaleProvider = ({ children }: { children: React.ReactNode }) => {
    const [locale, setLocaleState] = useState(i18n.language);

    const setLocale = (lng: string) => {
        i18n.changeLanguage(lng);
        setLocaleState(lng);
    };

    useEffect(() => {
        setLocale(i18n.language);
    }, []);

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
};
