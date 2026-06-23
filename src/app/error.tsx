"use client";

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6 relative overflow-hidden">
      {/* Subtle ambient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0"
             style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(239,68,68,0.05) 0%, transparent 100%)' }} />
      </div>

      <div className="relative z-10 text-center max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-6"
        >
          <AlertCircle className="w-8 h-8" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 mb-8"
        >
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Something went wrong
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-xs mx-auto">
            An unexpected error occurred while loading this page. Please try again or return home.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-accent text-white font-bold text-sm hover:bg-accent-dark transition-colors shadow-lg"
          >
            <RotateCcw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl text-muted hover:text-white font-medium text-sm hover:bg-white/[0.05] transition-all"
          >
            <Home className="w-4 h-4" />
            Return Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
