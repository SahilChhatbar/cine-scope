import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Autocomplete, Burger, Flex, Group, Stack } from "@mantine/core";
import { MdSearch } from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { HeaderProps, NavLinkItem, Movie } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../../api/tmdb";
import { useDebouncedValue } from "@mantine/hooks";

const links: NavLinkItem[] = [
  { link: "/popular", label: "Popular" },
  { link: "/upcoming", label: "Upcoming" },
  { link: "/toprated", label: "Top Rated" },
];

const Header: React.FC<HeaderProps> = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 500);
  const navigate = useNavigate();

  const { data: searchResults } = useQuery({
    queryKey: ["movieSearch", debouncedSearch],
    queryFn: () => tmdbApi.searchMovies(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const items = links.map((link: NavLinkItem) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={({ isActive }: { isActive: boolean }) =>
        isActive
          ? "block leading-none py-2 px-3 transition-all duration-400 text-white hover:drop-shadow-[0_0_0.5em_#61dafbaa] font-medium text-lg"
          : "block leading-none py-2 px-3 transition-all duration-400 text-gray-400 hover:drop-shadow-[0_0_0.5em_#61dafbaa] font-medium text-lg"
      }
    >
      {link.label}
    </NavLink>
  ));

  const handleSearchSelect = (movieId: string) => {
    setSearchValue("");
    navigate(`/movie/${movieId}`);
  };

  return (
    <header className="h-fit bg-gradient-to-r p-2 from-slate-900 via-indigo-900 to-slate-900">
      <Flex justify="space-around" align="center" h={60}>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="sm"
            color="white"
            className="text-gray-200"
          />
          <NavLink to="/" className="flex gap-2 items-center">
            <BiCameraMovie className={`md:h-9 md:w-9 text-white`} />
            <span className="font-mono md:text-3xl font-bold text-white">
              CineScope
            </span>
          </NavLink>
        </Group>
        <Group align="center">
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Group className="relative">
            <Autocomplete
              className="md:block md:w-52 hidden"
              placeholder="Search movies..."
              value={searchValue}
              onChange={setSearchValue}
              data={searchResults?.movies.map((movie: Movie) => ({
                value: movie?.imdbID,
                label: `${movie?.Title} (${movie?.Year})`,
              })) || []}
              onOptionSubmit={handleSearchSelect}
              styles={{
                input: {
                  backgroundColor: "#1D0555",
                  color: "white",
                  border: "1px solid #1B005B",
                  borderRadius: "0.5rem",
                },
              }}
            />
            <MdSearch
              size={20}
              className="absolute top-2 right-4 text-gray-400 md:block hidden"
            />
          </Group>
        </Group>
      </Flex>
      {opened && (
        <Stack className="sm:hidden px-2 pt-2 pb-3 border-t border-gray-200  bg-white ">
          {links.map((link: NavLinkItem) => (
            <NavLink
              key={link.label}
              to={link.link}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "block py-2 px-3 rounded text-slate-900 font-medium text-sm bg-gray-100"
                  : "block py-2 px-3 rounded text-gray-700 font-medium text-sm hover:bg-gray-100 "
              }
              onClick={() => opened && toggle()}
            >
              {link.label}
            </NavLink>
          ))}
        </Stack>
      )}
    </header>
  );
};

export default Header;