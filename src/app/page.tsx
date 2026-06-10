"use client";

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, TrendingUp, ChevronRight, Play, Star, Clock,
  Flame, Film, Globe, Search, Compass, Info,
  Heart, Zap, Laugh, Moon, Sun, Droplets, Coffee, Ghost, Brain, Tv, Calendar,
  Clapperboard, Swords, Skull, Atom, Wand2, ChevronLeft
} from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../components/cards/MovieCard';
import { MovieCardSkeleton, HeroSkeleton } from '../components/ui/Skeletons';
import { SearchOverlay } from '../components/search/SearchOverlay';
import { MOVIES, MOODS } from '../lib/mockData';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useHistory } from '../context/HistoryContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { PROVIDER_REGISTRY } from '../lib/providers';
import {
  useTrendingToday,
  useTrendingWeek,
  usePopularMovies,
  usePopularTV,
  useTopRatedMovies,
  useTopRatedTV,
  useNowPlaying,
  useUpcoming,
  useGenreMovies,
  useGenreTV,
} from '../hooks/useTMDB';
import { isTMDBAvailable, getBackdropUrl, getPosterUrl, FALLBACK_BACKDROP } from '../lib/tmdb';
import type { NormalizedContent } from '../lib/tmdb-types';

const MOOD_ICONS: Record<string, React.ComponentType<any>> = {
  adventurous: Compass, romantic: Heart, thrilling: Zap, funny: Laugh,
  dark: Moon, 'feel-good': Sun, emotional: Droplets, inspiring: Sparkles,
  chill: Coffee, scary: Ghost, 'mind-bending': Brain, 'action-packed': Flame,
};

// ===========================
// Content Rail Component
// ===========================
interface ContentRailProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  viewAllTo?: string;
  items: NormalizedContent[];
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

const ContentRail: React.FC<ContentRailProps> = ({
  title, subtitle, badge, viewAllTo, items, loading, hasMore, onLoadMore,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 30);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 30);
    // Infinite scroll trigger
    if (hasMore && onLoadMore && el.scrollLeft + el.clientWidth >= el.scrollWidth - 400) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, items.length]);

  const scrollBy = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 206; // card width + gap
    el.scrollBy({ left: direction === 'left' ? -cardWidth * 3 : cardWidth * 3, behavior: 'smooth' });
  };

  // Don't render if no data and not loading
  if (!loading && items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 relative group/rail"
    >
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
        <div className="flex items-center gap-3">
          {badge && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05]">
              {badge}
            </div>
          )}
          <div>
            <h2 className="text-[17px] font-bold text-white tracking-tight">{title}</h2>
            {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {viewAllTo && (
          <Link href={viewAllTo} className="flex items-center gap-1 text-[12px] font-semibold text-accent-light hover:text-white transition-colors group">
            See all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {/* Left scroll arrow */}
        {showLeftArrow && (
          <button
            onClick={() => scrollBy('left')}
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-black hover:border-white/20 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right scroll arrow */}
        {showRightArrow && items.length > 4 && (
          <button
            onClick={() => scrollBy('right')}
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-black/80 border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-black hover:border-white/20 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 content-rail px-6 lg:px-10 pb-4 fade-edges-sm"
        >
          {loading && items.length === 0
            ? [...Array(8)].map((_, i) => <MovieCardSkeleton key={i} />)
            : items.map((item, i) => (
                <MovieCard key={`${item.id}-${item.mediaType}`} content={item} index={i} />
              ))
          }
          {/* Load more skeleton at end */}
          {loading && items.length > 0 && (
            <>
              <MovieCardSkeleton />
              <MovieCardSkeleton />
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
};

// ===========================
// Empty State (for mock data fallback)
// ===========================
const EmptyState = ({ message = "No titles available in this shelf." }) => (
  <div className="w-full py-10 flex flex-col items-center justify-center text-center text-muted-foreground/60 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
    <Film className="w-8 h-8 mb-2 opacity-40" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

// ===========================
// Main Home Page
// ===========================
export default function Home() {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!heroRef.current) return;
    const { clientX, clientY } = e;
    const { left, top, width, height } = heroRef.current.getBoundingClientRect();
    const x = (clientX - left - width / 2) / 45;
    const y = (clientY - top - height / 2) / 45;
    setMousePos({ x, y });
  };

  const [heroIndex, setHeroIndex] = React.useState(0);
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { continueWatching } = useHistory();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { showToast } = useToast();

  // ===========================
  // TMDB Data Hooks
  // ===========================
  const trendingToday = useTrendingToday();
  const trendingWeek = useTrendingWeek();
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();
  const topRatedMovies = useTopRatedMovies();
  const topRatedTV = useTopRatedTV();
  const nowPlaying = useNowPlaying();
  const upcoming = useUpcoming();
  const actionPicks = useGenreMovies(28);
  const comedyPicks = useGenreMovies(35);
  const scifiPicks = useGenreMovies(878);
  const crimePicks = useGenreMovies(80);
  const thrillerPicks = useGenreMovies(53);
  const animationPicks = useGenreMovies(16);
  const animePicks = useGenreTV(16);

  // ===========================
  // Hero data from trending
  // ===========================
  const tmdbAvailable = isTMDBAvailable();
  const heroItems = tmdbAvailable ? trendingToday.data.slice(0, 5) : [];
  const heroFromMock = !tmdbAvailable;

  const HERO_MOVIES_MOCK = [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]].filter(Boolean);
  const heroMovies = heroFromMock ? HERO_MOVIES_MOCK : heroItems;
  const heroCount = heroMovies.length;

  React.useEffect(() => {
    if (heroCount === 0) return;
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % heroCount);
        setIsTransitioning(false);
      }, 450);
    }, 9000);
    return () => clearInterval(interval);
  }, [heroCount]);

  // Current hero item
  const currentHero = heroMovies[heroIndex % Math.max(heroCount, 1)];

  // Resolve hero data based on source
  const heroTitle = heroFromMock
    ? (currentHero as any)?.title
    : (currentHero as NormalizedContent)?.title;
  const heroYear = heroFromMock
    ? (currentHero as any)?.year
    : (currentHero as NormalizedContent)?.year;
  const heroRating = heroFromMock
    ? (currentHero as any)?.rating
    : (currentHero as NormalizedContent)?.rating;
  const heroOverview = heroFromMock
    ? ((currentHero as any)?.aiInsight || (currentHero as any)?.overview)
    : (currentHero as NormalizedContent)?.overview;
  const heroBackdrop = heroFromMock
    ? ((currentHero as any)?.backdropPath || FALLBACK_BACKDROP)
    : ((currentHero as NormalizedContent)?.backdropUrl || FALLBACK_BACKDROP);
  const heroPoster = heroFromMock
    ? (currentHero as any)?.posterPath
    : (currentHero as NormalizedContent)?.posterUrl;
  const heroId = heroFromMock
    ? (currentHero as any)?.id
    : (currentHero as NormalizedContent)?.id;

  const heroIsLoading = tmdbAvailable && trendingToday.loading;

  // Keyboard shortcut: Ctrl+K for search
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  if (heroIsLoading) {
    return (
      <div className="min-h-screen bg-[#050505]">
        <HeroSkeleton />
        <div className="max-w-[1400px] mx-auto pt-10 pb-20 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-14">
              <div className="px-6 lg:px-10 mb-5 space-y-2">
                <div className="h-5 skeleton rounded w-40" />
                <div className="h-3 skeleton rounded w-56" />
              </div>
              <div className="flex gap-4 overflow-hidden px-6 lg:px-10 pb-4">
                {[...Array(7)].map((_, j) => <MovieCardSkeleton key={j} />)}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentHero) return null;

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ══════════════════════════════════════
          HERO — Cinematic Rotating Backdrop
      ══════════════════════════════════════ */}
      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setMousePos({ x: 0, y: 0 })}
        className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-end"
      >
        {/* Parallax Backdrop Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            className="absolute inset-0 z-0"
            style={{ y: heroY }}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: isTransitioning ? 0 : 1,
              scale: isTransitioning ? 1.05 : 1.01,
              x: mousePos.x,
              y: mousePos.y
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={heroBackdrop}
              alt=""
              className="w-full h-full object-cover opacity-85 filter brightness-90"
              onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BACKDROP; }}
            />
            {/* Cinematic Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-[#050505]/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Ambient Glow Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-1">
          <div className="aurora-orb aurora-orb-1" style={{ left: '-10%', bottom: '-10%' }} />
          <div className="aurora-orb aurora-orb-2" style={{ right: '5%', top: '5%' }} />
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent/25"
              style={{
                left: `${10 + i * 12}%`,
                top: `${15 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -20, 0],
                x: [0, (i % 2 === 0 ? 10 : -10), 0],
                opacity: [0.1, 0.45, 0.1],
              }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 w-full pb-16 sm:pb-20 pt-24"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 items-end">
              {/* Left Details */}
              <div className="space-y-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-4"
                  >
                    {/* Badge */}
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/10 backdrop-blur-md">
                        <Sparkles className="w-3 h-3 text-accent-light" />
                        <span className="text-[10px] font-black text-accent-light uppercase tracking-wider">
                          Tonight&apos;s Spotlight
                        </span>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-orange-500/20 bg-orange-500/10 backdrop-blur-md">
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400" />
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">
                          Trending Now
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h1 className="text-4.5xl sm:text-6xl font-black leading-[1.05] tracking-tight text-shimmer animate-text-glow">
                      {heroTitle}
                    </h1>

                    {/* Meta Indicators */}
                    <div className="flex flex-wrap items-center gap-3 text-white/70 text-xs font-semibold">
                      {heroRating > 0 && (
                        <>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-white">{heroRating?.toFixed(1)}</span>
                          </div>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                        </>
                      )}
                      {heroYear > 0 && (
                        <>
                          <span>{heroYear}</span>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                        </>
                      )}
                      {heroFromMock && (currentHero as any)?.genres?.[0] && (
                        <>
                          <span className="capitalize">{(currentHero as any).genres[0]}</span>
                          <span className="w-1 h-1 bg-white/20 rounded-full" />
                          <OTTBadgeList providers={(currentHero as any).providers} size="xs" max={2} />
                        </>
                      )}
                    </div>

                    {/* Description */}
                    {heroOverview && (
                      <p className="text-[14.5px] text-white/60 max-w-lg leading-relaxed font-medium line-clamp-3">
                        {heroOverview}
                      </p>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Hero Integrated Search */}
                <div className="relative max-w-md w-full">
                  <input
                    type="text"
                    placeholder="Search movies, OTT platforms, or genres..."
                    onClick={() => setSearchOpen(true)}
                    readOnly
                    className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[13.5px] text-white placeholder-muted/50 cursor-pointer transition-all duration-200"
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-muted/60 border border-white/5">Ctrl+K</span>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link href="/discover">
                    <motion.button
                      whileHover={{ scale: 1.03, y: -1, boxShadow: '0 8px 30px rgba(139,92,246,0.4)' }}
                      whileTap={{ scale: 0.97 }}
                      className="btn-primary px-7 py-3 text-[13px] uppercase tracking-wider font-extrabold flex items-center gap-2"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Find My Pick
                    </motion.button>
                  </Link>

                  <button
                    onClick={() => {
                      document.getElementById('trending-row')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="btn-secondary px-6 py-3 text-[13px] uppercase tracking-wider font-extrabold flex items-center gap-2"
                  >
                    <Flame className="w-3.5 h-3.5 text-orange-400" />
                    Browse Trending
                  </button>

                  {heroId && (
                    <Link href={`/movie/${heroId}`}>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 flex items-center justify-center transition-all"
                        title="View details of this spotlight"
                      >
                        <Info className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  )}
                </div>
              </div>

              {/* Right Side Carousel indicators */}
              <div className="hidden lg:flex items-center justify-end gap-3">
                <div className="flex flex-col gap-2.5">
                  {heroMovies.slice(0, 5).map((item: any, idx: number) => {
                    const iTitle = heroFromMock ? item.title : item.title;
                    const iRating = heroFromMock ? item.rating : item.rating;
                    const iYear = heroFromMock ? item.year : item.year;
                    const iPoster = heroFromMock ? item.posterPath : item.posterUrl;
                    return (
                      <button
                        key={`hero-${idx}`}
                        onClick={() => setHeroIndex(idx)}
                        className={`group flex items-center gap-4 text-left p-2.5 rounded-xl border transition-all duration-300 w-[260px] ${
                          idx === heroIndex
                            ? 'bg-white/5 border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
                            : 'border-transparent opacity-40 hover:opacity-85'
                        }`}
                      >
                        <div className="w-12 aspect-poster rounded overflow-hidden shrink-0 bg-white/5 border border-white/10">
                          {iPoster && <img src={iPoster} alt="" className="w-full h-full object-cover" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-bold text-white truncate">{iTitle}</p>
                          <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                            <span>{iRating?.toFixed(1)} · {iYear}</span>
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          MOOD ROW (RIBBON)
      ══════════════════════════════════════ */}
      <div className="relative border-y border-white/[0.04] bg-white/[0.01] backdrop-blur-md z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
          <div className="flex items-center gap-6 overflow-x-auto scroll-row fade-edges-sm">
            <span className="text-[10px] font-extrabold text-accent-light uppercase tracking-widest shrink-0 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              Mood Vibe Ribbon:
            </span>
            {MOODS.map(mood => {
              const MoodIcon = MOOD_ICONS[mood.id] || Compass;
              return (
                <Link key={mood.id} href={`/discover?mood=${mood.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    className="chip border-white/[0.08] hover:border-white/20 hover:text-white py-1.5 shrink-0 flex items-center gap-2"
                  >
                    <MoodIcon className="w-3.5 h-3.5 text-accent-light" />
                    <span className="text-[12px] font-bold uppercase tracking-wider">{mood.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          OTT PLATFORMS ROW
      ══════════════════════════════════════ */}
      <div className="relative border-b border-white/[0.04] bg-white/[0.005] backdrop-blur-md z-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-4.5">
          <div className="flex items-center gap-5 overflow-x-auto scroll-row fade-edges-sm">
            <span className="text-[10px] font-extrabold text-muted/50 uppercase tracking-widest shrink-0 flex items-center gap-1.5">
              Available Channels:
            </span>
            <div className="flex items-center gap-3.5">
              {Object.values(PROVIDER_REGISTRY).map(prov => (
                <Link key={prov.id} href={`/discover?provider=${prov.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.08, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-white/[0.02] border border-white/[0.06] hover:border-accent/40 hover:bg-white/[0.06] hover:shadow-[0_0_15px_rgba(139,92,246,0.35)] transition-all duration-300 relative group shrink-0 cursor-pointer"
                  >
                    <img src={prov.logo} alt={prov.name} className="w-6 h-6 object-contain" />
                    <span className="absolute bottom-[-32px] left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-black/90 border border-white/10 text-[9px] font-bold px-2 py-0.5 rounded text-white whitespace-nowrap transition-all duration-200 z-50">
                      {prov.name}
                    </span>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          CONTENT RAILS — 15 sections
      ══════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto pt-10 pb-20">

        {/* Continue Watching / Recent */}
        {continueWatching && continueWatching.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <Clock className="w-4 h-4 text-accent-light" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-white tracking-tight">Continue Watching</h2>
                  <p className="text-[12px] text-muted mt-0.5">Recent entertainment scans</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 content-rail px-6 lg:px-10 pb-4 fade-edges-sm">
              {continueWatching.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
            </div>
          </motion.section>
        )}

        {/* 1. Trending Today */}
        <div id="trending-row">
          <ContentRail
            title="Trending Today"
            subtitle="What everyone's watching right now"
            badge={<Flame className="w-4 h-4 text-orange-500" />}
            items={tmdbAvailable ? trendingToday.data : MOVIES.filter(m => m.isTrending).slice(0, 8).map(m => ({ id: m.id, title: m.title, mediaType: m.type as 'movie' | 'tv', posterUrl: m.posterPath, backdropUrl: m.backdropPath, year: m.year, rating: m.rating, voteCount: m.voteCount, overview: m.overview, genreIds: [], language: m.language, popularity: 0 }))}
            loading={tmdbAvailable ? trendingToday.loading : false}
            hasMore={trendingToday.hasMore}
            onLoadMore={trendingToday.loadMore}
            viewAllTo="/discover"
          />
        </div>

        {/* 2. Trending This Week */}
        <ContentRail
          title="Trending This Week"
          subtitle="Hot picks of the week"
          badge={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          items={trendingWeek.data}
          loading={trendingWeek.loading}
          hasMore={trendingWeek.hasMore}
          onLoadMore={trendingWeek.loadMore}
        />

        {/* 3. Popular Movies */}
        <ContentRail
          title="Popular Movies"
          subtitle="Top movie blockbusters this season"
          badge={<Film className="w-4 h-4 text-violet-400" />}
          items={popularMovies.data}
          loading={popularMovies.loading}
          hasMore={popularMovies.hasMore}
          onLoadMore={popularMovies.loadMore}
          viewAllTo="/discover?type=movie"
        />

        {/* 4. Popular TV Shows */}
        <ContentRail
          title="Popular TV Shows"
          subtitle="Trending episodic drama & comedies"
          badge={<Tv className="w-4 h-4 text-sky-400" />}
          items={popularTV.data}
          loading={popularTV.loading}
          hasMore={popularTV.hasMore}
          onLoadMore={popularTV.loadMore}
          viewAllTo="/discover?type=tv"
        />

        {/* 5. Top Rated Movies */}
        <ContentRail
          title="Top Rated Movies"
          subtitle="Highest rated films of all time"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          items={topRatedMovies.data}
          loading={topRatedMovies.loading}
          hasMore={topRatedMovies.hasMore}
          onLoadMore={topRatedMovies.loadMore}
        />

        {/* 6. Top Rated TV Shows */}
        <ContentRail
          title="Top Rated TV Shows"
          subtitle="Critically acclaimed television"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          items={topRatedTV.data}
          loading={topRatedTV.loading}
          hasMore={topRatedTV.hasMore}
          onLoadMore={topRatedTV.loadMore}
        />

        {/* 7. Now Playing */}
        <ContentRail
          title="Now Playing"
          subtitle="Currently in theaters and streaming"
          badge={<Clapperboard className="w-4 h-4 text-rose-400" />}
          items={nowPlaying.data}
          loading={nowPlaying.loading}
          hasMore={nowPlaying.hasMore}
          onLoadMore={nowPlaying.loadMore}
        />

        {/* 8. Upcoming Movies */}
        <ContentRail
          title="Upcoming Releases"
          subtitle="Most anticipated films coming soon"
          badge={<Calendar className="w-4 h-4 text-[#8B5CF6]" />}
          items={upcoming.data}
          loading={upcoming.loading}
          hasMore={upcoming.hasMore}
          onLoadMore={upcoming.loadMore}
        />

        {/* 9. Action Picks */}
        <ContentRail
          title="Action Picks"
          subtitle="Explosive action and adrenaline"
          badge={<Swords className="w-4 h-4 text-red-400" />}
          items={actionPicks.data}
          loading={actionPicks.loading}
          hasMore={actionPicks.hasMore}
          onLoadMore={actionPicks.loadMore}
        />

        {/* 10. Comedy Picks */}
        <ContentRail
          title="Comedy Picks"
          subtitle="Laugh-out-loud entertainment"
          badge={<Laugh className="w-4 h-4 text-yellow-400" />}
          items={comedyPicks.data}
          loading={comedyPicks.loading}
          hasMore={comedyPicks.hasMore}
          onLoadMore={comedyPicks.loadMore}
        />

        {/* 11. Sci-Fi Picks */}
        <ContentRail
          title="Sci-Fi Picks"
          subtitle="Science fiction and futuristic worlds"
          badge={<Atom className="w-4 h-4 text-cyan-400" />}
          items={scifiPicks.data}
          loading={scifiPicks.loading}
          hasMore={scifiPicks.hasMore}
          onLoadMore={scifiPicks.loadMore}
        />

        {/* 12. Crime Picks */}
        <ContentRail
          title="Crime Picks"
          subtitle="Gritty crime dramas and thrillers"
          badge={<Skull className="w-4 h-4 text-slate-400" />}
          items={crimePicks.data}
          loading={crimePicks.loading}
          hasMore={crimePicks.hasMore}
          onLoadMore={crimePicks.loadMore}
        />

        {/* 13. Thriller Picks */}
        <ContentRail
          title="Thriller Picks"
          subtitle="Edge-of-seat suspense"
          badge={<Zap className="w-4 h-4 text-amber-500" />}
          items={thrillerPicks.data}
          loading={thrillerPicks.loading}
          hasMore={thrillerPicks.hasMore}
          onLoadMore={thrillerPicks.loadMore}
        />

        {/* 14. Animation Picks */}
        <ContentRail
          title="Animation Picks"
          subtitle="Animated films and features"
          badge={<Wand2 className="w-4 h-4 text-pink-400" />}
          items={animationPicks.data}
          loading={animationPicks.loading}
          hasMore={animationPicks.hasMore}
          onLoadMore={animationPicks.loadMore}
        />

        {/* 15. Anime Picks */}
        <ContentRail
          title="Anime Picks"
          subtitle="Top anime series and films"
          badge={<Globe className="w-4 h-4 text-indigo-400" />}
          items={animePicks.data}
          loading={animePicks.loading}
          hasMore={animePicks.hasMore}
          onLoadMore={animePicks.loadMore}
        />
      </div>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
