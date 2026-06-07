import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star, Sparkles, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import { MOVIES } from '../../lib/mockData';
import { OTTBadgeList } from '../badges/OTTBadge';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TRENDING_SEARCHES = [
  '🔥 Stree 2', '🌊 Maharaja', '⚡ Animal', '🎭 The Bear',
  '🏆 Scam 1992', '🌟 Mirzapur', '🎬 Dune', '❤️ Heeramandi',
];

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80';

// Featured/curated movies for pre-search state
const FEATURED = MOVIES.filter(m => m.rating >= 8).slice(0, 4);

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Movie[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const [recentSearches, setRecentSearches] = React.useState<string[]>([]);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Load recent searches from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('kd_recent_searches');
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 6));
    } catch {}
  }, []);

  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const q = query.toLowerCase();
    const found = MOVIES.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.director && m.director.toLowerCase().includes(q)) ||
      m.genres.some(g => g.includes(q)) ||
      m.cast?.some(c => c.name.toLowerCase().includes(q))
    ).slice(0, 8);
    setResults(found);
  }, [query]);

  React.useEffect(() => {
    setSelectedIndex(-1);
  }, [results]);

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
        saveRecentSearch(query);
        navigate(`/movie/${target.id}`);
        onClose();
      }
    }
  };

  const handleResultClick = () => {
    saveRecentSearch(query);
    onClose();
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('kd_recent_searches');
  };

  const showResults = results.length > 0;
  const showEmpty = query.trim().length >= 2 && results.length === 0;
  const showPreQuery = !showResults && !showEmpty;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100]"
          style={{ background: 'rgba(8,8,8,0.94)', backdropFilter: 'blur(28px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto px-4 pt-20 sm:pt-24"
          >
            {/* Search input */}
            <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/[0.12]"
                 style={{ background: 'rgba(22,22,22,0.95)', boxShadow: '0 8px 40px rgba(0,0,0,0.7)' }}>
              <Search className="absolute left-4 w-4.5 h-4.5 text-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, shows, directors, actors..."
                className="flex-1 bg-transparent text-white placeholder-muted/40 text-[15px] py-4 pl-12 pr-4 outline-none"
              />
              {query ? (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuery('')}
                  className="pr-3 pl-1 text-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              ) : (
                <div className="flex items-center gap-2 pr-3 pl-1">
                  <kbd className="text-[10px] px-1.5 py-0.5 rounded bg-white/8 font-mono text-muted/60 border border-white/10">
                    Esc
                  </kbd>
                </div>
              )}
            </div>

            {/* Results panel */}
            <motion.div
              className="mt-3 max-h-[70vh] overflow-y-auto rounded-2xl border border-white/[0.08]"
              style={{ background: 'rgba(13,13,13,0.97)', backdropFilter: 'blur(24px)', boxShadow: '0 16px 60px rgba(0,0,0,0.8)' }}
            >

              {/* ── Search Results ── */}
              {showResults && (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2.5 border-b border-white/[0.05] mb-1">
                    <p className="text-[10px] font-bold text-muted/50 uppercase tracking-widest">
                      {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-[10px] text-muted/40 font-medium flex items-center gap-1">
                      <span>↑↓</span> navigate <span>↵</span> open
                    </p>
                  </div>
                  {results.map((movie, i) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.035 }}
                    >
                      <Link
                        to={`/movie/${movie.id}`}
                        onClick={handleResultClick}
                        className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-120 group ${
                          i === selectedIndex
                            ? 'bg-accent/12 border border-accent/20 shadow-[inset_3px_0_0_#8B5CF6]'
                            : 'hover:bg-white/[0.05] border border-transparent'
                        }`}
                      >
                        <div className="w-10 h-[56px] rounded-lg overflow-hidden flex-shrink-0 bg-[#1a1a1a]">
                          <img
                            src={movie.posterPath}
                            alt={movie.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[14px] font-semibold truncate transition-colors ${
                            i === selectedIndex ? 'text-accent-light' : 'text-white/90 group-hover:text-white'
                          }`}>
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
                            <span className="text-[11px] text-muted">{movie.year}</span>
                            <span className="w-0.5 h-0.5 bg-muted/30 rounded-full" />
                            <span className="text-[11px] text-muted capitalize">
                              {movie.type === 'tv' ? 'Show' : movie.type === 'anime' ? 'Anime' : 'Film'}
                            </span>
                            <span className="w-0.5 h-0.5 bg-muted/30 rounded-full" />
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <span className="text-[11px] text-muted">{movie.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          <OTTBadgeList providers={movie.providers} size="xs" max={2} />
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0" />
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* ── Empty State ── */}
              {showEmpty && (
                <div className="py-16 text-center px-6">
                  <div className="w-16 h-16 mx-auto bg-white/[0.04] rounded-2xl border border-white/[0.06] flex items-center justify-center mb-5">
                    <Search className="w-6 h-6 text-muted/40" />
                  </div>
                  <p className="text-white/80 font-semibold mb-1">No results for "{query}"</p>
                  <p className="text-[13px] text-muted/50">Try a different title, director, actor, or genre</p>
                  <Link to="/discover" onClick={onClose}>
                    <motion.div
                      whileHover={{ scale: 1.03 }}
                      className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-accent/15 border border-accent/30 text-accent-light text-[13px] font-semibold cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Try AI Discovery instead
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* ── Pre-Query State ── */}
              {showPreQuery && (
                <div className="p-4 space-y-5">

                  {/* Recent Searches */}
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-muted/60" />
                          <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">Recent</p>
                        </div>
                        <button
                          onClick={clearRecent}
                          className="text-[10px] text-muted/40 hover:text-muted transition-colors"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(s => (
                          <motion.button
                            key={s}
                            whileHover={{ scale: 1.04 }}
                            whileTap={{ scale: 0.96 }}
                            onClick={() => setQuery(s)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-muted
                                       border border-white/[0.08] bg-white/[0.03] hover:border-white/20 hover:text-white
                                       transition-all duration-150"
                          >
                            <Clock className="w-2.5 h-2.5 opacity-50" />
                            {s}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trending Searches */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" />
                      <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">Trending Now</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING_SEARCHES.map((s, i) => (
                        <motion.button
                          key={s}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: i * 0.03 }}
                          whileHover={{ scale: 1.05, y: -1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setQuery(s.replace(/^[^\s]+\s/, ''))}
                          className="px-3 py-1.5 rounded-full text-[12px] font-medium text-muted
                                     border border-white/[0.08] bg-white/[0.03]
                                     hover:border-accent/30 hover:bg-accent/8 hover:text-white
                                     transition-all duration-150"
                        >
                          {s}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Featured picks */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">Top Picks</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {FEATURED.map((movie, i) => (
                        <motion.div
                          key={movie.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 + i * 0.05 }}
                        >
                          <Link to={`/movie/${movie.id}`} onClick={onClose}>
                            <motion.div
                              whileHover={{ scale: 1.02 }}
                              className="flex items-center gap-2.5 p-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03]
                                         hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
                            >
                              <img
                                src={movie.posterPath}
                                alt={movie.title}
                                className="w-9 h-[50px] object-cover rounded-lg flex-shrink-0"
                                onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                              />
                              <div className="min-w-0">
                                <p className="text-[12px] font-semibold text-white/80 truncate">{movie.title}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                  <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                                  <span className="text-[10px] text-muted">{movie.rating.toFixed(1)}</span>
                                </div>
                              </div>
                            </motion.div>
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
