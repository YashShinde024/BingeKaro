"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Bookmark, Heart, Share2, Info, Play } from 'lucide-react';
import Link from 'next/link';
import type { Movie } from '../../types';
import { OTTBadgeList } from '../badges/OTTBadge';
import { useWatchlist } from '../../context/WatchlistContext';
import { useToast } from '../../context/ToastContext';

interface MovieCardProps {
  movie: Movie;
  index?: number;
  size?: 'sm' | 'md';
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';
const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0, size = 'md' }) => {
  const [imgError, setImgError] = React.useState(false);
  const [bdError, setBdError] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, removeFromFavorites, inFavorites } = useWatchlist();
  const { showToast } = useToast();

  const saved = inWatchlist(movie.id);
  const favorite = inFavorites(movie.id);

  const runtimeStr = movie.runtime >= 60
    ? `${Math.floor(movie.runtime / 60)}h${movie.runtime % 60 > 0 ? ` ${movie.runtime % 60}m` : ''}`
    : `${movie.runtime}m`;

  const width = size === 'sm' ? 'w-[135px] sm:w-[150px]' : 'w-[160px] sm:w-[180px]';

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (saved) {
      removeFromWatchlist(movie.id);
      showToast(`Removed from watchlist`, 'info');
    } else {
      addToWatchlist(movie);
      showToast(`Added to watchlist`, 'success');
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (favorite) {
      removeFromFavorites(movie.id);
      showToast(`Removed from favorites`, 'info');
    } else {
      addToFavorites(movie);
      showToast(`Added to favorites ♥`, 'success');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/movie/${movie.id}`;
      navigator.clipboard?.writeText(url);
      showToast('Copied link to clipboard!', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.03, 0.3), ease: [0.16, 1, 0.3, 1] }}
      className={`flex-shrink-0 ${width} group cursor-pointer relative select-none`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} className="block">
        {/* Poster Wrapper */}
        <div className="relative aspect-poster rounded-2xl overflow-hidden bg-[#0A0D14] border border-white/[0.04] transition-all duration-300 group-hover:border-accent/30 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.1)]">
          {/* Poster image */}
          <img
            src={imgError ? FALLBACK_POSTER : movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Top Info overlay */}
          <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-20">
            <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-white border border-white/5`}>
              {movie.isFree ? 'FREE' : 'PREMIUM'}
            </span>

            {/* Rating pill */}
            <div className="flex items-center gap-0.5 bg-black/70 backdrop-blur-md rounded px-1.5 py-0.5 border border-white/5">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-white">{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bottom Dark Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent opacity-90" />

          {/* Hover Details Panel Overlay (Hidden on touch devices using hover: media query styling where possible, or managed via JS) */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-10 flex flex-col justify-end p-3 bg-gradient-to-t from-black via-black/95 to-black/50 backdrop-blur-[2px] hidden md:flex"
              >
                {/* Backdrop image (blurred in background) */}
                <img
                  src={bdError ? FALLBACK_BACKDROP : movie.backdropPath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                  onError={() => setBdError(true)}
                />

                {/* Content Container */}
                <div className="relative z-10 space-y-2">
                  <p className="text-[10px] text-white/70 line-clamp-3 leading-relaxed font-sans font-medium">
                    {movie.overview}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map(g => (
                      <span key={g} className="text-[8.5px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 capitalize font-bold tracking-wide">
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[9.5px] font-bold text-white/40">
                    <span>{runtimeStr}</span>
                    <span>·</span>
                    <span>{movie.year}</span>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/5">
                    <button
                      onClick={handleSave}
                      title="Save to Watchlist"
                      className={`flex-1 h-7 rounded-lg border backdrop-blur-sm transition-all flex items-center justify-center ${
                        saved
                          ? 'bg-accent border-accent text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <Bookmark className={`w-3 h-3 ${saved ? 'fill-white text-white' : ''}`} />
                    </button>
                    <button
                      onClick={handleFavorite}
                      title="Like movie"
                      className={`flex-1 h-7 rounded-lg border backdrop-blur-sm transition-all flex items-center justify-center ${
                        favorite
                          ? 'bg-rose-500 border-rose-500 text-white shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                          : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${favorite ? 'fill-white text-white' : ''}`} />
                    </button>
                    <button
                      onClick={handleShare}
                      title="Share link"
                      className="flex-1 h-7 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 transition-all flex items-center justify-center"
                    >
                      <Share2 className="w-3 h-3" />
                    </button>
                    <Link href={`/movie/${movie.id}`} onClick={e => e.stopPropagation()} className="shrink-0">
                      <div className="h-7 w-7 rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 transition-all flex items-center justify-center">
                        <Info className="w-3 h-3" />
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info below poster */}
        <div className="mt-2.5 px-0.5">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-[12.5px] font-bold text-white/90 leading-tight truncate group-hover:text-accent-light transition-colors duration-200">
              {movie.title}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-1.5 mt-1">
            <span className="text-[10.5px] font-bold text-muted">{movie.year}</span>
            <div className="shrink-0 flex items-center">
              <OTTBadgeList providers={movie.providers} size="xs" max={1} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
