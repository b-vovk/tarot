import './globals.css';
import Header from '@/components/Header';
import { ReactNode } from 'react';

export const metadata = { title: 'Tarot Daily', description: 'Щоденний розклад Таро' };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-dvh bg-zinc-100 text-zinc-900">
        <Header />
        <main className="max-w-5xl mx-auto p-4">{children}</main>
      </body>
    </html>
  );
}
