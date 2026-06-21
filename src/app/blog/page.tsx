"use client";

import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ArrowRight, Compass, Sparkles, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['All Articles', 'OTT Guides', 'AI Discoveries', 'Director Spotlight', 'Cinephile Culture'];

const ARTICLES = [
  {
    id: 1,
    title: 'The Rise of Cerebral Science Fiction: Dune & Speculative Futures',
    excerpt: 'Villeneuve’s Dune translation is more than a blockbuster. We audit the cinematic cues, soundscapes, and political subtext shaping speculative science fiction.',
    category: 'Cinephile Culture',
    author: 'Aarav Mehta',
    date: 'June 18, 2026',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
    featured: true,
  },
  {
    id: 2,
    title: 'OTT Availability Matrix: How Streaming Rights Fragment Our Watchlists',
    excerpt: 'An inside look at streaming licenses, regional locks, and how BingeKaro helps subscribers avoid the search loop.',
    category: 'OTT Guides',
    author: 'Priya Sharma',
    date: 'June 15, 2026',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 3,
    title: 'Groq API & LLMs: Transforming Mood Parameters Into Movie DNA Metrics',
    excerpt: 'How BingeKaro is utilizing fast inference models to scan audience sentiment parameters rather than standard static genre strings.',
    category: 'AI Discoveries',
    author: 'Vikram Nyxen',
    date: 'June 10, 2026',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60',
  },
  {
    id: 4,
    title: 'The Nolan Paradox: Tension, Time Dilations, and Audio Mixes',
    excerpt: 'We trace Christopher Nolan’s trajectory from Memento to Oppenheimer, examining how sound mixes manipulate audience stress.',
    category: 'Director Spotlight',
    author: 'Karan Malhotra',
    date: 'June 05, 2026',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500&auto=format&fit=crop&q=60',
  }
];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Articles');

  const filteredArticles = selectedCategory === 'All Articles'
    ? ARTICLES
    : ARTICLES.filter(a => a.category === selectedCategory);

  const featured = ARTICLES.find(a => a.featured);
  const regularArticles = filteredArticles.filter(a => !a.featured || selectedCategory !== 'All Articles');

  return (
    <div className="min-h-screen bg-background pt-24 pb-28">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 space-y-12">
        
        {/* Header */}
        <div className="pb-6 border-b border-border/60">
          <h1 className="text-3xl font-black text-foreground tracking-tight flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-accent" /> BingeKaro Editorial
          </h1>
          <p className="text-xs text-muted-foreground font-semibold mt-1">Cinematic reviews, OTT news, and artificial intelligence discoveries.</p>
        </div>

        {/* Category Toggles */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4.5 py-2 rounded-full text-xs font-bold border transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-accent border-accent text-white shadow-sm'
                  : 'bg-muted/5 border-border/40 text-muted-foreground hover:text-foreground'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Spotlight Article (Only shown for 'All Articles') */}
        {selectedCategory === 'All Articles' && featured && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-card border border-border p-6 rounded-[28px] hover:border-accent/40 transition-colors"
          >
            <div className="aspect-video w-full rounded-2xl overflow-hidden border border-border bg-muted/10">
              <img src={featured.image} alt={featured.title} className="w-full h-full object-cover hover:scale-102 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-between py-2 space-y-4">
              <div className="space-y-3">
                <span className="px-3 py-1 rounded-md bg-accent/15 border border-accent/25 text-[10px] font-black text-accent uppercase tracking-wider">
                  {featured.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-foreground leading-tight">
                  {featured.title}
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed font-semibold">
                  {featured.excerpt}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border/40">
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground/60 font-semibold">
                  <span>By {featured.author}</span>
                  <span>•</span>
                  <span>{featured.readTime}</span>
                </div>
                <button className="text-xs font-black text-accent hover:text-accent-light flex items-center gap-1">
                  Read Article <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((art, idx) => (
            <motion.article
              key={art.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.08, duration: 0.5 }}
              className="p-5 bg-card/40 border border-border hover:border-accent/40 rounded-2xl flex flex-col justify-between hover:shadow-lg transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-muted/10">
                  <img src={art.image} alt={art.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-extrabold uppercase tracking-widest text-accent block">{art.category}</span>
                  <h3 className="text-sm font-bold text-foreground line-clamp-2 leading-snug">{art.title}</h3>
                  <p className="text-[11.5px] text-muted-foreground line-clamp-3 leading-relaxed font-semibold">{art.excerpt}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-6 border-t border-border/20">
                <span className="text-[9.5px] text-muted-foreground/60 font-semibold">{art.readTime}</span>
                <button className="text-[10px] font-extrabold text-accent hover:text-accent-light flex items-center gap-1 uppercase tracking-wider">
                  Read <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </div>
  );
}
