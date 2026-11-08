import { useState, useEffect } from 'react';
import { preloadCoreAssets, CORE_IMAGE_ASSETS } from '../utils/assetPreloader';
import { DEFAULT_THEME_ID } from '../utils/themeData';
import type { ThemeId } from '../types/theme';

export interface UseAssetPreloaderReturn {
  isLoaded: boolean;
  totalAssets: number;
}

export function useAssetPreloader(themeId: ThemeId = DEFAULT_THEME_ID): UseAssetPreloaderReturn {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // 코어 이미지와 현재 테마만 먼저 로드하고 나머지 테마는 지연 로드함
    preloadCoreAssets(themeId).then(() => {
      if (isMounted) {
        setIsLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [themeId]);

  return {
    isLoaded,
    totalAssets: CORE_IMAGE_ASSETS.length + 1,
  };
}
