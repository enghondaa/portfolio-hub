import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk, DM_Mono } from "next/font/google";
import { ScrollProgress } from "@/components/ScrollProgress";
import { FloatingNavbar } from "@/components/FloatingNavbar";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
  display: "swap",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

const siteUrl = "https://mohand-hub.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mohand Elshahawy — Full-Stack Developer",
    template: "%s — Mohand Elshahawy",
  },
  description:
    "Portfolio and live demo apps for Mohand Elshahawy, a Full-Stack Developer. Real production work, real demos, real deployed URLs.",
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "Mohand Elshahawy",
    title: "Mohand Elshahawy — Full-Stack Developer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a Full-Stack Developer. Real production work, real demos, real deployed URLs.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Mohand Elshahawy — Full-Stack Developer",
    description:
      "Portfolio and live demo apps for Mohand Elshahawy, a Full-Stack Developer.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${bricolageGrotesque.variable} ${hankenGrotesk.variable} ${dmMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <ScrollProgress />
        <FloatingNavbar />
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
