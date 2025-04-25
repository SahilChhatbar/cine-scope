import { Group, Title } from "@mantine/core";

const Footer = () => {
  return (
    <footer className="h-fit bg-gradient-to-r from-gray-800 via-slate-900 to-gray-800 text-white px-4">
      <Group justify="space-around" align="center" h={60}>
        <Title size="lg" fw={600} className="flex items-center">
          Your one stop destination for all things movies. Inspired by IMDB.
        </Title>
      </Group>
    </footer>
  );
};

export default Footer;
