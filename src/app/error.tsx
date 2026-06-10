"use client";

import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error("Global Error Caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-6">
      <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <AlertCircle className="w-7 h-7" />
      </div>
      <div className="space-y-2 max-w-sm">
        <h1 className="text-xl font-bold text-white">Something went wrong</h1>
        <p className="text-[13px] text-muted-foreground leading-normal">
          An unexpected error occurred while loading this page. Our team has been notified.
        </p>
      </div>
      <button
        onClick={() => reset()}
        className="h-10 px-5 rounded-xl bg-accent text-[12.5px] font-bold text-white flex items-center gap-1.5 shadow-lg hover:bg-accent/90 transition-all"
      >
        <RotateCcw className="w-4 h-4" />
        Retry Loading
      </button>
    </div>
  );
}
