import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  createBoardKey,
  getDailyStreakData,
  saveDailyCompletion,
  getTodayDateString,
} from './dailyChallenge';
import { generateSolvedBoard } from './puzzleLogic';

const STORAGE_KEY = 'sliding_puzzle_daily_streak';

const emptyStreak = {
  currentStreak: 0,
  maxStreak: 0,
  lastCompletedDate: null,
  completedDates: [],
};

describe('dailyChallenge storage resilience', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('falls back to an empty streak for corrupt JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');

    expect(getDailyStreakData()).toEqual(emptyStreak);
  });

  it('falls back to an empty streak for non-object JSON values', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(['2026-01-01']));

    expect(getDailyStreakData()).toEqual(emptyStreak);
  });

  it('normalizes missing and invalid fields without throwing', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentStreak: '3',
        maxStreak: 2.9,
        lastCompletedDate: 42,
        completedDates: ['2026-01-01', '2026-01-01', 'not-a-date', 7, null],
      })
    );

    const data = getDailyStreakData();

    expect(data.currentStreak).toBe(0);
    expect(data.maxStreak).toBe(2);
    expect(data.lastCompletedDate).toBeNull();
    expect(data.completedDates).toEqual(['2026-01-01']);
    expect(() => data.completedDates.includes('2026-01-02')).not.toThrow();
  });

  it('drops a completedDates field with an unexpected type', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ currentStreak: 2, maxStreak: 2, lastCompletedDate: null, completedDates: '2026-01-01' })
    );

    expect(getDailyStreakData()).toEqual({
      currentStreak: 2,
      maxStreak: 2,
      lastCompletedDate: null,
      completedDates: [],
    });
  });

  it('keeps the returned streak data when storage writes are blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('storage blocked');
      },
      setItem: () => {
        throw new Error('storage blocked');
      },
      removeItem: () => {
        throw new Error('storage blocked');
      },
    });

    const today = getTodayDateString();
    const updated = saveDailyCompletion(today);

    expect(updated.completedDates).toContain(today);
    expect(updated.currentStreak).toBe(1);
  });
});

describe('createBoardKey', () => {
  it('정답 보드의 타일 값을 위치 순서대로 식별자로 만든다', () => {
    expect(createBoardKey(generateSolvedBoard(3))).toBe('1,2,3,4,5,6,7,8,0');
  });

  it('타일 위치가 달라지면 다른 식별자를 만든다', () => {
    const board = generateSolvedBoard(3);
    const swapped = board.map((tile) => ({ ...tile }));
    const first = swapped[7];
    swapped[7] = swapped[8];
    swapped[8] = first;

    expect(createBoardKey(swapped)).not.toBe(createBoardKey(board));
  });
});
