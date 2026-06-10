"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-transparent flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      <span className="text-[12px] font-bold text-muted-foreground uppercase tracking-widest animate-pulse">
        Loading BingeKaro...
      </span>
    </div>
  );
}
