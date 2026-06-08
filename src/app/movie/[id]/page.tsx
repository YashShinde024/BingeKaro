"use client";

import React, { use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Star, Clock, Play, Bookmark, CheckCircle2, Sparkles, ChevronLeft, Share2, Copy } from 'lucide-react';
import { getMovieById, MOVIES } from '../../../lib/mockData';
import { OTTBadge } from '../../../components/badges/OTTBadge';
import { MovieCard } from '../../../components/cards/MovieCard';
import { useWatchlist } from '../../../context/WatchlistContext';
import { useHistory } from '../../../context/HistoryContext';
import { useToast } from '../../../context/ToastContext';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export default function MovieDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { addToRecentlyViewed, addToContinueWatching } = useHistory();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = React.useState<'overview' | 'cast' | 'similar' | 'ai'>('overview');
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
          <p className="text-2xl font-black text-white mb-3">Scene not found</p>
          <Link href="/" className="text-muted hover:text-white transition-colors text-sm">← Back home</Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'cast', label: 'Cast & Crew' },
    { id: 'similar', label: 'Similar Movies' },
    { id: 'ai', label: 'AI Insights' },
  ] as const;

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* ── Hero backdrop ── */}
      <div className="relative h-[65vh] min-h-[440px] overflow-hidden">
        <motion.img
          layoutId={`backdrop-img-${movie.id}`}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover filter blur-[1px]"
          onError={() => setBgErr(true)}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/40 to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-6 lg:left-10 z-10">
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold text-white/80 bg-black/40 border border-white/[0.08] hover:bg-black/70 hover:text-white transition-all duration-150 backdrop-blur-md"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-8 -mt-48 relative z-10 pb-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8 lg:gap-14"
        >
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-start shrink-0 animate-scale-in"
          >
            <div
              className="w-44 lg:w-full rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.85)] bg-[#0C0E17]"
            >
              <img
                src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                alt={movie.title}
                className="w-full aspect-poster object-cover"
                onError={() => setPosterErr(true)}
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={stagger} initial="hidden" animate="show" className="space-y-6">
            {/* Title */}
            <motion.div variants={fadeUp} className="space-y-2">
              {movie.tagline && (
                <p className="text-[12px] text-accent-light/80 font-bold tracking-wide italic">"{movie.tagline}"</p>
              )}
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {movie.title}
              </h1>
            </motion.div>

            {/* Meta */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 text-white/60 text-[13px] font-bold">
              <span>{movie.year}</span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-1 text-white font-black">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {movie.rating.toFixed(1)}
                <span className="text-[11px] text-white/40 font-bold">({(movie.voteCount / 1000).toFixed(0)}K)</span>
              </div>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 opacity-60" />
                {runtimeStr}
              </div>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <span className="capitalize">{movie.language}</span>
              {movie.isFree ? (
                <>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="text-[9.5px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md uppercase">
                    FREE
                  </span>
                </>
              ) : (
                <>
                  <span className="w-1 h-1 bg-white/10 rounded-full" />
                  <span className="text-[9.5px] font-black text-violet-400 bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 rounded-md uppercase">
                    PREMIUM
                  </span>
                </>
              )}
            </motion.div>

            {/* Genre chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-1.5">
              {movie.genres.map(g => (
                <span key={g} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] text-white/80 font-bold capitalize">
                  {g}
                </span>
              ))}
            </motion.div>

            {/* Availability tags */}
            <motion.div variants={fadeUp} className="space-y-2.5">
              <p className="text-[9.5px] font-extrabold text-muted/40 uppercase tracking-widest">Platform Availability</p>
              <div className="flex flex-wrap gap-2.5">
                {movie.providers.map(p => (
                  <OTTBadge key={p} provider={p} size="sm" showLabel variant="badge" />
                ))}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-3 pt-2">
              {movie.trailerKey ? (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-primary px-6 py-3 text-[12.5px] uppercase tracking-wider font-extrabold"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              ) : null}

              <button
                onClick={() => saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`btn-secondary px-5 py-3 text-[12.5px] uppercase tracking-wider font-extrabold ${
                  saved ? '!bg-accent/15 !border-accent/40 text-accent-light shadow-[0_0_20px_rgba(139,92,246,0.15)]' : ''
                }`}
              >
                {saved ? <CheckCircle2 className="w-4 h-4 text-accent-light" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved' : 'Add Watchlist'}
              </button>

              <button
                onClick={() => setShowShare(true)}
                className="btn-secondary px-3 py-3 w-11 h-11 flex items-center justify-center"
                title="Share Movie Details"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </motion.div>

            {/* Tabs content */}
            <motion.div variants={fadeUp} className="pt-4">
              <div className="flex gap-4 border-b border-white/[0.06] mb-6">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative pb-3 text-[13px] font-extrabold tracking-wide transition-colors ${
                      activeTab === tab.id ? 'text-white' : 'text-muted hover:text-white/80'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="detail-tab-line"
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab render details */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="max-w-2xl space-y-4">
                    {movie.director && (
                      <p className="text-[13.5px] text-muted">
                        Director: <span className="text-white font-extrabold">{movie.director}</span>
                      </p>
                    )}
                    <p className="text-[14.5px] text-white/75 leading-relaxed font-semibold">{movie.overview}</p>
                  </div>
                )}

                {activeTab === 'cast' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {movie.cast && movie.cast.length > 0 ? movie.cast.map(member => (
                      <motion.div
                        key={member.id}
                        whileHover={{ y: -2, borderColor: 'rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.03)' }}
                        className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.015] border border-white/[0.05] transition-all"
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
                          <p className="text-[11px] text-muted/65 truncate mt-0.5 font-bold">{member.character}</p>
                        </div>
                      </motion.div>
                    )) : (
                      <p className="text-muted text-[13px]">Cast details are not available for this entry.</p>
                    )}
                  </div>
                )}

                {activeTab === 'similar' && (
                  <div className="flex gap-4 overflow-x-auto scroll-row pb-3 -mx-6 px-6">
                    {similar.map((m, i) => <MovieCard key={m.id} movie={m} index={i} size="sm" />)}
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="max-w-2xl">
                    <div className="rounded-2xl p-5 border border-accent/20 bg-accent/[0.02] shadow-[0_4px_30px_rgba(139,92,246,0.05)] flex items-start gap-4">
                      <div className="w-10 h-10 bg-accent/10 border border-accent/20 rounded-xl flex items-center justify-center shrink-0">
                        <Sparkles className="w-5 h-5 text-accent-light" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-extrabold text-accent-light uppercase tracking-widest">
                          BingeKaro AI Insight Analysis
                        </p>
                        <p className="text-[14.5px] text-white/90 leading-relaxed font-semibold">
                          {movie.aiInsight || movie.overview}
                        </p>
                        <p className="text-[10.5px] text-muted/40 font-mono">
                          Computed & normalized on device database.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* ── YouTube Trailer Modal ── */}
      <AnimatePresence>
        {showTrailer && movie.trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
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
