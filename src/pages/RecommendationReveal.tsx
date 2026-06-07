import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Star, Clock, Bookmark, Play, RotateCcw, Sparkles, CheckCircle2, ExternalLink, Heart, ChevronRight } from 'lucide-react';
import { getMovieById, MOVIES } from '../lib/mockData';
import { OTTBadge, OTTBadgeList } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* Typewriter Effect */
const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 12 }) => {
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

/* Alternative mini card */
const AlternativeCard: React.FC<{ movie: NonNullable<ReturnType<typeof getMovieById>>; delay: number }> = ({ movie, delay }) => {
  const [imgErr, setImgErr] = React.useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/movie/${movie.id}`}>
        <motion.div
          whileHover={{ y: -3, scale: 1.02 }}
          transition={{ duration: 0.25 }}
          className="group flex gap-3 p-3 rounded-2xl border border-white/[0.07] bg-white/[0.03]
                     hover:bg-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
        >
          {/* Poster */}
          <div className="w-12 flex-shrink-0 rounded-xl overflow-hidden" style={{ aspectRatio: '2/3' }}>
            <img
              src={imgErr ? FALLBACK_POSTER : movie.posterPath}
              alt={movie.title}
              className="w-full h-full object-cover"
              onError={() => setImgErr(true)}
            />
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-white/85 truncate group-hover:text-white transition-colors">
              {movie.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5 mb-1.5">
              <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
              <span className="text-[10px] text-white/60">{movie.rating.toFixed(1)}</span>
              <span className="text-[10px] text-white/30">·</span>
              <span className="text-[10px] text-white/50 capitalize">{movie.genres[0]}</span>
            </div>
            <OTTBadgeList providers={movie.providers} size="xs" max={2} />
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors flex-shrink-0 self-center" />
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
  let movie = null;
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

  // Generate 3 alternative picks (different genres or similar)
  const alternatives = React.useMemo(() => {
    if (!movie) return [];
    return MOVIES
      .filter(m => m.id !== movie.id)
      .filter(m => m.genres.some(g => movie.genres.includes(g)) || m.rating >= 7.5)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [movie?.id]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#080808] flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Something went wrong. No recommendation found.</p>
          <Link to="/discover" className="btn-primary">Try Again</Link>
        </div>
      </div>
    );
  }

  const runtimeStr = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

  const handleSave = () => {
    if (saved) {
      removeFromWatchlist(movie!.id);
      showToast('Removed from watchlist', 'info');
    } else {
      addToWatchlist(movie!);
      showToast('Saved to watchlist!', 'success');
    }
  };

  const handleFavorite = () => {
    if (favorited) {
      removeFromFavorites(movie!.id);
    } else {
      addToFavorites(movie!);
      showToast('Added to favorites ♥', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">

      {/* Full bleed backdrop — dramatic entrance */}
      <motion.div
        initial={{ opacity: 0, scale: 1.12 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-0"
      >
        <img
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={() => setBgErr(true)}
        />
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.82)] to-[rgba(8,8,8,0.35)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[rgba(8,8,8,0.6)] to-transparent" />
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.2)]" />
      </motion.div>

      {/* Ambient purple glow from bottom */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
           style={{ background: 'radial-gradient(ellipse, rgba(139,92,246,0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

      {/* Back navigation */}
      <div className="relative z-20 pt-8 px-6 lg:px-10">
        <motion.button
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-white transition-colors duration-150 group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Discover
        </motion.button>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex flex-col justify-end pb-12 pt-16">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start"
          >

            {/* Poster — 3D tilt on hover */}
            <motion.div
              initial={{ opacity: 0, y: 50, rotateY: -18, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, rotateY: 0, scale: 1 }}
              whileHover={{ rotateY: 10, rotateX: -5, scale: 1.04 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
              style={{ perspective: 1000 }}
              className="hidden lg:block cursor-pointer"
            >
              <div className="w-56 rounded-[22px] overflow-hidden ring-1 ring-white/[0.08]"
                   style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.06)' }}>
                <img
                  src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                  alt={movie.title}
                  className="w-full aspect-poster object-cover"
                  onError={() => setPosterErr(true)}
                />
              </div>
              {/* Shadow cast under poster */}
              <div className="mt-4 mx-4 h-6 bg-black/40 rounded-full blur-xl" />
            </motion.div>

            {/* Info */}
            <div>
              {/* AI label */}
              <motion.div variants={item}>
                <motion.div
                  animate={{ boxShadow: ['0 0 0 rgba(139,92,246,0)', '0 0 20px rgba(139,92,246,0.3)', '0 0 0 rgba(139,92,246,0)'] }}
                  transition={{ duration: 2.5, repeat: Infinity }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/12 border border-accent/30 mb-5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-accent-light animate-spin-slow" />
                  <span className="text-[11px] font-bold text-accent-light uppercase tracking-wider">
                    Your AI Recommendation
                  </span>
                </motion.div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl lg:text-[58px] font-black text-white tracking-[-0.03em] leading-[1.02] mb-4"
              >
                {movie.title}
              </motion.h1>

              {/* Meta row */}
              <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="text-[13px] text-white/55">{movie.year}</span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <span className="text-[13px] text-white/55 capitalize">
                  {movie.type === 'tv' ? 'TV Show' : movie.type === 'anime' ? 'Anime' : 'Film'}
                </span>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="w-1 h-1 bg-white/20 rounded-full" />
                <div className="flex items-center gap-1 text-white/55">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[13px]">{runtimeStr}</span>
                </div>
                {movie.isFree && (
                  <>
                    <span className="w-1 h-1 bg-white/20 rounded-full" />
                    <span className="text-[11px] font-bold text-accent-light bg-accent/15 border border-accent/30 px-2 py-0.5 rounded-md">
                      FREE
                    </span>
                  </>
                )}
              </motion.div>

              {/* Genres */}
              <motion.div variants={item} className="flex flex-wrap gap-2 mb-7">
                {movie.genres.map(g => (
                  <span key={g}
                    className="px-3 py-1 rounded-full text-[12px] font-medium capitalize
                               bg-white/[0.06] border border-white/[0.08] text-white/65">
                    {g}
                  </span>
                ))}
              </motion.div>

              {/* AI Insight card — typewriter */}
              <motion.div variants={item} className="mb-7">
                <div className="rounded-2xl border border-white/[0.08] overflow-hidden"
                     style={{ background: 'rgba(12,8,24,0.8)', backdropFilter: 'blur(24px)' }}>
                  <div className="flex items-start gap-4 p-5">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="w-10 h-10 bg-accent/15 rounded-xl border border-accent/25 flex items-center justify-center flex-shrink-0 mt-0.5"
                    >
                      <Sparkles className="w-4.5 h-4.5 text-accent-light" />
                    </motion.div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-accent/70 uppercase tracking-widest mb-2">
                        Why we picked this for you
                      </p>
                      <p className="text-[14px] text-white/85 leading-relaxed min-h-[60px]">
                        <TypewriterText text={aiExplanation || movie.aiInsight || movie.overview} speed={10} />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Streaming providers */}
              <motion.div variants={item} className="mb-7">
                <p className="text-[11px] font-bold text-muted/50 uppercase tracking-widest mb-3">
                  Available on
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {movie.providers.map((p, i) => (
                    <motion.div
                      key={p}
                      initial={{ opacity: 0, scale: 0.7, y: 8 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 1.2 + i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                    >
                      <OTTBadge provider={p} size="lg" showLabel />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={item} className="flex flex-wrap gap-3 mb-10">
                <Link to={`/movie/${movie.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 text-white font-bold px-7 py-3.5 rounded-xl cursor-pointer select-none"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                      boxShadow: '0 8px 32px rgba(139,92,246,0.5)',
                    }}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    View Details
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </motion.div>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleSave}
                  className={`inline-flex items-center gap-2.5 font-semibold px-6 py-3.5 rounded-xl border transition-all duration-200 ${
                    saved
                      ? 'bg-accent/12 border-accent/40 text-accent-light'
                      : 'bg-white/[0.06] border-white/[0.12] text-white hover:bg-white/[0.09]'
                  }`}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? 'Saved' : 'Save'}
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleFavorite}
                  className={`inline-flex items-center gap-2 font-semibold px-5 py-3.5 rounded-xl border transition-all duration-200 ${
                    favorited
                      ? 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                      : 'bg-white/[0.06] border-white/[0.12] text-white hover:bg-white/[0.09]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-400' : ''}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/discover')}
                  className="inline-flex items-center gap-2 text-muted hover:text-white
                             font-medium px-5 py-3.5 rounded-xl hover:bg-white/[0.05] transition-all duration-150"
                >
                  <RotateCcw className="w-4 h-4" />
                  Try Another
                </motion.button>
              </motion.div>
            </div>
          </motion.div>

          {/* ─── WHY NOT THESE? — Alternative picks ─── */}
          {alternatives.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 max-w-3xl"
            >
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-7 h-7 bg-white/[0.06] rounded-lg border border-white/[0.08] flex items-center justify-center">
                  <span className="text-[12px]">🤔</span>
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white">Why not these?</h3>
                  <p className="text-[11px] text-muted/60">Alternatives we considered for you</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {alternatives.map((alt, i) => (
                  <AlternativeCard key={alt.id} movie={alt} delay={1.8 + i * 0.1} />
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
