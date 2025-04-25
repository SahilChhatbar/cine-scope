import { MantineColor } from "@mantine/core";

export interface MovieCardProps {
  movie: Movie;
}
export interface NavLinkItem {
  link: string;
  label: string;
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
    type: 'popular' | 'top_rated' | 'upcoming';
  }
  
  export interface Movie {
    imdbID: string;  
    Title: string;   
    Year: string;    
    Poster: string;
    Backdrop: string; 
    Plot?: string;    
    imdbRating?: string;
}
  
  export interface MovieDetails extends Movie {
    Runtime: string;
    Genre: string;
    Plot: string;
    imdbRating: string;
    imdbVotes: string;
    Production: string;
    Website: string;
    Review:string;
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
  
  export interface MovieListResponse {
    movies: Movie[];
    totalResults: number;
    page: number;
    totalPages: number;
  }
  export type MovieListType = 'popular' | 'top_rated' | 'upcoming';