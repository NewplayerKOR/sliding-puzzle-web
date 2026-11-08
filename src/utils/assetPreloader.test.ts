import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  preloadImage,
  preloadAllAssets,
  preloadCoreAssets,
  preloadAllThemeAssets,
  ALL_IMAGE_ASSETS,
  CORE_IMAGE_ASSETS,
  THEME_ASSETS,
} from './assetPreloader';

describe('assetPreloader', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('keeps theme images out of the core startup set', () => {
    expect(CORE_IMAGE_ASSETS).toHaveLength(0);
    expect(THEME_ASSETS).toHaveLength(4);
    expect(ALL_IMAGE_ASSETS).toHaveLength(4);

    expect(ALL_IMAGE_ASSETS).toEqual(
      expect.arrayContaining([
        '/assets/images/theme_nature.png',
        '/assets/images/theme_pixel_art.png',
        '/assets/images/theme_abstract.png',
        '/assets/images/theme_animal.png',
      ])
    );
    expect(CORE_IMAGE_ASSETS).not.toContain('/assets/images/theme_nature.png');
  });

  it('loads only core images and the selected theme on initial load', async () => {
    const loadedUrls: string[] = [];
    global.Image = class {
      onload: (() => void) | null = null;
      onerror: ((err: unknown) => void) | null = null;
      complete = false;
      private _src = '';
      get src() {
        return this._src;
      }
      set src(value: string) {
        this._src = value;
        loadedUrls.push(value);
        setTimeout(() => {
          this.complete = true;
          if (this.onload) this.onload();
        }, 0);
      }
    } as unknown as typeof Image;

    const results = await preloadCoreAssets('animal');

    expect(results).toHaveLength(CORE_IMAGE_ASSETS.length + 1);
    expect(loadedUrls).toContain('/assets/images/theme_animal.png');
    expect(loadedUrls).not.toContain('/assets/images/theme_nature.png');
    expect(loadedUrls).not.toContain('/assets/images/theme_pixel_art.png');
    expect(loadedUrls).not.toContain('/assets/images/theme_abstract.png');
  });

  it('preloads an image successfully', async () => {
    global.Image = class {
      onload = null;
      onerror = null;
      src = '';
      complete = false;
      constructor() {
        setTimeout(() => {
          this.complete = true;
          if (this.onload) (this.onload as any)();
        }, 10);
        return this;
      }
    } as any;

    const result = await preloadImage('/assets/images/theme_nature.png');
    expect(result).toBeDefined();
    expect(result.src).toContain('/assets/images/theme_nature.png');
  });

  it('preloads all assets without throwing', async () => {
    const results = await preloadAllAssets();
    expect(results).toHaveLength(ALL_IMAGE_ASSETS.length);
  });

  it('preloads all theme images only when requested', async () => {
    const results = await preloadAllThemeAssets();
    expect(results).toHaveLength(THEME_ASSETS.length);
  });

  it('handles 404 image load error gracefully without crashing', async () => {
    global.Image = class {
      onload = null;
      onerror = null;
      src = '';
      complete = false;
      constructor() {
        setTimeout(() => {
          if (this.onerror) (this.onerror as any)(new Error('404 Not Found'));
        }, 10);
        return this;
      }
    } as any;

    const result = await preloadImage('/assets/icons/non_existent.png');
    expect(result).toBeDefined();
  });
});
