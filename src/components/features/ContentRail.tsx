"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { MovieCard } from '../cards/MovieCard';
import { MovieCardSkeleton } from '../ui/Skeletons';
import type { NormalizedContent } from '../../lib/tmdb-types';

interface ContentRailProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  viewAllTo?: string;
  items: NormalizedContent[];
  loading: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
}

export const ContentRail: React.FC<ContentRailProps> = React.memo(({
  title, subtitle, badge, viewAllTo, items, loading, hasMore, onLoadMore,
}) => {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = React.useState(false);
  const [showRightArrow, setShowRightArrow] = React.useState(true);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 30);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 30);
    if (hasMore && onLoadMore && el.scrollLeft + el.clientWidth >= el.scrollWidth - 400) {
      onLoadMore();
    }
  }, [hasMore, onLoadMore]);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, items.length]);

  const scrollBy = React.useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = 206;
    el.scrollBy({ left: direction === 'left' ? -cardWidth * 3 : cardWidth * 3, behavior: 'smooth' });
  }, []);

  if (!loading && items.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="mb-12 relative group/rail"
    >
      {/* Rail Header */}
      <div className="flex items-end justify-between mb-5 px-6 lg:px-10">
        <div className="flex items-center gap-3">
          {badge && (
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent/10 border border-accent/20">
              {badge}
            </div>
          )}
          <div>
            <h2 className="text-[17px] font-bold text-foreground tracking-tight">{title}</h2>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
          </div>
        </div>
        {viewAllTo && (
          <Link href={viewAllTo} className="flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-dark transition-colors group">
            See all
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        )}
      </div>

      {/* Scroll Container */}
      <div className="relative">
        {showLeftArrow && (
          <button
            onClick={() => scrollBy('left')}
            aria-label="Scroll left"
            className="absolute left-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-background hover:border-accent/30 shadow-lg"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {showRightArrow && items.length > 4 && (
          <button
            onClick={() => scrollBy('right')}
            aria-label="Scroll right"
            className="absolute right-1 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-background/90 backdrop-blur-md border border-border flex items-center justify-center text-foreground opacity-0 group-hover/rail:opacity-100 transition-opacity hover:bg-background hover:border-accent/30 shadow-lg"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        <div
          ref={scrollRef}
          className="flex gap-4 content-rail px-6 lg:px-10 pb-4"
        >
          {loading && items.length === 0
            ? [...Array(8)].map((_, i) => <MovieCardSkeleton key={i} />)
            : items.map((item, i) => (
                <MovieCard key={`${item.id}-${item.mediaType}`} content={item} index={i} />
              ))
          }
          {loading && items.length > 0 && (
            <>
              <MovieCardSkeleton />
              <MovieCardSkeleton />
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
});

ContentRail.displayName = 'ContentRail';
