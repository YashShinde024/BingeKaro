"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Star, Bookmark, Heart, Share2, Info, Play, Clock } from 'lucide-react';
import Link from 'next/link';
import type { Movie } from '../../types';
import type { NormalizedContent } from '../../lib/tmdb-types';
import { FALLBACK_POSTER } from '../../lib/tmdb';
import { OTTBadgeList } from '../badges/OTTBadge';
import { useWatchlist } from '../../context/WatchlistContext';
import { useToast } from '../../context/ToastContext';

interface MovieCardProps {
  /** Legacy mock data movie */
  movie?: Movie;
  /** TMDB normalized content */
  content?: NormalizedContent;
  index?: number;
  size?: 'sm' | 'md';
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, content, index = 0, size = 'md' }) => {
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [imgError, setImgError] = React.useState(false);

  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, removeFromFavorites, inFavorites } = useWatchlist();
  const { showToast } = useToast();

  // Normalize data from either source
  const id = movie?.id ?? content?.id ?? 0;
  const title = movie?.title ?? content?.title ?? 'Untitled';
  const year = movie?.year ?? content?.year ?? 0;
  const rating = movie?.rating ?? content?.rating ?? 0;
  const posterPath = movie?.posterPath ?? content?.posterUrl ?? null;
  const mediaType = movie?.type ?? content?.mediaType ?? 'movie';
  const runtime = movie?.runtime;
  const providers = movie?.providers;

  const posterSrc = imgError ? FALLBACK_POSTER : (posterPath || FALLBACK_POSTER);

  const saved = inWatchlist(id);
  const favorite = inFavorites(id);

  const runtimeStr = runtime
    ? runtime >= 60
      ? `${Math.floor(runtime / 60)}h${runtime % 60 > 0 ? ` ${runtime % 60}m` : ''}`
      : `${runtime}m`
    : null;

  const width = size === 'sm' ? 'w-[140px] sm:w-[155px]' : 'w-[165px] sm:w-[190px]';

  // Link path - use /movie/ for both movie and TV (handled by detail page)
  const detailPath = `/movie/${id}${mediaType === 'tv' ? '?type=tv' : ''}`;

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie) {
      if (saved) {
        removeFromWatchlist(id);
        showToast(`Removed from watchlist`, 'info');
      } else {
        addToWatchlist(movie);
        showToast(`Added to watchlist`, 'success');
      }
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (movie) {
      if (favorite) {
        removeFromFavorites(id);
        showToast(`Removed from favorites`, 'info');
      } else {
        addToFavorites(movie);
        showToast(`Added to favorites`, 'success');
      }
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/movie/${id}`;
      navigator.clipboard?.writeText(url);
      showToast('Copied link to clipboard!', 'success');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.04, y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={`flex-shrink-0 ${width} group cursor-pointer relative select-none pb-2`}
    >
      <Link href={detailPath} className="block" prefetch={false}>
        {/* Poster Wrapper */}
        <div className="relative aspect-poster rounded-[20px] overflow-hidden bg-[#0A0D14] border border-white/[0.06] transition-all duration-300 group-hover:border-[#8B5CF6]/50 group-hover:shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_24px_rgba(139,92,246,0.25)]">
          {/* Poster image with blur-up */}
          <img
            src={posterSrc}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => { setImgError(true); setImgLoaded(true); }}
            loading="lazy"
            decoding="async"
          />

          {/* Placeholder shimmer while loading */}
          {!imgLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Badges Overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-20 transition-all duration-300 group-hover:translate-y-[-1px]">
            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] font-black text-white">{rating.toFixed(1)}</span>
            </div>

            {/* Runtime or media type badge */}
            {runtimeStr ? (
              <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md rounded-full px-2 py-0.5 border border-white/10">
                <Clock className="w-2.5 h-2.5 text-white/70" />
                <span className="text-[9.5px] font-bold text-white/90">{runtimeStr}</span>
              </div>
            ) : (
              <span className={`media-badge ${mediaType === 'tv' ? 'media-badge-tv' : 'media-badge-movie'}`}>
                {mediaType === 'tv' ? 'TV' : 'Movie'}
              </span>
            )}
          </div>

          {/* Bottom Dark Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-40" />

          {/* Premium Hover Overlay Content */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3.5 z-10">
            {/* Top row - Category Tag */}
            <div className="relative z-10 flex justify-start">
              <span className={`media-badge ${mediaType === 'tv' ? 'media-badge-tv' : 'media-badge-movie'}`}>
                {mediaType === 'tv' ? 'TV SHOW' : 'MOVIE'}
              </span>
            </div>

            {/* Center: Play/Trailer button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-[#8B5CF6] text-white flex items-center justify-center shadow-[0_0_24px_rgba(139,92,246,0.4)] transform scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 hover:bg-[#8B5CF6]/90 hover:scale-110 active:scale-95">
                <Play className="w-5 h-5 fill-white ml-0.5" />
              </div>
            </div>

            {/* Bottom Actions Row (only if we have legacy movie data for watchlist) */}
            {movie && (
              <div className="relative z-10 mt-auto flex items-center justify-center gap-2 transform translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                <button
                  onClick={handleSave}
                  title="Save to Watchlist"
                  className={`w-8 h-8 rounded-full border flex items-center justify-center backdrop-blur-md transition-all hover:scale-110 active:scale-95 ${
                    saved
                      ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]'
                      : 'bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white text-white' : ''}`} />
                </button>

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

                <button
                  onClick={handleShare}
                  title="Copy Link"
                  className="w-8 h-8 rounded-full border bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-md transition-all"
                >
                  <Share2 className="w-3.5 h-3.5" />
                </button>

                <Link href={detailPath} onClick={e => e.stopPropagation()} className="block">
                  <div className="w-8 h-8 rounded-full border bg-black/55 border-white/10 text-white/80 hover:bg-black/80 hover:text-white hover:scale-110 active:scale-95 flex items-center justify-center backdrop-blur-md transition-all" title="More Info">
                    <Info className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Info below poster */}
        <div className="mt-3 px-1">
          <h3 className="text-[13px] font-bold text-white/90 leading-tight truncate group-hover:text-[#8B5CF6] transition-colors duration-200">
            {title}
          </h3>
          <div className="flex items-center justify-between gap-1.5 mt-1.5">
            <div className="flex items-center gap-1.5">
              {year > 0 && <span className="text-[11px] font-semibold text-muted-foreground">{year}</span>}
              {mediaType === 'tv' && (
                <span className="media-badge media-badge-tv">TV</span>
              )}
            </div>
            {providers && (
              <div className="shrink-0 flex items-center">
                <OTTBadgeList providers={providers} size="xs" max={1} />
              </div>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
