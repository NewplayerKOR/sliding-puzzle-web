import { THEMES, THEME_LIST, DEFAULT_THEME_ID } from './themeData';
import type { ThemeId } from '../types/theme';

// UI 아이콘은 lucide로 통일되어 코어 PNG 프리로드 대상이 없음
export const CORE_IMAGE_ASSETS: string[] = [];
export const THEME_ASSETS = THEME_LIST.map((theme) => theme.imagePath);
export const ALL_IMAGE_ASSETS = [...CORE_IMAGE_ASSETS, ...THEME_ASSETS];

// Global Image Cache to prevent garbage collection of loaded images
const imageCache: Map<string, HTMLImageElement> = new Map();

/**
 * Preload a single image URL into browser cache
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve({} as HTMLImageElement);
      return;
    }

    if (imageCache.has(url)) {
      const cached = imageCache.get(url)!;
      if (cached.complete) {
        resolve(cached);
        return;
      }
    }

    const img = new Image();
    img.src = url;

    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };

    img.onerror = (err) => {
      // Don't fail the whole app on 404/error, log warning and resolve fallback
      console.warn(`[AssetPreloader] 404 Not Found or load failed: ${url}`, err);
      resolve(img);
    };
  });
}

export function preloadImages(urls: string[]): Promise<HTMLImageElement[]> {
  return Promise.all(urls.map((url) => preloadImage(url)));
}

/**
 * 최초 로드 시 코어 이미지와 현재 테마 이미지만 로드함.
 * 나머지 테마는 테마 모달을 열거나 테마를 선택할 때 지연 로드함.
 */
export function preloadCoreAssets(themeId: ThemeId = DEFAULT_THEME_ID): Promise<HTMLImageElement[]> {
  const theme = THEMES[themeId] || THEMES[DEFAULT_THEME_ID];
  return preloadImages([...CORE_IMAGE_ASSETS, theme.imagePath]);
}

/**
 * 테마 모달의 미리보기처럼 모든 테마 이미지가 필요할 때만 호출함.
 */
export function preloadAllThemeAssets(): Promise<HTMLImageElement[]> {
  return preloadImages(THEME_ASSETS);
}

/**
 * 모든 이미지를 명시적으로 미리 로드해야 하는 특수한 경우에만 사용함.
 */
export function preloadAllAssets(): Promise<HTMLImageElement[]> {
  return preloadImages(ALL_IMAGE_ASSETS);
}

/**
 * Check if all primary assets are cached
 */
export function isAssetsLoaded(): boolean {
  return CORE_IMAGE_ASSETS.every((url) => imageCache.has(url));
}
