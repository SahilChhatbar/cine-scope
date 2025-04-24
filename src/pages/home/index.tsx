import MovieList from "../../components/common/MovieList";
import PopularMovieSlides from "./components/PopularMovieSlides";

const Home = () => {
  return (
    <div className="md:py-4 py-18">
      <PopularMovieSlides />
      <MovieList type="popular"/>
    </div>
  );
};

export default Home;
