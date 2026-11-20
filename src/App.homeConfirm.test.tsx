import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
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

const startStandard3x3 = () => {
  const card = document.querySelector('.mode-card.standard') as HTMLElement;
  const sizePill = Array.from(card.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === '3×3'
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(screen.getByText(/게임 시작 \(3×3\)/i));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const makeMove = () => {
  const tile = document.querySelector<HTMLButtonElement>('.tile-filled.movable');
  if (!tile) throw new Error('no movable tile');
  fireEvent.click(tile);
};

describe('TASK-DEV-39 destructive home return', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    resetGlobalLanguage();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
    resetGlobalLanguage();
  });

  it('asks for confirmation before discarding a game in progress', () => {
    render(<App />);
    startStandard3x3();
    makeMove();

    fireEvent.click(screen.getByText('홈으로'));

    const dialog = screen.getByRole('dialog', { name: '홈으로 돌아갈까요?' });
    expect(dialog).toBeDefined();
    expect(document.body.style.overflow).toBe('hidden');
    expect(screen.getByText(/진행 중인 게임은 저장되지 않습니다/)).toBeDefined();

    fireEvent.click(screen.getByText('계속하기'));

    expect(screen.queryByRole('dialog', { name: '홈으로 돌아갈까요?' })).toBeNull();
    expect(document.querySelector('.puzzle-board')).not.toBeNull();
    expect(document.body.style.overflow).toBe('');
  });

  it('returns home only after the destructive action is confirmed', () => {
    render(<App />);
    startStandard3x3();
    makeMove();

    fireEvent.click(screen.getByText('홈으로'));
    fireEvent.click(screen.getByText('홈으로 돌아가기'));

    expect(screen.queryByRole('dialog', { name: '홈으로 돌아갈까요?' })).toBeNull();
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(document.body.style.overflow).toBe('');
  });

  it('returns home immediately before the first move', () => {
    render(<App />);
    startStandard3x3();

    fireEvent.click(screen.getByText('홈으로'));

    expect(screen.queryByRole('dialog', { name: '홈으로 돌아갈까요?' })).toBeNull();
    expect(screen.getByText('일반 모드')).toBeDefined();
  });
});
