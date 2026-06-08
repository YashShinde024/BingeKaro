import React from 'react';
import { SignUp } from '@clerk/nextjs';
import { Film, ShieldCheck } from 'lucide-react';

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      {/* Glow Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-[#8B5CF6]/15 filter blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-[#FF3B30]/10 filter blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[820px] bg-[#050505] border border-white/[0.08] rounded-[32px] overflow-hidden flex shadow-[0_24px_80px_rgba(0,0,0,0.9),0_0_40px_rgba(139,92,246,0.08)]">
        {/* LEFT — Cinematic Branding Side Panel */}
        <div className="hidden md:flex flex-col justify-between w-[42%] p-8 relative overflow-hidden bg-gradient-to-br from-[#8B5CF6]/15 via-[#0A0A0A] to-[#050505] border-r border-white/[0.06]">
          {/* Glowing Auroras inside panel */}
          <div className="absolute top-1/4 left-1/4 w-48 h-48 rounded-full bg-[#8B5CF6]/20 filter blur-[80px]" />
          <div className="absolute bottom-10 -left-10 w-40 h-40 rounded-full bg-[#FF3B30]/10 filter blur-[60px]" />

          <div className="flex items-center gap-2 relative z-10">
            <div className="w-8 h-8 rounded-[10px] bg-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-black text-white tracking-tight">
              Binge<span className="text-[#8B5CF6]">Karo</span>
            </span>
          </div>

          <div className="space-y-3 relative z-10">
            <h2 className="text-2xl font-black text-white tracking-[-0.03em] leading-tight">
              Find Your Next Obsession.
            </h2>
            <p className="text-[12.5px] text-muted-foreground leading-relaxed">
              Your AI-powered companion for discovering movies and shows you'll actually love.
            </p>
          </div>

          <div className="space-y-3 relative z-10">
            {[
              'Sync watchlists across all devices',
              'Curated AI recommendations instantly',
              'Set language & OTT provider preferences',
            ].map((f, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#8B5CF6] shrink-0" />
                <span className="text-[11.5px] text-white/75 font-semibold">{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT — Clerk SignUp Form */}
        <div className="flex-1 flex flex-col justify-center items-center p-8 bg-[#050505]">
          <SignUp
            appearance={{
              elements: {
                rootBox: "w-full max-w-[360px]",
                cardBox: "bg-transparent border-0 shadow-none p-0 w-full",
                card: "bg-transparent border-0 shadow-none p-0 w-full",
                headerTitle: "text-white text-xl font-bold tracking-tight",
                headerSubtitle: "text-muted-foreground text-[12.5px]",
                socialButtonsBlockButton: "h-10 rounded-[12px] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/15 text-[12px] font-bold text-white transition-all",
                socialButtonsBlockButtonText: "text-white font-bold",
                formButtonPrimary: "w-full h-11 rounded-[14px] text-[13.5px] font-bold text-white bg-[#8B5CF6] hover:bg-[#8B5CF6]/90 shadow-[0_4px_20px_rgba(139,92,246,0.25)] border-0 transition-all",
                formFieldLabel: "text-[11px] font-bold text-muted-foreground uppercase tracking-wider",
                formFieldInput: "w-full h-11 px-3.5 rounded-[12px] bg-white/[0.03] border border-white/[0.08] text-[13.5px] text-white placeholder-white/20 focus:outline-none focus:border-[#8B5CF6]/50 focus:bg-white/[0.05] focus:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all",
                footerActionText: "text-[12px] text-muted-foreground",
                footerActionLink: "text-[#8B5CF6] hover:text-white font-bold transition-colors",
                identityPreviewText: "text-white",
                identityPreviewEditButtonIcon: "text-[#8B5CF6]",
                dividerLine: "bg-white/[0.06]",
                dividerText: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider bg-[#050505] px-3",
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}
