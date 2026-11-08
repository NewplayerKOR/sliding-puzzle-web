import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';
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

describe('App accessibility structure', () => {
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

  it('allows page zoom in the viewport metadata', () => {
    const html = readFileSync(`${process.cwd()}/index.html`, 'utf8');

    expect(html).toContain('maximum-scale=5.0');
    expect(html).not.toContain('user-scalable=no');
  });

  it('renders the title screen in a main landmark without nested card buttons', () => {
    render(<App />);

    const main = screen.getByRole('main');
    const standardCard = main.querySelector('.mode-card.standard') as HTMLElement;

    expect(standardCard).not.toBeNull();
    expect(standardCard.getAttribute('role')).toBeNull();
    expect(standardCard.hasAttribute('tabindex')).toBe(false);
    expect(standardCard.querySelectorAll('button').length).toBeGreaterThan(0);

    const size3 = Array.from(standardCard.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '3×3'
    ) as HTMLButtonElement;
    const size4 = Array.from(standardCard.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === '4×4'
    ) as HTMLButtonElement;

    expect(size3.getAttribute('aria-pressed')).toBe('false');
    expect(size4.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByRole('group', { name: '난이도' })).toHaveLength(3);

    fireEvent.click(size3);

    expect(size3.getAttribute('aria-pressed')).toBe('true');
    expect(size4.getAttribute('aria-pressed')).toBe('false');
  });

  it('exposes the board as a labeled group without invalid grid roles', () => {
    render(<App />);
    startGame(3);

    const board = document.querySelector('.puzzle-board') as HTMLElement;
    const describedBy = board.getAttribute('aria-describedby');
    const guide = describedBy ? document.getElementById(describedBy) : null;

    expect(board.getAttribute('role')).toBe('group');
    expect(board.getAttribute('aria-label')).toContain('슬라이딩 퍼즐 보드');
    expect(board.querySelector('[role="gridcell"]')).toBeNull();
    expect(screen.queryByRole('grid')).toBeNull();
    expect(guide?.textContent).toContain('방향키');
  });

  it('localizes audio control accessible labels in Japanese and Chinese', () => {
    render(<App />);
    const languageSelect = screen.getByLabelText('언어 선택');

    fireEvent.change(languageSelect, { target: { value: 'ja' } });

    expect(screen.getAllByLabelText('BGM').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('効果音').length).toBeGreaterThan(0);

    // PNG alt 대신 lucide 아이콘을 포함한 버튼의 접근성 이름을 검증함
    const jaSfxButtons = screen.getAllByRole('button', { name: '効果音' });
    expect(jaSfxButtons.length).toBeGreaterThan(0);
    expect(jaSfxButtons[0].querySelector('svg')).not.toBeNull();

    fireEvent.change(languageSelect, { target: { value: 'zh' } });

    expect(screen.getAllByLabelText('音乐').length).toBeGreaterThan(0);
    expect(screen.getAllByLabelText('音效').length).toBeGreaterThan(0);

    const zhSfxButtons = screen.getAllByRole('button', { name: '音效' });
    expect(zhSfxButtons.length).toBeGreaterThan(0);
    expect(zhSfxButtons[0].querySelector('svg')).not.toBeNull();
  });
});
