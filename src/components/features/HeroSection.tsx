"use client";

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, Flame, Star, Search, Info, ChevronLeft, ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { MOVIES } from '../../lib/mockData';
import {
  useTrendingToday,
} from '../../hooks/useTMDB';
import { isTMDBAvailable, FALLBACK_BACKDROP } from '../../lib/tmdb';
import type { NormalizedContent } from '../../lib/tmdb-types';
import { HeroSkeleton } from '../ui/Skeletons';
import { OTTBadgeList } from '../badges/OTTBadge';

interface HeroSectionProps {
  onSearchOpen: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = React.memo(({ onSearchOpen }) => {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const [heroIndex, setHeroIndex] = React.useState(0);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

  const trendingToday = useTrendingToday();

  const tmdbAvailable = isTMDBAvailable();
  const heroItems = tmdbAvailable ? trendingToday.data.slice(0, 5) : [];
  const heroFromMock = !tmdbAvailable;

  const HERO_MOVIES_MOCK = React.useMemo(
    () => [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]].filter(Boolean),
    []
  );
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

  const currentHero = heroMovies[heroIndex % Math.max(heroCount, 1)];

  // Resolve hero data
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

  if (heroIsLoading) {
    return <HeroSkeleton />;
  }

  if (!currentHero) return null;

  return (
    <div
      ref={heroRef}
      className="relative h-[90vh] min-h-[600px] overflow-hidden flex items-end"
    >
      {/* Parallax Backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={heroIndex}
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{
            opacity: isTransitioning ? 0 : 1,
            scale: isTransitioning ? 1.05 : 1.01,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <img
            src={heroBackdrop}
            alt=""
            className="w-full h-full object-cover opacity-80 filter brightness-[0.85]"
            onError={(e) => { (e.target as HTMLImageElement).src = FALLBACK_BACKDROP; }}
          />
          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/90 via-[#050505]/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

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
                  {/* Badges */}
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
                  <h1 className="text-4xl sm:text-6xl font-black leading-[1.05] tracking-tight text-white">
                    {heroTitle}
                  </h1>

                  {/* Meta */}
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
                    <p className="text-sm text-white/55 max-w-lg leading-relaxed font-medium line-clamp-3">
                      {heroOverview}
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Hero Search */}
              <div className="relative max-w-md w-full">
                <input
                  type="text"
                  placeholder="Search movies, OTT platforms, or genres..."
                  onClick={onSearchOpen}
                  readOnly
                  className="w-full bg-white/[0.04] hover:bg-white/[0.07] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-sm text-white placeholder-muted/50 cursor-pointer transition-all duration-200"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-muted/60 border border-white/5">Ctrl+K</span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Link href="/discover">
                  <motion.button
                    whileHover={{ scale: 1.03, y: -1 }}
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
                      title="View details"
                      aria-label="View spotlight details"
                    >
                      <Info className="w-4 h-4" />
                    </motion.button>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side — Hero Carousel Indicators */}
            <div className="hidden lg:flex items-center justify-end gap-3">
              <div className="flex flex-col gap-2.5">
                {heroMovies.slice(0, 5).map((item: any, idx: number) => {
                  const iTitle = item.title;
                  const iRating = item.rating;
                  const iYear = item.year;
                  const iPoster = heroFromMock ? item.posterPath : item.posterUrl;
                  return (
                    <button
                      key={`hero-${idx}`}
                      onClick={() => setHeroIndex(idx)}
                      aria-label={`Show ${iTitle}`}
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
  );
});

HeroSection.displayName = 'HeroSection';
