"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ArrowLeft, Check, Film, Globe, Tv, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { LANGUAGES, GENRES } from '../../lib/mockData';
import { PROVIDER_REGISTRY } from '../../lib/providers';
import { saveUserPreferences } from '../../lib/supabase';
import type { LanguageId, GenreId, OTTProviderId } from '../../types';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, updatePreferences } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  // Onboarding Selection State
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageId[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<GenreId[]>([]);
  const [selectedProviders, setSelectedProviders] = useState<OTTProviderId[]>([]);

  const toggleLanguage = (id: LanguageId) => {
    setSelectedLanguages(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleGenre = (id: GenreId) => {
    setSelectedGenres(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleProvider = (id: OTTProviderId) => {
    setSelectedProviders(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedLanguages.length === 0) {
      showToast('Please select at least one language.', 'info');
      return;
    }
    if (step === 2 && selectedGenres.length === 0) {
      showToast('Please select at least one genre.', 'info');
      return;
    }
    setStep(prev => (prev + 1) as any);
  };

  const handleBack = () => {
    setStep(prev => (prev - 1) as any);
  };

  const handleComplete = async () => {
    if (selectedProviders.length === 0) {
      showToast('Please select at least one OTT platform.', 'info');
      return;
    }
    if (!user) {
      showToast('Authentication error. Please login first.', 'error');
      return;
    }

    setLoading(true);
    try {
      // 1. Save to Supabase (with localStorage fallback inside)
      await saveUserPreferences({
        userId: user.id,
        languages: selectedLanguages,
        genres: selectedGenres,
        providers: selectedProviders,
      });

      // 2. Update local app state preferences (AuthContext)
      // Since AuthContext stores favoriteGenres and favoriteProviders (favoriteMoods default to empty/existing)
      updatePreferences(
        selectedGenres,
        user.favoriteMoods || [],
        selectedProviders
      );

      showToast('Taste profile saved successfully!', 'success');
      router.push('/dashboard');
    } catch (err) {
      console.error(err);
      showToast('Failed to save preferences. Redirecting...', 'error');
      router.push('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#8B5CF6]/15 filter blur-[110px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#FF3B30]/10 filter blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative z-10 w-full max-w-[580px] bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.06)] space-y-6"
      >
        {/* Progress Bar & Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-center text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
            <span>Step {step} of 3</span>
            <span>{step === 1 ? 'Languages' : step === 2 ? 'Genres' : 'OTT Platforms'}</span>
          </div>
          <div className="h-1 w-full bg-white/[0.04] rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#8B5CF6] transition-all duration-300"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Steps Content */}
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#8B5CF6]">
                  <Globe className="w-5 h-5" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Preferred Languages</h2>
                </div>
                <p className="text-[12.5px] text-muted-foreground">Select the languages you prefer to watch content in.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {LANGUAGES.map(lang => {
                  const active = selectedLanguages.includes(lang.id);
                  return (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        active 
                          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:border-white/20 hover:text-white'
                      }`}
                    >
                      <span className="text-[13px] font-bold">{lang.label}</span>
                      <span className="text-[10px] opacity-65 mt-0.5">{lang.nativeLabel}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#8B5CF6]">
                  <Film className="w-5 h-5" />
                  <h2 className="text-xl font-bold text-white tracking-tight">Favorite Genres</h2>
                </div>
                <p className="text-[12.5px] text-muted-foreground">Select the genres you enjoy the most.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 max-h-[280px] overflow-y-auto pr-1">
                {GENRES.map(genre => {
                  const active = selectedGenres.includes(genre.id);
                  return (
                    <button
                      key={genre.id}
                      onClick={() => toggleGenre(genre.id)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-[12.5px] font-semibold transition-all ${
                        active 
                          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white'
                          : 'bg-white/[0.015] border-white/[0.05] text-muted-foreground hover:border-white/15 hover:text-white'
                      }`}
                    >
                      <span>{genre.label}</span>
                      {active && <Check className="w-3.5 h-3.5 text-[#8B5CF6]" />}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-[#8B5CF6]">
                  <Tv className="w-5 h-5" />
                  <h2 className="text-xl font-bold text-white tracking-tight">OTT Providers</h2>
                </div>
                <p className="text-[12.5px] text-muted-foreground">Select your active streaming services to filter available listings.</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {Object.values(PROVIDER_REGISTRY).map(prov => {
                  const active = selectedProviders.includes(prov.id as OTTProviderId);
                  return (
                    <button
                      key={prov.id}
                      onClick={() => toggleProvider(prov.id as OTTProviderId)}
                      className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all text-center ${
                        active 
                          ? 'bg-[#8B5CF6]/10 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                          : 'bg-white/[0.02] border-white/[0.06] text-muted-foreground hover:border-white/25 hover:text-white'
                      }`}
                    >
                      <span className="text-[12px] font-bold">{prov.name}</span>
                      <span className="text-[9px] opacity-50 uppercase mt-0.5 tracking-wider">{prov.type}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer Navigation */}
        <div className="flex justify-between items-center pt-4 border-t border-white/[0.04]">
          {step > 1 ? (
            <button
              onClick={handleBack}
              disabled={loading}
              className="h-10 px-4 rounded-xl border border-white/[0.08] text-[12px] font-bold text-white flex items-center gap-1.5 hover:bg-white/[0.03] transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={handleNext}
              className="h-10 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-[12px] font-bold text-white flex items-center gap-1.5 shadow-[0_4px_15px_rgba(139,92,246,0.2)] transition-all"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleComplete}
              disabled={loading}
              className="h-10 px-5 rounded-xl bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 text-[12px] font-bold text-white flex items-center gap-1.5 shadow-[0_4px_20px_rgba(139,92,246,0.3)] transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  Saving Profile
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                </>
              ) : (
                <>
                  Complete Setup
                  <Check className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
