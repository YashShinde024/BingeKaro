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
  metadataBase: new URL('https://binge-karo.vercel.app'),
  title: {
    default: "BingeKaro",
    template: "%s | BingeKaro"
  },
  description: "Discover movies, TV shows and streaming platforms with BingeKaro.",
  keywords: ["BingeKaro", "Movie Recommendation AI", "What To Watch", "OTT Discovery", "Streaming Guide", "AI Movie Finder"],
  alternatives: {
    canonical: '/',
  },
  openGraph: {
    title: "BingeKaro",
    description: "Discover movies, TV shows and streaming platforms with BingeKaro.",
    url: "https://binge-karo.vercel.app",
    siteName: "BingeKaro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BingeKaro",
    description: "Discover movies, TV shows and streaming platforms with BingeKaro.",
  }
};

export const viewport: Viewport = {
  themeColor: '#8B5CF6',
  width: 'device-width',
  initialScale: 1,
};

import { AuthModal } from "../components/auth/AuthModal";

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
            <AuthModal />
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
