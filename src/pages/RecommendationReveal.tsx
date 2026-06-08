import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Star, Clock, Bookmark, Play, RotateCcw, Sparkles, CheckCircle2, Heart, Share2, Award, PiggyBank } from 'lucide-react';
import { getMovieById, MOVIES } from '../lib/mockData';
import { PROVIDER_REGISTRY } from '../lib/providers';
import { OTTBadge, OTTBadgeList } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import type { Movie, OTTProviderId } from '../types';

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
      <Link to={`/movie/${movie.id}`}>
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

export const RecommendationReveal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToWatchlist, removeFromWatchlist, inWatchlist, addToFavorites, inFavorites, removeFromFavorites } = useWatchlist();
  const { addToRecommendationHistory } = useHistory();
  const { showToast } = useToast();
  const [posterErr, setPosterErr] = React.useState(false);
  const [bgErr, setBgErr] = React.useState(false);

  const dataParam = searchParams.get('data');
  let movie: any = null;
  let aiExplanation = '';

  try {
    if (dataParam) {
      const parsed = JSON.parse(decodeURIComponent(dataParam));
      movie = getMovieById(parsed.movieId);
      aiExplanation = parsed.aiExplanation;
    }
  } catch (_) {}

  const saved = movie ? inWatchlist(movie.id) : false;
  const favorited = movie ? inFavorites(movie.id) : false;

  React.useEffect(() => {
    if (movie) {
      addToRecommendationHistory(movie, aiExplanation || movie.aiInsight || movie.overview);
    }
  }, [movie?.id]);

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
    
    // Sort logic: free > subscription > rent > buy
    const sorted = [...providerObjs].sort((a, b) => {
      const rank: Record<string, number> = { free: 1, subscription: 2, rent: 3, buy: 4 };
      return (rank[a.type] || 99) - (rank[b.type] || 99);
    });

    const best = sorted[0]; // Free or Subscription is always best
    const cheapest = sorted.find(p => p.type === 'free') || sorted.find(p => p.type === 'subscription') || sorted[sorted.length - 1];

    return {
      best,
      cheapest,
    };
  }, [movie?.id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">No recommendations compiled. Please re-run the discovery flow.</p>
          <Link to="/discover" className="btn-primary">Try Discover</Link>
        </div>
      </div>
    );
  }

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  const handleSave = () => {
    if (saved) {
      removeFromWatchlist(movie.id);
      showToast('Removed from watchlist', 'info');
    } else {
      addToWatchlist(movie);
      showToast('Saved to watchlist!', 'success');
    }
  };

  const handleFavorite = () => {
    if (favorited) {
      removeFromFavorites(movie.id);
      showToast('Removed from favorites', 'info');
    } else {
      addToFavorites(movie);
      showToast('Added to favorites ♥', 'success');
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(`${window.location.origin}/movie/${movie.id}`);
    showToast('Link copied to clipboard!', 'success');
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden pt-20 pb-24">
      {/* Background Poster/Backdrop */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.8, ease: 'easeOut' }}
        className="absolute inset-0 z-0 pointer-events-none"
      >
        <img
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt=""
          className="w-full h-full object-cover filter blur-[2px] brightness-[0.4]"
          onError={() => setBgErr(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent" />
      </motion.div>

      {/* Main Grid Wrapper */}
      <div className="relative z-10 max-w-[1280px] mx-auto px-6 lg:px-8 mt-6">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 lg:gap-14 items-start"
        >
          {/* LEFT: Massive Poster */}
          <motion.div 
            variants={item}
            className="hidden lg:block shrink-0"
          >
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="rounded-3xl overflow-hidden border border-white/[0.08] shadow-[0_30px_70px_rgba(0,0,0,0.85)] bg-[#121212] aspect-poster"
            >
              <img
                src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                alt={movie.title}
                className="w-full h-full object-cover"
                onError={() => setPosterErr(true)}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT: Detailed Information */}
          <div className="space-y-6">
            <motion.div variants={item} className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/15 border border-accent/30 text-[10px] font-bold text-accent-light tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                AI RECOMMENDATION FOR YOU
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
              {movie.title}
            </motion.h1>

            {/* Meta Row */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 text-white/60 text-[13px] font-medium">
              <span>{movie.year}</span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <span className="capitalize">{movie.type}</span>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-1 text-white font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {movie.rating.toFixed(1)}
              </div>
              <span className="w-1 h-1 bg-white/10 rounded-full" />
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 opacity-60" />
                {runtimeStr}
              </div>
            </motion.div>

            {/* Genres */}
            <motion.div variants={item} className="flex flex-wrap gap-1.5">
              {movie.genres.map((g: string) => (
                <span key={g} className="px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11.5px] text-white/85 font-medium capitalize">
                  {g}
                </span>
              ))}
            </motion.div>

            {/* Why This Movie? (AI Explanation) */}
            <motion.div variants={item} className="rounded-2xl border border-accent/20 bg-accent/[0.02] overflow-hidden p-5 shadow-[0_4px_30px_rgba(139,92,246,0.05)] relative">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4.5 h-4.5 text-accent-light" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold text-accent-light uppercase tracking-widest mb-1">
                    Why This Movie?
                  </p>
                  <p className="text-[14.5px] text-white/95 leading-relaxed font-medium min-h-[50px]">
                    <TypewriterText text={aiExplanation || movie.aiInsight || movie.overview} />
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Available On (Registry Cards) */}
            <motion.div variants={item} className="space-y-3">
              <p className="text-[10px] font-bold text-muted/40 uppercase tracking-widest">
                Available On
              </p>
              <div className="flex flex-wrap gap-2">
                {movie.providers.map((p: string) => (
                  <OTTBadge key={p} provider={p as OTTProviderId} size="sm" showLabel variant="badge" />
                ))}
              </div>
            </motion.div>

            {/* Best place / Cheapest Option Insights */}
            {providerAnalysis && (
              <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-muted/40 uppercase tracking-wider block">Best Place to Watch</span>
                    <span className="text-[13px] font-bold text-white">{providerAnalysis.best?.name || 'N/A'}</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shrink-0">
                    <PiggyBank className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <span className="text-[9.5px] font-bold text-muted/40 uppercase tracking-wider block">Cheapest Tier Available</span>
                    <span className="text-[13px] font-bold text-white capitalize">{providerAnalysis.cheapest?.name} ({providerAnalysis.cheapest?.type})</span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Main Action Bar */}
            <motion.div variants={item} className="flex flex-wrap items-center gap-3 pt-3">
              <Link to={`/movie/${movie.id}`}>
                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-accent to-accent-light text-[13px] font-bold text-white shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Details
                </motion.button>
              </Link>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`flex items-center gap-2 px-4.5 py-3.5 rounded-xl border text-[13px] font-bold transition-all ${
                  saved ? 'bg-accent/15 border-accent/40 text-accent-light' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                {saved ? <CheckCircle2 className="w-4.5 h-4.5" /> : <Bookmark className="w-4.5 h-4.5" />}
                {saved ? 'Saved to Watchlist' : 'Add to Watchlist'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleFavorite}
                className={`flex items-center justify-center w-12 py-3.5 rounded-xl border transition-all ${
                  favorited ? 'bg-rose-500/15 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                }`}
              >
                <Heart className={`w-4.5 h-4.5 ${favorited ? 'fill-rose-500' : ''}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleShare}
                className="flex items-center justify-center w-12 py-3.5 rounded-xl border bg-white/5 border-white/10 text-white hover:bg-white/10"
                title="Copy Link to Share"
              >
                <Share2 className="w-4.5 h-4.5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/discover')}
                className="flex items-center gap-1.5 px-4 py-3.5 rounded-xl text-muted hover:text-white transition-all text-[13px] font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Recommend Again
              </motion.button>
            </motion.div>
          </div>
        </motion.div>

        {/* Alternatives — "Why Not These?" */}
        {alternatives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-16 border-t border-white/[0.05] pt-12"
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="text-xl">💡</span>
              <div>
                <h3 className="text-[14px] font-bold text-white uppercase tracking-wider">Alternative Recommendations</h3>
                <p className="text-[11px] text-muted/50">Other movies that matched your taste map</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {alternatives.map((alt, i) => (
                <AlternativeCard key={alt.id} movie={alt} reason={getAlternativeReason(alt, movie!)} delay={1 + i * 0.08} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const getAlternativeReason = (alt: Movie, primary: Movie) => {
  if (alt.runtime < primary.runtime - 20) return "Shorter Watch Time";
  if (alt.rating > primary.rating) return "Higher Critic Rating";
  if (alt.isFree && !primary.isFree) return "Free Streaming Option";
  if (alt.year > primary.year) return "More Recent Release";
  return "Similar Mood & Style";
};
