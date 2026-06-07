import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Sparkles, TrendingUp, ChevronRight, Play, Star, ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MovieCard } from '../components/cards/MovieCard';
import {
  getTrendingMovies, getTopRatedMovies, getFreeMovies,
  getAIPicks, getBollywoodMovies, getHollywoodMovies, getHiddenGems, MOVIES
} from '../lib/mockData';
import { MOODS } from '../lib/mockData';
import { OTTBadgeList } from '../components/badges/OTTBadge';
import { useHistory } from '../context/HistoryContext';

/* ─── Hero movies for rotation ─── */
const HERO_MOVIES = [MOVIES[0], MOVIES[2], MOVIES[4], MOVIES[7], MOVIES[9]].filter(Boolean);
const TONIGHT = MOVIES[5]; // 12th Fail

/* ─── Fallback ─── */
const FALLBACK_BG = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';

/* ─── Mood icons ─── */
const MOOD_EMOJI: Record<string, string> = {
  adventurous: '⛰', romantic: '♥', thrilling: '⚡', funny: '☺',
  dark: '◑', 'feel-good': '☀', emotional: '◎', inspiring: '✦',
  chill: '◻', scary: '◈', 'mind-bending': '◉', 'action-packed': '▶',
};

/* ─── Section wrapper ─── */
interface SectionProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  children: React.ReactNode;
  viewAllTo?: string;
}

const Section: React.FC<SectionProps> = ({ title, subtitle, badge, children, viewAllTo }) => (
  <motion.section 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    className="mb-14"
  >
    <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
      <div className="flex items-center gap-3">
        {badge}
        <div>
          <h2 className="text-[17px] font-bold text-white tracking-[-0.01em]">{title}</h2>
          {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo}>
          <motion.div
            whileHover={{ x: 2 }}
            className="flex items-center gap-1 text-[12px] text-muted hover:text-white transition-colors duration-150 group"
          >
            See all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </Link>
      )}
    </div>
    <div className="flex gap-4 scroll-row px-6 lg:px-10 pb-2 fade-edges-sm">
      {children}
    </div>
  </motion.section>
);

/* ─── Floating ambient particle ─── */
const Particle: React.FC<{ delay: number; x: number; y: number; size: number }> = ({ delay, x, y, size }) => (
  <motion.div
    className="absolute rounded-full bg-accent/20 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{
      y: [0, -20, 0],
      opacity: [0, 0.6, 0],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 4 + delay,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    }}
  />
);

export const Home: React.FC = () => {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const [heroIndex, setHeroIndex] = React.useState(0);
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});
  const [tonightImgError, setTonightImgError] = React.useState(false);

  const { continueWatching } = useHistory();

  const trending = getTrendingMovies();
  const topRated = getTopRatedMovies();
  const free = getFreeMovies();
  const aiPicks = getAIPicks();
  const bollywood = getBollywoodMovies();
  const hollywood = getHollywoodMovies();
  const hidden = getHiddenGems();

  // Rotate hero every 8 seconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setHeroIndex(i => (i + 1) % HERO_MOVIES.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const HERO = HERO_MOVIES[heroIndex];
  const heroImgSrc = imgErrors[HERO?.id] ? FALLBACK_BG : HERO?.backdropPath;

  const particles = React.useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i,
      delay: i * 0.4,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.floor(Math.random() * 4),
    })), []
  );

  if (!HERO) return null;

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ══════════════════════════════════════
          HERO — Rotating Cinematic Backdrop
      ══════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-[100svh] min-h-[600px] overflow-hidden">

        {/* Rotating backdrop — crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            className="absolute inset-0"
            style={{ y: heroY }}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1.02 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={heroImgSrc}
              alt={HERO.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(p => ({ ...p, [HERO.id]: true }))}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.55)] to-[rgba(8,8,8,0.15)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.85)] via-[rgba(8,8,8,0.4)] to-transparent" />
        <div className="absolute inset-0 overlay-vignette" />

        {/* Aurora ambient glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="aurora-orb aurora-orb-1" style={{ left: '-10%', bottom: '-20%' }} />
          <div className="aurora-orb aurora-orb-2" style={{ left: '30%', top: '-10%' }} />
          <div className="aurora-orb aurora-orb-3" style={{ right: '-5%', top: '30%' }} />
        </div>

        {/* Floating particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map(p => <Particle key={p.id} {...p} />)}
        </div>

        {/* Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-2xl"
              >
                {/* AI badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25
                             bg-accent/10 backdrop-blur-sm mb-6"
                >
                  <Sparkles className="w-3 h-3 text-accent-light animate-spin-slow" />
                  <span className="text-[11px] font-semibold text-accent-light uppercase tracking-wider">
                    AI-Powered Discovery
                  </span>
                </motion.div>

                {/* Headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[62px] font-black text-white leading-[1.05] mb-5 tracking-[-0.025em]">
                  What should you<br />
                  <span className="text-gradient-accent animate-text-glow">watch tonight?</span>
                </h1>

                <p className="text-[16px] sm:text-[18px] text-white/60 mb-8 max-w-[480px] leading-relaxed font-light">
                  AI recommendations with real-time streaming availability across every OTT platform.
                </p>

                {/* CTAs */}
                <div className="flex flex-wrap items-center gap-3">
                  <Link to="/discover">
                    <motion.div
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className="btn-cta-pulse inline-flex items-center gap-2.5 bg-accent text-white font-bold
                                 px-7 py-3.5 rounded-xl cursor-pointer select-none relative overflow-hidden"
                      style={{ boxShadow: '0 8px 40px rgba(139,92,246,0.5), 0 0 0 1px rgba(139,92,246,0.3)' }}
                    >
                      {/* Shimmer sweep on button */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full"
                        animate={{ x: ['−100%', '200%'] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: 'easeInOut' }}
                      />
                      <Sparkles className="w-4 h-4 relative z-10" />
                      <span className="relative z-10">Find My Pick</span>
                    </motion.div>
                  </Link>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
                    className="inline-flex items-center gap-2.5 text-white/80 font-semibold
                               px-6 py-3.5 rounded-xl border border-white/15 backdrop-blur-sm
                               hover:border-white/25 hover:bg-white/[0.07] transition-all duration-200 select-none"
                  >
                    <TrendingUp className="w-4 h-4" />
                    Browse Trending
                  </motion.button>
                </div>

                {/* Now showing pill */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="mt-8 inline-flex items-center gap-2 text-[12px] text-white/40"
                >
                  <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                  Now featuring: <span className="text-white/60 font-medium">{HERO.title}</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Hero dot indicators */}
            <div className="absolute bottom-8 right-6 lg:right-10 flex items-center gap-2">
              {HERO_MOVIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`transition-all duration-300 rounded-full ${
                    i === heroIndex
                      ? 'w-6 h-1.5 bg-accent'
                      : 'w-1.5 h-1.5 bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            {/* Featured card - desktop */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-16 sm:bottom-20 right-6 lg:right-10 hidden lg:block"
            >
              <Link to={`/movie/${HERO.id}`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -3 }}
                  className="glass-card rounded-2xl p-4 w-[280px] cursor-pointer border border-white/[0.09]"
                  style={{ boxShadow: '0 16px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/25 flex-shrink-0">
                      <Play className="w-4 h-4 text-accent-light fill-accent-light ml-0.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted uppercase tracking-widest font-semibold">Featured Now</p>
                      <p className="text-[13px] font-semibold text-white leading-tight mt-0.5 line-clamp-1">{HERO.title}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-[12px] text-white font-medium">{HERO.rating.toFixed(1)}</span>
                      <span className="text-[12px] text-muted">· {HERO.year}</span>
                    </div>
                    <OTTBadgeList providers={HERO.providers} size="sm" max={2} />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-white/30 to-transparent rounded-full"
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          MOOD ROW
      ══════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[17px] font-bold text-white">What are you in the mood for?</h2>
          <Link to="/discover" className="text-[12px] text-accent-light hover:text-white transition-colors duration-150 flex items-center gap-1">
            Full Discover <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.slice(0, 8).map((mood, i) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.035, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link to={`/discover?mood=${mood.id}`}>
                <motion.div
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  className="chip hover:chip"
                >
                  <span className="text-[14px] font-mono leading-none">{MOOD_EMOJI[mood.id]}</span>
                  <span>{mood.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          TONIGHT'S PICK — Feature card
      ══════════════════════════════════════ */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-14">
        <Link to={`/movie/${TONIGHT.id}`}>
          <motion.div
            whileHover={{ scale: 1.004 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            {/* Backdrop */}
            <div className="relative h-52 sm:h-72">
              <img
                src={tonightImgError ? FALLBACK_BG : TONIGHT.backdropPath}
                alt={TONIGHT.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                onError={() => setTonightImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.97)] via-[rgba(8,8,8,0.65)] to-[rgba(8,8,8,0.25)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.85)] to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-end p-6 sm:p-8">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-lg mb-3">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-bold text-white uppercase tracking-wider">AI Pick · Tonight</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-2 tracking-[-0.02em]">
                  {TONIGHT.title}
                </h3>
                <p className="text-[13px] text-white/60 line-clamp-2 mb-4 max-w-md">
                  {TONIGHT.aiInsight}
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[13px] font-bold text-white">{TONIGHT.rating.toFixed(1)}</span>
                  </div>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <span className="text-[13px] text-white/50">{TONIGHT.year}</span>
                  <span className="w-1 h-1 bg-white/30 rounded-full" />
                  <OTTBadgeList providers={TONIGHT.providers} size="sm" max={2} />
                </div>
              </div>
            </div>

            {/* Right side arrow */}
            <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
              <motion.div
                whileHover={{ scale: 1.12, rotate: 15 }}
                className="w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm border border-white/20
                           flex items-center justify-center"
              >
                <ArrowRight className="w-4 h-4 text-white" />
              </motion.div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* ══════════════════════════════════════
          CONTENT SECTIONS
      ══════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto" id="trending-section">

        {/* Continue Watching Row (dynamically populated) */}
        {continueWatching && continueWatching.length > 0 && (
          <Section
            title="Continue Watching"
            subtitle="Pick up where you left off"
            badge={<Clock className="w-4 h-4 text-accent-light" />}
          >
            {continueWatching.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
          </Section>
        )}

        <Section
          title="Trending Across OTT"
          subtitle="What India is watching right now"
          badge={<TrendingUp className="w-4 h-4 text-accent" />}
          viewAllTo="/discover"
        >
          {trending.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        <Section
          title="Available Free"
          subtitle="No subscription required"
          badge={
            <span className="text-[10px] font-black text-white bg-accent px-2 py-0.5 rounded-md uppercase tracking-wide">
              FREE
            </span>
          }
          viewAllTo="/discover"
        >
          {free.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* AI Picks — full width dark banner */}
        <section className="mb-14 px-6 lg:px-10">
          <div className="relative rounded-3xl overflow-hidden bg-[#0d0a1a] border border-accent/15"
               style={{ boxShadow: '0 0 80px rgba(139,92,246,0.08)' }}>
            <div className="absolute inset-0 bg-gradient-radial from-accent/8 via-transparent to-transparent" />
            {/* Ambient glow orbs inside the panel */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-violet-500/5 rounded-full blur-2xl" />
            <div className="relative p-8 sm:p-10">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30"
                >
                  <Sparkles className="w-4 h-4 text-accent-light" />
                </motion.div>
                <div>
                  <h2 className="text-[17px] font-bold text-white">AI Picks For You</h2>
                  <p className="text-[12px] text-muted">Curated by Groq intelligence</p>
                </div>
              </div>
              <div className="flex gap-4 scroll-row pb-2 fade-edges-sm">
                {aiPicks.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
            </div>
          </div>
        </section>

        <Section title="Top Rated" subtitle="Highest rated across all OTT" viewAllTo="/discover">
          {topRated.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* Bollywood + Hollywood — 2 col on desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-14 px-6 lg:px-10">
          {[
            { title: 'Bollywood Spotlight', movies: bollywood },
            { title: 'Hollywood Spotlight', movies: hollywood },
          ].map(({ title, movies }) => (
            <div key={title}>
              <h2 className="text-[17px] font-bold text-white mb-5">{title}</h2>
              <div className="flex gap-4 scroll-row pb-2 fade-edges-sm">
                {movies.slice(0, 6).map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
            </div>
          ))}
        </div>

        <Section
          title="Hidden Gems"
          subtitle="Criminally underrated masterpieces"
          badge={
            <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-md uppercase tracking-wide">
              GEM
            </span>
          }
          viewAllTo="/discover"
        >
          {hidden.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>
      </div>
    </div>
  );
};
