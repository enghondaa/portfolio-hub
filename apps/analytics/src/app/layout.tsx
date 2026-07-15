import type { Metadata } from "next";
import { Manrope, Work_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://mohand-analytics-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Analytics Dashboard demo — Mohand Elshahawy",
  description:
    "A seeded-data school analytics dashboard: attendance trends, grade distribution, and a wellbeing heatmap, built with D3.js and Chart.js. Demo data only — no real students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${workSans.variable} ${jetbrainsMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <header className="border-b border-[var(--color-neutral-200)]">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-6">
              <span className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[var(--color-neutral-800)]">
                School Analytics<span className="text-[var(--color-accent)]">.</span>
              </span>
              <a
                href="https://mohand-hub.vercel.app"
                className="rounded-full border border-[var(--color-neutral-200)] px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                ← Portfolio
              </a>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-neutral-200)]">
            <div className="mx-auto max-w-6xl px-5 py-8 font-mono text-xs text-[var(--color-neutral-600)] sm:px-6">
              Demo dashboard by Mohand Elshahawy — all data is seeded and fictional.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
