"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Sliders, Shield, Bell, User } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-[#050505] pt-24 pb-28">
      <div className="max-w-[800px] mx-auto px-6 lg:px-10 space-y-8">
        
        {/* Header */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-white/[0.05]">
          <div className="w-12 h-12 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6]">
            <SettingsIcon className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Account Settings</h1>
            <p className="text-[12.5px] text-muted-foreground">Manage your BingeKaro preferences and configurations.</p>
          </div>
        </div>

        {/* Options Grid */}
        <div className="space-y-4">
          {[
            { title: "Discovery Filters", desc: "Fine-tune your AI matching criteria and language filters.", icon: Sliders },
            { title: "Account & Security", desc: "View and update your primary profile details and credentials.", icon: User },
            { title: "Privacy Controls", desc: "Manage third-party connections and session preferences.", icon: Shield },
            { title: "Notifications", desc: "Configure release alerts, mood scans, and service updates.", icon: Bell },
          ].map((opt, i) => (
            <motion.div
              key={opt.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.08] hover:shadow-[0_12px_40px_rgba(139,92,246,0.04)] rounded-[20px] p-5 flex items-center gap-4 transition-all duration-300 cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-[#8B5CF6]">
                <opt.icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
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
