import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Prompt Library", template: "%s · Prompt Library" },
  description: "A curated collection of AI prompts for writing, business, creativity, code, and more. Search, filter, and copy prompts instantly.",
  openGraph: { title: "Prompt Library", description: "A curated collection of AI prompts for writing, business, creativity, code, and more." },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
