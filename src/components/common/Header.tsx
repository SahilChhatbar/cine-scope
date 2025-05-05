import React, { useState } from "react";
import { NavLink, useNavigate, useSearchParams } from "react-router-dom";
import {
  Autocomplete,
  Burger,
  Flex,
  Group,
  Stack,
  Button,
  Divider,
} from "@mantine/core";
import { Spotlight, SpotlightActionData, spotlight } from "@mantine/spotlight";
import { MdSearch } from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { HeaderProps, NavLinkItem, Movie } from "../../types/types";
import { useQuery } from "@tanstack/react-query";
import { tmdbApi } from "../../api/tmdb";
import { useDebouncedValue } from "@mantine/hooks";
import { links } from "../../constants";

const Header: React.FC<HeaderProps> = () => {
  const [opened, { toggle }] = useDisclosure(false);
  const [searchParams] = useSearchParams();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch] = useDebouncedValue(searchValue, 800);
  const navigate = useNavigate();

  const { data: searchResults } = useQuery({
    queryKey: ["movieSearch", debouncedSearch],
    queryFn: () => tmdbApi.searchMovies(debouncedSearch),
    enabled: debouncedSearch.length > 0,
  });

  const items = links.map((link: NavLinkItem) => (
    <NavLink
      key={link.label}
      to={`${link.link}${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`}
      className={({ isActive }: { isActive: boolean }) =>
        isActive
          ? "flex items-center gap-2 py-2 px-5 transition-all duration-250 text-white hover:drop-shadow-[0_0_0.5em_#61dafbaa] font-medium lg:text-xl"
          : "flex items-center gap-2 py-2 px-5 transition-all duration-250 text-gray-500 hover:drop-shadow-[0_0_0.5em_#61dafbaa] font-medium lg:text-xl"
      }
    >
      {link.label}
    </NavLink>
  ));

  const navigationActions: SpotlightActionData[] = links.map((link) => ({
    id: link.label.toLowerCase().replace(" ", "_"),
    label: link.label,
    description: link.description,
    onClick: () => navigate(link.link),
  }));


  const allActions = [...navigationActions];

  const handleSearchSelect = (movieId: string) => {
    navigate(`/movie/${movieId}`);
  };

  return (
    <header className="h-fit p-2 shadow-2xl bg-gradient-to-r from-[#191a1b] via-slate-900 to-[#191a1b]">
      <Flex justify="space-evenly" align="center" h={60}>
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            hiddenFrom="lg"
            color="white"
            className="text-gray-200"
          />
          <NavLink to="/" className="flex gap-2 items-center">
            <BiCameraMovie className="md:h-9 md:w-9 h-7 w-7 text-white" />
            <span className="font-mono md:text-3xl text-2xl font-bold text-white">
              CineScope
            </span>
          </NavLink>
        </Group>
        <Group align="center">
          <Group gap={5} visibleFrom="lg">
            {items}
          </Group>
          <div className="hidden sm:flex">
            <Button color="#1e293b" onClick={spotlight.open} radius={10}>
              Find
              <Divider orientation="vertical" mx={8} my={8} />
              <Group gap={8}>
                <span className="border p-1 rounded-[.3rem] font-mono">CTRL</span>
                <span className="border p-1 rounded-[.3rem] font-mono">K</span>
              </Group>
            </Button>
            <Spotlight
              actions={allActions}
              nothingFound="Nothing found..."
              highlightQuery
              searchProps={{
                leftSection: <MdSearch size={20} />,
                placeholder: "Take me to...",
              }}
              styles={{
                content: {
                  display: "flex",
                  flexDirection: "column",
                  padding: "1rem",
                  backgroundColor: "#1e293b",
                },
                action: {
                  width: "100%",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  padding: "0.5rem",
                },
                actionLabel: {
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  display: "block",
                },
                actionDescription: {
                  fontSize: "1rem",
                  color: "#94a3b8",
                  display: "block",
                  width: "100%",
                  fontStyle:"italic"
                }
              }}
            />
          </div>
          <Autocomplete
            radius={10}
            placeholder="Search movies..."
            value={searchValue}
            aria-label="input"
            rightSection={<MdSearch size={20} color="white" />}
            className="md:w-38 w-40"
            styles={{
              input: {
                backgroundColor: "#1e293b",
                border: "none",
                color: "white",
              },
            }}
            onChange={setSearchValue}
            data={
              searchResults?.movies.map((movie: Movie) => ({
                value: movie?.imdbID,
                label: `${movie?.Title} (${movie?.Year})`,
              })) || []
            }
            onOptionSubmit={handleSearchSelect}
          />
        </Group>
      </Flex>
      {opened && (
        <Stack className="xl:hidden px-2 pt-2 pb-3 border-t border-gray-200 bg-slate-900">
          {links.map((link: NavLinkItem) => (
            <NavLink
              key={link.label}
              to={link.link}
              className={({ isActive }: { isActive: boolean }) =>
                isActive
                  ? "block py-2 px-3 rounded text-white font-medium text-sm bg-slate-800"
                  : "block py-2 px-3 rounded text-gray-300 font-medium text-sm hover:bg-slate-800"
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
