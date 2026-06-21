"use client";

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, Filter, Check, X, Star, Clock, Compass, Heart, Zap,
  Users, Coffee, LayoutGrid, Calendar, HelpCircle, Film, Tv, ChevronDown
} from 'lucide-react';
import { MOVIES, GENRES, LANGUAGES, MOODS } from '../../lib/mockData';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import { MovieCard } from '../../components/cards/MovieCard';
import type { MoodId, GenreId, LanguageId, OTTProviderId, Movie } from '../../types';
import { api } from '../../lib/api';
import { normalizeContent } from '../../lib/tmdb';
import { MovieCardSkeleton } from '../../components/ui/Skeletons';

const RUNTIME_OPTIONS = [
  { label: 'Under 90 min', value: 'under-90' },
  { label: '90 – 120 min', value: '90-120' },
  { label: '2 – 3 hours', value: '120-180' },
  { label: 'Any duration', value: 'any' },
];

const RATING_OPTIONS = [
  { label: '8.5+ Masterpieces', value: '8.5' },
  { label: '8.0+ Highly Rated', value: '8.0' },
  { label: '7.0+ Recommended', value: '7.0' },
  { label: 'Any rating', value: 'any' },
];

const YEAR_OPTIONS = [
  { label: '2024 Releases', value: '2024' },
  { label: '2023 Releases', value: '2023' },
  { label: '2020 – 2022', value: '2020-2022' },
  { label: 'Classic Hits (<2020)', value: 'classic' },
  { label: 'Any year', value: 'any' },
];

const WATCHING_WITH_OPTIONS = [
  { id: 'alone', label: 'Solo Vibe' },
  { id: 'partner', label: 'Date Night' },
  { id: 'friends', label: 'Group Watch' },
  { id: 'family', label: 'Family Friendly' },
];

const ENERGY_OPTIONS = [
  { id: 'relaxed', label: 'Relaxed / Chill' },
  { id: 'focused', label: 'Engaged / Focused' },
  { id: 'excited', label: 'High Excitement' },
];

function DiscoverContent() {
  const [selectedGenres, setSelectedGenres] = React.useState<GenreId[]>([]);
  const [selectedProviders, setSelectedProviders] = React.useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<LanguageId[]>([]);
  const [selectedYear, setSelectedYear] = React.useState<string>('any');
  const [selectedRuntime, setSelectedRuntime] = React.useState<string>('any');
  const [selectedRating, setSelectedRating] = React.useState<string>('any');
  const [selectedMoods, setSelectedMoods] = React.useState<MoodId[]>([]);
  const [watchingWith, setWatchingWith] = React.useState<string | null>(null);
  const [energyLevel, setEnergyLevel] = React.useState<string | null>(null);
  
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);
  const [showFutureFilters, setShowFutureFilters] = React.useState(false);

  const toggleGenre = (id: GenreId) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const toggleProvider = (id: string) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleLanguage = (id: LanguageId) => {
    setSelectedLanguages(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  const toggleMood = (id: MoodId) => {
    setSelectedMoods(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedProviders([]);
    setSelectedLanguages([]);
    setSelectedYear('any');
    setSelectedRuntime('any');
    setSelectedRating('any');
    setSelectedMoods([]);
    setWatchingWith(null);
    setEnergyLevel(null);
  };

  const [discoverResults, setDiscoverResults] = React.useState<Movie[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    // Map year string
    let yearParam: number | undefined;
    if (selectedYear !== 'any') {
      const yearInt = parseInt(selectedYear);
      if (!isNaN(yearInt)) {
        yearParam = yearInt;
      }
    }

    const filters: Record<string, any> = {
      genre: selectedGenres.join(','),
      platform: selectedProviders.join(','),
      language: selectedLanguages.join(','),
      year: yearParam,
      runtime: selectedRuntime !== 'any' ? selectedRuntime : undefined,
      rating: selectedRating !== 'any' ? parseFloat(selectedRating) : undefined,
      mood: selectedMoods.join(','),
      watching_with: watchingWith || undefined,
      energy_level: energyLevel || undefined,
    };

    api.discover(filters, 1)
      .then((data) => {
        if (!active) return;
        const items = data.results || [...(data.movies?.results || []), ...(data.tv?.results || [])];
        const normalized = items.map(normalizeContent);
        setDiscoverResults(normalized);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || 'Failed to fetch discover results');
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [
    selectedGenres, selectedProviders, selectedLanguages,
    selectedYear, selectedRuntime, selectedRating, selectedMoods,
    watchingWith, energyLevel
  ]);

  const FilterSections = () => (
    <div className="space-y-6">
      {/* Genres */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Genres</h4>
        <div className="flex flex-wrap gap-1.5">
          {GENRES.map(g => {
            const active = selectedGenres.includes(g.id);
            return (
              <button
                key={g.id}
                onClick={() => toggleGenre(g.id)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  active
                    ? 'bg-accent border-accent text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
                }`}
              >
                {g.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Platforms */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Platforms</h4>
        <div className="flex flex-wrap gap-1.5">
          {Object.values(PROVIDER_REGISTRY).map(p => {
            const active = selectedProviders.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() => toggleProvider(p.id)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                  active
                    ? 'bg-accent border-accent text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
                }`}
              >
                <img src={p.logo} alt="" className="w-3.5 h-3.5 object-contain" />
                {p.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Languages</h4>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map(l => {
            const active = selectedLanguages.includes(l.id);
            return (
              <button
                key={l.id}
                onClick={() => toggleLanguage(l.id)}
                className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
                  active
                    ? 'bg-accent border-accent text-white'
                    : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
                }`}
              >
                {l.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Release Year */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Year</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {YEAR_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelectedYear(opt.value)}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-left transition-all ${
                selectedYear === opt.value
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Runtime</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RUNTIME_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelectedRuntime(opt.value)}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-left transition-all ${
                selectedRuntime === opt.value
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div>
        <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest mb-3">Minimum Rating</h4>
        <div className="grid grid-cols-2 gap-1.5">
          {RATING_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSelectedRating(opt.value)}
              className={`px-3 py-2 rounded-xl border text-[11px] font-bold text-left transition-all ${
                selectedRating === opt.value
                  ? 'bg-accent border-accent text-white'
                  : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white hover:border-white/10'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Collapse/Expand Future-Ready Filters */}
      <div className="pt-4 border-t border-white/[0.05]">
        <button
          onClick={() => setShowFutureFilters(!showFutureFilters)}
          className="flex items-center justify-between w-full text-left text-[11px] font-black text-muted-foreground hover:text-white uppercase tracking-widest"
        >
          <span>Social & Context Filters (AI)</span>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFutureFilters ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showFutureFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-4 pt-4"
            >
              {/* Moods */}
              <div>
                <span className="text-[9.5px] font-bold text-accent-light uppercase tracking-wider block mb-2">Mood / Vibe</span>
                <div className="flex flex-wrap gap-1.5">
                  {MOODS.map(m => {
                    const active = selectedMoods.includes(m.id);
                    return (
                      <button
                        key={m.id}
                        onClick={() => toggleMood(m.id)}
                        className={`px-2.5 py-1.5 rounded-lg border text-[10px] font-bold transition-all ${
                          active
                            ? 'bg-accent border-accent text-white'
                            : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Watching With */}
              <div>
                <span className="text-[9.5px] font-bold text-accent-light uppercase tracking-wider block mb-2">Watching With</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {WATCHING_WITH_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setWatchingWith(watchingWith === opt.id ? null : opt.id)}
                      className={`px-2.5 py-2 rounded-lg border text-[10px] font-bold text-left transition-all ${
                        watchingWith === opt.id
                          ? 'bg-accent border-accent text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Energy Level */}
              <div>
                <span className="text-[9.5px] font-bold text-accent-light uppercase tracking-wider block mb-2">Energy Level</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {ENERGY_OPTIONS.map(opt => (
                    <button
                      key={opt.id}
                      onClick={() => setEnergyLevel(energyLevel === opt.id ? null : opt.id)}
                      className={`px-2.5 py-2 rounded-lg border text-[10px] font-bold text-left transition-all ${
                        energyLevel === opt.id
                          ? 'bg-accent border-accent text-white'
                          : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:text-white'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Header Board */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-6 mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Discover Catalogue</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Filter and discover titles across your subscribed OTT platforms.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl text-[12px] font-bold text-white/80 hover:text-white hover:bg-white/5 transition-all"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[12px] font-bold text-white"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>

        {/* Board Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
          
          {/* Desktop Filter Sidebar (Sticky) */}
          <aside className="hidden lg:block sticky top-24 max-h-[80vh] overflow-y-auto pr-4 scrollbar-thin">
            <FilterSections />
          </aside>

          {/* Results Grid */}
          <main className="space-y-6">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Showing <strong>{discoverResults.length}</strong> matches</span>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                {[...Array(8)].map((_, idx) => (
                  <MovieCardSkeleton key={idx} />
                ))}
              </div>
            ) : error ? (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.005]">
                <h3 className="text-base font-bold text-white">Error searching catalogue</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">{error}</p>
              </div>
            ) : discoverResults.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                {discoverResults.map((movie, idx) => (
                  <MovieCard key={movie.id} movie={movie} index={idx} />
                ))}
              </div>
            ) : (
              <div className="py-24 text-center border border-dashed border-white/5 rounded-3xl bg-white/[0.005]">
                <Film className="w-10 h-10 mx-auto text-muted-foreground/35 mb-4" />
                <h3 className="text-base font-bold text-white">No titles match filters</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto mt-1 leading-relaxed">
                  Try adjusting genres, minimum ratings, or platform channels to broaden your discovery match.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 px-4.5 py-2 rounded-xl bg-accent text-[12px] font-bold text-white hover:bg-accent/90"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </main>

        </div>

      </div>

      {/* Mobile Drawer (Bottom Sheet) */}
      <AnimatePresence>
        {mobileFiltersOpen && (
          <div className="fixed inset-0 z-[100] flex items-end justify-center lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileFiltersOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-h-[85vh] bg-[#0A0C14] border-t border-white/10 rounded-t-[28px] z-10 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4.5 border-b border-white/[0.06] shrink-0">
                <span className="text-sm font-black text-white uppercase tracking-wider">Filters</span>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Filters */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <FilterSections />
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-white/[0.06] shrink-0 flex items-center gap-3">
                <button
                  onClick={clearFilters}
                  className="flex-1 py-3.5 rounded-xl border border-white/10 text-[12.5px] font-bold text-white"
                >
                  Reset
                </button>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="flex-1 py-3.5 bg-accent rounded-xl text-[12.5px] font-bold text-white"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Discover() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center text-white font-bold">Loading discover boards...</div>}>
      <DiscoverContent />
    </Suspense>
  );
}
