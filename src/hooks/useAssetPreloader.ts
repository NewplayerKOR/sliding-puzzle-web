import { useState, useEffect } from 'react';
import { preloadAllAssets, ALL_IMAGE_ASSETS } from '../utils/assetPreloader';

export interface UseAssetPreloaderReturn {
  isLoaded: boolean;
  totalAssets: number;
}

export function useAssetPreloader(): UseAssetPreloaderReturn {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    preloadAllAssets().then(() => {
      if (isMounted) {
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoaded,
    totalAssets: ALL_IMAGE_ASSETS.length,
  };
}
