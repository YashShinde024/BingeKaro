import React from 'react';
import type { Metadata, Viewport } from "next";
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { Providers } from "./providers";
import { Navbar, MobileNav } from "../components/layout/Navbar";
import { Footer } from "../components/layout/Footer";
import { CommandPalette } from "../components/layout/CommandPalette";
import { AuthModal } from "../components/auth/AuthModal";
import "../index.css";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://binge-karo.vercel.app'),
  title: {
    default: "BingeKaro — Find Your Next Obsession",
    template: "%s | BingeKaro"
  },
  description: "Discover movies, TV shows and streaming platforms with BingeKaro. AI-powered OTT discovery to find something worth watching instantly.",
  keywords: ["BingeKaro", "Movie Recommendation", "What To Watch", "OTT Discovery", "Streaming Guide", "Movie Finder", "TV Shows", "Netflix", "Prime Video"],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "BingeKaro — Find Your Next Obsession",
    description: "AI-powered movie and TV show discovery. Find something worth watching instantly.",
    url: "https://binge-karo.vercel.app",
    siteName: "BingeKaro",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BingeKaro — Find Your Next Obsession",
    description: "AI-powered movie and TV show discovery. Find something worth watching instantly.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#F97316',
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
      <html lang="en" className={inter.variable} suppressHydrationWarning>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                "name": "BingeKaro",
                "url": "https://binge-karo.vercel.app",
                "description": "AI-powered movie and TV show discovery platform",
                "applicationCategory": "EntertainmentApplication",
                "operatingSystem": "Web",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                }
              }),
            }}
          />
        </head>
        <body className={`${inter.className} antialiased min-h-screen bg-bg text-[var(--text)]`}>
          <Providers>
            <Navbar />
            <main className="min-h-screen relative">
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
