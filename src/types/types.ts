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


export interface MovieListProps {
    type: 'popular' | 'top_rated' | 'upcoming';
  }

  export interface Movie {
    imdbID: string;  
    Title: string;   
    Year: string;    
    Poster: string;  
    Type: string;
    Plot?: string;    
    imdbRating?: string;
  }
  
  export interface MovieDetail extends Movie {
    Rated: string;
    Released: string;
    Runtime: string;
    Genre: string;
    Director: string;
    Writer: string;
    Actors: string;
    Plot: string;
    Language: string;
    Country: string;
    Ratings: Array<{ Source: string; Value: string }>;
    imdbRating: string;
    imdbVotes: string;
    BoxOffice: string;
    Production: string;
    Website: string;
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