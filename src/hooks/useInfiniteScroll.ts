import { useRef, useEffect, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Callback to load more items */
  onLoadMore: () => void;
  /** Root margin for intersection observer (default: '200px') */
  rootMargin?: string;
  /** Threshold for intersection observer (default: 0) */
  threshold?: number;
}

/**
 * Infinite scroll hook using Intersection Observer.
 * Returns a ref to attach to a sentinel element at the bottom of the list.
 */
export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  rootMargin = '400px',
  threshold = 0,
}: UseInfiniteScrollOptions) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    // Disconnect previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin,
      threshold,
    });

    // Observe sentinel element
    const sentinel = sentinelRef.current;
    if (sentinel) {
      observerRef.current.observe(sentinel);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersect, rootMargin, threshold]);

  return { sentinelRef };
}

/**
 * Hook for horizontal scroll rail infinite loading.
 * Detects when user scrolls near the end of a horizontal container.
 */
export function useHorizontalInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (isLoading || !hasMore) return;
      const { scrollLeft, scrollWidth, clientWidth } = container;
      // Load more when within 300px of the end
      if (scrollLeft + clientWidth >= scrollWidth - 300) {
        onLoadMore();
      }
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMore, isLoading, onLoadMore]);

  return { containerRef };
}
