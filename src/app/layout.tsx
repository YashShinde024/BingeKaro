import React from 'react';
import type { Metadata, Viewport } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from "./providers";
import { Navbar, MobileNav } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CommandPalette } from "../components/layout/CommandPalette";
import "../index.css";
import "../App.css";

export const metadata: Metadata = {
  title: "BingeKaro – Find Your Next Obsession",
  description: "AI-powered movie and TV show discovery platform that helps you instantly find what to watch across streaming services.",
  keywords: ["BingeKaro", "Movie Recommendation AI", "What To Watch", "OTT Discovery", "Streaming Guide", "AI Movie Finder"],
  openGraph: {
    title: "BingeKaro – Find Your Next Obsession",
    description: "AI-powered movie and TV show discovery platform that helps you instantly find what to watch across streaming services.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </head>
        <body className="antialiased min-h-screen bg-[#080808] text-white">
          <Providers>
            <Navbar />
            <main className="min-h-screen relative overflow-hidden">
              {children}
            </main>
            <Footer />
            <MobileNav />
            <CommandPalette />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
