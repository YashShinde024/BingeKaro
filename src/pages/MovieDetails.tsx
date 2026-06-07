import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Play, Bookmark, CheckCircle2, Sparkles, ChevronLeft, ExternalLink, Share2, Copy, MessageCircle } from 'lucide-react';
import { getMovieById, MOVIES } from '../lib/mockData';
import { OTTBadge } from '../components/badges/OTTBadge';
import { MovieCard } from '../components/cards/MovieCard';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
};
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

export const MovieDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-black text-white mb-3">Scene not found</p>
          <Link to="/" className="text-muted hover:text-white transition-colors text-sm">← Back home</Link>
        </div>
      </div>
    );
  }

  const TABS = [
    { id: 'overview', label: 'Overview' },
    { id: 'cast', label: 'Cast' },
    { id: 'similar', label: 'Similar' },
    { id: 'ai', label: 'AI Insights' },
  ] as const;

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ── Hero backdrop ── */}
      <div className="relative h-[72vh] min-h-[480px] overflow-hidden">
        <motion.img
          initial={{ scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={() => setBgErr(true)}
        />
        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.4)] to-[rgba(8,8,8,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.3)] to-transparent" />

        {/* Back button */}
        <div className="absolute top-20 left-6 lg:left-10 z-10">
          <motion.button
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 glass px-4 py-2 rounded-xl text-[13px] text-white/80
                       hover:text-white border-white/[0.07] hover:border-white/15 transition-all duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </motion.button>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 -mt-52 relative z-10 pb-24 md:pb-12">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[200px_1fr] gap-8 lg:gap-12"
        >

          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-start"
          >
            <div className="w-40 lg:w-full rounded-[18px] overflow-hidden ring-1 ring-white/10"
                 style={{ boxShadow: 'var(--shadow-poster)' }}>
              <img
                src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                alt={movie.title}
                className="w-full aspect-poster object-cover"
                onError={() => setPosterErr(true)}
              />
            </div>
          </motion.div>

          {/* Details */}
          <motion.div variants={stagger} initial="hidden" animate="show">

            {/* Title */}
            <motion.div variants={fadeUp}>
              {movie.tagline && (
                <p className="text-[13px] text-white/40 italic mb-2">"{movie.tagline}"</p>
              )}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-[-0.025em] leading-[1.05] mb-4">
                {movie.title}
              </h1>
            </motion.div>

            {/* Meta */}
            <motion.div variants={fadeUp} className="flex flex-wrap items-center gap-2.5 mb-5">
              <span className="text-[13px] text-white/60">{movie.year}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-[13px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                <span className="text-[12px] text-white/40">({(movie.voteCount / 1000).toFixed(0)}K)</span>
              </div>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <div className="flex items-center gap-1 text-white/60">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-[13px]">{runtimeStr}</span>
              </div>
              <span className="w-1 h-1 bg-white/20 rounded-full" />
              <span className="text-[13px] text-white/60 capitalize font-medium">{movie.language}</span>
              {movie.isFree && (
                <>
                  <span className="w-1 h-1 bg-white/20 rounded-full" />
                  <span className="text-[11px] font-bold text-accent-light bg-accent/12 border border-accent/30 px-2 py-0.5 rounded-md">
                    FREE
                  </span>
                </>
              )}
            </motion.div>

            {/* Genre chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-6">
              {movie.genres.map(g => (
                <span key={g}
                  className="px-3 py-1 rounded-full text-[12px] font-medium capitalize
                             bg-white/[0.06] border border-white/[0.08] text-white/65">
                  {g}
                </span>
              ))}
            </motion.div>

            {/* Streaming section */}
            <motion.div variants={fadeUp} className="mb-6">
              <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest mb-3">Stream on</p>
              <div className="flex items-center gap-4 flex-wrap">
                {movie.providers.map(p => (
                  <OTTBadge key={p} provider={p} size="md" showLabel />
                ))}
              </div>
            </motion.div>

            {/* Actions */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
              {movie.trailerKey ? (
                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowTrailer(true)}
                  className="inline-flex items-center gap-2.5 text-white font-bold
                             px-6 py-3.5 rounded-xl cursor-pointer select-none"
                  style={{
                    background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                    boxShadow: '0 6px 24px rgba(139,92,246,0.4)',
                  }}
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </motion.button>
              ) : null}

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => saved ? removeFromWatchlist(movie.id) : addToWatchlist(movie)}
                className={`inline-flex items-center gap-2.5 font-semibold px-6 py-3.5 rounded-xl border transition-all duration-200 ${
                  saved
                    ? 'bg-accent/12 border-accent/40 text-accent-light'
                    : 'bg-white/[0.05] border-white/[0.1] text-white hover:bg-white/[0.08]'
                }`}
              >
                {saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                {saved ? 'Saved' : 'Add to Watchlist'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowShare(true)}
                className="inline-flex items-center justify-center w-12 rounded-xl border border-white/[0.1] bg-white/[0.05] text-white hover:bg-white/[0.08] transition-colors"
                title="Share Movie"
              >
                <Share2 className="w-4.5 h-4.5" />
              </motion.button>
            </motion.div>

            {/* ── Tabs ── */}
            <motion.div variants={fadeUp}>
              <div className="flex gap-0 border-b border-white/[0.07] mb-6">
                {TABS.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`relative px-5 py-2.5 text-[13px] font-semibold transition-colors duration-150 ${
                      activeTab === tab.id ? 'text-white' : 'text-muted hover:text-white/80'
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="detail-tab"
                        className="absolute bottom-0 inset-x-0 h-[2px] bg-accent rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'overview' && (
                  <div className="max-w-xl">
                    {movie.director && (
                      <p className="text-[13px] text-muted mb-3">
                        Directed by <span className="text-white font-semibold">{movie.director}</span>
                      </p>
                    )}
                    <p className="text-[14px] text-white/75 leading-[1.75]">{movie.overview}</p>
                  </div>
                )}

                {activeTab === 'cast' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {movie.cast && movie.cast.length > 0 ? movie.cast.map(member => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.07] hover:bg-white/[0.06] transition-colors group"
                      >
                        <div className="w-11 h-11 rounded-full bg-[#1a1a1a] border border-white/10 flex-shrink-0 overflow-hidden">
                          {member.profilePath ? (
                            <img src={member.profilePath} alt={member.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted text-sm font-bold">
                              {member.name[0]}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold text-white truncate">{member.name}</p>
                          <p className="text-[12px] text-muted truncate">{member.character}</p>
                        </div>
                      </motion.div>
                    )) : (
                      <p className="text-muted text-[14px]">Cast information not available.</p>
                    )}
                  </div>
                )}

                {activeTab === 'similar' && (
                  <div className="flex gap-4 scroll-row pb-2 -mx-6 px-6">
                    {similar.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
                  </div>
                )}

                {activeTab === 'ai' && (
                  <div className="max-w-xl">
                    <div className="rounded-2xl p-5 border border-accent/20"
                         style={{ background: 'rgba(15,10,30,0.6)', backdropFilter: 'blur(16px)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-accent/15 rounded-xl border border-accent/25 flex items-center justify-center flex-shrink-0">
                          <Sparkles className="w-4 h-4 text-accent-light" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-accent/70 uppercase tracking-widest mb-2">
                            KyaDekhu AI Analysis
                          </p>
                          <p className="text-[14px] text-white/85 leading-relaxed">
                            {movie.aiInsight || movie.overview}
                          </p>
                          <p className="text-[11px] text-muted/40 mt-3 font-mono">
                            Powered by Groq · {new Date().toLocaleDateString('en-IN')}
                          </p>
                        </div>
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
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border border-white/10 bg-black shadow-[0_0_50px_rgba(139,92,246,0.3)]"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowTrailer(false)}
                className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white transition-colors font-bold"
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

      {/* ── Share Modal Drawer ── */}
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
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="w-full max-w-md bg-[#111] border border-white/[0.08] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl relative"
              onClick={e => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowShare(false)}
                className="absolute top-4 right-4 text-muted hover:text-white transition-colors text-sm"
              >
                ✕
              </button>
              <h3 className="text-[16px] font-bold text-white mb-2">Share Movie</h3>
              <p className="text-[13px] text-muted mb-5">Share "{movie.title}" with friends or on social media.</p>

              {/* Copy URL Input */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  readOnly
                  value={window.location.href}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-[12px] text-muted outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2.5 bg-accent hover:bg-accent-dark text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`https://twitter.com/intent/tweet?text=Check out ${movie.title} on KyaDekhu! ${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-[#1DA1F2]/10 border border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20 text-[#1DA1F2] rounded-xl text-[13px] font-semibold transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  Twitter / X
                </a>
                <a
                  href={`https://api.whatsapp.com/send?text=Check out ${movie.title} on KyaDekhu! ${window.location.href}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 p-3 bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 text-[#25D366] rounded-xl text-[13px] font-semibold transition-colors"
                >
                  <MessageCircle className="w-4 h-4 fill-current" />
                  WhatsApp
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
