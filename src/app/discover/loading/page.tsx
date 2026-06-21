"use client";

import React, { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '../../../lib/api';
import { useAuth as useClerkAuth } from '@clerk/nextjs';
import { Brain, Sparkles, ShieldCheck, Heart, Star, Film } from 'lucide-react';

const STEPS = [
  { label: 'Understanding Mood', detail: 'Parsing emotional cues and watching context', icon: Brain },
  { label: 'Analyzing Preferences', detail: 'Cross-referencing historical favorites', icon: Heart },
  { label: 'Finding Matches', detail: 'Filtering library of 50,000+ movies & TV shows', icon: Film },
  { label: 'Checking Ratings', detail: 'Validating review scores & hidden gem metrics', icon: Star },
  { label: 'Checking Providers', detail: 'Locating real-time availability on subscription & free tiers', icon: ShieldCheck },
  { label: 'Selecting Best Recommendation', detail: 'Synthesizing the perfect title for your night', icon: Sparkles },
];

const TOTAL_DURATION = 6000;
const STEP_DURATIONS = [900, 1000, 1000, 900, 1000, 1200];

const FACTS = [
  'The average person spends 18 minutes deciding what to watch.',
  'BingeKaro narrows that down to a perfect match instantly.',
  'We analyze mood, group context, and provider availability simultaneously.',
  'Filtering out the noise to ensure every recommendation is high quality.',
  'Your personalized movie DNA grows stronger with every selection.',
];

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = React.useState(-1);
  const [progress, setProgress] = React.useState(0);
  const [factIndex, setFactIndex] = React.useState(0);
  const { getToken } = useClerkAuth();

  React.useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex(i => (i + 1) % FACTS.length);
    }, 2800);
    return () => clearInterval(factTimer);
  }, []);

  React.useEffect(() => {
    const moods = searchParams ? (searchParams.get('moods')?.split(',').filter(Boolean) ?? []) : [];
    const genres = searchParams ? (searchParams.get('genres')?.split(',').filter(Boolean) ?? []) : [];

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (TOTAL_DURATION / 30)), 98));
    }, 30);

    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 150 : 0));
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, STEP_DURATIONS[i]));
      }
      clearInterval(progressInterval);
      setProgress(100);

      await new Promise(resolve => setTimeout(resolve, 500));
      
      try {
        const token = await getToken();
        if (!token) {
          router.push('/discover');
          return;
        }

        const res = await api.getRecommendations(token, {
          genre: genres[0] || moods[0] || '',
          platform: searchParams.get('platform') || '',
          language: searchParams.get('language') || '',
          runtime: searchParams.get('runtime') || '',
        });

        if (res.results && res.results.length > 0) {
          const recMovie = res.results[0];
          const result = encodeURIComponent(JSON.stringify({ 
            movieId: recMovie.id, 
            aiExplanation: recMovie.overview || "This matches your selected preferences." 
          }));
          router.push(`/discover/result?data=${result}`);
        } else {
          router.push('/discover');
        }
      } catch {
        router.push('/discover');
      }
    };

    runSteps();
    return () => clearInterval(progressInterval);
  }, [searchParams, router, getToken]);

  const completedCount = Math.max(0, currentStep);

  return (
    <div className="min-h-screen bg-[#07111F] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Cinematic ambient glow backdrops */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,23,68,0.06) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(circle, rgba(255,82,82,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />

      <div className="relative z-10 max-w-sm w-full">
        {/* Pulsing Central Ring Spinner */}
        <div className="relative w-28 h-28 mx-auto mb-10">
          <div className="absolute inset-[-10px] rounded-full opacity-30"
               style={{ background: 'radial-gradient(circle, rgba(255,23,68,0.4) 0%, transparent 70%)' }} />

          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(255,23,68,1) 20%, transparent 40%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
          />

          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'conic-gradient(from 120deg, transparent 0%, rgba(255,82,82,0.8) 15%, transparent 35%)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
          />

          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="1.5" />
            <motion.circle
              cx="50" cy="50" r="46" fill="none"
              stroke="#FF1744" strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 46}`}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress / 100) }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            />
          </svg>

          {/* Icon placeholder inside */}
          <div className="absolute inset-6 rounded-full bg-[#081528] border border-white/[0.08] flex items-center justify-center">
            <AnimatePresence mode="wait">
              {currentStep >= 0 && currentStep < STEPS.length ? (
                <motion.div
                  key={currentStep}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-accent-light"
                >
                  {React.createElement(STEPS[currentStep].icon, { className: 'w-6 h-6' })}
                </motion.div>
              ) : (
                <Sparkles className="w-6 h-6 text-accent-light" />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-[22px] font-black text-white tracking-tight mb-1">
            Analyzing OTT Catalogs
          </h2>
          <p className="text-[12.5px] text-muted/65 font-medium">
            Step {completedCount} of {STEPS.length} finalized
          </p>
        </div>

        {/* Loading list */}
        <div className="space-y-2 mb-8">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const upcoming = i > currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: upcoming ? 0.2 : 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all duration-300 ${
                  active
                    ? 'bg-accent/10 border-accent/25 shadow-[0_4px_15px_rgba(255,23,68,0.15)]'
                    : done
                    ? 'bg-white/[0.01] border-transparent'
                    : 'border-transparent'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-all duration-300 ${
                  done ? 'bg-accent border-accent shadow-[0_0_10px_rgba(255,23,68,0.4)]'
                       : active ? 'border-accent'
                       : 'border-white/10'
                }`}>
                  {done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-1.5 h-1.5 rounded-full bg-white" />
                  ) : active ? (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-1.5 h-1.5 bg-accent rounded-full"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[12.5px] font-bold tracking-wide transition-colors ${
                    done ? 'text-white/40' : active ? 'text-white' : 'text-white/15'
                  }`}>
                    {step.label}
                  </p>
                  {active && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-[10px] text-muted/60 mt-0.5 leading-normal"
                    >
                      {step.detail}
                    </motion.p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Anticedent Progress bar */}
        <div className="relative h-1 bg-white/[0.04] rounded-full overflow-hidden mb-6">
          <motion.div
            className="h-full bg-accent rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
          />
        </div>

        {/* Fun Facts */}
        <div className="text-center h-10 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.3 }}
              className="text-[11px] text-muted/40 font-medium leading-relaxed px-4"
            >
              {FACTS[factIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#07111F] flex items-center justify-center">Loading search results...</div>}>
      <LoadingContent />
    </Suspense>
  );
}
