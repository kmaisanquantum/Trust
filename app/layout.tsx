import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trust — Verified PNG Marketplace",
  description: "Papua New Guinea's trusted marketplace with SevisPass digital identity and escrow protection.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
