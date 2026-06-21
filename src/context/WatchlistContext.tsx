"use client";
import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { Movie } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

export type WatchlistStatus = 'want-to-watch' | 'watching' | 'completed' | 'dropped';

interface WatchlistContextType {
  watchlist: Movie[];
  favorites: Movie[];
  movieStatuses: Record<number, WatchlistStatus>;
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  inWatchlist: (movieId: number) => boolean;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  inFavorites: (movieId: number) => boolean;
  updateMovieStatus: (movieId: number, status: WatchlistStatus) => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) throw new Error('useWatchlist must be used within a WatchlistProvider');
  return context;
};

export const WatchlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<Movie[]>([]);
  const [movieStatuses, setMovieStatuses] = useState<Record<number, WatchlistStatus>>({});
  const { user, openLoginModal } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    if (user) {
      const wKey = `kd_watchlist_${user.id}`;
      const fKey = `kd_favorites_${user.id}`;
      const sKey = `kd_statuses_${user.id}`;
      try {
        const savedW = localStorage.getItem(wKey);
        const savedF = localStorage.getItem(fKey);
        const savedS = localStorage.getItem(sKey);
        setWatchlist(savedW ? JSON.parse(savedW) : []);
        setFavorites(savedF ? JSON.parse(savedF) : []);
        setMovieStatuses(savedS ? JSON.parse(savedS) : {});
      } catch {
        // Silently handle corrupted localStorage
      }
    } else {
      setWatchlist([]);
      setFavorites([]);
      setMovieStatuses({});
    }
  }, [user]);

  const addToWatchlist = useCallback((movie: Movie) => {
    if (!user) {
      showToast('Please sign in to save movies to your watchlist.', 'info');
      openLoginModal();
      return;
    }
    const key = `kd_watchlist_${user.id}`;
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const updated = [movie, ...prev];
      localStorage.setItem(key, JSON.stringify(updated));
      const sKey = `kd_statuses_${user.id}`;
      setMovieStatuses(s => {
        const next = { ...s, [movie.id]: 'want-to-watch' as const };
        localStorage.setItem(sKey, JSON.stringify(next));
        return next;
      });
      showToast(`"${movie.title}" added to watchlist!`, 'success');
      return updated;
    });
  }, [user, showToast, openLoginModal]);

  const removeFromWatchlist = useCallback((movieId: number) => {
    if (!user) return;
    const key = `kd_watchlist_${user.id}`;
    setWatchlist((prev) => {
      const target = prev.find((m) => m.id === movieId);
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      const sKey = `kd_statuses_${user.id}`;
      setMovieStatuses(s => {
        const next = { ...s };
        delete next[movieId];
        localStorage.setItem(sKey, JSON.stringify(next));
        return next;
      });
      if (target) showToast(`"${target.title}" removed from watchlist.`, 'info');
      return updated;
    });
  }, [user, showToast]);

  const inWatchlist = useCallback((movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  }, [watchlist]);

  const addToFavorites = useCallback((movie: Movie) => {
    if (!user) {
      showToast('Please sign in to save favorites.', 'info');
      openLoginModal();
      return;
    }
    const key = `kd_favorites_${user.id}`;
    setFavorites((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const updated = [movie, ...prev];
      localStorage.setItem(key, JSON.stringify(updated));
      showToast(`Added "${movie.title}" to Favorites`, 'success');
      return updated;
    });
  }, [user, showToast, openLoginModal]);

  const removeFromFavorites = useCallback((movieId: number) => {
    if (!user) return;
    const key = `kd_favorites_${user.id}`;
    setFavorites((prev) => {
      const target = prev.find((m) => m.id === movieId);
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      if (target) showToast(`Removed "${target.title}" from Favorites.`, 'info');
      return updated;
    });
  }, [user, showToast]);

  const inFavorites = useCallback((movieId: number) => {
    return favorites.some((m) => m.id === movieId);
  }, [favorites]);

  const updateMovieStatus = useCallback((movieId: number, status: WatchlistStatus) => {
    if (!user) return;
    const sKey = `kd_statuses_${user.id}`;
    setMovieStatuses(s => {
      const next = { ...s, [movieId]: status };
      localStorage.setItem(sKey, JSON.stringify(next));
      return next;
    });
    const target = watchlist.find(m => m.id === movieId);
    const title = target ? `"${target.title}"` : 'Movie';
    showToast(`${title} status updated to: ${status.replace(/-/g, ' ')}`, 'success');
  }, [user, watchlist, showToast]);

  const value = useMemo(() => ({
    watchlist, favorites, movieStatuses,
    addToWatchlist, removeFromWatchlist, inWatchlist,
    addToFavorites, removeFromFavorites, inFavorites,
    updateMovieStatus,
  }), [
    watchlist, favorites, movieStatuses,
    addToWatchlist, removeFromWatchlist, inWatchlist,
    addToFavorites, removeFromFavorites, inFavorites,
    updateMovieStatus,
  ]);

  return (
    <WatchlistContext.Provider value={value}>
      {children}
    </WatchlistContext.Provider>
  );
};
