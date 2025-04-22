import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";

const Appshell = () => {
  return (
    <AppShell
      layout="alt"
      h="97%"
      header={{
        height: {
          md: 60,
        },
      }}
      padding="lg"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main className="bg-slate-900 ">
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};

export default Appshell;
