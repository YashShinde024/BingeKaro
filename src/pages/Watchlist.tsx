import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Grid3X3, List, SlidersHorizontal, Star, Clock, Trash2, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

const SORT_OPTIONS = [
  { value: 'added', label: 'Recently Added' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'runtime', label: 'Runtime' },
];

export const Watchlist: React.FC = () => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [filterFree, setFilterFree] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'added' | 'rating' | 'runtime'>('added');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const { watchlist, removeFromWatchlist } = useWatchlist();

  const sorted = [...watchlist]
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'runtime') return b.runtime - a.runtime;
      return 0;
    })
    .filter(m => !filterFree || m.isFree);


  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-8"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-accent/15 rounded-xl border border-accent/25 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-accent-light" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-[-0.02em]">My Watchlist</h1>
            </div>
            <p className="text-[13px] text-muted ml-11">
              {sorted.length} title{sorted.length !== 1 ? 's' : ''} saved
            </p>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl">
              {[
                { v: 'grid' as const, I: Grid3X3 },
                { v: 'list' as const, I: List },
              ].map(({ v, I }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-2 rounded-lg transition-all duration-150 ${
                    view === v ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                  }`}
                >
                  <I className="w-4 h-4" />
                </button>
              ))}
            </div>
            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[13px] font-medium transition-all ${
                filtersOpen
                  ? 'bg-accent/12 border-accent/40 text-accent-light'
                  : 'bg-white/[0.04] border-white/[0.07] text-muted hover:text-white hover:border-white/[0.12]'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Filters panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex flex-wrap items-center gap-4">
                <div>
                  <p className="text-[11px] font-bold text-muted/60 uppercase tracking-wider mb-2">Sort By</p>
                  <div className="flex gap-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value as typeof sortBy)}
                        className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                          sortBy === opt.value
                            ? 'bg-accent/15 border-accent/40 text-accent-light'
                            : 'border-white/[0.08] text-muted hover:text-white hover:border-white/15'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="w-px h-8 bg-white/[0.07] hidden sm:block" />
                <div>
                  <p className="text-[11px] font-bold text-muted/60 uppercase tracking-wider mb-2">Availability</p>
                  <button
                    onClick={() => setFilterFree(f => !f)}
                    className={`px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                      filterFree
                        ? 'bg-accent/15 border-accent/40 text-accent-light'
                        : 'border-white/[0.08] text-muted hover:text-white hover:border-white/15'
                    }`}
                  >
                    Free only
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Content */}
        {sorted.length === 0 ? (
          <EmptyWatchlist />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {sorted.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <Link to={`/movie/${movie.id}`} className="block">
                  <div className="relative rounded-[14px] overflow-hidden aspect-poster bg-[#1a1a1a]"
                       style={{ boxShadow: 'var(--shadow-card)' }}>
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-lg px-1.5 py-0.5">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-semibold text-white">{movie.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-[13px] font-semibold text-white/85 mt-2.5 truncate group-hover:text-white transition-colors">
                    {movie.title}
                  </p>
                  <div className="mt-1.5">
                    <OTTBadgeList providers={movie.providers} size="sm" max={3} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/movie/${movie.id}`}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]
                                  hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-150 group">
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-12 h-[68px] object-cover rounded-xl flex-shrink-0 bg-[#1a1a1a]"
                      onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-white/90 truncate group-hover:text-white transition-colors">
                        {movie.title}
                      </p>
                      <div className="flex items-center gap-2 text-muted text-[12px] mt-1">
                        <span>{movie.year}</span>
                        <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          <span>{movie.rating.toFixed(1)}</span>
                        </div>
                        <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</span>
                        </div>
                      </div>
                    </div>
                    <div className="hidden sm:block shrink-0">
                      <OTTBadgeList providers={movie.providers} size="sm" max={3} />
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(movie.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyWatchlist: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-24 text-center"
  >
    <div className="w-20 h-20 bg-white/[0.04] rounded-3xl border border-white/[0.07] flex items-center justify-center mb-6">
      <Bookmark className="w-8 h-8 text-muted/40" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">Nothing saved yet</h3>
    <p className="text-[14px] text-muted max-w-xs mb-8 leading-relaxed">
      Browse and save movies you want to watch later. They'll appear here.
    </p>
    <Link to="/discover">
      <motion.div
        whileHover={{ scale: 1.03, y: -1 }}
        whileTap={{ scale: 0.97 }}
        className="inline-flex items-center gap-2 text-white font-semibold px-6 py-3 rounded-xl cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)', boxShadow: '0 4px 20px rgba(139,92,246,0.35)' }}
      >
        <Sparkles className="w-4 h-4" />
        Discover Something
      </motion.div>
    </Link>
  </motion.div>
);
