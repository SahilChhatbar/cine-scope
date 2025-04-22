import { useQuery } from '@tanstack/react-query';
import { Container, Title, Alert } from '@mantine/core';
import { fetchMoviesByType } from '../../utils/fetchMovies';
import MovieCard from './MovieCard';
import { Movie } from '../../types/types';
import { MovieListProps } from '../../types/types'; 

const MovieList = ({ type }: MovieListProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ['movies', type],
    queryFn: () => fetchMoviesByType(type, 1),
    retry: false,
  });

  if (!data?.movies && !isLoading) {
    return (
      <Container size="xl">
        <Alert 
          title="Error"
          color="red"
          variant="filled"
          className="mb-4"
        >
          Failed to load movies.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" px={100} py="md">
      <Title
        order={1}
        className="text-3xl font-bold text-start text-white capitalize"
      >
        {type.replace('_', ' ')} Movies
      </Title>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        { data?.movies.map((movie: Movie) => (
              <div key={movie?.imdbID} className="flex justify-center">
                <MovieCard movie={movie} />
              </div>
            ))}
      </div>
    </Container>
  );
};

export default MovieList;