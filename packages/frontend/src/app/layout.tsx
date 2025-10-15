import ThemeRegistry from './context/ThemeProvider';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hoard",
    description: "A Notes app with table and password lock",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#e3a838' },
        { media: '(prefers-color-scheme: dark)', color: '#f2bb3c' },
    ],
    appleWebApp: {
        capable: true,
        statusBarStyle: 'black-translucent',
        title: 'Hoard',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                <ThemeRegistry>
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    );
}