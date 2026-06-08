import React from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Bookmark, Sparkles, Clock, LogOut, ShieldAlert, Heart, Film, Tv, Play, Activity, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOVIES, MOODS, GENRES } from '../lib/mockData';
import type { GenreId, MoodId, OTTProviderId } from '../types';
import { ProviderPill } from '../components/badges/ProviderLogo';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';
import { PROVIDER_REGISTRY } from '../lib/providers';

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
    return { label: 'Romantic Dreamer', emoji: '❤️', description: 'You connect with stories of chemistry and connection. Love and longing speak to you.', gradient: 'from-pink-500 to-rose-500' };
  if (hasMood('funny') || hasGenre('comedy'))
    return { label: 'Comedy Connoisseur', emoji: '😂', description: 'Life is best enjoyed with laughter. You know how to find the cleverest humors.', gradient: 'from-amber-400 to-orange-500' };
  if (hasMood('emotional') || hasGenre('drama'))
    return { label: 'Drama Devotee', emoji: '🎭', description: 'Character studies and human stories are your true north. You value raw emotion.', gradient: 'from-emerald-500 to-teal-600' };
  if (hasMood('action-packed') || hasGenre('action'))
    return { label: 'Action Aficionado', emoji: '⚡', description: 'Adrenaline is your second language. High kinetic energy and rapid pacing are must-haves.', gradient: 'from-orange-500 to-red-600' };
  if (watchCount > 8)
    return { label: 'Weekend Binger', emoji: '🍿', description: 'You dive deep into film catalogs, checking off list entries without hesitation.', gradient: 'from-purple-500 to-violet-600' };
  return { label: 'Content Explorer', emoji: '🎬', description: 'A flexible taste profile. You choose widely across genres, matching whatever the night requests.', gradient: 'from-slate-500 to-zinc-600' };
}

const AnimatedCount: React.FC<{ target: number }> = ({ target }) => {
  const motionVal = useMotionValue(0);
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    const controls = animate(motionVal, target, { duration: 1.2, ease: 'easeOut' });
    const unsub = motionVal.on('change', v => setDisplay(Math.floor(v)));
    return () => { controls.stop(); unsub(); };
  }, [target]);

  return <span>{display}</span>;
};

export const Profile: React.FC = () => {
  const { user, logout, openLoginModal, updatePreferences } = useAuth();
  const { watchlist, favorites } = useWatchlist();
  const { recentlyViewed } = useHistory();
  const [showAllHistory, setShowAllHistory] = React.useState(false);

  const displayHistory = recentlyViewed.length > 0 ? recentlyViewed : MOVIES.slice(0, 8);

  const favoriteDecade = React.useMemo(() => {
    const list = recentlyViewed.length > 0 ? recentlyViewed : MOVIES.slice(0, 4);
    const years = list.map(m => m.year);
    const decades = years.map(y => Math.floor(y / 10) * 10);
    const counts = decades.reduce((acc, d) => {
      acc[d] = (acc[d] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);
    const topDecade = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return topDecade ? `${topDecade}s` : '2020s';
  }, [recentlyViewed]);

  const favoriteLanguage = React.useMemo(() => {
    const list = recentlyViewed.length > 0 ? recentlyViewed : MOVIES.slice(0, 4);
    const langs = list.map(m => m.language);
    const counts = langs.reduce((acc, l) => {
      acc[l] = (acc[l] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topLang = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
    return topLang || 'English';
  }, [recentlyViewed]);

  const achievements = React.useMemo(() => {
    return [
      { id: 'first_watch', label: '🎬 First Watch', desc: 'Scanned your first movie suggestion', unlocked: recentlyViewed.length > 0 },
      { id: 'scans_10', label: '📺 Cinephile Scans', desc: 'Accumulated 10 scans on KyaDekhu', unlocked: recentlyViewed.length >= 10 },
      { id: 'favs_pro', label: '❤️ Favorites Pro', desc: 'Saved 3+ absolute favorites', unlocked: favorites.length >= 3 },
      { id: 'explorer', label: '🧭 Taste Explorer', desc: 'Selected 3+ preferred genres', unlocked: (user?.favoriteGenres || []).length >= 3 },
    ];
  }, [recentlyViewed.length, favorites.length, user?.favoriteGenres]);

  const insights = React.useMemo(() => {
    const genre = user?.favoriteGenres?.[0] || 'Drama';
    const mood = user?.favoriteMoods?.[0] || 'feel-good';
    return [
      { text: `Your recommendations lean 65% toward ${genre} titles.`, trend: 'up' },
      { text: `You watch 40% more ${mood} content than the average user.`, trend: 'boost' }
    ];
  }, [user?.favoriteGenres, user?.favoriteMoods]);

  const personalizedRecs = React.useMemo(() => {
    const genre = user?.favoriteGenres?.[0] || 'drama';
    return MOVIES
      .filter(m => m.genres.includes(genre as GenreId))
      .slice(0, 4);
  }, [user?.favoriteGenres]);

  const activityHistory = React.useMemo(() => {
    return [
      { text: 'Sync profile preferences updated', time: '2 hours ago' },
      { text: `Watchlist contains ${watchlist.length} saved titles`, time: '1 day ago' },
      { text: 'Mapped cinematic identity DNA profile', time: 'Recent' }
    ];
  }, [watchlist.length]);

  const dna = React.useMemo(() =>
    computeMovieDNA(
      user?.favoriteGenres || [],
      user?.favoriteMoods || [],
      recentlyViewed.length
    ), [user?.favoriteGenres, user?.favoriteMoods, recentlyViewed.length]
  );

  const toggleGenre = (genreId: GenreId) => {
    if (!user) return;
    const current = user.favoriteGenres || [];
    const updated = current.includes(genreId)
      ? current.filter(id => id !== genreId)
      : [...current, genreId];
    updatePreferences(updated, user.favoriteMoods || [], user.favoriteProviders || []);
  };

  const toggleMood = (moodId: MoodId) => {
    if (!user) return;
    const current = user.favoriteMoods || [];
    const updated = current.includes(moodId)
      ? current.filter(id => id !== moodId)
      : [...current, moodId];
    updatePreferences(user.favoriteGenres || [], updated, user.favoriteProviders || []);
  };

  const toggleProvider = (providerId: OTTProviderId) => {
    if (!user) return;
    const current = user.favoriteProviders || [];
    const updated = current.includes(providerId)
      ? current.filter(id => id !== providerId)
      : [...current, providerId];
    updatePreferences(user.favoriteGenres || [], user.favoriteMoods || [], updated);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-32 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="border border-white/[0.08] rounded-card p-8 bg-[#0c0c0c] shadow-[0_16px_40px_rgba(0,0,0,0.8)]"
          >
            <div className="w-16 h-16 mx-auto bg-accent/10 border border-accent/20 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-7 h-7 text-accent-light" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sync Profile</h2>
            <p className="text-[13px] text-muted/65 leading-relaxed mb-8">
              Sign in to unlock personalized streaming lists, save watched histories, and map your cinematic DNA.
            </p>
            <div className="space-y-3">
              <button
                onClick={openLoginModal}
                className="w-full h-11 rounded-btn bg-accent hover:bg-accent-light text-[13.5px] font-bold text-white transition-all shadow-[0_4px_15px_rgba(139,92,246,0.3)]"
              >
                Sign In
              </button>
              <Link to="/discover" className="block">
                <button className="w-full h-11 rounded-btn bg-white/5 border border-white/10 text-[13px] font-bold text-white hover:bg-white/10 transition-all">
                  Continue as Guest
                </button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        {/* User Card */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-8"
        >
          <div className="relative w-16 h-16">
            <div className="w-full h-full rounded-2xl bg-gradient-to-br from-accent to-accent-light flex items-center justify-center border border-white/10 shadow-[0_4px_15px_rgba(139,92,246,0.4)]">
              <span className="text-2xl font-black text-white">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#050505]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white tracking-tight leading-none mb-1">{user.name}</h1>
            <p className="text-[12.5px] text-muted/60">{user.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </motion.div>

        {/* ── MOVIE DNA ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 rounded-card overflow-hidden border border-white/[0.08] bg-[#0c0c0c] shadow-[0_20px_50px_rgba(0,0,0,0.65)] relative"
        >
          {/* Subtle DNA background glow */}
          <div className={`absolute inset-0 bg-gradient-to-r ${dna.gradient} opacity-5 blur-2xl pointer-events-none`} />

          <div className="relative p-6 sm:p-7">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.08] flex items-center justify-center shrink-0">
                <span className="text-3xl">{dna.emoji}</span>
              </div>
              <div className="flex-1 space-y-1">
                <span className="text-[9px] font-bold text-accent-light uppercase tracking-widest block">Cinematic Identity</span>
                <h2 className="text-[20px] font-black text-white tracking-tight">{dna.label}</h2>
                <p className="text-[13px] text-muted/70 leading-relaxed font-medium">{dna.description}</p>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-white/[0.05] grid grid-cols-4 gap-4 text-center">
              {[
                { label: 'Top Genre', value: user.favoriteGenres?.[0] ? user.favoriteGenres[0] : 'None', icon: Film },
                { label: 'Top Mood', value: user.favoriteMoods?.[0] ? user.favoriteMoods[0] : 'None', icon: Sparkles },
                { label: 'Decade', value: favoriteDecade, icon: Clock },
                { label: 'Language', value: favoriteLanguage, icon: Tv },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <span className="text-[9px] font-bold text-muted/30 uppercase tracking-widest flex items-center justify-center gap-1">
                    {React.createElement(stat.icon, { className: 'w-2.5 h-2.5 text-muted/40' })}
                    {stat.label}
                  </span>
                  <p className="text-[12px] font-bold text-white capitalize truncate">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Watch stats row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Scanned', value: recentlyViewed.length, icon: Clock, color: 'text-accent-light' },
            { label: 'Watchlist', value: watchlist.length, icon: Bookmark, color: 'text-violet-400' },
            { label: 'Favorites', value: favorites.length, icon: Heart, color: 'text-rose-400' },
            { label: 'AI Insights', value: recentlyViewed.length > 0 ? Math.ceil(recentlyViewed.length * 1.5) : 8, icon: Sparkles, color: 'text-amber-400' },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center py-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-center">
              <stat.icon className={`w-4 h-4 ${stat.color} mb-1.5`} />
              <p className="text-xl font-black text-white">
                <AnimatedCount target={stat.value} />
              </p>
              <span className="text-[10.5px] font-semibold text-muted/50 mt-0.5">{stat.label}</span>
            </div>
          ))}
        </motion.div>

        {/* Continue Watching Section */}
        {recentlyViewed.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
            className="mb-8 p-5 rounded-card bg-[#0c0c0c] border border-white/[0.08] space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Play className="w-4 h-4 text-accent-light" />
                <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Continue Watching</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {recentlyViewed.slice(0, 2).map(movie => (
                <div key={movie.id} className="flex items-center gap-3.5 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
                  <img src={movie.posterPath} alt="" className="w-10 h-14 object-cover rounded-lg bg-white/5" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-bold text-white truncate">{movie.title}</p>
                    <p className="text-[10.5px] text-muted/50 mt-0.5">{movie.year} · {movie.runtime}m</p>
                  </div>
                  <Link to={`/movie/${movie.id}`} className="p-2 rounded-full bg-accent/10 text-accent-light hover:bg-accent/20 hover:text-white transition-all shrink-0">
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Personalized Recommendations */}
        {personalizedRecs.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.19 }}
            className="mb-8 p-5 rounded-card bg-white/[0.01] border border-white/[0.05] space-y-4"
          >
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Personalized For You</h3>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {personalizedRecs.map(movie => (
                <Link key={movie.id} to={`/movie/${movie.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.04, y: -2 }}
                    className="relative rounded-xl overflow-hidden aspect-poster bg-white/5 border border-white/10 group"
                  >
                    <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Recommendation Trends & Insights */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-5 rounded-card bg-white/[0.02] border border-white/[0.06] space-y-3.5"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">📈</span>
            <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Recommendation Trends</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {insights.map((ins, i) => (
              <div key={i} className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.04] flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full shrink-0 ${ins.trend === 'up' ? 'bg-emerald-400 animate-pulse' : 'bg-accent-light'}`} />
                <p className="text-[12px] text-white/80 leading-snug">{ins.text}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Achievements System */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="mb-8 p-5 rounded-card bg-[#0c0c0c] border border-white/[0.08] space-y-4"
        >
          <div className="flex items-center gap-1.5">
            <span className="text-sm">🏆</span>
            <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Achievements</h3>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((ach) => (
              <div 
                key={ach.id} 
                className={`p-3.5 rounded-2xl border transition-all duration-300 flex flex-col gap-1 ${
                  ach.unlocked 
                    ? 'bg-accent/[0.03] border-accent/20 shadow-[0_0_15px_rgba(139,92,246,0.05)]' 
                    : 'bg-white/[0.01] border-white/[0.04] opacity-40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-white">{ach.label}</span>
                  {ach.unlocked ? (
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">UNLOCKED</span>
                  ) : (
                    <span className="text-[9px] font-bold text-muted/40 bg-white/5 px-1.5 py-0.5 rounded uppercase tracking-wider">LOCKED</span>
                  )}
                </div>
                <span className="text-[11px] text-muted/60 leading-normal">{ach.desc}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Activity History Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.23 }}
          className="mb-10 p-5 rounded-card bg-[#0c0c0c] border border-white/[0.08] space-y-4"
        >
          <div className="flex items-center gap-1.5">
            <Activity className="w-4 h-4 text-accent-light" />
            <h3 className="text-[12.5px] font-bold text-white uppercase tracking-wider">Activity Timeline</h3>
          </div>
          <div className="space-y-3.5">
            {activityHistory.map((act, i) => (
              <div key={i} className="flex justify-between items-start gap-4 text-[12.5px]">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1 shrink-0" />
                  <span className="text-white/80">{act.text}</span>
                </div>
                <span className="text-[11px] text-muted/40 font-semibold shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Preferences Toggles */}
        <div className="space-y-8">
          {/* Favorite Providers (Pills) */}
          <ProfileSection title="Favorite Providers">
            <div className="flex flex-wrap gap-2.5">
              {ALL_PROVIDERS.map(p => {
                const active = (user.favoriteProviders || []).includes(p.id);
                return (
                  <motion.button
                    key={p.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => toggleProvider(p.id)}
                    className={`shrink-0 cursor-pointer p-1 rounded-xl transition-all ${
                      active 
                        ? 'ring-1 ring-accent/50 shadow-[0_0_12px_rgba(139,92,246,0.15)] bg-accent/5' 
                        : 'opacity-55 hover:opacity-100'
                    }`}
                  >
                    <ProviderPill provider={p.id} size="sm" />
                  </motion.button>
                );
              })}
            </div>
          </ProfileSection>

          {/* Favorite Genres */}
          <ProfileSection title="Favorite Genres">
            <div className="flex flex-wrap gap-2">
              {GENRES.map(g => {
                const active = (user.favoriteGenres || []).includes(g.id);
                return (
                  <motion.button
                    key={g.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleGenre(g.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-accent border-accent text-white shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    {g.label}
                  </motion.button>
                );
              })}
            </div>
          </ProfileSection>

          {/* Favorite Moods */}
          <ProfileSection title="Favorite Moods">
            <div className="flex flex-wrap gap-2">
              {MOODS.map(m => {
                const active = (user.favoriteMoods || []).includes(m.id);
                return (
                  <motion.button
                    key={m.id}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => toggleMood(m.id)}
                    className={`px-3.5 py-1.5 rounded-full text-[12px] font-bold border transition-all cursor-pointer ${
                      active
                        ? 'bg-accent border-accent text-white shadow-[0_2px_12px_rgba(139,92,246,0.3)]'
                        : 'bg-white/[0.02] border-white/[0.06] text-muted hover:bg-white/[0.05] hover:text-white'
                    }`}
                  >
                    <span className="mr-1.5 font-mono">{MOOD_EMOJI[m.id]}</span>
                    {m.label}
                  </motion.button>
                );
              })}
            </div>
          </ProfileSection>

          {/* Recently Viewed */}
          <div className="space-y-3.5 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="text-[13.5px] font-bold text-white uppercase tracking-wider">Recently Viewed Scans</h3>
              {displayHistory.length > 8 && (
                <button 
                  onClick={() => setShowAllHistory(!showAllHistory)}
                  className="text-[11.5px] font-bold text-accent-light hover:text-white transition-colors"
                >
                  {showAllHistory ? 'Show Less' : 'View All'}
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-2.5">
              {displayHistory.slice(0, showAllHistory ? displayHistory.length : 8).map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.04, y: -2 }}
                  className="rounded-xl overflow-hidden aspect-poster bg-white/5 border border-white/10"
                >
                  <Link to={`/movie/${movie.id}`}>
                    <img src={movie.posterPath} alt="" className="w-full h-full object-cover" />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProfileSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="space-y-3.5 pb-2"
  >
    <h3 className="text-[13.5px] font-bold text-white uppercase tracking-wider">{title}</h3>
    {children}
  </motion.div>
);
