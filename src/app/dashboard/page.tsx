"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useWatchlist } from '../../context/WatchlistContext';
import { useHistory } from '../../context/HistoryContext';
import { Sparkles, Film, LogIn, LayoutGrid, BookmarkCheck, Heart, Award, Eye, Flame, Compass, RefreshCw, BarChart2, Tv } from 'lucide-react';
import { MovieCard } from '../../components/cards/MovieCard';
import { MOVIES } from '../../lib/mockData';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, openLoginModal } = useAuth();
  const { watchlist, favorites, movieStatuses } = useWatchlist();
  const { recentlyViewed, recommendationHistory } = useHistory();

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center space-y-6 pt-24">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6]">
          <Film className="w-7 h-7" />
        </div>
        <div className="space-y-2 max-w-sm">
          <h1 className="text-xl font-bold text-white">Access Denied</h1>
          <p className="text-[13px] text-muted-foreground">
            You need to be signed in to view your personalized discovery dashboard.
          </p>
        </div>
        <button
          onClick={openLoginModal}
          className="h-10 px-5 rounded-xl bg-[#8B5CF6] text-[12.5px] font-bold text-white flex items-center gap-1.5 shadow-lg hover:bg-[#8B5CF6]/90 transition-all"
        >
          <LogIn className="w-4 h-4" />
          Sign In Now
        </button>
      </div>
    );
  }

  // Calculate stats
  const watchlistCount = watchlist.length;
  const favoritesCount = favorites.length;
  const moviesSeenCount = watchlist.filter(m => movieStatuses[m.id] === 'completed' && m.type === 'movie').length;
  const showsSeenCount = watchlist.filter(m => movieStatuses[m.id] === 'completed' && m.type === 'tv').length;

  // Calculate insights: Top Genre
  const genreCounts: Record<string, number> = {};
  const allUserMovies = [...watchlist, ...favorites];
  allUserMovies.forEach(m => {
    m.genres.forEach(g => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });
  let topGenre = 'None';
  let maxGenreCount = 0;
  Object.entries(genreCounts).forEach(([genre, count]) => {
    if (count > maxGenreCount) {
      maxGenreCount = count;
      topGenre = genre;
    }
  });

  // Calculate insights: Top Platform
  const platformCounts: Record<string, number> = {};
  allUserMovies.forEach(m => {
    m.providers.forEach(p => {
      platformCounts[p] = (platformCounts[p] || 0) + 1;
    });
  });
  let topPlatform = 'None';
  let maxPlatformCount = 0;
  Object.entries(platformCounts).forEach(([p, count]) => {
    if (count > maxPlatformCount) {
      maxPlatformCount = count;
      topPlatform = p.replace('-', ' ');
    }
  });

  // Movie DNA (genre distribution)
  const totalGenresCount = Object.values(genreCounts).reduce((a, b) => a + b, 0);
  const movieDna = Object.entries(genreCounts)
    .map(([genre, count]) => ({
      genre,
      percentage: totalGenresCount > 0 ? Math.round((count / totalGenresCount) * 100) : 0
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 4);

  // Recommendations for taste
  const matchedMovies = MOVIES.filter(m => 
    m.genres.some(g => user.favoriteGenres.includes(g))
  ).slice(0, 6);

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 pb-20 px-6 sm:px-10 max-w-[1400px] mx-auto space-y-10">
      
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[24px] border border-white/[0.08] p-6 sm:p-8 bg-gradient-to-r from-white/[0.02] to-white/[0.01]"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#8B5CF6]/10 filter blur-[80px] pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/20 text-[10px] font-bold text-[#8B5CF6] uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              Taste Engine Calibrated
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Welcome Back, {user.name}!
            </h1>
            <p className="text-[13px] text-muted-foreground max-w-xl">
              We've calculated your preferences. Check your real-time stats, insights, and tailored recommendations.
            </p>
          </div>
          <Link href="/profile">
            <button className="h-10 px-4 rounded-xl border border-white/[0.08] text-[12px] font-bold bg-white/[0.02] hover:bg-white/[0.05] transition-all">
              Edit taste profile
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Stats Counter Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Watchlist Items', count: watchlistCount, icon: BookmarkCheck, color: 'text-violet-400' },
          { label: 'Favorites Saved', count: favoritesCount, icon: Heart, color: 'text-rose-400' },
          { label: 'Movies Completed', count: moviesSeenCount, icon: Film, color: 'text-sky-400' },
          { label: 'TV Shows Completed', count: showsSeenCount, icon: Tv, color: 'text-emerald-400' }
        ].map((stat, i) => (
          <div key={i} className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] flex items-center justify-between">
            <div>
              <span className="text-[11px] font-black text-muted-foreground uppercase tracking-widest block">{stat.label}</span>
              <span className="text-2xl sm:text-3xl font-black text-white mt-1 block">{stat.count}</span>
            </div>
            <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
          </div>
        ))}
      </div>

      {/* Insights & Movie DNA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Genre & Top Platform */}
        <div className="p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-6">
          <h3 className="text-[14px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 border-b border-white/[0.04] pb-3">
            <Award className="w-4 h-4 text-[#8B5CF6]" />
            Taste Indicators
          </h3>

          <div className="space-y-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Top Genre</span>
              <span className="text-lg font-bold text-white capitalize mt-1 block">{topGenre}</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">Top Stream Channel</span>
              <span className="text-lg font-bold text-white capitalize mt-1 block">{topPlatform}</span>
            </div>
          </div>
        </div>

        {/* Movie DNA Visualizer */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.01] border border-white/[0.05] space-y-4">
          <h3 className="text-[14px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2 border-b border-white/[0.04] pb-3">
            <BarChart2 className="w-4 h-4 text-[#8B5CF6]" />
            Movie DNA
          </h3>

          {movieDna.length > 0 ? (
            <div className="space-y-4.5">
              {movieDna.map(item => (
                <div key={item.genre} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-white">
                    <span className="capitalize">{item.genre}</span>
                    <span>{item.percentage}%</span>
                  </div>
                  <div className="h-2 w-full bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B5CF6]" style={{ width: `${item.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center text-xs text-muted-foreground">
              Add films to your favorites or watchlist to plot your Movie DNA map.
            </div>
          )}
        </div>
      </div>

      {/* Activity Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recently Viewed */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
            <Eye className="w-4.5 h-4.5 text-[#8B5CF6]" />
            Recently Viewed
          </h3>
          <div className="flex gap-4 overflow-x-auto scroll-row pb-4">
            {recentlyViewed.length > 0 ? (
              recentlyViewed.map((m, idx) => (
                <MovieCard key={m.id} movie={m} index={idx} size="sm" />
              ))
            ) : (
              <div className="w-full py-12 text-center text-xs text-muted-foreground border border-dashed border-white/5 rounded-2xl">
                No recently viewed movies.
              </div>
            )}
          </div>
        </div>

        {/* Recent AI Recommendations History */}
        <div className="space-y-4">
          <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4.5 h-4.5 text-[#8B5CF6]" />
            Recent AI Picks History
          </h3>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {recommendationHistory.length > 0 ? (
              recommendationHistory.map((rec, i) => (
                <Link key={i} href={`/movie/${rec.movie.id}`} className="block">
                  <div className="p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.01] hover:bg-white/[0.03] transition-all flex items-start gap-4">
                    <div className="w-10 aspect-poster rounded bg-white/5 overflow-hidden shrink-0">
                      <img src={rec.movie.posterPath} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-white truncate">{rec.movie.title}</p>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-1 leading-normal">
                        {rec.aiExplanation}
                      </p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="py-12 text-center text-xs text-muted-foreground border border-dashed border-white/5 rounded-2xl">
                No recent recommendations generated.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Recommendations For Your Taste */}
      <div className="space-y-4 pt-4 border-t border-white/[0.05]">
        <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="w-4.5 h-4.5 text-[#8B5CF6]" />
          Recommendations For Your Taste
        </h3>
        <div className="flex gap-4 overflow-x-auto scroll-row pb-4">
          {matchedMovies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} index={idx} />
          ))}
        </div>
      </div>

    </div>
  );
}
