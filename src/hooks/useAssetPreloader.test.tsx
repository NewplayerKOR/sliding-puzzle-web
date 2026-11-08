import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, renderHook, waitFor } from '@testing-library/react';
import { useAssetPreloader } from './useAssetPreloader';
import { preloadCoreAssets } from '../utils/assetPreloader';

vi.mock('../utils/assetPreloader', () => ({
  CORE_IMAGE_ASSETS: ['/assets/a.png', '/assets/b.png'],
  preloadCoreAssets: vi.fn().mockResolvedValue([]),
}));

const mockedPreloadCoreAssets = vi.mocked(preloadCoreAssets);

describe('useAssetPreloader', () => {
  beforeEach(() => {
    mockedPreloadCoreAssets.mockClear();
    mockedPreloadCoreAssets.mockResolvedValue([]);
  });

  afterEach(() => {
    cleanup();
  });

  it('preloads core assets with the current theme and reloads when the theme changes', async () => {
    const { result, rerender } = renderHook(
      ({ themeId }: { themeId: 'nature' | 'animal' }) => useAssetPreloader(themeId),
      { initialProps: { themeId: 'nature' } }
    );

    await waitFor(() => expect(result.current.isLoaded).toBe(true));
    expect(mockedPreloadCoreAssets).toHaveBeenCalledWith('nature');
    expect(result.current.totalAssets).toBe(3);

    rerender({ themeId: 'animal' });

    await waitFor(() => expect(mockedPreloadCoreAssets).toHaveBeenCalledWith('animal'));
  });
});
