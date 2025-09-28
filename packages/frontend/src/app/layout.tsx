import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: "Hoard",
    description: "A Notes app with table and password lock",
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    manifest: '/manifest.json',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ja">
            <body>
                {children}
            </body>
        </html>
    );
}