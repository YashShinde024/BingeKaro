import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Profile | BingeKaro',
  description: 'Manage your BingeKaro account, preferences, custom AI taste DNA, and view streaming statistics.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
