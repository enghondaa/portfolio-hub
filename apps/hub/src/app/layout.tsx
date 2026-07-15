import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar, Footer, ThemeToggle } from "@portfolio/ui";
import { ScrollProgress } from "@/components/ScrollProgress";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-heading",
  display: "swap",
});

const inter = Inter({
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

const siteUrl = "https://mohand-hub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mohand Elshahawy — Senior Front-End Engineer",
    template: "%s — Mohand Elshahawy",
  },
  description:
    "Portfolio and live demo apps for Mohand Elshahawy, a Senior Front-End Engineer. Real production work, real demos, real deployed URLs.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mohand Elshahawy",
    title: "Mohand Elshahawy — Senior Front-End Engineer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a Senior Front-End Engineer. Real production work, real demos, real deployed URLs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohand Elshahawy — Senior Front-End Engineer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a Senior Front-End Engineer.",
  },
};

const navLinks = [
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

// Runs before paint so the correct theme is set before first render, no flash.
const themeInitScript = `
(function () {
  try {
    var stored = window.localStorage.getItem("portfolio-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    if (theme === "dark") document.documentElement.classList.add("dark");
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-0 opacity-[0.035] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          }}
        />
        <ScrollProgress />
        <div className="relative flex min-h-screen flex-col">
          <Navbar
            brand="Mohand Elshahawy"
            links={navLinks}
            actions={<ThemeToggle />}
          />
          <main className="flex-1">{children}</main>
          <Footer copyright={`© ${new Date().getFullYear()} Mohand Elshahawy`}>
            <a
              href="https://github.com/enghondaa/portfolio-hub"
              className="hover:text-[var(--color-neutral-800)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] rounded"
            >
              Source on GitHub
            </a>
          </Footer>
        </div>
      </body>
    </html>
  );
}
