"use client";

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  SlidersHorizontal, Check, X, Star, Clock, Compass, HelpCircle, 
  Film, Tv, ArrowUpDown, RefreshCw, Grid, List, AlertCircle, Calendar
} from 'lucide-react';
import { GENRES, LANGUAGES, MOVIES } from '../../lib/mockData';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import { MovieCard } from '../../components/cards/MovieCard';
import type { GenreId, LanguageId, OTTProviderId, Movie } from '../../types';
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

const SORT_OPTIONS = [
  { label: 'Popularity', value: 'popularity.desc' },
  { label: 'Release Date', value: 'release_date.desc' },
  { label: 'Vote Average', value: 'vote_average.desc' },
];

const YEAR_OPTIONS = [
  { label: 'Any year', value: 'any' },
  { label: '2026', value: '2026' },
  { label: '2025', value: '2025' },
  { label: '2024', value: '2024' },
  { label: '2020–2023', value: '2020-2023' },
  { label: '2010–2019', value: '2010-2019' },
  { label: 'Before 2010', value: 'before-2010' },
];

function DiscoverContent() {
  const [selectedGenres, setSelectedGenres] = useState<GenreId[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<OTTProviderId[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageId[]>([]);
  const [selectedRuntime, setSelectedRuntime] = useState<string>('any');
  const [selectedRating, setSelectedRating] = useState<string>('any');
  const [selectedSort, setSelectedSort] = useState<string>('popularity.desc');
  const [selectedContentType, setSelectedContentType] = useState<'all' | 'movie' | 'tv'>('all');
  const [selectedYear, setSelectedYear] = useState<string>('any');

  const [discoverResults, setDiscoverResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const toggleGenre = (id: GenreId) => {
    setSelectedGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleProvider = (id: OTTProviderId) => {
    setSelectedProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleLanguage = (id: LanguageId) => {
    setSelectedLanguages(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const clearFilters = () => {
    setSelectedGenres([]);
    setSelectedProviders([]);
    setSelectedLanguages([]);
    setSelectedRuntime('any');
    setSelectedRating('any');
    setSelectedSort('popularity.desc');
    setSelectedContentType('all');
    setSelectedYear('any');
  };

  // Active filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedGenres.length > 0) count += selectedGenres.length;
    if (selectedProviders.length > 0) count += selectedProviders.length;
    if (selectedLanguages.length > 0) count += selectedLanguages.length;
    if (selectedRuntime !== 'any') count++;
    if (selectedRating !== 'any') count++;
    if (selectedYear !== 'any') count++;
    if (selectedContentType !== 'all') count++;
    return count;
  }, [selectedGenres, selectedProviders, selectedLanguages, selectedRuntime, selectedRating, selectedYear, selectedContentType]);

  // Active filter chips for display
  const activeFilterChips = useMemo(() => {
    const chips: { label: string; onRemove: () => void }[] = [];
    selectedGenres.forEach(g => {
      const genre = GENRES.find(gr => gr.id === g);
      if (genre) chips.push({ label: genre.label, onRemove: () => toggleGenre(g) });
    });
    selectedProviders.forEach(p => {
      const prov = PROVIDER_REGISTRY[p];
      if (prov) chips.push({ label: prov.name, onRemove: () => toggleProvider(p) });
    });
    selectedLanguages.forEach(l => {
      const lang = LANGUAGES.find(la => la.id === l);
      if (lang) chips.push({ label: lang.label, onRemove: () => toggleLanguage(l) });
    });
    if (selectedRuntime !== 'any') {
      const opt = RUNTIME_OPTIONS.find(o => o.value === selectedRuntime);
      if (opt) chips.push({ label: opt.label, onRemove: () => setSelectedRuntime('any') });
    }
    if (selectedRating !== 'any') {
      const opt = RATING_OPTIONS.find(o => o.value === selectedRating);
      if (opt) chips.push({ label: opt.label, onRemove: () => setSelectedRating('any') });
    }
    if (selectedYear !== 'any') {
      const opt = YEAR_OPTIONS.find(o => o.value === selectedYear);
      if (opt) chips.push({ label: opt.label, onRemove: () => setSelectedYear('any') });
    }
    return chips;
  }, [selectedGenres, selectedProviders, selectedLanguages, selectedRuntime, selectedRating, selectedYear]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const filters: Record<string, any> = {
      genre: selectedGenres.join(','),
      provider: selectedProviders.join(','),
      language: selectedLanguages.join(','),
      runtime: selectedRuntime !== 'any' ? selectedRuntime : undefined,
      vote_average: selectedRating !== 'any' ? parseFloat(selectedRating) : undefined,
      sort: selectedSort,
      content_type: selectedContentType,
      year: selectedYear !== 'any' ? selectedYear : undefined,
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
        console.warn("FastAPI discover failed, using mock data as fallback", err);
        // Fallback to mock data matching filters
        const filtered = MOVIES.filter(m => {
          const genreMatch = selectedGenres.length === 0 || m.genres.some(g => selectedGenres.includes(g as GenreId));
          const providerMatch = selectedProviders.length === 0 || m.providers?.some(p => selectedProviders.includes(p as OTTProviderId));
          const langMatch = selectedLanguages.length === 0 || selectedLanguages.includes(m.language as LanguageId);
          const typeMatch = selectedContentType === 'all' || m.type === selectedContentType;
          return genreMatch && providerMatch && langMatch && typeMatch;
        });
        setDiscoverResults(filtered);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedGenres, selectedProviders, selectedLanguages, selectedRuntime, selectedRating, selectedSort, selectedContentType, selectedYear]);

  return (
    <div className="min-h-screen bg-background pt-24 pb-28">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
        
        {/* Header Options */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border/60 mb-4">
          <div>
            <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-2">
              <Compass className="w-6 h-6 text-accent animate-pulse-slow" /> Discover
            </h1>
            <p className="text-xs text-muted-foreground font-semibold mt-1">Advanced filters to match your exact mood, taste, and available platforms.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearFilters}
              className={`flex items-center gap-1.5 px-3 py-2 border rounded-xl text-xs font-bold transition-all ${
                activeFilterCount > 0
                  ? 'bg-accent/10 border-accent/30 text-accent hover:bg-accent/15'
                  : 'bg-muted/10 border-border/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" /> Clear{activeFilterCount > 0 && ` (${activeFilterCount})`}
            </button>
            <div className="flex bg-muted/10 border border-border/40 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('grid')}
                aria-label="Grid view"
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-accent text-white' : 'text-muted-foreground'}`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                aria-label="List view"
                className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-accent text-white' : 'text-muted-foreground'}`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFilterChips.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-6">
            {activeFilterChips.map((chip, idx) => (
              <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 bg-accent/10 border border-accent/25 rounded-full text-[10px] font-bold text-accent">
                {chip.label}
                <button onClick={chip.onRemove} className="hover:text-foreground transition-colors" aria-label={`Remove ${chip.label} filter`}>
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Filters and Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Side Filter Bar — Sticky */}
          <div className="lg:col-span-1 space-y-6 bg-card/20 border border-border/40 p-5 rounded-[24px] h-fit lg:sticky lg:top-24">
            
            {/* Content Type Selector */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Media Category</h4>
              <div className="flex gap-1 bg-muted/10 p-1 rounded-xl border border-border/30">
                {(['all', 'movie', 'tv'] as const).map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedContentType(type)}
                    className={`flex-1 py-1.5 rounded-lg text-[10.5px] font-bold uppercase transition-colors ${
                      selectedContentType === type 
                        ? 'bg-accent text-white shadow-sm' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort options */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Sort Results</h4>
              <div className="relative">
                <select
                  value={selectedSort}
                  onChange={(e) => setSelectedSort(e.target.value)}
                  aria-label="Sort results by"
                  className="w-full bg-muted/10 hover:bg-muted/15 border border-border/30 rounded-xl px-3 py-2.5 text-xs text-foreground font-semibold outline-none appearance-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
                  ))}
                </select>
                <ArrowUpDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Genres Selection */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Genres</h4>
              <div className="flex flex-wrap gap-1.5">
                {GENRES.map(g => {
                  const active = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      onClick={() => toggleGenre(g.id)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                        active
                          ? 'bg-accent border-accent text-white shadow-sm'
                          : 'bg-muted/5 border-border/40 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Platform Selection */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Platforms</h4>
              <div className="flex flex-wrap gap-1.5">
                {Object.values(PROVIDER_REGISTRY).map(p => {
                  const active = selectedProviders.includes(p.id as OTTProviderId);
                  return (
                    <button
                      key={p.id}
                      onClick={() => toggleProvider(p.id as OTTProviderId)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold flex items-center gap-1.5 transition-all ${
                        active
                          ? 'bg-accent border-accent text-white shadow-sm'
                          : 'bg-muted/5 border-border/40 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      <img src={p.logo} alt="" className="w-3.5 h-3.5 object-contain" />
                      {p.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Languages Selection */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Languages</h4>
              <div className="flex flex-wrap gap-1.5">
                {LANGUAGES.map(l => {
                  const active = selectedLanguages.includes(l.id);
                  return (
                    <button
                      key={l.id}
                      onClick={() => toggleLanguage(l.id)}
                      className={`px-3 py-1.5 rounded-xl border text-[10px] font-bold transition-all ${
                        active
                          ? 'bg-accent border-accent text-white shadow-sm'
                          : 'bg-muted/5 border-border/40 text-muted-foreground hover:text-foreground hover:border-border'
                      }`}
                    >
                      {l.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Year Selection */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Release Year</h4>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  aria-label="Filter by release year"
                  className="w-full bg-muted/10 hover:bg-muted/15 border border-border/30 rounded-xl px-3 py-2.5 text-xs text-foreground font-semibold outline-none appearance-none cursor-pointer"
                >
                  {YEAR_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
                  ))}
                </select>
                <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Runtime Selection */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Duration</h4>
              <div className="relative">
                <select
                  value={selectedRuntime}
                  onChange={(e) => setSelectedRuntime(e.target.value)}
                  aria-label="Filter by runtime"
                  className="w-full bg-muted/10 hover:bg-muted/15 border border-border/30 rounded-xl px-3 py-2.5 text-xs text-foreground font-semibold outline-none appearance-none cursor-pointer"
                >
                  {RUNTIME_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
                  ))}
                </select>
                <Clock className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            {/* Rating Selection */}
            <div className="space-y-2">
              <h4 className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Minimum Rating</h4>
              <div className="relative">
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  aria-label="Filter by minimum rating"
                  className="w-full bg-muted/10 hover:bg-muted/15 border border-border/30 rounded-xl px-3 py-2.5 text-xs text-foreground font-semibold outline-none appearance-none cursor-pointer"
                >
                  {RATING_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-background">{opt.label}</option>
                  ))}
                </select>
                <Star className="absolute right-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Grid/List Results Panel */}
          <div className="lg:col-span-3">
            {/* Results count */}
            {!loading && !error && discoverResults.length > 0 && (
              <p className="text-[11px] font-bold text-muted-foreground mb-4">
                Showing <span className="text-foreground">{discoverResults.length}</span> results
              </p>
            )}
            
            <AnimatePresence mode="wait">
              {loading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <MovieCardSkeleton key={idx} />
                  ))}
                </div>
              ) : error ? (
                <div className="p-8 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-center space-y-3">
                  <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
                  <h3 className="text-sm font-bold text-foreground">Discovery Scans Offline</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">{error}</p>
                </div>
              ) : discoverResults.length === 0 ? (
                <div className="p-12 border border-dashed border-border rounded-[24px] text-center space-y-4">
                  <Compass className="w-12 h-12 text-accent/35 mx-auto animate-spin-slow" />
                  <div>
                    <h3 className="text-sm font-bold text-foreground">No Matching Content Found</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Try clearing some filters or broadening your search criteria.</p>
                  </div>
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent/10 border border-accent/25 rounded-xl text-xs font-bold text-accent hover:bg-accent/15 transition-all"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Reset All Filters
                  </button>
                </div>
              ) : viewMode === 'grid' ? (
                <motion.div
                  key="grid-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 gap-6"
                >
                  {discoverResults.map((movie, idx) => (
                    <MovieCard key={movie.id} movie={movie} index={idx} />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list-view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  {discoverResults.map((movie) => (
                    <div key={movie.id} className="p-4 bg-card/30 border border-border/80 rounded-2xl flex gap-5 items-center hover:border-accent/40 transition-colors">
                      <div className="w-14 aspect-poster rounded-lg overflow-hidden shrink-0 border border-border">
                        <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-foreground truncate">{movie.title}</h4>
                        <p className="text-xs text-muted-foreground font-semibold mt-1">★ {movie.rating?.toFixed(1)} · {movie.year}</p>
                      </div>
                      <Link href={`/movie/${movie.id}`} className="px-3.5 py-1.5 bg-accent hover:bg-accent-dark text-white rounded-lg text-[10px] font-bold transition-all uppercase tracking-wider shadow-sm">
                        View
                      </Link>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoaderIcon className="w-8 h-8 text-accent animate-spin" />
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}

const LoaderIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <line x1="12" y1="2" x2="12" y2="6" />
    <line x1="12" y1="18" x2="12" y2="22" />
    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
    <line x1="2" y1="12" x2="6" y2="12" />
    <line x1="18" y1="12" x2="22" y2="12" />
    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
  </svg>
);
