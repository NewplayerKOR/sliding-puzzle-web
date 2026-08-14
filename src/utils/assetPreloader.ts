import { THEME_LIST } from './themeData';
import { getAssetUrl } from './assetPath';

export const SPRITE_ASSETS = [
  'assets/sprites/ui_icons_spritesheet.png',
  'assets/sprites/fx_animations_spritesheet.png',
  'assets/sprites/sheet_ui_fx.png',
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

export const THEME_ASSETS = THEME_LIST.map((theme) => theme.imagePath);

export const ALL_IMAGE_ASSETS = [...SPRITE_ASSETS, ...ICON_ASSETS, ...THEME_ASSETS];

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

/**
 * Preload all theme images and spritesheets in background
 */
export async function preloadAllAssets(): Promise<HTMLImageElement[]> {
  const promises = ALL_IMAGE_ASSETS.map((url) => preloadImage(url));
  return Promise.all(promises);
}

/**
 * Check if all primary assets are cached
 */
export function isAssetsLoaded(): boolean {
  return ALL_IMAGE_ASSETS.every((url) => imageCache.has(url));
}

