import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMoodBasedRecommendation, generateAIExplanation } from '../lib/mockData';

const STEPS = [
  { label: 'Understanding your mood', detail: 'Analyzing emotional context & preferences' },
  { label: 'Matching your taste profile', detail: 'Cross-referencing 50,000+ titles' },
  { label: 'Analyzing genres & themes', detail: 'Deep genre classification' },
  { label: 'Checking runtime preferences', detail: 'Filtering by watch time' },
  { label: 'Evaluating ratings & reviews', detail: 'Comparing critic & audience scores' },
  { label: 'Checking OTT availability', detail: 'Querying streaming platforms' },
  { label: 'Applying personalization', detail: 'Tailoring to your history' },
  { label: 'Selecting your perfect pick', detail: 'Finalizing the best match' },
];

const TOTAL_DURATION = 7200;
const STEP_DURATIONS = [800, 900, 850, 800, 900, 950, 800, 1200];

const FACTS = [
  'The average person spends 18 minutes deciding what to watch.',
  'KyaDekhu reduces that to under 30 seconds.',
  'Our AI analyzes mood, context, and availability together.',
  'Over 50 OTT signals processed per recommendation.',
  'Your taste profile gets smarter with every pick.',
];

export const RecommendationLoading: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = React.useState(-1);
  const [progress, setProgress] = React.useState(0);
  const [factIndex, setFactIndex] = React.useState(0);

  React.useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex(i => (i + 1) % FACTS.length);
    }, 3000);
    return () => clearInterval(factTimer);
  }, []);

  React.useEffect(() => {
    const moods = searchParams.get('moods')?.split(',').filter(Boolean) ?? [];
    const genres = searchParams.get('genres')?.split(',').filter(Boolean) ?? [];

    const progressInterval = setInterval(() => {
      setProgress(p => Math.min(p + (100 / (TOTAL_DURATION / 40)), 97));
    }, 40);

    const runSteps = async () => {
      for (let i = 0; i < STEPS.length; i++) {
        await new Promise(resolve => setTimeout(resolve, i === 0 ? 200 : 0));
        setCurrentStep(i);
        await new Promise(resolve => setTimeout(resolve, STEP_DURATIONS[i]));
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

  const completedCount = Math.max(0, currentStep);

  return (
    <div className="min-h-screen bg-[#080808] flex items-center justify-center px-6 relative overflow-hidden">

      {/* Ambient background orbs */}
      {[
        { size: 700, delay: 0, duration: 9, x: '50%', y: '50%', color: 'rgba(139,92,246,0.07)' },
        { size: 450, delay: 2, duration: 11, x: '20%', y: '30%', color: 'rgba(109,40,217,0.05)' },
        { size: 320, delay: 1, duration: 7, x: '80%', y: '70%', color: 'rgba(167,139,250,0.06)' },
      ].map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            left: orb.x,
            top: orb.y,
            transform: 'translate(-50%, -50%)',
            filter: 'blur(40px)',
          }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.7, 0.4, 0.7] }}
          transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
        />
      ))}

      <div className="relative z-10 max-w-sm w-full">

        {/* ── Concentric ring spinner ── */}
        <div className="relative w-28 h-28 mx-auto mb-10">
          {/* Outer glow */}
          <div className="absolute inset-[-8px] rounded-full opacity-20"
               style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, transparent 70%)' }} />

          {/* Ring 1 — slowest */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(139,92,246,0.9) 25%, transparent 50%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          />

          {/* Ring 2 — counter */}
          <motion.div
            className="absolute inset-2 rounded-full"
            style={{
              background: 'conic-gradient(from 90deg, transparent 0%, rgba(167,139,250,0.6) 20%, transparent 40%)',
            }}
            animate={{ rotate: -360 }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'linear' }}
          />

          {/* Ring 3 — fastest */}
          <motion.div
            className="absolute inset-4 rounded-full"
            style={{
              background: 'conic-gradient(from 180deg, transparent 0%, rgba(196,181,253,0.5) 15%, transparent 30%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />

          {/* Progress fill ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="2" />
            <motion.circle
              cx="50" cy="50" r="46" fill="none"
              stroke="rgba(139,92,246,0.6)" strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 46}`}
              animate={{ strokeDashoffset: 2 * Math.PI * 46 * (1 - progress / 100) }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            />
          </svg>

          {/* Inner circle */}
          <div className="absolute inset-6 rounded-full bg-[#0c0816] border border-accent/20 flex items-center justify-center">
            <motion.svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <path d="M15 10L19.553 7.724A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"
                stroke="rgba(167,139,250,0.9)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
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
            className="text-[13px] text-muted"
          >
            {completedCount} of {STEPS.length} checks complete
          </motion.p>
        </div>

        {/* Steps */}
        <div className="space-y-1.5 mb-8">
          {STEPS.map((step, i) => {
            const done = i < currentStep;
            const active = i === currentStep;
            const upcoming = i > currentStep;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: upcoming ? 0.25 : 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-400 ${
                  active
                    ? 'bg-accent/10 border border-accent/20'
                    : done
                    ? 'bg-white/[0.02]'
                    : ''
                }`}
              >
                {/* Step indicator */}
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                  done ? 'bg-accent shadow-[0_0_10px_rgba(139,92,246,0.5)]'
                       : active ? 'border-2 border-accent'
                       : 'border border-white/10'
                }`}>
                  {done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400 }}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.div>
                  ) : active ? (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="w-2 h-2 bg-accent rounded-full"
                    />
                  ) : null}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`text-[12.5px] font-semibold transition-colors duration-300 ${
                    done ? 'text-white/50' : active ? 'text-white' : 'text-white/20'
                  }`}>
                    {step.label}
                  </p>
                  <AnimatePresence>
                    {active && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[10.5px] text-muted/70 mt-0.5"
                      >
                        {step.detail}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {done && (
                  <motion.span
                    initial={{ opacity: 0, x: 4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-[9.5px] font-bold text-accent/60 uppercase tracking-wider"
                  >
                    ✓
                  </motion.span>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="relative h-1.5 bg-white/[0.05] rounded-full overflow-hidden mb-4">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #7C3AED, #A78BFA, #C4B5FD)' }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
          {/* Shimmer */}
          <motion.div
            className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-white/25 to-transparent"
            animate={{ x: ['-100px', '400px'] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        {/* Fun fact cycling */}
        <div className="text-center h-8 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p
              key={factIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-[11px] text-muted/50 leading-relaxed px-4"
            >
              {FACTS[factIndex]}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
