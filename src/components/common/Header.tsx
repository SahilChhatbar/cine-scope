import React from "react";
import { NavLink } from "react-router-dom";
import { Burger, Flex, Group, Stack, TextInput } from "@mantine/core";
import { MdSearch } from "react-icons/md";
import { BiCameraMovie } from "react-icons/bi";
import { useDisclosure } from "@mantine/hooks";
import { HeaderProps, NavLinkItem } from "../../types/types";

const links: NavLinkItem[] = [
  { link: "/popular", label: "Popular" },
  { link: "/upcoming", label: "Upcoming" },
  { link: "/toprated", label: "Top Rated" },
];

const Header: React.FC<HeaderProps> = () => {
  const [opened, { toggle }] = useDisclosure(false);

  const items = links.map((link: NavLinkItem) => (
    <NavLink
      key={link.label}
      to={link.link}
      className={({ isActive }: { isActive: boolean }) =>
        isActive
          ? "block leading-none py-2 px-3 transition-all text-white hover:drop-shadow-[0_0_1em_#61dafbaa] font-medium text-lg "
          : "block leading-none py-2 px-3 transition-all text-gray-400 hover:drop-shadow-[0_0_1em_#61dafbaa] font-medium text-lg "
      }
    >
      {link.label}
    </NavLink>
  ));

  return (
    <header className="h-fit bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
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
          <NavLink to="/" className="flex items-center">
            <BiCameraMovie className={`h-9 w-9 text-indigo-500`} />
            <span className="text-2xl font-bold text-white font-mono">
              CineScope
            </span>
          </NavLink>
        </Group>
        <Group align="center">
          <Group gap={5} visibleFrom="sm">
            {items}
          </Group>
          <Group className="relative">
            <TextInput
              className="w-52"
              placeholder="Search movies..."
              visibleFrom="xs"
              unstyled
              classNames={{
                input:
                  "bg-gray-900 text-white placeholder-gray-400 border border-gray-700 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                root: "rounded",
              }}
            />
            <MdSearch
              size={20}
              className="absolute top-2 right-4 text-gray-400"
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
                  ? "block py-2 px-3 rounded text-slate-900 font-medium text-sm bg-gray-100 "
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
