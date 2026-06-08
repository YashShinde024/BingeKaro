"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star, Sparkles, ArrowRight, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { Movie, OTTProviderId } from '../../types';
import { MOVIES } from '../../lib/mockData';
import { ProviderLogo } from '../badges/ProviderLogo';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  '🔥 Stree 2', '🌊 Maharaja', '⚡ Animal', '🎭 The Bear',
  '🏆 Scam 1992', '🎬 Dune',
];

const FILTER_PROVIDERS: { id: OTTProviderId; label: string }[] = [
  { id: 'netflix', label: 'Netflix' },
  { id: 'prime-video', label: 'Prime Video' },
  { id: 'jiohotstar', label: 'JioHotstar' },
  { id: 'sonyliv', label: 'SonyLIV' },
  { id: 'zee5', label: 'ZEE5' },
  { id: 'apple-tv', label: 'Apple TV' },
  { id: 'crunchyroll', label: 'Crunchyroll' },
  { id: 'mx-player', label: 'MX Player' },
  { id: 'youtube', label: 'YouTube' },
];

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80';
const FEATURED = MOVIES.filter(m => m.rating >= 8.2).slice(0, 4);

const SearchSkeleton = () => (
  <div className="p-4 space-y-3">
    <div className="h-4 bg-white/5 rounded w-1/4 animate-pulse mb-3" />
    {[1, 2, 3].map(i => (
      <div key={i} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.03] animate-pulse">
        <div className="w-10 h-14 bg-white/5 rounded-lg shrink-0" />
        <div className="flex-1 space-y-2.5 min-w-0">
          <div className="h-3.5 bg-white/10 rounded w-1/2" />
          <div className="h-3 bg-white/5 rounded w-1/3" />
        </div>
      </div>
    ))}
  </div>
);

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Movie[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [selectedProvider, setSelectedProvider] = React.useState<OTTProviderId | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('kd_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 5));
    } catch {}
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(-1);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
      setSelectedProvider(null);
    }
  }, [isOpen]);

  React.useEffect(() => {
    const q = query.toLowerCase().trim();
    if (!q && !selectedProvider) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timer = setTimeout(() => {
      let found = MOVIES;

      if (q) {
        found = found.filter(m =>
          m.title.toLowerCase().includes(q) ||
          (m.director && m.director.toLowerCase().includes(q)) ||
          m.genres.some(g => g.includes(q))
        );
      }

      if (selectedProvider) {
        found = found.filter(m => m.providers.includes(selectedProvider));
      }

      setResults(found.slice(0, 6));
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, selectedProvider]);

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [query, selectedProvider]);

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const saveRecentSearch = (q: string) => {
    if (!q.trim()) return;
    const cleaned = q.trim();
    const updated = [cleaned, ...recentSearches.filter(s => s !== cleaned)].slice(0, 5);
    setRecentSearches(updated);
    try { localStorage.setItem('kd_recent_searches', JSON.stringify(updated)); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = selectedIndex >= 0 ? results[selectedIndex] : results[0];
      if (target) {
        saveRecentSearch(query || target.title);
        router.push(`/movie/${target.id}`);
        onClose();
      }
    }
  };

  const handleResultClick = (title: string) => {
    saveRecentSearch(query || title);
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('kd_recent_searches');
  };

  const showResults = !isLoading && (results.length > 0 || selectedProvider !== null);
  const showEmpty = !isLoading && (query.trim().length >= 2 || selectedProvider) && results.length === 0;
  const showPreQuery = !isLoading && !showResults && !showEmpty;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex flex-col justify-start bg-[#05070C]/95 backdrop-blur-2xl"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="max-w-xl w-full mx-auto px-4 pt-16 sm:pt-24">
            {/* Search Input Bar */}
            <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0C0E17] shadow-[0_8px_32px_rgba(0,0,0,0.8)]">
              <Search className="absolute left-4 w-4.5 h-4.5 text-muted/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, TV shows, genres..."
                className="flex-1 bg-transparent text-white placeholder-muted/30 text-[14.5px] py-4.5 pl-12 pr-4 outline-none font-medium"
              />
              {query && (
                <button onClick={() => setQuery('')} className="pr-3 text-muted hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Provider Filter bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-3.5 scrollbar-none mt-2">
              <span className="text-[10px] font-black text-muted/40 uppercase shrink-0 mr-1.5 flex items-center gap-1 select-none">
                <Filter className="w-3 h-3" />
                Filter:
              </span>
              {FILTER_PROVIDERS.map(prov => {
                const active = selectedProvider === prov.id;
                return (
                  <motion.button
                    key={prov.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setSelectedProvider(active ? null : prov.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-[11px] font-bold border shrink-0 transition-all ${
                      active 
                        ? 'bg-accent border-accent text-white shadow-[0_0_12px_rgba(139,92,246,0.35)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {prov.label}
                  </motion.button>
                );
              })}
            </div>

            {/* Search Result Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 max-h-[60vh] overflow-y-auto rounded-3xl border border-white/[0.07] bg-[#0C0E17]/95 shadow-2xl"
            >
              {isLoading && <SearchSkeleton />}

              {/* Show Results List */}
              {showResults && results.length > 0 && (
                <div className="p-2 space-y-0.5">
                  <div className="flex items-center justify-between px-3 py-2 border-b border-white/[0.04] mb-1.5 select-none">
                    <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest">Search Matches</span>
                    <span className="text-[9.5px] text-muted/40 font-mono">Use Arrow Keys & Enter</span>
                  </div>

                  {results.map((movie, i) => (
                    <Link
                      key={movie.id}
                      href={`/movie/${movie.id}`}
                      onClick={() => handleResultClick(movie.title)}
                      className={`flex items-center gap-4 p-2.5 rounded-2xl border border-transparent transition-all ${
                        i === selectedIndex
                          ? 'bg-accent/10 border-accent/20 text-white'
                          : 'hover:bg-white/[0.02]'
                      }`}
                    >
                      <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/5">
                        <img src={movie.posterPath} alt="" className="w-full h-full object-cover" onError={e => ((e.target as any).src = FALLBACK)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13.5px] font-bold text-white truncate">{movie.title}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="text-[11px] text-muted/60 font-semibold">{movie.year}</span>
                          <span className="w-1 h-1 bg-white/10 rounded-full" />
                          <div className="flex items-center gap-0.5 text-white/80 font-bold text-[11px]">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                            {movie.rating.toFixed(1)}
                          </div>
                        </div>
                        {/* Provider Logos */}
                        <div className="flex items-center gap-1 mt-1.5">
                          {movie.providers.map(prov => (
                            <ProviderLogo key={prov} provider={prov} size="xs" />
                          ))}
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-muted/40" />
                    </Link>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="py-16 text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4 text-muted/30">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-[14px] font-bold text-white font-sans">No matches found</p>
                  <p className="text-[11.5px] text-muted/50 mt-1 max-w-xs mx-auto leading-relaxed">No movies or TV shows matched your filters. Try checking your spelling or clearing active filters.</p>
                </div>
              )}

              {/* Pre query details */}
              {showPreQuery && (
                <div className="p-5 space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3 select-none">
                        <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          Recent Searches
                        </span>
                        <button onClick={clearRecent} className="text-[9.5px] font-bold text-accent-light hover:underline uppercase tracking-wide">
                          Clear All
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            onClick={() => {
                              setQuery(term);
                              saveRecentSearch(term);
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] text-white/90 text-[11.5px] font-semibold transition-all"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1 mb-3 select-none">
                      <TrendingUp className="w-3.5 h-3.5" />
                      Trending Searches
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map(term => (
                        <button
                          key={term}
                          onClick={() => {
                            const cleaned = term.replace(/🔥|🌊|⚡|🎭|🏆|🎬/g, '').trim();
                            setQuery(cleaned);
                            saveRecentSearch(cleaned);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] text-white/90 text-[11.5px] font-semibold transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1 mb-3 select-none">
                      <Sparkles className="w-3.5 h-3.5" />
                      Curated recommendations
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {FEATURED.map(movie => (
                        <Link
                          key={movie.id}
                          href={`/movie/${movie.id}`}
                          onClick={() => handleResultClick(movie.title)}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
                        >
                          <div className="w-8 h-11 rounded-lg bg-white/5 overflow-hidden shrink-0 border border-white/5">
                            <img src={movie.posterPath} alt="" className="w-full h-full object-cover" onError={e => ((e.target as any).src = FALLBACK)} />
                          </div>
                          <div className="min-w-0">
                            <p className="text-[12px] font-bold text-white truncate leading-tight mb-0.5">{movie.title}</p>
                            <div className="flex items-center gap-1.5 text-[10px] text-muted/65 font-semibold">
                              <span>★ {movie.rating.toFixed(1)}</span>
                              <span>·</span>
                              <span>{movie.year}</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
