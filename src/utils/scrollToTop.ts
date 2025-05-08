import { useEffect } from 'react';

export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
  });
};

export const useScrollToTop = (dependency:any) => {
  useEffect(() => {
    scrollToTop();
  }, [dependency]);
};