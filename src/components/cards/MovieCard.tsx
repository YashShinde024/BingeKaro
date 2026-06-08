import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Bookmark, Heart, Share2, Info } from 'lucide-react';
import { Link } from 'react-router-dom';
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

  const width = size === 'sm' ? 'w-[140px] sm:w-[155px]' : 'w-[160px] sm:w-[185px]';

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
    const url = `${window.location.origin}/movie/${movie.id}`;
    navigator.clipboard?.writeText(url);
    showToast('Copied link to clipboard!', 'success');
  };

  // Actions
  const actions = [
    { 
      icon: saved ? <Bookmark className="w-3.5 h-3.5 fill-white" /> : <Bookmark className="w-3.5 h-3.5" />, 
      label: saved ? 'Saved' : 'Save', 
      onClick: handleSave, 
      active: saved, 
      color: 'accent' 
    },
    { 
      icon: <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-500 text-rose-500' : ''}`} />, 
      label: 'Like', 
      onClick: handleFavorite, 
      active: favorite, 
      color: 'rose' 
    },
    { 
      icon: <Share2 className="w-3.5 h-3.5" />, 
      label: 'Share', 
      onClick: handleShare, 
      active: false, 
      color: 'white' 
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      className={`flex-shrink-0 ${width} group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster Wrapper */}
        <motion.div
          className="relative aspect-poster rounded-2xl overflow-hidden bg-[#121212] border border-white/[0.06]"
          animate={{
            scale: hovered ? 1.03 : 1,
            y: hovered ? -6 : 0,
            borderColor: hovered ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255, 255, 255, 0.06)'
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            boxShadow: hovered
              ? '0 25px 50px -12px rgba(0,0,0,0.85), 0 0 20px rgba(139,92,246,0.15)'
              : '0 4px 20px -8px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Poster image */}
          <motion.img
            src={imgError ? FALLBACK_POSTER : movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Bottom Dark Gradient Shadow */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          {/* Top Info overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-20">
            {movie.isFree ? (
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-lg bg-emerald-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.4)]">
                FREE
              </span>
            ) : (
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-lg bg-violet-600 text-white shadow-[0_2px_10px_rgba(139,92,246,0.4)]">
                PREMIUM
              </span>
            )}

            {/* Rating pill */}
            <AnimatePresence>
              {!hovered && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2 py-0.5 border border-white/[0.08]"
                >
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Hover Details Panel Overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: '15%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '15%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-10 flex flex-col justify-end p-3.5 bg-gradient-to-t from-black via-black/85 to-black/30 backdrop-blur-[3px]"
              >
                {/* Backdrop image (blurred in background) */}
                <img
                  src={bdError ? FALLBACK_BACKDROP : movie.backdropPath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-10 pointer-events-none"
                  onError={() => setBdError(true)}
                />

                {/* Content Container */}
                <div className="relative z-10 space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                      <span className="text-[10px] text-white/40">·</span>
                      <span className="text-[10px] font-medium text-white/60">{runtimeStr}</span>
                    </div>

                    {/* OTT badges with full pill format showing availability */}
                    <div className="pt-0.5">
                      <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
                    </div>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-1.5">
                    {actions.map((action) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.93 }}
                        onClick={action.onClick}
                        title={action.label}
                        className={`flex-1 h-7 flex items-center justify-center rounded-lg border backdrop-blur-sm transition-colors duration-150 ${
                          action.active
                            ? action.color === 'accent'
                              ? 'bg-accent border-accent/40 text-white'
                              : 'bg-rose-500 border-rose-500/30 text-white'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15'
                        }`}
                      >
                        {action.icon}
                      </motion.button>
                    ))}
                    <Link to={`/movie/${movie.id}`} onClick={e => e.stopPropagation()} className="shrink-0">
                      <motion.div
                        whileHover={{ scale: 1.1, y: -1 }}
                        whileTap={{ scale: 0.93 }}
                        className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 transition-colors"
                        title="More Info"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </motion.div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info below poster */}
        <div className="mt-3.5 px-0.5">
          <h3 className="text-[13px] font-bold text-white/90 leading-snug truncate group-hover:text-accent-light transition-colors duration-200">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[11px] font-medium text-muted">{movie.year}</span>
            <span className="w-1 h-1 bg-white/10 rounded-full flex-shrink-0" />
            <span className="text-[11px] font-medium text-muted">{runtimeStr}</span>
          </div>
          {/* Always display OTT provider pill format below card */}
          <div className="mt-2 flex flex-wrap gap-1">
            <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
