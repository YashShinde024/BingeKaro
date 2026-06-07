import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, Play, Bookmark, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Movie } from '../../types';
import { OTTBadgeList } from '../badges/OTTBadge';
import { useWatchlist } from '../../context/WatchlistContext';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

export const MovieCard: React.FC<MovieCardProps> = ({ movie, index = 0 }) => {
  const [imgError, setImgError] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, removeFromFavorites, inFavorites } = useWatchlist();

  const saved = inWatchlist(movie.id);
  const favorite = inFavorites(movie.id);

  const runtimeStr = movie.runtime >= 60
    ? `${Math.floor(movie.runtime / 60)}h${movie.runtime % 60 > 0 ? ` ${movie.runtime % 60}m` : ''}`
    : `${movie.runtime}m`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="flex-shrink-0 w-[140px] sm:w-[160px] group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/movie/${movie.id}`} className="block">
        {/* Poster */}
        <div 
          className="relative aspect-poster rounded-[14px] overflow-hidden bg-[#1a1a1a] transition-all duration-300"
          style={{ 
            boxShadow: hovered 
              ? '0 10px 30px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(139, 92, 246, 0.2)' 
              : 'var(--shadow-card)' 
          }}
        >
          <motion.img
            src={imgError ? FALLBACK_POSTER : movie.posterPath}
            alt={movie.title}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            animate={{ scale: hovered ? 1.08 : 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Gradient overlay — always subtle, deeper on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-black/20"
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Top badges / Quick Actions */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-start justify-between z-20">
            {movie.isFree ? (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md
                               bg-accent/90 text-white backdrop-blur-sm shadow-[0_2px_8px_rgba(139,92,246,0.3)]">
                FREE
              </span>
            ) : <div />}
            
            <div className="flex items-center gap-1">
              {/* Rating (visible when not hovered) */}
              <motion.div
                animate={{ opacity: hovered ? 0 : 1, scale: hovered ? 0.8 : 1 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-1 bg-black/60 backdrop-blur-sm rounded-lg px-1.5 py-0.5 shadow-sm"
              >
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span className="text-[11px] font-semibold text-white">{movie.rating.toFixed(1)}</span>
              </motion.div>

              {/* Quick Heart/Favorite Button */}
              <motion.button
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  favorite ? removeFromFavorites(movie.id) : addToFavorites(movie);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border backdrop-blur-sm transition-all shadow-md ${
                  favorite
                    ? 'bg-rose-500/90 border-rose-500/20 text-white'
                    : 'bg-black/60 border-white/10 text-white hover:bg-black/80 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${favorite ? 'fill-white' : ''}`} />
              </motion.button>

              {/* Quick Bookmark/Watchlist Button */}
              <motion.button
                animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie);
                }}
                className={`w-7 h-7 flex items-center justify-center rounded-lg border backdrop-blur-sm transition-all shadow-md ${
                  saved
                    ? 'bg-accent/90 border-accent/20 text-white'
                    : 'bg-black/60 border-white/10 text-white hover:bg-black/80 hover:text-accent-light'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Play button on hover */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30
                            flex items-center justify-center shadow-[0_0_15px_rgba(255,255,255,0.2)]
                            transition-transform duration-200 hover:scale-110">
              <Play className="w-4.5 h-4.5 text-white fill-white ml-0.5" />
            </div>
          </motion.div>

          {/* OTT badges — bottom of poster on hover */}
          <motion.div
            className="absolute bottom-2.5 left-2.5 right-2.5"
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 4 }}
            transition={{ duration: 0.25 }}
          >
            <OTTBadgeList providers={movie.providers} size="sm" max={3} />
          </motion.div>
        </div>

        {/* Info below poster */}
        <div className="mt-3 px-0.5">
          <h3 className="text-[13px] font-semibold text-white/90 leading-snug truncate
                         group-hover:text-accent-light transition-colors duration-150">
            {movie.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[11px] text-muted">{movie.year}</span>
            <span className="w-0.5 h-0.5 bg-muted/40 rounded-full flex-shrink-0" />
            <div className="flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5 text-muted/70" />
              <span className="text-[11px] text-muted">{runtimeStr}</span>
            </div>
          </div>
          {/* OTT badges always visible below */}
          <div className="mt-2">
            <OTTBadgeList providers={movie.providers} size="sm" max={3} />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
