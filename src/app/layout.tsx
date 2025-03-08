import { TempoInit } from "./tempo-init";
import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import Script from "next/script";
import "./globals.css";

// Body font
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
});

// Heading font - more modern and edgy
const outfit = Outfit({
  subsets: ["latin"],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "PitchHub - Complete Agency New Business Solution",
  description: "Centralize your agency's knowledge, streamline proposal creation, and win more business with PitchHub's all-in-one platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${outfit.variable}`}>
      <Script src="https://api.tempolabs.ai/proxy-asset?url=https://storage.googleapis.com/tempo-public-assets/error-handling.js" />
      <body className={inter.className}>
        {children}
        <TempoInit />
      </body>
    </html>
  );
}
