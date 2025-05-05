import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Title,
  Alert,
  Center,
  Button,
  Menu,
  Group,
  Pagination,
} from "@mantine/core";
import { FaHotjar } from "react-icons/fa";
import { fetchMoviesByType } from "../../utils/fetchMovies";
import MovieCard from "./MovieCard";
import {
  Movie,
  MovieListProps,
  SortOption,
  MovieData,
} from "../../types/types";
import { useState, useMemo } from "react";
import {
  MdLiveTv,
  MdSort,
  MdStars,
  MdTrendingUp,
  MdUpcoming,
} from "react-icons/md";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AnimatePresence, motion } from "framer-motion";
import { container, item, transitionSettings } from "../../constants";

const MovieList = ({ type }: MovieListProps) => {
  const [sortBy, setSortBy] = useState("default");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isFetching } = useQuery<MovieData>({
    queryKey: ["movies", type, currentPage],
    queryFn: () => fetchMoviesByType(type, currentPage),
  });

  const emoji =
    type === "popular" ? (
      <MdTrendingUp size={36} className="md:block hidden" />
    ) : type === "top_rated" ? (
      <MdStars size={34} className="md:block hidden" />
    ) : type === "upcoming" ? (
      <MdUpcoming size={36} className="md:block hidden" />
    ) : type === "hot_right_now" ? (
      <FaHotjar size={36} className="md:block hidden" />
    ) : (
      <MdLiveTv size={36} />
    );

  const sortOptions: SortOption[] = useMemo(
    () => [
      { id: "default", label: "Default", compareFn: () => 0 },
      {
        id: "title",
        label: "Title",
        compareFn: (a: Movie, b: Movie) => a.Title.localeCompare(b.Title),
      },
      {
        id: "year",
        label: "Release",
        compareFn: (a: Movie, b: Movie) => parseInt(b.Year) - parseInt(a.Year),
      },
      {
        id: "rating",
        label: "Rating",
        compareFn: (a: Movie, b: Movie) =>
          parseFloat(b.imdbRating || "0") - parseFloat(a.imdbRating || "0"),
      },
    ],
    []
  );

  const sortedMovies = useMemo(() => {
    if (!data?.movies?.length) return [];
    const compareFn =
      sortOptions.find((opt) => opt.id === sortBy)?.compareFn || (() => 0);
    return [...data.movies].sort(compareFn);
  }, [data?.movies, sortBy, sortOptions]);

  if (!isLoading && !data?.movies) {
    return (
      <Container size="xl">
        <Alert title="Error" color="red" variant="filled">
          Failed to load movies.
        </Alert>
      </Container>
    );
  }
  const shouldShowSkeleton = isLoading || isFetching;

  return (
    <Container size="xl" px="lg" pb="lg">
      <div className="flex justify-between items-center">
        <Title c="white" className="capitalize" py="md">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex md:text-3xl text-3xl md:pb-4 pb-8 md:ml-0 ml-3 flex-row gap-3 text-center"
          >
            <Center>{emoji}</Center>
            {type.replace(/_/g, " ")}
          </motion.span>
        </Title>
        <div className="md:block hidden">
          <Menu shadow="md" width={100}>
            <Menu.Target>
              <Button variant="ghost" bg="none" c="white" disabled={isFetching}>
                <Title>Sort</Title>
                <MdSort size={40} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort by</Menu.Label>
              {sortOptions.map((option) => (
                <Menu.Item key={option.id} onClick={() => setSortBy(option.id)}>
                  {option.label}
                  {sortBy === option.id}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          className="grid grid-cols-1 sm:grid-cols-2 xm:grid-cols-4 psm:grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-6"
          variants={container}
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {shouldShowSkeleton ? (
            Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                className="flex justify-center"
                variants={item}
              >
                <div className="group relative overflow-hidden sm:w-50 md:w-50 md:h-75 w-92 h-105 rounded-2xl md:mb-0 mb-5 cursor-pointer">
                  <SkeletonTheme
                    baseColor="gray"
                    borderRadius={16}
                    highlightColor="#444"
                  >
                    <div className="w-full h-full">
                      <Skeleton height="100%" />
                    </div>
                  </SkeletonTheme>
                </div>
              </motion.div>
            ))
          ) : sortedMovies.length > 0 ? (
            sortedMovies.map((movie: Movie) => (
              <motion.div
                key={movie.imdbID}
                layoutId={movie.imdbID}
                variants={item}
                transition={transitionSettings}
                className="flex justify-center"
              >
                <MovieCard movie={movie} />
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Center>No movies found</Center>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
      {!isLoading && data?.totalPages && data.totalPages > 1 && (
        <Group justify="center" mt="xl">
          <Pagination
            total={data.totalPages}
            value={currentPage}
            onChange={setCurrentPage}
            color="gray.7"
            radius="md"
            disabled={isFetching}
          />
        </Group>
      )}
    </Container>
  );
};

export default MovieList;
