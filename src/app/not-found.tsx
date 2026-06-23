"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
             style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(249,115,22,0.07) 0%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        {/* Film frame */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10"
        >
          <svg width="220" height="150" viewBox="0 0 220 150" fill="none" className="mx-auto">
            {/* Film body */}
            <rect x="12" y="18" width="196" height="114" rx="10" fill="#141414" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
            {/* Perforations — left */}
            {[32, 52, 72, 92, 112].map(y => (
              <rect key={y} x="20" y={y} width="14" height="9" rx="2.5" fill="#080808" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75"/>
            ))}
            {/* Perforations — right */}
            {[32, 52, 72, 92, 112].map(y => (
              <rect key={y} x="186" y={y} width="14" height="9" rx="2.5" fill="#080808" stroke="rgba(255,255,255,0.06)" strokeWidth="0.75"/>
            ))}
            {/* Screen area */}
            <rect x="46" y="28" width="128" height="94" rx="5" fill="#1a0f00" stroke="rgba(249,115,22,0.15)" strokeWidth="1"/>
            {/* 404 */}
            <text x="110" y="88" textAnchor="middle" fill="rgba(249,115,22,0.7)" fontSize="44"
                  fontWeight="900" fontFamily="Inter, sans-serif" letterSpacing="-2">
              404
            </text>
            {/* Scan line */}
            <rect x="46" y="72" width="128" height="1" fill="rgba(249,115,22,0.15)"/>
            {/* Grain dots */}
            {[[70, 42], [148, 50], [78, 104], [138, 96], [110, 74], [158, 38], [60, 88]].map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r="1.2" fill="rgba(255,255,255,0.08)"/>
            ))}
          </svg>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em] mb-3">
            This scene never made it<br className="hidden sm:block" /> into the final cut.
          </h1>
          <p className="text-[14px] text-muted leading-relaxed mb-10 max-w-xs mx-auto">
            The page you're looking for was cut in post-production. Let's get you back to the main feature.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/">
              <motion.div
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2.5 text-white font-bold px-6 py-3.5 rounded-xl cursor-pointer"
                style={{
                  background: 'linear-gradient(135deg, #F97316, #EA580C)',
                  boxShadow: '0 6px 24px rgba(249,115,22,0.4)',
                }}
              >
                <Home className="w-4 h-4" />
                Return Home
              </motion.div>
            </Link>
            <Link href="/discover">
              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-2 text-muted hover:text-white font-medium px-5 py-3.5 rounded-xl
                           hover:bg-white/[0.05] transition-all duration-150 cursor-pointer"
              >
                <Compass className="w-4 h-4" />
                Discover Something
              </motion.div>
            </Link>
          </div>

          <p className="text-[11px] text-muted/25 mt-12">
            Powered by <span className="text-muted/40">Nyxen</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
