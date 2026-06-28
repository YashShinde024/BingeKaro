"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, Film, Play, Activity, Star, PieChart, Award, Zap, 
  Compass, Smile, Brain, Laugh, Moon, Globe, Clock, ShieldAlert, Sparkles, LogOut
} from 'lucide-react';
import Link from 'next/link';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { useHistory } from '../../context/HistoryContext';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { api } from '../../lib/api';
import { FALLBACK_POSTER } from '../../lib/tmdb';
import type { OTTProviderId, GenreId, MoodId } from '../../types';

const DNA_ICONS: Record<string, React.ComponentType<any>> = {
  'Mind-Bending Explorer': Brain,
  'Sci-Fi Visionary': Globe,
  'Thriller Specialist': Zap,
  'Heartfelt Dreamer': Heart,
  'Comedy Aficionado': Laugh,
  'Ultimate Cinephile': Award,
  'Comfort Watcher': Smile,
  'Explorer': Compass,
  'Thrill Seeker': Zap,
  'Crime Addict': Film,
  'Anime Fanatic': Sparkles,
  'Global Viewer': Globe,
  'Binge Master': Award
};

const DNA_GRADIENTS: Record<string, string> = {
  'Mind-Bending Explorer': 'from-indigo-500 via-purple-500 to-pink-500',
  'Sci-Fi Visionary': 'from-cyan-500 to-blue-600',
  'Thriller Specialist': 'from-red-500 to-rose-600',
  'Heartfelt Dreamer': 'from-pink-500 via-rose-500 to-orange-500',
  'Comedy Aficionado': 'from-amber-400 to-orange-500',
  'Ultimate Cinephile': 'from-violet-500 via-purple-500 to-red-500',
  'Comfort Watcher': 'from-teal-400 to-emerald-500',
  'Explorer': 'from-slate-500 to-slate-300',
  'Thrill Seeker': 'from-rose-500 to-orange-600',
  'Crime Addict': 'from-purple-600 to-indigo-700',
  'Anime Fanatic': 'from-yellow-400 to-pink-500',
  'Global Viewer': 'from-emerald-500 to-blue-600',
  'Binge Master': 'from-amber-500 via-red-500 to-purple-600'
};

interface BackendDNA {
  persona: string;
  description: string;
  top_genres: string[];
  top_platforms: string[];
  languages: string[];
  signals: {
    history_count: number;
    favorites_count: number;
  };
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { watchlist, favorites } = useWatchlist();
  const { recentlyViewed, recommendationHistory, removeFromContinueWatching } = useHistory();
  const { getToken } = useClerkAuth();

  const [dnaData, setDnaData] = useState<BackendDNA | null>(null);
  const [loadingDna, setLoadingDna] = useState(false);
  const [viewAllRecent, setViewAllRecent] = useState(false);

  // Fetch DNA profile from FastAPI
  useEffect(() => {
    const fetchDNA = async () => {
      setLoadingDna(true);
      try {
        const token = await getToken();
        if (token) {
          const res = await api.getMovieDNA(token);
          if (res) {
            setDnaData(res);
          }
        }
      } catch (err) {
        console.error("Failed to fetch Taste DNA from backend", err);
      } finally {
        setLoadingDna(false);
      }
    };

    if (user) {
      fetchDNA();
    }
  }, [user, getToken, recentlyViewed, favorites]);

  // Statistics Computations
  const stats = useMemo(() => {
    // Assuming average movie is 120 minutes for calculation
    const totalRuntime = recentlyViewed.length * 120;
    const completedCount = recentlyViewed.length;
    const favoriteGenre = dnaData?.top_genres?.[0] || user?.favoriteGenres?.[0] || 'Drama';
    
    return {
      hours: Math.floor(totalRuntime / 60),
      completed: completedCount,
      genre: favoriteGenre,
      score: watchlist.length ? (watchlist.reduce((acc, m) => acc + m.rating, 0) / watchlist.length).toFixed(1) : '0.0',
    };
  }, [recentlyViewed, user, watchlist, dnaData]);

  // Compute platform preferences
  const platformDistribution = useMemo(() => {
    if (dnaData?.top_platforms && dnaData.top_platforms.length > 0) {
      const total = dnaData.top_platforms.length;
      return dnaData.top_platforms.map((plat, index) => {
        const key = plat.toLowerCase().replace(/\s+/g, '-');
        const regItem = PROVIDER_REGISTRY[key];
        return {
          provider: key as OTTProviderId,
          name: regItem?.name || plat,
          percentage: Math.round(((total - index) / ((total * (total + 1)) / 2)) * 100)
        };
      }).slice(0, 3);
    }
    
    // Fallback calculation from watchlist
    if (watchlist.length === 0) return [];
    const counts: Record<string, number> = {};
    watchlist.forEach(m => {
      m.providers?.forEach(p => {
        counts[p] = (counts[p] || 0) + 1;
      });
    });
    const total = Object.values(counts).reduce((a, b) => a + b, 0);
    return Object.entries(counts).map(([prov, count]) => ({
      provider: prov as OTTProviderId,
      name: PROVIDER_REGISTRY[prov]?.name || prov,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => b.percentage - a.percentage).slice(0, 3);
  }, [watchlist, dnaData]);

  // Compute achievements
  const achievements = useMemo(() => [
    { id: 'first-watch', title: 'First Steps', description: 'Add your first movie to the watchlist', icon: Film, unlocked: watchlist.length > 0 },
    { id: 'cinephile-scan', title: 'Cinephile Scan', description: 'Scan your taste DNA via discover tool', icon: Brain, unlocked: recommendationHistory.length > 0 },
    { id: 'favorites-pro', title: 'Curator Status', description: 'Build a list of 5+ loved movies', icon: Heart, unlocked: favorites.length >= 5 },
    { id: 'taste-explorer', title: 'Vibe Explorer', description: 'Save preferences with multiple genres', icon: Sparkles, unlocked: (user?.favoriteGenres?.length || 0) >= 3 },
  ], [watchlist, recommendationHistory, favorites, user]);

  const achievementsProgress = useMemo(() => {
    const unlocked = achievements.filter(a => a.unlocked).length;
    return Math.round((unlocked / achievements.length) * 100);
  }, [achievements]);

  if (!user) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-20 flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-accent/5 border border-accent/15 flex items-center justify-center mx-auto text-accent/40">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Guest Mode Profile</h2>
          <p className="text-[13.5px] text-muted-foreground leading-relaxed">
            Please sign in to compute your personalized Binge Profile, track watch achievements, and customize providers.
          </p>
        </div>
      </div>
    );
  }

  const dnaPersona = dnaData?.persona || 'Explorer';
  const DnaIcon = DNA_ICONS[dnaPersona] || Compass;
  const dnaGradient = DNA_GRADIENTS[dnaPersona] || 'from-slate-500 to-slate-300';
  const dnaDescription = dnaData?.description || 'Your cinematic footprint is emerging. Explore more moods and genres to unlock customized recommendations.';

  const visibleHistory = viewAllRecent ? recentlyViewed : recentlyViewed.slice(0, 4);

  return (
    <div className="min-h-screen bg-background pt-24 pb-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-border mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gradient-to-br from-accent to-accent-dark flex items-center justify-center border border-accent/20 shadow-[0_4px_24px_rgba(249,115,22,0.2)]">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
              )}
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-foreground tracking-tight leading-snug">{user.name}</h1>
              <p className="text-[12px] text-muted-foreground font-semibold">Member since {user.joinedAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/settings"
              className="px-4.5 py-2 bg-card/50 border border-border text-foreground rounded-xl text-[12px] font-bold hover:bg-card/70 transition-colors"
            >
              Preferences Blueprint
            </Link>
            <button
              onClick={logout}
              className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── BENTO DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

          {/* Bento Widget 1: Taste DNA */}
          <div className="md:col-span-2 bg-card/40 backdrop-blur-md p-6 rounded-[24px] relative overflow-hidden flex flex-col justify-between min-h-[220px] border border-border hover:border-accent/20 hover:shadow-[0_12px_40px_rgba(249,115,22,0.06)] transition-all duration-300">
            <div className={`absolute top-0 right-0 w-72 h-72 rounded-full bg-gradient-to-br ${dnaGradient} opacity-[0.07] blur-[75px] pointer-events-none`} />
            <div className="space-y-3 relative z-10">
              <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-accent uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                Entertainment Taste DNA
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground leading-tight flex items-center gap-3">
                <DnaIcon className="w-8 h-8 text-accent shrink-0" />
                {dnaPersona}
              </h2>
              <p className="text-[13.5px] text-muted-foreground max-w-md leading-relaxed font-medium">{dnaDescription}</p>
            </div>

            <div className="flex flex-wrap gap-3 pt-5 border-t border-border mt-6 relative z-10">
              <span className="bg-card/50 border border-border px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-foreground/90 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-accent" />
                Top Genre: {stats.genre}
              </span>
              <span className="bg-card/50 border border-border px-3.5 py-1.5 rounded-xl text-[11px] font-bold text-foreground/90 flex items-center gap-2">
                <Globe className="w-3.5 h-3.5 text-accent" />
                Language Focus: {dnaData?.languages?.[0] ? dnaData.languages[0].toUpperCase() : 'English'}
              </span>
            </div>
          </div>

          {/* Bento Widget 2: Queue Stats */}
          <div className="bg-card/40 backdrop-blur-md p-6 rounded-[24px] flex flex-col justify-between gap-6 border border-border hover:border-accent/20 hover:shadow-[0_12px_40px_rgba(249,115,22,0.06)] transition-all duration-300">
            <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              <Activity className="w-3.5 h-3.5" />
              Watch History Stats
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Hours Screened</p>
                <p className="text-foreground font-black text-3xl tracking-tight">{stats.hours} <span className="text-xs text-muted-foreground font-semibold">h</span></p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider">Total Watched</p>
                <p className="text-foreground font-black text-3xl tracking-tight">{stats.completed} <span className="text-xs text-muted-foreground font-semibold">titles</span></p>
              </div>
            </div>
            <div className="text-[11px] text-muted-foreground font-semibold border-t border-border pt-3.5 flex items-center justify-between">
              <span>Avg Rating across watchlist:</span>
              <span className="text-foreground font-extrabold flex items-center gap-0.5">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                {stats.score}
              </span>
            </div>
          </div>

        </div>

        {/* ── BENTO SECOND TIER ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Platform Distribution */}
          <div className="bg-card/40 backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-border flex flex-col justify-between hover:border-accent/20 transition-all duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5" />
                Platform Distribution
              </p>
              <div className="space-y-3">
                {platformDistribution.length > 0 ? platformDistribution.map(item => (
                  <div key={item.provider} className="space-y-1.5">
                    <div className="flex justify-between text-[11.5px] font-bold text-foreground/90">
                      <span>{item.name}</span>
                      <span className="text-accent">{item.percentage}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden">
                      <div className="h-full bg-accent" style={{ width: `${item.percentage}%` }} />
                    </div>
                  </div>
                )) : (
                  <p className="text-xs text-muted-foreground py-3">No stats compiled yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-card/40 backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-border hover:border-accent/20 transition-all duration-300">
            <div className="flex justify-between items-center text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest">
              <span className="flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5" />
                Achievements
              </span>
              <span className="text-accent font-black">{achievementsProgress}%</span>
            </div>
            <div className="h-1.5 w-full bg-muted/10 rounded-full overflow-hidden mb-3">
              <div className="h-full bg-accent rounded-full" style={{ width: `${achievementsProgress}%` }} />
            </div>
            <div className="space-y-2">
              {achievements.slice(0, 3).map(ach => (
                <div key={ach.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-card/20 border border-border/60">
                  <span className="text-lg shrink-0">
                    <ach.icon className="w-5 h-5 text-accent shrink-0" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11.5px] font-bold text-foreground truncate leading-none">{ach.title}</p>
                    <p className="text-[9.5px] text-muted-foreground truncate mt-0.5">{ach.description}</p>
                  </div>
                  {ach.unlocked ? (
                    <span className="text-[8px] bg-emerald-500/10 text-emerald-400 font-extrabold px-1.5 py-0.5 rounded border border-emerald-500/10">UNLOCKED</span>
                  ) : (
                    <span className="text-[8px] bg-muted/10 text-muted-foreground/45 font-extrabold px-1.5 py-0.5 rounded border border-border/60">LOCKED</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Discovery History / AI Scans */}
          <div className="bg-card/40 backdrop-blur-md p-6 rounded-[24px] space-y-4 border border-border flex flex-col justify-between hover:border-accent/20 transition-all duration-300">
            <div className="space-y-3">
              <p className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                Taste DNA Scans
              </p>
              <div className="space-y-2.5 max-h-[160px] overflow-y-auto pr-1">
                {recommendationHistory.length === 0 ? (
                  <p className="text-[11.5px] text-muted-foreground leading-normal py-4">
                    No recommendation history yet. Run a taste blueprint discover.
                  </p>
                ) : (
                  recommendationHistory.slice(0, 3).map((rec) => (
                    <div key={rec.movie.id} className="p-2.5 rounded-xl bg-card/20 border border-border/60 flex items-center gap-2.5">
                      <Sparkles className="w-3.5 h-3.5 text-accent shrink-0" />
                      <Link href={`/movie/${rec.movie.id}`} className="min-w-0 flex-1 hover:text-accent transition-colors">
                        <p className="text-[11.5px] font-bold text-foreground truncate leading-none mb-1">{rec.movie.title}</p>
                        <p className="text-[9.5px] text-muted-foreground truncate leading-none">{rec.aiExplanation}</p>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Dynamic Watch History timeline */}
        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mb-8 p-6 rounded-3xl bg-card/20 border border-border space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" />
                <h3 className="text-[11.5px] font-extrabold text-foreground uppercase tracking-wider">Recently Screened History</h3>
              </div>
              <button
                onClick={() => setViewAllRecent(!viewAllRecent)}
                className="text-[11px] font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                {viewAllRecent ? 'View Less' : 'View All'}
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {visibleHistory.map(movie => (
                <div key={movie.id} className="relative rounded-2xl overflow-hidden aspect-[2/3] bg-card/30 border border-border group">
                  {movie.posterPath ? (
                    <img 
                      src={movie.posterPath.startsWith('http') ? movie.posterPath : `https://image.tmdb.org/t/p/w300${movie.posterPath}`} 
                      alt="" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.target as any).src = FALLBACK_POSTER; }}
                    />
                  ) : (
                    <div className="w-full h-full bg-card/30 flex items-center justify-center text-foreground font-bold p-3 text-center text-xs">{movie.title}</div>
                  )}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-3.5 transition-all">
                    <p className="text-[12px] font-bold text-white truncate mb-1.5">{movie.title}</p>
                    <div className="flex gap-2">
                      <Link href={`/movie/${movie.id}`} className="flex-1">
                        <button className="w-full bg-accent hover:bg-accent-dark text-white rounded-lg py-1.5 text-[10px] font-bold transition-all">
                          Details
                        </button>
                      </Link>
                      <button
                        onClick={() => removeFromContinueWatching(movie.id)}
                        className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-white transition-all text-[10px]"
                        title="Dismiss"
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
