import type { Metadata } from "next";
import Link from "next/link";
import { Sora, Inter, IBM_Plex_Mono } from "next/font/google";
import { DemoStrip } from "@/components/DemoStrip";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://mohand-taskboard-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Task Board demo — Mohand Elshahawy",
  description:
    "A drag-and-drop kanban board over a real REST API: Zod-validated Next.js Route Handlers, optimistic updates with rollback, and a storage adapter that runs on Postgres or in memory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sora.variable} ${inter.variable} ${plexMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <DemoStrip
            stack={["Next.js 16", "Route Handlers", "Zod", "dnd-kit", "Postgres"]}
            sourcePath="apps/taskboard"
            caseStudySlug="taskboard"
          />

          <header className="border-b border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5 sm:px-6">
              <Link
                href="/"
                className="font-[family-name:var(--font-heading)] text-lg font-bold tracking-tight text-[var(--color-neutral-800)]"
              >
                Task Board<span className="text-[var(--color-accent)]">.</span>
              </Link>
              <nav className="flex items-center gap-2">
                <Link
                  href="/how-this-was-built"
                  className="rounded-full px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]"
                >
                  How it&apos;s built
                </Link>
                <a
                  href="https://mohand-hub.vercel.app"
                  className="rounded-full border border-[var(--color-neutral-200)] px-3 py-1.5 font-mono text-xs text-[var(--color-neutral-600)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  ← Portfolio
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-neutral-200)] bg-[var(--color-neutral-50)]">
            <div className="mx-auto max-w-5xl px-5 py-8 font-mono text-xs text-[var(--color-neutral-600)] sm:px-6">
              Demo task board by Mohand Elshahawy — seeded content, public API.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
