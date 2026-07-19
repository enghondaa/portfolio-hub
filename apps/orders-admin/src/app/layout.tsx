import type { Metadata } from "next";
import { Manrope, Inter, JetBrains_Mono } from "next/font/google";
import { DemoStrip } from "@/components/DemoStrip";
import "./globals.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-heading", display: "swap" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-body", display: "swap" });
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

const siteUrl = "https://mohand-orders-admin.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "OrderFlow Admin — Kahwa Supply",
  description: "Auth-gated admin dashboard for the OrderFlow demo. Internal tool, seeded data.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${manrope.variable} ${inter.variable} ${jetbrainsMono.variable} bg-[var(--color-neutral-0)] font-sans text-[var(--color-neutral-800)] antialiased`}
      >
        <DemoStrip
          stack={["Next.js 16", "orders-core", "jose JWT", "bcrypt", "Postgres", "D3"]}
          sourcePath="apps/orders-admin"
          caseStudySlug="orderflow"
          companion={{ label: "Customer storefront →", url: "https://mohand-orders-demo.vercel.app" }}
        />
        {children}
      </body>
    </html>
  );
}
