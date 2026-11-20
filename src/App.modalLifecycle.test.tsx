import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

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

const openThemeModalFromTitle = () => {
  fireEvent.click(screen.getByText(/게임 시작 \(4×4\)/i));
  expect(screen.getByRole('dialog', { name: /퍼즐 테마 선택/ })).toBeDefined();
};

const startTimeAttack3x3 = () => {
  const card = document.querySelector('.mode-card.timeattack') as HTMLElement;
  const sizePill = Array.from(card.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === '3×3 (45초)'
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(screen.getByText(/타임어택 \(45초 도전\)/i));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const openBgmModal = () => {
  fireEvent.click(document.querySelector('.audio-btn.bgm-track-btn') as HTMLButtonElement);
};

describe('TASK-DEV-33 modal lifecycle', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    resetGlobalLanguage();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    resetGlobalLanguage();
  });

  it('locks background scrolling while a modal is open and restores it on close', () => {
    render(<App />);

    openThemeModalFromTitle();
    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.click(screen.getByLabelText('닫기'));
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('does not leave two aria-modal dialogs when Time Attack expires over the BGM modal', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimeAttack3x3();
    openBgmModal();

    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);

    act(() => {
      vi.advanceTimersByTime(46_000);
    });

    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(screen.getByRole('dialog', { name: /게임 오버/ })).toBeDefined();
    expect(screen.queryByRole('dialog', { name: /BGM/ })).toBeNull();
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('restores background scrolling after returning home from Game Over', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimeAttack3x3();

    act(() => {
      vi.advanceTimersByTime(46_000);
    });

    expect(document.body.style.overflow).toBe('hidden');

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(document.body.style.overflow).toBe('');
  });
});
