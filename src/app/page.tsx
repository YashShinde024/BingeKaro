"use client";

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Film, Tv, Star, Calendar,
  Clapperboard, Swords, Laugh, Atom, Skull, Zap, Wand2, Globe, Flame, Clock,
} from 'lucide-react';
import { HeroSection } from '../components/features/HeroSection';
import { MoodRibbon } from '../components/features/MoodRibbon';
import { PlatformRow } from '../components/features/PlatformRow';
import { ContentRail } from '../components/features/ContentRail';
import { MovieCard } from '../components/cards/MovieCard';
import { MovieCardSkeleton } from '../components/ui/Skeletons';
import { SearchOverlay } from '../components/search/SearchOverlay';
import { MOVIES } from '../lib/mockData';
import { useHistory } from '../context/HistoryContext';
import { isTMDBAvailable } from '../lib/tmdb';
import {
  useTrendingToday,
  useTrendingWeek,
  usePopularMovies,
  usePopularTV,
  useTopRatedMovies,
  useTopRatedTV,
  useNowPlaying,
  useUpcoming,
  useGenreMovies,
  useGenreTV,
} from '../hooks/useTMDB';

export default function Home() {
  const [searchOpen, setSearchOpen] = React.useState(false);
  const { continueWatching } = useHistory();

  // TMDB Data Hooks
  const trendingToday = useTrendingToday();
  const trendingWeek = useTrendingWeek();
  const popularMovies = usePopularMovies();
  const popularTV = usePopularTV();
  const topRatedMovies = useTopRatedMovies();
  const topRatedTV = useTopRatedTV();
  const nowPlaying = useNowPlaying();
  const upcoming = useUpcoming();
  const actionPicks = useGenreMovies(28);
  const comedyPicks = useGenreMovies(35);
  const scifiPicks = useGenreMovies(878);
  const crimePicks = useGenreMovies(80);
  const thrillerPicks = useGenreMovies(53);
  const animationPicks = useGenreMovies(16);
  const animePicks = useGenreTV(16);

  const tmdbAvailable = isTMDBAvailable();

  // Mock fallback data for trending
  const trendingMock = React.useMemo(() =>
    MOVIES.filter(m => m.isTrending).slice(0, 8).map(m => ({
      id: m.id, title: m.title, mediaType: m.type as 'movie' | 'tv',
      posterUrl: m.posterPath, backdropUrl: m.backdropPath, year: m.year,
      rating: m.rating, voteCount: m.voteCount, overview: m.overview,
      genreIds: [], language: m.language, popularity: 0,
    })),
    []
  );

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Hero */}
      <HeroSection onSearchOpen={() => setSearchOpen(true)} />

      {/* Mood Ribbon */}
      <MoodRibbon />

      {/* OTT Platforms */}
      <PlatformRow />

      {/* Content Rails */}
      <div className="max-w-[1400px] mx-auto pt-10 pb-20">

        {/* Continue Watching */}
        {continueWatching && continueWatching.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-12"
          >
            <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                  <Clock className="w-4 h-4 text-accent-light" />
                </div>
                <div>
                  <h2 className="text-[17px] font-bold text-white tracking-tight">Continue Watching</h2>
                  <p className="text-xs text-muted mt-0.5">Pick up where you left off</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 content-rail px-6 lg:px-10 pb-4">
              {continueWatching.map((m, i) => <MovieCard key={m.id} movie={m} index={i} />)}
            </div>
          </motion.section>
        )}

        {/* 1. Trending Today */}
        <div id="trending-row">
          <ContentRail
            title="Trending Today"
            subtitle="What everyone's watching right now"
            badge={<Flame className="w-4 h-4 text-orange-500" />}
            items={tmdbAvailable ? trendingToday.data : trendingMock}
            loading={tmdbAvailable ? trendingToday.loading : false}
            hasMore={trendingToday.hasMore}
            onLoadMore={trendingToday.loadMore}
            viewAllTo="/discover"
          />
        </div>

        {/* 2. Trending This Week */}
        <ContentRail
          title="Trending This Week"
          subtitle="Hot picks of the week"
          badge={<TrendingUp className="w-4 h-4 text-emerald-400" />}
          items={trendingWeek.data}
          loading={trendingWeek.loading}
          hasMore={trendingWeek.hasMore}
          onLoadMore={trendingWeek.loadMore}
        />

        {/* 3. Popular Movies */}
        <ContentRail
          title="Popular Movies"
          subtitle="Top movie blockbusters this season"
          badge={<Film className="w-4 h-4 text-violet-400" />}
          items={popularMovies.data}
          loading={popularMovies.loading}
          hasMore={popularMovies.hasMore}
          onLoadMore={popularMovies.loadMore}
          viewAllTo="/discover?type=movie"
        />

        {/* 4. Popular TV Shows */}
        <ContentRail
          title="Popular TV Shows"
          subtitle="Trending episodic drama & comedies"
          badge={<Tv className="w-4 h-4 text-sky-400" />}
          items={popularTV.data}
          loading={popularTV.loading}
          hasMore={popularTV.hasMore}
          onLoadMore={popularTV.loadMore}
          viewAllTo="/discover?type=tv"
        />

        {/* 5. Top Rated Movies */}
        <ContentRail
          title="Top Rated Movies"
          subtitle="Highest rated films of all time"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          items={topRatedMovies.data}
          loading={topRatedMovies.loading}
          hasMore={topRatedMovies.hasMore}
          onLoadMore={topRatedMovies.loadMore}
        />

        {/* 6. Top Rated TV Shows */}
        <ContentRail
          title="Top Rated TV Shows"
          subtitle="Critically acclaimed television"
          badge={<Star className="w-4 h-4 text-amber-400 fill-amber-400" />}
          items={topRatedTV.data}
          loading={topRatedTV.loading}
          hasMore={topRatedTV.hasMore}
          onLoadMore={topRatedTV.loadMore}
        />

        {/* 7. Now Playing */}
        <ContentRail
          title="Now Playing"
          subtitle="Currently in theaters and streaming"
          badge={<Clapperboard className="w-4 h-4 text-rose-400" />}
          items={nowPlaying.data}
          loading={nowPlaying.loading}
          hasMore={nowPlaying.hasMore}
          onLoadMore={nowPlaying.loadMore}
        />

        {/* 8. Upcoming */}
        <ContentRail
          title="Upcoming Releases"
          subtitle="Most anticipated films coming soon"
          badge={<Calendar className="w-4 h-4 text-accent" />}
          items={upcoming.data}
          loading={upcoming.loading}
          hasMore={upcoming.hasMore}
          onLoadMore={upcoming.loadMore}
        />

        {/* 9-15. Genre Picks */}
        <ContentRail title="Action Picks" subtitle="Explosive action and adrenaline" badge={<Swords className="w-4 h-4 text-red-400" />} items={actionPicks.data} loading={actionPicks.loading} hasMore={actionPicks.hasMore} onLoadMore={actionPicks.loadMore} />
        <ContentRail title="Comedy Picks" subtitle="Laugh-out-loud entertainment" badge={<Laugh className="w-4 h-4 text-yellow-400" />} items={comedyPicks.data} loading={comedyPicks.loading} hasMore={comedyPicks.hasMore} onLoadMore={comedyPicks.loadMore} />
        <ContentRail title="Sci-Fi Picks" subtitle="Science fiction and futuristic worlds" badge={<Atom className="w-4 h-4 text-cyan-400" />} items={scifiPicks.data} loading={scifiPicks.loading} hasMore={scifiPicks.hasMore} onLoadMore={scifiPicks.loadMore} />
        <ContentRail title="Crime Picks" subtitle="Gritty crime dramas and thrillers" badge={<Skull className="w-4 h-4 text-slate-400" />} items={crimePicks.data} loading={crimePicks.loading} hasMore={crimePicks.hasMore} onLoadMore={crimePicks.loadMore} />
        <ContentRail title="Thriller Picks" subtitle="Edge-of-seat suspense" badge={<Zap className="w-4 h-4 text-amber-500" />} items={thrillerPicks.data} loading={thrillerPicks.loading} hasMore={thrillerPicks.hasMore} onLoadMore={thrillerPicks.loadMore} />
        <ContentRail title="Animation Picks" subtitle="Animated films and features" badge={<Wand2 className="w-4 h-4 text-pink-400" />} items={animationPicks.data} loading={animationPicks.loading} hasMore={animationPicks.hasMore} onLoadMore={animationPicks.loadMore} />
        <ContentRail title="Anime Picks" subtitle="Top anime series and films" badge={<Globe className="w-4 h-4 text-indigo-400" />} items={animePicks.data} loading={animePicks.loading} hasMore={animePicks.hasMore} onLoadMore={animePicks.loadMore} />
      </div>

      {/* Search Overlay (only here as fallback for hero search click) */}
      <SearchOverlay isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  );
}
