import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMoodBasedRecommendation, generateAIExplanation } from '../lib/mockData';

const STEPS = [
  { label: 'Understanding your mood', detail: 'Analyzing emotional context' },
  { label: 'Finding matching titles', detail: 'Scanning 50,000+ titles' },
  { label: 'Checking streaming availability', detail: 'Querying OTT providers' },
  { label: 'Selecting the perfect pick', detail: 'Finalizing recommendation' },
];

const TOTAL_DURATION = 5200;
const STEP_DURATIONS = [1100, 1400, 1200, 1500];

export const RecommendationLoading: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = React.useState(-1);
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const moods = searchParams.get('moods')?.split(',').filter(Boolean) ?? [];
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) ?? [];

    let elapsed = 0;

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (TOTAL_DURATION / 50)), 98));
    }, 50);

    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 300 : 0));
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, STEP_DURATIONS[i]));
        elapsed += STEP_DURATIONS[i];
      }
      clearInterval(progressInterval);
      setProgress(100);

      await new Promise(resolve => setTimeout(resolve, 400));
      const movie = getMoodBasedRecommendation(moods, genres);
      const aiExplanation = generateAIExplanation(movie, moods);
      const result = encodeURIComponent(JSON.stringify({ movieId: movie.id, aiExplanation }));
      navigate(`/discover/result?data=${result}`);
    };

    runSteps();
    return () => clearInterval(progressInterval);
  }, []);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient orbs */}
      {[
        { size: 600, delay: 0, duration: 8 },
        { size: 400, delay: 2, duration: 10 },
        { size: 280, delay: 1, duration: 6 },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, rgba(139,92,246,${0.06 - i * 0.015}) 0%, transparent 70%)`,
            left: '50%',
            top: '50%',
            marginLeft: -orb.size / 2,
            marginTop: -orb.size / 2,
          }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0.3, 0.6] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      <div className="relative z-10 max-w-sm w-full text-center">

        {/* Spinner */}
        <div className="relative w-24 h-24 mx-auto mb-10">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-white/[0.06]" />
          {/* Spinning arc */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.8) 30%, transparent 60%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
          />
          {/* Spinning arc 2 — counter */}
          <motion.div
            className="absolute inset-1.5 rounded-full"
            style={{
              background: 'conic-gradient(from 180deg, transparent 0%, rgba(167,139,250,0.4) 25%, transparent 50%)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
          />
          {/* Inner circle */}
          <div className="absolute inset-3 rounded-full bg-[#0f0a1e] border border-accent/20 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                stroke="rgba(167,139,250,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-white tracking-[-0.02em] mb-2"
        >
          Finding your perfect watch
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-[13px] text-muted mb-10"
        >
          This usually takes a few seconds
        </motion.p>

        {/* Steps */}
        <div className="space-y-2.5 mb-10 text-left">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                  active ? 'bg-white/[0.05] border border-white/[0.08]' : ''
                }`}
              >
                {/* Step indicator */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-400 ${
                  done ? 'bg-accent' : active ? 'border-2 border-accent' : 'border-2 border-white/10'
                }`}>
                  {done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                  ) : active ? (
                    <motion.div
                      animate={{ scale: [1, 1.4, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="w-2 h-2 bg-accent rounded-full"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[13px] font-semibold transition-colors duration-300 ${
                    done ? 'text-white/60' : active ? 'text-white' : 'text-white/20'
                  }`}>
                    {step.label}
                  </p>
                  <AnimatePresence>
                    {active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[11px] text-muted mt-0.5"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {done && (
                  <span className="text-[10px] font-semibold text-accent/60 uppercase tracking-wider">Done</span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #7C3AED, #A78BFA)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {/* Shimmer on progress bar */}
          <motion.div
            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            animate={{ x: ['-80px', '300px'] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <p className="text-[11px] text-muted/50 mt-2">{Math.round(progress)}%</p>
      </div>
    </div>
  );
};
