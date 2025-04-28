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
      padding="xl"
    >
      <AppShell.Header>
        <Header />
      </AppShell.Header>
      <AppShell.Main className="bg-slate-900 bg-[radial-gradient(circle_at_10%_20%,rgba(21,94,117,0.1),transparent_50%),radial-gradient(circle_at_90%_60%,rgba(128,0,128,0.08),transparent_50%)]">
        <div className="min-h-full w-full md:max-w-7xl md:mx-auto md:bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800 md:px-8 rounded-3xl md:shadow-2xl md:shadow-black/50 bg-[linear-gradient(180deg,rgba(30,41,59,0)_0%,rgba(15,23,42,0.8)_100%),url('data:image/svg+xml,%3Csvg width=%2760%27 height=%2760%27 viewBox=%270 0 60 60%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cg fill=%27none%27 fill-rule=%27evenodd%27%3E%3Cg fill=%27%23334155%27 fill-opacity=%270.05%27%3E%3Cpath d=%27M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%27/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]">
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
