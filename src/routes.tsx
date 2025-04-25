import { createBrowserRouter } from "react-router-dom";
import AppShellLayout from "./layout/AppShellLayout";
import Home from "./pages/home/index";
import TopRated from "./pages/top rated/index";
import Upcoming from "./pages/upcoming/index";
import Popular from "./pages/popular/index";
import MovieDetail from "./components/common/MovieDetail";
import NowPlaying from "./pages/now playing";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShellLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/toprated",  
        element: <TopRated />,
      },
      {
        path: "/popular",
        element: <Popular />,
      },
      {
        path: "/upcoming",
        element: <Upcoming />,
      },
      {
        path: "/now_playing",
        element: <NowPlaying />,
      },
      {
        path: "/movie/:movieId",
        element: <MovieDetail />,
      },
      
    ],
  },
]);
