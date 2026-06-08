import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Grid3X3, List, SlidersHorizontal, Star, Clock, Trash2, Sparkles, Heart, Film } from 'lucide-react';
import { Link } from 'react-router-dom';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';
import type { OTTProviderId } from '../types';
import { PROVIDER_REGISTRY } from '../lib/providers';
import { ProviderPill } from '../components/badges/ProviderLogo';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

const SORT_OPTIONS = [
  { value: 'added', label: 'Recently Added' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'runtime', label: 'Runtime' },
];

const AVAILABILITY_FILTERS = [
  { id: 'all', label: 'All Tiers' },
  { id: 'free', label: 'Free Only' },
  { id: 'subscription', label: 'Subscription Only' },
  { id: 'rent-buy', label: 'Rent/Buy' },
];

export const Watchlist: React.FC = () => {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [availabilityFilter, setAvailabilityFilter] = React.useState<'all' | 'free' | 'subscription' | 'rent-buy'>('all');
  const [sortBy, setSortBy] = React.useState<'added' | 'rating' | 'runtime'>('added');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [providerFilter, setProviderFilter] = React.useState<string>('all');
  const { watchlist, favorites, removeFromWatchlist } = useWatchlist();

  // Filter & Sort
  const sorted = React.useMemo(() => {
    let result = [...watchlist];

    // Filter by Provider
    if (providerFilter !== 'all') {
      result = result.filter(m => m.providers.includes(providerFilter as OTTProviderId));
    }

    // Filter by Availability
    if (availabilityFilter === 'free') {
      result = result.filter(m => m.isFree || m.providers.some(p => PROVIDER_REGISTRY[p]?.type === 'free'));
    } else if (availabilityFilter === 'subscription') {
      result = result.filter(m => m.providers.some(p => PROVIDER_REGISTRY[p]?.type === 'subscription'));
    } else if (availabilityFilter === 'rent-buy') {
      result = result.filter(m => m.providers.some(p => PROVIDER_REGISTRY[p]?.type === 'rent' || PROVIDER_REGISTRY[p]?.type === 'buy'));
    }

    // Sort
    if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === 'runtime') {
      result.sort((a, b) => b.runtime - a.runtime);
    }

    return result;
  }, [watchlist, providerFilter, availabilityFilter, sortBy]);

  // Insights computation
  const stats = React.useMemo(() => {
    if (watchlist.length === 0) return null;
    const totalRuntime = watchlist.reduce((acc, m) => acc + m.runtime, 0);
    const runtimeHours = Math.floor(totalRuntime / 60);
    const freeCount = watchlist.filter(m => m.isFree).length;

    // Favorite/top provider
    const providerCount: Record<string, number> = {};
    watchlist.forEach(m => m.providers.forEach(p => {
      providerCount[p] = (providerCount[p] || 0) + 1;
    }));
    const topProviderId = Object.entries(providerCount).sort((a, b) => b[1] - a[1])[0]?.[0] as OTTProviderId | undefined;
    const topProviderName = topProviderId ? PROVIDER_REGISTRY[topProviderId]?.name : '—';

    // Favorite genre
    const genreCount: Record<string, number> = {};
    watchlist.forEach(m => m.genres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    }));
    const topGenre = Object.entries(genreCount).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return {
      runtimeHours,
      freeCount,
      topProviderName,
      topProviderId,
      topGenre,
    };
  }, [watchlist]);

  const providerList = React.useMemo(() => {
    const ids = new Set<OTTProviderId>();
    watchlist.forEach(m => m.providers.forEach(p => ids.add(p)));
    return Array.from(ids);
  }, [watchlist]);

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-32">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8">
        {/* Header Title */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
        >
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-accent/15 border border-accent/20 flex items-center justify-center">
                <Bookmark className="w-4 h-4 text-accent-light" />
              </div>
              <h1 className="text-3xl font-black text-white tracking-tight">My Watchlist</h1>
            </div>
            <p className="text-[12.5px] text-muted/50 mt-1 ml-11">
              {sorted.length} saved title{sorted.length !== 1 ? 's' : ''}
              {watchlist.length !== sorted.length && ` (filtered from ${watchlist.length})`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl shrink-0">
              {[{ v: 'grid' as const, I: Grid3X3 }, { v: 'list' as const, I: List }].map(({ v, I }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`p-1.5 rounded-lg transition-all ${
                    view === v ? 'bg-white/10 text-white shadow-sm' : 'text-muted/60 hover:text-white'
                  }`}
                >
                  <I className="w-4 h-4" />
                </button>
              ))}
            </div>

            <button
              onClick={() => setFiltersOpen(o => !o)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[12.5px] font-bold transition-all ${
                filtersOpen
                  ? 'bg-accent/15 border-accent/40 text-accent-light'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Stats Grid Insights */}
        {watchlist.length > 0 && stats && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-8"
          >
            {[
              { label: 'Total Saved', value: String(watchlist.length), icon: Bookmark, color: 'text-accent-light' },
              { label: 'Watch Time', value: `${stats.runtimeHours} hrs`, icon: Clock, color: 'text-violet-400' },
              { label: 'Free to Stream', value: String(stats.freeCount), icon: Sparkles, color: 'text-emerald-400' },
              { label: 'Top Genre', value: stats.topGenre, icon: Film, color: 'text-amber-400' },
            ].map((stat, i) => (
              <div key={i} className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06]">
                <stat.icon className={`w-5 h-5 ${stat.color} shrink-0`} />
                <div>
                  <p className="text-[17px] font-black text-white capitalize leading-none mb-1">{stat.value}</p>
                  <span className="text-[10px] font-bold text-muted/40 uppercase tracking-wider block">{stat.label}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Provider horizontal filter bar */}
        {watchlist.length > 0 && providerList.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
            <button
              onClick={() => setProviderFilter('all')}
              className={`px-3 py-1.5 rounded-full text-[11px] font-bold border transition-all ${
                providerFilter === 'all'
                  ? 'bg-accent border-accent text-white shadow-sm'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted hover:text-white'
              }`}
            >
              All Providers
            </button>
            {providerList.map(provId => {
              const active = providerFilter === provId;
              return (
                <button
                  key={provId}
                  onClick={() => setProviderFilter(provId)}
                  className={`px-1.5 py-1 rounded-xl transition-all ${
                    active 
                      ? 'ring-1 ring-accent bg-accent/5' 
                      : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <ProviderPill provider={provId} size="sm" />
                </button>
              );
            })}
          </div>
        )}

        {/* Filters Panel dropdown */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-wrap gap-6 items-start">
                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-muted/30 uppercase tracking-widest block">Sort Orders</span>
                  <div className="flex gap-2">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value as any)}
                        className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-all ${
                          sortBy === opt.value
                            ? 'bg-accent/15 border-accent/40 text-accent-light'
                            : 'bg-white/[0.02] border-white/[0.06] text-muted hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="text-[10px] font-bold text-muted/30 uppercase tracking-widest block">Availability filter</span>
                  <div className="flex gap-2">
                    {AVAILABILITY_FILTERS.map(opt => (
                      <button
                        key={opt.id}
                        onClick={() => setAvailabilityFilter(opt.id as any)}
                        className={`px-3 py-1.5 rounded-xl text-[11.5px] font-bold border transition-all ${
                          availabilityFilter === opt.id
                            ? 'bg-accent/15 border-accent/40 text-accent-light'
                            : 'bg-white/[0.02] border-white/[0.06] text-muted hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Favorites horizontal section */}
        {favorites.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h2 className="text-[13.5px] font-bold text-white uppercase tracking-wider">Favorite Stream Collection</h2>
              <span className="text-[11px] text-muted/40 font-bold ml-1">({favorites.length})</span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
              {favorites.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.03 }}
                  className="flex-shrink-0 w-28 rounded-xl overflow-hidden border border-white/[0.06] aspect-poster relative bg-white/5"
                >
                  <Link to={`/movie/${movie.id}`}>
                    <img src={movie.posterPath} alt="" className="w-full h-full object-cover" onError={e => (e.target as any).src = FALLBACK} />
                    <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center">
                      <Heart className="w-2.5 h-2.5 text-white fill-white" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* List / Grid Content render */}
        {sorted.length === 0 ? (
          <EmptyWatchlist />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {sorted.map((movie) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative"
              >
                <Link to={`/movie/${movie.id}`} className="block space-y-2">
                  <div className="relative rounded-2xl overflow-hidden aspect-poster bg-[#121212] border border-white/[0.06] group-hover:border-accent-light/30 transition-all shadow-md">
                    <img src={movie.posterPath} alt="" className="w-full h-full object-cover group-hover:scale-104 transition-all duration-300" onError={e => (e.target as any).src = FALLBACK} />
                    
                    <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/75 backdrop-blur-md rounded-lg px-2 py-0.5 border border-white/10">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      <span className="text-[11px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                    </div>

                    <button
                      className="absolute top-2 left-2 w-7 h-7 bg-black/60 hover:bg-rose-500/20 hover:text-rose-400 border border-white/10 rounded-lg flex items-center justify-center text-rose-300 opacity-0 group-hover:opacity-100 transition-all"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFromWatchlist(movie.id);
                      }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-[13px] font-bold text-white/90 truncate group-hover:text-accent-light transition-colors">{movie.title}</h3>
                    <div className="flex items-center gap-1.5 mt-0.5 text-muted text-[11px]">
                      <span>{movie.year}</span>
                      <span>•</span>
                      <span>{movie.runtime}m</span>
                    </div>
                    <div className="mt-1.5">
                      <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((movie) => (
              <div
                key={movie.id}
                className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group"
              >
                <img src={movie.posterPath} alt="" className="w-12 h-16 object-cover rounded-xl shrink-0 bg-white/5" onError={e => (e.target as any).src = FALLBACK} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-[13.5px] font-bold text-white truncate">{movie.title}</h3>
                  <div className="flex items-center gap-2 text-muted text-[11.5px] mt-1">
                    <span>{movie.year}</span>
                    <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                    <div className="flex items-center gap-0.5 text-white font-semibold">
                      <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      {movie.rating.toFixed(1)}
                    </div>
                    <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                    <span>{movie.runtime}m</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-3">
                  <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
                  <button
                    onClick={() => removeFromWatchlist(movie.id)}
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const EmptyWatchlist: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-5 text-muted/30">
      <Bookmark className="w-8 h-8" />
    </div>
    <h3 className="text-[15px] font-bold text-white mb-1">Your Watchlist is empty</h3>
    <p className="text-[12.5px] text-muted/50 max-w-xs mb-6">Explore the discover lists or ask our AI recommendation filter to help find shows.</p>
    <Link to="/discover">
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-[12.5px] font-bold text-white shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
      >
        Find Something to Watch
      </motion.button>
    </Link>
  </motion.div>
);
