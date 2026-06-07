import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const GithubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

const FOOTER_PRODUCT = [
  { to: '/', label: 'Home' },
  { to: '/discover', label: 'Discover' },
  { to: '/watchlist', label: 'Watchlist' },
];

const FOOTER_COMPANY = [
  { to: '/about', label: 'About Us' },
  { to: '/contact', label: 'Contact Support' },
];

const FOOTER_LEGAL = [
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

const FOOTER_PROVIDERS = [
  { label: 'Netflix', href: 'https://netflix.com' },
  { label: 'Prime Video', href: 'https://primevideo.com' },
  { label: 'Disney+ Hotstar', href: 'https://hotstar.com' },
  { label: 'Zee5', href: 'https://zee5.com' },
  { label: 'JioCinema', href: 'https://jiocinema.com' },
];

export const Footer: React.FC = () => {
  return (
    <footer className="relative mt-32 pb-28 md:pb-12 border-t border-white/[0.06] bg-[#070707]">
      {/* Subtle top glow */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 pt-20 pb-10">
        {/* Main columns */}
        <div className="grid grid-cols-2 md:grid-cols-[2fr_1fr_1fr_1fr_1fr] gap-10 mb-16">
          {/* Col 1 — Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-6 group">
              <div className="w-9 h-9 rounded-[12px] bg-accent flex items-center justify-center transition-all duration-300 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(var(--accent-rgb),0.5)]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                    stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-[17px] font-bold text-white tracking-tight">
                Kya<span className="text-accent-light">Dekhu</span>
              </span>
            </Link>
            <p className="text-[14px] text-white/80 font-medium mb-3 leading-relaxed max-w-xs">
              What to watch. Where to watch.<br /> Whether it's free.
            </p>
            <p className="text-xs text-muted max-w-xs leading-relaxed">
              AI-powered OTT discovery. Find something worth watching in under 30 seconds.
            </p>
          </div>

          {/* Col 2 — Product */}
          <div>
            <p className="section-label mb-5 text-[11px] font-bold tracking-widest text-muted/40 uppercase">Product</p>
            <ul className="space-y-3.5">
              {FOOTER_PRODUCT.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-muted hover:text-white transition-all duration-200 flex items-center gap-1 group">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      {label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Streamers */}
          <div>
            <p className="section-label mb-5 text-[11px] font-bold tracking-widest text-muted/40 uppercase">Streamers</p>
            <ul className="space-y-3.5">
              {FOOTER_PROVIDERS.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="text-[13px] text-muted hover:text-white transition-all duration-200 flex items-center gap-1 group">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      {label}
                    </motion.span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Company */}
          <div>
            <p className="section-label mb-5 text-[11px] font-bold tracking-widest text-muted/40 uppercase">Company</p>
            <ul className="space-y-3.5">
              {FOOTER_COMPANY.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-muted hover:text-white transition-all duration-200 flex items-center gap-1 group">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      {label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 5 — Legal */}
          <div>
            <p className="section-label mb-5 text-[11px] font-bold tracking-widest text-muted/40 uppercase">Legal</p>
            <ul className="space-y-3.5">
              {FOOTER_LEGAL.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-[13px] text-muted hover:text-white transition-all duration-200 flex items-center gap-1 group">
                    <motion.span whileHover={{ x: 3 }} className="inline-block">
                      {label}
                    </motion.span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-center sm:text-left">
            <p className="text-[12px] text-muted/50">
              © {new Date().getFullYear()} KyaDekhu. All rights reserved.
            </p>
            <p className="text-[12px] text-muted/40">
              Powered by{' '}
              <span className="text-muted/70 hover:text-white transition-colors cursor-default font-medium">
                Nyxen
              </span>
            </p>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-3.5">
            {[
              { Icon: GithubIcon, href: '#', label: 'GitHub' },
              { Icon: TwitterIcon, href: '#', label: 'Twitter/X' },
              { Icon: InstagramIcon, href: '#', label: 'Instagram' },
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.1, y: -2, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.95 }}
                className="w-9 h-9 rounded-xl border border-white/[0.07] flex items-center justify-center
                           text-muted hover:text-white hover:border-white/20 transition-all duration-200"
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
