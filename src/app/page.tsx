"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Film, Tv, Star, Calendar, Clapperboard,
  Sparkles, Flame, Shield, ArrowRight, Play, CheckCircle2, Mail
} from 'lucide-react';
import { HeroSection } from '../components/features/HeroSection';
import { MoodRibbon } from '../components/features/MoodRibbon';
import { PlatformRow } from '../components/features/PlatformRow';
import { MovieCard } from '../components/cards/MovieCard';
import { MovieCardSkeleton } from '../components/ui/Skeletons';
import { useTrendingToday, usePopularMovies, usePopularTV, useTopRatedMovies, useNowPlaying } from '../hooks/useTMDB';
import { isTMDBAvailable } from '../lib/tmdb';
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

  const tmdbAvailable = isTMDBAvailable();

  const mockMovies = React.useMemo(() =>
    MOVIES.map(m => ({
      id: m.id, title: m.title, mediaType: m.type as 'movie' | 'tv',
      posterUrl: m.posterPath, backdropUrl: m.backdropPath, year: m.year,
      rating: m.rating, voteCount: m.voteCount, overview: m.overview,
      genreIds: [], language: m.language, popularity: 0,
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

  const trendingList = tmdbAvailable ? trendingToday.data : mockMovies.slice(0, 8);
  const nowPlayingList = tmdbAvailable ? nowPlaying.data : mockMovies.slice(4, 12);
  const popularMoviesList = tmdbAvailable ? popularMovies.data : mockMovies.slice(2, 10);
  const popularTVList = tmdbAvailable ? popularTV.data : mockMovies.slice(6, 14);
  const topRatedList = tmdbAvailable ? topRatedMovies.data : mockMovies.slice(1, 9);

  return (
    <div className="min-h-screen bg-background">
      {/* Cinematic Hero */}
      <HeroSection onSearchOpen={() => window.dispatchEvent(new KeyboardEvent('keydown', { key: 'k', ctrlKey: true }))} />

      {/* Mood Ribbon & OTT Platforms */}
      <MoodRibbon />
      <PlatformRow />

      {/* Main Page Layout Rails */}
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 space-y-20 py-16">
        
        {/* SECTION 1: Trending Today — Premium Horizontal List */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Flame className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">Trending Today</h2>
                <p className="text-xs text-muted-foreground font-medium">The most popular titles in BingeKaro right now</p>
              </div>
            </div>
            <Link href="/discover" className="text-xs font-bold text-accent hover:text-accent-light flex items-center gap-1.5 transition-colors">
              Explore More <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          
          <div className="flex gap-5 overflow-x-auto pb-4 scrollbar-thin">
            {trendingToday.loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <div key={idx} className="w-[180px] shrink-0">
                  <MovieCardSkeleton />
                </div>
              ))
            ) : (
              trendingList.map((item, idx) => (
                <div key={item.id} className="w-[185px] shrink-0">
                  <MovieCard content={item} index={idx} />
                </div>
              ))
            )}
          </div>
        </section>

        {/* SECTION 2: Now Streaming — Featured Grid Cards */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Play className="w-4.5 h-4.5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">Streaming Now</h2>
                <p className="text-xs text-muted-foreground font-medium">New releases available on your connected OTT platforms</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nowPlayingList.slice(0, 4).map((item, idx) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08, duration: 0.5 }}
                className="group relative rounded-2xl overflow-hidden aspect-video bg-card border border-border/60 hover:border-accent/40 shadow-sm transition-all duration-300"
              >
                {item.backdropUrl ? (
                  <img src={item.backdropUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full bg-accent/5 flex items-center justify-center text-muted-foreground font-bold">{item.title}</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-4">
                  <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mt-2.5">
                    <span className="text-[10px] text-white/60 font-semibold">{item.year}</span>
                    <Link href={`/movie/${item.id}`} className="text-[10px] font-black text-accent group-hover:text-white flex items-center gap-1 transition-all">
                      Watch details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* SECTION 3: Popular Movies & TV Shows — Balanced Alternate Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Popular Movies block */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
              <Film className="w-4.5 h-4.5 text-accent" /> Popular Movies
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {popularMoviesList.slice(0, 6).map((item) => (
                <MovieCard key={item.id} content={item} />
              ))}
            </div>
          </div>

          {/* Popular TV block */}
          <div className="space-y-6">
            <h3 className="text-lg font-black text-foreground border-b border-border/40 pb-3 flex items-center gap-2">
              <Tv className="w-4.5 h-4.5 text-accent" /> Popular TV Shows
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {popularTVList.slice(0, 6).map((item) => (
                <MovieCard key={item.id} content={item} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: Top Rated Cinematic Picks — Vertical Card Highlight List */}
        <section className="space-y-6">
          <div className="flex items-end justify-between border-b border-border/40 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                <Star className="w-4.5 h-4.5 fill-accent" />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground tracking-tight">Top Rated Masterpieces</h2>
                <p className="text-xs text-muted-foreground font-medium">All-time classic cinema and critically acclaimed titles</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topRatedList.slice(0, 3).map((item, idx) => (
              <div key={item.id} className="p-4 rounded-2xl bg-card border border-border flex gap-4 hover:border-accent/40 transition-all duration-300">
                <div className="w-20 aspect-poster rounded-xl overflow-hidden shrink-0 border border-border">
                  <img src={item.posterUrl || undefined} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed font-medium">{item.overview}</p>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[10px] text-accent font-extrabold flex items-center gap-0.5">
                      ★ {item.rating?.toFixed(1)}
                    </span>
                    <Link href={`/movie/${item.id}`} className="text-[10px] font-bold text-muted-foreground hover:text-accent transition-colors">
                      View details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* SECTION 5: Why BingeKaro — Feature Pillars */}
        <section className="py-10 bg-card/40 border border-border/50 rounded-3xl p-8 lg:p-12 text-center space-y-10 relative overflow-hidden">
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

        {/* SECTION 6: Newsletter Subscription Callout */}
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
