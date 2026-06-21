"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Movie, RecommendationResult } from '../types';

interface HistoryContextType {
  recentlyViewed: Movie[];
  continueWatching: Movie[];
  recommendationHistory: RecommendationResult[];
  addToRecentlyViewed: (movie: Movie) => void;
  addToContinueWatching: (movie: Movie) => void;
  removeFromContinueWatching: (movieId: number) => void;
  addToRecommendationHistory: (movie: Movie, explanation: string) => void;
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

  useEffect(() => {
    try {
      const savedRecent = localStorage.getItem('kd_recent');
      const savedContinue = localStorage.getItem('kd_continue');
      const savedRecs = localStorage.getItem('kd_rec_history');

      if (savedRecent) setRecentlyViewed(JSON.parse(savedRecent));
      if (savedContinue) setContinueWatching(JSON.parse(savedContinue));
      if (savedRecs) setRecommendationHistory(JSON.parse(savedRecs));
    } catch {
      // Silently handle corrupted localStorage
    }
  }, []);

  const addToRecentlyViewed = useCallback((movie: Movie) => {
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((m) => m.id !== movie.id);
      const updated = [movie, ...filtered].slice(0, 10);
      localStorage.setItem('kd_recent', JSON.stringify(updated));
      return updated;
    });
  }, []);

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
  }), [
    recentlyViewed, continueWatching, recommendationHistory,
    addToRecentlyViewed, addToContinueWatching, removeFromContinueWatching, addToRecommendationHistory,
  ]);

  return (
    <HistoryContext.Provider value={value}>
      {children}
    </HistoryContext.Provider>
  );
};
