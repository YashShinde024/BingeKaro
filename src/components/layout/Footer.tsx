"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';

const GithubIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FOOTER_PRODUCT = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/watchlist', label: 'Watchlist' },
  { to: '/profile', label: 'Profile' },
];

const FOOTER_COMPANY = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Support' },
];

const FOOTER_LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

const FOOTER_RESOURCES = [
  { to: '/about', label: 'How It Works' },
  { to: '/blog', label: 'Blog' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative border-t border-border bg-background overflow-hidden">
      {/* Ambient Radial Highlights */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[150px] bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[300px] h-[150px] bg-accent-dark/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] gap-10 md:gap-8 pb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <img src="/logo.png" alt="BingeKaro Logo" className="w-8.5 h-8.5 object-contain group-hover:scale-105 transition-transform" />
              <span className="text-[17px] font-bold text-foreground tracking-tight">
                Binge<span className="text-accent">Karo</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-foreground/70 font-medium leading-relaxed">
              Find Your Next Obsession.
            </p>
            <p className="text-[11.5px] text-muted-foreground leading-relaxed mb-4">
              AI-powered movie and TV show discovery platform. Find something worth watching instantly.
            </p>

            <Link href="/discover">
              <motion.div
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold text-white cursor-pointer overflow-hidden relative"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #EA580C)',
                  boxShadow: '0 4px 20px rgba(249,115,22,0.35), inset 0 1px 0 rgba(255,255,255,0.15)',
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Start Discovering
              </motion.div>
            </Link>
          </div>

          {/* Product Col */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase mb-5">Product</p>
            <ul className="space-y-3">
              {FOOTER_PRODUCT.map(({ to, label }) => (
                <li key={to}>
                  <Link href={to} className="text-[13px] text-muted-foreground hover:text-foreground transition-all duration-200 block font-semibold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Col */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase mb-5">Company</p>
            <ul className="space-y-3">
              {FOOTER_COMPANY.map(({ to, label }) => (
                <li key={to}>
                  <Link href={to} className="text-[13px] text-muted-foreground hover:text-foreground transition-all duration-200 block font-semibold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Col */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase mb-5">Resources</p>
            <ul className="space-y-3">
              {FOOTER_RESOURCES.map(({ to, label }) => (
                <li key={label}>
                  <Link href={to} className="text-[13px] text-muted-foreground hover:text-foreground transition-all duration-200 block font-semibold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Col */}
          <div>
            <p className="text-[10px] font-bold tracking-widest text-muted-foreground/30 uppercase mb-5">Legal</p>
            <ul className="space-y-3">
              {FOOTER_LEGAL.map(({ to, label }) => (
                <li key={to}>
                  <Link href={to} className="text-[13px] text-muted-foreground hover:text-foreground transition-all duration-200 block font-semibold">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <p className="text-[11.5px] text-muted-foreground/50">
              © {new Date().getFullYear()} BingeKaro. All rights reserved.
            </p>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/5 border border-border/40">
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> by{' '}
                <span className="text-accent font-bold tracking-wide">Nyxen</span>
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3">
            {[
              { Icon: GithubIcon, href: '#', label: 'GitHub', hoverBg: 'hover:bg-muted/10 hover:border-border hover:text-foreground' },
              { Icon: TwitterIcon, href: '#', label: 'Twitter/X', hoverBg: 'hover:bg-[#F97316]/10 hover:border-[#F97316]/25 hover:text-accent' },
              { Icon: InstagramIcon, href: '#', label: 'Instagram', hoverBg: 'hover:bg-pink-500/10 hover:border-pink-500/25 hover:text-pink-500' },
            ].map(({ Icon, href, label, hoverBg }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.08, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground transition-all duration-200 ${hoverBg}`}
              >
                <Icon />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
