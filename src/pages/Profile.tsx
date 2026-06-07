import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, History, Settings, ChevronRight, Sparkles, TrendingUp, Clock, LogOut, ShieldAlert, Check } from 'lucide-react';
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

export const Profile: React.FC = () => {
  const { user, logout, openLoginModal, updatePreferences } = useAuth();
  const { watchlist } = useWatchlist();
  const { recentlyViewed } = useHistory();

  // Fallback to mock movies if recentlyViewed is empty
  const displayHistory = recentlyViewed.length > 0 ? recentlyViewed : MOVIES.slice(0, 8);

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
              Sign in to customize preferences, save watchlists, and unlock tailored recommendations.
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
          className="flex items-center gap-5 mb-10"
        >
          {/* Avatar */}
          <div className="relative w-[72px] h-[72px] flex-shrink-0">
            <div className="w-full h-full rounded-3xl bg-gradient-to-br from-accent via-violet-500 to-accent-light
                            flex items-center justify-center ring-2 ring-white/10"
                 style={{ boxShadow: '0 8px 32px rgba(139,92,246,0.35)' }}>
              <span className="text-[26px] font-black text-white tracking-tight">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-[#080808]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-black text-white tracking-[-0.02em]">{user.name}</h1>
            <p className="text-[13px] text-muted">{user.email}</p>
            <p className="text-[11px] text-muted/50 mt-0.5">Member since {user.joinedAt}</p>
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
              Sign Out
            </button>
          </div>
        </motion.div>

        {/* Stats grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-4 gap-3 mb-10"
        >
          {[
            { label: 'Watched Recently', value: recentlyViewed.length, icon: <Clock className="w-4 h-4" />, color: 'text-accent-light' },
            { label: 'Saved Watchlist', value: watchlist.length, icon: <Bookmark className="w-4 h-4" />, color: 'text-violet-400' },
            { label: 'AI Recommendations', value: recentlyViewed.length > 0 ? Math.ceil(recentlyViewed.length * 1.5) : 15, icon: <Sparkles className="w-4 h-4" />, color: 'text-pink-400' },
            { label: 'Day Streak', value: 6, icon: <TrendingUp className="w-4 h-4" />, color: 'text-amber-400' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.12 + i * 0.05 }}
              className="flex flex-col items-center py-5 px-2 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center"
            >
              <div className={`${stat.color} mb-2`}>{stat.icon}</div>
              <p className="text-2xl font-black text-white tracking-[-0.02em]">{stat.value}</p>
              <p className="text-[11px] text-muted/70 mt-0.5 leading-tight">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Favorite Genres */}
        <ProfileSection title="Favorite Genres (Click to toggle)">
          <div className="flex flex-wrap gap-2">
            {GENRES.map(g => {
              const active = (user.favoriteGenres || []).includes(g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => toggleGenre(g.id)}
                  className={`px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 inline-block mr-1" />}
                  {g.label}
                </button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Favorite Moods */}
        <ProfileSection title="Mood Preferences (Click to toggle)">
          <div className="flex flex-wrap gap-2">
            {MOODS.map(m => {
              const active = (user.favoriteMoods || []).includes(m.id);
              return (
                <button
                  key={m.id}
                  onClick={() => toggleMood(m.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 border ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5 inline-block" />}
                  <span className="text-[14px] font-mono">{MOOD_EMOJI[m.id]}</span>
                  {m.label}
                </button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Provider subscriptions */}
        <ProfileSection title="My Subscriptions (Click to toggle)">
          <div className="flex flex-wrap gap-3">
            {ALL_PROVIDERS.map(p => {
              const active = (user.favoriteProviders || []).includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleProvider(p.id)}
                  className={`inline-flex items-center gap-2 p-2 px-3.5 rounded-xl border transition-all duration-200 ${
                    active
                      ? 'bg-accent/15 border-accent/40 text-white'
                      : 'bg-white/[0.03] border-white/[0.07] text-muted hover:text-white hover:bg-white/[0.06]'
                  }`}
                >
                  <OTTBadge provider={p.id} size="sm" />
                  <span className="text-[13px] font-semibold">{p.label}</span>
                </button>
              );
            })}
          </div>
        </ProfileSection>

        {/* Watch history */}
        <ProfileSection title="Recently Viewed" icon={<History className="w-4 h-4 text-muted" />}>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {displayHistory.map((movie, i) => (
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
