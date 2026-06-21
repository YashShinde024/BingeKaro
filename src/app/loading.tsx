import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[70vh] bg-transparent flex flex-col items-center justify-center space-y-5" role="status" aria-label="Loading">
      {/* Animated logo mark */}
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-xl bg-accent/20 animate-ping" />
        <div className="relative w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
              stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
      <div className="space-y-1.5 text-center">
        <span className="text-xs font-bold text-white/60 uppercase tracking-widest block">
          Loading
        </span>
        <div className="flex gap-1 justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
      <span className="sr-only">Loading BingeKaro content...</span>
    </div>
  );
}
