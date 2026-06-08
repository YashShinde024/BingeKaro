"use client";

import React, { useMemo } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Bookmark, Sparkles, Clock, LogOut, ShieldAlert, Heart, Film, Tv, Play, Activity, Star } from 'lucide-react';
import Link from 'next/link';
import { MOVIES, MOODS, GENRES } from '../../lib/mockData';
import type { GenreId, MoodId, OTTProviderId } from '../../types';
import { ProviderPill } from '../../components/badges/ProviderLogo';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { useHistory } from '../../context/HistoryContext';
import { PROVIDER_REGISTRY } from '../../lib/providers';

const MOOD_EMOJI: Record<string, string> = {
  adventurous: '⛰', romantic: '♥', thrilling: '⚡', funny: '☺',
  dark: '◑', 'feel-good': '☀', emotional: '◎', inspiring: '✦',
  chill: '◻', scary: '◈', 'mind-bending': '◉', 'action-packed': '▶',
};

const ALL_PROVIDERS = Object.values(PROVIDER_REGISTRY).map(p => ({
  id: p.id as OTTProviderId,
  label: p.name
}));

type DNAProfile = {
  label: string;
  emoji: string;
  description: string;
  gradient: string;
};

function computeMovieDNA(
  favoriteGenres: GenreId[],
  favoriteMoods: MoodId[],
  watchCount: number
): DNAProfile {
  const hasGenre = (g: string) => favoriteGenres.includes(g as GenreId);
  const hasMood = (m: string) => favoriteMoods.includes(m as MoodId);

  if (hasMood('mind-bending') || (hasGenre('sci-fi') && hasGenre('thriller')))
    return { label: 'Mind-Bending Explorer', emoji: '🧠', description: 'You crave narratives that challenge reality. Puzzle-boxes and cerebral universes are your comfort zone.', gradient: 'from-indigo-600 via-purple-600 to-pink-600' };
  if (hasGenre('sci-fi') || hasGenre('fantasy'))
    return { label: 'Sci-Fi Enthusiast', emoji: '🚀', description: 'Timelines, cosmic worlds, and advanced futures — you view cinema as a window to the impossible.', gradient: 'from-cyan-500 to-blue-600' };
  if (hasMood('thrilling') || hasGenre('thriller') || hasGenre('crime'))
    return { label: 'Thriller Hunter', emoji: '🫀', description: 'Suspense and high stakes keep you hooked. You live for the twists no one saw coming.', gradient: 'from-red-500 to-rose-700' };
  if (hasMood('romantic') || hasGenre('romance'))
    return { label: 'Romantic Dreamer', emoji: '🥀', description: 'Love and interpersonal depth drive your choices. You love connection and drama.', gradient: 'from-pink-500 via-rose-500 to-amber-500' };
  if (hasMood('funny') || hasGenre('comedy'))
    return { label: 'Comedy Connoisseur', emoji: '🃏', description: 'Life is better laughing. You prefer high spirits, slapstick, and quick wit.', gradient: 'from-amber-400 to-orange-600' };
  if (watchCount > 15)
    return { label: 'Ultimate Cinephile', emoji: '👑', description: 'You watch everything. Film is your language. An absolute catalog explorer.', gradient: 'from-yellow-500 via-amber-500 to-red-600' };

  return { label: 'Casual Explorer', emoji: '🧭', description: 'You enjoy a solid story. Your cinematic journey is just beginning to take shape.', gradient: 'from-muted-dark to-white' };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  unlocked: boolean;
}

const Counter: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span className="num font-bold text-3xl sm:text-4.5xl text-white tracking-tight">{displayValue}</span>;
};

export default function ProfilePage() {
  const { user, updatePreferences, logout } = useAuth();
  const { watchlist, favorites } = useWatchlist();
  const { recentlyViewed, recommendationHistory, removeFromContinueWatching } = useHistory();

  const [editPreferences, setEditPreferences] = React.useState(false);
  const [selectedGenres, setSelectedGenres] = React.useState<GenreId[]>([]);
  const [selectedMoods, setSelectedMoods] = React.useState<MoodId[]>([]);
  const [selectedProviders, setSelectedProviders] = React.useState<OTTProviderId[]>([]);
  const [viewAllRecent, setViewAllRecent] = React.useState(false);

  React.useEffect(() => {
    if (user) {
      setSelectedGenres(user.favoriteGenres || []);
      setSelectedMoods(user.favoriteMoods || []);
      setSelectedProviders(user.favoriteProviders || []);
    }
  }, [user, editPreferences]);

  const stats = useMemo(() => {
    const totalRuntime = watchlist.reduce((acc, m) => acc + m.runtime, 0);
    const completedCount = watchlist.filter(m => m.rating >= 8).length; // Mock completed as rating high
    const favoriteGenre = user?.favoriteGenres?.[0] || 'Drama';
    return {
      hours: Math.floor(totalRuntime / 60),
      completed: completedCount,
      genre: favoriteGenre,
      score: watchlist.length ? (watchlist.reduce((acc, m) => acc + m.rating, 0) / watchlist.length).toFixed(1) : '0.0',
    };
  }, [watchlist, user]);

  const favoriteDecade = useMemo(() => {
    if (watchlist.length === 0) return 'None';
    const decades: Record<string, number> = {};
    watchlist.forEach(m => {
      const dec = `${Math.floor(m.year / 10) * 10}s`;
      decades[dec] = (decades[dec] || 0) + 1;
    });
    return Object.entries(decades).sort((a, b) => b[1] - a[1])[0]?.[0] || '2020s';
  }, [watchlist]);

  const favoriteLanguage = useMemo(() => {
    if (watchlist.length === 0) return 'None';
    const languages: Record<string, number> = {};
    watchlist.forEach(m => {
      languages[m.language] = (languages[m.language] || 0) + 1;
    });
    const topLang = Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || 'english';
    return topLang.charAt(0).toUpperCase() + topLang.slice(1);
  }, [watchlist]);

  const dna = useMemo(() => {
    return computeMovieDNA(
      user?.favoriteGenres || [],
      user?.favoriteMoods || [],
      watchlist.length
    );
  }, [user, watchlist]);

  const achievements = useMemo<Achievement[]>(() => [
    { id: 'first-watch', title: 'First Steps', description: 'Add your first movie to the watchlist', icon: '🎬', requirement: '1 watch', unlocked: watchlist.length > 0 },
    { id: 'cinephile-scan', title: 'Cinephile Scan', description: 'Scan your taste DNA via mood discover', icon: '🧠', requirement: '1 scan', unlocked: recommendationHistory.length > 0 },
    { id: 'favorites-pro', title: 'Curator Status', description: 'Build a list of 5+ loved movies', icon: '❤️', requirement: '5 favorites', unlocked: favorites.length >= 5 },
    { id: 'taste-explorer', title: 'Vibe Explorer', description: 'Save movies across 3+ distinct moods', icon: '✨', requirement: '3+ moods', unlocked: (user?.favoriteMoods?.length || 0) >= 3 },
  ], [watchlist, recommendationHistory, favorites, user]);

  const achievementsProgress = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    return Math.round((unlocked / achievements.length) * 100);
  }, [achievements]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#07111F] pt-24 pb-20 flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto text-muted/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Guest Mode Profile</h2>
          <p className="text-[13px] text-muted/60 leading-relaxed">
            Please sign in to compute your personalized Binge Profile, track watch achievements, and customize providers.
          </p>
        </div>
      </div>
    );
  }

  const toggleGenre = (id: GenreId) => setSelectedGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  const toggleMood = (id: MoodId) => setSelectedMoods(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  const toggleProvider = (id: OTTProviderId) => setSelectedProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  const handleSavePreferences = () => {
    updatePreferences(selectedGenres, selectedMoods, selectedProviders);
    setEditPreferences(false);
  };

  const visibleHistory = viewAllRecent ? recentlyViewed : recentlyViewed.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#07111F] pt-24 pb-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.05] mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center border border-white/10 shadow-[0_4px_24px_rgba(139,92,246,0.25)]">
              <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-[22px] font-bold text-white tracking-tight leading-snug">{user.name}</h1>
              <p className="text-[12.5px] text-muted">Member since {user.joinedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditPreferences(!editPreferences)}
              className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[12.5px] font-bold hover:bg-white/10 transition-colors"
            >
              {editPreferences ? 'Cancel' : 'Edit Preferences'}
            </button>
            <button
              onClick={logout}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* COLLAPSIBLE PREFERENCES PANEL */}
        <AnimatePresence>
          {editPreferences && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="glass-card p-6 rounded-2xl space-y-6">
                {/* Genres */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Your Taste</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {GENRES.map(g => {
                      const active = selectedGenres.includes(g.id);
                      return (
                        <button
                          key={g.id}
                          onClick={() => toggleGenre(g.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                            active ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-muted'
                          }`}
                        >
                          {g.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Providers */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold text-white uppercase tracking-wider">Streaming Subscriptions</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_PROVIDERS.map(p => {
                      const active = selectedProviders.includes(p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => toggleProvider(p.id)}
                          className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-colors ${
                            active ? 'bg-accent border-accent text-white' : 'bg-white/5 border-white/10 text-muted'
                          }`}
                        >
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/5">
                  <button
                    onClick={handleSavePreferences}
                    className="btn-primary px-5 py-2.5 text-[12.5px] font-bold"
                  >
                    Save Preference Blueprint
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BENTO GRID LAYOUT ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* DNA Identity (Bento Widget 1 - Large) */}
          <div className="md:col-span-2 glass-card p-6 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[200px] border border-white/[0.07]">
            <div className={`absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-br ${dna.gradient} opacity-10 blur-[80px] pointer-events-none`} />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-accent-light uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Binge Profile
              </div>
              <h2 className="text-2xl sm:text-[28px] font-black text-white leading-tight">
                {dna.emoji} {dna.label}
              </h2>
              <p className="text-[13px] text-muted max-w-md leading-relaxed">{dna.description}</p>
            </div>

            {/* Profile DNA Stats Badge */}
            <div className="flex flex-wrap gap-3 pt-6 border-t border-white/5 mt-6 relative z-10">
              <div className="dna-badge px-3 py-1.5 rounded-xl text-[11px] font-bold text-accent-light">
                🎞 Decade: {favoriteDecade}
              </div>
              <div className="dna-badge px-3 py-1.5 rounded-xl text-[11px] font-bold text-accent-light">
                🗣 Lang: {favoriteLanguage}
              </div>
            </div>
          </div>

          {/* Watch Stats (Bento Widget 2) */}
          <div className="glass-card p-6 rounded-3xl flex flex-col justify-between gap-6 border border-white/[0.07]">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              Watch Statistics
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted/50 uppercase tracking-wider">Time Tracked</p>
                <p className="text-white"><Counter value={stats.hours} /> <span className="text-xs text-muted">hrs</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-muted/50 uppercase tracking-wider">Queue Total</p>
                <p className="text-white"><Counter value={watchlist.length} /> <span className="text-xs text-muted">saved</span></p>
              </div>
            </div>
            <div className="text-[11px] text-muted/40 font-semibold border-t border-white/5 pt-3">
              Average score across lists: <span className="text-white font-bold">{stats.score} ★</span>
            </div>
          </div>

        </div>

        {/* ── SECOND BENTO TIER ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Achievements Grid (Bento Widget 3) */}
          <div className="glass-card p-6 rounded-3xl space-y-5 border border-white/[0.07] flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
                <span>Achievements Progress</span>
                <span className="text-accent-light font-bold">{achievementsProgress}%</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: `${achievementsProgress}%` }} />
              </div>
            </div>

            <div className="space-y-2">
              {achievements.map(ach => (
                <div key={ach.id} className="flex items-center gap-3 p-2 rounded-xl bg-white/[0.01] border border-white/[0.03] transition-all">
                  <div className="text-xl shrink-0">{ach.icon}</div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-white leading-none">{ach.title}</p>
                    <p className="text-[9.5px] text-muted/50 truncate mt-0.5">{ach.description}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-[9px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                      UNLOCKED
                    </span>
                  ) : (
                    <span className="text-[9px] bg-white/5 border border-white/10 text-muted/40 font-bold px-1.5 py-0.5 rounded-md ml-auto shrink-0">
                      LOCKED
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Active preferences blueprint (Bento Widget 4) */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/[0.07]">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">Preferences Blueprint</p>
            </div>
            <div className="space-y-3.5">
              {/* Genres */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-muted/40 uppercase">Top Genre Nodes</p>
                <div className="flex flex-wrap gap-1">
                  {user.favoriteGenres.map(g => (
                    <span key={g} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10.5px] text-white/80 font-semibold capitalize">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Providers */}
              <div className="space-y-1.5">
                <p className="text-[9px] font-bold text-muted/40 uppercase">Linked Subscriptions</p>
                <div className="flex flex-wrap gap-1">
                  {user.favoriteProviders.map(p => (
                    <ProviderPill key={p} provider={p} size="sm" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation History Widget (Bento Widget 5) */}
          <div className="glass-card p-6 rounded-3xl space-y-4 border border-white/[0.07] flex flex-col justify-between">
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest">Your Journey</p>
              <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1">
                {recommendationHistory.length === 0 ? (
                  <p className="text-[11.5px] text-muted/50 leading-normal py-4">
                    No recommendation history yet. Your next obsession is waiting.
                  </p>
                ) : (
                  recommendationHistory.slice(0, 3).map((rec, i) => (
                    <div key={rec.movie.id} className="p-2 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-2">
                      <span className="text-xs shrink-0">💡</span>
                      <Link href={`/movie/${rec.movie.id}`} className="min-w-0 flex-1 hover:text-accent-light transition-colors">
                        <p className="text-[11.5px] font-bold text-white truncate leading-none mb-1">{rec.movie.title}</p>
                        <p className="text-[9.5px] text-muted/50 truncate leading-none">{rec.aiExplanation}</p>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Recently viewed logs */}
        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mb-8 p-6 rounded-3xl bg-white/[0.01] border border-white/[0.05] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-light" />
                <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Recently Viewed scans</h3>
              </div>
              <button
                onClick={() => setViewAllRecent(!viewAllRecent)}
                className="text-[11px] font-bold text-muted hover:text-white transition-colors"
              >
                {viewAllRecent ? 'View Less' : 'View All'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {visibleHistory.map(movie => (
                <div key={movie.id} className="relative rounded-2xl overflow-hidden aspect-poster bg-white/5 border border-white/10 group">
                  <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3.5 transition-all">
                    <p className="text-[12px] font-bold text-white truncate mb-1">{movie.title}</p>
                    <div className="flex gap-2 mb-3">
                      <Link href={`/movie/${movie.id}`} className="flex-1">
                        <button className="w-full bg-accent hover:bg-accent-dark text-white rounded-lg py-1 text-[10px] font-bold transition-all">
                          Watch
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromContinueWatching(movie.id)}
                        className="p-1 rounded bg-white/10 hover:bg-white/20 text-white transition-all text-[10px]"
                        title="Dismiss scan"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
