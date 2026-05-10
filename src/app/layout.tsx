import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Monopoly Deal — Card Game",
  description: "A digital implementation of the Monopoly Deal card game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
