// ===========================
// Core Types for KyaDekhu
// ===========================

export type OTTProviderId =
  | 'netflix'
  | 'prime-video'
  | 'jiohotstar'
  | 'sonyliv'
  | 'zee5'
  | 'apple-tv'
  | 'crunchyroll'
  | 'youtube'
  | 'mx-player'
  | 'hulu'
  | 'max'
  | 'paramount-plus'
  | 'lionsgate-play';

export interface OTTProvider {
  id: OTTProviderId;
  name: string;
  logo: string;
  type: 'free' | 'subscription' | 'rent' | 'buy';
  link?: string;
}

export type ContentType = 'movie' | 'tv' | 'anime';

export type MoodId =
  | 'adventurous'
  | 'romantic'
  | 'thrilling'
  | 'funny'
  | 'dark'
  | 'feel-good'
  | 'emotional'
  | 'inspiring'
  | 'chill'
  | 'scary'
  | 'mind-bending'
  | 'action-packed';

export interface Mood {
  id: MoodId;
  label: string;
  icon: string;
  description: string;
}

export type GenreId =
  | 'action'
  | 'comedy'
  | 'drama'
  | 'thriller'
  | 'romance'
  | 'sci-fi'
  | 'horror'
  | 'documentary'
  | 'animation'
  | 'crime'
  | 'fantasy'
  | 'biography'
  | 'musical'
  | 'mystery'
  | 'sport';

export interface Genre {
  id: GenreId;
  label: string;
}

export type LanguageId =
  | 'hindi'
  | 'english'
  | 'tamil'
  | 'telugu'
  | 'malayalam'
  | 'korean'
  | 'japanese'
  | 'marathi'
  | 'bengali';

export interface Language {
  id: LanguageId;
  label: string;
  nativeLabel: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
}

export interface Movie {
  id: number;
  type: ContentType;
  title: string;
  originalTitle?: string;
  year: number;
  rating: number;
  voteCount: number;
  runtime: number; // in minutes
  overview: string;
  tagline?: string;
  posterPath: string;
  backdropPath: string;
  genres: GenreId[];
  language: LanguageId;
  providers: OTTProviderId[];
  isFree: boolean;
  director?: string;
  cast?: CastMember[];
  trailerKey?: string; // YouTube video ID
  aiInsight?: string;
  isHidden?: boolean; // hidden gem flag
  isTrending?: boolean;
  isTopRated?: boolean;
  isBollywood?: boolean;
  isHollywood?: boolean;
  isAIPick?: boolean;
  screenshots?: string[];
  collection?: string;
}

export interface WatchlistItem {
  movieId: number;
  addedAt: string; // ISO date string
  movie: Movie;
}

export interface RecommendationFilter {
  moods: MoodId[];
  genres: GenreId[];
  languages: LanguageId[];
  maxRuntime: number; // minutes
  contentTypes: ContentType[];
}

export interface RecommendationResult {
  movie: Movie;
  aiExplanation: string;
  matchScore: number;
  matchReasons: string[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  favoriteGenres: GenreId[];
  favoriteMoods: MoodId[];
  favoriteProviders: OTTProviderId[];
  joinedAt: string;
}

export interface SearchResult {
  movies: Movie[];
  actors: Actor[];
}

export interface Actor {
  id: number;
  name: string;
  profilePath: string | null;
  knownFor: string[];
}
