import React from 'react';
import type { Metadata } from 'next';
import { fetchMovieDetails, fetchTVDetails, isTMDBAvailable } from '../../../lib/tmdb';

interface MovieLayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;

  if (!isTMDBAvailable()) {
    return {
      title: 'Title Details | BingeKaro',
      description: 'Discover movies and TV shows on BingeKaro.',
    };
  }

  try {
    // Try fetching movie details first
    const movie = await fetchMovieDetails(Number(id));
    const title = movie.title ? `${movie.title} (${new Date(movie.release_date || '').getFullYear() || ''}) | BingeKaro` : 'Movie Details | BingeKaro';
    const description = movie.overview || 'Watch on BingeKaro';
    const backdropUrl = movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : undefined;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'video.movie',
        images: backdropUrl ? [{ url: backdropUrl, width: 1280, height: 720, alt: movie.title }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: backdropUrl ? [backdropUrl] : [],
      },
    };
  } catch {
    try {
      // Fallback/retry with TV Details
      const tv = await fetchTVDetails(Number(id));
      const title = tv.name ? `${tv.name} (${new Date(tv.first_air_date || '').getFullYear() || ''}) | BingeKaro` : 'TV Show Details | BingeKaro';
      const description = tv.overview || 'Watch on BingeKaro';
      const backdropUrl = tv.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tv.backdrop_path}` : undefined;

      return {
        title,
        description,
        openGraph: {
          title,
          description,
          type: 'video.tv_show',
          images: backdropUrl ? [{ url: backdropUrl, width: 1280, height: 720, alt: tv.name }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: backdropUrl ? [backdropUrl] : [],
        },
      };
    } catch {
      return {
        title: 'Title Details | BingeKaro',
        description: 'Discover movies and TV shows on BingeKaro.',
      };
    }
  }
}

export default function MovieLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
