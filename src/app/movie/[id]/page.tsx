"use client";

import React, { use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Star, Clock, Play, Bookmark, CheckCircle2, Sparkles, ChevronLeft, Share2, Copy, Film, Tv, Eye, Lock } from 'lucide-react';
import { getMovieById, MOVIES } from '../../../lib/mockData';
import { OTTBadge } from '../../../components/badges/OTTBadge';
import { MovieCard } from '../../../components/cards/MovieCard';
import { useWatchlist } from '../../../context/WatchlistContext';
import { useHistory } from '../../../context/HistoryContext';
import { useToast } from '../../../context/ToastContext';
import { useAuth } from '../../../context/AuthContext';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const MOCK_SCREENSHOTS = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&q=80",
  "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&q=80",
  "https://images.unsplash.com/photo-1478720143023-6a9ec39e1efc?w=600&q=80",
  "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600&q=80"
];

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { user } = useAuth();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { addToRecentlyViewed, addToContinueWatching } = useHistory();
  const { showToast } = useToast();

  const [bgErr, setBgErr] = React.useState(false);
  const [posterErr, setPosterErr] = React.useState(false);
  const [showTrailer, setShowTrailer] = React.useState(false);
  const [showShare, setShowShare] = React.useState(false);

  const movie = getMovieById(Number(id));
  const similar = MOVIES.filter(m => m.id !== movie?.id && m.genres.some(g => movie?.genres.includes(g))).slice(0, 8);
  const saved = movie ? inWatchlist(movie.id) : false;

  React.useEffect(() => {
    if (movie) {
      addToRecentlyViewed(movie);
      addToContinueWatching(movie);
    }
  }, [movie]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black text-white mb-3">Title not found</p>
          <Link href="/" className="text-muted hover:text-white transition-colors text-sm">← Back home</Link>
        </div>
      </div>
    );
  }

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

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
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
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

        {/* Floating Title info inside Hero (matches Letterboxd/Netflix) */}
        <div className="absolute bottom-10 left-6 lg:left-10 right-6 z-10 max-w-[1280px] mx-auto flex flex-col md:flex-row md:items-end gap-6 md:gap-10">
          {/* Overlapping Poster */}
          <div className="w-36 md:w-48 aspect-poster rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_50px_rgba(0,0,0,0.9)] bg-[#0C0E17] shrink-0 self-start md:self-auto">
            <img
              src={posterErr ? FALLBACK_POSTER : movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={() => setPosterErr(true)}
            />
          </div>

          {/* Details */}
          <div className="space-y-4 max-w-2xl">
            {movie.tagline && (
              <p className="text-[12.5px] text-accent-light/95 font-bold tracking-wide italic">"{movie.tagline}"</p>
            )}
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {movie.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-3 text-white/70 text-[13px] font-bold">
              <span>{movie.year}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-1 text-white font-black">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {movie.rating.toFixed(1)}
                <span className="text-[11px] text-white/40 font-bold">({(movie.voteCount / 1000).toFixed(0)}K votes)</span>
              </div>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 opacity-60" />
                {runtimeStr}
              </div>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="capitalize">{movie.language}</span>
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map(g => (
                <span key={g} className="px-3 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-[11px] text-white/80 font-bold capitalize">
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Details Sections Grid ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12">
          
          {/* Left Column: Actions & Where to Watch */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="flex flex-col gap-3">
              {movie.trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-primary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}

              <button
                onClick={() => saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`btn-secondary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2 ${
                  saved ? '!bg-accent/15 !border-accent/40 text-accent-light shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''
                }`}
              >
                {saved ? <CheckCircle2 className="w-4 h-4 text-accent-light" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved to Watchlist' : 'Add to Watchlist'}
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="btn-secondary w-full py-3.5 text-[13px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-2"
              >
                <Share2 className="w-4 h-4" />
                Share Title
              </button>
            </div>

            {/* Where To Watch Section */}
            <div className="space-y-3 p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05]">
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                Where To Watch
              </h4>
              <div className="flex flex-col gap-2.5">
                {movie.providers.map(p => (
                  <OTTBadge key={p} provider={p} size="sm" showLabel variant="badge" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Sections */}
          <div className="space-y-12">
            {/* Overview */}
            <section className="space-y-3">
              <h3 className="text-[17px] font-bold text-white tracking-tight">Overview</h3>
              {movie.director && (
                <p className="text-[13px] text-muted-foreground">
                  Directed by <span className="text-white font-extrabold">{movie.director}</span>
                </p>
              )}
              <p className="text-[14.5px] text-white/75 leading-relaxed font-semibold">
                {movie.overview}
              </p>
            </section>

            {/* Cast & Crew */}
            {movie.cast && movie.cast.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">Cast & Crew</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {movie.cast.map(member => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.015] border border-white/[0.05]"
                    >
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                        {member.profilePath ? (
                          <img src={member.profilePath} alt={member.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted text-sm font-bold bg-white/5">
                            {member.name[0]}
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">{member.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">{member.character}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Screenshots Gallery */}
            <section className="space-y-4">
              <h3 className="text-[17px] font-bold text-white tracking-tight">Screenshots & Posters</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MOCK_SCREENSHOTS.map((url, i) => (
                  <div key={i} className="aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5 shadow-md group relative cursor-zoom-in">
                    <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Authenticated Only: AI Insights & Why You'll Like This */}
            <section className="space-y-4 border-t border-white/[0.05] pt-8">
              <h3 className="text-[17px] font-bold text-white tracking-tight flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-accent-light" />
                AI Personal Match Analytics
              </h3>

              {user ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* AI Summary */}
                  <div className="p-5 rounded-2xl border border-accent/15 bg-accent/[0.01] space-y-2">
                    <span className="text-[10px] font-black text-accent-light uppercase tracking-wider block">AI Summary</span>
                    <p className="text-[13.5px] text-white/80 leading-relaxed">
                      {movie.aiInsight || movie.overview}
                    </p>
                  </div>
                  {/* Why You'll Like This */}
                  <div className="p-5 rounded-2xl border border-accent/15 bg-accent/[0.01] space-y-2">
                    <span className="text-[10px] font-black text-accent-light uppercase tracking-wider block">Why you'll like this</span>
                    <p className="text-[13.5px] text-white/80 leading-relaxed">
                      Matches your preferences in <strong>{movie.genres.slice(0, 2).join(', ')}</strong>. Available on your active channel subscriptions ({movie.providers.slice(0, 2).join(', ')}).
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.01] flex flex-col items-center text-center space-y-3">
                  <Lock className="w-6 h-6 text-muted-foreground/50" />
                  <div>
                    <h5 className="text-[13.5px] font-bold text-white">Unlock taste profile insights</h5>
                    <p className="text-[11.5px] text-muted-foreground max-w-sm mt-0.5">
                      Sign in with Clerk to get custom calculated AI analysis, match explanations, and personal compatibility recommendations.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Similar Content */}
            {similar.length > 0 && (
              <section className="space-y-4">
                <h3 className="text-[17px] font-bold text-white tracking-tight">Similar Content</h3>
                <div className="flex gap-4 overflow-x-auto scroll-row pb-4 -mx-6 px-6 sm:-mx-0 sm:px-0">
                  {similar.map((m, i) => (
                    <MovieCard key={m.id} movie={m} index={i} size="sm" />
                  ))}
                </div>
              </section>
            )}

          </div>

        </div>
      </div>

      {/* ── YouTube Trailer Modal ── */}
      <AnimatePresence>
        {showTrailer && movie.trailerKey && (
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
                src={`https://www.youtube.com/embed/${movie.trailerKey}?autoplay=1`}
                title={`${movie.title} Trailer`}
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
              <h3 className="text-[14px] font-bold text-white mb-1.5">Share Movie</h3>
              <p className="text-[12px] text-muted/50 mb-5 font-semibold">Share this screen with friends or other watch parties.</p>

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
                  href={`https://twitter.com/intent/tweet?text=Check out ${movie.title} on BingeKaro! ${typeof window !== 'undefined' ? window.location.href : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 p-2.5 bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.05] text-white rounded-xl text-[12px] font-bold transition-all"
                >
                  Twitter / X
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=Check out ${movie.title} on BingeKaro! ${typeof window !== 'undefined' ? window.location.href : ''}`}
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
