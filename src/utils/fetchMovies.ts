import { tmdbApi } from '../api/tmdb';
import { MovieListResponse,MovieListType } from '../types/types';

export const fetchMoviesByType = async (
  type: MovieListType, 
  page: number = 1
): Promise<MovieListResponse> => {
  try {
    switch (type) {
      case 'popular':
        return tmdbApi.getPopularMovies(page);
      case 'top_rated':
        return tmdbApi.getTopRatedMovies(page);
      case 'upcoming':
        return tmdbApi.getUpcomingMovies(page);
      case 'now_playing':
        return tmdbApi.getNowPlayingMovies(page);
      default:
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
    }
  } catch (error) {
    console.error(`Error fetching ${type} movies:`, error);
    throw error;
  }
};