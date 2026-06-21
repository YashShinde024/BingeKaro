import { api } from './api';
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
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

// ===========================
// Image URL Helpers
// ===========================
export type ImageSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'w1280' | 'original';

export function getImageUrl(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
  if (!path) return null;
  if (path.startsWith('http')) return path;
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
// Check if TMDB is available (always true since backend handles it)
// ===========================
export function isTMDBAvailable(): boolean {
  return true;
}

// ===========================
// Trending
// ===========================
export async function fetchTrending(
  timeWindow: 'day' | 'week' = 'day',
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  // Use BingeKaro Backend Movies Trending Endpoint
  return api.getHome(page).then((homeData) => {
    const railKey = timeWindow === 'day' ? 'trending_today' : 'trending_this_week';
    const rail = homeData.rails?.[railKey];
    if (rail) {
      return {
        page: rail.page || page,
        total_pages: rail.total_pages || 1,
        total_results: rail.total_results || rail.results?.length || 0,
        results: rail.results || [],
      };
    }
    // Fallback if not in home object
    return { page, total_pages: 1, total_results: 0, results: [] };
  });
}

// ===========================
// Movies
// ===========================
export async function fetchPopularMovies(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['popular_movies'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

export async function fetchTopRatedMovies(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['top_rated_movies'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

export async function fetchNowPlaying(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['now_playing'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

export async function fetchUpcoming(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['upcoming'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

// ===========================
// TV Shows
// ===========================
export async function fetchPopularTV(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['popular_tv'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

export async function fetchTopRatedTV(page: number = 1): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.getHome(page).then((data) => {
    const rail = data.rails?.['top_rated_tv'];
    return {
      page: rail?.page || page,
      total_pages: rail?.total_pages || 1,
      total_results: rail?.total_results || 0,
      results: rail?.results || [],
    };
  });
}

// ===========================
// Genre Discovery
// ===========================
export async function fetchMoviesByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.discoverByGenre(genreId, 'movie', page).then((res) => res.movie || res.movies || res);
}

export async function fetchTVByGenre(
  genreId: number,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMovie>> {
  return api.discoverByGenre(genreId, 'tv', page).then((res) => res.tv || res);
}

// ===========================
// Search
// ===========================
export async function multiSearch(
  query: string,
  page: number = 1
): Promise<TMDBPagedResponse<TMDBMultiSearchResult>> {
  return api.search(query, page);
}

// ===========================
// Details
// ===========================
export async function fetchMovieDetails(id: number): Promise<any> {
  return api.getMovieDetails(id);
}

export async function fetchTVDetails(id: number): Promise<any> {
  return api.getTVDetails(id);
}

// ===========================
// Normalization Helpers
// ===========================
export function normalizeContent(item: any): NormalizedContent {
  const mediaType = item.media_type || item.mediaType || ('first_air_date' in item || 'episode_run_time' in item ? 'tv' : 'movie');
  const title = item.title || item.name || 'Untitled';
  const dateStr = item.release_date || item.first_air_date || '';
  const year = dateStr ? new Date(dateStr).getFullYear() : 0;

  return {
    id: item.id,
    title,
    mediaType: mediaType as 'movie' | 'tv',
    posterUrl: item.poster_path ? getPosterUrl(item.poster_path) : (item.posterUrl || FALLBACK_POSTER),
    backdropUrl: item.backdrop_path ? getBackdropUrl(item.backdrop_path) : (item.backdropUrl || FALLBACK_BACKDROP),
    year: isNaN(year) ? 0 : year,
    rating: Math.round((item.vote_average || item.rating || 0) * 10) / 10,
    voteCount: item.vote_count || item.voteCount || 0,
    overview: item.overview || '',
    genreIds: item.genre_ids || (item.genres ? item.genres.map((g: any) => typeof g === 'object' ? g.id : g) : []),
    language: item.original_language || item.language || 'en',
    popularity: item.popularity || 0,
  };
}

export function normalizePerson(item: any): NormalizedPerson {
  return {
    id: item.id,
    name: item.name || 'Unknown',
    profileUrl: item.profile_path ? getProfileUrl(item.profile_path) : FALLBACK_PROFILE,
    department: item.known_for_department || 'Acting',
    knownFor: (item.known_for || [])
      .map((m: any) => m.title || m.name || '')
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
