import { API_URL } from './apiConfig';

export interface ApiOptions {
  token?: string | null;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
}

const inflightRequests = new Map<string, Promise<any>>();

async function apiRequest<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { token, method = 'GET', body, headers = {} } = options;
  
  const url = `${API_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const cacheKey = method === 'GET' ? `${url}::${token || ''}` : null;

  if (cacheKey && inflightRequests.has(cacheKey)) {
    return inflightRequests.get(cacheKey) as Promise<T>;
  }

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (token) {
    requestHeaders['Authorization'] = `Bearer ${token}`;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

  const executeRequest = async (): Promise<T> => {
    try {
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        let errorMsg = `API Error: ${response.status} ${response.statusText}`;
        try {
          const errorJson = JSON.parse(errorText);
          errorMsg = errorJson.detail || errorMsg;
        } catch {
          // use default
        }
        throw new Error(errorMsg);
      }

      return await response.json() as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        throw new Error('Request timed out. Please check your connection and retry.');
      }
      throw error;
    }
  };

  if (cacheKey) {
    const promise = executeRequest();
    inflightRequests.set(cacheKey, promise);
    promise.finally(() => inflightRequests.delete(cacheKey));
    return promise;
  }

  return executeRequest();
}

export const api = {
  // Homepage
  getHome: (page: number = 1) => 
    apiRequest<any>(`/home?page=${page}`),

  // Content Details
  getContentFull: (type: 'movie' | 'tv', id: number) => 
    apiRequest<any>(`/content/${type}/${id}/full`),
    
  getContentSummary: (type: 'movie' | 'tv', id: number) => 
    apiRequest<any>(`/content/${type}/${id}/summary`, { method: 'POST' }),

  getWhyLike: (type: 'movie' | 'tv', id: number, token: string) => 
    apiRequest<any>(`/content/${type}/${id}/why-like`, { method: 'POST', token }),

  // Specific content wrappers
  getMovieDetails: (id: number) => 
    apiRequest<any>(`/movies/${id}`),

  getTVDetails: (id: number) => 
    apiRequest<any>(`/tv/${id}`),

  // Search
  search: (query: string, page: number = 1) => 
    apiRequest<any>(`/search?q=${encodeURIComponent(query)}&page=${page}`),

  // Discover
  discover: (filters: Record<string, any>, page: number = 1) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, String(val));
      }
    });
    params.append('page', String(page));
    return apiRequest<any>(`/discover?${params.toString()}`);
  },

  discoverByGenre: (genreId: number, contentType: 'all' | 'movie' | 'tv' = 'all', page: number = 1) => 
    apiRequest<any>(`/discover/genre/${genreId}?content_type=${contentType}&page=${page}`),

  // Watchlist
  getWatchlist: (token: string, limit: number = 50, offset: number = 0) => 
    apiRequest<any[]>(`/watchlist?limit=${limit}&offset=${offset}`, { token }),

  addToWatchlist: (token: string, payload: {
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string;
    rating: number;
    release_date: string;
  }) => 
    apiRequest<any>(`/watchlist`, { method: 'POST', body: payload, token }),

  removeFromWatchlist: (token: string, itemId: string) => 
    apiRequest<any>(`/watchlist/${itemId}`, { method: 'DELETE', token }),

  checkWatchlistExists: (token: string, mediaType: 'movie' | 'tv', tmdbId: number) => 
    apiRequest<{ exists: boolean; item_id?: string }>(`/watchlist/check/${mediaType}/${tmdbId}`, { token }),

  // Favorites
  getFavorites: (token: string) => 
    apiRequest<any[]>(`/favorites`, { token }),

  addToFavorites: (token: string, payload: {
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string;
    rating: number;
    release_date: string;
  }) => 
    apiRequest<any>(`/favorites`, { method: 'POST', body: payload, token }),

  removeFromFavorites: (token: string, itemId: string) => 
    apiRequest<any>(`/favorites/${itemId}`, { method: 'DELETE', token }),

  checkFavoriteExists: (token: string, mediaType: 'movie' | 'tv', tmdbId: number) => 
    apiRequest<{ exists: boolean; item_id?: string }>(`/favorites/check/${mediaType}/${tmdbId}`, { token }),

  // History
  getHistory: (token: string) => 
    apiRequest<any[]>(`/history`, { token }),

  addToHistory: (token: string, payload: {
    tmdb_id: number;
    media_type: 'movie' | 'tv';
    title: string;
    poster_path: string;
    rating: number;
    release_date: string;
  }) => 
    apiRequest<any>(`/history`, { method: 'POST', body: payload, token }),

  // Recommendations & AI
  getRecommendations: (token: string, payload: {
    genre?: string;
    platform?: string;
    language?: string;
    runtime?: string;
  }) => 
    apiRequest<{ results: any[] }>(`/recommendations`, { method: 'POST', body: payload, token }),

  getRecommendationHistory: (token: string) => 
    apiRequest<any[]>(`/recommendations/history`, { token }),

  getMovieDNA: (token: string) => 
    apiRequest<any>(`/movie-dna`, { token }),

  // User details & onboarding preferences
  getMe: (token: string) => 
    apiRequest<any>(`/users/me`, { token }),

  onboard: (token: string, payload: {
    genres?: string[];
    languages?: string[];
    platforms?: string[];
  }) => 
    apiRequest<any>(`/users/onboarding`, { method: 'POST', body: payload, token }),

  updatePreferences: (token: string, payload: {
    genres?: string[];
    languages?: string[];
    platforms?: string[];
  }) => 
    apiRequest<any>(`/users/preferences`, { method: 'PATCH', body: payload, token }),

  getPreferences: (token: string) => 
    apiRequest<any>(`/users/preferences`, { token }),
};
