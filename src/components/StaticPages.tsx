"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Film, Sparkles, MapPin, Mail, CheckCircle2, ArrowRight, Zap, Globe, Rocket, Smartphone, MessageSquare } from 'lucide-react';

const FadeIn: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children, delay = 0, className = ''
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, ease: 'easeOut', delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ─── About ─── */
export const About: React.FC = () => (
  <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[110px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-accent-dark/5 rounded-full blur-[90px]" />
    </div>

    <div className="relative max-w-3xl mx-auto px-6">
      
      {/* Hero */}
      <FadeIn className="mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/25 bg-accent/15 mb-4">
          <Film className="w-3.5 h-3.5 text-accent" />
          <span className="text-[10px] font-black text-accent uppercase tracking-wider">Our Narrative Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-none tracking-tight">
          We built the tool we always wanted.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
          BingeKaro started from a simple frustration — spending 45 minutes looking for something to watch, only to give up. We knew there had to be a more intelligent way.
        </p>
      </FadeIn>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {[
          { label: 'Mission', icon: Zap, text: 'End discovery fatigue forever. We combine user taste profiles, dynamic OTT licenses, and fast inference to find your pick instantly.' },
          { label: 'Vision', icon: Globe, text: 'Establish the default starting point for digital cinema across India, built for the modern subscription landscape.' }
        ].map((item, i) => (
          <FadeIn key={item.label} delay={0.1 + i * 0.08}>
            <div className="bg-card/40 border border-border p-6 rounded-2xl h-full hover:border-accent/30 transition-colors duration-300">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-accent/10 border border-accent/20 rounded-lg flex items-center justify-center text-accent">
                  <item.icon className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-black text-foreground uppercase tracking-widest">{item.label}</p>
              </div>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-semibold">{item.text}</p>
            </div>
          </FadeIn>
        ))}
      </div>

      {/* Story Pillar */}
      <FadeIn delay={0.2} className="mb-12">
        <div className="rounded-2xl p-6 border border-accent/20 bg-accent/[0.02] relative overflow-hidden">
          <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1.5">Cinephile Lock</p>
          <p className="text-foreground text-sm sm:text-base font-bold leading-relaxed">
            "Discovery fatigue is a product design flaw. With BingeKaro, we treat entertainment selection as an interactive matching journey, mapping cinematic DNA rather than static keyword filters."
          </p>
        </div>
      </FadeIn>

      {/* Roadmap Timeline */}
      <FadeIn delay={0.25} className="mb-12">
        <h2 className="text-xl font-black text-foreground mb-6 tracking-tight">Curation Roadmap</h2>
        <div className="space-y-2">
          {[
            { phase: 'Phase 1', label: 'FastAPI + OTT Aggregator integration', status: 'Live', done: true, icon: CheckCircle2 },
            { phase: 'Phase 2', label: 'Interactive Movie DNA Radar Cues', status: 'Live', done: true, icon: Sparkles },
            { phase: 'Phase 3', label: 'Co-watchlist sharing & Social activity log', status: 'Q3 2026', done: false, icon: Rocket },
            { phase: 'Phase 4', label: 'Native Android & iOS applications', status: 'Q4 2026', done: false, icon: Smartphone }
          ].map((item, i) => (
            <div
              key={item.phase}
              className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                item.done 
                  ? 'bg-accent/10 border-accent/25' 
                  : 'bg-card/20 border-border/40 hover:border-border'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                item.done ? 'bg-accent/25' : 'bg-muted/5 border border-border'
              }`}>
                <item.icon className={`w-4 h-4 ${item.done ? 'text-accent' : 'text-muted-foreground/60'}`} />
              </div>
              <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-foreground leading-snug">{item.label}</h4>
                  <p className="text-[9.5px] text-muted-foreground/60 mt-0.5">{item.phase}</p>
                </div>
                <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  item.done ? 'bg-accent/20 text-accent border border-accent/20' : 'bg-muted/10 text-muted-foreground'
                }`}>
                  {item.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* Nyxen Block */}
      <FadeIn delay={0.35}>
        <div className="p-6 bg-card border border-border rounded-2xl text-center space-y-2 mb-8">
          <span className="text-[9.5px] font-extrabold uppercase tracking-widest text-accent flex items-center justify-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Built by Nyxen Ecosystem
          </span>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto font-semibold">
            BingeKaro is part of the Nyxen collective, crafting high-performance, design-forward software.
          </p>
        </div>
      </FadeIn>

      <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-muted-foreground">
        <Link href="/contact" className="hover:text-foreground transition-colors flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-accent" /> Contact</Link>
        <span>·</span>
        <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
        <span>·</span>
        <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
      </div>

    </div>
  </div>
);

/* ─── Contact ─── */
export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && msg) {
      setSent(true);
      setEmail("");
      setMsg("");
    }
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <FadeIn className="mb-10 text-center space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/25 bg-accent/15">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] font-black text-accent uppercase tracking-wider">Help desk Support</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">Get in Touch</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
            Feedback, suggestions, or API licensing inquiries — we read everything.
          </p>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Form */}
          <div className="bg-card border border-border p-6 rounded-2xl">
            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-8 space-y-4"
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center mx-auto text-accent">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Message Dispatched!</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">We will respond within 24 hours.</p>
                  </div>
                  <button onClick={() => setSent(false)} className="text-xs font-bold text-accent hover:text-accent-light">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted/5 border border-border/80 rounded-xl px-4.5 py-3 text-xs text-foreground outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">Description Message</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your feedback details..."
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      className="w-full bg-muted/5 border border-border/80 rounded-xl px-4.5 py-3 text-xs text-foreground outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-accent hover:bg-accent/90 text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_15px_rgba(249,115,22,0.2)]"
                  >
                    Submit Form
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* FAQ list */}
          <div className="space-y-4">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Frequently Asked FAQs</h3>
            <div className="space-y-3.5">
              {[
                { q: 'Is BingeKaro free to search?', a: 'Yes, searching titles, watchlists, and checking OTT availability is completely free.' },
                { q: 'Where does the metadata come from?', a: 'All records are securely resolved through the TMDB database api via our backend.' },
                { q: 'How do I suggest features?', a: 'Send us details directly via this feedback box, and our core devs will audit it.' }
              ].map((faq, idx) => (
                <div key={idx} className="p-4 bg-muted/5 border border-border/60 rounded-xl space-y-1">
                  <h4 className="text-xs font-bold text-foreground">{faq.q}</h4>
                  <p className="text-[11.5px] text-muted-foreground font-semibold leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── Legal ─── */
const LegalPage: React.FC<{ title: string; sections: { h: string; c: string }[] }> = ({ title, sections }) => (
  <div className="min-h-screen bg-background pt-24 pb-24">
    <div className="max-w-2xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-black text-foreground mb-1 tracking-tight">{title}</h1>
        <p className="text-[10px] text-muted-foreground/60 font-semibold mb-8">LAST MODIFIED: JUNE 2026</p>
        
        <div className="space-y-8">
          {sections.map((sec, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                <span className="w-5 h-5 rounded bg-accent/20 text-[10px] font-black text-accent flex items-center justify-center shrink-0">{idx + 1}</span>
                {sec.h}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed font-semibold pl-7">{sec.c}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

export const Privacy: React.FC = () => (
  <LegalPage
    title="Privacy Guidelines"
    sections={[
      { h: "Profile Logs", c: "We securely aggregate user onboarding, favorite platform selections, and watchlist collections. None of this metadata is traded." },
      { h: "Cookies", c: "Session tokens are managed by Clerk and stored locally for session continuity." }
    ]}
  />
);

export const Terms: React.FC = () => (
  <LegalPage
    title="Terms of Service"
    sections={[
      { h: "Fair Usage", c: "Scanners and crawlers trying to hammer discover queries or scraping backend aggregator services are restricted." },
      { h: "License", c: "Curation assets, timeline assets, and the BingeKaro branding belong exclusively to Nyxen." }
    ]}
  />
);
