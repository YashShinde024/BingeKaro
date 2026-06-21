"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Movie, RecommendationResult } from '../types';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

interface HistoryContextType {
  recentlyViewed: Movie[];
  continueWatching: Movie[];
  recommendationHistory: RecommendationResult[];
  addToRecentlyViewed: (movie: Movie) => void;
  addToContinueWatching: (movie: Movie) => void;
  removeFromContinueWatching: (movieId: number) => void;
  addToRecommendationHistory: (movie: Movie, explanation: string) => void;
  syncHistory: () => Promise<void>;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = () => {
  const context = useContext(HistoryContext);
  if (!context) throw new Error('useHistory must be used within a HistoryProvider');
  return context;
};

export const HistoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<Movie[]>([]);
  const [continueWatching, setContinueWatching] = useState<Movie[]>([]);
  const [recommendationHistory, setRecommendationHistory] = useState<RecommendationResult[]>([]);
  
  const { user } = useAuth();
  const { getToken } = useClerkAuth();

  const syncHistory = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const items = await api.getHistory(token);
      const mapped = items.map((item: any) => ({
        id: item.tmdb_id,
        type: (item.media_type || 'movie') as any,
        title: item.title,
        posterPath: item.poster_path || '',
        backdropPath: item.backdrop_path || '',
        year: item.release_date ? new Date(item.release_date).getFullYear() : 0,
        rating: item.vote_average || 0,
        voteCount: 0,
        runtime: 0,
        overview: item.overview || '',
        genres: [],
        language: 'english' as any,
        providers: [],
        isFree: false,
        dbId: item.id
      }));
      setRecentlyViewed(mapped);
    } catch {
      // Fallback to localStorage on API failure
      const savedRecent = localStorage.getItem('kd_recent');
      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
    }
  }, [getToken]);

  useEffect(() => {
    try {
      const savedContinue = localStorage.getItem('kd_continue');
      const savedRecs = localStorage.getItem('kd_rec_history');

      if (savedContinue) setContinueWatching(JSON.parse(savedContinue));
      if (savedRecs) setRecommendationHistory(JSON.parse(savedRecs));
    } catch {
      // Silently handle corrupted localStorage
    }

    if (user) {
      syncHistory();
    } else {
      setRecentlyViewed([]);
    }
  }, [user, syncHistory]);

  const addToRecentlyViewed = useCallback(async (movie: Movie) => {
    // Add locally first
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, 10);
      localStorage.setItem('kd_recent', JSON.stringify(updated));
      return updated;
    });

    // Add to FastAPI backend
    try {
      const token = await getToken();
      if (token) {
        const posterRelative = movie.posterPath ? movie.posterPath.substring(movie.posterPath.indexOf('/p/')) : '';
        const backdropRelative = movie.backdropPath ? movie.backdropPath.substring(movie.backdropPath.indexOf('/p/')) : '';

        await api.addToHistory(token, {
          tmdb_id: movie.id,
          media_type: movie.type === 'tv' ? 'tv' : 'movie',
          title: movie.title,
          poster_path: posterRelative || movie.posterPath,
          rating: movie.rating,
          release_date: movie.year ? `${movie.year}-01-01` : '',
        });
        syncHistory();
      }
    } catch {
      // Silently handle history save failures
    }
  }, [getToken, syncHistory]);

  const addToContinueWatching = useCallback((movie: Movie) => {
    setContinueWatching((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, 6);
      localStorage.setItem('kd_continue', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromContinueWatching = useCallback((movieId: number) => {
    setContinueWatching((prev) => {
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem('kd_continue', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const addToRecommendationHistory = useCallback((movie: Movie, explanation: string) => {
    setRecommendationHistory((prev) => {
      const filtered = prev.filter((r) => r.movie.id !== movie.id);
      const updated = [
        { movie, aiExplanation: explanation, matchScore: 95, matchReasons: [] },
        ...filtered,
      ].slice(0, 10);
      localStorage.setItem('kd_rec_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value = useMemo(() => ({
    recentlyViewed,
    continueWatching,
    recommendationHistory,
    addToRecentlyViewed,
    addToContinueWatching,
    removeFromContinueWatching,
    addToRecommendationHistory,
    syncHistory,
  }), [
    recentlyViewed, continueWatching, recommendationHistory,
    addToRecentlyViewed, addToContinueWatching, removeFromContinueWatching, addToRecommendationHistory,
    syncHistory,
  ]);

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
