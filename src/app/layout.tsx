import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'TalkMate — Real conversations. Real confidence.',
  description:
    'Connect with real people around the world for speaking practice, language exchange, and natural conversations.',
};

export const viewport: Viewport = {
  themeColor: '#080B12',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="ambient-backdrop min-h-screen font-sans text-slate-100 antialiased selection:bg-[#6C8CFF]/30">
        {children}
      </body>
    </html>
  );
}
