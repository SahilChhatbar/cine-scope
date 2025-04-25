import MovieList from "../../components/common/MovieList";

const NowPlaying = () => {
  return (
    <div className="min-h-screen">
      <MovieList type="now_playing" />
    </div>
  );
};

export default NowPlaying;
