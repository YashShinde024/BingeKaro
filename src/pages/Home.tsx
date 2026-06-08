import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Sparkles, TrendingUp, ChevronRight, Play, Star, ArrowRight, Clock,
  Flame, Gem, Film, Globe,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { MovieCard } from '../components/cards/MovieCard';
import {
  getTrendingMovies, getTopRatedMovies, getFreeMovies,
  getAIPicks, getBollywoodMovies, getHollywoodMovies, getHiddenGems, MOVIES,
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
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
    className="mb-14"
  >
    <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
      <div className="flex items-center gap-3">
        {badge && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            {badge}
          </motion.div>
        )}
        <div>
          <h2 className="text-[17px] font-bold text-white tracking-[-0.01em]">{title}</h2>
          {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {viewAllTo && (
        <Link to={viewAllTo}>
          <motion.div
            whileHover={{ x: 3 }}
            className="flex items-center gap-1 text-[12px] text-muted hover:text-white transition-colors duration-150 group"
          >
            See all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </motion.div>
        </Link>
      )}
    </div>
    <motion.div
      className="flex gap-4 scroll-row px-6 lg:px-10 pb-2 fade-edges-sm"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        visible: { transition: { staggerChildren: 0.05 } },
        hidden: {},
      }}
    >
      {children}
    </motion.div>
  </motion.section>
);

/* ─── Floating ambient particle ─── */
const Particle: React.FC<{ delay: number; x: number; y: number; size: number }> = ({ delay, x, y, size }) => (
  <motion.div
    className="absolute rounded-full bg-accent/20 pointer-events-none"
    style={{ left: `${x}%`, top: `${y}%`, width: size, height: size }}
    animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0], scale: [0.8, 1.2, 0.8] }}
    transition={{ duration: 4 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ─── Hero spotlight card — right side ─── */
const HeroSpotlightCard: React.FC<{ movie: typeof MOVIES[0]; index: number }> = ({ movie, index }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20, x: 10 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: -10, x: 10 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link to={`/movie/${movie.id}`}>
        <motion.div
          whileHover={{ scale: 1.025, y: -4 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass-card rounded-2xl overflow-hidden cursor-pointer"
          style={{
            width: 300,
            boxShadow: '0 20px 60px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.07), 0 0 30px rgba(139,92,246,0.08)',
          }}
        >
          {/* Poster strip */}
          <div className="relative h-[130px] w-full overflow-hidden">
            <img
              src={movie.backdropPath}
              alt={movie.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-[rgba(20,20,20,0.4)] to-transparent" />
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 text-[9px] font-black text-white uppercase tracking-widest bg-accent px-2 py-1 rounded-md">
                <Sparkles className="w-2.5 h-2.5" />
                Featured
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="p-4">
            <p className="text-[13px] font-bold text-white leading-tight line-clamp-1 mb-1">{movie.title}</p>
            <p className="text-[11px] text-muted line-clamp-2 leading-relaxed mb-3">{movie.aiInsight}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-[12px] text-white font-semibold">{movie.rating.toFixed(1)}</span>
                <span className="text-[11px] text-muted">· {movie.year}</span>
              </div>
              <OTTBadgeList providers={movie.providers} size="xs" max={2} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  </AnimatePresence>
);

/* ─── Stat pill ─── */
const StatPill: React.FC<{ icon: React.ReactNode; value: string; label: string }> = ({ icon, value, label }) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] backdrop-blur-sm"
  >
    <span className="text-accent-light">{icon}</span>
    <div>
      <p className="text-[12px] font-bold text-white leading-none">{value}</p>
      <p className="text-[9px] text-muted/70 font-medium mt-0.5">{label}</p>
    </div>
  </motion.div>
);

export const Home: React.FC = () => {
  const heroRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 130]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const [heroIndex, setHeroIndex] = React.useState(0);
  const [imgErrors, setImgErrors] = React.useState<Record<number, boolean>>({});
  const [tonightImgError, setTonightImgError] = React.useState(false);
  const [isTransitioning, setIsTransitioning] = React.useState(false);

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
      setIsTransitioning(true);
      setTimeout(() => {
        setHeroIndex(i => (i + 1) % HERO_MOVIES.length);
        setIsTransitioning(false);
      }, 400);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const HERO = HERO_MOVIES[heroIndex];
  const heroImgSrc = imgErrors[HERO?.id] ? FALLBACK_BG : HERO?.backdropPath;

  const particles = React.useMemo(() =>
    Array.from({ length: 14 }, (_, i) => ({
      id: i,
      delay: i * 0.35,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 80,
      size: 2 + Math.floor(Math.random() * 4),
    })), []
  );

  if (!HERO) return null;

  return (
    <div className="min-h-screen bg-[#080808]">

      {/* ══════════════════════════════════════
          HERO — Cinematic Rotating Backdrop
      ══════════════════════════════════════ */}
      <div ref={heroRef} className="relative h-[100svh] min-h-[640px] overflow-hidden">

        {/* Rotating backdrop — parallax + crossfade */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroIndex}
            className="absolute inset-0"
            style={{ y: heroY, scale: heroScale }}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: isTransitioning ? 0 : 1, scale: isTransitioning ? 1.06 : 1.02 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <img
              src={heroImgSrc}
              alt={HERO.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors(p => ({ ...p, [HERO.id]: true }))}
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic overlays — layered depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[rgba(8,8,8,0.5)] to-[rgba(8,8,8,0.1)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.9)] via-[rgba(8,8,8,0.35)] to-transparent" />
        <div className="absolute inset-0 overlay-vignette" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', backgroundSize: '256px 256px' }} />

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

        {/* Hero Content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 h-full flex flex-col justify-end pb-16 sm:pb-20"
        >
          <div className="max-w-[1400px] mx-auto px-6 lg:px-10 w-full">
            <div className="flex items-end justify-between gap-8 w-full">

              {/* LEFT — Text block */}
              <div className="max-w-[600px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, y: 36 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* AI badge */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.85, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.5 }}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25
                                 bg-accent/10 backdrop-blur-sm mb-5"
                    >
                      <Sparkles className="w-3 h-3 text-accent-light animate-spin-slow" />
                      <span className="text-[11px] font-semibold text-accent-light uppercase tracking-wider">
                        AI-Powered Discovery
                      </span>
                    </motion.div>

                    {/* Headline */}
                    <h1 className="text-[42px] sm:text-[56px] lg:text-[68px] font-black text-white leading-[1.02] mb-4 tracking-[-0.03em]">
                      What should you<br />
                      <span className="text-gradient-accent animate-text-glow">watch tonight?</span>
                    </h1>

                    <p className="text-[16px] sm:text-[18px] text-white/55 mb-7 max-w-[440px] leading-relaxed font-light">
                      AI recommendations with real-time streaming availability across every OTT platform.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 mb-7">
                      <Link to="/discover">
                        <motion.div
                          whileHover={{ scale: 1.05, y: -2 }}
                          whileTap={{ scale: 0.95 }}
                          className="btn-cta-pulse inline-flex items-center gap-2.5 bg-accent text-white font-bold
                                     px-7 py-3.5 rounded-xl cursor-pointer select-none relative overflow-hidden"
                          style={{ boxShadow: '0 8px 40px rgba(139,92,246,0.55), 0 0 0 1px rgba(139,92,246,0.3)' }}
                        >
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/12 to-transparent -translate-x-full"
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 3.5, ease: 'easeInOut' }}
                          />
                          <Sparkles className="w-4 h-4 relative z-10" />
                          <span className="relative z-10 text-[14px]">Find My Pick</span>
                        </motion.div>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => document.getElementById('trending-section')?.scrollIntoView({ behavior: 'smooth' })}
                        className="inline-flex items-center gap-2.5 text-white/75 font-semibold
                                   px-6 py-3.5 rounded-xl border border-white/12 backdrop-blur-sm
                                   hover:border-white/25 hover:bg-white/[0.06] transition-all duration-200 select-none text-[14px]"
                      >
                        <TrendingUp className="w-4 h-4" />
                        Browse Trending
                      </motion.button>
                    </div>

                    {/* Platform stats row */}
                    <div className="flex flex-wrap gap-2">
                      <StatPill icon={<Film className="w-3 h-3" />} value="500+" label="Titles" />
                      <StatPill icon={<Globe className="w-3 h-3" />} value="8" label="Platforms" />
                      <StatPill icon={<Sparkles className="w-3 h-3" />} value="AI-first" label="Discovery" />
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* RIGHT — Spotlight card (desktop only) */}
              <div className="hidden lg:block pb-2 flex-shrink-0">
                <HeroSpotlightCard movie={HERO} index={heroIndex} />
              </div>
            </div>

            {/* Progress dots */}
            <div className="absolute bottom-8 left-6 lg:left-10 flex items-center gap-2">
              {HERO_MOVIES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setHeroIndex(i)}
                  className={`transition-all duration-400 rounded-full ${
                    i === heroIndex
                      ? 'w-7 h-1.5 bg-accent shadow-[0_0_10px_rgba(139,92,246,0.6)]'
                      : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/45'
                  }`}
                />
              ))}
            </div>

            {/* Now featuring pill */}
            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 0.5 }}
                className="absolute bottom-8 right-6 lg:right-10 inline-flex items-center gap-2 text-[11px] text-white/35"
              >
                <span className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" />
                Now featuring: <span className="text-white/55 font-semibold">{HERO.title}</span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            animate={{ y: [0, 7, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-white/25 to-transparent rounded-full"
          />
        </motion.div>
      </div>

      {/* ══════════════════════════════════════
          MOOD ROW
      ══════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto px-6 lg:px-10 py-10 mb-6"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-[17px] font-bold text-white">What are you in the mood for?</h2>
            <p className="text-[12px] text-muted mt-0.5">Pick a vibe — we'll find the perfect watch</p>
          </div>
          <Link to="/discover" className="text-[12px] text-accent-light hover:text-white transition-colors duration-150 flex items-center gap-1 font-medium">
            Full Discover <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {MOODS.slice(0, 10).map((mood, i) => (
            <motion.div
              key={mood.id}
              initial={{ opacity: 0, scale: 0.82, y: 8 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03, ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
            >
              <Link to={`/discover?mood=${mood.id}`}>
                <motion.div
                  whileHover={{ scale: 1.07, y: -2 }}
                  whileTap={{ scale: 0.93 }}
                  className="chip hover:chip"
                >
                  <span className="text-[14px] font-mono leading-none">{MOOD_EMOJI[mood.id]}</span>
                  <span className="text-[13px]">{mood.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════
          TONIGHT'S PICK — Feature card
      ══════════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[1400px] mx-auto px-6 lg:px-10 mb-14"
      >
        <Link to={`/movie/${TONIGHT.id}`}>
          <motion.div
            whileHover={{ scale: 1.006 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-3xl overflow-hidden cursor-pointer group"
            style={{ boxShadow: '0 4px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)' }}
          >
            {/* Backdrop */}
            <div className="relative h-52 sm:h-[280px]">
              <img
                src={tonightImgError ? FALLBACK_BG : TONIGHT.backdropPath}
                alt={TONIGHT.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                onError={() => setTonightImgError(true)}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[rgba(8,8,8,0.97)] via-[rgba(8,8,8,0.62)] to-[rgba(8,8,8,0.2)]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgba(8,8,8,0.82)] to-transparent" />
            </div>

            {/* Content */}
            <div className="absolute inset-0 flex items-end p-6 sm:p-10">
              <div className="max-w-lg">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent rounded-lg mb-3">
                  <Sparkles className="w-3 h-3 text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-wider">AI Pick · Tonight</span>
                </div>
                <h3 className="text-2xl sm:text-[32px] font-black text-white mb-2 tracking-[-0.025em] leading-tight">
                  {TONIGHT.title}
                </h3>
                <p className="text-[13px] text-white/55 line-clamp-2 mb-4 max-w-md leading-relaxed">
                  {TONIGHT.aiInsight}
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-[13px] font-bold text-white">{TONIGHT.rating.toFixed(1)}</span>
                  </div>
                  <span className="w-1 h-1 bg-white/25 rounded-full" />
                  <span className="text-[13px] text-white/45">{TONIGHT.year}</span>
                  <span className="w-1 h-1 bg-white/25 rounded-full" />
                  <OTTBadgeList providers={TONIGHT.providers} size="sm" max={3} />
                </div>
              </div>
            </div>

            {/* Right arrow + play button */}
            <div className="absolute top-5 right-5 sm:top-7 sm:right-7 flex items-center gap-2">
              <motion.div
                whileHover={{ scale: 1.12 }}
                className="w-11 h-11 rounded-full bg-accent/90 backdrop-blur-sm border border-accent/40
                           flex items-center justify-center shadow-[0_4px_20px_rgba(139,92,246,0.5)]"
              >
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </motion.div>
            </div>

            {/* Hover shimmer sweep */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(139,92,246,0.04) 50%, transparent 70%)' }}
            />
          </motion.div>
        </Link>
      </motion.section>

      {/* ══════════════════════════════════════
          CONTENT SECTIONS
      ══════════════════════════════════════ */}
      <div className="max-w-[1400px] mx-auto" id="trending-section">

        {/* Continue Watching Row */}
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
          badge={<Flame className="w-4 h-4 text-orange-400" />}
          viewAllTo="/discover"
        >
          {trending.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        <Section
          title="Available Free"
          subtitle="No subscription required"
          badge={
            <span className="text-[10px] font-black text-white bg-emerald-500/90 px-2 py-0.5 rounded-md uppercase tracking-wide">
              FREE
            </span>
          }
          viewAllTo="/discover"
        >
          {free.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* AI Picks — full width dark banner */}
        <motion.section
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-14 px-6 lg:px-10"
        >
          <div
            className="relative rounded-3xl overflow-hidden bg-[#0b0814] border border-accent/12"
            style={{ boxShadow: '0 0 80px rgba(139,92,246,0.07), 0 0 0 1px rgba(139,92,246,0.06)' }}
          >
            <div className="absolute inset-0 bg-gradient-radial from-accent/6 via-transparent to-transparent" />
            <div className="absolute top-0 left-0 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-56 h-56 bg-violet-500/4 rounded-full blur-2xl" />

            <div className="relative p-8 sm:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    className="w-9 h-9 bg-accent/20 rounded-xl flex items-center justify-center border border-accent/30"
                  >
                    <Sparkles className="w-4 h-4 text-accent-light" />
                  </motion.div>
                  <div>
                    <h2 className="text-[17px] font-bold text-white">AI Picks For You</h2>
                    <p className="text-[12px] text-muted">Curated by Groq intelligence</p>
                  </div>
                </div>
                <Link to="/discover">
                  <motion.div
                    whileHover={{ x: 3 }}
                    className="flex items-center gap-1 text-[12px] text-accent-light hover:text-white transition-colors font-medium"
                  >
                    Personalize <ChevronRight className="w-3.5 h-3.5" />
                  </motion.div>
                </Link>
              </div>
              <div className="flex gap-4 scroll-row pb-2 fade-edges-sm">
                {aiPicks.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
            </div>
          </div>
        </motion.section>

        <Section
          title="Top Rated"
          subtitle="Highest rated across all OTT"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          viewAllTo="/discover"
        >
          {topRated.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* Bollywood + Hollywood — 2 col on desktop */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-14 px-6 lg:px-10"
        >
          {[
            { title: 'Bollywood Spotlight', subtitle: 'Desi cinema at its finest', movies: bollywood, color: 'text-amber-400' },
            { title: 'Hollywood Spotlight', subtitle: 'Global blockbusters & prestige', movies: hollywood, color: 'text-sky-400' },
          ].map(({ title, subtitle, movies, color }) => (
            <div key={title}>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <h2 className={`text-[16px] font-bold ${color} mb-0.5`}>{title}</h2>
                  <p className="text-[11px] text-muted">{subtitle}</p>
                </div>
              </div>
              <div className="flex gap-4 scroll-row pb-2 fade-edges-sm">
                {movies.slice(0, 6).map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
              </div>
            </div>
          ))}
        </motion.div>

        <Section
          title="Hidden Gems"
          subtitle="Criminally underrated masterpieces"
          badge={<Gem className="w-4 h-4 text-amber-400" />}
          viewAllTo="/discover"
        >
          {hidden.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
        </Section>

        {/* Bottom CTA band */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mx-6 lg:mx-10 mb-16"
        >
          <div
            className="rounded-3xl overflow-hidden relative"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(109,40,217,0.08) 50%, rgba(8,8,8,0) 100%)',
              border: '1px solid rgba(139,92,246,0.15)',
            }}
          >
            <div className="absolute inset-0 pointer-events-none">
              <div className="aurora-orb aurora-orb-1" style={{ left: '-20%', top: '-40%', opacity: 0.5 }} />
            </div>
            <div className="relative px-8 sm:px-12 py-10 sm:py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-[-0.02em] mb-2">
                  Ready to find your next<br className="hidden sm:block" /> favourite watch?
                </h2>
                <p className="text-[14px] text-white/50 max-w-md leading-relaxed">
                  Tell us your mood, genre, and time — our AI picks the perfect movie in seconds.
                </p>
              </div>
              <Link to="/discover" className="shrink-0">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="inline-flex items-center gap-2.5 bg-accent text-white font-bold
                             px-8 py-4 rounded-2xl cursor-pointer text-[15px]"
                  style={{ boxShadow: '0 12px 40px rgba(139,92,246,0.5)' }}
                >
                  <Sparkles className="w-4 h-4" />
                  Start Discovering
                </motion.div>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
};
