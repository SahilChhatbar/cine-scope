import { MantineColor } from "@mantine/core";

export interface MovieCardProps {
  movie: Movie;
}
export interface NavLinkItem {
  link: string;
  label: string;
  description:string;
}

export interface HeaderProps {
  logoColor?: MantineColor;
}

export interface SortOption {
  id: string;
  label: string;
  compareFn: (a: Movie, b: Movie) => number;
}

export interface MovieListProps {
  type: 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'hot_right_now';
  genreId?: number;
}

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Release?: string | number;
  Poster: string | null;
  Backdrop: string | null;
  Plot?: string;
  imdbRating?: string;
}

interface PersonCredit {
  id: number;
  name: string;
  department?: string;
}

interface CastCredit extends PersonCredit {
  character: string;
  job?: string;
}

interface CrewCredit extends PersonCredit {
  job: string;
}

export interface MovieDetails extends Movie {
  Runtime: string;
  Genre: string;
  Plot: string;
  imdbRating: string;
  imdbVotes: string;
  Production: string;
  Website: string;
  Similar?: Movie[];
  Cast?: CastCredit[];
  Crew?: CrewCredit[];
  Reviews?: Review[];
  Videos?: {
    results: Array<{
      id: string;
      key: string;
      name: string;
      site: string;
      size: number;
      type: string;
      official: boolean;
    }>;
  };
}

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  rating?: number;
}

export interface MovieListResponse {
  movies: Movie[];
  totalResults: number;
  page: number;
  totalPages: number;
}

export interface MovieData {
  movies: Movie[];
  totalPages: number;
}

export type MovieListType = 'popular' | 'top_rated' | 'upcoming' | 'now_playing' | 'hot_right_now';

export interface VideoResult {
  type?: string;
  site?: string;
  key?: string;
  official?: boolean;
}
export interface TmdbMovie {
  id?: number;
  title?: string;
  release_date?: string;
  poster_path?: string;
  backdrop_path?: string;
  overview?: string;
  vote_average?: number;
} 

export interface TmdbApiResponse {
  results: TmdbMovie[];
  total_results: number;
  total_pages: number;
  page: number;
}
