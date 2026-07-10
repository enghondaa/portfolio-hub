import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CMS Demo",
  description: "MDX content site demo (Phase 5)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
