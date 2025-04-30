import { useQuery } from "@tanstack/react-query";
import { Container, Title, Alert, Center, Button, Menu } from "@mantine/core";
import { FaChartLine, FaStar } from "react-icons/fa6";
import { FaHotjar, FaRegCalendarAlt, FaRegDotCircle } from "react-icons/fa";
import { fetchMoviesByType } from "../../utils/fetchMovies";
import MovieCard from "./MovieCard";
import { Movie, MovieListProps, SortOption } from "../../types/types";
import { useState, useMemo, useCallback } from "react";
import { MdSort } from "react-icons/md";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const MovieList = ({ type }: MovieListProps) => {
  const [sortBy, setSortBy] = useState<string>("default");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", type],
    queryFn: () => fetchMoviesByType(type, 1),
    retry: false,
  });
  const emoji =
    type === "popular" ? (
      <FaChartLine size={26} className="md:block hidden" />
    ) : type === "top_rated" ? (
      <FaStar size={26} className="md:block hidden" />
    ) : type === "upcoming" ? (
      <FaRegCalendarAlt size={24} className="md:block hidden" />
    ) : type === "hot_right_now" ? (
      <FaHotjar size={26} className="md:block hidden" />
    ) : (
      <FaRegDotCircle size={26} />
    );

  const sortOptions: SortOption[] = useMemo(
    () => [
      {
        id: "default",
        label: "Default",
        compareFn: () => 0,
      },
      {
        id: "title",
        label: "Title",
        compareFn: (a: Movie, b: Movie) => a.Title.localeCompare(b.Title),
      },
      {
        id: "year",
        label: "Release",
        compareFn: (a, b) =>
          parseInt(String(b.Year)) - parseInt(String(a.Year)),
      },
      {
        id: "rating",
        label: "Rating",
        compareFn: (a, b) =>
          parseFloat(String(b.imdbRating)) - parseFloat(String(a.imdbRating)),
      },
    ],
    []
  );

  const getSortFunction = useCallback(() => {
    return (
      sortOptions.find((option) => option.id === sortBy)?.compareFn || (() => 0)
    );
  }, [sortBy, sortOptions]);

  const sortedMovies = useMemo(() => {
    if (!data?.movies || !Array.isArray(data.movies)) return [];

    return [...data.movies].sort(getSortFunction());
  }, [data?.movies, getSortFunction]);

  const handleSortChange = useCallback((sortId: string) => {
    setSortBy(sortId);
  }, []);

  if (!data?.movies && !isLoading) {
    return (
      <Container size="xl">
        <Alert title="Error" color="red" variant="filled">
          Failed to load movies.
        </Alert>
      </Container>
    );
  }
  return (
    <Container size="xl" px="xl" pb="xl">
      <div className="flex justify-between md:py-5 px-2 items-center">
        <Title c="white" className="capitalize">
          <span className="flex md:text-3xl text-3xl md:pb-4 pb-8  md:ml-0 ml-3 flex-row gap-3 text-center">
            <Center>{emoji}</Center>
            {type.replace(/_/g, " ")}
          </span>
        </Title>
        <div className="md:block hidden">
          <Menu shadow="md" width={100} position={{ top: 0, right: 0 }}>
            <Menu.Target>
              <Button variant="ghost" bg="none" c="white">
                <Title>Sort</Title>
                <MdSort size={40} />
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label>Sort by</Menu.Label>
              {sortOptions.map((option) => (
                <Menu.Item
                  key={option.id}
                  onClick={() => handleSortChange(option.id)}
                >
                  {option.label}
                  {sortBy === option.id}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xm:grid-cols-4 psm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
        {isLoading ? (
          Array.from({ length: 20 }).map((_, index) => (
            <div key={index} className="flex justify-center">
              <div className="group relative overflow-hidden xm:w-50 xm:h-75 sm:w-50 md:w-50 md:h-75 w-92 h-105 rounded-xl md:mb-0 mb-5">
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
            </div>
          ))
        ) : sortedMovies.length > 0 ? (
          sortedMovies.map((movie: Movie) => (
            <div key={movie?.imdbID} className="flex justify-center">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <Center>No movies found</Center>
        )}
      </div>
    </Container>
  );
};

export default MovieList;
