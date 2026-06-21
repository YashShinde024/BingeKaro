"use client";

import React, { use, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Star, Clock, Play, Bookmark, CheckCircle2, Sparkles, ChevronLeft, Share2, Copy, Film, Tv, Eye, Lock, Globe, X, Heart } from 'lucide-react';
import type { Movie } from '../../../types';
import { getMovieById, MOVIES } from '../../../lib/mockData';
import { OTTBadge } from '../../../components/badges/OTTBadge';
import { MovieCard } from '../../../components/cards/MovieCard';
import { DetailPageSkeleton } from '../../../components/ui/Skeletons';
import { useWatchlist } from '../../../context/WatchlistContext';
import { useHistory } from '../../../context/HistoryContext';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';
import {
  fetchTVDetails,
  isTMDBAvailable,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
  normalizeContent,
  FALLBACK_BACKDROP,
  FALLBACK_POSTER,
} from '../../../lib/tmdb';
import type { TMDBTVDetails, TMDBCastMember, TMDBWatchProvider, NormalizedContent } from '../../../lib/tmdb-types';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';

// Recharts imports for signature TV DNA
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

function getTVDNA(tvTitle: string, genres: string[]) {
  const hash = tvTitle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getVal = (base: number, genreBoost: string[], multiplier: number = 20) => {
    let val = base + (hash % multiplier);
    const hasGenre = genres.some(g => genreBoost.includes(g.toLowerCase()));
    if (hasGenre) val += 30;
    return Math.min(100, Math.max(15, val));
  };

  return [
    { subject: 'Emotion', value: getVal(40, ['drama', 'soap']) },
    { subject: 'Intensity', value: getVal(35, ['action', 'adventure', 'sci-fi']) },
    { subject: 'Humor', value: getVal(30, ['comedy', 'animation']) },
    { subject: 'Romance', value: getVal(20, ['romance', 'soap']) },
    { subject: 'Violence', value: getVal(20, ['action', 'crime', 'drama']) },
    { subject: 'Mind-bending', value: getVal(15, ['sci-fi-&-fantasy', 'mystery']) },
    { subject: 'Pacing', value: getVal(45, ['action', 'adventure']) },
    { subject: 'Darkness', value: getVal(20, ['crime', 'mystery']) },
    { subject: 'Rewatchability', value: getVal(45, ['comedy', 'animation']) },
  ];
}

export default function TVDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, removeFromFavorites, inFavorites } = useWatchlist();
  const { addToRecentlyViewed, addToContinueWatching } = useHistory();
  const { showToast } = useToast();

  const [bgErr, setBgErr] = useState(false);
  const [posterErr, setPosterErr] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // TV Details State
  const [tvData, setTvData] = useState<TMDBTVDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [similar, setSimilar] = useState<NormalizedContent[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch TV data
  useEffect(() => {
    setLoading(true);
    setError(false);

    fetchTVDetails(Number(id))
      .then((data) => {
        setTvData(data);
        if (data.similar?.results) {
          setSimilar(data.similar.results.slice(0, 10).map(normalizeContent));
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <DetailPageSkeleton />;
  }

  const hasTV = !!tvData && !error;

  const title = hasTV ? tvData.name || '' : 'TV Show';
  const year = hasTV && tvData.first_air_date ? new Date(tvData.first_air_date).getFullYear() : 0;
  const rating = hasTV ? tvData.vote_average : 0;
  const voteCount = hasTV ? tvData.vote_count : 0;
  const overview = hasTV ? tvData.overview : '';
  const tagline = hasTV ? tvData.tagline : '';
  const genres = hasTV ? tvData.genres?.map((g: any) => typeof g === 'object' ? g.name : g) || [] : [];
  const backdropImg = hasTV && tvData.backdrop_path ? getBackdropUrl(tvData.backdrop_path, 'original') : FALLBACK_BACKDROP;
  const posterImg = hasTV && tvData.poster_path ? getPosterUrl(tvData.poster_path, 'w500') : FALLBACK_POSTER;
  const cast = hasTV ? (tvData as any).cast?.slice(0, 16) || [] : [];
  const totalSeasons = hasTV ? tvData.number_of_seasons || 1 : 1;
  const totalEpisodes = hasTV ? tvData.number_of_episodes || 0 : 0;

  const providersData = hasTV ? (tvData as any).watch_providers || {} : {};
  const flatrateProviders = providersData.flatrate || [];

  const isFavorited = inFavorites(Number(id));
  const isSaved = inWatchlist(Number(id));

  const handleWatchlist = () => {
    const obj: Movie = {
      id: Number(id),
      type: 'tv',
      title,
      posterPath: posterImg || '',
      backdropPath: backdropImg || '',
      year,
      rating,
      voteCount,
      runtime: 0,
      overview,
      genres,
      language: 'english',
      providers: flatrateProviders.map((p: any) => p.provider_name.toLowerCase().replace(/\s+/g, '-')),
      isFree: false,
    };

    if (isSaved) {
      removeFromWatchlist(Number(id));
    } else {
      addToWatchlist(obj);
    }
  };

  const handleFavorite = () => {
    const obj: Movie = {
      id: Number(id),
      type: 'tv',
      title,
      posterPath: posterImg || '',
      backdropPath: backdropImg || '',
      year,
      rating,
      voteCount,
      runtime: 0,
      overview,
      genres,
      language: 'english',
      providers: flatrateProviders.map((p: any) => p.provider_name.toLowerCase().replace(/\s+/g, '-')),
      isFree: false,
    };

    if (isFavorited) {
      removeFromFavorites(Number(id));
    } else {
      addToFavorites(obj);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Copied page link to clipboard!', 'success');
    setShowShare(false);
  };

  // Generate episodes listing dynamically
  const episodesList = Array.from({ length: 8 }).map((_, idx) => ({
    episode_number: idx + 1,
    name: `Episode ${idx + 1}: Path of discovery`,
    overview: `Detailed progression and narrative twists unfold as the main characters chart their next steps.`,
    runtime: 45,
    vote_average: 8.2 + (idx % 3) * 0.3
  }));

  const dnaChartData = getTVDNA(title, genres);

  return (
    <div className="min-h-screen bg-background pb-28 pt-16">
      {/* Backdrop Section */}
      <div className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden">
        {backdropImg && (
          <img
            src={backdropImg}
            alt=""
            className="w-full h-full object-cover opacity-70 filter brightness-[0.7] blur-[1px]"
            onError={() => setBgErr(true)}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-transparent to-transparent" />
      </div>

      {/* Main content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 -mt-36 md:-mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
          
          {/* Left Side */}
          <div className="space-y-4">
            <div className="w-full aspect-[2/3] rounded-[24px] overflow-hidden border border-border shadow-[0_24px_80px_rgba(0,0,0,0.4)] bg-card">
              {posterImg && (
                <OptimizedImage
                  src={posterImg}
                  alt={title}
                  width={300}
                  height={450}
                  className="w-full h-full object-cover"
                  fallbackSrc={FALLBACK_POSTER}
                />
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleWatchlist}
                className={`flex-1 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all border ${
                  isSaved
                    ? 'bg-accent/10 border-accent/30 text-accent'
                    : 'bg-muted/10 border-border/40 text-foreground hover:bg-muted/15'
                }`}
              >
                <Bookmark className="w-4 h-4" /> {isSaved ? 'Watchlisted' : 'Watchlist'}
              </button>
              <button
                onClick={handleFavorite}
                className={`px-4 py-3 rounded-xl border transition-all ${
                  isFavorited
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'bg-muted/10 border-border/40 text-foreground hover:bg-muted/15'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500' : ''}`} />
              </button>
              <button
                onClick={() => setShowShare(true)}
                className="px-4 py-3 rounded-xl border border-border/40 bg-muted/10 text-foreground hover:bg-muted/15 transition-all"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Streaming networks */}
            {flatrateProviders.length > 0 && (
              <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-3">
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest block">Available Stream</span>
                <div className="flex flex-wrap gap-2">
                  {flatrateProviders.slice(0, 4).map((p: any) => (
                    <OTTBadge key={p.provider_id} provider={p.provider_name.toLowerCase().replace(/\s+/g, '-')} size="sm" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Side Details */}
          <div className="space-y-8 pt-4">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-accent/15 border border-accent/25 text-[10px] font-black text-accent uppercase tracking-wider">
                  TV Series
                </span>
                {genres.map((g, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-md bg-muted/10 border border-border/60 text-[10px] font-bold text-muted-foreground">
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-foreground tracking-tight leading-none">
                {title} {year > 0 && <span className="text-muted-foreground font-semibold">({year})</span>}
              </h1>

              {tagline && <p className="text-sm text-accent italic font-semibold">{tagline}</p>}

              <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground">
                <span className="flex items-center gap-1 text-accent font-black">
                  ★ {rating.toFixed(1)} <span className="text-muted-foreground/60 font-semibold">({voteCount} votes)</span>
                </span>
                <span>{totalSeasons} Seasons</span>
                <span>{totalEpisodes} Episodes</span>
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Overview</h3>
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-semibold">
                {overview}
              </p>
            </div>

            {/* TV Show DNA (Radar Chart) */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Entertainment DNA profile
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-center">
                <div className="h-64 md:h-72 w-full flex items-center justify-center bg-card/10 border border-border/60 rounded-3xl p-4">
                  {isClient ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={dnaChartData}>
                        <PolarGrid stroke="var(--border)" />
                        <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted)', fontSize: 10, fontWeight: 700 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'var(--muted-dark)', fontSize: 8 }} />
                        <Radar name={title} dataKey="value" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.25} />
                      </RadarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">Loading DNA chart...</div>
                  )}
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-widest block">DNA Metric Highlights</span>
                  <div className="grid grid-cols-2 gap-3">
                    {dnaChartData.slice(0, 6).map((item, idx) => (
                      <div key={idx} className="p-3 bg-card/25 border border-border/40 rounded-xl">
                        <span className="text-[10.5px] font-bold text-muted-foreground block">{item.subject}</span>
                        <div className="flex items-center gap-2 mt-1.5">
                          <div className="h-1.5 flex-1 bg-muted/10 rounded-full overflow-hidden">
                            <div className="h-full bg-accent" style={{ width: `${item.value}%` }} />
                          </div>
                          <span className="text-[11px] font-black text-foreground shrink-0">{item.value}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Season Selector & Episode Cards */}
            <div className="space-y-6 border-t border-border pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Episodes List</h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-semibold">Select Season:</span>
                  <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(Number(e.target.value))}
                    className="bg-card border border-border/80 rounded-xl px-3 py-1.5 text-xs text-foreground font-semibold outline-none cursor-pointer"
                  >
                    {Array.from({ length: totalSeasons }).map((_, idx) => (
                      <option key={idx + 1} value={idx + 1} className="bg-background">Season {idx + 1}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {episodesList.map((ep) => (
                  <div key={ep.episode_number} className="p-4 bg-card border border-border rounded-2xl space-y-2 hover:border-accent/40 transition-colors">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-xs font-bold text-foreground line-clamp-1">{ep.episode_number}. {ep.name}</h4>
                      <span className="text-[10px] text-accent font-black shrink-0">★ {ep.vote_average.toFixed(1)}</span>
                    </div>
                    <p className="text-[11.5px] text-muted-foreground font-semibold line-clamp-2 leading-relaxed">{ep.overview}</p>
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground/60 font-semibold pt-1 border-t border-border/20">
                      <span>Runtime: {ep.runtime} min</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Similar recommendations */}
        {similar.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12 mt-16">
            <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
              <Tv className="w-4.5 h-4.5 text-accent" /> You Might Also Obsess Over
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
              {similar.map((item: any, i: number) => (
                <div key={item.id} className="w-[185px] shrink-0">
                  <MovieCard movie={item} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Share Overlay */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowShare(false)}
            className="fixed inset-0 z-[120] bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border p-6 rounded-2xl w-full max-w-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-bold text-foreground">Share this discovery</h4>
                <button onClick={() => setShowShare(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-2 bg-muted/10 p-2.5 rounded-xl border border-border/40">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== "undefined" ? window.location.href : ""}
                  className="bg-transparent text-xs text-muted-foreground outline-none flex-1 truncate"
                />
                <button onClick={copyShareLink} className="text-xs text-accent font-bold flex items-center gap-1">
                  <Copy className="w-3.5 h-3.5" /> Copy
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
