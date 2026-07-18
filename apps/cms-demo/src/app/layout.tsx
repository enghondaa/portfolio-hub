import type { Metadata } from "next";
import Link from "next/link";
import { Newsreader, Inter, IBM_Plex_Mono } from "next/font/google";
import { DemoStrip } from "@/components/DemoStrip";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://mohand-cms-demo.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Notes — a CMS demo by Mohand Elshahawy",
    template: "%s — Notes",
  },
  description:
    "A demo MDX content site: drop in a .mdx file and it publishes as a new article on rebuild, no code changes required. Part of Mohand Elshahawy's portfolio.",
};

const navLinks = [
  { href: "/", label: "Articles" },
  { href: "/how-this-was-built", label: "How this was built" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${newsreader.variable} ${inter.variable} ${ibmPlexMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <div className="flex min-h-screen flex-col">
          <DemoStrip
            stack={["Next.js 16", "MDX", "Shiki", "gray-matter", "RSS"]}
            sourcePath="apps/cms-demo"
            caseStudySlug="cms-demo"
          />

          <header className="border-b border-[var(--color-neutral-200)]">
            <div className="mx-auto flex max-w-2xl items-center justify-between px-5 py-5 sm:px-0">
              <Link href="/" className="font-[family-name:var(--font-heading)] text-lg font-semibold tracking-tight text-[var(--color-neutral-800)]">
                Notes<span className="text-[var(--color-accent)]">.</span>
              </Link>
              <nav className="flex items-center gap-6 font-mono text-xs text-[var(--color-neutral-600)]" aria-label="Primary">
                {navLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="transition-colors hover:text-[var(--color-accent)]">
                    {link.label}
                  </Link>
                ))}
                <a
                  href="https://mohand-hub.vercel.app"
                  className="rounded-full border border-[var(--color-neutral-200)] px-3 py-1.5 transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                >
                  ← Portfolio
                </a>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="border-t border-[var(--color-neutral-200)]">
            <div className="mx-auto flex max-w-2xl flex-wrap items-center justify-between gap-3 px-5 py-8 font-mono text-xs text-[var(--color-neutral-600)] sm:px-0">
              <span>A CMS demo by Mohand Elshahawy</span>
              <a href="/rss.xml" className="transition-colors hover:text-[var(--color-accent)]">
                RSS
              </a>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
