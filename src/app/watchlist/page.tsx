"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Grid3X3, List, SlidersHorizontal, Star, Trash2, Heart, Film, Check, PieChart, Compass, Play, CheckCircle2, Info } from 'lucide-react';
import Link from 'next/link';
import { useWatchlist } from '../../context/WatchlistContext';
import type { WatchlistStatus } from '../../context/WatchlistContext';
import type { OTTProviderId } from '../../types';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import { MovieCard } from '../../components/cards/MovieCard';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';

const SORT_OPTIONS = [
  { value: 'added', label: 'Recently Added' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'release', label: 'Release Date' },
];

const AVAILABILITY_FILTERS = [
  { id: 'all', label: 'All Tiers' },
  { id: 'free', label: 'Free Only' },
  { id: 'subscription', label: 'Subscription Only' },
  { id: 'rent-buy', label: 'Rent/Buy' },
];

const STATUS_TABS: { id: WatchlistStatus; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'want-to-watch', label: 'Want To Watch', icon: Compass },
  { id: 'watching', label: 'Watching', icon: Play },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'dropped', label: 'Dropped', icon: Trash2 },
];

export default function WatchlistPage() {
  const [view, setView] = React.useState<'grid' | 'list'>('grid');
  const [activeTab, setActiveTab] = React.useState<WatchlistStatus>('want-to-watch');
  const [availabilityFilter, setAvailabilityFilter] = React.useState<'all' | 'free' | 'subscription' | 'rent-buy'>('all');
  const [sortBy, setSortBy] = React.useState<'added' | 'rating' | 'release'>('added');
  const [filtersOpen, setFiltersOpen] = React.useState(false);
  const [providerFilter, setProviderFilter] = React.useState<string>('all');
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);
  const { watchlist, favorites, movieStatuses, removeFromWatchlist, updateMovieStatus } = useWatchlist();

  // Filter & Sort
  const sorted = React.useMemo(() => {
    let result = [...watchlist];

    // Filter by Active Tab Status
    result = result.filter(m => (movieStatuses[m.id] || 'want-to-watch') === activeTab);

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
    } else if (sortBy === 'release') {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [watchlist, activeTab, providerFilter, availabilityFilter, sortBy, movieStatuses]);

  // Analytics breakdowns
  const stats = React.useMemo(() => {
    if (watchlist.length === 0) return null;
    const totalRuntime = watchlist.reduce((acc, m) => acc + m.runtime, 0);
    const runtimeHours = Math.floor(totalRuntime / 60);

    // Favorite/top provider counts
    const providerCount: Record<string, number> = {};
    watchlist.forEach(m => m.providers.forEach(p => {
      providerCount[p] = (providerCount[p] || 0) + 1;
    }));
    const providerBreakdown = Object.entries(providerCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id, count]) => `${PROVIDER_REGISTRY[id]?.name || id}: ${count}`)
      .join(', ');

    // Top genres counts
    const genreCount: Record<string, number> = {};
    watchlist.forEach(m => m.genres.forEach(g => {
      genreCount[g] = (genreCount[g] || 0) + 1;
    }));
    const genreBreakdown = Object.entries(genreCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([g, count]) => `${g}: ${count}`)
      .join(', ');

    // Availability distribution count
    let freeCount = 0;
    let subCount = 0;
    let rentBuyCount = 0;

    watchlist.forEach(m => {
      if (m.isFree || m.providers.some(p => PROVIDER_REGISTRY[p]?.type === 'free')) {
        freeCount++;
      } else if (m.providers.some(p => PROVIDER_REGISTRY[p]?.type === 'subscription')) {
        subCount++;
      } else {
        rentBuyCount++;
      }
    });

    return {
      count: watchlist.length,
      hours: runtimeHours,
      providers: providerBreakdown || 'None',
      genres: genreBreakdown || 'None',
      distribution: {
        free: Math.round((freeCount / watchlist.length) * 100),
        sub: Math.round((subCount / watchlist.length) * 100),
        rentBuy: Math.round((rentBuyCount / watchlist.length) * 100),
      }
    };
  }, [watchlist]);

  const uniqueProviders = React.useMemo(() => {
    const ids = new Set<string>();
    watchlist.forEach(m => m.providers.forEach(p => ids.add(p)));
    return Array.from(ids);
  }, [watchlist]);

  const handleToggleSelect = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-28">
      {/* ── Header ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/[0.05]">
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <Bookmark className="w-5 h-5 text-accent-light" />
              <h1 className="text-[20px] font-black text-white tracking-tight">My Watchlist</h1>
            </div>
            <p className="text-[12.5px] text-muted font-medium">Manage your entertainment queues, track stats, and sort availability.</p>
          </div>
          {stats && (
            <div className="flex flex-wrap gap-2.5">
              <div className="glass-card px-4 py-2.5 rounded-2xl text-center min-w-[75px] border-white/5 bg-white/[0.02]">
                <p className="text-[15px] font-black text-white leading-none mb-1">{stats.count}</p>
                <p className="text-[9px] text-muted/50 uppercase tracking-widest font-extrabold">Saved</p>
              </div>
              <div className="glass-card px-4 py-2.5 rounded-2xl text-center min-w-[75px] border-white/5 bg-white/[0.02]">
                <p className="text-[15px] font-black text-white leading-none mb-1">{stats.hours}h</p>
                <p className="text-[9px] text-muted/50 uppercase tracking-widest font-extrabold">Runtime</p>
              </div>
              <div className="glass-card px-4 py-2.5 rounded-2xl text-center min-w-[75px] border-white/5 bg-white/[0.02] flex flex-col items-center justify-center">
                <p className="text-[15px] font-black text-white leading-none mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 shrink-0" />
                  <span>{favorites.length}</span>
                </p>
                <p className="text-[9px] text-muted/50 uppercase tracking-widest font-extrabold">Loved</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Stats Breakdown Banner ── */}
      {stats && (
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-8 grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-5">
          <div className="glass-card p-5.5 rounded-3xl flex flex-col justify-between gap-5 bg-white/[0.02] border-white/5">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
                <PieChart className="w-3.5 h-3.5" />
                Collection Insights
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-wider">Top Network Sources</p>
                  <p className="text-[13px] font-bold text-white/90 line-clamp-1">{stats.providers}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-wider">Favored Genres</p>
                  <p className="text-[13px] font-bold text-white/90 line-clamp-1 capitalize">{stats.genres}</p>
                </div>
              </div>
            </div>

            {/* Distribution chart bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10.5px] font-bold text-muted/60">
                <span>Free ({stats.distribution.free}%)</span>
                <span>Subscription ({stats.distribution.sub}%)</span>
                <span>Rent/Buy ({stats.distribution.rentBuy}%)</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden flex">
                <div className="h-full bg-emerald-500" style={{ width: `${stats.distribution.free || 0}%` }} />
                <div className="h-full bg-accent" style={{ width: `${stats.distribution.sub || 0}%` }} />
                <div className="h-full bg-amber-500" style={{ width: `${stats.distribution.rentBuy || 0}%` }} />
              </div>
            </div>
          </div>

          <div className="glass-card p-5.5 rounded-3xl flex flex-col justify-center gap-3 bg-white/[0.02] border-white/5">
            <div className="text-center sm:text-left space-y-1.5">
              <h4 className="text-[14px] font-bold text-white">Generate DNA recommendations?</h4>
              <p className="text-[11.5px] text-muted/50 leading-relaxed font-semibold">
                Match new OTT catalog releases to your active taste profile logs.
              </p>
            </div>
            <Link href="/discover" className="w-full">
              <motion.button
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="w-full btn-primary py-2.5 text-[11.5px] uppercase tracking-wider font-extrabold"
              >
                Scan Taste DNA
              </motion.button>
            </Link>
          </div>
        </div>
      )}

      {/* ── Tabs & Filters Toolbar ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 mb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 py-2">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1 bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
            {STATUS_TABS.map(tab => {
              const active = activeTab === tab.id;
              const count = watchlist.filter(m => (movieStatuses[m.id] || 'want-to-watch') === tab.id).length;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSelectedIds([]);
                  }}
                  className={`px-3.5 py-2 rounded-lg text-[12px] font-bold tracking-wide transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-accent text-white shadow-[0_4px_12px_rgba(139,92,246,0.3)]'
                      : 'text-muted hover:text-white hover:bg-white/[0.02]'
                  }`}
                >
                  {React.createElement(tab.icon, { className: "w-3.5 h-3.5 text-accent-light shrink-0" })}
                  {tab.label}
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${active ? 'bg-white/20 text-white' : 'bg-white/5 text-muted'}`}>{count}</span>
                </button>
              );
            })}
          </div>

          {/* Quick sorting / view configs */}
          <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`h-9 px-3.5 rounded-xl border flex items-center gap-1.5 text-[12px] font-bold transition-all ${
                filtersOpen || providerFilter !== 'all' || availabilityFilter !== 'all'
                  ? 'bg-accent/15 border-accent/30 text-accent-light'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted hover:text-white hover:border-white/10'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Configure Filter
              {(providerFilter !== 'all' || availabilityFilter !== 'all') && (
                <span className="w-1.5 h-1.5 rounded-full bg-accent-light" />
              )}
            </button>

            <div className="flex items-center bg-white/[0.02] border border-white/[0.06] p-1 rounded-xl">
              <button
                onClick={() => setView('grid')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  view === 'grid' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                  view === 'list' ? 'bg-white/10 text-white' : 'text-muted hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible filters pane */}
        <AnimatePresence>
          {filtersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-6"
            >
              <div className="glass-card p-5 rounded-2xl mt-3 grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/[0.02] border-white/5">
                {/* Provider Filter */}
                <div className="space-y-2">
                  <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-wider">Source Network</p>
                  <select
                    value={providerFilter}
                    onChange={(e) => setProviderFilter(e.target.value)}
                    className="w-full bg-[#0C0E17] border border-white/10 text-white rounded-xl text-[12.5px] p-2.5 focus:outline-none"
                  >
                    <option value="all">All Providers</option>
                    {uniqueProviders.map(p => (
                      <option key={p} value={p}>{PROVIDER_REGISTRY[p]?.name || p}</option>
                    ))}
                  </select>
                </div>

                {/* Availability Filter */}
                <div className="space-y-2">
                  <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-wider">Access Category</p>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABILITY_FILTERS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setAvailabilityFilter(f.id as any)}
                        className={`px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all border ${
                          availabilityFilter === f.id
                            ? 'bg-accent/15 border-accent/30 text-accent-light'
                            : 'bg-white/[0.01] border-transparent text-muted hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sorting */}
                <div className="space-y-2">
                  <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-wider">Sort Queue</p>
                  <div className="flex flex-wrap gap-1.5">
                    {SORT_OPTIONS.map(opt => (
                      <button
                        key={opt.value}
                        onClick={() => setSortBy(opt.value as any)}
                        className={`px-3 py-1.5 rounded-lg text-[11.5px] font-bold transition-all border ${
                          sortBy === opt.value
                            ? 'bg-accent/15 border-accent/30 text-accent-light'
                            : 'bg-white/[0.01] border-transparent text-muted hover:text-white'
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
      </div>

      {/* ── Watchlist content ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        {sorted.length === 0 ? (
          <EmptyWatchlist activeTab={activeTab} />
        ) : view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-8">
            {sorted.map((movie, i) => (
              <div key={movie.id} className="relative group">
                <div className="absolute top-2 left-2 z-20">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(movie.id)}
                    onChange={() => handleToggleSelect(movie.id)}
                    className="w-4 h-4 rounded border-white/10 bg-black/60 checked:bg-accent text-accent cursor-pointer opacity-0 group-hover:opacity-100 checked:opacity-100 transition-opacity"
                  />
                </div>
                <MovieCard movie={movie} index={i} />

                {/* Hover Quick Status Changer */}
                <div className="absolute bottom-16 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-[#0C0E17]/95 backdrop-blur-md rounded-lg p-1.5 border border-white/10 flex flex-col gap-1.5">
                  {STATUS_TABS.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => updateMovieStatus(movie.id, tab.id)}
                      className={`text-[10px] font-bold p-1 rounded hover:bg-white/10 text-left flex items-center gap-1 ${
                        (movieStatuses[movie.id] || 'want-to-watch') === tab.id ? 'text-accent-light' : 'text-white/70'
                      }`}
                    >
                      {React.createElement(tab.icon, { className: "w-3.5 h-3.5 shrink-0" })}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2.5">
            {sorted.map((movie) => {
              const isSelected = selectedIds.includes(movie.id);
              return (
                <div
                  key={movie.id}
                  className={`flex items-center gap-4 p-3.5 rounded-2xl border transition-all duration-200 group ${
                    isSelected
                      ? 'bg-accent/[0.03] border-accent/25'
                      : 'bg-white/[0.015] border-white/[0.05] hover:bg-white/[0.03] hover:border-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleToggleSelect(movie.id)}
                    className="w-4 h-4 rounded border-white/10 bg-white/5 checked:bg-accent text-accent cursor-pointer"
                  />
                  <div className="w-10 rounded-lg overflow-hidden aspect-poster shrink-0 bg-white/5 border border-white/10">
                    <img src={movie.posterPath || FALLBACK} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-bold text-white truncate">{movie.title}</p>
                    <div className="flex items-center gap-1.5 text-[11px] text-muted mt-0.5 font-semibold">
                      <span>{movie.year}</span>
                      <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                      <div className="flex items-center gap-0.5 text-white/60">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        {movie.rating.toFixed(1)}
                      </div>
                      <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                      <span>{movie.runtime}m</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3">
                    <select
                      value={movieStatuses[movie.id] || 'want-to-watch'}
                      onChange={(e) => updateMovieStatus(movie.id, e.target.value as WatchlistStatus)}
                      className="bg-[#0C0E17] border border-white/10 text-white rounded-lg text-[11.5px] py-1 px-2 focus:outline-none cursor-pointer outline-none font-bold"
                    >
                      <option value="want-to-watch">Want Watch</option>
                      <option value="watching">Watching</option>
                      <option value="completed">Completed</option>
                      <option value="dropped">Dropped</option>
                    </select>

                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted hover:text-rose-400 hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Actions Toolbar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0, x: '-50%' }}
            animate={{ y: 0, opacity: 1, x: '-50%' }}
            exit={{ y: 80, opacity: 0, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 bg-[#0C0E17]/90 border border-white/[0.08] backdrop-blur-md px-5 py-3.5 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] flex items-center gap-4"
          >
            <span className="text-[12.5px] font-bold text-white/90">
              {selectedIds.length} Selected
            </span>
            <button
              onClick={() => {
                if (selectedIds.length === sorted.length) {
                  setSelectedIds([]);
                } else {
                  setSelectedIds(sorted.map(m => m.id));
                }
              }}
              className="text-[12px] font-extrabold text-accent-light hover:text-white transition-colors"
            >
              {selectedIds.length === sorted.length ? 'Deselect All' : 'Select All'}
            </button>
            <div className="w-[1px] h-4 bg-white/10" />
            <button
              onClick={() => {
                selectedIds.forEach(id => removeFromWatchlist(id));
                setSelectedIds([]);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/25 border border-rose-500/20 text-[12px] font-extrabold text-rose-400 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Remove Selected
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EmptyWatchlist: React.FC<{ activeTab: WatchlistStatus }> = ({ activeTab }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center justify-center py-20 text-center"
  >
    <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.06] rounded-2xl flex items-center justify-center mb-5 text-muted/30">
      <Bookmark className="w-8 h-8" />
    </div>
    <h3 className="text-[15px] font-bold text-white mb-1.5">
      {activeTab === 'want-to-watch' ? "No watchlist yet?" : `No items in ${STATUS_TABS.find(t => t.id === activeTab)?.label}`}
    </h3>
    <p className="text-[12.5px] text-muted/50 max-w-xs mb-6 font-semibold">
      {activeTab === 'want-to-watch' ? "Let's find something worth adding." : 'Start building your collection or discover new releases matching your taste.'}
    </p>
    <Link href="/discover">
      <motion.button
        whileHover={{ scale: 1.02, y: -1 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary px-5 py-2.5 text-[12px] uppercase tracking-wider font-extrabold"
      >
        Discover Picks
      </motion.button>
    </Link>
  </motion.div>
);
