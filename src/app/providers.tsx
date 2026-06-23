"use client";

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { WatchlistProvider } from '../context/WatchlistContext';
import { HistoryProvider } from '../context/HistoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <ToastProvider>
        <AuthProvider>
          <WatchlistProvider>
            <HistoryProvider>
              {children}
              <Toaster position="top-right" theme="system" />
            </HistoryProvider>
          </WatchlistProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
