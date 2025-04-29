import axios from 'axios';
import { Movie, MovieDetails, MovieListResponse } from '../types/types';

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
    Plot: tmdbMovie.overview || '',
    imdbRating: tmdbMovie.vote_average ? tmdbMovie.vote_average.toFixed(1) : 'N/A'
  };
};

export const tmdbApi = {
  getMovieDetails: async (movieId: string): Promise<MovieDetails> => {
    try {
      const [movieResponse, similarResponse, reviewsResponse] = await Promise.all([
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
          params: {
            api_key: TMDB_API_KEY,
            append_to_response: 'credits,videos',
          },
        }),
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}/similar`, {
          params: {
            api_key: TMDB_API_KEY,
          },
        }), axios.get(`${TMDB_BASE_URL}/movie/${movieId}/reviews`, {
          params: {
            api_key: TMDB_API_KEY,
          },
        }),
      ]);
  
      const movie = movieResponse.data;
      const similarMovies = similarResponse.data.results.slice(0, 5).map((movie: any) => ({
        imdbID: movie.id,
        Title: movie.title,
        Year: new Date(movie.release_date).getFullYear(),
        Poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : null,
        Backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : null,
        Plot: movie.overview,
        imdbRating: (movie.vote_average).toFixed(1),
}));
        const reviews = reviewsResponse.data.results.slice(0, 10).map((review: any) => ({
        id: review.id,
        author: review.author,
        content: review.content,
        created_at: review.created_at,
        rating: review.author_details?.rating || null,
}));
  
      return {
        imdbID: movie.id.toString(),
        Title: movie.title,
        Year: new Date(movie.release_date).getFullYear().toString(),
        Runtime: `${movie.runtime} min`,
        Genre: movie.genres.map((g: any) => g.name).join(', '),
        Plot: movie.overview,
        Poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` : '',
        Backdrop: movie.backdrop_path ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` : '',
        Website: movie.homepage || 'N/A',
        imdbRating: (movie.vote_average / 2).toFixed(1),
        imdbVotes: movie.vote_count.toLocaleString(),
        Reviews: reviews,
        Production: movie.production_companies.map((company: any) => company.name).join(', '),
        Cast: movie.credits.cast.slice(0, 10).map((cast: any) => ({
          id: cast.id,
          name: cast.name,
          character: cast.character,
        })),
        Crew: movie.credits.crew
          .filter((crew: any) => ['Director', 'Writer', 'Producer'].includes(crew.job))
          .slice(0, 10)
          .map((crew: any) => ({
            id: crew.id,
            name: crew.name,
            job: crew.job,
          })),
        Similar: similarMovies,
        
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
          per_page: 20,
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
  },
  getNowPlayingMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/now_playing`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
          region: 'IN',
        }
      });

      return {
        movies: response.data.results.map(transformMovieData).slice(0, 20),
        totalResults: response.data.total_results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };
    } catch (error) {
      console.error('Error fetching current movies:', error);
      throw error;
    }
  },
  getHotRightNow: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const currentDate = new Date().toISOString().split('T')[0];
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          sort_by: 'popularity.desc',
          region: 'IN',
          'release_date.gte': currentDate,
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
      console.error('Error fetching hot right now movies:', error);
      throw error;
    }
  },
};