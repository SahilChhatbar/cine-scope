import { Variants } from "framer-motion";
import { NavLinkItem } from "./types/types";

export const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  export const transitionSettings = {
    type: "spring",
    stiffness: 300,
    damping: 30,
  };

  export const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  
  export const youtubeUrl="https://www.youtube.com/watch?v";

  export const links: NavLinkItem[] = [
    { 
      link: "/", 
      label: "Home",
      description: "Discover trending movies right now and dive into the stories everyone is talking about." 
    },
    { 
      link: "/popular", 
      label: "Popular",
      description: "Browse the most popular movies that are capturing hearts worldwide and dominating the box office." 
    },
    { 
      link: "/upcoming", 
      label: "Upcoming",
      description: "See what exciting new movies are coming soon—stay ahead of the buzz and mark your calendars." 
    },
    { 
      link: "/toprated", 
      label: "Top Rated",
      description: "Explore the highest rated movies of all time, from timeless classics to modern masterpieces." 
    },
    { 
      link: "/now_playing", 
      label: "Now Playing",
      description: "Find movies currently playing in theaters and experience the magic of cinema in real-time." 
    },
  ];

  export  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.8, 
        ease: "easeOut",
        delay: 0.5  
      }
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3 }
    }
  };
  
  export const popularGenres = [
    { id: 28, name: "Action" },
    { id: 35, name: "Comedy" },
    { id: 18, name: "Drama" },
    { id: 27, name: "Horror" },
    { id: 10749, name: "Romance" },
    { id: 878, name: "Science Fiction" },
  ]as const;
  