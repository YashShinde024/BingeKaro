"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Film, Sparkles, Mail, CheckCircle2, ArrowRight, Zap, Globe, Rocket, Smartphone, MessageSquare, Bug, Lightbulb, Briefcase, Send, Twitter, Github } from 'lucide-react';

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
          <span className="text-[10px] font-black text-accent uppercase tracking-wider">Our Story</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black text-foreground mb-4 leading-none tracking-tight">
          We built the tool we always wanted.
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-semibold max-w-xl">
          BingeKaro was born from a universal frustration: spending more time searching for something to watch than actually watching it. We believe discovery should be instant, intelligent, and delightful.
        </p>
      </FadeIn>

      {/* Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-12">
        {[
          { label: 'Mission', icon: Zap, text: 'Eliminate discovery fatigue forever. We combine user taste profiles, real-time OTT availability data, and smart inference to surface your perfect pick in seconds — not hours.' },
          { label: 'Vision', icon: Globe, text: 'Become the default starting point for entertainment discovery across India and beyond — purpose-built for the modern multi-subscription landscape.' }
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
          <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1.5">Our Philosophy</p>
          <p className="text-foreground text-sm sm:text-base font-bold leading-relaxed">
            &ldquo;Discovery fatigue is a product design failure, not a content problem. With BingeKaro, we treat entertainment selection as an intelligent matching experience — mapping your cinematic DNA to surface titles you&apos;ll actually love.&rdquo;
          </p>
        </div>
      </FadeIn>

      {/* Roadmap Timeline */}
      <FadeIn delay={0.25} className="mb-12">
        <h2 className="text-xl font-black text-foreground mb-6 tracking-tight">Product Roadmap</h2>
        <div className="space-y-2">
          {[
            { phase: 'Phase 1', label: 'FastAPI backend + OTT aggregator integration', status: 'Live', done: true, icon: CheckCircle2 },
            { phase: 'Phase 2', label: 'Interactive Taste DNA radar & personalized recommendations', status: 'Live', done: true, icon: Sparkles },
            { phase: 'Phase 3', label: 'Co-watchlists, social activity feeds & friend sharing', status: 'Q3 2026', done: false, icon: Rocket },
            { phase: 'Phase 4', label: 'Native Android & iOS companion applications', status: 'Q4 2026', done: false, icon: Smartphone }
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
            <Sparkles className="w-3.5 h-3.5" /> A Nyxen Product
          </span>
          <p className="text-muted-foreground text-xs leading-relaxed max-w-sm mx-auto font-semibold">
            BingeKaro is crafted by Nyxen — building high-performance, design-forward software for modern consumers.
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
type ContactCategory = 'feedback' | 'bug' | 'business';

export const Contact: React.FC = () => {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [category, setCategory] = useState<ContactCategory>('feedback');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && msg && name) {
      setSent(true);
      setName("");
      setEmail("");
      setMsg("");
    }
  };

  const categories: { id: ContactCategory; label: string; icon: React.ComponentType<any> }[] = [
    { id: 'feedback', label: 'Feedback', icon: Lightbulb },
    { id: 'bug', label: 'Bug Report', icon: Bug },
    { id: 'business', label: 'Business', icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-24 relative overflow-hidden">
      <div className="max-w-[1000px] mx-auto px-6">
        
        <FadeIn className="mb-10 text-center space-y-2 max-w-lg mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/25 bg-accent/15">
            <MessageSquare className="w-3.5 h-3.5 text-accent" />
            <span className="text-[10px] font-black text-accent uppercase tracking-wider">Get in Touch</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight">We&apos;d Love to Hear From You</h1>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
            Feature requests, bug reports, partnership inquiries, or just want to say hi — we read every message.
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
                    <h4 className="text-sm font-bold text-foreground">Message Sent Successfully!</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">We typically respond within 24–48 hours.</p>
                  </div>
                  <button onClick={() => setSent(false)} className="text-xs font-bold text-accent hover:text-accent-light transition-colors">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Category Tabs */}
                  <div className="flex gap-1 bg-muted/10 p-1 rounded-xl border border-border/30">
                    {categories.map(cat => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex-1 py-2 rounded-lg text-[10.5px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                          category === cat.id
                            ? 'bg-accent text-white shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <cat.icon className="w-3 h-3" />
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="contact-name" className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-muted/5 border border-border/80 rounded-xl px-4.5 py-3 text-xs text-foreground outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-email" className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="yourname@domain.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-muted/5 border border-border/80 rounded-xl px-4.5 py-3 text-xs text-foreground outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="contact-message" className="text-[10.5px] font-bold text-muted-foreground uppercase tracking-wider block">Message</label>
                    <textarea
                      id="contact-message"
                      required
                      rows={4}
                      placeholder={
                        category === 'bug' 
                          ? 'Describe the issue, steps to reproduce, and your browser/device...'
                          : category === 'business'
                          ? 'Tell us about your organization and partnership interest...'
                          : 'Share your feedback, ideas, or feature requests...'
                      }
                      value={msg}
                      onChange={(e) => setMsg(e.target.value)}
                      className="w-full bg-muted/5 border border-border/80 rounded-xl px-4.5 py-3 text-xs text-foreground outline-none focus:border-accent transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-accent hover:bg-accent-dark text-white font-bold text-xs rounded-xl transition-all shadow-[0_4px_15px_rgba(249,115,22,0.2)] flex items-center justify-center gap-2"
                  >
                    <Send className="w-3.5 h-3.5" /> Submit Message
                  </button>
                </form>
              )}
            </AnimatePresence>
          </div>

          {/* FAQ + Social Links */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Frequently Asked Questions</h3>
              <div className="space-y-3.5">
                {[
                  { q: 'Is BingeKaro free to use?', a: 'Yes. Searching titles, maintaining watchlists, and checking OTT availability across platforms is completely free — no subscription required.' },
                  { q: 'Where does the content data come from?', a: 'All movie and TV metadata is sourced from The Movie Database (TMDB) via our FastAPI backend, ensuring accurate and up-to-date information.' },
                  { q: 'How can I request a new feature?', a: 'Use the feedback form on this page or reach out directly via email. Our team reviews every submission and prioritizes based on community impact.' },
                  { q: 'Do you support regional OTT platforms?', a: 'Yes. We aggregate availability data across major Indian and global streaming platforms including JioCinema, Hotstar, Netflix, Prime Video, and more.' },
                ].map((faq, idx) => (
                  <div key={idx} className="p-4 bg-muted/5 border border-border/60 rounded-xl space-y-1">
                    <h4 className="text-xs font-bold text-foreground">{faq.q}</h4>
                    <p className="text-[11.5px] text-muted-foreground font-semibold leading-relaxed">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="p-4 bg-card/40 border border-border rounded-2xl space-y-3">
              <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="mailto:hello@nyxen.dev" className="flex items-center gap-2 px-3.5 py-2 bg-muted/5 border border-border rounded-xl text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all">
                  <Mail className="w-3.5 h-3.5 text-accent" /> hello@nyxen.dev
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

/* ─── Legal ─── */
const LegalPage: React.FC<{ title: string; lastUpdated: string; sections: { h: string; c: string }[] }> = ({ title, lastUpdated, sections }) => (
  <div className="min-h-screen bg-background pt-24 pb-24">
    <div className="max-w-2xl mx-auto px-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-3xl font-black text-foreground mb-1 tracking-tight">{title}</h1>
        <p className="text-[10px] text-muted-foreground/60 font-semibold mb-8">LAST UPDATED: {lastUpdated}</p>
        
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
    title="Privacy Policy"
    lastUpdated="JUNE 2026"
    sections={[
      { h: "Information We Collect", c: "When you create a BingeKaro account, we collect your name, email address, and profile image via Clerk authentication. We also store your taste preferences (favorite genres, languages, and streaming platforms), watchlist data, and viewing history to power personalized recommendations." },
      { h: "How We Use Your Data", c: "Your data is used exclusively to provide and improve the BingeKaro experience. This includes generating personalized recommendations, computing your Taste DNA profile, syncing preferences across devices, and delivering relevant notification alerts. We do not sell, rent, or trade your personal information to third parties." },
      { h: "Cookies & Session Management", c: "We use essential cookies managed by Clerk for session authentication and persistence. No third-party advertising or tracking cookies are deployed on BingeKaro. Local storage is used to cache UI preferences such as theme selection and playback quality settings." },
      { h: "Third-Party Services", c: "BingeKaro integrates with The Movie Database (TMDB) for content metadata and Clerk for secure authentication. These services have their own privacy policies governing how they handle data. We recommend reviewing their respective policies for complete transparency." },
      { h: "Data Retention & Deletion", c: "Your account data is retained for as long as your account is active. You may request deletion of your account and all associated data at any time by contacting us at hello@nyxen.dev. Upon deletion, your data will be permanently removed from our systems within 30 days." },
      { h: "Data Security", c: "We implement industry-standard security measures including encrypted data transmission (TLS/SSL), secure token-based authentication, and regular security audits. While no system is completely immune to threats, we are committed to protecting your data with the highest standards." },
      { h: "Changes to This Policy", c: "We may update this privacy policy periodically to reflect changes in our practices or legal requirements. Significant changes will be communicated via email or in-app notification. Continued use of BingeKaro after changes constitutes acceptance of the updated policy." },
      { h: "Contact", c: "For privacy-related inquiries, data access requests, or concerns about how your information is handled, please contact our team at hello@nyxen.dev. We aim to respond to all inquiries within 5 business days." }
    ]}
  />
);

export const Terms: React.FC = () => (
  <LegalPage
    title="Terms of Service"
    lastUpdated="JUNE 2026"
    sections={[
      { h: "Acceptance of Terms", c: "By accessing or using BingeKaro (the \"Service\"), you agree to be bound by these Terms of Service. If you do not agree to these terms, you must not access or use the Service. BingeKaro is operated by Nyxen (\"we\", \"us\", \"our\")." },
      { h: "Description of Service", c: "BingeKaro is a movie and TV show discovery platform that helps users find content across streaming services. We provide search functionality, personalized recommendations, watchlist management, and OTT availability information. We do not host, stream, or distribute any video content directly." },
      { h: "User Accounts", c: "To access certain features, you must create an account via Clerk authentication. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate and complete information during registration." },
      { h: "Acceptable Use", c: "You agree not to: (a) use automated systems, bots, or scrapers to access the Service without prior written consent; (b) attempt to reverse-engineer, decompile, or extract source code from the Service; (c) use the Service for any unlawful purpose or in violation of any applicable laws; (d) interfere with or disrupt the integrity or performance of the Service." },
      { h: "Intellectual Property", c: "All BingeKaro branding, design assets, UI components, curation algorithms, and original content are the exclusive property of Nyxen and are protected by applicable intellectual property laws. Movie metadata and poster images are sourced from TMDB under their API terms of use." },
      { h: "Content & Accuracy", c: "While we strive to provide accurate and up-to-date information, BingeKaro does not guarantee the completeness, accuracy, or availability of content metadata, streaming availability, or pricing information. OTT availability may vary by region and is subject to change without notice." },
      { h: "Limitation of Liability", c: "BingeKaro is provided on an \"as-is\" and \"as-available\" basis without warranties of any kind. To the maximum extent permitted by law, Nyxen shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service." },
      { h: "Modifications", c: "We reserve the right to modify, suspend, or discontinue any part of the Service at any time without prior notice. We may also update these Terms periodically. Continued use of the Service after modifications constitutes acceptance of the revised terms." },
      { h: "Governing Law", c: "These Terms shall be governed by and construed in accordance with the laws of India, without regard to conflict of law provisions. Any disputes arising from these Terms shall be resolved in the courts of competent jurisdiction." },
      { h: "Contact", c: "If you have questions about these Terms of Service, please contact us at hello@nyxen.dev." }
    ]}
  />
);
