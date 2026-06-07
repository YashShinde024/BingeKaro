import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Star, Clock, Bookmark, Play, RotateCcw, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';
import { getMovieById } from '../lib/mockData';
import { OTTBadge } from '../components/badges/OTTBadge';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';

const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&q=80';

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.5 } },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } },
};

/* Typewriter Effect Component */
const TypewriterText: React.FC<{ text: string; speed?: number }> = ({ text, speed = 15 }) => {
  const [displayText, setDisplayText] = React.useState('');

  React.useEffect(() => {
    let index = 0;
    setDisplayText('');
    if (!text) return;
    
    const timer = setInterval(() => {
      setDisplayText((prev) => prev + text.charAt(index));
      index++;
      if (index >= text.length) {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);

  return <span>{displayText}</span>;
};

export const RecommendationReveal: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToWatchlist, removeFromWatchlist, inWatchlist } = useWatchlist();
  const { addToRecommendationHistory } = useHistory();
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
  } catch (error) {}

  const saved = movie ? inWatchlist(movie.id) : false;

  React.useEffect(() => {
    if (movie) {
      addToRecommendationHistory(movie, aiExplanation || movie.aiInsight || movie.overview);
    }
  }, [movie, aiExplanation]);

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

  return (
    <div className="min-h-screen bg-[#080808] relative overflow-hidden">

      {/* Full bleed backdrop */}
      <motion.div
        initial={{ opacity: 0, scale: 1.08 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="fixed inset-0 z-0"
      >
        <img
          src={bgErr ? FALLBACK_BACKDROP : movie.backdropPath}
          alt={movie.title}
          className="w-full h-full object-cover"
          onError={() => setBgErr(true)}
        />
        {/* Multi-layer cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.75)] to-[rgba(8,8,8,0.3)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[rgba(8,8,8,0.5)] to-transparent" />
        <div className="absolute inset-0 bg-[rgba(8,8,8,0.25)]" />
      </motion.div>

      {/* Back navigation */}
      <div className="relative z-20 pt-8 px-6 lg:px-10">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-[13px] text-muted hover:text-white transition-colors duration-150 group"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:-translate-x-0.5 transition-transform">
            <path d="M10 4L6 8l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to Discover
        </button>
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-end pb-12 pt-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 lg:gap-16 items-start"
          >

            {/* Poster — 3D Rotator on hover */}
            <motion.div
              initial={{ opacity: 0, y: 40, rotateY: -15, rotateX: 5 }}
              animate={{ opacity: 1, y: 0, rotateY: 0, rotateX: 0 }}
              whileHover={{ rotateY: 12, rotateX: -4, scale: 1.04 }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              style={{ perspective: 1000 }}
              className="hidden lg:block cursor-pointer"
            >
              <div className="w-52 rounded-[20px] overflow-hidden ring-1 ring-white/10"
                   style={{ boxShadow: 'var(--shadow-poster)' }}>
                <img
                  src={posterErr ? FALLBACK_POSTER : movie.posterPath}
                  alt={movie.title}
                  className="w-full aspect-poster object-cover"
                  onError={() => setPosterErr(true)}
                />
              </div>
            </motion.div>

            {/* Info */}
            <div>
              {/* AI label */}
              <motion.div variants={item}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/12 border border-accent/30 mb-5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-light" />
                  <span className="text-[11px] font-bold text-accent-light uppercase tracking-wider">
                    Your AI Recommendation
                  </span>
                </div>
              </motion.div>

              {/* Title */}
              <motion.h1
                variants={item}
                className="text-4xl sm:text-5xl lg:text-[60px] font-black text-white tracking-[-0.03em] leading-[1.02] mb-4"
              >
                {movie.title}
              </motion.h1>

              {/* Meta row */}
              <motion.div variants={item} className="flex flex-wrap items-center gap-2.5 mb-5">
                <span className="text-[13px] text-white/60">{movie.year}</span>
                <span className="w-1 h-1 bg-white/25 rounded-full" />
                <span className="text-[13px] text-white/60 capitalize">
                  {movie.type === 'tv' ? 'TV Show' : movie.type === 'anime' ? 'Anime' : 'Film'}
                </span>
                <span className="w-1 h-1 bg-white/25 rounded-full" />
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-[13px] font-bold text-white">{movie.rating.toFixed(1)}</span>
                </div>
                <span className="w-1 h-1 bg-white/25 rounded-full" />
                <div className="flex items-center gap-1 text-white/60">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[13px]">{runtimeStr}</span>
                </div>
                {movie.isFree && (
                  <>
                    <span className="w-1 h-1 bg-white/25 rounded-full" />
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
                               bg-white/[0.07] border border-white/[0.09] text-white/70">
                    {g}
                  </span>
                ))}
              </motion.div>

              {/* AI Insight card */}
              <motion.div variants={item} className="mb-7">
                <div className="rounded-2xl border border-white/[0.09] overflow-hidden"
                     style={{ background: 'rgba(15,10,30,0.7)', backdropFilter: 'blur(20px)' }}>
                  <div className="flex items-start gap-4 p-5">
                    <div className="w-9 h-9 bg-accent/15 rounded-xl border border-accent/25 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4 text-accent-light" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-accent/70 uppercase tracking-widest mb-2">
                        Why we picked this for you
                      </p>
                      <p className="text-[14px] text-white/85 leading-relaxed min-h-[48px]">
                        <TypewriterText text={aiExplanation || movie.aiInsight || movie.overview} speed={12} />
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Streaming */}
              <motion.div variants={item} className="mb-8">
                <p className="text-[11px] font-bold text-muted/60 uppercase tracking-widest mb-3">
                  Available on
                </p>
                <div className="flex items-center gap-4 flex-wrap">
                  {movie.providers.map(p => (
                    <OTTBadge key={p} provider={p} size="lg" showLabel />
                  ))}
                </div>
              </motion.div>

              {/* Actions */}
              <motion.div variants={item} className="flex flex-wrap gap-3">
                <Link to={`/movie/${movie.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2.5 text-white font-bold
                               px-7 py-3.5 rounded-xl cursor-pointer select-none"
                    style={{
                      background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
                      boxShadow: '0 8px 32px rgba(139,92,246,0.45)',
                    }}
                  >
                    <Play className="w-4 h-4 fill-white" />
                    View Details
                    <ExternalLink className="w-3.5 h-3.5 opacity-60" />
                  </motion.div>
                </Link>

                <motion.button
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => saved ? removeFromWatchlist(movie!.id) : addToWatchlist(movie!)}
                  className={`inline-flex items-center gap-2.5 font-semibold px-6 py-3.5 rounded-xl border transition-all duration-200 ${
                    saved
                      ? 'bg-accent/12 border-accent/40 text-accent-light'
                      : 'bg-white/[0.06] border-white/[0.12] text-white hover:bg-white/[0.09]'
                  }`}
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
                  {saved ? 'Saved to Watchlist' : 'Save'}
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
        </div>
      </div>
    </div>
  );
};
