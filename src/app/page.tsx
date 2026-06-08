"use client";

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, TrendingUp, ChevronRight, Play, Star, ArrowRight, Clock,
  Flame, Gem, Film, Globe, Search, Plus, Check, Compass, Info,
  Heart, Zap, Laugh, Moon, Sun, Droplets, Coffee, Ghost, Brain, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../components/cards/MovieCard';
import { SearchOverlay } from '../components/search/SearchOverlay';
import {
  getTrendingMovies, getTopRatedMovies, getFreeMovies,
  getAIPicks, getBollywoodMovies, getHollywoodMovies, getHiddenGems, MOVIES,
  MOODS,
} from '../lib/mockData';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useHistory } from '../context/HistoryContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useToast } from '../context/ToastContext';
import { PROVIDER_REGISTRY } from '../lib/providers';

const HERO_MOVIES = [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]].filter(Boolean);
const TONIGHT = MOVIES[5]; // 12th Fail
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
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});
  const [tonightImgError, setTonightImgError] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const { continueWatching } = useHistory();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { showToast } = useToast();

  const trending = getTrendingMovies();
  const topRated = getTopRatedMovies();
  const free = getFreeMovies();
  const aiPicks = getAIPicks();
  const bollywood = getBollywoodMovies();
  const hollywood = getHollywoodMovies();
  const hidden = getHiddenGems();

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % HERO_MOVIES.length);
        setIsTransitioning(false);
      }, 450);
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  const HERO = HERO_MOVIES[heroIndex];
  const heroImgSrc = imgErrors[HERO?.id] ? FALLBACK_BG : HERO?.backdropPath;

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
              className="w-full h-full object-cover opacity-80"
              onError={() => setImgErrors(p => ({ ...p, [HERO.id]: true }))}
            />
            {/* Cinematic Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/40 to-transparent" />
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
                        <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
                        <span className="text-[10px] font-black text-orange-400 uppercase tracking-wider">
                          #1 Trending Now
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
          MOOD ROW (RIBON)
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
                    <img src={prov.logo} alt={prov.name} className="w-6 h-6 object-contain" onError={(e) => { (e.target as any).style.display = 'none'; }} />
                    <span className="text-[10px] font-bold text-white/70 group-hover:text-white absolute">{prov.name.charAt(0)}</span>
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
            {continueWatching.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </Section>
        )}

        {/* Popular this Week */}
        <div id="trending-row">
          <Section
            title="Popular This Week"
            subtitle="Trending across primary streaming platforms"
            badge={<Flame className="w-4 h-4 text-orange-400" />}
            viewAllTo="/discover"
          >
            {trending.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </Section>
        </div>

        {/* Available Free Section */}
        <Section
          title="Available Free"
          subtitle="Desi hits & streaming favorites (No subscription)"
          badge={<Globe className="w-4 h-4 text-emerald-400" />}
          viewAllTo="/discover"
        >
          {free.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* AI Picks For You */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          className="mb-14 px-6 lg:px-10"
        >
          <div className="rounded-3xl border border-accent/15 bg-gradient-to-r from-accent/5 via-transparent to-transparent p-6 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-[90px] pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-accent-light" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Engine Match Recommendations</h3>
                    <p className="text-xs text-muted mt-0.5">Custom computed on-device database picks</p>
                  </div>
                </div>
                <Link href="/discover" className="text-[12px] font-bold text-accent-light hover:underline">
                  Personalize Discover
                </Link>
              </div>
              <div className="flex gap-4 overflow-x-auto scroll-row pb-2 fade-edges-sm">
                {aiPicks.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Top Rated Section */}
        <Section
          title="Top Rated Masterpieces"
          subtitle="Highest rating metrics across catalogs"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          viewAllTo="/discover"
        >
          {topRated.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* Spotlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 px-6 lg:px-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-white">Bollywood Spotlight</h3>
                <p className="text-[11px] text-muted">Desi storytelling at its best</p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scroll-row pb-2 fade-edges-sm">
              {bollywood.slice(0, 6).map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[15px] font-bold text-white">Hollywood Blockbusters</h3>
                <p className="text-[11px] text-muted">Global stories & box office hits</p>
              </div>
            </div>
            <div className="flex gap-4 overflow-x-auto scroll-row pb-2 fade-edges-sm">
              {hollywood.slice(0, 6).map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
            </div>
          </div>
        </div>

        {/* Hidden Gems Section */}
        <Section
          title="Hidden Gems"
          subtitle="Criminally underrated cinema worth discovering"
          badge={<Gem className="w-4 h-4 text-violet-400" />}
          viewAllTo="/discover"
        >
          {hidden.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

      </div>

      {/* Global Search Overlay */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
