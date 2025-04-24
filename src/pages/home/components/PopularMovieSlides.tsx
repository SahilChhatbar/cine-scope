import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Text, Stack, Center, Title } from "@mantine/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMoviesByType } from "../../../utils/fetchMovies";
import { FaStar } from "react-icons/fa";

const PopularMovieSlides = () => {
  const autoplay = useRef(Autoplay({ delay: 4500 }));

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchMoviesByType("popular", 1),
    select: (data) => data.movies.slice(0, 8),
  });
  
  if (isLoading) {
    return (
      <Center>
        <div className="w-full max-w-280">
          <SkeletonTheme baseColor="gray" highlightColor="#444">
            <Skeleton height={550} duration={2} />
          </SkeletonTheme>
        </div>
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Center>
      <Carousel
        height={550}
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        loop={true}
        w={1120}
      >
        {data?.map((movie) => (
          <Carousel.Slide key={movie?.imdbID}>
            <Link to={`/movie/${movie?.imdbID}`}>
              <Box className="relative h-full w-full">
                <Box
                  className="absolute inset-0 bg-center bg-no-repeat bg-cover w-full h-full"
                  style={{
                    backgroundImage: `url(${movie?.Backdrop})`,
                  }}
                />
                <Box className="absolute inset-0 flex flex-col justify-end p-8 text-white bg-gradient-to-t from-black to-transparent transition-opacity duration-300">
                  <Stack gap="sm" className="w-full">
                    <Title>{movie?.Title}</Title>
                    <Box className="flex items-center gap-5">
                      <Text size="xl" className="opacity-90">
                        {movie?.Year}
                      </Text>
                      {movie?.imdbRating && (
                        <span className="flex flex-row text-yellow-400 text-xl items-center gap-1">
                          <FaStar /> {movie?.imdbRating}
                        </span>
                      )}
                    </Box>
                    {movie?.Plot && (
                      <Text className="text-lg opacity-80 line-clamp-3">
                        {movie?.Plot}
                      </Text>
                    )}
                  </Stack>
                </Box>
              </Box>
            </Link>
          </Carousel.Slide>
        ))}
      </Carousel>
    </Center>
  );
};

export default PopularMovieSlides;