import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Xvohsome — Desktop",
  description: "Retro desktop environment for Xvohsome",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
