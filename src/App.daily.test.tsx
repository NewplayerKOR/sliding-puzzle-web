import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';
import { clickBoardPosition, readBoard, solveBoard } from './test/puzzleTestUtils';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const dailyMocks = vi.hoisted(() => ({
  saveDailyCompletion: vi.fn(),
}));

vi.mock('./utils/puzzleLogic', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/puzzleLogic')>();
  const { createNearSolved4x4Board } = await import('./test/nearSolvedBoard');

  return {
    ...actual,
    shuffleBoard: vi.fn((size: 3 | 4 | 5) =>
      size === 4 ? createNearSolved4x4Board() : actual.shuffleBoard(size)
    ),
  };
});

vi.mock('./utils/dailyChallenge', async (importOriginal) => {
  const actual = await importOriginal<typeof import('./utils/dailyChallenge')>();
  const { createNearSolved4x4Board } = await import('./test/nearSolvedBoard');
  dailyMocks.saveDailyCompletion.mockImplementation(actual.saveDailyCompletion);

  return {
    ...actual,
    generateDailyBoard: vi.fn(() => createNearSolved4x4Board()),
    saveDailyCompletion: dailyMocks.saveDailyCompletion,
  };
});

const DAILY_KEY = 'sliding_puzzle_daily_streak';
const RECORDS_KEY = 'sliding_puzzle_best_records';
const CUSTOM_IMAGE_KEY = 'sliding_puzzle_custom_image';
const APPLIED_DATA_URL = 'data:image/png;base64,applied-image';

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

const startDailyGame = () => {
  const card = document.querySelector('.mode-card.daily') as HTMLElement;
  fireEvent.click(card.querySelector('.btn-play-mode.daily') as HTMLButtonElement);
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const startStandardGame = (size: 3 | 4 | 5) => {
  const card = document.querySelector('.mode-card.standard') as HTMLElement;
  const sizePill = Array.from(card.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === `${size}×${size}`
  ) as HTMLButtonElement;
  fireEvent.click(sizePill);
  fireEvent.click(screen.getByText(new RegExp(`게임 시작 \\(${size}×${size}\\)`, 'i')));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const applyCustomImageFromTitle = async () => {
  fireEvent.click(document.querySelector('.btn-custom-photo-hero') as HTMLButtonElement);
  const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
  fireEvent.change(fileInput, {
    target: { files: [new File(['image'], 'photo.png', { type: 'image/png' })] },
  });
  fireEvent.click(await screen.findByText('퍼즐로 적용하기'));
};

const winNearSolved4x4 = () => {
  fireEvent.click(screen.getByRole('button', { name: /타일 14/ }));
  fireEvent.click(screen.getByRole('button', { name: /타일 15/ }));
};

const readJson = (key: string): unknown => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

describe('TASK-DEV-31 Daily 활성 컨텍스트·날짜 무결성', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createMemoryStorage());
    resetGlobalLanguage();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date(2026, 10, 20, 12, 0, 0));
    dailyMocks.saveDailyCompletion.mockClear();
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
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  it('Daily를 포기하고 커스텀 이미지 게임에서 이겨도 Daily 완료와 기록을 섞지 않는다', async () => {
    render(<App />);
    startDailyGame();
    expect(screen.getByText('홈으로')).toBeDefined();

    fireEvent.click(screen.getByText('홈으로'));
    expect(screen.getByText('일반 모드')).toBeDefined();

    await applyCustomImageFromTitle();
    expect(localStorage.getItem(CUSTOM_IMAGE_KEY)).toBe(APPLIED_DATA_URL);

    vi.setSystemTime(new Date(2026, 10, 20, 12, 0, 2));
    winNearSolved4x4();

    expect(screen.getByText(/퍼즐 완성! 축하합니다!/i)).toBeDefined();
    expect(readJson(DAILY_KEY)).toBeNull();
    expect(dailyMocks.saveDailyCompletion).not.toHaveBeenCalled();

    const records = readJson(RECORDS_KEY) as Record<string, unknown> | null;
    expect(records?.['4']).toBeTruthy();
  });

  it('Daily를 포기하고 일반 모드에서 이겨도 Daily 완료가 저장되지 않는다', () => {
    render(<App />);
    startDailyGame();
    fireEvent.click(screen.getByText('홈으로'));

    startStandardGame(3);
    vi.setSystemTime(new Date(2026, 10, 20, 12, 0, 2));

    const solution = solveBoard(readBoard(3), 3);
    expect(solution.length).toBeGreaterThan(0);
    for (const position of solution) {
      clickBoardPosition(position, 3);
    }

    expect(screen.getByText(/퍼즐 완성! 축하합니다!/i)).toBeDefined();
    expect(readJson(DAILY_KEY)).toBeNull();
    expect(dailyMocks.saveDailyCompletion).not.toHaveBeenCalled();
  });

  it('자정을 넘겨 완료해도 Daily 시작 날짜로 저장한다', () => {
    vi.setSystemTime(new Date(2026, 10, 20, 23, 59, 50));
    render(<App />);
    startDailyGame();

    vi.setSystemTime(new Date(2026, 10, 21, 0, 0, 10));
    winNearSolved4x4();

    expect(dailyMocks.saveDailyCompletion).toHaveBeenCalledTimes(1);
    expect(dailyMocks.saveDailyCompletion).toHaveBeenCalledWith('2026-11-20');

    const daily = readJson(DAILY_KEY) as {
      lastCompletedDate: string;
      completedDates: string[];
      currentStreak: number;
    };
    expect(daily.lastCompletedDate).toBe('2026-11-20');
    expect(daily.completedDates).toContain('2026-11-20');
    expect(daily.completedDates).not.toContain('2026-11-21');
    expect(daily.currentStreak).toBe(1);
  });

  it('Daily 승리 후 다시 플레이한 게임은 Daily 완료로 다시 저장하지 않는다', () => {
    render(<App />);
    startDailyGame();

    vi.setSystemTime(new Date(2026, 10, 20, 12, 0, 2));
    winNearSolved4x4();
    expect(dailyMocks.saveDailyCompletion).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('다시 플레이'));
    vi.setSystemTime(new Date(2026, 10, 20, 12, 0, 4));
    winNearSolved4x4();

    expect(dailyMocks.saveDailyCompletion).toHaveBeenCalledTimes(1);
    const daily = readJson(DAILY_KEY) as { completedDates: string[] };
    expect(daily.completedDates).toEqual(['2026-11-20']);
  });
});
