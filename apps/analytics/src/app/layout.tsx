import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Analytics Dashboard",
  description: "School analytics dashboard demo (Phase 4)",
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
