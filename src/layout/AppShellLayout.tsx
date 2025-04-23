import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

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
      <AppShell.Main className="bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900">
        <Outlet />
      </AppShell.Main>
      <AppShell.Footer bd="none" pos="static">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Appshell;
