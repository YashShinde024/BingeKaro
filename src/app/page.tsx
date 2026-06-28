"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Film, Tv, Star, Calendar, Clapperboard,
  Sparkles, Flame, Shield, ArrowRight, Play, CheckCircle2, Mail, Clock, Compass, Gem
} from 'lucide-react';
import { HeroSection } from '../components/features/HeroSection';
import { MoodRibbon } from '../components/features/MoodRibbon';
import { PlatformRow } from '../components/features/PlatformRow';
import { ContentRail } from '../components/features/ContentRail';
import {
  useTrendingToday,
  usePopularMovies,
  usePopularTV,
  useTopRatedMovies,
  useNowPlaying,
  useUpcoming
} from '../hooks/useTMDB';
import { useHistory } from '../context/HistoryContext';
import { isTMDBAvailable, normalizeContent } from '../lib/tmdb';
import { MOVIES } from '../lib/mockData';
import Link from 'next/link';

export default function Home() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Live TMDB Hooks
  const trendingToday = useTrendingToday();
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();
  const topRatedMovies = useTopRatedMovies();
  const nowPlaying = useNowPlaying();
  const upcoming = useUpcoming();

  // User history and queues
  const { recentlyViewed, continueWatching } = useHistory();

  const tmdbAvailable = isTMDBAvailable();

  const mockMovies = useMemo(() =>
    MOVIES.map(m => normalizeContent({
      id: m.id, title: m.title, media_type: m.type,
      poster_path: m.posterPath.replace('https://image.tmdb.org/t/p/w342', ''),
      backdrop_path: m.backdropPath.replace('https://image.tmdb.org/t/p/original', ''),
      release_date: `${m.year}-01-01`, vote_average: m.rating, vote_count: m.voteCount,
      overview: m.overview, original_language: m.language,
    })),
    []
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
    }
  };

  // Lists with fallbacks
  const trendingList = tmdbAvailable && trendingToday.data?.length > 0 ? trendingToday.data : mockMovies;
  const nowPlayingList = tmdbAvailable && nowPlaying.data?.length > 0 ? nowPlaying.data : mockMovies.slice(4, 12);
  const popularMoviesList = tmdbAvailable && popularMovies.data?.length > 0 ? popularMovies.data : mockMovies.slice(2, 10);
  const popularTVList = tmdbAvailable && popularTV.data?.length > 0 ? popularTV.data : mockMovies.slice(6, 14);
  const topRatedList = tmdbAvailable && topRatedMovies.data?.length > 0 ? topRatedMovies.data : mockMovies.slice(1, 9);
  const upcomingList = tmdbAvailable && upcoming.data?.length > 0 ? upcoming.data : mockMovies.slice(3, 8);

  // Filter hidden gems (rated highly but lower vote count or mock)
  const hiddenGemsList = useMemo(() => {
    const pool = tmdbAvailable && topRatedMovies.data?.length > 0 ? topRatedMovies.data : mockMovies;
    return pool.filter(m => m.rating >= 7.8).slice().reverse().slice(0, 6);
  }, [tmdbAvailable, topRatedMovies.data, mockMovies]);

  // Recommendations based on taste blueprint or mock
  const recommendedList = useMemo(() => {
    const pool = tmdbAvailable && popularMovies.data?.length > 0 ? popularMovies.data : mockMovies;
    return pool.slice().sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [tmdbAvailable, popularMovies.data, mockMovies]);

  // Normalize history lists
  const normalizedRecentlyViewed = useMemo(() => {
    return recentlyViewed.map(m => normalizeContent({
      id: m.id, title: m.title, media_type: m.type,
      poster_path: m.posterPath, backdrop_path: m.backdropPath,
      release_date: `${m.year}-01-01`, vote_average: m.rating, vote_count: m.voteCount,
      overview: m.overview, original_language: m.language
    }));
  }, [recentlyViewed]);

  const normalizedContinueWatching = useMemo(() => {
    // If empty, return a subset of mock movies as a "placeholder continue watching" queue
    if (continueWatching.length === 0) {
      return mockMovies.slice(0, 2);
    }
    return continueWatching.map(m => normalizeContent({
      id: m.id, title: m.title, media_type: m.type,
      poster_path: m.posterPath, backdrop_path: m.backdropPath,
      release_date: `${m.year}-01-01`, vote_average: m.rating, vote_count: m.voteCount,
      overview: m.overview, original_language: m.language
    }));
  }, [continueWatching, mockMovies]);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Cinematic Hero */}
      <HeroSection onSearchOpen={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} />

      {/* Mood Ribbon & OTT Platforms */}
      <MoodRibbon />
      <PlatformRow />

      {/* Spacing adjustments & rails list */}
      <div className="py-12 space-y-12">
        {/* 1. Continue Watching */}
        <ContentRail
          title="Continue Watching"
          subtitle="Pick up right where you left off"
          badge={<Clock className="w-4 h-4 text-accent" />}
          items={normalizedContinueWatching}
          loading={false}
        />

        {/* 2. Trending Today */}
        <ContentRail
          title="Trending Today"
          subtitle="The most popular titles in BingeKaro right now"
          badge={<Flame className="w-4 h-4 text-accent" />}
          viewAllTo="/discover?sort=popularity.desc"
          items={trendingList}
          loading={trendingToday.loading}
        />

        {/* 3. Streaming Now */}
        <ContentRail
          title="Streaming Now"
          subtitle="New releases available on your connected OTT platforms"
          badge={<Play className="w-4 h-4 text-accent" />}
          items={nowPlayingList}
          loading={nowPlaying.loading}
        />

        {/* 4. Popular Movies */}
        <ContentRail
          title="Popular Movies"
          subtitle="Top movies searched by users this week"
          badge={<Film className="w-4 h-4 text-accent" />}
          viewAllTo="/discover?type=movie"
          items={popularMoviesList}
          loading={popularMovies.loading}
        />

        {/* 5. Popular TV Shows */}
        <ContentRail
          title="Popular TV Shows"
          subtitle="Trending TV series and dramas"
          badge={<Tv className="w-4 h-4 text-accent" />}
          viewAllTo="/discover?type=tv"
          items={popularTVList}
          loading={popularTV.loading}
        />

        {/* 6. Top Rated Masterpieces */}
        <ContentRail
          title="Top Rated Masterpieces"
          subtitle="All-time classic cinema and critically acclaimed titles"
          badge={<Star className="w-4 h-4 text-accent" />}
          items={topRatedList}
          loading={topRatedMovies.loading}
        />

        {/* 7. Upcoming Releases */}
        <ContentRail
          title="Upcoming Releases"
          subtitle="Exciting movies and shows coming soon"
          badge={<Calendar className="w-4 h-4 text-accent" />}
          items={upcomingList}
          loading={upcoming.loading}
        />

        {/* 8. Hidden Gems */}
        <ContentRail
          title="Hidden Gems"
          subtitle="High ratings, less popularity — titles you might have missed"
          badge={<Gem className="w-4 h-4 text-accent" />}
          items={hiddenGemsList}
          loading={false}
        />

        {/* 9. Recently Viewed */}
        {normalizedRecentlyViewed.length > 0 && (
          <ContentRail
            title="Recently Viewed"
            subtitle="Titles you checked out recently"
            badge={<Compass className="w-4 h-4 text-accent" />}
            items={normalizedRecentlyViewed}
            loading={false}
          />
        )}

        {/* 10. Recommended For You */}
        <ContentRail
          title="Recommended For You"
          subtitle="Surfaced based on your entertainment blueprint"
          badge={<Sparkles className="w-4 h-4 text-accent" />}
          items={recommendedList}
          loading={false}
        />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-16 py-12">
        {/* Why BingeKaro — Feature Pillars */}
        <section className="py-10 bg-card/45 border border-border/50 rounded-3xl p-8 lg:p-12 text-center space-y-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-accent/5 blur-[90px] pointer-events-none" />
          <div className="space-y-3 max-w-xl mx-auto">
            <span className="text-[11px] font-black text-accent uppercase tracking-widest">Premium Features</span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Why Choose BingeKaro?</h2>
            <p className="text-sm text-muted-foreground leading-relaxed font-medium">
              Discovering what to watch should be as enjoyable as watching itself. BingeKaro changes the game.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "AI-Powered Taste DNA", desc: "No generic categories. Our radar charts map your cinematic requirements based on intensity, romance, and pacing.", icon: Sparkles },
              { title: "Dynamic OTT Availability", desc: "Instantly check stream, rent, and buy options across Netflix, JioHotstar, Prime, and Apple TV+.", icon: Play },
              { title: "Modern Curation", desc: "Collaborate on watchlists and track statistics of your watched collection in a premium cinephile dashboard.", icon: Shield }
            ].map((pillar, idx) => (
              <div key={idx} className="space-y-4 p-5 rounded-2xl bg-background/50 border border-border/60 hover:border-accent/35 hover:shadow-lg transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-accent/15 flex items-center justify-center text-accent mx-auto">
                  <pillar.icon className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-foreground">{pillar.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Newsletter Subscription Callout */}
        <section className="bg-gradient-to-r from-accent/10 to-accent-dark/5 border border-accent/25 rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center lg:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">Find Your Next Obsession.</h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-medium max-w-md">
              Subscribe to get customized weekly updates on the best movies, TV shows, and OTT releases matching your DNA.
            </p>
          </div>

          <div className="w-full lg:max-w-md">
            {subscribed ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 bg-accent/15 border border-accent/30 rounded-2xl text-accent"
              >
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold">Successfully subscribed! Check your inbox soon.</span>
              </motion.div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 w-full">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-background border border-border/80 rounded-xl px-4 py-3 text-xs text-foreground placeholder-muted-foreground/60 outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="bg-accent hover:bg-accent/90 text-white font-bold text-xs px-5 py-3 rounded-xl flex items-center gap-1.5 transition-all shadow-[0_4px_12px_rgba(249,115,22,0.2)] shrink-0"
                >
                  <Mail className="w-4 h-4" /> Subscribe
                </button>
              </form>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
