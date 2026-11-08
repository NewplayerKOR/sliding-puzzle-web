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

const startGame = (size: 3 | 4 | 5) => {
  const standardCard = document.querySelector('.mode-card.standard') as HTMLElement;
  const sizePill = Array.from(standardCard.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === `${size}×${size}`
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(screen.getByText(new RegExp(`게임 시작 \\(${size}×${size}\\)`, 'i')));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const getMoveCount = (): number => {
  const label = screen.getByText('이동 수');
  const value = label.parentElement?.querySelector('.stat-value')?.textContent ?? '';
  return Number(value);
};

const appContent = () => document.querySelector('.app-content') as HTMLElement;

describe('App modal focus and keyboard isolation', () => {
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
    resetGlobalLanguage();
  });

  it('traps Tab focus inside the theme modal and restores the trigger focus', () => {
    render(<App />);

    const trigger = screen.getByText(/게임 시작 \(4×4\)/i).closest('button') as HTMLButtonElement;
    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole('dialog');
    const content = dialog.querySelector('.theme-modal-content') as HTMLElement;

    expect(appContent().hasAttribute('inert')).toBe(true);
    expect(appContent().getAttribute('aria-hidden')).toBe('true');
    expect(content.contains(document.activeElement)).toBe(true);

    for (let i = 0; i < 12; i += 1) {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab' });
      expect(content.contains(document.activeElement)).toBe(true);
    }

    for (let i = 0; i < 6; i += 1) {
      fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Tab', shiftKey: true });
      expect(content.contains(document.activeElement)).toBe(true);
    }

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(appContent().hasAttribute('inert')).toBe(false);
    expect(appContent().hasAttribute('aria-hidden')).toBe(false);
    expect(document.activeElement).toBe(trigger);
  });

  it('blocks board shortcuts while a modal is open and resumes after closing', () => {
    render(<App />);
    startGame(3);
    fireEvent.click(screen.getByText(/정답 보기/i));

    expect(getMoveCount()).toBe(0);

    fireEvent.click(screen.getByText('테마 선택'));
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    expect(getMoveCount()).toBe(0);

    fireEvent.keyDown(document.activeElement as HTMLElement, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();

    fireEvent.keyDown(window, { key: 'ArrowDown' });
    expect(getMoveCount()).toBe(1);
  });

  it('ignores board shortcuts while the language select is focused', () => {
    render(<App />);
    startGame(4);
    fireEvent.click(screen.getByText(/정답 보기/i));

    const languageSelect = screen.getByLabelText('언어 선택') as HTMLSelectElement;
    languageSelect.focus();
    expect(document.activeElement).toBe(languageSelect);

    fireEvent.keyDown(languageSelect, { key: 'ArrowDown' });

    expect(languageSelect.value).toBe('ko');
    expect(getMoveCount()).toBe(0);

    languageSelect.blur();
    expect(document.activeElement).toBe(document.body);
    fireEvent.keyDown(window, { key: 'ArrowDown' });

    expect(getMoveCount()).toBe(1);
  });
});
