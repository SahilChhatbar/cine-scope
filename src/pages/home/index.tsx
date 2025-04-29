import MovieList from "../../components/common/MovieList";
import PopularMovieSlides from "./components/PopularMovieSlides";
import { useOutletContext } from "react-router-dom";

const Home = () => {
  const context = useOutletContext();

  return (
    <>
      {context === "carousel" ? (
        <PopularMovieSlides/>
      ) : (
        <div className="md:py-4">
          <MovieList type="hot_right_now"/>
        </div>
      )}
    </>
  );
};

export default Home;