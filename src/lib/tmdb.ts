import type {
  TMDBPagedResponse,
  TMDBMovie,
  TMDBMovieDetails,
  TMDBTVDetails,
  TMDBMultiSearchResult,
  NormalizedContent,
  NormalizedPerson,
} from './tmdb-types';

// ===========================
// Configuration
// ===========================
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';

// ===========================
// Image URL Helpers
// ===========================
export type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export function getImageUrl(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
  if (!path) return null;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getPosterUrl(path: string | null | undefined, size: ImageSize = 'w342'): string | null {
  return getImageUrl(path, size);
}

export function getBackdropUrl(path: string | null | undefined, size: ImageSize = 'w1280'): string | null {
  return getImageUrl(path, size);
}

export function getProfileUrl(path: string | null | undefined, size: ImageSize = 'w185'): string | null {
  return getImageUrl(path, size);
}

// ===========================
// Request Helper
// ===========================
const requestCache = new Map<string, { data: unknown; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minute cache
const inflightRequests = new Map<string, Promise<unknown>>();

async function tmdbFetch<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured. Set NEXT_PUBLIC_TMDB_API_KEY in your environment.');
  }

  const searchParams = new URLSearchParams({
    api_key: API_KEY,
    ...params,
  });
  const url = `${TMDB_BASE_URL}${endpoint}?${searchParams.toString()}`;

  // Check cache
  const cached = requestCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T;
  }

  // Deduplicate in-flight requests
  if (inflightRequests.has(url)) {
    return inflightRequests.get(url) as Promise<T>;
  }

  const fetchPromise = fetch(url)
    .then(async (res) => {
      if (!res.ok) {
        throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      requestCache.set(url, { data, timestamp: Date.now() });
      inflightRequests.delete(url);
      return data as T;
    })
    .catch((err) => {
      inflightRequests.delete(url);
      throw err;
    });

  inflightRequests.set(url, fetchPromise);
  return fetchPromise;
}

// ===========================
// Check if TMDB is available
// ===========================
export function isTMDBAvailable(): boolean {
  return !!API_KEY;
}

// ===========================
// Trending
// ===========================
export async function fetchTrending(
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>(`/trending/all/${timeWindow}`, {
    page: String(page),
  });
}

// ===========================
// Movies
// ===========================
export async function fetchPopularMovies(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/movie/popular', {
    page: String(page),
    region: 'IN',
  });
}

export async function fetchTopRatedMovies(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/movie/top_rated', {
    page: String(page),
  });
}

export async function fetchNowPlaying(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/movie/now_playing', {
    page: String(page),
    region: 'IN',
  });
}

export async function fetchUpcoming(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/movie/upcoming', {
    page: String(page),
    region: 'IN',
  });
}

// ===========================
// TV Shows
// ===========================
export async function fetchPopularTV(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/tv/popular', {
    page: String(page),
  });
}

export async function fetchTopRatedTV(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/tv/top_rated', {
    page: String(page),
  });
}

// ===========================
// Genre Discovery
// ===========================
export async function fetchMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/movie', {
    page: String(page),
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    'vote_count.gte': '100',
  });
}

export async function fetchTVByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMovie>>('/discover/tv', {
    page: String(page),
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    'vote_count.gte': '50',
  });
}

// ===========================
// Search
// ===========================
export async function multiSearch(
  query: string,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMultiSearchResult>> {
  return tmdbFetch<TMDBPagedResponse<TMDBMultiSearchResult>>('/search/multi', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

// ===========================
// Details
// ===========================
export async function fetchMovieDetails(id: number): Promise<TMDBMovieDetails> {
  return tmdbFetch<TMDBMovieDetails>(`/movie/${id}`, {
    append_to_response: 'credits,similar,videos,watch/providers',
  });
}

export async function fetchTVDetails(id: number): Promise<TMDBTVDetails> {
  return tmdbFetch<TMDBTVDetails>(`/tv/${id}`, {
    append_to_response: 'credits,similar,videos,watch/providers',
  });
}

// ===========================
// Normalization Helpers
// ===========================
export function normalizeContent(item: TMDBMovie): NormalizedContent {
  const isTV = item.media_type === 'tv' || !!item.first_air_date;
  const title = item.title || item.name || 'Untitled';
  const dateStr = item.release_date || item.first_air_date || '';
  const year = dateStr ? new Date(dateStr).getFullYear() : 0;

  return {
    id: item.id,
    title,
    mediaType: isTV ? 'tv' : 'movie',
    posterUrl: getPosterUrl(item.poster_path),
    backdropUrl: getBackdropUrl(item.backdrop_path),
    year: isNaN(year) ? 0 : year,
    rating: Math.round(item.vote_average * 10) / 10,
    voteCount: item.vote_count,
    overview: item.overview || '',
    genreIds: item.genre_ids || [],
    language: item.original_language || 'en',
    popularity: item.popularity || 0,
  };
}

export function normalizePerson(item: TMDBMultiSearchResult): NormalizedPerson {
  return {
    id: item.id,
    name: item.name || 'Unknown',
    profileUrl: getProfileUrl(item.profile_path),
    department: item.known_for_department || 'Acting',
    knownFor: (item.known_for || [])
      .map((m) => m.title || m.name || '')
      .filter(Boolean)
      .slice(0, 3),
  };
}

// ===========================
// Fallback poster/backdrop
// ===========================
export const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&q=80';
export const FALLBACK_BACKDROP = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&q=90';
export const FALLBACK_PROFILE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80';
