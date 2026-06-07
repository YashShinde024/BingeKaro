import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Grid3X3, List, SlidersHorizontal, Star, Clock, Trash2, Sparkles, Heart, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';
import type { OTTProviderId } from '../types';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

const SORT_OPTIONS = [
  { value: 'added', label: 'Recently Added' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'runtime', label: 'Runtime' },
];

const PROVIDER_FILTERS: { id: OTTProviderId | 'all' | 'free'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'free', label: '✦ Free' },
  { id: 'netflix', label: 'Netflix' },
  { id: 'prime', label: 'Prime' },
  { id: 'disney', label: 'Disney+' },
  { id: 'jiohotstar', label: 'JioHotstar' },
];

export const Watchlist: React.FC = () => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [filterFree, setFilterFree] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'added' | 'rating' | 'runtime'>('added');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [providerFilter, setProviderFilter] = React.useState<string>('all');
  const { watchlist, favorites, removeFromWatchlist } = useWatchlist();

  const sorted = [...watchlist]
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'runtime') return b.runtime - a.runtime;
      return 0;
    })
    .filter(m => !filterFree || m.isFree)
    .filter(m => {
      if (providerFilter === 'all') return true;
      if (providerFilter === 'free') return m.isFree;
      return m.providers.includes(providerFilter as OTTProviderId);
    });

  // Compute stats
  const totalRuntime = watchlist.reduce((acc, m) => acc + m.runtime, 0);
  const runtimeHours = Math.floor(totalRuntime / 60);
  const freeCount = watchlist.filter(m => m.isFree).length;

  const providerCount: Record<string, number> = {};
  watchlist.forEach(m => m.providers.forEach(p => {
    providerCount[p] = (providerCount[p] || 0) + 1;
  }));
  const topProvider = Object.entries(providerCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 md:pb-16">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-end justify-between mb-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 bg-accent/15 rounded-xl border border-accent/25 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-accent-light" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-[-0.02em]">My Watchlist</h1>
            </div>
            <p className="text-[13px] text-muted ml-11">
              {sorted.length} title{sorted.length !== 1 ? 's' : ''}
              {watchlist.length !== sorted.length && ` (filtered from ${watchlist.length})`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center p-1 bg-white/[0.04] border border-white/[0.07] rounded-xl">
              {[{ v: 'grid' as const, I: Grid3X3 }, { v: 'list' as const, I: List }].map(({ v, I }) => (
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

        {/* ── Stats Header ── */}
        {watchlist.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6"
          >
            {[
              { label: 'Total Saved', value: String(watchlist.length), icon: <Bookmark className="w-3.5 h-3.5" />, color: 'text-accent-light' },
              { label: 'Watch Time', value: `${runtimeHours}h`, icon: <Clock className="w-3.5 h-3.5" />, color: 'text-violet-400' },
              { label: 'Free to Watch', value: String(freeCount), icon: <Sparkles className="w-3.5 h-3.5" />, color: 'text-emerald-400' },
              { label: 'Top Platform', value: topProvider.charAt(0).toUpperCase() + topProvider.slice(1), icon: <Play className="w-3.5 h-3.5" />, color: 'text-amber-400' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.12 + i * 0.04 }}
                className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]"
              >
                <div className={`${stat.color} flex-shrink-0`}>{stat.icon}</div>
                <div>
                  <p className="text-[18px] font-black text-white">{stat.value}</p>
                  <p className="text-[11px] text-muted/60 leading-tight">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Provider quick filters */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex items-center gap-2 overflow-x-auto pb-1 mb-5 scrollbar-hide"
        >
          {PROVIDER_FILTERS.map(pf => (
            <motion.button
              key={pf.id}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => setProviderFilter(pf.id)}
              className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-all duration-150 ${
                providerFilter === pf.id
                  ? 'bg-accent/15 border-accent/40 text-accent-light'
                  : 'border-white/[0.08] text-muted hover:text-white hover:border-white/15 bg-white/[0.02]'
              }`}
            >
              {pf.label}
            </motion.button>
          ))}
        </motion.div>

        {/* Filters panel */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-5"
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

        {/* Favorites section */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              <h2 className="text-[15px] font-bold text-white">Favorites</h2>
              <span className="text-[11px] text-muted/50 ml-1">{favorites.length}</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2 fade-edges-sm">
              {favorites.slice(0, 8).map((movie, i) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex-shrink-0 w-[120px]"
                >
                  <Link to={`/movie/${movie.id}`}>
                    <div className="relative rounded-[12px] overflow-hidden aspect-poster bg-[#1a1a1a] ring-1 ring-rose-500/20">
                      <img
                        src={movie.posterPath}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                      />
                      <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-rose-500 rounded-full flex items-center justify-center">
                        <Heart className="w-2.5 h-2.5 text-white fill-white" />
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-white/70 mt-1.5 truncate">{movie.title}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

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
                    {/* Remove button */}
                    <motion.button
                      initial={{ opacity: 0 }}
                      whileHover={{ scale: 1.1 }}
                      className="absolute top-2 left-2 w-7 h-7 bg-black/60 backdrop-blur-sm rounded-lg
                                 flex items-center justify-center text-rose-400 opacity-0 group-hover:opacity-100
                                 transition-opacity duration-200 border border-white/10"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(movie.id);
                      }}
                    >
                      <Trash2 className="w-3 h-3" />
                    </motion.button>
                  </div>
                  <p className="text-[13px] font-semibold text-white/85 mt-2.5 truncate group-hover:text-white transition-colors">
                    {movie.title}
                  </p>
                  <div className="mt-1.5">
                    <OTTBadgeList providers={movie.providers} size="xs" max={3} />
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
                        {movie.isFree && (
                          <span className="text-[10px] font-bold text-accent-light bg-accent/15 border border-accent/20 px-1.5 py-0.5 rounded">
                            FREE
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="hidden sm:block shrink-0">
                      <OTTBadgeList providers={movie.providers} size="sm" max={3} />
                    </div>
                    <button
                      className="w-8 h-8 flex items-center justify-center rounded-lg text-muted hover:text-red-400
                                 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
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
    <motion.div
      animate={{ y: [0, -8, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      className="w-24 h-24 bg-white/[0.04] rounded-3xl border border-white/[0.07] flex items-center justify-center mb-6"
    >
      <Bookmark className="w-10 h-10 text-muted/30" />
    </motion.div>
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
