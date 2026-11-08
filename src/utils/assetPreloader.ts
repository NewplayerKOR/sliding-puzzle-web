import { THEMES, THEME_LIST, DEFAULT_THEME_ID } from './themeData';
import { getAssetUrl } from './assetPath';
import type { ThemeId } from '../types/theme';

export const SPRITE_ASSETS = [
  'assets/sprites/ui_icons_spritesheet.png',
  'assets/sprites/fx_animations_spritesheet.png',
].map(getAssetUrl);

export const ICON_ASSETS = [
  'assets/icons/icon_sound_on.png',
  'assets/icons/icon_sound_off.png',
  'assets/icons/icon_pause.png',
  'assets/icons/icon_play.png',
  'assets/icons/icon_reset.png',
  'assets/icons/icon_hint.png',
  'assets/icons/icon_number_toggle.png',
  'assets/icons/icon_theme_selector.png',
  'assets/icons/ui_empty_slot_glow.png',
  'assets/icons/badge_trophy.png',
  'assets/icons/stars_0.png',
  'assets/icons/stars_1.png',
  'assets/icons/stars_2.png',
  'assets/icons/stars_3.png',
].map(getAssetUrl);

// 최초 화면에 필요한 코어 이미지. 테마 이미지는 현재 테마만 별도로 더함.
export const CORE_IMAGE_ASSETS = [...SPRITE_ASSETS, ...ICON_ASSETS];
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
