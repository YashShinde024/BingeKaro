"use client";

import React from 'react';
import { ToastProvider } from '../context/ToastContext';
import { AuthProvider } from '../context/AuthContext';
import { WatchlistProvider } from '../context/WatchlistContext';
import { HistoryProvider } from '../context/HistoryContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <AuthProvider>
        <WatchlistProvider>
          <HistoryProvider>
            {children}
          </HistoryProvider>
        </WatchlistProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
