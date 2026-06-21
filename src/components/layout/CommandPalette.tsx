"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Compass, Bookmark, User, Film, Sparkles, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../lib/api";

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  // Command Palette Open/Close via Hotkeys (Ctrl+K or CMD+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
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

  // Event listener to open command palette from nav clicks
  useEffect(() => {
    const handleTrigger = (e: Event) => {
      setIsOpen(true);
    };
    window.addEventListener("open-command-palette", handleTrigger);
    return () => window.removeEventListener("open-command-palette", handleTrigger);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
      setSearchQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Debounced search hitting API
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.search(searchQuery);
        if (response && Array.isArray(response.results)) {
          const mapped = response.results.slice(0, 5).map((item: any) => ({
            id: `movie-${item.id}`,
            label: `${item.title || item.name} (${item.release_date ? new Date(item.release_date).getFullYear() : 'N/A'})`,
            icon: Film,
            action: () => router.push(`/movie/${item.id}?type=${item.media_type || 'movie'}`),
          }));
          setResults(mapped);
        }
      } catch (err) {
        console.error("Command palette search failed", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery, router]);

  const coreCommands = [
    { id: "home", label: "Navigate to Home Page", icon: HomeIcon, action: () => router.push("/") },
    { id: "discover", label: "Discover Entertainment Matcher", icon: Compass, action: () => router.push("/discover") },
    { id: "watchlist", label: "Open Watchlist", icon: Bookmark, action: () => router.push("/watchlist") },
    { id: "profile", label: "Taste profile & DNA statistics", icon: User, action: () => router.push("/profile") },
  ];

  const allItems = [...coreCommands, ...results];

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
            className="w-full max-w-lg bg-background border border-border rounded-2xl shadow-[0_32px_64px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Search Input */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border relative">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search titles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-foreground placeholder-muted-foreground/60 text-[13.5px] outline-none font-semibold"
              />
              {loading && <Loader2 className="w-4 h-4 animate-spin text-accent shrink-0" />}
              <button
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-muted/10 text-muted-foreground hover:text-foreground transition-colors"
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
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all text-[12.5px] font-bold border ${
                        active
                          ? "bg-accent/10 border-accent/25 text-foreground"
                          : "bg-transparent text-muted-foreground hover:text-foreground border-transparent"
                      }`}
                    >
                      <item.icon className={`w-4 h-4 shrink-0 ${active ? "text-accent" : "text-muted-foreground/60"}`} />
                      <span className="flex-1 font-bold">{item.label}</span>
                      {active && (
                        <span className="text-[10px] text-accent font-mono bg-accent/10 px-1.5 py-0.5 rounded uppercase tracking-wider">
                          ENTER
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-muted-foreground/50 text-xs font-semibold">No results matching your query.</div>
              )}
            </div>

            {/* Footer tips */}
            <div className="px-4 py-2 border-t border-border bg-muted/5 flex items-center justify-between text-[10px] text-muted-foreground/50 font-mono">
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

const HomeIcon = (props: any) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);
