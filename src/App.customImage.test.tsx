import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const CUSTOM_IMAGE_KEY = 'sliding_puzzle_custom_image';
const APPLIED_DATA_URL = 'data:image/png;base64,applied-image';

// 다른 테스트 파일의 localStorage.clear()와 간섭하지 않도록 파일 단위로 격리함
const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, String(value));
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    get length() {
      return store.size;
    },
  };
};

const startStandardGame = () => {
  fireEvent.click(screen.getByText(/게임 시작 \(4×4\)/i));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const applyCustomImage = async () => {
  fireEvent.click(screen.getByText('내 사진'));
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(fileInput, {
    target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
  });
  fireEvent.click(await screen.findByText('퍼즐로 적용하기'));
};

const openThemeModal = () => fireEvent.click(screen.getByTitle('테마 선택'));
const closeThemeModal = () => fireEvent.click(screen.getByLabelText('닫기'));

describe('App custom image preservation', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    resetGlobalLanguage();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      clearRect: vi.fn(),
      drawImage: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    vi.spyOn(HTMLCanvasElement.prototype, 'toDataURL').mockReturnValue(APPLIED_DATA_URL);
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  it('keeps the custom image when the theme modal is opened, closed, or only the play mode changes', async () => {
    render(<App />);
    startStandardGame();
    await applyCustomImage();

    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);

    openThemeModal();
    expect(screen.getByText('퍼즐 테마 선택')).toBeDefined();
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);

    closeThemeModal();
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);

    openThemeModal();
    fireEvent.click(screen.getByText('숫자 모드'));
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);
    closeThemeModal();

    fireEvent.click(screen.getByText('미리보기'));
    expect(screen.getByText(/완성본 미리보기: 내 사진 \(Custom\)/)).toBeDefined();
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);
  });

  it('removes the custom image only when a theme is applied', async () => {
    render(<App />);
    startStandardGame();
    await applyCustomImage();

    openThemeModal();
    fireEvent.click(screen.getByText('자연 & 풍경'));

    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBeNull();

    fireEvent.click(screen.getByText('미리보기'));
    expect(screen.getByText(/완성본 미리보기: 자연 & 풍경/)).toBeDefined();
    expect(screen.queryByText(/완성본 미리보기: 내 사진 \(Custom\)/)).toBeNull();
  });
});
