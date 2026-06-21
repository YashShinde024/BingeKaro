"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useUser, useClerk, useAuth as useClerkAuth } from '@clerk/nextjs';
import type { UserProfile, GenreId, MoodId, OTTProviderId } from '../types';
import { useToast } from './ToastContext';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (
    genres: GenreId[],
    moods: MoodId[],
    providers: OTTProviderId[]
  ) => Promise<void>;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  isLoginModalOpen: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerk();
  const { showToast } = useToast();
  const router = useRouter();
  const { getToken } = useClerkAuth();

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const loadProfile = async () => {
        let favoriteGenres: GenreId[] = ['thriller', 'drama', 'sci-fi'];
        let favoriteMoods: MoodId[] = ['thrilling', 'mind-bending', 'dark'];
        let favoriteProviders: OTTProviderId[] = ['netflix', 'prime-video', 'apple-tv'];

        try {
          const token = await getToken();
          if (token) {
            const backendPrefs = await api.getPreferences(token);
            if (backendPrefs) {
              if (Array.isArray(backendPrefs.genres) && backendPrefs.genres.length > 0) {
                favoriteGenres = backendPrefs.genres as GenreId[];
              }
              if (Array.isArray(backendPrefs.platforms) && backendPrefs.platforms.length > 0) {
                favoriteProviders = backendPrefs.platforms as OTTProviderId[];
              }
            }
          }
        } catch (err) {
          // Fallback to localStorage if backend fails
          const storageKey = `kd_user_${clerkUser.id}`;
          const savedPrefs = localStorage.getItem(storageKey);
          if (savedPrefs) {
            try {
              const parsed = JSON.parse(savedPrefs);
              favoriteGenres = parsed.favoriteGenres || favoriteGenres;
              favoriteMoods = parsed.favoriteMoods || favoriteMoods;
              favoriteProviders = parsed.favoriteProviders || favoriteProviders;
            } catch {}
          }
        }

        setUserProfile({
          id: clerkUser.id,
          name: clerkUser.fullName || clerkUser.username || 'Cinephile',
          email: clerkUser.primaryEmailAddress?.emailAddress || '',
          avatarUrl: clerkUser.imageUrl,
          favoriteGenres,
          favoriteMoods,
          favoriteProviders,
          joinedAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'June 2026',
        });
        setIsLoginModalOpen(false);
      };

      loadProfile();
    } else {
      setUserProfile(null);
    }
  }, [clerkUser, isLoaded, getToken]);

  const login = useCallback(async () => {
    router.push('/sign-in');
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await signOut();
      showToast('Signed out successfully.', 'info');
      router.push('/');
    } catch {
      // Silently handle logout errors
    }
  }, [signOut, showToast, router]);

  const updatePreferences = useCallback(async (
    genres: GenreId[],
    moods: MoodId[],
    providers: OTTProviderId[]
  ) => {
    if (!clerkUser || !userProfile) return;

    const updated = {
      ...userProfile,
      favoriteGenres: genres,
      favoriteMoods: moods,
      favoriteProviders: providers,
    };

    // Optimistic update
    setUserProfile(updated);
    localStorage.setItem(`kd_user_${clerkUser.id}`, JSON.stringify(updated));

    try {
      const token = await getToken();
      if (token) {
        await api.updatePreferences(token, {
          genres,
          platforms: providers
        });
        showToast('Preferences synced to cloud successfully!', 'success');
      } else {
        showToast('Preferences updated locally.', 'info');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to sync preferences to cloud.', 'warning');
    }
  }, [clerkUser, userProfile, getToken, showToast]);

  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);

  const value = useMemo(() => ({
    user: userProfile,
    isLoading: !isLoaded,
    login,
    logout,
    updatePreferences,
    openLoginModal,
    closeLoginModal,
    isLoginModalOpen,
  }), [userProfile, isLoaded, login, logout, updatePreferences, openLoginModal, closeLoginModal, isLoginModalOpen]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
