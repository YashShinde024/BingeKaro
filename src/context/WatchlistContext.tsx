"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import type { Movie } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { api } from '../lib/api';

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
  const { getToken } = useClerkAuth();

  const syncWatchlist = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;
      
      const items = await api.getWatchlist(token);
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
        dbId: item.id, // Database record ID for deletion
      }));
      setWatchlist(mapped);

      // Statuses mapping
      const statuses: Record<number, WatchlistStatus> = {};
      items.forEach((item: any) => {
        statuses[item.tmdb_id] = (item.status || 'want-to-watch') as WatchlistStatus;
      });
      setMovieStatuses(statuses);
    } catch {
      // Silently handle errors
    }
  }, [getToken]);

  const syncFavorites = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const items = await api.getFavorites(token);
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
        dbId: item.id, // Database record ID
      }));
      setFavorites(mapped);
    } catch {
      // Silently handle errors
    }
  }, [getToken]);

  useEffect(() => {
    if (user) {
      syncWatchlist();
      syncFavorites();
    } else {
      setWatchlist([]);
      setFavorites([]);
      setMovieStatuses({});
    }
  }, [user, syncWatchlist, syncFavorites]);

  const addToWatchlist = useCallback(async (movie: Movie) => {
    if (!user) {
      showToast('Please sign in to save movies to your watchlist.', 'info');
      openLoginModal();
      return;
    }
    try {
      const token = await getToken();
      if (!token) return;

      const posterRelative = movie.posterPath ? movie.posterPath.substring(movie.posterPath.indexOf('/p/')) : '';
      const backdropRelative = movie.backdropPath ? movie.backdropPath.substring(movie.backdropPath.indexOf('/p/')) : '';

      await api.addToWatchlist(token, {
        tmdb_id: movie.id,
        media_type: movie.type === 'tv' ? 'tv' : 'movie',
        title: movie.title,
        poster_path: posterRelative || movie.posterPath,
        backdrop_path: backdropRelative || movie.backdropPath,
        overview: movie.overview || '',
        rating: movie.rating,
        release_date: movie.year ? `${movie.year}-01-01` : '',
      });

      showToast(`"${movie.title}" added to watchlist!`, 'success');
      syncWatchlist();
    } catch (err: any) {
      showToast(err.message || 'Failed to add to watchlist', 'error');
    }
  }, [user, getToken, showToast, openLoginModal, syncWatchlist]);

  const removeFromWatchlist = useCallback(async (movieId: number) => {
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;

      // Find the database record uuid
      const list = await api.getWatchlist(token);
      const dbItem = list.find((item: any) => item.tmdb_id === movieId);
      if (dbItem?.id) {
        await api.removeFromWatchlist(token, dbItem.id);
        showToast('Removed from watchlist.', 'info');
        syncWatchlist();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove from watchlist', 'error');
    }
  }, [user, getToken, showToast, syncWatchlist]);

  const inWatchlist = useCallback((movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  }, [watchlist]);

  const addToFavorites = useCallback(async (movie: Movie) => {
    if (!user) {
      showToast('Please sign in to save favorites.', 'info');
      openLoginModal();
      return;
    }
    try {
      const token = await getToken();
      if (!token) return;

      const posterRelative = movie.posterPath ? movie.posterPath.substring(movie.posterPath.indexOf('/p/')) : '';
      const backdropRelative = movie.backdropPath ? movie.backdropPath.substring(movie.backdropPath.indexOf('/p/')) : '';

      await api.addToFavorites(token, {
        tmdb_id: movie.id,
        media_type: movie.type === 'tv' ? 'tv' : 'movie',
        title: movie.title,
        poster_path: posterRelative || movie.posterPath,
        backdrop_path: backdropRelative || movie.backdropPath,
        overview: movie.overview || '',
        rating: movie.rating,
        release_date: movie.year ? `${movie.year}-01-01` : '',
      });

      showToast(`Added "${movie.title}" to Favorites`, 'success');
      syncFavorites();
    } catch (err: any) {
      showToast(err.message || 'Failed to add to favorites', 'error');
    }
  }, [user, getToken, showToast, openLoginModal, syncFavorites]);

  const removeFromFavorites = useCallback(async (movieId: number) => {
    if (!user) return;
    try {
      const token = await getToken();
      if (!token) return;

      const list = await api.getFavorites(token);
      const dbItem = list.find((item: any) => item.tmdb_id === movieId);
      if (dbItem?.id) {
        await api.removeFromFavorites(token, dbItem.id);
        showToast('Removed from Favorites.', 'info');
        syncFavorites();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to remove from favorites', 'error');
    }
  }, [user, getToken, showToast, syncFavorites]);

  const inFavorites = useCallback((movieId: number) => {
    return favorites.some((m) => m.id === movieId);
  }, [favorites]);

  const updateMovieStatus = useCallback((movieId: number, status: WatchlistStatus) => {
    if (!user) return;
    // Keep local statuses in sync, but wait for future backend integrations if any
    setMovieStatuses(s => ({ ...s, [movieId]: status }));
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
