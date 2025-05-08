import { useSearchParams } from 'react-router-dom';
import MovieList from "../../components/common/MovieList";

const Popular = () => {
  const [searchParams] = useSearchParams();
  const genreId = searchParams.get('genre') ? Number(searchParams.get('genre')) : undefined;

  return (
    <MovieList type="popular" genreId={genreId} />
  );
};

export default Popular;