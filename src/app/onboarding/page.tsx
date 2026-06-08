"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, Film, Heart, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function OnboardingPage() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 pt-24 pb-20">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 rounded-full bg-[#8B5CF6]/15 filter blur-[110px]" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[#FF3B30]/10 filter blur-[90px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="relative z-10 w-full max-w-[640px] bg-white/[0.02] border border-white/[0.06] backdrop-blur-xl p-8 sm:p-10 rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(139,92,246,0.06)] text-center space-y-8"
      >
        <div className="space-y-3">
          <div className="w-14 h-14 rounded-[20px] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center text-[#8B5CF6] mx-auto shadow-[0_0_20px_rgba(139,92,246,0.2)] animate-float">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight leading-tight">
            Welcome to the Club, <span className="text-gradient">{user?.name || 'Cinephile'}</span>!
          </h1>
          <p className="text-[13.5px] text-muted-foreground max-w-sm mx-auto leading-relaxed">
            Your BingeKaro account is active. Let's personalize your discovery engine to find perfect matches.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
          {[
            { title: "Select Genres", desc: "Choose your favorite cinema filters.", icon: Film },
            { title: "Choose Networks", desc: "Select active OTT providers.", icon: Zap },
            { title: "Set Moods", desc: "Fine-tune psychological preferences.", icon: Heart },
          ].map((f, i) => (
            <div key={i} className="p-4.5 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6] mb-3">
                <f.icon className="w-4 h-4" />
              </div>
              <h4 className="text-[12.5px] font-bold text-white leading-normal">{f.title}</h4>
              <p className="text-[10.5px] text-muted-foreground mt-1 leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push('/profile')}
          className="w-full h-12 rounded-[14px] text-[13.5px] font-bold text-white flex items-center justify-center gap-2 group bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_4px_24px_rgba(139,92,246,0.3)] transition-all"
        >
          Customize My Taste Blueprint
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </motion.div>
    </div>
  );
}
