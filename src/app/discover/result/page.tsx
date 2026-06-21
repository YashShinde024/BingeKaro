"use client";

import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Star, Clock, Bookmark, Play, RotateCcw, Sparkles, CheckCircle2, Heart, Share2, Award, PiggyBank, ArrowRight } from 'lucide-react';
import { getMovieById, MOVIES } from '../../../lib/mockData';
import { PROVIDER_REGISTRY } from '../../../lib/providers';
import { OTTBadge, OTTBadgeList } from '../../../components/badges/OTTBadge';
import { OTTProviderId, Movie } from '../../../types';
import { useWatchlist } from '../../../context/WatchlistContext';
import { useHistory } from '../../../context/HistoryContext';
import { useToast } from '../../../context/ToastContext';
import { api } from '../../../lib/api';
import { getBackdropUrl, getPosterUrl } from '../../../lib/tmdb';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* Typewriter Effect */
const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 8 }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    setDisplayText('');
    if (!text) return;
    const timer = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayText}</span>;
};

/* Alternative Recommendation mini card */
const AlternativeCard: React.FC<{ movie: any; reason: string; delay: number }> = ({ movie, reason, delay }) => {
  const [imgErr, setImgErr] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="h-full"
    >
      <Link href={`/movie/${movie.id}`}>
        <motion.div
          whileHover={{ y: -4, borderColor: 'rgba(139,92,246,0.35)', backgroundColor: 'rgba(255,255,255,0.05)' }}
          className="flex gap-3.5 p-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] transition-all cursor-pointer h-full"
        >
          <div className="w-14 shrink-0 rounded-xl overflow-hidden aspect-poster">
            <img
              src={imgErr ? FALLBACK_POSTER : movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-between">
            <div>
              <p className="text-[12.5px] font-bold text-white truncate">
                {movie.title}
              </p>
              <div className="flex items-center gap-1.5 mt-1">
                <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-white/75">{movie.rating.toFixed(1)}</span>
                <span className="text-[10px] text-white/30">•</span>
                <span className="text-[10px] text-muted capitalize truncate">{movie.genres[0]}</span>
              </div>
            </div>
            <div className="pt-2 flex flex-col gap-1.5">
              <span className="text-[9px] font-bold text-accent-light bg-accent/10 border border-accent/20 rounded-md px-1.5 py-0.5 self-start">
                {reason}
              </span>
              <OTTBadgeList providers={movie.providers} size="xs" max={1} variant="pill" />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

function ResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, inFavorites, removeFromFavorites } = useWatchlist();
  const { addToRecommendationHistory } = useHistory();
  const { showToast } = useToast();
  const [posterErr, setPosterErr] = React.useState(false);
  const [bgErr, setBgErr] = React.useState(false);

  const dataParam = searchParams ? searchParams.get('data') : null;
  const [movie, setMovie] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [aiExplanation, setAiExplanation] = React.useState('');

  React.useEffect(() => {
    if (!dataParam) {
      setLoading(false);
      return;
    }
    try {
      const parsed = JSON.parse(decodeURIComponent(dataParam));
      setAiExplanation(parsed.aiExplanation || '');
      
      setLoading(true);
      api.getMovieDetails(parsed.movieId)
        .then((res) => {
          const normalized = {
            id: res.id,
            title: res.title || res.name || 'Untitled',
            backdropPath: res.backdrop_path ? getBackdropUrl(res.backdrop_path) : FALLBACK_BACKDROP,
            posterPath: res.poster_path ? getPosterUrl(res.poster_path) : FALLBACK_POSTER,
            year: res.release_date ? new Date(res.release_date).getFullYear() : 0,
            rating: res.vote_average || 0,
            runtime: res.runtime || 0,
            language: res.original_language || 'en',
            genres: res.genres ? res.genres.map((g: any) => typeof g === 'object' ? g.name : g) : [],
            overview: res.overview || '',
            providers: res.watch_providers?.subscription?.map((p: any) => p.provider_name.toLowerCase()) || [],
          };
          setMovie(normalized);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    } catch {
      setLoading(false);
    }
  }, [dataParam]);

  const saved = movie ? inWatchlist(movie.id) : false;
  const favorited = movie ? inFavorites(movie.id) : false;

  React.useEffect(() => {
    if (movie) {
      addToRecommendationHistory(movie, aiExplanation || movie.overview);
    }
  }, [movie?.id]);

  const confidenceScore = React.useMemo(() => {
    if (!movie) return 0;
    const scoreParam = searchParams?.get('score');
    if (scoreParam) return Math.min(100, Math.max(50, Number(scoreParam)));
    const base = Math.floor(movie.rating * 10);
    const offset = (movie.id * 3) % 15;
    return Math.min(99, Math.max(75, base + offset));
  }, [movie?.id, searchParams]);

  const alternatives = React.useMemo(() => {
    if (!movie) return [];
    return MOVIES
      .filter(m => m.id !== movie.id)
      .filter(m => m.genres.some(g => movie.genres.includes(g)) || m.rating >= 7.5)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [movie?.id]);

  // Dynamic Provider Analysis
  const providerAnalysis = React.useMemo(() => {
    if (!movie || !movie.providers || movie.providers.length === 0) return null;
    const providerObjs = movie.providers.map((id: string) => PROVIDER_REGISTRY[id]).filter(Boolean);
    const sorted = [...providerObjs].sort((a, b) => {
      const rank = { free: 0, subscription: 1, rent: 2, buy: 3 };
      return rank[a.type] - rank[b.type];
    });
    return sorted[0];
  }, [movie?.id]);

  const handleShare = () => {
    if (typeof window !== 'undefined' && movie) {
      const url = `${window.location.origin}/movie/${movie.id}`;
      navigator.clipboard?.writeText(url);
      showToast('Copied link to clipboard!', 'success');
    }
  };

  const scrollAlternatives = () => {
    const el = document.getElementById('alternatives-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111F] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-semibold text-muted-foreground">Decoding dynamic match context...</p>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#07111F] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-white font-bold mb-3">No recommendation generated</p>
          <Link href="/discover" className="text-muted hover:text-white transition-colors text-sm">
            ← Configure mood
          </Link>
        </div>
      </div>
    );
  }

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  return (
    <div className="min-h-screen bg-[#07111F] pb-24">
      {/* Hero Backdrop Backdrop */}
      <div className="relative h-[55vh] min-h-[380px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.4 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt=""
          className="w-full h-full object-cover filter blur-[2px]"
          onError={() => setBgErr(true)}
        />
        {/* Layered vignette shadows */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111F] via-[#07111F]/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07111F]/40 to-transparent" />
      </div>

      {/* Main Details Panel */}
      <div className="max-w-[1200px] mx-auto px-6 -mt-36 relative z-10">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10 lg:gap-14"
        >
          {/* Left Column: Poster Card */}
          <motion.div variants={item} className="flex flex-col items-center lg:items-start shrink-0">
            <motion.div
              layoutId={`poster-wrap-${movie.id}`}
              className="w-52 lg:w-full rounded-card overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.8)] bg-[#121212] aspect-poster"
            >
              <motion.img
                layoutId={`poster-img-${movie.id}`}
                src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={() => setPosterErr(true)}
              />
            </motion.div>

            {/* Back to discover */}
            <Link href="/discover" className="mt-6 w-full">
              <motion.button
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] bg-white/[0.02] text-[12.5px] font-bold text-white/80 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Change Vibe
              </motion.button>
            </Link>
          </motion.div>

          {/* Right Column: AI Analysis details */}
          <motion.div variants={item} className="space-y-7">
            <div className="space-y-3">
              {/* Score Indicator Badge */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent-light text-[10px] font-black uppercase tracking-widest">
                  <Sparkles className="w-3 h-3 text-accent-light animate-pulse" />
                  AI Best Pick
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                  {confidenceScore}% Taste Match
                </span>
              </div>

              {/* Title */}
              <motion.h1 
                layoutId={`title-${movie.id}`}
                className="text-3xl sm:text-[44px] font-black text-white tracking-tight leading-tight"
              >
                {movie.title}
              </motion.h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-2.5 text-white/60 text-[13px] font-semibold">
                <span>{movie.year}</span>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <div className="flex items-center gap-1 text-white">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  {movie.rating.toFixed(1)}
                </div>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 opacity-60" />
                  {runtimeStr}
                </div>
                <span className="w-1 h-1 bg-white/10 rounded-full" />
                <span className="capitalize">{movie.language}</span>
              </div>
            </div>

            {/* AI Explanation block */}
            <div className="p-6 rounded-card border border-accent/15 bg-accent/[0.015] shadow-[0_4px_30px_rgba(139,92,246,0.03)] relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full blur-2xl pointer-events-none" />
              <div className="flex gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0">
                  <Sparkles className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold text-accent-light uppercase tracking-widest">
                    Why we recommend this
                  </p>
                  <p className="text-[14.5px] text-white/90 leading-relaxed font-medium">
                    <TypewriterText text={aiExplanation || movie.aiInsight || movie.overview} speed={10} />
                  </p>
                </div>
              </div>
            </div>

            {/* Platform & availability info */}
            {providerAnalysis && (
              <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.05] bg-white/[0.01]">
                {providerAnalysis.type === 'free' ? (
                  <div className="w-9 h-9 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
                    <PiggyBank className="w-4.5 h-4.5" />
                  </div>
                ) : (
                  <div className="w-9 h-9 bg-accent/10 border border-accent/20 text-accent-light rounded-xl flex items-center justify-center shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                )}
                <div>
                  <p className="text-[12px] text-white/95 font-bold leading-normal">
                    Stream now on {providerAnalysis.name}
                  </p>
                  <p className="text-[10px] text-muted mt-0.5">
                    {providerAnalysis.type === 'free' ? 'Available completely free of charge' : 'Requires active subscription tier'}
                  </p>
                </div>
                <div className="ml-auto">
                  <OTTBadge provider={providerAnalysis.id as OTTProviderId} showLabel size="sm" />
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <Link href={`/movie/${movie.id}`}>
                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  className="btn-primary px-7 py-3 text-[13px] uppercase tracking-wider"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Now
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`btn-secondary px-5 py-3 text-[13px] ${
                  saved ? '!bg-accent/15 !border-accent/30 text-accent-light shadow-[0_0_20px_rgba(139,92,246,0.1)]' : ''
                }`}
              >
                {saved ? <CheckCircle2 className="w-4 h-4 text-accent-light" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved' : 'Save Pick'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleShare}
                className="btn-secondary px-3 py-3 w-11 h-11 flex items-center justify-center"
                title="Copy Movie Link"
              >
                <Share2 className="w-4 h-4" />
              </motion.button>

              <button
                onClick={scrollAlternatives}
                className="ml-auto text-[12px] font-semibold text-muted hover:text-white flex items-center gap-1 transition-colors py-2"
              >
                Alternative Picks <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </motion.div>

        {/* Alternatives row */}
        {alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6 }}
            id="alternatives-section"
            className="mt-20 pt-16 border-t border-white/[0.05]"
          >
            <div className="mb-6">
              <h3 className="text-lg font-bold text-white">Not in the mood? Try these alternatives</h3>
              <p className="text-xs text-muted/65 mt-0.5">Computed by genre similarity & catalog weights</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {alternatives.map((m, i) => (
                <AlternativeCard
                  key={m.id}
                  movie={m}
                  reason={i === 0 ? 'Closer Vibe' : i === 1 ? 'Alternative Tone' : 'Hidden Gem'}
                  delay={i * 0.08}
                />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black flex items-center justify-center">Loading recommendations...</div>}>
      <ResultContent />
    </Suspense>
  );
}
