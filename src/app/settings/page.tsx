"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings as SettingsIcon, Sliders, Shield, Bell, User, Tv, Check, 
  Loader2, Save, LogOut, Moon, Sun, Volume2, Globe, Heart 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { api } from '../../lib/api';
import { GENRES, LANGUAGES } from '../../lib/mockData';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import type { GenreId, LanguageId, OTTProviderId } from '../../types';

type ActiveTab = 'blueprint' | 'account' | 'preferences' | 'notifications';

export default function SettingsPage() {
  const { user, updatePreferences, logout, isLoading } = useAuth();
  const { showToast } = useToast();
  const { getToken } = useClerkAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('blueprint');
  const [isSaving, setIsSaving] = useState(false);

  // Taste Blueprint State
  const [selectedGenres, setSelectedGenres] = useState<GenreId[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageId[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<OTTProviderId[]>([]);

  // Preferences State
  const [parentalControls, setParentalControls] = useState(false);
  const [playbackQuality, setPlaybackQuality] = useState<'4k' | '1080p' | '720p'>('4k');
  const [autoPlayTrailers, setAutoPlayTrailers] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Notifications State
  const [emailDigest, setEmailDigest] = useState(true);
  const [releaseAlerts, setReleaseAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Sync state with user context
  useEffect(() => {
    if (user) {
      setSelectedGenres(user.favoriteGenres || []);
      setSelectedProviders(user.favoriteProviders || []);
      
      // Load saved notification/quality preferences from localStorage (or backend mock)
      const cachedConfig = localStorage.getItem(`kd_settings_config_${user.id}`);
      if (cachedConfig) {
        try {
          const config = JSON.parse(cachedConfig);
          setParentalControls(config.parentalControls ?? false);
          setPlaybackQuality(config.playbackQuality ?? '4k');
          setAutoPlayTrailers(config.autoPlayTrailers ?? true);
          setTheme(config.theme ?? 'dark');
          setEmailDigest(config.emailDigest ?? true);
          setReleaseAlerts(config.releaseAlerts ?? true);
          setMarketingEmails(config.marketingEmails ?? false);
        } catch {}
      }
    }
  }, [user]);

  // Load languages from backend preferences
  useEffect(() => {
    const loadBackendLanguages = async () => {
      try {
        const token = await getToken();
        if (token) {
          const prefs = await api.getPreferences(token);
          if (prefs && Array.isArray(prefs.languages)) {
            setSelectedLanguages(prefs.languages as LanguageId[]);
          }
        }
      } catch {}
    };
    if (user) {
      loadBackendLanguages();
    }
  }, [user, getToken]);

  const handleSaveSettings = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      // 1. Save preferences/genres/providers to the backend
      const token = await getToken();
      if (token) {
        // Upsert to backend
        await api.updatePreferences(token, {
          genres: selectedGenres,
          languages: selectedLanguages,
          platforms: selectedProviders
        });
      }

      // 2. Save locally for App Preferences & Notifications
      const config = {
        parentalControls,
        playbackQuality,
        autoPlayTrailers,
        theme,
        emailDigest,
        releaseAlerts,
        marketingEmails
      };
      localStorage.setItem(`kd_settings_config_${user.id}`, JSON.stringify(config));

      // 3. Update Auth Context state
      await updatePreferences(selectedGenres, user.favoriteMoods || [], selectedProviders);
      showToast('Settings saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleGenre = (id: GenreId) => {
    setSelectedGenres(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
  };

  const toggleLanguage = (id: LanguageId) => {
    setSelectedLanguages(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  const toggleProvider = (id: OTTProviderId) => {
    setSelectedProviders(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#8B5CF6] animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#050505] pt-24 pb-20 flex items-center justify-center px-6">
        <div className="text-center space-y-4 max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center mx-auto text-[#8B5CF6]">
            <Shield className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-white">Access Settings</h2>
          <p className="text-[13.5px] text-muted-foreground leading-relaxed">
            Please sign in to configure your personalized Taste Blueprint, parental controls, and platform preferences.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-28">
      <div className="max-w-[1000px] mx-auto px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.05]">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6]">
              <SettingsIcon className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">Account Settings</h1>
              <p className="text-[12.5px] text-muted-foreground font-medium">Manage preferences, notifications, and blueprint configs.</p>
            </div>
          </div>
          <button
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center justify-center gap-2 bg-[#8B5CF6] hover:bg-[#8b5cf6]/90 disabled:opacity-50 text-white font-bold text-[12px] px-5 py-2.5 rounded-xl shadow-[0_4px_20px_rgba(139,92,246,0.25)] transition-all"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Save Preferences
          </button>
        </div>

        {/* Dashboard Tabs & Panel Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Navigation Sidebar */}
          <div className="md:col-span-1 space-y-1.5">
            {[
              { id: 'blueprint', label: 'Taste Blueprint', icon: Sliders },
              { id: 'preferences', label: 'App Preferences', icon: Tv },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'account', label: 'Account Security', icon: User },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as ActiveTab)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[12.5px] font-bold border transition-all ${
                  activeTab === tab.id
                    ? 'bg-white/[0.03] border-white/[0.08] text-white'
                    : 'bg-transparent border-transparent text-muted-foreground hover:text-white'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-[#8B5CF6]' : 'text-muted-foreground'}`} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="md:col-span-3 min-h-[400px] bg-white/[0.01] border border-white/[0.04] rounded-[24px] p-6 lg:p-8">
            <AnimatePresence mode="wait">
              {activeTab === 'blueprint' && (
                <motion.div
                  key="blueprint"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-black text-white">Personal Discover Blueprint</h3>
                    <p className="text-xs text-muted-foreground">Select preferred options to fine-tune recommendation results.</p>
                  </div>

                  {/* Genres Selection */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-[#8B5CF6]" /> Favorite Genres
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {GENRES.map(genre => {
                        const active = selectedGenres.includes(genre.id);
                        return (
                          <button
                            key={genre.id}
                            onClick={() => toggleGenre(genre.id)}
                            className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                              active ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
                            }`}
                          >
                            {genre.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Languages Selection */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5 text-[#8B5CF6]" /> Watching Languages
                    </h4>
                    <div className="flex flex-wrap gap-1.5">
                      {LANGUAGES.map(lang => {
                        const active = selectedLanguages.includes(lang.id);
                        return (
                          <button
                            key={lang.id}
                            onClick={() => toggleLanguage(lang.id)}
                            className={`px-3.5 py-2 rounded-xl text-[11px] font-bold border transition-colors ${
                              active ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white' : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
                            }`}
                          >
                            {lang.label} ({lang.nativeLabel})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Streaming Providers Selection */}
                  <div className="space-y-3">
                    <h4 className="text-[11px] font-bold text-white/50 uppercase tracking-widest flex items-center gap-1.5">
                      <Tv className="w-3.5 h-3.5 text-[#8B5CF6]" /> Connected OTT Networks
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {Object.values(PROVIDER_REGISTRY).map(prov => {
                        const active = selectedProviders.includes(prov.id as OTTProviderId);
                        return (
                          <button
                            key={prov.id}
                            onClick={() => toggleProvider(prov.id as OTTProviderId)}
                            className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                              active ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white' : 'bg-white/[0.02] border-white/10 text-muted-foreground hover:text-white'
                            }`}
                          >
                            <span className="text-[11.5px] font-bold">{prov.name}</span>
                            {active && <Check className="w-3.5 h-3.5 text-[#8B5CF6] shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'preferences' && (
                <motion.div
                  key="preferences"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-black text-white">App Experience & Playback</h3>
                    <p className="text-xs text-muted-foreground">Adjust playback specifications and parental controls.</p>
                  </div>

                  {/* Parental Controls Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">Parental Lock (R-Rated Filter)</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Filter adult content out of discovered scans and recommendations.</p>
                    </div>
                    <button
                      onClick={() => setParentalControls(!parentalControls)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${parentalControls ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${parentalControls ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Auto Play Trailers Toggle */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">Auto-Play Trailers</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Automatically launch trailers on detail page loading.</p>
                    </div>
                    <button
                      onClick={() => setAutoPlayTrailers(!autoPlayTrailers)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${autoPlayTrailers ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${autoPlayTrailers ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Playback Quality Select */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white/70">Default Stream Quality Badge</h4>
                    <div className="flex gap-2">
                      {(['4k', '1080p', '720p'] as const).map(quality => (
                        <button
                          key={quality}
                          onClick={() => setPlaybackQuality(quality)}
                          className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border transition-colors ${
                            playbackQuality === quality
                              ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white'
                              : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
                          }`}
                        >
                          {quality.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Theme Preference */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-white/70">App Interface Theme</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setTheme('dark')}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-2 transition-colors ${
                          theme === 'dark'
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white'
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
                        }`}
                      >
                        <Moon className="w-3.5 h-3.5" /> Dark Mode
                      </button>
                      <button
                        onClick={() => setTheme('light')}
                        className={`flex-1 py-2.5 rounded-xl text-[11px] font-bold border flex items-center justify-center gap-2 transition-colors ${
                          theme === 'light'
                            ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white'
                            : 'bg-white/5 border-white/10 text-muted-foreground hover:text-white'
                        }`}
                      >
                        <Sun className="w-3.5 h-3.5" /> Light Mode
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-black text-white">Alerts & Notifications</h3>
                    <p className="text-xs text-muted-foreground">Control how we communicate releases and updates.</p>
                  </div>

                  {/* Email Digest */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">Weekly Entertainment Digest</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Receive personalized updates of new streaming content in your region.</p>
                    </div>
                    <button
                      onClick={() => setEmailDigest(!emailDigest)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${emailDigest ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${emailDigest ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Release Alerts */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">Watchlist Release Notifications</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Get notified instantly when your watchlisted content is streaming.</p>
                    </div>
                    <button
                      onClick={() => setReleaseAlerts(!releaseAlerts)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${releaseAlerts ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${releaseAlerts ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>

                  {/* Marketing Emails */}
                  <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-2xl">
                    <div>
                      <h4 className="text-xs font-bold text-white">Recommendations & Newsletters</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Let Nyxen send customized cinematic insights to your inbox.</p>
                    </div>
                    <button
                      onClick={() => setMarketingEmails(!marketingEmails)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors ${marketingEmails ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition-transform ${marketingEmails ? 'translate-x-4' : 'translate-x-0'}`} />
                    </button>
                  </div>
                </motion.div>
              )}

              {activeTab === 'account' && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="space-y-1">
                    <h3 className="text-[15px] font-black text-white">Security & Identity</h3>
                    <p className="text-xs text-muted-foreground">Authentication profile details synced from Clerk.</p>
                  </div>

                  {/* Profile Details Card */}
                  <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-2xl flex items-center gap-4">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-white/10" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#8B5CF6] flex items-center justify-center text-white font-bold text-lg">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="text-[13px] font-bold text-white leading-none mb-1">{user.name}</h4>
                      <p className="text-[11px] text-muted-foreground truncate leading-none">{user.email}</p>
                    </div>
                  </div>

                  {/* Session / Logout Block */}
                  <div className="pt-4 border-t border-white/5 space-y-3">
                    <h4 className="text-xs font-bold text-white/50">Actions</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={logout}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/30 text-rose-400 font-bold text-[12px] rounded-xl transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out Session
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
