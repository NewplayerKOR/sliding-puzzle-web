import { describe, it, expect } from 'vitest';
import { mulberry32 } from './prng';
import { generateDailyBoard, isTodayCompleted, saveDailyCompletion, getTodayDateString } from './dailyChallenge';
import { isSolvable, checkWinCondition } from './puzzleLogic';

describe('PRNG and Daily Challenge', () => {
  it('mulberry32 generates identical deterministic sequences for identical seeds', () => {
    const rng1 = mulberry32(12345);
    const rng2 = mulberry32(12345);
    const seq1 = [rng1(), rng1(), rng1(), rng1()];
    const seq2 = [rng2(), rng2(), rng2(), rng2()];
    expect(seq1).toEqual(seq2);
  });

  it('generates a valid, solvable, uncompleted daily board for any date', () => {
    const board = generateDailyBoard('2026-08-14', 4);
    expect(board).toHaveLength(16);
    expect(isSolvable(board.map((t) => t.value), 4)).toBe(true);
    expect(checkWinCondition(board)).toBe(false);

    const boardSameDate = generateDailyBoard('2026-08-14', 4);
    expect(board.map((t) => t.value)).toEqual(boardSameDate.map((t) => t.value));
  });

  it('tracks daily completion streaks properly', () => {
    const today = getTodayDateString();
    const updated = saveDailyCompletion(today);
    expect(updated.completedDates).toContain(today);
    expect(isTodayCompleted()).toBe(true);
  });
});

