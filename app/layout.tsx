import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kotak IB — Svatantra Microfin IPO Dashboard",
  description: "Live deal analysis dashboard for Kotak Investment Banking Analyst Program",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}