import React from 'react';

// ログインページの背景色をここで定義
const backgroundColor = '#e3a838';

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div style={{ backgroundColor: backgroundColor }}>
            {children}
        </div>
    );
}