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
      icon: saved ? <Bookmark className="w-3.5 h-3.5 fill-white text-white" /> : <Bookmark className="w-3.5 h-3.5" />, 
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
          className="relative aspect-poster rounded-card overflow-hidden bg-[#121212] border border-white/[0.06]"
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
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent" />

          {/* Top Info overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-20">
            {movie.isFree ? (
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-[6px] bg-emerald-500 text-white shadow-[0_2px_10px_rgba(16,185,129,0.4)]">
                FREE
              </span>
            ) : (
              <span className="text-[9px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-[6px] bg-violet-600 text-white shadow-[0_2px_10px_rgba(139,92,246,0.4)]">
                PREMIUM
              </span>
            )}

            {/* Rating pill */}
            <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md rounded-lg px-2 py-0.5 border border-white/[0.08]">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[11px] font-bold text-white">{movie.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Hover Details Panel Overlay */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: '15%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '15%' }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-10 flex flex-col justify-end p-3.5 bg-gradient-to-t from-black via-black/95 to-black/40 backdrop-blur-[3px]"
              >
                {/* Backdrop image (blurred in background) */}
                <img
                  src={bdError ? FALLBACK_BACKDROP : movie.backdropPath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-15 pointer-events-none"
                  onError={() => setBdError(true)}
                />

                {/* Content Container */}
                <div className="relative z-10 space-y-2.5">
                  <p className="text-[10px] text-white/70 line-clamp-3 leading-relaxed font-sans">
                    {movie.overview}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {movie.genres.slice(0, 2).map(g => (
                      <span key={g} className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-white/80 capitalize font-medium">
                        {g}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1 text-[10px] font-medium text-white/50">
                    <span>{runtimeStr}</span>
                    <span>·</span>
                    <span>{movie.year}</span>
                  </div>

                  {/* Actions Grid */}
                  <div className="flex items-center gap-1.5 pt-1 border-t border-white/5">
                    {actions.map((action) => (
                      <button
                        key={action.label}
                        onClick={action.onClick}
                        title={action.label}
                        className={`flex-1 h-7.5 flex items-center justify-center rounded-btn border backdrop-blur-sm transition-colors duration-150 ${
                          action.active
                            ? action.color === 'accent'
                              ? 'bg-accent border-accent/40 text-white shadow-[0_0_12px_rgba(139,92,246,0.3)]'
                              : 'bg-rose-500 border-rose-500/30 text-white shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/15'
                        }`}
                      >
                        {action.icon}
                      </button>
                    ))}
                    <Link to={`/movie/${movie.id}`} onClick={e => e.stopPropagation()} className="shrink-0">
                      <div
                        className="h-7.5 w-7.5 flex items-center justify-center rounded-btn border border-white/10 bg-white/5 text-white/80 hover:bg-white/15 transition-colors"
                        title="More Info"
                      >
                        <Info className="w-3.5 h-3.5" />
                      </div>
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info below poster */}
        <div className="mt-3 px-0.5">
          <div className="flex items-center justify-between gap-1">
            <h3 className="text-[13px] font-bold text-white/90 leading-snug truncate group-hover:text-accent-light transition-colors duration-200">
              {movie.title}
            </h3>
            <div className="flex items-center gap-0.5 text-white/40 text-[10px] font-bold shrink-0">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              {movie.rating.toFixed(1)}
            </div>
          </div>
          <div className="flex items-center justify-between gap-1.5 mt-1.5">
            <span className="text-[11px] font-medium text-muted">{movie.year}</span>
            <div className="shrink-0 flex items-center">
              <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
