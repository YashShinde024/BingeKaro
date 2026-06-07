import React from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Bookmark, History, Settings, ChevronRight, Sparkles, Clock, LogOut, ShieldAlert, Check, Brain, Heart, Film, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOVIES, MOODS, GENRES } from '../lib/mockData';
import type { GenreId, MoodId, OTTProviderId } from '../types';
import { OTTBadge } from '../components/badges/OTTBadge';
import { useAuth } from '../context/AuthContext';
import { useWatchlist } from '../context/WatchlistContext';
import { useHistory } from '../context/HistoryContext';

const MOOD_EMOJI: Record<string, string> = {
  adventurous: '⛰', romantic: '♥', thrilling: '⚡', funny: '☺',
  dark: '◑', 'feel-good': '☀', emotional: '◎', inspiring: '✦',
  chill: '◻', scary: '◈', 'mind-bending': '◉', 'action-packed': '▶',
};

const ALL_PROVIDERS: { id: OTTProviderId; label: string }[] = [
  { id: 'netflix', label: 'Netflix' },
  { id: 'prime', label: 'Prime Video' },
  { id: 'disney', label: 'Disney+' },
  { id: 'jiohotstar', label: 'JioHotstar' },
  { id: 'zee5', label: 'Zee5' },
  { id: 'sonyliv', label: 'SonyLIV' },
  { id: 'appletv', label: 'Apple TV+' }
];

/* ─── Movie DNA personality computation ─── */
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
    return { label: 'Mind-Bending Explorer', emoji: '🧠', description: 'You crave narratives that challenge reality. Puzzle-boxes and cerebral cinema are your jam.', gradient: 'from-violet-500 to-indigo-600' };
  if (hasGenre('sci-fi') || hasGenre('fantasy'))
    return { label: 'Sci-Fi Enthusiast', emoji: '🚀', description: 'Galaxies, timelines, and alternate worlds — you see cinema as a portal to the impossible.', gradient: 'from-cyan-500 to-blue-600' };
  if (hasMood('thrilling') || hasGenre('thriller') || hasGenre('crime'))
    return { label: 'Thriller Hunter', emoji: '🫀', description: 'Edge-of-seat tension is your comfort zone. You live for the twist no one saw coming.', gradient: 'from-red-500 to-rose-700' };
  if (hasMood('romantic') || hasGenre('romance'))
    return { label: 'Hopeless Romantic', emoji: '❤️', description: 'You believe in stories that make hearts race. Love, loss, and connection move you deeply.', gradient: 'from-pink-500 to-rose-500' };
  if (hasMood('funny') || hasGenre('comedy'))
    return { label: 'Comedy Connoisseur', emoji: '😂', description: 'Life is better with laughter. You\'ve mastered the art of finding gems in comedy.', gradient: 'from-amber-400 to-orange-500' };
  if (hasMood('emotional') || hasGenre('drama'))
    return { label: 'Drama Devotee', emoji: '🎭', description: 'Authentic storytelling and human emotion are what make cinema transcendent for you.', gradient: 'from-emerald-500 to-teal-600' };
  if (hasMood('action-packed') || hasGenre('action'))
    return { label: 'Action Aficionado', emoji: '⚡', description: 'High-octane sequences and kinetic energy are your cinema language. Bring the adrenaline.', gradient: 'from-orange-500 to-red-600' };
  if (watchCount > 10)
    return { label: 'Weekend Binger', emoji: '🍿', description: 'One episode leads to another. You commit fully to worlds and characters without hesitation.', gradient: 'from-purple-500 to-violet-600' };
  return { label: 'Content Explorer', emoji: '🎬', description: 'You explore across genres with an open mind. No single label defines your taste — everything is fair game.', gradient: 'from-slate-500 to-zinc-600' };
}

/* Animated counter */
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

  const displayHistory = recentlyViewed.length > 0 ? recentlyViewed : MOVIES.slice(0, 8);

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
      <div className="min-h-screen bg-[#080808] pt-24 pb-32 flex items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass-card border border-white/[0.07] rounded-3xl p-8 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
          >
            <div className="w-16 h-16 mx-auto bg-accent/12 border border-accent/25 rounded-2xl flex items-center justify-center mb-6">
              <ShieldAlert className="w-7 h-7 text-accent-light" />
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Sync Your Profile</h2>
            <p className="text-[13.5px] text-muted leading-relaxed mb-8">
              Sign in to unlock personalized recommendations, save watchlists, and discover your Movie DNA.
            </p>
            <div className="space-y-3">
              <button
                onClick={openLoginModal}
                className="w-full h-11 rounded-xl bg-accent hover:bg-accent-light text-[13.5px] font-semibold text-white transition-all glow-accent-sm hover:scale-[1.01]"
              >
                Sign In / Sign Up
              </button>
              <Link to="/discover">
                <button className="w-full h-11 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.06] text-[13px] font-medium text-white transition-all">
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
    <div className="min-h-screen bg-[#080808] pt-24 pb-32 md:pb-16">
      <div className="max-w-3xl mx-auto px-6 lg:px-10">

        {/* User header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-5 mb-8"
        >
          {/* Avatar */}
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="w-full h-full rounded-3xl bg-gradient-to-br from-accent via-violet-500 to-accent-light
                         flex items-center justify-center ring-2 ring-white/10"
              style={{ boxShadow: '0 8px 32px rgba(139,92,246,0.4)' }}
            >
              <span className="text-[28px] font-black text-white tracking-tight">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#080808]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white tracking-[-0.02em]">{user.name}</h1>
            <p className="text-[13px] text-muted">{user.email}</p>
            <p className="text-[11px] text-muted/40 mt-0.5">Member since {user.joinedAt}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.08]
                               text-[13px] font-medium text-muted hover:text-white hover:border-white/15 transition-all">
              <Settings className="w-3.5 h-3.5" />
              Settings
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20
                         text-[13px] font-medium text-rose-400 hover:bg-rose-500/15 transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>

        {/* ── MOVIE DNA CARD ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="mb-8 rounded-3xl overflow-hidden relative"
          style={{ boxShadow: '0 16px 60px rgba(0,0,0,0.6)' }}
        >
          {/* Gradient background */}
          <div className={`absolute inset-0 bg-gradient-to-br ${dna.gradient} opacity-20`} />
          <div className="absolute inset-0 border border-white/[0.08] rounded-3xl" />
          <div className="absolute inset-0"
               style={{ background: 'rgba(10,8,20,0.75)', backdropFilter: 'blur(20px)' }} />

          <div className="relative p-6 sm:p-7">
            <div className="flex items-start gap-4">
              {/* DNA icon */}
              <motion.div
                animate={{ scale: [1, 1.08, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 bg-white/10 border border-white/15"
              >
                <span className="text-3xl">{dna.emoji}</span>
              </motion.div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Brain className="w-3.5 h-3.5 text-accent-light" />
                  <p className="text-[10px] font-bold text-accent-light uppercase tracking-widest">Movie DNA</p>
                </div>
                <h2 className="text-[22px] font-black text-white tracking-[-0.02em] mb-2">{dna.label}</h2>
                <p className="text-[13px] text-white/60 leading-relaxed">{dna.description}</p>
              </div>
            </div>

            {/* DNA stats row */}
            <div className="mt-5 pt-4 border-t border-white/[0.07] grid grid-cols-3 gap-3">
              {[
                { label: 'Top Genre', value: user.favoriteGenres?.[0] ? user.favoriteGenres[0].charAt(0).toUpperCase() + user.favoriteGenres[0].slice(1) : 'All genres', icon: <Film className="w-3.5 h-3.5" /> },
                { label: 'Top Mood', value: user.favoriteMoods?.[0] ? MOOD_EMOJI[user.favoriteMoods[0]] + ' ' + user.favoriteMoods[0].charAt(0).toUpperCase() + user.favoriteMoods[0].slice(1) : 'Any mood', icon: <Sparkles className="w-3.5 h-3.5" /> },
                { label: 'Watch Count', value: recentlyViewed.length, icon: <Tv className="w-3.5 h-3.5" /> },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <p className="text-[10px] text-muted/50 uppercase tracking-wider mb-1 flex items-center justify-center gap-1">
                    {item.icon} {item.label}
                  </p>
                  <p className="text-[13px] font-bold text-white capitalize truncate">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="grid grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: 'Watched', value: recentlyViewed.length, icon: <Clock className="w-4 h-4" />, color: 'text-accent-light' },
            { label: 'Watchlist', value: watchlist.length, icon: <Bookmark className="w-4 h-4" />, color: 'text-violet-400' },
            { label: 'Favorites', value: favorites.length, icon: <Heart className="w-4 h-4" />, color: 'text-rose-400' },
            { label: 'AI Picks', value: recentlyViewed.length > 0 ? Math.ceil(recentlyViewed.length * 1.5) : 15, icon: <Sparkles className="w-4 h-4" />, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.14 + i * 0.05 }}
              className="flex flex-col items-center py-5 px-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-black text-white tracking-[-0.02em]">
                <AnimatedCount target={stat.value} />
              </p>
              <p className="text-[11px] text-muted/60 mt-0.5 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Favorite Genres */}
        <ProfileSection title="Favorite Genres">
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => {
              const active = (user.favoriteGenres || []).includes(g.id);
              return (
                <motion.button
                  key={g.id}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 inline-block mr-1" />}
                  {g.label}
                </motion.button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Mood Preferences */}
        <ProfileSection title="Mood Preferences">
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
              const active = (user.favoriteMoods || []).includes(m.id);
              return (
                <motion.button
                  key={m.id}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleMood(m.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  <span className="text-[14px] font-mono">{MOOD_EMOJI[m.id]}</span>
                  {m.label}
                </motion.button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Subscriptions */}
        <ProfileSection title="My Subscriptions">
          <div className="flex flex-wrap gap-3">
            {ALL_PROVIDERS.map(p => {
              const active = (user.favoriteProviders || []).includes(p.id);
              return (
                <motion.button
                  key={p.id}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => toggleProvider(p.id)}
                  className={`inline-flex items-center gap-2 p-2 px-3.5 rounded-xl border transition-all duration-200 ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <OTTBadge provider={p.id} size="sm" />
                  <span className="text-[13px] font-semibold">{p.label}</span>
                </motion.button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Watch history */}
        <ProfileSection title="Recently Viewed" icon={<History className="w-4 h-4 text-muted" />}>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {displayHistory.slice(0, 8).map((movie, i) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
              >
                <Link to={`/movie/${movie.id}`} className="block group">
                  <div className="rounded-xl overflow-hidden aspect-poster bg-[#1a1a1a] ring-1 ring-white/[0.05] group-hover:ring-white/20 transition-all duration-200">
                    <img
                      src={movie.posterPath}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80'; }}
                    />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </ProfileSection>

        {/* Nav links */}
        <div className="space-y-1.5 mt-8">
          {[
            { label: 'View Full Watchlist', to: '/watchlist', icon: <Bookmark className="w-4 h-4" /> },
            { label: 'About KyaDekhu', to: '/about', icon: <Sparkles className="w-4 h-4" /> },
            { label: 'Privacy Policy', to: '/privacy', icon: null },
            { label: 'Terms of Service', to: '/terms', icon: null },
          ].map(item => (
            <Link key={item.to} to={item.to}>
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]
                              hover:bg-white/[0.05] hover:border-white/[0.10] transition-all duration-150 group">
                <div className="flex items-center gap-3">
                  {item.icon && <span className="text-muted group-hover:text-white transition-colors">{item.icon}</span>}
                  <span className="text-[14px] font-medium text-white/70 group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted/40 group-hover:text-muted transition-colors" />
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-10 pt-8 border-t border-white/[0.05]">
          <p className="text-[12px] text-muted/30">
            Powered by <span className="text-muted/50 font-medium">Nyxen</span>
          </p>
        </div>
      </div>
    </div>
  );
};

const ProfileSection: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, children,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="mb-9"
  >
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="text-[15px] font-bold text-white">{title}</h2>
    </div>
    {children}
  </motion.div>
);
