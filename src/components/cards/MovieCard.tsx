import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Clock, Play, Bookmark, Heart, Share2, Info } from 'lucide-react';
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

  const width = size === 'sm' ? 'w-[130px] sm:w-[145px]' : 'w-[150px] sm:w-[170px]';

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
    } else {
      addToFavorites(movie);
      showToast(`Added to favorites ♥`, 'success');
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard?.writeText(`${window.location.origin}/movie/${movie.id}`);
    showToast('Link copied!', 'success');
  };

  // Action buttons with stagger
  const actions = [
    { icon: saved ? <Bookmark className="w-3.5 h-3.5 fill-white" /> : <Bookmark className="w-3.5 h-3.5" />, label: saved ? 'Saved' : 'Save', onClick: handleSave, active: saved, color: 'accent' },
    { icon: <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-rose-400' : ''}`} />, label: 'Like', onClick: handleFavorite, active: favorite, color: 'rose' },
    { icon: <Share2 className="w-3.5 h-3.5" />, label: 'Share', onClick: handleShare, active: false, color: 'white' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.055, ease: [0.16, 1, 0.3, 1] }}
      className={`flex-shrink-0 ${width} group cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster container */}
        <motion.div
          className="relative aspect-poster rounded-[14px] overflow-hidden bg-[#1a1a1a]"
          animate={{
            scale: hovered ? 1.04 : 1,
            y: hovered ? -4 : 0,
          }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            boxShadow: hovered
              ? '0 20px 60px rgba(0,0,0,0.9), 0 0 0 1px rgba(139,92,246,0.2), 0 0 40px rgba(139,92,246,0.15)'
              : 'var(--shadow-card)'
          }}
        >
          {/* Poster image */}
          <motion.img
            src={imgError ? FALLBACK_POSTER : movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            animate={{ scale: hovered ? 1.1 : 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Base gradient (always present) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Top — FREE badge + Rating */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20">
            {movie.isFree ? (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md
                               bg-accent/90 text-white backdrop-blur-sm shadow-[0_2px_8px_rgba(139,92,246,0.4)]">
                FREE
              </span>
            ) : <div />}

            {/* Rating pill — hides on hover */}
            <AnimatePresence>
              {!hovered && (
                <motion.div
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1 bg-black/70 backdrop-blur-sm rounded-lg px-1.5 py-0.5"
                >
                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                  <span className="text-[11px] font-semibold text-white">{movie.rating.toFixed(1)}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ─── HOVER REVEAL PANEL ─── */}
          <AnimatePresence>
            {hovered && (
              <motion.div
                initial={{ opacity: 0, y: '100%' }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: '80%' }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0 z-10"
              >
                {/* Backdrop image (blurred, beneath content) */}
                <img
                  src={bdError ? FALLBACK_BACKDROP : movie.backdropPath}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                  onError={() => setBdError(true)}
                />

                {/* Dark gradient overlay over backdrop */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/98 via-black/85 to-black/50" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-3">
                  {/* Top: Play hint */}
                  <div className="flex justify-center pt-2">
                    <motion.div
                      initial={{ scale: 0.6, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.1, duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                      className="w-10 h-10 rounded-full bg-white/15 backdrop-blur-sm border border-white/25
                                 flex items-center justify-center"
                    >
                      <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                    </motion.div>
                  </div>

                  {/* Bottom: Info + Actions */}
                  <div>
                    {/* Movie info */}
                    <div className="mb-2">
                      <div className="flex items-center gap-1.5 mb-1">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-[10px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                        <span className="text-[10px] text-white/40">·</span>
                        <div className="flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5 text-white/50" />
                          <span className="text-[10px] text-white/50">{runtimeStr}</span>
                        </div>
                      </div>
                      {/* OTT badges */}
                      <OTTBadgeList providers={movie.providers} size="xs" max={3} />
                    </div>

                    {/* Quick action buttons — staggered */}
                    <div className="flex items-center gap-1.5">
                      {actions.map((action, i) => (
                        <motion.button
                          key={action.label}
                          initial={{ opacity: 0, y: 6, scale: 0.8 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: 0.08 + i * 0.06, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                          whileHover={{ scale: 1.12, y: -1 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={action.onClick}
                          title={action.label}
                          className={`flex-1 h-7 flex items-center justify-center rounded-lg border backdrop-blur-sm
                                      transition-colors duration-150 ${
                            action.active
                              ? action.color === 'accent'
                                ? 'bg-accent/80 border-accent/40 text-white'
                                : 'bg-rose-500/70 border-rose-500/30 text-white'
                              : 'bg-white/10 border-white/15 text-white/80 hover:bg-white/20 hover:text-white'
                          }`}
                        >
                          {action.icon}
                        </motion.button>
                      ))}
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.32, duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                      >
                        <Link to={`/movie/${movie.id}`} onClick={e => e.stopPropagation()}>
                          <motion.div
                            whileHover={{ scale: 1.12, y: -1 }}
                            whileTap={{ scale: 0.92 }}
                            className="h-7 w-7 flex items-center justify-center rounded-lg border border-white/15
                                       bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition-colors"
                            title="Info"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </motion.div>
                        </Link>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Info below poster */}
        <div className="mt-3 px-0.5">
          <h3 className="text-[13px] font-semibold text-white/90 leading-snug truncate
                         group-hover:text-accent-light transition-colors duration-200">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-[11px] text-muted">{movie.year}</span>
            <span className="w-0.5 h-0.5 bg-muted/40 rounded-full flex-shrink-0" />
            <div className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-muted/70" />
              <span className="text-[11px] text-muted">{runtimeStr}</span>
            </div>
          </div>
          {/* OTT badges always visible below */}
          <div className="mt-2">
            <OTTBadgeList providers={movie.providers} size="xs" max={3} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
