"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, Bookmark, User, Film, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MOVIES } from "../../lib/mockData";

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearch("");
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const coreCommands = [
    { id: "home", label: "Navigate to Home", icon: Film, action: () => router.push("/") },
    { id: "discover", label: "Discover by Mood", icon: Compass, action: () => router.push("/discover") },
    { id: "watchlist", label: "My Watchlist", icon: Bookmark, action: () => router.push("/watchlist") },
    { id: "profile", label: "User Profile & DNA", icon: User, action: () => router.push("/profile") },
  ];

  const matchedMovies = search.trim()
    ? MOVIES.filter(m => m.title.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 4)
        .map(movie => ({
          id: `movie-${movie.id}`,
          label: `Watch ${movie.title} (${movie.year})`,
          icon: Sparkles,
          action: () => router.push(`/movie/${movie.id}`),
        }))
    : [];

  const allItems = [...coreCommands, ...matchedMovies];

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (allItems.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % allItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % allItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      allItems[selectedIndex]?.action();
      setIsOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-md flex items-start justify-center p-4 sm:p-10 pt-20 sm:pt-32"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.95, y: -20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-[#0C0E17] border border-white/[0.08] rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06] relative">
              <Search className="w-4 h-4 text-muted shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search movies..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-white placeholder-muted/50 text-[13.5px] outline-none font-medium"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white/5 text-muted hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* List */}
            <div className="p-2 max-h-[300px] overflow-y-auto">
              {allItems.length > 0 ? (
                allItems.map((item, i) => {
                  const active = i === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        item.action();
                        setIsOpen(false);
                      }}
                      onMouseEnter={() => setSelectedIndex(i)}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-[12.5px] font-bold ${
                        active
                          ? "bg-accent/15 text-white border border-accent/20"
                          : "bg-transparent text-muted hover:text-white border border-transparent"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-accent-light" : "text-muted/60"}`} />
                      <span className="flex-1 font-bold">{item.label}</span>
                      {active && (
                        <span className="text-[10px] text-accent-light font-mono bg-accent/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          ENTER
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted/55 text-xs">No matching commands or movies.</div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2 border-t border-white/[0.04] bg-[#050505] flex items-center justify-between text-[10px] text-muted/40 font-mono">
              <div className="flex items-center gap-2">
                <span>↑↓ navigate</span>
                <span>•</span>
                <span>enter select</span>
              </div>
              <span>esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
