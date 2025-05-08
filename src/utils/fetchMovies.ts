import { MovieListResponse, MovieListType } from '../types/types';
import { tmdbApi } from '../api/tmdb';

export const fetchMoviesByType = async (
  type: MovieListType, 
  page: number = 1,
  genreId?: number,
): Promise<MovieListResponse> => {
  try {
    switch (type) {
      case 'popular':
        return genreId 
          ? tmdbApi.getMoviesByGenre(genreId, page)
          : tmdbApi.getPopularMovies(page);
      case 'top_rated':
        return tmdbApi.getTopRatedMovies(page);
      case 'upcoming':
        return tmdbApi.getUpcomingMovies(page);
      case 'now_playing':
        return tmdbApi.getNowPlayingMovies(page);
      case 'hot_right_now':
        return tmdbApi.getHotRightNow(page);
      default:
        const _exhaustiveCheck: never = type;
        return _exhaustiveCheck;
    }
  } catch (error) {
    console.error(`Error fetching ${type} movies:`, error);
    throw error;
  }
};