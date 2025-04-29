import { useRef } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Text, Stack, Center, Title, Flex } from "@mantine/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMoviesByType } from "../../../utils/fetchMovies";
import { FaStar } from "react-icons/fa";
import { MdArrowBack, MdArrowForward } from "react-icons/md";

const PopularMovieSlides = () => {
  const autoplay = useRef(Autoplay({ delay: 6000 }));

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
            <Center>
              <Skeleton height={600} width={1210} duration={2} />
            </Center>
          </SkeletonTheme>
        </div>
      </Center>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Carousel
      height={600}
      plugins={[autoplay.current]}
      loop={true}
      nextControlIcon={<MdArrowForward size={30} />}
      previousControlIcon={<MdArrowBack size={30} />} 
      w="100%"
      className="md:mt-0 mt-18"
    >
      {data?.map((movie) => (
        <Carousel.Slide key={movie?.imdbID}>
          <Link to={`/movie/${movie?.imdbID}`}>
            <Box className="relative h-full w-full">
              <Box
                className="absolute inset-0 bg-center bg-no-repeat bg-cover rounded-3xl w-full h-full"
                style={{
                  backgroundImage: `url(${movie?.Backdrop})`,
                }}
              />
              <Box className="absolute inset-0 flex flex-col justify-end p-8 rounded-3xl text-white bg-gradient-to-t from-black to-transparent transition-opacity duration-300">
                <Stack gap="sm" w="100%">
                  <Title>{movie?.Title}</Title>
                  <Flex gap="md">
                    <Text size="xl" className="opacity-90">
                      {movie?.Year}
                    </Text>
                    {movie?.imdbRating && (
                      <span className="flex flex-row text-yellow-400 text-xl items-center gap-1">
                        <FaStar /> {movie?.imdbRating}
                      </span>
                    )}
                  </Flex>
                  {movie?.Plot && (
                    <Text
                      opacity="80%"
                      size="lg"
                      lineClamp={3}
                      className="italic"
                    >
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
  );
};

export default PopularMovieSlides;
