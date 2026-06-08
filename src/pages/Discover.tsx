import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Check, Users, Zap, Palette } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { MOODS, GENRES, LANGUAGES } from '../lib/mockData';
import type { MoodId, GenreId, LanguageId, ContentType } from '../types';

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
    <div className="min-h-screen bg-[#060606] pt-24 pb-32 md:pb-20">
      <div className="max-w-2xl mx-auto px-6">

        {/* Sticky progress bar */}
        <div className="sticky top-[64px] z-30 py-4 mb-10 bg-[#060606]/80 backdrop-blur-xl border-b border-white/[0.05]">
          <div className="flex items-center justify-between text-[11px] font-bold mb-2">
            <span className="text-muted/40 uppercase tracking-widest">Taste Match Profile</span>
            <motion.span
              key={progressLabel}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-accent-light font-bold"
            >
              {progressLabel}
            </motion.span>
          </div>
          <div className="h-1.5 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-accent via-violet-500 to-accent-light rounded-full shadow-[0_0_12px_rgba(139,92,246,0.5)]"
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: 'spring', damping: 24, stiffness: 120 }}
            />
          </div>
        </div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/20 bg-accent/5 mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-light" />
            <span className="text-[10px] font-bold text-accent-light uppercase tracking-widest">
              AI Taste-Mapping Engine
            </span>
          </motion.div>
          <h1 className="text-3xl sm:text-4.5xl font-black text-white tracking-tight mb-4">
            How are you feeling{' '}
            <span className="text-gradient-accent">tonight?</span>
          </h1>
          <p className="text-[14.5px] text-muted/80 max-w-sm mx-auto leading-relaxed">
            Configure your mood and context, and our AI will search OTT catalogs to map the perfect movie.
          </p>
        </motion.div>

        {/* ── 01. Mood ── */}
        <FilterBlock step="01" title="Pick your mood" hint="Select multiple if you like">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {MOODS.map((mood) => {
              const active = moods.includes(mood.id);
              return (
                <motion.button
                  key={mood.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setMoods(prev => toggle(prev, mood.id))}
                  className={`relative flex items-center gap-2.5 px-4 py-3.5 rounded-2xl text-left text-sm font-semibold border transition-all duration-200 ${
                    active
                      ? 'bg-accent/10 border-accent/40 text-white shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-[16px] leading-none">{MOOD_ICONS[mood.id]}</span>
                  <span className="leading-tight">{mood.label}</span>
                  {active && (
                    <motion.div
                      layoutId={`check-mood-${mood.id}`}
                      className="ml-auto w-4.5 h-4.5 bg-accent rounded-full flex items-center justify-center flex-shrink-0"
                    >
                      <Check className="w-3 h-3 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 02. Watching With ── */}
        <FilterBlock step="02" title="Watching with?" hint="Adapts recommendations for groups" icon={<Users className="w-4 h-4 text-muted/40" />}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {WATCHING_WITH.map((w) => {
              const active = watchingWith === w.id;
              return (
                <motion.button
                  key={w.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setWatchingWith(prev => toggleSingle(prev, w.id))}
                  className={`flex flex-col items-center gap-2 px-3 py-4.5 rounded-2xl border text-center transition-all duration-200 ${
                    active
                      ? 'bg-accent/10 border-accent/40 text-white shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{w.emoji}</span>
                  <span className="text-[12px] font-bold">{w.label}</span>
                  <span className="text-[9.5px] opacity-40 leading-normal">{w.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 03. Energy Level ── */}
        <FilterBlock step="03" title="Energy level?" hint="Controls pacing & complexity" icon={<Zap className="w-4 h-4 text-muted/40" />}>
          <div className="grid grid-cols-3 gap-2.5">
            {ENERGY_LEVELS.map((e) => {
              const active = energyLevel === e.id;
              return (
                <motion.button
                  key={e.id}
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setEnergyLevel(prev => toggleSingle(prev, e.id))}
                  className={`flex flex-col items-center gap-2 px-3 py-4.5 rounded-2xl border text-center transition-all duration-200 ${
                    active
                      ? 'bg-accent/10 border-accent/40 text-white shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-2xl">{e.emoji}</span>
                  <span className="text-[12.5px] font-bold">{e.label}</span>
                  <span className="text-[9.5px] opacity-40 leading-normal">{e.desc}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 04. Content Style ── */}
        <FilterBlock step="04" title="Content style?" hint="Filters emotional tone" icon={<Palette className="w-4 h-4 text-muted/40" />}>
          <div className="flex flex-wrap gap-2">
            {CONTENT_STYLES.map((cs) => {
              const active = contentStyles.includes(cs.id);
              return (
                <motion.button
                  key={cs.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setContentStyles(prev => toggle(prev, cs.id))}
                  className={`px-4 py-2 rounded-full border text-[12px] font-semibold flex items-center gap-2 transition-all duration-200 cursor-pointer ${
                    active 
                      ? 'bg-accent border-accent text-white shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span>{cs.emoji}</span>
                  {cs.label}
                  {active && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 05. Genre ── */}
        <FilterBlock step="05" title="Preferred genres" hint="Optional Filter">
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => {
              const active = genres.includes(g.id);
              return (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setGenres(prev => toggle(prev, g.id))}
                  className={`px-4 py-2 rounded-full border text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-accent border-accent text-white shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  {g.label}
                  {active && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 06. Language ── */}
        <FilterBlock step="06" title="Languages" hint="Optional Filter">
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((lang) => {
              const active = languages.includes(lang.id);
              return (
                <motion.button
                  key={lang.id}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setLanguages(prev => toggle(prev, lang.id))}
                  className={`px-4 py-2 rounded-full border text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer ${
                    active
                      ? 'bg-accent border-accent text-white shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:bg-white/[0.06] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  {lang.label}
                  <span className="text-muted/40 text-[10px] font-normal">({lang.nativeLabel})</span>
                  {active && <Check className="w-3.5 h-3.5 ml-0.5" />}
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 07. Runtime ── */}
        <FilterBlock step="07" title="Preferred duration">
          <div className="grid grid-cols-2 gap-2.5">
            {RUNTIME_OPTIONS.map(opt => {
              const active = runtime === opt.value;
              return (
                <motion.button
                  key={opt.value}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setRuntime(opt.value)}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-2xl border text-left transition-all duration-200 ${
                    active
                      ? 'bg-accent/10 border-accent/40 text-white shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <span className="text-[13px] font-bold block leading-none mb-1">{opt.label}</span>
                    <span className="text-[10px] opacity-40 font-medium">{opt.sub}</span>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── 08. Content Type ── */}
        <FilterBlock step="08" title="Content format">
          <div className="grid grid-cols-3 gap-2.5">
            {CONTENT_TYPES.map(opt => {
              const active = types.includes(opt.id);
              return (
                <motion.button
                  key={opt.id}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setTypes(prev => toggle(prev, opt.id))}
                  className={`flex flex-col items-center gap-2 px-4 py-4.5 rounded-2xl border text-center transition-all duration-200 ${
                    active
                      ? 'bg-accent/10 border-accent/40 text-white shadow-[0_4px_20px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:border-white/[0.12] hover:text-white'
                  }`}
                >
                  <span className="text-xl">{opt.emoji}</span>
                  <span className="text-[13px] font-bold leading-none mb-0.5">{opt.label}</span>
                  <span className="text-[9.5px] opacity-40 font-medium">{opt.sub}</span>
                </motion.button>
              );
            })}
          </div>
        </FilterBlock>

        {/* ── CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-12"
        >
          <motion.button
            whileHover={canDiscover ? { scale: 1.02, y: -2 } : {}}
            whileTap={canDiscover ? { scale: 0.98 } : {}}
            onClick={handleDiscover}
            disabled={!canDiscover}
            className={`w-full relative flex items-center justify-center gap-3 py-4 rounded-2xl font-bold text-[14.5px] tracking-wide transition-all duration-300 select-none overflow-hidden ${
              canDiscover
                ? 'text-white cursor-pointer'
                : 'text-muted/40 cursor-not-allowed bg-white/[0.02] border border-white/[0.05]'
            }`}
            style={canDiscover ? {
              background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)',
              boxShadow: '0 8px 40px rgba(139,92,246,0.4), 0 0 0 1px rgba(139,92,246,0.25)',
            } : {}}
          >
            {canDiscover && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/8 to-transparent -translate-x-full"
                animate={{ x: ['-100%', '200%'] }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.8 }}
              />
            )}
            <Sparkles className="w-4.5 h-4.5 relative z-10" />
            <span className="relative z-10 font-bold uppercase tracking-wider">
              {canDiscover ? 'Find My Perfect Watch' : 'Select a mood to continue'}
            </span>
            {canDiscover && <ArrowRight className="w-4.5 h-4.5 relative z-10" />}
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

const FilterBlock: React.FC<{
  step: string;
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}> = ({ step, title, hint, icon, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="mb-12 border-b border-white/[0.03] pb-10 last:border-0 last:pb-0"
  >
    <div className="flex items-center gap-3 mb-5">
      <span className="text-[11px] font-extrabold text-accent/50 font-mono tracking-widest shrink-0">{step}</span>
      <h3 className="text-[14.5px] font-bold text-white flex items-center gap-2">
        {icon}
        {title}
      </h3>
      {hint && <span className="text-[11.5px] font-medium text-muted/40 ml-auto">{hint}</span>}
    </div>
    {children}
  </motion.div>
);
