import type { Metadata } from "next";
import Link from "next/link";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import { DemoStrip } from "@/components/DemoStrip";
import { CartButton } from "@/components/CartButton";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const siteUrl = "https://mohand-orders-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Kahwa Supply — OrderFlow storefront demo",
  description:
    "A working order-management demo: browse a specialty coffee catalogue, check out with a simulated payment, and track your order. Seeded, fictional data. Built by Mohand Elshahawy.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${fraunces.variable} ${inter.variable} ${plexMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <DemoStrip
            stack={["Next.js 16", "orders-core", "Zod", "Postgres", "Zustand"]}
            sourcePath="apps/orders"
            caseStudySlug="orderflow"
            companion={{ label: "Admin panel →", url: "https://mohand-orders-admin.vercel.app/login" }}
          />

          <header className="sticky top-0 z-40 border-b border-[var(--color-neutral-200)] bg-[rgba(243,236,225,0.82)] backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-6">
              <Link
                href="/"
                className="font-[family-name:var(--font-heading)] text-xl font-semibold tracking-tight text-[var(--color-neutral-800)]"
              >
                Kahwa Supply<span className="text-[var(--color-accent)]">.</span>
              </Link>
              <nav className="flex items-center gap-5 font-mono text-xs">
                <Link href="/" className="text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]">
                  Shop
                </Link>
                <Link href="/track" className="text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)]">
                  Track order
                </Link>
                <a
                  href="https://mohand-hub.vercel.app"
                  className="hidden text-[var(--color-neutral-600)] transition-colors hover:text-[var(--color-accent)] sm:inline"
                >
                  ← Portfolio
                </a>
                <CartButton />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-neutral-200)]">
            <div className="mx-auto max-w-6xl px-5 py-8 font-mono text-[11px] text-[var(--color-neutral-600)] sm:px-6">
              Designed and built by Mohand Elshahawy. Type: Fraunces, Inter, IBM Plex Mono. Built with Next.js, deployed on Vercel. Kahwa Supply is a fictional brand for this demo.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
