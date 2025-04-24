import { AppShell } from "@mantine/core";
import { Outlet } from "react-router-dom";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const Appshell = () => {
  return (
    <AppShell
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
      <AppShell.Main className="bg-slate-900">
        <div className="min-h-full w-full md:bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 rounded-3xl md:p-8">
          <Outlet />
        </div>
      </AppShell.Main>
      <AppShell.Footer bd="none" pos="static">
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
};

export default Appshell;
