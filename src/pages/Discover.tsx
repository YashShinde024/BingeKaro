import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Users, Zap, Palette } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOODS, GENRES, LANGUAGES } from '../lib/mockData';
import type { MoodId, GenreId, LanguageId, ContentType } from '../types';

/* ─── Types ─── */
type WatchingWith = 'alone' | 'partner' | 'friends' | 'family';
type EnergyLevel = 'relaxed' | 'focused' | 'excited';
type ContentStyle = 'emotional' | 'mind-bending' | 'funny' | 'dark' | 'inspiring' | 'thrilling';

const CONTENT_TYPES: { id: ContentType; label: string; sub: string; emoji: string }[] = [
  { id: 'movie', label: 'Movie', sub: 'Feature films', emoji: '🎬' },
  { id: 'tv', label: 'TV Show', sub: 'Series & episodes', emoji: '📺' },
  { id: 'anime', label: 'Anime', sub: 'Animation', emoji: '✨' },
];

const RUNTIME_OPTIONS = [
  { label: 'Under 90 min', value: 90, sub: 'Quick watch', emoji: '⚡' },
  { label: '90 – 120 min', value: 120, sub: 'Standard', emoji: '🎯' },
  { label: '2 – 3 hrs', value: 180, sub: 'Epic length', emoji: '🏆' },
  { label: 'Any length', value: 999, sub: 'No limit', emoji: '∞' },
];

const WATCHING_WITH: { id: WatchingWith; label: string; emoji: string; desc: string }[] = [
  { id: 'alone', label: 'Solo', emoji: '🎧', desc: 'Just me & the screen' },
  { id: 'partner', label: 'Partner', emoji: '❤️', desc: 'Date night vibes' },
  { id: 'friends', label: 'Friends', emoji: '🍿', desc: 'Group watch session' },
  { id: 'family', label: 'Family', emoji: '🏠', desc: 'All ages welcome' },
];

const ENERGY_LEVELS: { id: EnergyLevel; label: string; emoji: string; desc: string }[] = [
  { id: 'relaxed', label: 'Relaxed', emoji: '🌙', desc: 'Low effort viewing' },
  { id: 'focused', label: 'Focused', emoji: '🎯', desc: 'Ready to engage' },
  { id: 'excited', label: 'Excited', emoji: '⚡', desc: 'High energy mode' },
];

const CONTENT_STYLES: { id: ContentStyle; label: string; emoji: string }[] = [
  { id: 'emotional', label: 'Emotional', emoji: '💧' },
  { id: 'mind-bending', label: 'Mind-Bending', emoji: '🧠' },
  { id: 'funny', label: 'Funny', emoji: '😂' },
  { id: 'dark', label: 'Dark', emoji: '🌑' },
  { id: 'inspiring', label: 'Inspiring', emoji: '✨' },
  { id: 'thrilling', label: 'Thrilling', emoji: '🫀' },
];

const MOOD_ICONS: Record<string, string> = {
  adventurous: '⛰', romantic: '♥', thrilling: '⚡', funny: '☺',
  dark: '◑', 'feel-good': '☀', emotional: '◎', inspiring: '✦',
  chill: '◻', scary: '◈', 'mind-bending': '◉', 'action-packed': '▶',
};

function toggle<T extends string>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item];
}

function toggleSingle<T extends string>(current: T | null, item: T): T | null {
  return current === item ? null : item;
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
  const [watchingWith, setWatchingWith] = React.useState<WatchingWith | null>(null);
  const [energyLevel, setEnergyLevel] = React.useState<EnergyLevel | null>(null);
  const [contentStyles, setContentStyles] = React.useState<ContentStyle[]>([]);

  const canDiscover = moods.length > 0 || genres.length > 0;

  const calculateProgress = () => {
    let score = 0;
    if (moods.length > 0) score += 20;
    if (genres.length > 0) score += 15;
    if (languages.length > 0) score += 10;
    if (runtime !== 999) score += 10;
    if (watchingWith) score += 15;
    if (energyLevel) score += 15;
    if (contentStyles.length > 0) score += 15;
    return Math.min(score, 100);
  };

  const progressPercent = calculateProgress();

  const selectionCount = moods.length + genres.length + languages.length +
    (watchingWith ? 1 : 0) + (energyLevel ? 1 : 0) + contentStyles.length;

  const handleDiscover = () => {
    const params = new URLSearchParams({
      moods: moods.join(','),
      genres: genres.join(','),
      languages: languages.join(','),
      runtime: String(runtime),
      types: types.join(','),
      watchingWith: watchingWith || '',
      energyLevel: energyLevel || '',
      contentStyles: contentStyles.join(','),
    });
    navigate(`/discover/loading?${params}`);
  };

  const progressLabel = progressPercent < 25 ? 'Getting started…'
    : progressPercent < 50 ? 'Building your taste profile'
    : progressPercent < 75 ? 'Profile looking good!'
    : progressPercent < 100 ? 'Almost there!'
    : 'Perfect match profile!';

  return (
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 md:pb-16">
      <div className="max-w-2xl mx-auto px-6">

        {/* Sticky progress bar */}
        <div className="sticky top-[64px] z-30 py-3 mb-8 bg-[#080808]/90 backdrop-blur-md border-b border-white/[0.04]">
          <div className="flex items-center justify-between text-[11px] font-bold mb-2">
            <span className="text-muted/50 uppercase tracking-widest">Match Profile</span>
            <motion.span
              key={progressLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent-light font-mono"
            >
              {progressLabel}
            </motion.span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.05] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-violet-500 to-accent-light rounded-full"
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', damping: 20, stiffness: 100 }}
            />
          </div>
          {selectionCount > 0 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-[10px] text-muted/40 mt-1.5 text-right"
            >
              {selectionCount} preference{selectionCount > 1 ? 's' : ''} selected
            </motion.p>
          )}
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-12"
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
            Tell us what you're in the mood for and we'll find the perfect watch in seconds.
          </p>
        </motion.div>

        {/* ── 01. Mood ── */}
        <FilterBlock step="01" title="Pick your mood" hint="Select one or more">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MOODS.map((mood, i) => {
              const active = moods.includes(mood.id);
              return (
                <motion.button
                  key={mood.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setMoods(prev => toggle(prev, mood.id))}
                  className={`relative flex items-center gap-2.5 px-4 py-3 rounded-xl text-left text-sm font-medium
                              border transition-all duration-200 ${
                    active
                      ? 'bg-accent/15 border-accent/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.18)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-[16px] leading-none">{MOOD_ICONS[mood.id]}</span>
                  <span className="leading-tight">{mood.label}</span>
                  <AnimatePresence>
                    {active && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="ml-auto w-4 h-4 bg-accent rounded-full flex items-center justify-center flex-shrink-0"
                      >
                        <Check className="w-2.5 h-2.5 text-white" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 02. Watching With ── (NEW) */}
        <FilterBlock step="02" title="Watching with?" hint="Optional" icon={<Users className="w-4 h-4 text-muted/60" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WATCHING_WITH.map((w, i) => {
              const active = watchingWith === w.id;
              return (
                <motion.button
                  key={w.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setWatchingWith(prev => toggleSingle(prev, w.id))}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/15 border-accent/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <motion.span
                    className="text-2xl"
                    animate={active ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.4 }}
                  >
                    {w.emoji}
                  </motion.span>
                  <span className="text-[12px] font-semibold">{w.label}</span>
                  <span className="text-[10px] opacity-50 leading-tight">{w.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 03. Energy Level ── (NEW) */}
        <FilterBlock step="03" title="Energy level?" hint="Optional" icon={<Zap className="w-4 h-4 text-muted/60" />}>
          <div className="grid grid-cols-3 gap-2.5">
            {ENERGY_LEVELS.map((e, i) => {
              const active = energyLevel === e.id;
              return (
                <motion.button
                  key={e.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setEnergyLevel(prev => toggleSingle(prev, e.id))}
                  className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/15 border-accent/50 text-white shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <motion.span
                    className="text-2xl"
                    animate={active ? { rotate: [0, -10, 10, 0] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {e.emoji}
                  </motion.span>
                  <span className="text-[13px] font-semibold">{e.label}</span>
                  <span className="text-[10px] opacity-50">{e.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 04. Content Style ── (NEW) */}
        <FilterBlock step="04" title="Content style?" hint="Optional" icon={<Palette className="w-4 h-4 text-muted/60" />}>
          <div className="flex flex-wrap gap-2">
            {CONTENT_STYLES.map((cs, i) => {
              const active = contentStyles.includes(cs.id);
              return (
                <motion.button
                  key={cs.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.03 }}
                  whileHover={{ scale: 1.06, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setContentStyles(prev => toggle(prev, cs.id))}
                  className={`chip ${active ? 'active' : ''} gap-2`}
                >
                  <span>{cs.emoji}</span>
                  {active && <Check className="w-3 h-3" />}
                  {cs.label}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 05. Genre ── */}
        <FilterBlock step="05" title="Preferred genre" hint="Optional">
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g, i) => {
              const active = genres.includes(g.id);
              return (
                <motion.button
                  key={g.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.05, y: -1 }}
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

        {/* ── 06. Language ── */}
        <FilterBlock step="06" title="Language" hint="Optional">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang, i) => {
              const active = languages.includes(lang.id);
              return (
                <motion.button
                  key={lang.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  whileHover={{ scale: 1.05, y: -1 }}
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

        {/* ── 07. Runtime ── */}
        <FilterBlock step="07" title="How much time do you have?">
          <div className="grid grid-cols-2 gap-2.5">
            {RUNTIME_OPTIONS.map(opt => {
              const active = runtime === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setRuntime(opt.value)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/12 border-accent/45 text-white shadow-[0_0_15px_rgba(139,92,246,0.12)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <span className="text-lg">{opt.emoji}</span>
                  <div>
                    <span className="text-sm font-semibold block">{opt.label}</span>
                    <span className="text-[11px] opacity-50">{opt.sub}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 08. Content Type ── */}
        <FilterBlock step="08" title="What do you want to watch?">
          <div className="grid grid-cols-3 gap-2.5">
            {CONTENT_TYPES.map(opt => {
              const active = types.includes(opt.id);
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.03, y: -1 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setTypes(prev => toggle(prev, opt.id))}
                  className={`flex flex-col items-center gap-2 px-4 py-4 rounded-xl border text-center
                              transition-all duration-200 ${
                    active
                      ? 'bg-accent/12 border-accent/45 text-white shadow-[0_0_15px_rgba(139,92,246,0.12)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/12 hover:text-white'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-sm font-semibold">{opt.label}</span>
                  <span className="text-[10px] opacity-50">{opt.sub}</span>
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
          <motion.button
            whileHover={canDiscover ? { scale: 1.02, y: -2 } : {}}
            whileTap={canDiscover ? { scale: 0.98 } : {}}
            onClick={handleDiscover}
            disabled={!canDiscover}
            className={`w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl
                        font-bold text-[15px] transition-all duration-300 select-none overflow-hidden ${
              canDiscover
                ? 'text-white cursor-pointer'
                : 'text-muted/50 cursor-not-allowed bg-white/[0.04] border border-white/[0.07]'
            }`}
            style={canDiscover ? {
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              boxShadow: '0 8px 40px rgba(139,92,246,0.45), 0 0 0 1px rgba(139,92,246,0.3)',
            } : {}}
          >
            {canDiscover && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2 }}
              />
            )}
            <Sparkles className="w-5 h-5 relative z-10" />
            <span className="relative z-10">
              {canDiscover ? 'Find My Perfect Watch' : 'Select a mood to continue'}
            </span>
            {canDiscover && <ArrowRight className="w-5 h-5 relative z-10" />}
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
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ step, title, hint, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="mb-10"
  >
    <div className="flex items-center gap-3 mb-4">
      <span className="text-[11px] font-bold text-accent/50 font-mono tabular-nums shrink-0">{step}</span>
      <h3 className="text-[15px] font-bold text-white flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {hint && <span className="text-[12px] text-muted/50 ml-auto">{hint}</span>}
    </div>
    {children}
  </motion.div>
);
