import type { Metadata } from 'next';
import { Geist, Geist_Mono, Cairo } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import LanguageSync from '@/components/layout/LanguageSync';

const geistSans = Geist({ variable: '--font-body', subsets: ['latin'], display: 'swap' });
const geistMono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'], display: 'swap' });
const cairo = Cairo({ variable: '--font-cairo', subsets: ['arabic'], display: 'swap' });

export const metadata: Metadata = {
  title: { template: '%s | Frontend Interview Prep', default: 'Frontend Interview Prep' },
  description: 'A comprehensive interactive study platform for senior frontend React/Next.js interviews.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${cairo.variable} dark`}>
      <body className="bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-700)] min-h-screen antialiased">
        <LanguageSync />
        {/* Desktop Sidebar — fixed, always visible */}
        <div className="hidden lg:block fixed top-0 ltr:left-0 rtl:right-0 w-64 h-screen z-50 print:hidden border-r ltr:border-[var(--color-neutral-200)] rtl:border-l rtl:border-[var(--color-neutral-200)]">
          <Sidebar />
        </div>

        {/* Main content — offset by sidebar width */}
        <div className="lg:ms-64 flex flex-col min-h-screen">
          <Header showMenu />
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
