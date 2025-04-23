import MovieList from "../../components/common/MovieList"
import PopularMovieSlides from "./components/PopularMovieSlides"

const Home = () => {
  return (
    <div>
      <PopularMovieSlides/>
      <MovieList type="popular" />
      </div>
  )
}

export default Home