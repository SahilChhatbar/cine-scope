import { Group, Title } from "@mantine/core";
import { FaImdb } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="h-fit bg-gradient-to-r from-gray-700 via-slate-900 to-gray-700 text-white px-4">
      <Group justify="space-around" align="center" h={60}>
        <Title size="lg" fw={600} className="flex items-center">
          Your one stop destination for all things movies. Inspired by<span className="px-2"><FaImdb size={40} color="#FFFF00"/></span>
        </Title>
      </Group>
    </footer>
  );
};

export default Footer;
