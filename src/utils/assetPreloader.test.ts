import { describe, it, expect, vi, beforeEach } from 'vitest';
import { preloadImage, preloadAllAssets, ALL_IMAGE_ASSETS } from './assetPreloader';

describe('assetPreloader', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('contains all themes, spritesheets and icons in ALL_IMAGE_ASSETS', () => {
    expect(ALL_IMAGE_ASSETS).toHaveLength(21);
    expect(ALL_IMAGE_ASSETS).toContain('/assets/sprites/ui_icons_spritesheet.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/sprites/fx_animations_spritesheet.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/sprites/sheet_ui_fx.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/icons/stars_3.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/icons/badge_trophy.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/icons/icon_sound_on.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/icons/icon_theme_selector.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/images/theme_nature.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/images/theme_pixel_art.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/images/theme_abstract.png');
    expect(ALL_IMAGE_ASSETS).toContain('/assets/images/theme_animal.png');
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

