import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// 言語ファイルを同期的に読み込む
import ja from '@/locales/ja-JP.json';
import en from '@/locales/en-US.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            ja: { translation: ja },
            en: { translation: en },
        },
        fallbackLng: 'ja',
        detection: {
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        },
        interpolation: { escapeValue: false },
        react: { useSuspense: false },
    });

export default i18n;
