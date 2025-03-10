import { TempoInit } from "./tempo-init";
import type { Metadata } from "next";
import { Inter, Montserrat, Work_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers/providers";
import { TempoScripts } from "@/components/tempo-scripts";

// Body font - Inter with weights 500, 600 for UI elements
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
  weight: ['500', '600'],
});

// Primary heading font - Montserrat with weights 400, 600, 700
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '600', '700'],
});

// Alternative heading font - Work Sans with weights 400, 600, 700
const workSans = Work_Sans({
  subsets: ["latin"],
  variable: '--font-work-sans',
  display: 'swap',
  weight: ['400', '600', '700'],
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} ${workSans.variable}`}>
      <head>
        <Script id="animation-preload" strategy="beforeInteractive">
          {`
            // Preload animation libraries
            window.framerMotionConfig = {
              reducedMotion: 'user',
              renderToDOM: true
            };
          `}
        </Script>
        {/* Tempo scripts moved to a client component */}
        <TempoScripts />
      </head>
      <body className={inter.className}>
        <Providers>
          {children}
          <TempoInit />
        </Providers>
      </body>
    </html>
  );
}
