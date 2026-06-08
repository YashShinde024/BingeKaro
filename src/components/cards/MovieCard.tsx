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
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className={`flex-shrink-0 ${width} group cursor-pointer relative select-none`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/movie/${movie.id}`} className="block">
        {/* Poster Wrapper */}
        <div className="relative aspect-poster rounded-[24px] overflow-hidden bg-[#0A0D14] border border-white/[0.04] transition-all duration-300 group-hover:border-[#8B5CF6]/30 group-hover:shadow-[0_12px_32px_rgba(0,0,0,0.8),0_0_20px_rgba(139,92,246,0.15)]">
          {/* Poster image */}
          <img
            src={imgError ? FALLBACK_POSTER : movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
            loading="lazy"
          />

          {/* Top Info overlay */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 transition-all duration-300 group-hover:translate-y-[-2px]">
            <span className={`text-[8.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/5`}>
              {movie.isFree ? 'FREE' : 'PREMIUM'}
            </span>

            {/* Rating pill */}
            <div className="flex items-center gap-0.5 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/5">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-white">{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Bottom Dark Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-40" />

          {/* Premium V3 Hover Overlay */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-10">
            {/* Backdrop image (blurred in background) */}
            <img
              src={bdError ? FALLBACK_BACKDROP : movie.backdropPath}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none transition-transform duration-700 scale-110 group-hover:scale-100"
              onError={() => setBdError(true)}
            />

            {/* Top row - spacer */}
            <div className="h-6" />

            {/* Center: Play/Trailer button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)] transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 hover:bg-[#8B5CF6]/90 hover:scale-110 active:scale-95">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom: Floating translucent circular action chips */}
            <div className="relative z-10 mt-auto flex items-center justify-center gap-2 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
              {/* Quick Save */}
              <button
                onClick={handleSave}
                title="Quick Save"
                className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
                  saved
                    ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                    : 'bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white text-white' : ''}`} />
              </button>

              {/* Favorite */}
              <button
                onClick={handleFavorite}
                title="Favorite"
                className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
                  favorite
                    ? 'bg-[#FF3B30] border-[#FF3B30] text-white shadow-[0_0_10px_rgba(255,59,48,0.3)]'
                    : 'bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white text-white' : ''}`} />
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                title="Share"
                className="w-8 h-8 rounded-full border bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-md transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>

              {/* Info */}
              <Link href={`/movie/${movie.id}`} onClick={e => e.stopPropagation()} className="block">
                <div className="w-8 h-8 rounded-full border bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-md transition-all" title="More Info">
                  <Info className="w-3.5 h-3.5" />
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* Info below poster */}
        <div className="mt-3 px-1">
          <div className="flex items-start justify-between gap-1">
            <h3 className="text-[13px] font-bold text-white/90 leading-tight truncate group-hover:text-[#8B5CF6] transition-colors duration-200">
              {movie.title}
            </h3>
          </div>
          <div className="flex items-center justify-between gap-1.5 mt-1">
            <span className="text-[11px] font-semibold text-muted-foreground">{movie.year}</span>
            <div className="shrink-0 flex items-center">
              <OTTBadgeList providers={movie.providers} size="xs" max={1} />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
