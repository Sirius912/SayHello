import { useState, useEffect } from 'react';
import { loadFonts } from '../utils/fontLoader';

export default function useFonts() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await loadFonts();
      setFontsLoaded(true);
    })();
  }, []);

  return fontsLoaded;
}
