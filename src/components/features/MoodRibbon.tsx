"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';
import Link from 'next/link';
import { MOODS } from '../../lib/mockData';
import {
  Heart, Zap, Laugh, Moon, Sun, Droplets, Coffee, Ghost, Brain, Flame, Sparkles,
} from 'lucide-react';

const MOOD_ICONS: Record<string, React.ComponentType<any>> = {
  adventurous: Compass, romantic: Heart, thrilling: Zap, funny: Laugh,
  dark: Moon, 'feel-good': Sun, emotional: Droplets, inspiring: Sparkles,
  chill: Coffee, scary: Ghost, 'mind-bending': Brain, 'action-packed': Flame,
};

export const MoodRibbon: React.FC = React.memo(() => {
  return (
    <div className="relative border-y border-white/[0.04] bg-white/[0.01] backdrop-blur-md z-20">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-5">
        <div className="flex items-center gap-6 overflow-x-auto scroll-row">
          <span className="text-[10px] font-extrabold text-accent-light uppercase tracking-widest shrink-0 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5" />
            Mood:
          </span>
          {MOODS.map(mood => {
            const MoodIcon = MOOD_ICONS[mood.id] || Compass;
            return (
              <Link key={mood.id} href={`/discover?mood=${mood.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="chip border-white/[0.08] hover:border-white/20 hover:text-white py-1.5 shrink-0 flex items-center gap-2"
                >
                  <MoodIcon className="w-3.5 h-3.5 text-accent-light" />
                  <span className="text-xs font-bold uppercase tracking-wider">{mood.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
});

MoodRibbon.displayName = 'MoodRibbon';
