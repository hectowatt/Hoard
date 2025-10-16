import ThemeRegistry from './context/ThemeProvider';
import type { Metadata, Viewport } from 'next';

export const metadata: Metadata = {
    title: "Hoard",
    description: "A Notes app with table and password lock",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',

    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'Hoard',
    },
};

export const viewport: Viewport = {
    minimumScale: 1,
    initialScale: 1,
    width: 'device-width',
    viewportFit: 'cover',
    themeColor: [
        { media: '(prefers-color-scheme: light)', color: '#e3a838' },
        { media: '(prefers-color-scheme: dark)', color: '#f2bb3c' },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {

    return (
        <html lang="ja">
            <body style={{ margin: 0 }}>
                <ThemeRegistry>
                    {children}
                </ThemeRegistry>
            </body>
        </html>
    );
}