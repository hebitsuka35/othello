'use client';

import '../styles/globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        <title>オセロ</title>
        <meta name="description" content="オセロ" />
      </head>
      <body>{children}</body>
    </html>
  );
}
