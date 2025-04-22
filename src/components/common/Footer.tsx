import { Group, Text } from "@mantine/core"

const Footer = () => {
  return (
    <footer className="h-fit bg-gradient-to-r from-slate-900 text-white to-gray-800 px-4">
        <Group justify="space-around" align="center" h={60}>
          <Text size="lg" fw={600} className="flex items-center">
        Your one stop destination for all things movies. Explore, discover, and enjoy the world of cinema with us.
        </Text>
        </Group>
    </footer>
  )
}

export default Footer