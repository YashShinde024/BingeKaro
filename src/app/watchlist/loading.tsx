import React from 'react';
import { MovieCardSkeleton } from '../../components/ui/Skeletons';

export default function WatchlistLoading() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.05]">
          <div className="space-y-2">
            <div className="h-6 skeleton rounded w-48" />
            <div className="h-4 skeleton rounded w-72" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-14 w-20 skeleton rounded-2xl" />
            <div className="h-14 w-20 skeleton rounded-2xl" />
            <div className="h-14 w-20 skeleton rounded-2xl" />
          </div>
        </div>
      </div>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
          {[...Array(12)].map((_, i) => (
            <MovieCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
