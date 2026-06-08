"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Film, LogIn, LayoutGrid, BookmarkCheck, Heart } from 'lucide-react';
import { MovieCard } from '../../components/cards/MovieCard';
import { getAIPicks, getTrendingMovies, MOVIES } from '../../lib/mockData';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, openLoginModal } = useAuth();
  const router = useRouter();

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

  // Filter movies that match user's selected genres
  const matchedMovies = MOVIES.filter(m => 
    m.genres.some(g => user.favoriteGenres.includes(g))
  );

  const displayMovies = matchedMovies.length > 0 ? matchedMovies : MOVIES.slice(0, 6);
  const aiPicks = getAIPicks().slice(0, 5);

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
              We've synced your cinema preferences. Explore your personal dashboard designed to surface releases you'll love.
            </p>
          </div>
          
          <div className="flex gap-3 shrink-0">
            <Link href="/profile">
              <button className="h-10 px-4 rounded-xl border border-white/[0.08] text-[12px] font-bold bg-white/[0.02] hover:bg-white/[0.05] transition-all">
                Edit taste profile
              </button>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Grid of Preferences Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-3">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <LayoutGrid className="w-4 h-4" />
            <h4 className="text-[12px] font-bold uppercase tracking-wider">My Genres</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.favoriteGenres.map(g => (
              <span key={g} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10.5px] font-semibold text-white/80 capitalize">
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-3">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <BookmarkCheck className="w-4 h-4" />
            <h4 className="text-[12px] font-bold uppercase tracking-wider">Services</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {user.favoriteProviders.map(p => (
              <span key={p} className="px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/[0.05] text-[10.5px] font-semibold text-white/80 capitalize">
                {p.replace('-', ' ')}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.05] space-y-3">
          <div className="flex items-center gap-2 text-[#8B5CF6]">
            <Heart className="w-4 h-4" />
            <h4 className="text-[12px] font-bold uppercase tracking-wider">Quick Recommendation</h4>
          </div>
          <p className="text-[11px] text-muted-foreground leading-normal">
            BingeKaro AI is parsing active streaming catalog details for your provider list.
          </p>
        </div>
      </div>

      {/* Row 1 - Matched by Genre preferences */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
          <Film className="w-4 h-4 text-[#8B5CF6]" />
          Recommendations For Your Taste
        </h3>
        <div className="flex gap-4 overflow-x-auto scroll-row pb-4">
          {displayMovies.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} index={idx} />
          ))}
        </div>
      </div>

      {/* Row 2 - AI recommendations */}
      <div className="space-y-4">
        <h3 className="text-[16px] font-bold text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#8B5CF6]" />
          Smart AI Recommendations
        </h3>
        <div className="flex gap-4 overflow-x-auto scroll-row pb-4">
          {aiPicks.map((movie, idx) => (
            <MovieCard key={movie.id} movie={movie} index={idx} />
          ))}
        </div>
      </div>
    </div>
  );
}
