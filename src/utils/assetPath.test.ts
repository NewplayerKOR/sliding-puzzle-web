import { describe, it, expect } from 'vitest';
import { getAssetUrl } from './assetPath';

describe('getAssetUrl', () => {
  it('returns clean asset path with base url', () => {
    const url1 = getAssetUrl('assets/icons/icon_reset.png');
    expect(url1).toBe('/assets/icons/icon_reset.png');

    const url2 = getAssetUrl('/assets/icons/icon_reset.png');
    expect(url2).toBe('/assets/icons/icon_reset.png');
  });

  it('handles nested audio, image and sprite paths correctly', () => {
    expect(getAssetUrl('/assets/audio/bgm_chill.wav')).toBe('/assets/audio/bgm_chill.wav');
    expect(getAssetUrl('assets/images/theme_nature.png')).toBe('/assets/images/theme_nature.png');
    expect(getAssetUrl('assets/sprites/sheet_ui_fx.css')).toBe('/assets/sprites/sheet_ui_fx.css');
  });
});
