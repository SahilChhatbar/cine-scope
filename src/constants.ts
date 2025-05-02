import { Variants } from "framer-motion";

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