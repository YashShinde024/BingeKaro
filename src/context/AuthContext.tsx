"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile, GenreId, MoodId, OTTProviderId } from '../types';
import { useToast } from './ToastContext';

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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Load from localStorage
    const savedUser = localStorage.getItem('kd_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error('Failed to parse user data', e);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (name: string, email: string) => {
    setIsLoading(true);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: UserProfile = {
      id: Math.random().toString(36).substring(2, 9),
      name: name || 'Yash Shinde',
      email: email || 'yash@nyxen.in',
      avatarUrl: undefined,
      favoriteGenres: ['thriller', 'drama', 'sci-fi'],
      favoriteMoods: ['thrilling', 'mind-bending', 'dark'],
      favoriteProviders: ['netflix', 'prime-video', 'apple-tv'],
      joinedAt: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    };

    setUser(newUser);
    localStorage.setItem('kd_user', JSON.stringify(newUser));
    setIsLoading(false);
    setIsLoginModalOpen(false);
    showToast(`Welcome back, ${newUser.name}!`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('kd_user');
    showToast('Signed out successfully.', 'info');
  };

  const updatePreferences = (
    genres: GenreId[],
    moods: MoodId[],
    providers: OTTProviderId[]
  ) => {
    if (!user) return;
    const updated = {
      ...user,
      favoriteGenres: genres,
      favoriteMoods: moods,
      favoriteProviders: providers,
    };
    setUser(updated);
    localStorage.setItem('kd_user', JSON.stringify(updated));
    showToast('Preferences updated successfully!', 'success');
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
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
