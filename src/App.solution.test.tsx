import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';
import { readBoard, solveBoard } from './test/puzzleTestUtils';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// 3×3 게임은 정답에서 4수 떨어진 고정 보드로 시작해, 정답 보기가 보드를
// 정답으로 바꾸면 기존 2수 승리 경로가 즉시 재현되도록 함.
vi.mock('./utils/puzzleLogic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/puzzleLogic')>();
  let fixedBoard = actual.generateSolvedBoard(3);
  for (const position of [7, 4, 5, 2]) {
    fixedBoard = actual.moveTileLine(fixedBoard, position, 3)?.newBoard ?? fixedBoard;
  }

  return {
    ...actual,
    shuffleBoard: vi.fn((size: 3 | 4 | 5) =>
      size === 3 ? fixedBoard : actual.shuffleBoard(size)
    ),
  };
});

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

const startStandardGame = (size: 3 | 4 | 5 = 3) => {
  const card = document.querySelector('.mode-card.standard') as HTMLElement;
  const sizePill = Array.from(card.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === `${size}×${size}`
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(screen.getByText(new RegExp(`게임 시작 \\(${size}×${size}\\)`, 'i')));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const startTimedGame = (mode: 'timeattack' | 'movelimit') => {
  const card = document.querySelector(`.mode-card.${mode}`) as HTMLElement;
  const pillLabel = mode === 'timeattack' ? '3×3 (45초)' : '3×3 (35회)';
  const sizePill = Array.from(card.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === pillLabel
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(
    screen.getByText(
      mode === 'timeattack' ? /타임어택 \(45초 도전\)/i : /이동 제한 \(35수 도전\)/i
    )
  );
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const startDailyGame = () => {
  const card = document.querySelector('.mode-card.daily') as HTMLElement;
  fireEvent.click(card.querySelector('.btn-play-mode.daily') as HTMLButtonElement);
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const openSolutionPreview = () => {
  fireEvent.click(screen.getByRole('button', { name: /정답 보기/ }));
  return screen.getByRole('dialog', { name: /정답 보기/ });
};

const closeWithEscape = () => {
  fireEvent.keyDown(window, { key: 'Escape' });
};

const clickFirstMovableTile = () => {
  const tile = document.querySelector<HTMLButtonElement>('.tile-filled.movable');
  if (!tile) throw new Error('no movable tile');
  fireEvent.click(tile);
};

const readJson = (key: string): unknown => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

describe('TASK-DEV-29 정답 보기 무결성', () => {
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
    resetGlobalLanguage();
  });

  it('읽기 전용 정답 미리보기를 열어도 보드와 기록이 바뀌지 않는다', () => {
    render(<App />);
    startStandardGame(3);

    const before = readBoard(3);
    const dialog = openSolutionPreview();

    const previewValues = Array.from(dialog.querySelectorAll('.solution-preview-tile')).map(
      (tile) => tile.textContent?.trim()
    );
    expect(previewValues).toEqual(['1', '2', '3', '4', '5', '6', '7', '8']);
    expect(readBoard(3)).toEqual(before);

    closeWithEscape();
    expect(screen.queryByRole('dialog', { name: /정답 보기/ })).toBeNull();
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
    expect(readJson('sliding_puzzle_achievements')).toBeNull();
  });

  it('정답 보기 후 기존 2수 승리 경로가 재현되지 않는다', () => {
    render(<App />);
    startStandardGame(3);

    expect(solveBoard(readBoard(3), 3).length).toBeGreaterThan(2);

    openSolutionPreview();
    closeWithEscape();

    clickFirstMovableTile();
    clickFirstMovableTile();

    expect(screen.queryByText(/퍼즐 완성! 축하합니다!/i)).toBeNull();
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
    expect(readJson('sliding_puzzle_achievements')).toBeNull();
  });

  it('Time Attack은 정답 보기를 열어도 제한 시간을 초기화하지 않는다', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimedGame('timeattack');

    expect(screen.getByText('00:45')).toBeDefined();
    openSolutionPreview();

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    closeWithEscape();
    expect(screen.getByText('00:35')).toBeDefined();
    expect(screen.queryByRole('dialog', { name: /게임 오버/ })).toBeNull();
  });

  it('Time Attack 만료 시 정답 미리보기를 닫고 GameOver를 표시한다', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimedGame('timeattack');

    openSolutionPreview();
    act(() => {
      vi.advanceTimersByTime(46_000);
    });

    // 만료 시 미리보기를 닫아 aria-modal 다이얼로그가 겹치지 않게 함
    expect(screen.queryByRole('dialog', { name: /정답 보기/ })).toBeNull();
    expect(screen.getByRole('dialog', { name: /게임 오버/ })).toBeDefined();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(1);
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
  });

  it('Move Limit은 정답 보기를 열어도 이동 수를 초기화하지 않는다', () => {
    render(<App />);
    startTimedGame('movelimit');

    const moveLabel = screen.getByText('남은 이동');
    expect(moveLabel.parentElement?.querySelector('.stat-value')?.textContent).toBe('35');

    clickFirstMovableTile();
    expect(moveLabel.parentElement?.querySelector('.stat-value')?.textContent).toBe('34');

    openSolutionPreview();
    closeWithEscape();

    expect(moveLabel.parentElement?.querySelector('.stat-value')?.textContent).toBe('34');
  });

  it('GameOver의 정답 보기는 미리보기만 열고, 닫으면 GameOver로 복귀한다', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimedGame('timeattack');

    act(() => {
      vi.advanceTimersByTime(46_000);
    });

    const gameOverDialog = screen.getByRole('dialog', { name: /게임 오버/ });
    fireEvent.click(within(gameOverDialog).getByRole('button', { name: /정답 보기/ }));

    expect(screen.getByRole('dialog', { name: /정답 보기/ })).toBeDefined();
    expect(screen.queryByRole('dialog', { name: /게임 오버/ })).toBeNull();

    closeWithEscape();
    expect(screen.getByRole('dialog', { name: /게임 오버/ })).toBeDefined();
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
    expect(readJson('sliding_puzzle_achievements')).toBeNull();
  });

  it('GameOver를 닫으면 정답 보드가 아니라 홈으로 돌아간다', () => {
    vi.useFakeTimers();
    render(<App />);
    startTimedGame('timeattack');

    act(() => {
      vi.advanceTimersByTime(46_000);
    });

    closeWithEscape();

    expect(screen.queryByRole('dialog', { name: /게임 오버/ })).toBeNull();
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
  });

  it('Daily에서 정답 보기를 열어도 일일 완료가 저장되지 않는다', () => {
    render(<App />);
    startDailyGame();

    const before = readBoard(4);
    openSolutionPreview();
    closeWithEscape();

    expect(readBoard(4)).toEqual(before);
    expect(readJson('sliding_puzzle_daily_streak')).toBeNull();
    expect(readJson('sliding_puzzle_best_records')).toBeNull();
  });
});
