"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useClerk } from '@clerk/nextjs';
import type { UserProfile, GenreId, MoodId, OTTProviderId } from '../types';
import { useToast } from './ToastContext';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (name: string, email: string) => Promise<void>;
  logout: () => void;
  updatePreferences: (
    genres: GenreId[],
    moods: MoodId[],
    providers: OTTProviderId[]
  ) => void;
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

  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Sync Clerk user profile with BingeKaro custom settings stored locally
  useEffect(() => {
    if (!isLoaded) return;

    if (clerkUser) {
      const storageKey = `kd_user_${clerkUser.id}`;
      const savedPrefs = localStorage.getItem(storageKey);
      let favoriteGenres: GenreId[] = ['thriller', 'drama', 'sci-fi'];
      let favoriteMoods: MoodId[] = ['thrilling', 'mind-bending', 'dark'];
      let favoriteProviders: OTTProviderId[] = ['netflix', 'prime-video', 'apple-tv'];

      if (savedPrefs) {
        try {
          const parsed = JSON.parse(savedPrefs);
          favoriteGenres = parsed.favoriteGenres || favoriteGenres;
          favoriteMoods = parsed.favoriteMoods || favoriteMoods;
          favoriteProviders = parsed.favoriteProviders || favoriteProviders;
        } catch (e) {
          console.error('Failed to parse user preferences', e);
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
      // Close modal if user gets authenticated successfully
      setIsLoginModalOpen(false);
    } else {
      setUserProfile(null);
    }
  }, [clerkUser, isLoaded]);

  // login redirects to custom clerk sign-in page
  const login = async (name: string, email: string) => {
    router.push('/sign-in');
  };

  const logout = async () => {
    try {
      await signOut();
      showToast('Signed out successfully.', 'info');
      router.push('/');
    } catch (e) {
      console.error('Failed to logout', e);
    }
  };

  const updatePreferences = (
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
    
    setUserProfile(updated);
    localStorage.setItem(`kd_user_${clerkUser.id}`, JSON.stringify(updated));
    showToast('Preferences updated successfully!', 'success');
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <AuthContext.Provider
      value={{
        user: userProfile,
        isLoading: !isLoaded,
        login,
        logout,
        updatePreferences,
        openLoginModal,
        closeLoginModal,
        isLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
