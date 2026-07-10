import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Task Board",
  description: "MERN task board demo (Phase 3)",
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
