"use client";

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, TrendingUp, ChevronRight, Play, Star, ArrowRight, Clock,
  Flame, Gem, Film, Globe, Search, Plus, Check, Compass, Info,
  Heart, Zap, Laugh, Moon, Sun, Droplets, Coffee, Ghost, Brain, Tv, Calendar
} from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../components/cards/MovieCard';
import { SearchOverlay } from '../components/search/SearchOverlay';
import { MOVIES, MOODS } from '../lib/mockData';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useHistory } from '../context/HistoryContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { PROVIDER_REGISTRY } from '../lib/providers';

const FALLBACK_BG = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';

const MOOD_ICONS: Record<string, React.ComponentType<any>> = {
  adventurous: Compass, romantic: Heart, thrilling: Zap, funny: Laugh,
  dark: Moon, 'feel-good': Sun, emotional: Droplets, inspiring: Sparkles,
  chill: Coffee, scary: Ghost, 'mind-bending': Brain, 'action-packed': Flame,
};

interface SectionProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  viewAllTo?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, badge, children, viewAllTo }) => (
  <motion.section
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="mb-14"
  >
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
    <div className="flex gap-4 overflow-x-auto scroll-row px-6 lg:px-10 pb-4 fade-edges-sm">
      {children}
    </div>
  </motion.section>
);

const SkeletonCard = () => (
  <div className="flex-shrink-0 w-[165px] sm:w-[190px] space-y-3 animate-pulse">
    <div className="aspect-poster rounded-[20px] bg-white/5 border border-white/5" />
    <div className="h-4 bg-white/10 rounded w-4/5" />
    <div className="flex justify-between">
      <div className="h-3 bg-white/5 rounded w-1/4" />
      <div className="h-3 bg-white/5 rounded w-1/3" />
    </div>
  </div>
);

const EmptyState = ({ message = "No titles available in this shelf." }) => (
  <div className="w-full py-10 flex flex-col items-center justify-center text-center text-muted-foreground/60 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]">
    <Film className="w-8 h-8 mb-2 opacity-40" />
    <p className="text-sm font-medium">{message}</p>
  </div>
);

export default function Home() {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate loading data from backend APIs
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

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
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { continueWatching } = useHistory();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { showToast } = useToast();

  const HERO_MOVIES = [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]].filter(Boolean);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % HERO_MOVIES.length);
        setIsTransitioning(false);
      }, 450);
    }, 9000);
    return () => clearInterval(interval);
  }, [HERO_MOVIES.length]);

  const HERO = HERO_MOVIES[heroIndex];
  const heroImgSrc = HERO ? (imgErrors[HERO.id] ? FALLBACK_BG : HERO.backdropPath) : FALLBACK_BG;

  // Set up specific sections
  const trending = MOVIES.filter(m => m.isTrending).slice(0, 8);
  const popularMovies = MOVIES.filter(m => m.type === 'movie' && m.rating >= 7.2).slice(0, 8);
  const popularTVShows = MOVIES.filter(m => m.type === 'tv').slice(0, 8);
  const topRated = MOVIES.filter(m => m.isTopRated).slice(0, 8);
  const upcomingReleases = MOVIES.filter(m => m.year === 2024).slice(0, 8);
  const weekendPicks = MOVIES.filter(m => m.isAIPick).slice(0, 8);

  if (!HERO) return null;

  const isSaved = inWatchlist(HERO.id);

  const handleHeroWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSaved) {
      removeFromWatchlist(HERO.id);
      showToast('Removed from watchlist', 'info');
    } else {
      addToWatchlist(HERO);
      showToast('Added to watchlist', 'success');
    }
  };

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
              src={heroImgSrc}
              alt=""
              className="w-full h-full object-cover opacity-85 filter brightness-90"
              onError={() => setImgErrors(p => ({ ...p, [HERO.id]: true }))}
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
                          Tonight's Spotlight
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
                      {HERO.title}
                    </h1>

                    {/* Meta Indicators */}
                    <div className="flex flex-wrap items-center gap-3 text-white/70 text-xs font-semibold">
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-white">{HERO.rating.toFixed(1)}</span>
                      </div>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{HERO.year}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className="capitalize">{HERO.genres[0]}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <OTTBadgeList providers={HERO.providers} size="xs" max={2} />
                    </div>

                    {/* Description */}
                    <p className="text-[14.5px] text-white/60 max-w-lg leading-relaxed font-medium">
                      {HERO.aiInsight || HERO.overview}
                    </p>
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

                  <Link href={`/movie/${HERO.id}`}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="h-11 w-11 rounded-xl border border-white/10 bg-white/5 text-white/80 hover:bg-white/10 flex items-center justify-center transition-all"
                      title="View details of this spotlight"
                    >
                      <Info className="w-4 h-4" />
                    </motion.button>
                  </Link>
                </div>
              </div>

              {/* Right Side Carousel indicators */}
              <div className="hidden lg:flex items-center justify-end gap-3">
                <div className="flex flex-col gap-2.5">
                  {HERO_MOVIES.map((movie, idx) => (
                    <button
                      key={movie.id}
                      onClick={() => setHeroIndex(idx)}
                      className={`group flex items-center gap-4 text-left p-2.5 rounded-xl border transition-all duration-300 w-[260px] ${
                        idx === heroIndex
                          ? 'bg-white/5 border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.5)]'
                          : 'border-transparent opacity-40 hover:opacity-85'
                      }`}
                    >
                      <div className="w-12 aspect-poster rounded overflow-hidden shrink-0 bg-white/5 border border-white/10">
                        <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[12.5px] font-bold text-white truncate">{movie.title}</p>
                        <p className="text-[10px] text-muted mt-0.5 flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400 shrink-0" />
                          <span>{movie.rating.toFixed(1)} · {movie.year}</span>
                        </p>
                      </div>
                    </button>
                  ))}
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

      <div className="max-w-[1400px] mx-auto pt-10 pb-20">
        {/* Continue Watching / Recent */}
        {continueWatching && continueWatching.length > 0 && (
          <Section
            title="Continue Watching"
            subtitle="Recent entertainment scans"
            badge={<Clock className="w-4 h-4 text-accent-light" />}
          >
            {isLoading ? (
              [...Array(4)].map((_, i) => <SkeletonCard key={i} />)
            ) : (
              continueWatching.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
            )}
          </Section>
        )}

        {/* 1. Trending Now */}
        <div id="trending-row">
          <Section
            title="Trending Now"
            subtitle="What's hot across premium OTT services"
            badge={<Flame className="w-4 h-4 text-orange-500" />}
            viewAllTo="/discover"
          >
            {isLoading ? (
              [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
            ) : trending.length > 0 ? (
              trending.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
            ) : (
              <EmptyState message="No trending movies matches right now." />
            )}
          </Section>
        </div>

        {/* 2. Popular Movies */}
        <Section
          title="Popular Movies"
          subtitle="Top movie blockbusters this season"
          badge={<Film className="w-4 h-4 text-violet-400" />}
          viewAllTo="/discover?type=movie"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          ) : popularMovies.length > 0 ? (
            popularMovies.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
          ) : (
            <EmptyState message="No popular movies available." />
          )}
        </Section>

        {/* 3. Popular TV Shows */}
        <Section
          title="Popular TV Shows"
          subtitle="Trending episodic drama & comedies"
          badge={<Tv className="w-4 h-4 text-sky-400" />}
          viewAllTo="/discover?type=tv"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          ) : popularTVShows.length > 0 ? (
            popularTVShows.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
          ) : (
            <EmptyState message="No popular TV shows available." />
          )}
        </Section>

        {/* 4. Top Rated */}
        <Section
          title="Top Rated"
          subtitle="Highest rating metrics across catalogs"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          viewAllTo="/discover"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          ) : topRated.length > 0 ? (
            topRated.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
          ) : (
            <EmptyState message="No top rated movies available." />
          )}
        </Section>

        {/* 5. Upcoming Releases */}
        <Section
          title="Upcoming Releases"
          subtitle="Most anticipated fresh additions"
          badge={<Calendar className="w-4 h-4 text-[#8B5CF6]" />}
          viewAllTo="/discover"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          ) : upcomingReleases.length > 0 ? (
            upcomingReleases.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
          ) : (
            <EmptyState message="No upcoming releases available." />
          )}
        </Section>

        {/* 6. Weekend Picks */}
        <Section
          title="Weekend Picks"
          subtitle="AI computed match recommendations for your weekend"
          badge={<Sparkles className="w-4 h-4 text-accent-light" />}
          viewAllTo="/discover"
        >
          {isLoading ? (
            [...Array(5)].map((_, i) => <SkeletonCard key={i} />)
          ) : weekendPicks.length > 0 ? (
            weekendPicks.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)
          ) : (
            <EmptyState message="No weekend picks recommendations." />
          )}
        </Section>
      </div>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
