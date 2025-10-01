import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MCSS Club 2026",
  description: "MCSS Club application",
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
