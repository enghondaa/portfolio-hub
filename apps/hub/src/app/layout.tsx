import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { Navbar, Footer, ThemeToggle } from "@portfolio/ui";
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
    default: "Mohand Elshahawy — Full-Stack MERN Developer",
    template: "%s — Mohand Elshahawy",
  },
  description:
    "Portfolio and live demo apps for Mohand Elshahawy, a full-stack MERN developer. Real projects, real code, real deployed URLs.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mohand Elshahawy",
    title: "Mohand Elshahawy — Full-Stack MERN Developer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a full-stack MERN developer. Real projects, real code, real deployed URLs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohand Elshahawy — Full-Stack MERN Developer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a full-stack MERN developer.",
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
        <div className="flex min-h-screen flex-col">
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
