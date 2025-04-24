import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Title,
  Alert,
  Center,
  Button,
  Menu,
  Loader,
} from "@mantine/core";
import { FaChartLine, FaStar } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { fetchMoviesByType } from "../../utils/fetchMovies";
import MovieCard from "./MovieCard";
import { Movie, MovieListProps, SortOption } from "../../types/types";
import { useState, useMemo, useCallback } from "react";
import { MdSort } from "react-icons/md";

const MovieList = ({ type }: MovieListProps) => {
  const [sortBy, setSortBy] = useState<string>("default");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", type],
    queryFn: () => fetchMoviesByType(type, 1),
    retry: false,
  });

  const emoji =
    type === "popular" ? (
      <FaChartLine size={28} className="md:block hidden" />
    ) : type === "top_rated" ? (
      <FaStar size={28} className="md:block hidden" />
    ) : (
      <FaRegCalendarAlt size={26} className="md:block hidden" />
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
        label: "Year",
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
        <Alert title="Error" color="red" variant="filled" className="mb-4">
          Failed to load movies.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="xl" px={100} py="md">
      <div className="flex justify-between items-center py-8 px-1">
        <Title className="font-bold text-white capitalize">
          <span className="flex md:text-3xl text-[17px] md:mt-0 mt-5 flex-row gap-3 text-center">
            <Center>{emoji}</Center>
            {type.replace("_", " ")} Movies
          </span>
        </Title>
        <div className="md:block hidden">
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="ghost" bg="none" c="white">
                <Title order={2}>Sort</Title> <MdSort size={35} />
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
      <div className="grid grid-cols-1 sm:grid-cols-2 xm:grid-cols-4 psm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading ? (
          <Center>
            <Loader />
          </Center>
        ) : sortedMovies.length > 0 ? (
          sortedMovies.map((movie: Movie) => (
            <div key={movie?.imdbID} className="flex justify-center">
              <MovieCard movie={movie} />
            </div>
          ))
        ) : (
          <div className="text-center">No movies found</div>
        )}
      </div>
    </Container>
  );
};

export default MovieList;
