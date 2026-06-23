"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Flame, Compass } from 'lucide-react';

export default function AIPage() {
  return (
    <div className="min-h-screen bg-background pt-24 pb-28">
      <div className="max-w-[800px] mx-auto px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-white/[0.05]">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(139,92,246,0.3)] animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">AI Discovery engine</h1>
            <p className="text-[12.5px] text-muted-foreground">Engage with custom AI algorithms to find your exact matches.</p>
          </div>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { title: "Psychological Mood Matcher", desc: "Scan complex psychological states to find tailored films.", icon: Brain },
            { title: "Trending Hype Analyzer", desc: "Matches you to shows currently breaking records.", icon: Flame },
            { title: "Genre Fusion Engine", desc: "Select and blend multiple genres to explore hybrid classics.", icon: Compass },
          ].map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white/[0.02] border border-white/[0.05] hover:border-accent/30 hover:shadow-[0_12px_40px_rgba(139,92,246,0.06)] rounded-[24px] p-6 flex flex-col justify-between min-h-[160px] transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-accent mb-4">
                <opt.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[14px] font-bold text-white leading-normal">{opt.title}</h3>
                <p className="text-[11.5px] text-muted-foreground mt-0.5">{opt.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
