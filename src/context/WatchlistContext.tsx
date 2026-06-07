import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Movie } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface WatchlistContextType {
  watchlist: Movie[];
  favorites: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  inWatchlist: (movieId: number) => boolean;
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  inFavorites: (movieId: number) => boolean;
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
  const { user, openLoginModal } = useAuth();
  const { showToast } = useToast();

  // Load user-specific watchlist and favorites when user changes
  useEffect(() => {
    if (user) {
      const wKey = `kd_watchlist_${user.id}`;
      const fKey = `kd_favorites_${user.id}`;
      const savedW = localStorage.getItem(wKey);
      const savedF = localStorage.getItem(fKey);
      
      try {
        setWatchlist(savedW ? JSON.parse(savedW) : []);
        setFavorites(savedF ? JSON.parse(savedF) : []);
      } catch (e) {
        console.error(e);
      }
    } else {
      setWatchlist([]);
      setFavorites([]);
    }
  }, [user]);

  const addToWatchlist = (movie: Movie) => {
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
      showToast(`"${movie.title}" added to watchlist!`, 'success');
      return updated;
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    if (!user) return;
    const key = `kd_watchlist_${user.id}`;
    setWatchlist((prev) => {
      const target = prev.find((m) => m.id === movieId);
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      if (target) {
        showToast(`"${target.title}" removed from watchlist.`, 'info');
      }
      return updated;
    });
  };

  const inWatchlist = (movieId: number) => {
    return watchlist.some((m) => m.id === movieId);
  };

  const addToFavorites = (movie: Movie) => {
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
      showToast(`Added "${movie.title}" to Favorites ❤️`, 'success');
      return updated;
    });
  };

  const removeFromFavorites = (movieId: number) => {
    if (!user) return;
    const key = `kd_favorites_${user.id}`;
    setFavorites((prev) => {
      const target = prev.find((m) => m.id === movieId);
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem(key, JSON.stringify(updated));
      if (target) {
        showToast(`Removed "${target.title}" from Favorites.`, 'info');
      }
      return updated;
    });
  };

  const inFavorites = (movieId: number) => {
    return favorites.some((m) => m.id === movieId);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        favorites,
        addToWatchlist,
        removeFromWatchlist,
        inWatchlist,
        addToFavorites,
        removeFromFavorites,
        inFavorites,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};
