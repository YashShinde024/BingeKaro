'use client';

import React from 'react';

// ===========================
// Movie Card Skeleton
// ===========================
export const MovieCardSkeleton: React.FC<{ size?: 'sm' | 'md' }> = ({ size = 'md' }) => {
  const width = size === 'sm' ? 'w-[140px] sm:w-[155px]' : 'w-[165px] sm:w-[190px]';
  return (
    <div className={`flex-shrink-0 ${width} space-y-3`} role="status" aria-label="Loading content">
      <div className="aspect-poster rounded-[20px] skeleton border border-white/[0.04]" />
      <div className="space-y-2 px-1">
        <div className="h-3.5 skeleton rounded w-4/5" />
        <div className="flex justify-between">
          <div className="h-3 skeleton rounded w-1/4" />
          <div className="h-3 skeleton rounded w-1/3" />
        </div>
      </div>
      <span className="sr-only">Loading movie card...</span>
    </div>
  );
};

// ===========================
// Content Rail Skeleton (full row)
// ===========================
export const ContentRailSkeleton: React.FC<{ count?: number }> = ({ count = 7 }) => (
  <div className="mb-14" role="status" aria-label="Loading content row" aria-busy="true">
    <div className="px-6 lg:px-10 mb-5 space-y-2">
      <div className="h-5 skeleton rounded w-40" />
      <div className="h-3 skeleton rounded w-56" />
    </div>
    <div className="flex gap-4 overflow-hidden px-6 lg:px-10 pb-4">
      {[...Array(count)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
    <span className="sr-only">Loading content row...</span>
  </div>
);

// ===========================
// Hero Skeleton
// ===========================
export const HeroSkeleton: React.FC = () => (
  <div className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-end" role="status" aria-label="Loading hero" aria-busy="true">
    {/* Background */}
    <div className="absolute inset-0 skeleton" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/40 to-transparent" />

    {/* Content */}
    <div className="relative z-10 w-full pb-16 sm:pb-20 pt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        <div className="space-y-6 max-w-xl">
          {/* Badge */}
          <div className="flex gap-2">
            <div className="h-7 skeleton rounded-full w-36" />
            <div className="h-7 skeleton rounded-full w-32" />
          </div>
          {/* Title */}
          <div className="space-y-3">
            <div className="h-12 skeleton rounded w-3/4" />
            <div className="h-12 skeleton rounded w-1/2" />
          </div>
          {/* Meta */}
          <div className="flex gap-3">
            <div className="h-4 skeleton rounded w-16" />
            <div className="h-4 skeleton rounded w-12" />
            <div className="h-4 skeleton rounded w-20" />
          </div>
          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 skeleton rounded w-full" />
            <div className="h-4 skeleton rounded w-5/6" />
            <div className="h-4 skeleton rounded w-2/3" />
          </div>
          {/* Search bar */}
          <div className="h-12 skeleton rounded-2xl w-full max-w-md" />
          {/* Buttons */}
          <div className="flex gap-3">
            <div className="h-12 skeleton rounded-xl w-40" />
            <div className="h-12 skeleton rounded-xl w-44" />
            <div className="h-11 w-11 skeleton rounded-xl" />
          </div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading hero section...</span>
  </div>
);

// ===========================
// Search Result Skeleton
// ===========================
export const SearchResultSkeleton: React.FC<{ count?: number }> = ({ count = 4 }) => (
  <div className="p-2 space-y-2" role="status" aria-label="Loading search results">
    {[...Array(count)].map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-2.5 rounded-2xl">
        <div className="w-10 h-14 skeleton rounded-lg shrink-0" />
        <div className="flex-1 space-y-2 min-w-0">
          <div className="h-3.5 skeleton rounded w-2/3" />
          <div className="h-3 skeleton rounded w-1/3" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading search results...</span>
  </div>
);

// ===========================
// Detail Page Skeleton
// ===========================
export const DetailPageSkeleton: React.FC = () => (
  <div className="min-h-screen bg-[#050505]" role="status" aria-label="Loading movie details" aria-busy="true">
    {/* Hero backdrop */}
    <div className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
      <div className="absolute inset-0 skeleton" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-transparent to-transparent" />

      {/* Bottom content */}
      <div className="absolute bottom-10 left-6 lg:left-10 right-6 z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
        {/* Poster skeleton */}
        <div className="w-36 md:w-48 aspect-poster rounded-2xl skeleton shrink-0" />
        {/* Details skeleton */}
        <div className="space-y-4 flex-1 max-w-2xl">
          <div className="h-4 skeleton rounded w-32" />
          <div className="h-10 skeleton rounded w-3/4" />
          <div className="flex gap-3">
            <div className="h-4 skeleton rounded w-16" />
            <div className="h-4 skeleton rounded w-20" />
            <div className="h-4 skeleton rounded w-14" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-7 skeleton rounded-full w-20" />
            <div className="h-7 skeleton rounded-full w-16" />
            <div className="h-7 skeleton rounded-full w-24" />
          </div>
        </div>
      </div>
    </div>

    {/* Content area */}
    <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
        {/* Left column */}
        <div className="space-y-4">
          <div className="h-14 skeleton rounded-xl w-full" />
          <div className="h-14 skeleton rounded-xl w-full" />
          <div className="h-14 skeleton rounded-xl w-full" />
          <div className="p-5 rounded-2xl border border-white/[0.05] space-y-3">
            <div className="h-4 skeleton rounded w-28" />
            <div className="h-10 skeleton rounded-lg w-full" />
            <div className="h-10 skeleton rounded-lg w-full" />
          </div>
        </div>
        {/* Right column */}
        <div className="space-y-12">
          {/* Overview */}
          <div className="space-y-3">
            <div className="h-5 skeleton rounded w-24" />
            <div className="h-4 skeleton rounded w-48" />
            <div className="space-y-2">
              <div className="h-4 skeleton rounded w-full" />
              <div className="h-4 skeleton rounded w-full" />
              <div className="h-4 skeleton rounded w-3/4" />
            </div>
          </div>
          {/* Cast */}
          <div className="space-y-4">
            <div className="h-5 skeleton rounded w-28" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 p-3 rounded-2xl border border-white/[0.05]">
                  <div className="w-11 h-11 skeleton rounded-xl shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-3.5 skeleton rounded w-2/3" />
                    <div className="h-3 skeleton rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    <span className="sr-only">Loading movie details...</span>
  </div>
);

// ===========================
// Inline Loading Spinner (small)
// ===========================
export const InlineSpinner: React.FC = () => (
  <div className="flex items-center justify-center py-4" role="status">
    <div className="w-5 h-5 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
    <span className="sr-only">Loading...</span>
  </div>
);
