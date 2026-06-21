import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Discover OTT Releases | BingeKaro',
  description: 'Personalized OTT recommendation engine. Filter by streaming platforms, your moods, genre preferences, and find your next perfect watch.',
};

export default function DiscoverLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
