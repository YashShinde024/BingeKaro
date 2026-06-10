'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { NormalizedContent } from '../lib/tmdb-types';
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  fetchTopRatedMovies,
  fetchTopRatedTV,
  fetchNowPlaying,
  fetchUpcoming,
  fetchMoviesByGenre,
  fetchTVByGenre,
  normalizeContent,
  isTMDBAvailable,
} from '../lib/tmdb';

interface UseTMDBResult {
  data: NormalizedContent[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  loadMore: () => void;
  page: number;
}

/**
 * Generic hook for fetching paginated TMDB data.
 * Manages loading, error, pagination, and deduplication.
 */
function useTMDBFetch(
  fetchFn: (page: number) => Promise<{ results: any[]; total_pages: number; page: number }>,
  enabled: boolean = true
): UseTMDBResult {
  const [data, setData] = useState<NormalizedContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const loadingRef = useRef(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Initial fetch
  useEffect(() => {
    if (!enabled || !isTMDBAvailable()) {
      setLoading(false);
      setError(isTMDBAvailable() ? null : 'TMDB API key not configured');
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchFn(1)
      .then((res) => {
        if (cancelled || !mountedRef.current) return;
        const normalized = res.results
          .filter((item: any) => item.media_type !== 'person')
          .map(normalizeContent);
        setData(normalized);
        setTotalPages(res.total_pages);
        setPage(res.page);
        setHasMore(res.page < res.total_pages);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled || !mountedRef.current) return;
        setError(err.message || 'Failed to fetch data');
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fetchFn, enabled]);

  // Load more pages
  const loadMore = useCallback(() => {
    if (loadingRef.current || !hasMore || !isTMDBAvailable()) return;
    loadingRef.current = true;

    const nextPage = page + 1;
    fetchFn(nextPage)
      .then((res) => {
        if (!mountedRef.current) return;
        const normalized = res.results
          .filter((item: any) => item.media_type !== 'person')
          .map(normalizeContent);

        setData((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const newItems = normalized.filter((item: NormalizedContent) => !existingIds.has(item.id));
          return [...prev, ...newItems];
        });
        setPage(res.page);
        setTotalPages(res.total_pages);
        setHasMore(res.page < res.total_pages);
        loadingRef.current = false;
      })
      .catch(() => {
        if (!mountedRef.current) return;
        loadingRef.current = false;
      });
  }, [page, hasMore, fetchFn]);

  return { data, loading, error, hasMore, loadMore, page };
}

// ===========================
// Specific content hooks
// ===========================

export function useTrendingToday() {
  return useTMDBFetch(
    useCallback((page: number) => fetchTrending('day', page), [])
  );
}

export function useTrendingWeek() {
  return useTMDBFetch(
    useCallback((page: number) => fetchTrending('week', page), [])
  );
}

export function usePopularMovies() {
  return useTMDBFetch(
    useCallback((page: number) => fetchPopularMovies(page), [])
  );
}

export function usePopularTV() {
  return useTMDBFetch(
    useCallback((page: number) => fetchPopularTV(page), [])
  );
}

export function useTopRatedMovies() {
  return useTMDBFetch(
    useCallback((page: number) => fetchTopRatedMovies(page), [])
  );
}

export function useTopRatedTV() {
  return useTMDBFetch(
    useCallback((page: number) => fetchTopRatedTV(page), [])
  );
}

export function useNowPlaying() {
  return useTMDBFetch(
    useCallback((page: number) => fetchNowPlaying(page), [])
  );
}

export function useUpcoming() {
  return useTMDBFetch(
    useCallback((page: number) => fetchUpcoming(page), [])
  );
}

export function useGenreMovies(genreId: number) {
  return useTMDBFetch(
    useCallback((page: number) => fetchMoviesByGenre(genreId, page), [genreId])
  );
}

export function useGenreTV(genreId: number) {
  return useTMDBFetch(
    useCallback((page: number) => fetchTVByGenre(genreId, page), [genreId])
  );
}
