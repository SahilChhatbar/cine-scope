import axios from 'axios';
import { Movie, MovieDetails, MovieListResponse, TmdbMovie } from '../types/types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const TMDB_BACKDROP_BASE_URL = 'https://image.tmdb.org/t/p/original';
const MAX_PAGES = 500;

const DEFAULT_MOVIE_RESPONSE: MovieListResponse = {
  movies: [],
  totalResults: 0,
  page: 1,
  totalPages: 0,
};

const DEFAULT_MOVIE_DETAILS: MovieDetails = {
  imdbID: '',
  Title: 'Movie Not Found',
  Year: 'N/A',
  Runtime: 'N/A',
  Genre: 'N/A',
  Plot: 'Movie details are not available.',
  Poster: 'no poster',
  Backdrop: 'No image',
  Website: 'N/A',
  imdbRating: 'N/A',
  imdbVotes: '0',
  Reviews: [],
  Production: 'N/A',
  Cast: [],
  Crew: [],
  Similar: [],
};

const transformMovieData = (tmdbMovie: TmdbMovie): Movie => ({
  imdbID: tmdbMovie?.id?.toString() || '',
  Title: tmdbMovie?.title || 'Unknown Title',
  Year: tmdbMovie?.release_date 
    ? new Date(tmdbMovie.release_date).getFullYear().toString() 
    : 'N/A',
  Poster: tmdbMovie?.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` 
    : 'no poster',
  Backdrop: tmdbMovie?.backdrop_path 
    ? `${TMDB_BACKDROP_BASE_URL}${tmdbMovie.backdrop_path}` 
    : 'no poster',
  Plot: tmdbMovie?.overview || 'No plot available',
  imdbRating: tmdbMovie?.vote_average 
    ? tmdbMovie.vote_average.toFixed(1) 
    : 'N/A'
});

const handleApiResponse = (response: any): MovieListResponse => {
  if (!response || !Array.isArray(response.results)) {
    return DEFAULT_MOVIE_RESPONSE;
  }

  

  return {
    movies: response.results.map((movie: TmdbMovie) => 
      movie ? transformMovieData(movie) : null).filter(Boolean),
    totalResults: response.total_results || 0,
    page: response.page || 1,
    totalPages: Math.min(response.total_pages || 1, MAX_PAGES),
  } as MovieListResponse;
};

export const tmdbApi = {
  getMovieDetails: async (movieId: string): Promise<MovieDetails> => {
    if (!movieId) return DEFAULT_MOVIE_DETAILS;

    try {
      const [movieResponse, similarResponse, reviewsResponse] = await Promise.allSettled([
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
        }),
        axios.get(`${TMDB_BASE_URL}/movie/${movieId}/reviews`, {
          params: {
            api_key: TMDB_API_KEY,
          },
        }),
      ]);

      const movie = movieResponse.status === 'fulfilled' ? movieResponse.value.data : null;
      const similarMovies = similarResponse.status === 'fulfilled' 
        ? similarResponse.value.data.results.slice(0, 5).map(transformMovieData)
        : [];
      const reviews = reviewsResponse.status === 'fulfilled'
        ? reviewsResponse.value.data.results.slice(0, 10).map((review: any) => ({
            id: review?.id || '',
            author: review?.author || 'Anonymous',
            content: review?.content || 'No content',
            created_at: review?.created_at || new Date().toISOString(),
            rating: review?.author_details?.rating || null,
          }))
        : [];

      if (!movie) return DEFAULT_MOVIE_DETAILS;

      return {
        imdbID: movie.id?.toString() || '',
        Title: movie.title || 'Unknown Title',
        Year: movie.release_date 
          ? new Date(movie.release_date).getFullYear().toString() 
          : 'N/A',
        Runtime: movie.runtime ? `${movie.runtime} min` : 'N/A',
        Genre: movie.genres?.length 
          ? movie.genres.map((g: any) => g.name).join(', ') 
          : 'N/A',
        Plot: movie.overview || 'No plot available',
        Poster: movie.poster_path 
          ? `${TMDB_IMAGE_BASE_URL}${movie.poster_path}` 
          : 'no poster',
        Backdrop: movie.backdrop_path 
          ? `${TMDB_BACKDROP_BASE_URL}${movie.backdrop_path}` 
          : 'No image',
        Website: movie.homepage || 'N/A',
        imdbRating: movie.vote_average ? (movie.vote_average / 2).toFixed(1) : 'N/A',
        imdbVotes: movie.vote_count?.toLocaleString() || '0',
        Reviews: reviews,
        Production: movie.production_companies?.length 
          ? movie.production_companies.map((company: any) => company.name).join(', ') 
          : 'N/A',
        Cast: (movie.credits?.cast || []).slice(0, 10).map((cast: any) => ({
          id: cast?.id || '',
          name: cast?.name || 'Unknown',
          character: cast?.character || 'Unknown Role',
        })),
        Crew: (movie.credits?.crew || [])
          .filter((crew: any) => ['Director', 'Writer', 'Producer'].includes(crew?.job))
          .slice(0, 10)
          .map((crew: any) => ({
            id: crew?.id || '',
            name: crew?.name || 'Unknown Role',
            job: crew?.job || 'Unknown Role',
          })),
        Similar: similarMovies,
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      return DEFAULT_MOVIE_DETAILS;
    }
  },

  searchMovies: async (query: string, page: number = 1): Promise<MovieListResponse> => {
    if (!query) return DEFAULT_MOVIE_RESPONSE;
    
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          query,
          page,
        }
      });

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error searching movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
    }
  },

  getMovieVideos: async (movieId: string): Promise<any> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/videos`, {
        params: { api_key: TMDB_API_KEY }
      });
      return response.data?.results || [];
    } catch (error) {
      console.error('Error fetching movie videos:', error);
      return [];
    }
  },

  getPopularMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        }
      });

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
    }
  },

  getTopRatedMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/top_rated`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        }
      });

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching top rated movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
    }
  },

  getUpcomingMovies: async (page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/movie/upcoming`, {
        params: {
          api_key: TMDB_API_KEY,
          page,
        }
      });

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching upcoming movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
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

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching now playing movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
    }
  },
  
  getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MovieListResponse> => {
    try {
      const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page,
        }
      });
  
      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching movies by genre:', error);
      return DEFAULT_MOVIE_RESPONSE;
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
        }
      });

      return handleApiResponse(response.data);
    } catch (error) {
      console.error('Error fetching hot right now movies:', error);
      return DEFAULT_MOVIE_RESPONSE;
    }
  },
};