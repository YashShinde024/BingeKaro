// ===========================
// TMDB API Type Definitions
// ===========================

export interface TMDBMovie {
  id: number;
  title?: string;           // movies
  name?: string;            // TV shows / people
  original_title?: string;
  original_name?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;    // movies
  first_air_date?: string;  // TV shows
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  adult: boolean;
  media_type?: 'movie' | 'tv' | 'person';
  video?: boolean;
}

export interface TMDBTVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  original_language: string;
  origin_country: string[];
  media_type?: 'tv';
}

export interface TMDBPerson {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  known_for: TMDBMovie[];
  popularity: number;
  media_type: 'person';
  gender: number;
}

export interface TMDBCastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
}

export interface TMDBCrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDBMovieDetails extends TMDBMovie {
  runtime: number;
  tagline: string;
  status: string;
  revenue: number;
  budget: number;
  genres: { id: number; name: string }[];
  production_companies: { id: number; name: string; logo_path: string | null }[];
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  similar?: {
    results: TMDBMovie[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  'watch/providers'?: {
    results: Record<string, TMDBWatchProviderRegion>;
  };
}

export interface TMDBTVDetails {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  tagline: string;
  status: string;
  genres: { id: number; name: string }[];
  credits?: {
    cast: TMDBCastMember[];
    crew: TMDBCrewMember[];
  };
  similar?: {
    results: TMDBMovie[];
  };
  videos?: {
    results: {
      key: string;
      site: string;
      type: string;
      name: string;
    }[];
  };
  'watch/providers'?: {
    results: Record<string, TMDBWatchProviderRegion>;
  };
}

export interface TMDBWatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
  display_priority: number;
}

export interface TMDBWatchProviderRegion {
  link: string;
  flatrate?: TMDBWatchProvider[];
  rent?: TMDBWatchProvider[];
  buy?: TMDBWatchProvider[];
  free?: TMDBWatchProvider[];
  ads?: TMDBWatchProvider[];
}

export interface TMDBPagedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDBMultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  // Movie fields
  title?: string;
  release_date?: string;
  // TV fields
  name?: string;
  first_air_date?: string;
  // Person fields
  profile_path?: string | null;
  known_for_department?: string;
  known_for?: TMDBMovie[];
  // Common
  poster_path?: string | null;
  backdrop_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  popularity?: number;
  genre_ids?: number[];
  original_language?: string;
  gender?: number;
}

// ===========================
// Normalized types for our UI
// ===========================

export interface NormalizedContent {
  id: number;
  title: string;
  mediaType: 'movie' | 'tv';
  posterUrl: string | null;
  backdropUrl: string | null;
  year: number;
  rating: number;
  voteCount: number;
  overview: string;
  genreIds: number[];
  language: string;
  popularity: number;
}

export interface NormalizedPerson {
  id: number;
  name: string;
  profileUrl: string | null;
  department: string;
  knownFor: string[];
}

// TMDB Genre IDs (commonly used)
export const TMDB_GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
  // TV-specific
  10759: 'Action & Adventure',
  10762: 'Kids',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
};
