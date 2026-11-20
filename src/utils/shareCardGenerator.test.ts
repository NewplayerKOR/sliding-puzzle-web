import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { generateShareCardBlob, shareOrDownloadResult } from './shareCardGenerator';
import { resetGlobalLanguage } from '../i18n/useTranslation';

const shareContext = {
  gridSize: 3 as const,
  moveCount: 18,
  elapsedTime: 42,
  stars: 3,
  themeName: 'Nature',
  themeImageSrc: 'data:image/png;base64,theme',
};

let shouldImageLoad = true;

class MockImage {
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  crossOrigin = '';
  naturalWidth = 512;
  naturalHeight = 512;

  set src(_value: string) {
    if (!shouldImageLoad) return;
    queueMicrotask(() => this.onload?.());
  }
}

const createContextMock = () =>
  ({
    fillStyle: '',
    fillRect: vi.fn(),
    strokeStyle: '',
    lineWidth: 0,
    strokeRect: vi.fn(),
    font: '',
    textAlign: 'center',
    fillText: vi.fn(),
    save: vi.fn(),
    beginPath: vi.fn(),
    roundRect: vi.fn(),
    clip: vi.fn(),
    fill: vi.fn(),
    stroke: vi.fn(),
    drawImage: vi.fn(),
    restore: vi.fn(),
  }) as unknown as CanvasRenderingContext2D;

const installBlobMock = (blob: Blob | null) => {
  vi.spyOn(HTMLCanvasElement.prototype, 'toBlob').mockImplementation(function (
    callback: BlobCallback
  ) {
    callback(blob);
  });
};

const defineNavigatorValue = (key: string, value: unknown) => {
  Object.defineProperty(navigator, key, { value, configurable: true });
};

const clearNavigatorValue = (key: string) => {
  delete (navigator as unknown as Record<string, unknown>)[key];
};

describe('shareCardGenerator', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
    shouldImageLoad = true;
    vi.stubGlobal('Image', MockImage);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(createContextMock());
    installBlobMock(new Blob(['png'], { type: 'image/png' }));
  });

  afterEach(() => {
    cleanupNavigator();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  const cleanupNavigator = () => {
    clearNavigatorValue('canShare');
    clearNavigatorValue('share');
    clearNavigatorValue('clipboard');
  };

  const installShare = (impl: () => Promise<void>) => {
    const share = vi.fn(impl);
    defineNavigatorValue('canShare', vi.fn(() => true));
    defineNavigatorValue('share', share);
    return share;
  };

  it('does not fall back to clipboard or download when the user cancels the share sheet', async () => {
    const share = installShare(() =>
      Promise.reject(new DOMException('Share canceled', 'AbortError'))
    );
    const clipboardWrite = vi.fn().mockResolvedValue(undefined);
    defineNavigatorValue('clipboard', { write: clipboardWrite });
    const createObjectUrl = vi.fn(() => 'blob:test');
    vi.stubGlobal('ClipboardItem', class {});
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectUrl,
      configurable: true,
    });
    const onNotify = vi.fn();

    await shareOrDownloadResult(shareContext, onNotify);

    expect(share).toHaveBeenCalledTimes(1);
    expect(clipboardWrite).not.toHaveBeenCalled();
    expect(createObjectUrl).not.toHaveBeenCalled();
    expect(onNotify).not.toHaveBeenCalled();
  });

  it('falls back to clipboard for a real share failure and reports success', async () => {
    installShare(() => Promise.reject(new Error('share failed')));
    const clipboardWrite = vi.fn().mockResolvedValue(undefined);
    defineNavigatorValue('clipboard', { write: clipboardWrite });
    vi.stubGlobal('ClipboardItem', class {});
    const onNotify = vi.fn();

    await shareOrDownloadResult(shareContext, onNotify);

    expect(clipboardWrite).toHaveBeenCalledTimes(1);
    expect(onNotify).toHaveBeenCalledWith('결과 카드가 클립보드에 복사되었습니다!');
  });

  it('downloads with a delayed object URL cleanup when clipboard copy fails', async () => {
    vi.useFakeTimers();
    installShare(() => Promise.reject(new Error('share failed')));
    defineNavigatorValue('clipboard', {
      write: vi.fn().mockRejectedValue(new Error('blocked')),
    });
    vi.stubGlobal('ClipboardItem', class {});
    const createObjectUrl = vi.fn(() => 'blob:test');
    const revokeObjectUrl = vi.fn();
    Object.defineProperty(URL, 'createObjectURL', {
      value: createObjectUrl,
      configurable: true,
    });
    Object.defineProperty(URL, 'revokeObjectURL', {
      value: revokeObjectUrl,
      configurable: true,
    });
    const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
    const onNotify = vi.fn();

    await shareOrDownloadResult(shareContext, onNotify);
    await vi.runAllTicks();

    expect(clickSpy).toHaveBeenCalledTimes(1);
    expect(revokeObjectUrl).not.toHaveBeenCalled();
    expect(onNotify).toHaveBeenCalledWith('결과 카드가 이미지 파일로 다운로드되었습니다!');

    vi.advanceTimersByTime(1000);
    expect(revokeObjectUrl).toHaveBeenCalledWith('blob:test');
  });

  it('reports a failure when the result card blob cannot be created', async () => {
    installBlobMock(null);
    const onNotify = vi.fn();

    await shareOrDownloadResult(shareContext, onNotify);

    expect(onNotify).toHaveBeenCalledWith('결과 카드를 만들지 못했습니다. 다시 시도해 주세요.');
  });

  it('resolves the card after the theme image timeout instead of waiting forever', async () => {
    vi.useFakeTimers();
    shouldImageLoad = false;
    const promise = generateShareCardBlob(shareContext);

    await vi.advanceTimersByTimeAsync(3000);
    const blob = await promise;

    expect(blob).not.toBeNull();
  });
});
