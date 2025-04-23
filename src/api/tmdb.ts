import axios from 'axios';
import { Movie, MovieDetail, MovieListResponse } from '../types/types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';

const transformMovieData = (tmdbMovie: any): Movie => {
  return {
    imdbID: tmdbMovie.id.toString(),
    Title: tmdbMovie.title,
    Year: tmdbMovie.release_date?.substring(0, 4) || '',
    Poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` : '',
    Backdrop: tmdbMovie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${tmdbMovie.backdrop_path}` : '',
    Type: 'movie',
    Plot: tmdbMovie.overview || '',
    imdbRating: tmdbMovie.vote_average ? tmdbMovie.vote_average.toFixed(1) : 'N/A'
  };
};

export const tmdbApi = {
  getMovieDetails: async (movieId: string): Promise<MovieDetail> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
        params: {
          api_key: TMDB_API_KEY,
          append_to_response: 'credits,videos',
        },
      });

      return {
        imdbID: response.data.id.toString(),
        Title: response.data.title,
        Year: response.data.release_date.substring(0, 4),
        Poster: response.data.poster_path ? `${TMDB_IMAGE_BASE_URL}${response.data.poster_path}` : '',
        Backdrop: response.data.backdrop_path ? `${TMDB_IMAGE_BASE_URL}${response.data.backdrop_path}` : '',
        Type: 'movie',
        Rated: response.data.adult ? 'R' : 'PG-13',
        Released: response.data.release_date,
        Runtime: `${response.data.runtime} min`,
        Genre: response.data.genres.map((g: any) => g.name).join(', '),
        Plot: response.data.overview,
        Ratings: [
          { Source: 'TMDB', Value: `${response.data.vote_average}/10` }
        ],
        imdbRating: (response.data.vote_average / 2).toString(),
        imdbVotes: response.data.vote_count.toString(),
        Production: response.data.production_companies.map((comp: any) => comp.name).join(', '),
        Website: response.data.homepage || 'N/A',
        Videos: response.data.videos
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error;
    }
  },

  getMovieVideos: async (movieId: string): Promise<any> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: {
          api_key: TMDB_API_KEY
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      throw error;
    }
  },

  searchMovies: async (query: string): Promise<MovieListResponse> => {
    if (!query) return { movies: [], totalResults: 0, page: 1, totalPages: 0 };
    
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query: query,
          page: 1
        }
      });

      return {
        movies: response.data.results.map(transformMovieData),
        totalResults: response.data.total_results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error searching movies:', error);
      throw error;
    }
  },

  getPopularMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          per_page: 20
        }
      });

      return {
        movies: response.data.results.map(transformMovieData).slice(0, 20),
        totalResults: response.data.total_results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      throw error;
    }
  },

  getTopRatedMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          per_page: 20
        }
      });

      return {
        movies: response.data.results.map(transformMovieData).slice(0, 20),
        totalResults: response.data.total_results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      throw error;
    }
  },

  getUpcomingMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          per_page: 20
        }
      });

      return {
        movies: response.data.results.map(transformMovieData).slice(0, 20),
        totalResults: response.data.total_results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      throw error;
    }
  }
};