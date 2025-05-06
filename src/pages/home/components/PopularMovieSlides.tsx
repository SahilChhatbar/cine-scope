import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Autoplay from "embla-carousel-autoplay";
import { Carousel } from "@mantine/carousel";
import { Box, Text, Stack, Center, Title, Flex } from "@mantine/core";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { fetchMoviesByType } from "../../../utils/fetchMovies";
import { FaStar } from "react-icons/fa";
import { TiArrowBack, TiArrowForward } from "react-icons/ti";
import { motion, AnimatePresence } from "framer-motion";
import { textVariants } from "../../../constants";

const PopularMovieSlides = () => {
  const autoplay = useRef(Autoplay({ delay: 5000 }));
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "popular"],
    queryFn: () => fetchMoviesByType("popular", 1),
    select: (data) => data.movies.slice(0, 8),
  });

  if (isLoading) {
    return (
      <Center>
        <div className="w-full max-w-320">
          <SkeletonTheme
            baseColor="gray"
            borderRadius={24}
            highlightColor="#444"
          >
            <Center>
              <Skeleton height={600} width={1280} duration={2} />
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
      nextControlIcon={<TiArrowForward size={32} />}
      previousControlIcon={<TiArrowBack size={32} />}
      w="100%"
      className="md:mt-0 mt-18"
      onSlideChange={(index) => setCurrentSlide(index)}
    >
      {data?.map((movie, index) => (
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
                <AnimatePresence mode="wait">
                  {index === currentSlide && (
                    <motion.div
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={textVariants}
                      key={`content-${movie?.imdbID}-${index}`}
                    >
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
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Box>
          </Link>
        </Carousel.Slide>
      ))}
    </Carousel>
  );
};

export default PopularMovieSlides;
