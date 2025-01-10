import { useState, useEffect } from 'react';

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);
  const [mediaQuery, setMediaQuery] = useState<MediaQueryList | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(query);
    setMediaQuery(mq);
    setMatches(mq.matches);

    const handler = (e: MediaQueryListEvent) => {
      console.log("Media query changed:", e.matches);
      setMatches(e.matches);
    };

    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [query]);

  // Clean up mediaQuery on unmount
  useEffect(() => {
    return () => {
      if (mediaQuery) {
        setMediaQuery(null);
      }
    };
  }, [mediaQuery]);

  return matches;
}