import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, TrendingUp, Clock, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import type { Movie } from '../../types';
import { MOVIES } from '../../lib/mockData';
import { OTTBadgeList } from '../badges/OTTBadge';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT = ['Dune Part Two', 'Parasite', 'RRR', 'Shogun'];
const TRENDING = ['Stree 2', 'Animal', 'The Bear', 'Scam 1992', 'Mirzapur', 'Maharaja'];
const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80';

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<Movie[]>([]);
  const [selectedIndex, setSelectedIndex] = React.useState(-1);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

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
      m.genres.some(g => g.includes(q))
    ).slice(0, 7);
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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && selectedIndex < results.length) {
        e.preventDefault();
        navigate(`/movie/${results[selectedIndex].id}`);
        onClose();
      } else if (results.length > 0) {
        e.preventDefault();
        navigate(`/movie/${results[0].id}`);
        onClose();
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[100]"
          style={{ background: 'rgba(8,8,8,0.92)', backdropFilter: 'blur(24px)' }}
          onClick={(e) => e.target === e.currentTarget && onClose()}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl mx-auto px-4 pt-24 sm:pt-28"
          >
            {/* Search input */}
            <div className="relative flex items-center rounded-2xl overflow-hidden border border-white/[0.1]"
                 style={{ background: 'rgba(20,20,20,0.9)' }}>
              <Search className="absolute left-4 w-4.5 h-4.5 text-muted pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search movies, shows, directors..."
                className="flex-1 bg-transparent text-white placeholder-muted/50 text-[16px] py-4 pl-12 pr-4 outline-none"
              />
              {query ? (
                <button onClick={() => setQuery('')} className="pr-3 text-muted hover:text-white transition-colors">
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={onClose} className="pr-3 text-muted hover:text-white transition-colors">
                  <kbd className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 font-mono">Esc</kbd>
                </button>
              )}
            </div>

            {/* Results panel */}
            <div className="mt-4 max-h-[65vh] overflow-y-auto rounded-2xl border border-white/[0.08]"
                 style={{ background: 'rgba(14,14,14,0.95)', backdropFilter: 'blur(20px)' }}>
              {results.length > 0 ? (
                <div className="p-2">
                  <div className="flex items-center justify-between px-3 py-2">
                    <p className="text-[10px] font-bold text-muted/50 uppercase tracking-widest">
                      {results.length} result{results.length !== 1 ? 's' : ''}
                    </p>
                    <p className="text-[10px] text-muted/40 font-medium">
                      Use Arrow Keys + Enter
                    </p>
                  </div>
                  {results.map((movie, i) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link
                        to={`/movie/${movie.id}`}
                        onClick={onClose}
                        className={`flex items-center gap-3.5 p-3 rounded-xl transition-all duration-150 group border border-transparent ${
                          i === selectedIndex
                            ? 'bg-accent/10 border-accent/20 pl-4 shadow-[inset_3px_0_0_#8B5CF6]'
                            : 'hover:bg-white/[0.06]'
                        }`}
                      >
                        <img
                          src={movie.posterPath}
                          alt={movie.title}
                          className="w-9 h-[52px] object-cover rounded-lg flex-shrink-0 bg-[#1a1a1a]"
                          onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK; }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className={`text-[14px] font-semibold truncate transition-colors ${
                            i === selectedIndex ? 'text-accent-light' : 'text-white/90 group-hover:text-white'
                          }`}>
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[12px] text-muted">{movie.year}</span>
                            <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                            <span className="text-[12px] text-muted capitalize">
                              {movie.type === 'tv' ? 'Show' : 'Film'}
                            </span>
                            <span className="w-0.5 h-0.5 bg-muted/40 rounded-full" />
                            <div className="flex items-center gap-0.5">
                              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                              <span className="text-[12px] text-muted">{movie.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0">
                          <OTTBadgeList providers={movie.providers} size="sm" max={2} />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              ) : query.trim().length >= 2 ? (
                <div className="py-12 text-center">
                  <p className="text-muted text-[14px]">No results for "{query}"</p>
                  <p className="text-[12px] text-muted/50 mt-1">Try a different title, director, or genre</p>
                </div>
              ) : (
                <div className="p-4 space-y-6">
                  {/* Recent */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock className="w-3.5 h-3.5 text-muted/60" />
                      <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">Recent</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {RECENT.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                          className="px-3 py-1.5 rounded-full text-[13px] font-medium text-muted
                                     border border-white/[0.08] hover:border-white/20 hover:text-white
                                     transition-all duration-150">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Trending */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" />
                      <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest">Trending</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map(s => (
                        <button key={s} onClick={() => setQuery(s)}
                          className="px-3 py-1.5 rounded-full text-[13px] font-medium text-muted
                                     border border-white/[0.08] hover:border-accent/40 hover:text-white
                                     transition-all duration-150">
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
