import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Watchlist',
  description: 'Manage your entertainment queue. Track movies and TV shows you want to watch, are currently watching, or have completed.',
};

export default function WatchlistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
