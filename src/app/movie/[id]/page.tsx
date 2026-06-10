"use client";

import React, { use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Star, Clock, Play, Bookmark, CheckCircle2, Sparkles, ChevronLeft, Share2, Copy, Film, Tv, Eye, Lock } from 'lucide-react';
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

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const searchParams = useSearchParams();
  const mediaType = searchParams.get('type') || 'movie';

  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { addToRecentlyViewed, addToContinueWatching } = useHistory();
  const { showToast } = useToast();

  const [bgErr, setBgErr] = React.useState(false);
  const [posterErr, setPosterErr] = React.useState(false);
  const [showTrailer, setShowTrailer] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);

  // TMDB data state
  const [tmdbData, setTmdbData] = React.useState<TMDBMovieDetails | TMDBTVDetails | null>(null);
  const [tmdbLoading, setTmdbLoading] = React.useState(true);
  const [tmdbError, setTmdbError] = React.useState(false);
  const [similar, setSimilar] = React.useState<NormalizedContent[]>([]);

  // Legacy mock data fallback
  const mockMovie = getMovieById(Number(id));

  // Fetch TMDB details
  React.useEffect(() => {
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
        // Process similar content
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
  React.useEffect(() => {
    if (mockMovie) {
      addToRecentlyViewed(mockMovie);
      addToContinueWatching(mockMovie);
    }
  }, [mockMovie]);

  // Show skeleton while loading
  if (tmdbLoading) {
    return <DetailPageSkeleton />;
  }

  // Resolve data (TMDB or mock fallback)
  const hasTMDB = !!tmdbData && !tmdbError;

  // TMDB data extraction
  const tmdbTitle = hasTMDB
    ? (tmdbData as TMDBMovieDetails).title || (tmdbData as TMDBTVDetails).name || ''
    : '';
  const tmdbYear = hasTMDB
    ? new Date(
        (tmdbData as TMDBMovieDetails).release_date || (tmdbData as TMDBTVDetails).first_air_date || ''
      ).getFullYear()
    : 0;
  const tmdbRating = hasTMDB ? tmdbData!.vote_average : 0;
  const tmdbVoteCount = hasTMDB ? tmdbData!.vote_count : 0;
  const tmdbRuntime = hasTMDB
    ? (tmdbData as TMDBMovieDetails).runtime || ((tmdbData as TMDBTVDetails).episode_run_time?.[0] ?? 0)
    : 0;
  const tmdbOverview = hasTMDB ? tmdbData!.overview : '';
  const tmdbTagline = hasTMDB ? tmdbData!.tagline : '';
  const tmdbGenres = hasTMDB ? tmdbData!.genres.map(g => g.name) : [];
  const tmdbBackdrop = hasTMDB ? getBackdropUrl(tmdbData!.backdrop_path, 'original') : null;
  const tmdbPoster = hasTMDB ? getPosterUrl(tmdbData!.poster_path, 'w500') : null;
  const tmdbCast = hasTMDB ? tmdbData!.credits?.cast?.slice(0, 8) || [] : [];
  const tmdbDirector = hasTMDB
    ? tmdbData!.credits?.crew?.find(c => c.job === 'Director')?.name || ''
    : '';
  const tmdbTrailer = hasTMDB
    ? tmdbData!.videos?.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer')?.key || ''
    : '';
  const tmdbLanguage = hasTMDB ? tmdbData!.original_language : '';

  // Watch providers (India region)
  const watchProviders = hasTMDB
    ? tmdbData!['watch/providers']?.results?.IN || tmdbData!['watch/providers']?.results?.US
    : null;
  const flatrateProviders = watchProviders?.flatrate || [];
  const rentProviders = watchProviders?.rent || [];
  const buyProviders = watchProviders?.buy || [];

  // Final resolved values (TMDB > Mock > defaults)
  const title = tmdbTitle || mockMovie?.title || 'Title not found';
  const year = (tmdbYear > 1900 ? tmdbYear : 0) || mockMovie?.year || 0;
  const rating = tmdbRating || mockMovie?.rating || 0;
  const voteCount = tmdbVoteCount || mockMovie?.voteCount || 0;
  const runtime = tmdbRuntime || mockMovie?.runtime || 0;
  const overview = tmdbOverview || mockMovie?.overview || '';
  const tagline = tmdbTagline || mockMovie?.tagline || '';
  const genres = tmdbGenres.length > 0 ? tmdbGenres : (mockMovie?.genres || []);
  const backdrop = tmdbBackdrop || mockMovie?.backdropPath || FALLBACK_BACKDROP;
  const poster = tmdbPoster || mockMovie?.posterPath || FALLBACK_POSTER;
  const cast = tmdbCast.length > 0 ? tmdbCast : (mockMovie?.cast || []);
  const director = tmdbDirector || mockMovie?.director || '';
  const trailerKey = tmdbTrailer || mockMovie?.trailerKey || '';
  const language = tmdbLanguage || mockMovie?.language || '';

  const saved = mockMovie ? inWatchlist(mockMovie.id) : false;
  const runtimeStr = runtime > 0 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : '';

  // Similar content (TMDB or mock fallback)
  const similarContent = similar.length > 0
    ? similar
    : (mockMovie
        ? MOVIES.filter(m => m.id !== mockMovie.id && m.genres.some(g => mockMovie.genres.includes(g))).slice(0, 8)
        : []);

  // If no data at all
  if (!hasTMDB && !mockMovie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-muted/30">
            <Film className="w-8 h-8" />
          </div>
          <p className="text-xl font-black text-white">Title not found</p>
          <p className="text-sm text-muted/50 max-w-xs mx-auto">
            This title may have been removed or doesn&apos;t exist in our database.
          </p>
          <Link href="/" className="inline-flex items-center gap-2 text-accent-light hover:text-white transition-colors text-sm font-bold">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ── Hero Backdrop Banner ── */}
      <div className="relative h-[60vh] min-h-[460px] w-full overflow-hidden">
        <motion.img
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={bgErr ? FALLBACK_BACKDROP : backdrop}
          alt=""
          className="w-full h-full object-cover filter brightness-50"
          onError={() => setBgErr(true)}
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/95 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-6 lg:left-10 z-20">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white/80 bg-black/40 border border-white/[0.08] hover:bg-black/70 hover:text-white transition-all duration-150 backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Floating content */}
        <div className="absolute bottom-10 left-6 lg:left-10 right-6 z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          {/* Poster */}
          <div className="w-36 md:w-48 aspect-poster rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.9)] bg-[#0C0E17] shrink-0 self-start md:self-auto">
            <img
              src={posterErr ? FALLBACK_POSTER : poster}
              alt={title}
              className="w-full h-full object-cover"
              onError={() => setPosterErr(true)}
            />
          </div>

          {/* Details */}
          <div className="space-y-4 max-w-2xl">
            {tagline && (
              <p className="text-[12.5px] text-accent-light/95 font-bold tracking-wide italic">&quot;{tagline}&quot;</p>
            )}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-white/70 text-[13px] font-bold">
              {year > 0 && (
                <>
                  <span>{year}</span>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                </>
              )}
              {rating > 0 && (
                <>
                  <div className="flex items-center gap-1 text-white font-black">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    {rating.toFixed(1)}
                    {voteCount > 0 && (
                      <span className="text-[11px] text-white/40 font-bold">({(voteCount / 1000).toFixed(0)}K)</span>
                    )}
                  </div>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                </>
              )}
              {runtimeStr && (
                <>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 opacity-60" />
                    {runtimeStr}
                  </div>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                </>
              )}
              {language && <span className="uppercase">{language}</span>}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g: string) => (
                <span key={g} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/80 font-bold capitalize">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">

          {/* Left Column */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-primary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}

              {mockMovie && (
                <button
                  onClick={() => saved ? removeFromWatchlist(mockMovie.id) : addToWatchlist(mockMovie)}
                  className={`btn-secondary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 ${
                    saved ? '!bg-accent/15 !border-accent/40 text-accent-light shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''
                  }`}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4 text-accent-light" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? 'Saved to Watchlist' : 'Add to Watchlist'}
                </button>
              )}

              <button
                onClick={() => setShowShare(true)}
                className="btn-secondary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Title
              </button>
            </div>

            {/* Where To Watch — TMDB providers */}
            {(flatrateProviders.length > 0 || rentProviders.length > 0 || buyProviders.length > 0) && (
              <div className="space-y-4 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05]">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Where To Watch
                </h4>
                {flatrateProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-muted/40 uppercase tracking-wider">Streaming</span>
                    <div className="flex flex-wrap gap-2">
                      {flatrateProviders.map((p: TMDBWatchProvider) => (
                        <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} className="w-5 h-5 rounded" />
                          <span className="text-[11px] font-bold text-white/80">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {rentProviders.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] font-bold text-muted/40 uppercase tracking-wider">Rent</span>
                    <div className="flex flex-wrap gap-2">
                      {rentProviders.map((p: TMDBWatchProvider) => (
                        <div key={p.provider_id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                          <img src={`https://image.tmdb.org/t/p/w45${p.logo_path}`} alt={p.provider_name} className="w-5 h-5 rounded" />
                          <span className="text-[11px] font-bold text-white/80">{p.provider_name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Legacy mock providers fallback */}
            {(!hasTMDB || flatrateProviders.length === 0) && mockMovie?.providers && mockMovie.providers.length > 0 && (
              <div className="space-y-3 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05]">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Where To Watch
                </h4>
                <div className="flex flex-col gap-2.5">
                  {mockMovie.providers.map(p => (
                    <OTTBadge key={p} provider={p} size="sm" showLabel variant="badge" />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-12">
            {/* Overview */}
            <section className="space-y-3">
              <h3 className="text-[17px] font-bold text-white tracking-tight">Overview</h3>
              {director && (
                <p className="text-[13px] text-muted-foreground">
                  Directed by <span className="text-white font-extrabold">{director}</span>
                </p>
              )}
              <p className="text-[14.5px] text-white/75 leading-relaxed font-semibold">
                {overview}
              </p>
            </section>

            {/* Cast & Crew */}
            {cast.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">Cast & Crew</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {cast.map((member: any) => {
                    const profileImg = member.profilePath
                      ? member.profilePath
                      : member.profile_path
                        ? getProfileUrl(member.profile_path)
                        : null;
                    return (
                      <div
                        key={member.id}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.015] border border-white/[0.05]"
                      >
                        <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                          {profileImg ? (
                            <img src={profileImg} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-sm font-bold bg-white/5">
                              {member.name?.[0] || '?'}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-bold text-white truncate">{member.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate mt-0.5">{member.character}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* AI Insights */}
            <section className="space-y-4 border-t border-white/[0.05] pt-8">
              <h3 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-accent-light" />
                AI Personal Match Analytics
              </h3>

              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-2xl border border-accent/15 bg-accent/[0.01] space-y-2">
                    <span className="text-[10px] font-black text-accent-light uppercase tracking-wider block">AI Summary</span>
                    <p className="text-[13.5px] text-white/80 leading-relaxed">
                      {mockMovie?.aiInsight || overview.slice(0, 200) + '...'}
                    </p>
                  </div>
                  <div className="p-5 rounded-2xl border border-accent/15 bg-accent/[0.01] space-y-2">
                    <span className="text-[10px] font-black text-accent-light uppercase tracking-wider block">Why you&apos;ll like this</span>
                    <p className="text-[13.5px] text-white/80 leading-relaxed">
                      Matches your preferences in <strong>{genres.slice(0, 2).join(', ')}</strong>.
                      {flatrateProviders.length > 0 && (
                        <> Available on {flatrateProviders.slice(0, 2).map((p: TMDBWatchProvider) => p.provider_name).join(', ')}.</>
                      )}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center text-center space-y-3">
                  <Lock className="w-6 h-6 text-muted-foreground/50" />
                  <div>
                    <h5 className="text-[13.5px] font-bold text-white">Unlock taste profile insights</h5>
                    <p className="text-[11.5px] text-muted-foreground max-w-sm mt-0.5">
                      Sign in to get custom AI analysis, match explanations, and personal compatibility recommendations.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Similar Content */}
            {similarContent.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">Similar Content</h3>
                <div className="flex gap-4 overflow-x-auto content-rail pb-4 -mx-6 px-6 sm:-mx-0 sm:px-0">
                  {similarContent.map((item: any, i: number) => {
                    // Check if it's a NormalizedContent (TMDB) or legacy Movie
                    if (item.posterUrl !== undefined) {
                      return <MovieCard key={`sim-${item.id}`} content={item} index={i} size="sm" />;
                    }
                    return <MovieCard key={`sim-${item.id}`} movie={item} index={i} size="sm" />;
                  })}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>

      {/* ── YouTube Trailer Modal ── */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.92, y: 16 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 16 }}
              className="relative w-full max-w-4xl aspect-video rounded-3xl overflow-hidden border border-white/10 bg-black shadow-[0_0_80px_rgba(139,92,246,0.4)]"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white transition-all font-bold"
              >
                ✕
              </button>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1`}
                title={`${title} Trailer`}
                className="w-full h-full border-none"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Share Modal ── */}
      <AnimatePresence>
        {showShare && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowShare(false)}
          >
            <motion.div
              initial={{ y: 80, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 80, opacity: 0 }}
              className="w-full max-w-sm bg-[#0C0E17] border border-white/[0.08] rounded-2xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.8)] relative"
              onClick={e => e.stopPropagation()}
            >
              <button
                onClick={() => setShowShare(false)}
                className="absolute top-4 right-4 text-muted hover:text-white transition-all font-bold"
              >
                ✕
              </button>
              <h3 className="text-[14px] font-bold text-white mb-1.5">Share</h3>
              <p className="text-[12px] text-muted/50 mb-5 font-semibold">Share this title with friends.</p>

              <div className="flex gap-2 mb-5">
                <input
                  type="text"
                  readOnly
                  value={typeof window !== 'undefined' ? window.location.href : ''}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-[12px] text-muted outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 bg-accent hover:bg-accent-dark text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out ${title} on BingeKaro! ${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] text-white rounded-xl text-[12px] font-bold transition-all"
                >
                  Twitter / X
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=Check out ${title} on BingeKaro! ${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] text-white rounded-xl text-[12px] font-bold transition-all"
                >
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
