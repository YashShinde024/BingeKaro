"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star, Sparkles, ArrowRight, Filter, User, Film, Tv } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { OTTProviderId } from '../../types';
import { MOVIES, ACTORS } from '../../lib/mockData';
import {
  multiSearch,
  normalizeContent,
  normalizePerson,
  isTMDBAvailable,
  getPosterUrl,
  getProfileUrl,
  FALLBACK_POSTER,
} from '../../lib/tmdb';
import type { NormalizedContent, NormalizedPerson, TMDBMultiSearchResult } from '../../lib/tmdb-types';
import { useDebounce } from '../../hooks/useDebounce';
import { SearchResultSkeleton } from '../ui/Skeletons';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  'Dune', 'Oppenheimer', 'The Bear', 'Shogun',
  'Breaking Bad', 'Interstellar', 'Parasite', 'Dark',
];

const FILTER_PROVIDERS: { id: OTTProviderId; label: string }[] = [
  { id: 'netflix', label: 'Netflix' },
  { id: 'prime-video', label: 'Prime Video' },
  { id: 'jiohotstar', label: 'JioHotstar' },
  { id: 'sonyliv', label: 'SonyLIV' },
  { id: 'zee5', label: 'ZEE5' },
  { id: 'apple-tv', label: 'Apple TV+' },
  { id: 'crunchyroll', label: 'Crunchyroll' }
];

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80';

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState('');
  const [movieResults, setMovieResults] = React.useState<NormalizedContent[]>([]);
  const [tvResults, setTvResults] = React.useState<NormalizedContent[]>([]);
  const [peopleResults, setPeopleResults] = React.useState<NormalizedPerson[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);
  const [totalResults, setTotalResults] = React.useState(0);

  const inputRef = React.useRef<HTMLInputElement>(null);
  const resultsRef = React.useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 400);

  // Load recent searches
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('kd_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 6));
    } catch {}
  }, []);

  // Focus on open
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setSelectedIndex(-1);
    } else {
      setQuery('');
      setMovieResults([]);
      setTvResults([]);
      setPeopleResults([]);
      setSelectedIndex(-1);
      setError(null);
      setPage(1);
      setHasMore(false);
    }
  }, [isOpen]);

  // TMDB Multi-Search
  React.useEffect(() => {
    const q = debouncedQuery.trim();
    if (!q || q.length < 2) {
      setMovieResults([]);
      setTvResults([]);
      setPeopleResults([]);
      setIsLoading(false);
      setError(null);
      setTotalResults(0);
      setHasMore(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setPage(1);

    if (isTMDBAvailable()) {
      // TMDB search
      multiSearch(q, 1)
        .then((res) => {
          const movies: NormalizedContent[] = [];
          const tv: NormalizedContent[] = [];
          const people: NormalizedPerson[] = [];

          res.results.forEach((item: TMDBMultiSearchResult) => {
            if (item.media_type === 'movie') {
              movies.push(normalizeContent(item as any));
            } else if (item.media_type === 'tv') {
              tv.push(normalizeContent(item as any));
            } else if (item.media_type === 'person') {
              people.push(normalizePerson(item));
            }
          });

          setMovieResults(movies.slice(0, 6));
          setTvResults(tv.slice(0, 6));
          setPeopleResults(people.slice(0, 4));
          setTotalResults(res.total_results);
          setHasMore(res.page < res.total_pages);
          setIsLoading(false);
        })
        .catch((err) => {
          setError(err.message || 'Search failed');
          setIsLoading(false);
          // Fallback to mock data
          fallbackSearch(q);
        });
    } else {
      // Mock data search
      fallbackSearch(q);
    }
  }, [debouncedQuery]);

  const fallbackSearch = (q: string) => {
    const lower = q.toLowerCase();
    const found = MOVIES.filter(m =>
      m.title.toLowerCase().includes(lower) ||
      (m.director && m.director.toLowerCase().includes(lower)) ||
      m.genres.some(g => g.includes(lower))
    );

    setMovieResults(found.filter(m => m.type === 'movie').slice(0, 6).map(m => ({
      id: m.id, title: m.title, mediaType: 'movie' as const, posterUrl: m.posterPath,
      backdropUrl: m.backdropPath, year: m.year, rating: m.rating, voteCount: m.voteCount,
      overview: m.overview, genreIds: [], language: m.language, popularity: 0,
    })));
    setTvResults(found.filter(m => m.type === 'tv').slice(0, 6).map(m => ({
      id: m.id, title: m.title, mediaType: 'tv' as const, posterUrl: m.posterPath,
      backdropUrl: m.backdropPath, year: m.year, rating: m.rating, voteCount: m.voteCount,
      overview: m.overview, genreIds: [], language: m.language, popularity: 0,
    })));

    const foundActors = ACTORS.filter(a =>
      a.name.toLowerCase().includes(lower) ||
      a.knownFor.some(k => k.toLowerCase().includes(lower))
    );
    setPeopleResults(foundActors.slice(0, 3).map(a => ({
      id: a.id, name: a.name, profileUrl: null,
      department: 'Acting', knownFor: a.knownFor.slice(0, 3),
    })));

    setIsLoading(false);
    setHasMore(false);
  };

  // Load more search results
  const loadMoreResults = React.useCallback(() => {
    if (isLoading || !hasMore || !isTMDBAvailable()) return;
    setIsLoading(true);
    const nextPage = page + 1;

    multiSearch(debouncedQuery, nextPage)
      .then((res) => {
        res.results.forEach((item: TMDBMultiSearchResult) => {
          if (item.media_type === 'movie') {
            setMovieResults(prev => {
              const ids = new Set(prev.map(p => p.id));
              const newItem = normalizeContent(item as any);
              return ids.has(newItem.id) ? prev : [...prev, newItem];
            });
          } else if (item.media_type === 'tv') {
            setTvResults(prev => {
              const ids = new Set(prev.map(p => p.id));
              const newItem = normalizeContent(item as any);
              return ids.has(newItem.id) ? prev : [...prev, newItem];
            });
          } else if (item.media_type === 'person') {
            setPeopleResults(prev => {
              const ids = new Set(prev.map(p => p.id));
              const newPerson = normalizePerson(item);
              return ids.has(newPerson.id) ? prev : [...prev, newPerson];
            });
          }
        });

        setPage(res.page);
        setHasMore(res.page < res.total_pages);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
      });
  }, [page, hasMore, isLoading, debouncedQuery]);

  // Scroll-based load more
  const handleResultsScroll = React.useCallback(() => {
    const el = resultsRef.current;
    if (!el || isLoading || !hasMore) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
      loadMoreResults();
    }
  }, [loadMoreResults, isLoading, hasMore]);

  // Combined results for keyboard navigation
  const flatResults = React.useMemo(() => [
    ...movieResults.map(m => ({ type: 'movie' as const, data: m })),
    ...tvResults.map(t => ({ type: 'tv' as const, data: t })),
    ...peopleResults.map(p => ({ type: 'person' as const, data: p })),
  ], [movieResults, tvResults, peopleResults]);

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [debouncedQuery]);

  // Escape key
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
    const updated = [cleaned, ...recentSearches.filter(s => s !== cleaned)].slice(0, 6);
    setRecentSearches(updated);
    try { localStorage.setItem('kd_recent_searches', JSON.stringify(updated)); } catch {}
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (flatResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % flatResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const target = selectedIndex >= 0 ? flatResults[selectedIndex] : flatResults[0];
      if (target) {
        if (target.type === 'person') {
          saveRecentSearch(query || (target.data as NormalizedPerson).name);
          router.push(`/discover?search=${(target.data as NormalizedPerson).name}`);
        } else {
          const content = target.data as NormalizedContent;
          saveRecentSearch(query || content.title);
          router.push(`/movie/${content.id}`);
        }
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

  const hasResults = flatResults.length > 0;
  const isSearching = query.trim().length >= 2;
  const showResults = !isLoading && hasResults;
  const showEmpty = !isLoading && isSearching && !hasResults && !error;
  const showError = !isLoading && error;
  const showPreQuery = !isLoading && !showResults && !showEmpty && !showError && !isSearching;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex flex-col justify-start bg-background/95 backdrop-blur-2xl"
          role="dialog"
          aria-modal="true"
          aria-label="Search movies and TV shows"
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <div className="max-w-xl w-full mx-auto px-4 pt-16 sm:pt-24">

            {/* Search Input Bar */}
            <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0C0E17] shadow-[0_8px_32px_rgba(0,0,0,0.8)]" role="search">
              <Search className="absolute left-4 w-4.5 h-4.5 text-muted/60" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, TV shows, directors, actors..."
                className="flex-1 bg-transparent text-white placeholder-muted/30 text-[14.5px] py-4.5 pl-12 pr-4 outline-none font-medium"
              />
              {query && (
                <button onClick={() => setQuery('')} className="pr-3 text-muted hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Result count badge */}
            {isSearching && totalResults > 0 && !isLoading && (
              <div className="mt-2 px-1">
                <span className="text-[10px] font-bold text-muted/50">
                  {totalResults.toLocaleString()} results found
                </span>
              </div>
            )}

            {/* Search Result Box */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 max-h-[60vh] overflow-y-auto rounded-3xl border border-white/[0.07] bg-[#0C0E17]/95 shadow-2xl"
              ref={resultsRef}
              onScroll={handleResultsScroll}
            >
              {/* Loading State */}
              {isLoading && flatResults.length === 0 && <SearchResultSkeleton count={5} />}

              {/* Show Results */}
              {showResults && (
                <div className="p-2 space-y-4">
                  {/* Movies */}
                  {movieResults.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 select-none">
                        <Film className="w-3 h-3 text-violet-400" />
                        <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest">Movies</span>
                        <span className="text-[9px] font-bold text-muted/30 ml-auto">{movieResults.length}</span>
                      </div>
                      {movieResults.map((movie, i) => {
                        const globalIdx = i;
                        const active = globalIdx === selectedIndex;
                        return (
                          <Link
                            key={`m-${movie.id}`}
                            href={`/movie/${movie.id}`}
                            onClick={() => handleResultClick(movie.title)}
                            className={`flex items-center gap-4 p-2.5 rounded-2xl border border-transparent transition-all ${
                              active ? 'bg-accent/10 border-accent/20 text-white' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/5">
                              <img
                                src={movie.posterUrl || FALLBACK}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={e => ((e.target as any).src = FALLBACK)}
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13.5px] font-bold text-white truncate">{movie.title}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {movie.year > 0 && <span className="text-[11px] text-muted-foreground font-semibold">{movie.year}</span>}
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <div className="flex items-center gap-0.5 text-white/80 font-bold text-[11px]">
                                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                  {movie.rating.toFixed(1)}
                                </div>
                                <span className="media-badge media-badge-movie ml-1">Movie</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted/40 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* TV Shows */}
                  {tvResults.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 select-none">
                        <Tv className="w-3 h-3 text-sky-400" />
                        <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest">TV Shows</span>
                        <span className="text-[9px] font-bold text-muted/30 ml-auto">{tvResults.length}</span>
                      </div>
                      {tvResults.map((tv, i) => {
                        const globalIdx = movieResults.length + i;
                        const active = globalIdx === selectedIndex;
                        return (
                          <Link
                            key={`tv-${tv.id}`}
                            href={`/movie/${tv.id}?type=tv`}
                            onClick={() => handleResultClick(tv.title)}
                            className={`flex items-center gap-4 p-2.5 rounded-2xl border border-transparent transition-all ${
                              active ? 'bg-accent/10 border-accent/20 text-white' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="w-10 h-14 rounded-lg overflow-hidden bg-white/5 shrink-0 border border-white/5">
                              <img
                                src={tv.posterUrl || FALLBACK}
                                alt=""
                                className="w-full h-full object-cover"
                                onError={e => ((e.target as any).src = FALLBACK)}
                                loading="lazy"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13.5px] font-bold text-white truncate">{tv.title}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                {tv.year > 0 && <span className="text-[11px] text-muted-foreground font-semibold">{tv.year}</span>}
                                <span className="w-1 h-1 bg-white/10 rounded-full" />
                                <div className="flex items-center gap-0.5 text-white/80 font-bold text-[11px]">
                                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                  {tv.rating.toFixed(1)}
                                </div>
                                <span className="media-badge media-badge-tv ml-1">TV</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted/40 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* People */}
                  {peopleResults.length > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 px-3 select-none">
                        <User className="w-3 h-3 text-amber-400" />
                        <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest">People</span>
                        <span className="text-[9px] font-bold text-muted/30 ml-auto">{peopleResults.length}</span>
                      </div>
                      {peopleResults.map((person, i) => {
                        const globalIdx = movieResults.length + tvResults.length + i;
                        const active = globalIdx === selectedIndex;
                        return (
                          <Link
                            key={`p-${person.id}`}
                            href={`/discover?search=${person.name}`}
                            onClick={() => handleResultClick(person.name)}
                            className={`flex items-center gap-4 p-2.5 rounded-2xl border border-transparent transition-all ${
                              active ? 'bg-accent/10 border-accent/20 text-white' : 'hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                              {person.profileUrl ? (
                                <img src={person.profileUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-5 h-5 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[13.5px] font-bold text-white truncate">{person.name}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[11px] text-muted-foreground truncate">
                                  {person.department} · {person.knownFor.slice(0, 2).join(', ')}
                                </span>
                                <span className="media-badge media-badge-person ml-1">Person</span>
                              </div>
                            </div>
                            <ArrowRight className="w-4 h-4 text-muted/40 shrink-0" />
                          </Link>
                        );
                      })}
                    </div>
                  )}

                  {/* Load more indicator */}
                  {isLoading && flatResults.length > 0 && (
                    <div className="flex items-center justify-center py-3">
                      <div className="w-5 h-5 border-2 border-white/10 border-t-accent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}

              {/* Empty state */}
              {showEmpty && (
                <div className="py-16 text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center mb-4 text-muted/30">
                    <Search className="w-5 h-5" />
                  </div>
                  <p className="text-[14px] font-bold text-white font-sans">No movies or shows found</p>
                  <p className="text-[11.5px] text-muted/50 mt-1 max-w-xs mx-auto leading-relaxed">
                    Try searching with different keywords or browse our trending content.
                  </p>
                </div>
              )}

              {/* Error state */}
              {showError && (
                <div className="py-12 text-center px-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center justify-center mb-4 text-rose-400/60">
                    <X className="w-5 h-5" />
                  </div>
                  <p className="text-[14px] font-bold text-white">Something went wrong</p>
                  <p className="text-[11.5px] text-muted/50 mt-1 max-w-xs mx-auto">{error}</p>
                  <button
                    onClick={() => setQuery(query + ' ')} // trigger re-search
                    className="mt-4 px-4 py-2 rounded-xl bg-accent/10 border border-accent/20 text-accent-light text-[12px] font-bold hover:bg-accent/20 transition-all"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Pre-query content */}
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
                            className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] text-white/95 text-[11.5px] font-semibold transition-all"
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
                            setQuery(term);
                            saveRecentSearch(term);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.1] text-white/95 text-[11.5px] font-semibold transition-all"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[9.5px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1 mb-3 select-none">
                      <Sparkles className="w-3.5 h-3.5" />
                      Quick Access
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Browse Movies', href: '/discover?type=movie', icon: Film, color: 'text-violet-400' },
                        { label: 'Browse TV Shows', href: '/discover?type=tv', icon: Tv, color: 'text-sky-400' },
                      ].map(item => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => onClose()}
                          className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.01] border border-white/[0.04] hover:bg-white/[0.03] hover:border-white/[0.08] transition-all"
                        >
                          <item.icon className={`w-4 h-4 ${item.color}`} />
                          <span className="text-[12px] font-bold text-white">{item.label}</span>
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
