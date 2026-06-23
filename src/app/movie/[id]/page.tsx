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
  fetchMovieDetails,
  fetchTVDetails,
  isTMDBAvailable,
  getBackdropUrl,
  getPosterUrl,
  getProfileUrl,
  normalizeContent,
  FALLBACK_BACKDROP,
  FALLBACK_POSTER,
} from '../../../lib/tmdb';
import type { TMDBMovieDetails, TMDBTVDetails, TMDBCastMember, TMDBWatchProvider, NormalizedContent } from '../../../lib/tmdb-types';
import { OptimizedImage } from '../../../components/ui/OptimizedImage';

// Recharts imports for signature Movie DNA
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';

function getMovieDNA(movieTitle: string, genres: string[]) {
  const hash = movieTitle.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const getVal = (base: number, genreBoost: string[], multiplier: number = 20) => {
    let val = base + (hash % multiplier);
    const hasGenre = genres.some(g => genreBoost.includes(g.toLowerCase()));
    if (hasGenre) val += 30;
    return Math.min(100, Math.max(15, val));
  };

  return [
    { subject: 'Emotion', value: getVal(40, ['drama', 'romance']) },
    { subject: 'Intensity', value: getVal(35, ['action', 'thriller', 'horror']) },
    { subject: 'Humor', value: getVal(30, ['comedy', 'family', 'animation']) },
    { subject: 'Romance', value: getVal(20, ['romance']) },
    { subject: 'Violence', value: getVal(20, ['action', 'crime', 'horror']) },
    { subject: 'Mind-bending', value: getVal(15, ['sci-fi', 'mystery']) },
    { subject: 'Pacing', value: getVal(45, ['action', 'adventure']) },
    { subject: 'Darkness', value: getVal(20, ['horror', 'thriller', 'crime']) },
    { subject: 'Rewatchability', value: getVal(45, ['comedy', 'action', 'sci-fi']) },
  ];
}

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const mediaType = searchParams.get('type') || 'movie';

  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, removeFromFavorites, inFavorites } = useWatchlist();
  const { addToRecentlyViewed, addToContinueWatching } = useHistory();
  const { showToast } = useToast();

  const [bgErr, setBgErr] = useState(false);
  const [posterErr, setPosterErr] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // TMDB data state
  const [tmdbData, setTmdbData] = useState<TMDBMovieDetails | TMDBTVDetails | null>(null);
  const [tmdbLoading, setTmdbLoading] = useState(true);
  const [tmdbError, setTmdbError] = useState(false);
  const [similar, setSimilar] = useState<NormalizedContent[]>([]);

  // Legacy mock data fallback
  const mockMovie = getMovieById(Number(id));

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch TMDB details
  useEffect(() => {
    if (!isTMDBAvailable()) {
      setTmdbLoading(false);
      return;
    }

    setTmdbLoading(true);
    setTmdbError(false);

    const fetchData = mediaType === 'tv' ? fetchTVDetails(Number(id)) : fetchMovieDetails(Number(id));

    fetchData
      .then((data) => {
        setTmdbData(data);
        if (data.similar?.results) {
          setSimilar(data.similar.results.slice(0, 10).map(normalizeContent));
        }
        setTmdbLoading(false);
      })
      .catch(() => {
        setTmdbError(true);
        setTmdbLoading(false);
      });
  }, [id, mediaType]);

  // Track views for mock movies
  useEffect(() => {
    if (mockMovie) {
      addToRecentlyViewed(mockMovie);
      addToContinueWatching(mockMovie);
    }
  }, [mockMovie]);

  if (tmdbLoading) {
    return <DetailPageSkeleton />;
  }

  const hasTMDB = !!tmdbData && !tmdbError;

  // TMDB data extraction
  const tmdbTitle = hasTMDB ? (tmdbData as any).title || (tmdbData as any).name || '' : '';
  const tmdbYear = hasTMDB ? new Date((tmdbData as any).release_date || (tmdbData as any).first_air_date || '').getFullYear() : 0;
  const tmdbRating = hasTMDB ? (tmdbData as any).vote_average : 0;
  const tmdbVoteCount = hasTMDB ? (tmdbData as any).vote_count : 0;
  const tmdbRuntime = hasTMDB ? (tmdbData as any).runtime || (tmdbData as any).episode_run_time?.[0] : 0;
  const tmdbOverview = hasTMDB ? (tmdbData as any).overview : '';
  const tmdbTagline = hasTMDB ? (tmdbData as any).tagline : '';
  const tmdbGenres = hasTMDB ? (tmdbData as any).genres?.map((g: any) => typeof g === 'object' ? g.name : g) || [] : [];
  const tmdbBackdrop = hasTMDB ? getBackdropUrl((tmdbData as any).backdrop_path, 'original') : null;
  const tmdbPoster = hasTMDB ? getPosterUrl((tmdbData as any).poster_path, 'w500') : null;
  const tmdbCast = hasTMDB ? (tmdbData as any).cast?.slice(0, 16) || [] : [];
  const tmdbDirector = hasTMDB ? (tmdbData as any).crew?.find((c: any) => c.job === 'Director' || c.job === 'Creator' || c.job === 'Writer')?.name || '' : '';
  const tmdbTrailer = hasTMDB ? (tmdbData as any).trailer?.key || '' : '';
  const tmdbLanguage = hasTMDB ? (tmdbData as any).language || 'en' : '';

  // Fallback bindings
  const title = hasTMDB ? tmdbTitle : mockMovie?.title || 'Unknown Title';
  const year = hasTMDB ? tmdbYear : mockMovie?.year || 0;
  const rating = hasTMDB ? tmdbRating : mockMovie?.rating || 0;
  const voteCount = hasTMDB ? tmdbVoteCount : mockMovie?.voteCount || 0;
  const runtime = hasTMDB ? tmdbRuntime : mockMovie?.runtime || 0;
  const overview = hasTMDB ? tmdbOverview : mockMovie?.overview || '';
  const tagline = hasTMDB ? tmdbTagline : mockMovie?.tagline || '';
  const genres = hasTMDB ? tmdbGenres : mockMovie?.genres || [];
  const director = hasTMDB ? tmdbDirector : mockMovie?.director || '';
  const trailerKey = hasTMDB ? tmdbTrailer : mockMovie?.trailerKey || '';
  const language = hasTMDB ? tmdbLanguage : mockMovie?.language || '';

  // Image Fallbacks
  const backdropImg = bgErr || (!hasTMDB && !mockMovie?.backdropPath)
    ? FALLBACK_BACKDROP
    : hasTMDB ? tmdbBackdrop : mockMovie?.backdropPath;

  const posterImg = posterErr || (!hasTMDB && !mockMovie?.posterPath)
    ? FALLBACK_POSTER
    : hasTMDB ? tmdbPoster : mockMovie?.posterPath;

  // Stream Provider buckets (TMDB outputs providers in nested keys)
  const providersData = hasTMDB ? (tmdbData as any).watch_providers || {} : {};
  const flatrateProviders = providersData.flatrate || [];
  const rentProviders = providersData.rent || [];
  const buyProviders = providersData.buy || [];

  const isFavorited = inFavorites(Number(id));
  const isSaved = inWatchlist(Number(id));

  const handleWatchlist = () => {
    const movieObj: Movie = {
      id: Number(id),
      type: mediaType as 'movie' | 'tv',
      title,
      posterPath: posterImg || '',
      backdropPath: backdropImg || '',
      year,
      rating,
      voteCount,
      runtime,
      overview,
      genres,
      language: language as any,
      providers: flatrateProviders.map((p: any) => p.provider_name.toLowerCase().replace(/\s+/g, '-')),
      isFree: false,
    };

    if (isSaved) {
      removeFromWatchlist(Number(id));
    } else {
      addToWatchlist(movieObj);
    }
  };

  const handleFavorite = () => {
    const movieObj: Movie = {
      id: Number(id),
      type: mediaType as 'movie' | 'tv',
      title,
      posterPath: posterImg || '',
      backdropPath: backdropImg || '',
      year,
      rating,
      voteCount,
      runtime,
      overview,
      genres,
      language: language as any,
      providers: flatrateProviders.map((p: any) => p.provider_name.toLowerCase().replace(/\s+/g, '-')),
      isFree: false,
    };

    if (isFavorited) {
      removeFromFavorites(Number(id));
    } else {
      addToFavorites(movieObj);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Copied page link to clipboard!', 'success');
    setShowShare(false);
  };

  const similarContent = hasTMDB ? similar : MOVIES.filter(m => m.id !== Number(id)).slice(0, 4);
  const dnaChartData = getMovieDNA(title, genres);

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

      {/* Main Content Info Block */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 -mt-36 md:-mt-48 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 md:gap-12 items-start">
          
          {/* Left Column (Poster and Quick CTA) */}
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

            {/* Where to Watch — Premium Provider Section */}
            {(flatrateProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0) ? (
              <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-accent" />
                  <span className="text-[10px] font-black text-muted-foreground/70 uppercase tracking-widest">Where to Watch</span>
                </div>
                
                {/* Stream */}
                {flatrateProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest">Stream</span>
                    <div className="flex flex-wrap gap-2">
                      {flatrateProviders.map((p: any) => (
                        <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 bg-emerald-500/5 border border-emerald-500/15 rounded-xl hover:border-emerald-500/30 transition-colors cursor-default">
                          {p.logo_path && (
                            <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt="" className="w-5 h-5 rounded object-contain" />
                          )}
                          <span className="text-[10.5px] font-bold text-foreground">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rent */}
                {rentProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Rent</span>
                    <div className="flex flex-wrap gap-2">
                      {rentProviders.slice(0, 6).map((p: any) => (
                        <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 bg-blue-500/5 border border-blue-500/15 rounded-xl hover:border-blue-500/30 transition-colors cursor-default">
                          {p.logo_path && (
                            <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt="" className="w-5 h-5 rounded object-contain" />
                          )}
                          <span className="text-[10.5px] font-bold text-foreground">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Buy */}
                {buyProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-amber-400 uppercase tracking-widest">Buy</span>
                    <div className="flex flex-wrap gap-2">
                      {buyProviders.slice(0, 6).map((p: any) => (
                        <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 bg-amber-500/5 border border-amber-500/15 rounded-xl hover:border-amber-500/30 transition-colors cursor-default">
                          {p.logo_path && (
                            <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt="" className="w-5 h-5 rounded object-contain" />
                          )}
                          <span className="text-[10.5px] font-bold text-foreground">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-card/40 border border-dashed border-border/60 text-center space-y-1.5">
                <Globe className="w-5 h-5 text-muted-foreground/40 mx-auto" />
                <p className="text-[10.5px] text-muted-foreground/60 font-semibold">Streaming availability data is not yet available for this title in your region.</p>
              </div>
            )}
          </div>

          {/* Right Column Details */}
          <div className="space-y-8 pt-4">
            
            {/* Title & Metadata */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-accent/15 border border-accent/25 text-[10px] font-black text-accent uppercase tracking-wider">
                  {mediaType === 'tv' ? 'TV Series' : 'Feature Film'}
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
                {rating > 0 && (
                  <span className="flex items-center gap-1 text-accent font-black">
                    ★ {rating.toFixed(1)} <span className="text-muted-foreground/60 font-semibold">({voteCount} votes)</span>
                  </span>
                )}
                {runtime > 0 && (
                  <span>{runtime} min</span>
                )}
                {language && (
                  <span className="uppercase">{language}</span>
                )}
              </div>
            </div>

            {/* Synopsis Overview */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Overview</h3>
              {director && (
                <p className="text-xs text-muted-foreground font-semibold">
                  Directed/Created by <span className="text-foreground">{director}</span>
                </p>
              )}
              <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed font-semibold">
                {overview}
              </p>
            </div>

            {/* Movie DNA Section (Radar Chart) */}
            <div className="space-y-4 border-t border-border pt-6">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent" /> Entertainment Taste DNA
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] gap-6 items-center">
                {/* Recharts Radar Chart */}
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

                {/* Metrics Breakdown */}
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

            {/* Cast & Crew slider */}
            {tmdbCast.length > 0 && (
              <div className="space-y-4 border-t border-border pt-6">
                <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Main Cast</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-thin">
                  {tmdbCast.map((member: any) => {
                    const profileImg = member.profilePath || member.profile_path ? getProfileUrl(member.profile_path || member.profilePath) : null;
                    return (
                      <div key={member.id} className="w-24 shrink-0 text-center space-y-2">
                        <div className="w-20 h-20 rounded-full overflow-hidden border border-border bg-card mx-auto">
                          {profileImg ? (
                            <img src={profileImg} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-muted/10 flex items-center justify-center text-muted-foreground font-black text-sm">{member.name?.[0]}</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold text-foreground truncate leading-none">{member.name}</p>
                          <p className="text-[9px] text-muted-foreground truncate mt-1 leading-none">{member.character}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Trailer CTA Trigger */}
            {trailerKey && (
              <div className="pt-4 flex justify-center md:justify-start">
                <button
                  onClick={() => setShowTrailer(true)}
                  className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all shadow-[0_4px_16px_rgba(249,115,22,0.25)]"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Cinematic Trailer
                </button>
              </div>
            )}

          </div>

        </div>

        {/* Similar Recommendations List */}
        {similarContent.length > 0 && (
          <section className="space-y-6 border-t border-border pt-12 mt-16">
            <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
              <Film className="w-4.5 h-4.5 text-accent" /> You Might Also Obsess Over
            </h3>
            <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
              {similarContent.map((item: any, i: number) => (
                <div key={item.id} className="w-[185px] shrink-0">
                  <MovieCard movie={item} index={i} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Trailer Dialog Modal Overlay */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowTrailer(false)}
            className="fixed inset-0 z-[120] bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 sm:p-8"
          >
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute top-6 right-6 w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.95)]"
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title="Movie Trailer"
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share Overlay dialog */}
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
