import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOODS, GENRES, LANGUAGES } from '../lib/mockData';
import type { MoodId, GenreId, LanguageId, ContentType } from '../types';

const CONTENT_TYPES: { id: ContentType; label: string; sub: string }[] = [
  { id: 'movie', label: 'Movie', sub: 'Feature films' },
  { id: 'tv', label: 'TV Show', sub: 'Series & episodes' },
  { id: 'anime', label: 'Anime', sub: 'Animation' },
];

const RUNTIME_OPTIONS = [
  { label: 'Under 90 min', value: 90, sub: 'Quick watch' },
  { label: '90 – 120 min', value: 120, sub: 'Standard' },
  { label: '2 – 3 hrs', value: 180, sub: 'Epic length' },
  { label: 'Any length', value: 999, sub: 'No limit' },
];

const MOOD_ICONS: Record<string, string> = {
  adventurous: '⛰', romantic: '♥', thrilling: '⚡', funny: '☺',
  dark: '◑', 'feel-good': '☀', emotional: '◎', inspiring: '✦',
  chill: '◻', scary: '◈', 'mind-bending': '◉', 'action-packed': '▶',
};

function toggle<T extends string>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

export const Discover: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialMood = searchParams.get('mood') as MoodId | null;

  const [moods, setMoods] = React.useState<MoodId[]>(initialMood ? [initialMood] : []);
  const [genres, setGenres] = React.useState<GenreId[]>([]);
  const [languages, setLanguages] = React.useState<LanguageId[]>([]);
  const [runtime, setRuntime] = React.useState(999);
  const [types, setTypes] = React.useState<ContentType[]>(['movie']);

  const canDiscover = moods.length > 0 || genres.length > 0;
  const selectionCount = moods.length + genres.length + languages.length;

  // Calculate progressive step progress percentage
  const calculateProgress = () => {
    let score = 0;
    if (moods.length > 0) score += 20;
    if (genres.length > 0) score += 20;
    if (languages.length > 0) score += 20;
    if (runtime !== 999) score += 20;
    if (types.length > 0) score += 20;
    return Math.max(score, moods.length > 0 ? 20 : 0); // Always give 20% if mood is started
  };

  const progressPercent = calculateProgress();

  const handleDiscover = () => {
    const params = new URLSearchParams({
      moods: moods.join(','),
      genres: genres.join(','),
      languages: languages.join(','),
      runtime: String(runtime),
      types: types.join(','),
    });
    navigate(`/discover/loading?${params}`);
  };

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 md:pb-16">
      <div className="max-w-2xl mx-auto px-6">

        {/* Stepper progress bar */}
        <div className="sticky top-[72px] z-30 py-3 mb-8 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.04]">
          <div className="flex items-center justify-between text-[11px] font-bold text-muted/50 uppercase tracking-widest mb-1.5">
            <span>Match Profile Progress</span>
            <span className="text-accent-light font-mono">{progressPercent}%</span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            />
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent/25 bg-accent/10 mb-5"
          >
            <Sparkles className="w-3 h-3 text-accent-light" />
            <span className="text-[11px] font-semibold text-accent-light uppercase tracking-wider">
              AI Recommendation Engine
            </span>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-[-0.025em] mb-3">
            How are you feeling{' '}
            <span className="text-gradient-accent">tonight?</span>
          </h1>
          <p className="text-[15px] text-muted max-w-sm mx-auto leading-relaxed">
            Tell us your mood and we'll find the perfect watch.
          </p>
        </motion.div>

        {/* ── Mood ── */}
        <FilterBlock
          step="01"
          title="Pick your mood"
          hint="Select one or more"
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MOODS.map((mood, i) => {
              const active = moods.includes(mood.id);
              return (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.025, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setMoods(prev => toggle(prev, mood.id))}
                  className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium
                              border transition-all duration-200 group ${
                    active
                      ? 'bg-accent/15 border-accent/50 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-[15px] font-mono leading-none opacity-80">{MOOD_ICONS[mood.id]}</span>
                  <span className="leading-tight">{mood.label}</span>
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-4 h-4 bg-accent rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-2.5 h-2.5 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── Genre ── */}
        <FilterBlock step="02" title="Preferred genre" hint="Optional">
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g, i) => {
              const active = genres.includes(g.id);
              return (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setGenres(prev => toggle(prev, g.id))}
                  className={`chip ${active ? 'active' : ''}`}
                >
                  {active && <Check className="w-3 h-3" />}
                  {g.label}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── Language ── */}
        <FilterBlock step="03" title="Language" hint="Optional">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang, i) => {
              const active = languages.includes(lang.id);
              return (
                <motion.button
                  key={lang.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setLanguages(prev => toggle(prev, lang.id))}
                  className={`chip ${active ? 'active' : ''}`}
                >
                  {active && <Check className="w-3 h-3" />}
                  {lang.label}
                  <span className="text-muted/50 text-[10px]">({lang.nativeLabel})</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── Runtime ── */}
        <FilterBlock step="04" title="How much time do you have?">
          <div className="grid grid-cols-2 gap-2.5">
            {RUNTIME_OPTIONS.map(opt => {
              const active = runtime === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRuntime(opt.value)}
                  className={`flex flex-col items-start px-4 py-3 rounded-xl border text-left
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/12 border-accent/45 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-[11px] opacity-60 mt-0.5">{opt.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── Content Type ── */}
        <FilterBlock step="05" title="What do you want to watch?">
          <div className="grid grid-cols-3 gap-2.5">
            {CONTENT_TYPES.map(opt => {
              const active = types.includes(opt.id);
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTypes(prev => toggle(prev, opt.id))}
                  className={`flex flex-col items-start px-4 py-3.5 rounded-xl border
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/12 border-accent/45 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-[11px] opacity-50 mt-0.5">{opt.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-10"
        >
          <AnimatePresence>
            {selectionCount > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4 text-center"
              >
                <span className="text-[12px] text-muted/70">
                  {selectionCount} preference{selectionCount > 1 ? 's' : ''} selected
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={canDiscover ? { scale: 1.02, y: -1 } : {}}
            whileTap={canDiscover ? { scale: 0.98 } : {}}
            onClick={handleDiscover}
            disabled={!canDiscover}
            className={`w-full flex items-center justify-center gap-3 py-4.5 rounded-2xl
                        font-bold text-[15px] transition-all duration-300 select-none ${
              canDiscover
                ? 'text-white cursor-pointer'
                : 'text-muted/50 cursor-not-allowed bg-white/[0.04] border border-white/[0.07]'
            }`}
            style={canDiscover ? {
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              boxShadow: '0 8px 40px rgba(139,92,246,0.45), 0 0 0 1px rgba(139,92,246,0.3)',
            } : {}}
          >
            <Sparkles className="w-5 h-5" />
            {canDiscover ? 'Find My Perfect Watch' : 'Select a mood to continue'}
            {canDiscover && <ArrowRight className="w-5 h-5" />}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

/* ── Filter block wrapper ── */
const FilterBlock: React.FC<{
  step: string;
  title: string;
  hint?: string;
  children: React.ReactNode;
}> = ({ step, title, hint, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    className="mb-10"
  >
    <div className="flex items-baseline gap-3 mb-4">
      <span className="text-[11px] font-bold text-accent/60 font-mono tabular-nums">{step}</span>
      <h3 className="text-[15px] font-bold text-white">{title}</h3>
      {hint && <span className="text-[12px] text-muted/60 ml-auto">{hint}</span>}
    </div>
    {children}
  </motion.div>
);
