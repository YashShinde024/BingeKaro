"use client";

import React, { useMemo } from 'react';
import { motion, useMotionValue, animate, AnimatePresence } from 'framer-motion';
import { Bookmark, Sparkles, Clock, LogOut, ShieldAlert, Heart, Film, Tv, Play, Activity, Star, PieChart, Award, Zap, Compass, Smile, Brain, Laugh, Moon, Globe } from 'lucide-react';
import Link from 'next/link';
import { MOVIES, MOODS, GENRES } from '../../lib/mockData';
import type { GenreId, MoodId, OTTProviderId } from '../../types';
import { ProviderPill } from '../../components/badges/ProviderLogo';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { useHistory } from '../../context/HistoryContext';
import { PROVIDER_REGISTRY } from '../../lib/providers';

const ALL_PROVIDERS = Object.values(PROVIDER_REGISTRY).map(p => ({
  id: p.id as OTTProviderId,
  label: p.name
}));

type DNAProfile = {
  label: string;
  icon: React.ComponentType<any>;
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
    return { label: 'Mind-Bending Explorer', icon: Brain, description: 'You crave narratives that challenge reality. Puzzle-boxes, cosmic anomalies, and cerebral thrillers are your home turf.', gradient: 'from-indigo-500 via-purple-500 to-pink-500' };
  if (hasGenre('sci-fi') || hasGenre('fantasy'))
    return { label: 'Sci-Fi Visionary', icon: Globe, description: 'Timelines, space travel, and high-concept tech — you view film as a portal to speculative futures.', gradient: 'from-cyan-500 to-blue-600' };
  if (hasMood('thrilling') || hasGenre('thriller') || hasGenre('crime'))
    return { label: 'Thriller Specialist', icon: Zap, description: 'Suspense, tension, and high stakes keep your pulse racing. You live for plot twists.', gradient: 'from-red-500 to-rose-600' };
  if (hasMood('romantic') || hasGenre('romance'))
    return { label: 'Heartfelt Dreamer', icon: Heart, description: 'Emotional depth, human connections, and rich character relationships form your watch history.', gradient: 'from-pink-500 via-rose-500 to-orange-500' };
  if (hasMood('funny') || hasGenre('comedy'))
    return { label: 'Comedy Aficionado', icon: Laugh, description: 'Life is better with a dose of humor. You seek high spirits, sharp wit, and lighthearted releases.', gradient: 'from-amber-400 to-orange-500' };
  if (watchCount > 10)
    return { label: 'Ultimate Cinephile', icon: Award, description: 'Film is your second language. Your catalog contains everything from independent classics to commercial blockbusters.', gradient: 'from-violet-500 via-purple-500 to-red-500' };

  return { label: 'Casual Explorer', icon: Compass, description: 'Your cinematic footprint is emerging. Explore more moods and genres to unlock customized recommendations.', gradient: 'from-slate-500 to-slate-300' };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  requirement: string;
  unlocked: boolean;
}

const Counter: React.FC<{ value: number }> = ({ value }) => {
  const count = useMotionValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(count, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplayValue(Math.floor(latest)),
    });
    return () => controls.stop();
  }, [value]);

  return <span className="num font-black text-3xl sm:text-4xl text-white tracking-tight">{displayValue}</span>;
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
    const completedCount = watchlist.length; // Mock completed as rating high
    const favoriteGenre = user?.favoriteGenres?.[0] || 'Drama';
    return {
      hours: Math.floor(totalRuntime / 60),
      completed: completedCount,
      genre: favoriteGenre,
      score: watchlist.length ? (watchlist.reduce((acc, m) => acc + m.rating, 0) / watchlist.length).toFixed(1) : '0.0',
    };
  }, [watchlist, user]);

  const platformDistribution = useMemo(() => {
    if (watchlist.length === 0) return [];
    const counts: Record<string, number> = {};
    watchlist.forEach(m => {
      m.providers.forEach(p => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([prov, count]) => ({
      provider: prov as OTTProviderId,
      name: PROVIDER_REGISTRY[prov]?.name || prov,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  }, [watchlist]);

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
    { id: 'first-watch', title: 'First Steps', description: 'Add your first movie to the watchlist', icon: Film, requirement: '1 watch', unlocked: watchlist.length > 0 },
    { id: 'cinephile-scan', title: 'Cinephile Scan', description: 'Scan your taste DNA via mood discover', icon: Brain, requirement: '1 scan', unlocked: recommendationHistory.length > 0 },
    { id: 'favorites-pro', title: 'Curator Status', description: 'Build a list of 5+ loved movies', icon: Heart, requirement: '5 favorites', unlocked: favorites.length >= 5 },
    { id: 'taste-explorer', title: 'Vibe Explorer', description: 'Save movies across 3+ distinct moods', icon: Sparkles, requirement: '3+ moods', unlocked: (user?.favoriteMoods?.length || 0) >= 3 },
  ], [watchlist, recommendationHistory, favorites, user]);

  const achievementsProgress = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    return Math.round((unlocked / achievements.length) * 100);
  }, [achievements]);

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-20 flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto text-muted/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Guest Mode Profile</h2>
          <p className="text-[13.5px] text-muted/60 leading-relaxed">
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
    <div className="min-h-screen bg-[#050505] pt-24 pb-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-white/[0.05] mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center border border-white/10 shadow-[0_4px_24px_rgba(139,92,246,0.25)]">
              <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-white tracking-tight leading-snug">{user.name}</h1>
              <p className="text-[12px] text-muted">Member since {user.joinedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setEditPreferences(!editPreferences)}
              className="px-4.5 py-2 bg-white/5 border border-white/10 text-white rounded-xl text-[12px] font-bold hover:bg-white/10 transition-colors"
            >
              {editPreferences ? 'Cancel' : 'Edit Blueprint'}
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
              <div className="glass-card p-6 rounded-3xl space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider">Your Taste Blueprint</h4>
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

                <div className="space-y-3">
                  <h4 className="text-[11px] font-extrabold text-white uppercase tracking-wider">Active OTT Networks</h4>
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
                    className="btn-primary px-5 py-2.5 text-[12px] font-bold uppercase tracking-wider"
                  >
                    Save Preference Blueprint
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── BENTO DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Bento Widget 1: Taste DNA (Large) */}
          <div className="md:col-span-2 bg-white/[0.02] backdrop-blur-md p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgba(139,92,246,0.06)] transition-all duration-300">
            <div className={`absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br ${dna.gradient} opacity-[0.07] blur-[75px] pointer-events-none`} />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-[#8B5CF6] uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Entertainment Taste DNA
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight flex items-center gap-3">
                {React.createElement(dna.icon, { className: "w-8 h-8 text-[#8B5CF6] shrink-0" })}
                {dna.label}
              </h2>
              <p className="text-[13.5px] text-muted-foreground max-w-md leading-relaxed font-medium">{dna.description}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-5 border-t border-white/5 mt-6 relative z-10">
              <span className="bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white/90 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Era Focus: {favoriteDecade}
              </span>
              <span className="bg-white/[0.03] border border-white/[0.08] px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-white/90 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" />
                Languages: {favoriteLanguage}
              </span>
            </div>
          </div>

          {/* Bento Widget 2: Queue Stats */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[24px] flex flex-col justify-between gap-6 border border-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgba(139,92,246,0.06)] transition-all duration-300">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              Watch Queue Stats
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Hours Saved</p>
                <p className="text-white"><Counter value={stats.hours} /> <span className="text-xs text-muted-foreground font-semibold">h</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Queue Total</p>
                <p className="text-white"><Counter value={stats.completed} /> <span className="text-xs text-muted-foreground font-semibold">titles</span></p>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground font-semibold border-t border-white/5 pt-3.5 flex items-center justify-between">
              <span>Avg Rating across watchlist:</span>
              <span className="text-white font-extrabold flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {stats.score}
              </span>
            </div>
          </div>

        </div>

        {/* ── BENTO SECOND TIER ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Bento Widget 3: Platform Breakdown */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-white/[0.05] flex flex-col justify-between hover:border-white/[0.08] transition-all duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5" />
                Platform Distribution
              </p>
              <div className="space-y-3">
                {platformDistribution.length > 0 ? platformDistribution.map(item => (
                  <div key={item.provider} className="space-y-1.5">
                    <div className="flex justify-between text-[11.5px] font-bold text-white/90">
                      <span>{item.name}</span>
                      <span className="text-[#8B5CF6]">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[#8B5CF6]" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-muted-foreground py-3">No stats compiled yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bento Widget 4: Achievements Progress */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-white/[0.05] hover:border-white/[0.08] transition-all duration-300">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-white/40 uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Achievements
              </span>
              <span className="text-[#8B5CF6] font-black">{achievementsProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-[#8B5CF6] rounded-full" style={{ width: `${achievementsProgress}%` }} />
            </div>
            <div className="space-y-2">
              {achievements.slice(0, 3).map(ach => (
                <div key={ach.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.01] border border-white/[0.03]">
                  <span className="text-lg shrink-0">
                    {React.createElement(ach.icon, { className: "w-5 h-5 text-[#8B5CF6] shrink-0" })}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-bold text-white truncate leading-none">{ach.title}</p>
                    <p className="text-[9.5px] text-muted-foreground truncate mt-0.5">{ach.description}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/10">UNLOCKED</span>
                  ) : (
                    <span className="text-[8px] bg-white/5 text-muted-foreground/45 font-extrabold px-1.5 py-0.5 rounded border border-white/5">LOCKED</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bento Widget 5: Discovery Journey logs */}
          <div className="bg-white/[0.02] backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-white/[0.05] flex flex-col justify-between hover:border-white/[0.08] transition-all duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-white/40 uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Taste DNA Scans
              </p>
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {recommendationHistory.length === 0 ? (
                  <p className="text-[11.5px] text-muted-foreground leading-normal py-4">
                    No recommendation history yet. Run a taste blueprint discover.
                  </p>
                ) : (
                  recommendationHistory.slice(0, 3).map((rec, i) => (
                    <div key={rec.movie.id} className="p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />
                      <Link href={`/movie/${rec.movie.id}`} className="min-w-0 flex-1 hover:text-[#8B5CF6] transition-colors">
                        <p className="text-[11.5px] font-bold text-white truncate leading-none mb-1">{rec.movie.title}</p>
                        <p className="text-[9.5px] text-muted-foreground truncate leading-none">{rec.aiExplanation}</p>
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
            className="mb-8 p-6 rounded-3xl bg-white/[0.01] border border-white/[0.04] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent-light" />
                <h3 className="text-[11.5px] font-extrabold text-white uppercase tracking-wider">Recently Viewed scans</h3>
              </div>
              <button
                onClick={() => setViewAllRecent(!viewAllRecent)}
                className="text-[11px] font-bold text-muted hover:text-white transition-colors"
              >
                {viewAllRecent ? 'View Less' : 'View All'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {visibleHistory.map(movie => (
                <div key={movie.id} className="relative rounded-2xl overflow-hidden aspect-poster bg-white/5 border border-white/10 group">
                  <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3.5 transition-all">
                    <p className="text-[12px] font-bold text-white truncate mb-1.5">{movie.title}</p>
                    <div className="flex gap-2">
                      <Link href={`/movie/${movie.id}`} className="flex-1">
                        <button className="w-full bg-accent hover:bg-accent-dark text-white rounded-lg py-1.5 text-[10px] font-bold transition-all">
                          Watch
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromContinueWatching(movie.id)}
                        className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-all text-[10px]"
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
