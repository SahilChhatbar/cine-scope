import axios from 'axios';
import { Movie, MovieDetail, MovieListResponse } from '../types/types';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const transformMovieData = (tmdbMovie: any): Movie => {
  return {
    imdbID: tmdbMovie.id.toString(),
    Title: tmdbMovie.title,
    Year: tmdbMovie.release_date?.substring(0, 4) || '',
    Poster: tmdbMovie.poster_path ? `${TMDB_IMAGE_BASE_URL}${tmdbMovie.poster_path}` : '',
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

      const directors = response.data.credits.crew
        .filter((person: any) => person.job === 'Director')
        .map((director: any) => director.name)
        .join(', ');

      const writers = response.data.credits.crew
        .filter((person: any) => ['Screenplay', 'Writer'].includes(person.job))
        .map((writer: any) => writer.name)
        .join(', ');

      return {
        imdbID: response.data.id.toString(),
        Title: response.data.title,
        Year: response.data.release_date.substring(0, 4),
        Poster: response.data.poster_path ? `${TMDB_IMAGE_BASE_URL}${response.data.poster_path}` : '',
        Type: 'movie',
        Rated: response.data.adult ? 'R' : 'PG-13',
        Released: response.data.release_date,
        Runtime: `${response.data.runtime} min`,
        Genre: response.data.genres.map((g: any) => g.name).join(', '),
        Director: directors,
        Writer: writers,
        Actors: response.data.credits.cast.slice(0, 5).map((actor: any) => actor.name).join(', '),
        Plot: response.data.overview,
        Language: response.data.spoken_languages.map((lang: any) => lang.english_name).join(', '),
        Country: response.data.production_countries.map((country: any) => country.name).join(', '),
        Ratings: [
          { Source: 'TMDB', Value: `${response.data.vote_average}/10` }
        ],
        imdbRating: (response.data.vote_average / 2).toString(),
        imdbVotes: response.data.vote_count.toString(),
        BoxOffice: response.data.revenue ? `$${response.data.revenue.toLocaleString()}` : 'N/A',
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
        movies: response.data.results.map(transformMovieData).slice(0, 18),
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
        movies: response.data.results.map(transformMovieData).slice(0, 18),
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
        movies: response.data.results.map(transformMovieData).slice(0, 18),
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