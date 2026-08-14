import { Board, GridSize } from '../types/puzzle';
import { generateSolvedBoard, isSolvable, checkWinCondition } from './puzzleLogic';
import { getTodayDateString, hashStringToSeed, mulberry32 } from './prng';

export { getTodayDateString };

export interface DailyStreakData {
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  completedDates: string[]; // List of YYYY-MM-DD strings
}

const DAILY_STORAGE_KEY = 'sliding_puzzle_daily_streak';

export function getDailyStreakData(): DailyStreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, maxStreak: 0, lastCompletedDate: null, completedDates: [] };
  }
  try {
    const raw = localStorage.getItem(DAILY_STORAGE_KEY);
    if (raw) {
      const parsed: DailyStreakData = JSON.parse(raw);
      const todayStr = getTodayDateString();
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

      if (
        parsed.lastCompletedDate &&
        parsed.lastCompletedDate !== todayStr &&
        parsed.lastCompletedDate !== yesterdayStr
      ) {
        return {
          ...parsed,
          currentStreak: 0,
        };
      }
      return parsed;
    }
  } catch {
    // fallback
  }
  return { currentStreak: 0, maxStreak: 0, lastCompletedDate: null, completedDates: [] };
}

export function saveDailyCompletion(dateStr: string = getTodayDateString()): DailyStreakData {
  const data = getDailyStreakData();
  if (data.completedDates.includes(dateStr)) {
    return data; // Already recorded
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = `${yesterday.getFullYear()}-${(yesterday.getMonth() + 1).toString().padStart(2, '0')}-${yesterday.getDate().toString().padStart(2, '0')}`;

  let newCurrentStreak = 1;
  if (data.lastCompletedDate === yesterdayStr) {
    newCurrentStreak = data.currentStreak + 1;
  } else if (data.lastCompletedDate === dateStr) {
    newCurrentStreak = data.currentStreak;
  }

  const newMaxStreak = Math.max(data.maxStreak, newCurrentStreak);
  const newCompletedDates = [...data.completedDates, dateStr];

  const updated: DailyStreakData = {
    currentStreak: newCurrentStreak,
    maxStreak: newMaxStreak,
    lastCompletedDate: dateStr,
    completedDates: newCompletedDates,
  };

  try {
    localStorage.setItem(DAILY_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return updated;
}

export function isTodayCompleted(): boolean {
  const data = getDailyStreakData();
  return data.completedDates.includes(getTodayDateString());
}

/**
 * Generate a deterministic solvable board seeded by date string
 */
export function generateDailyBoard(dateStr: string = getTodayDateString(), gridSize: GridSize = 4): Board {
  const seed = hashStringToSeed(`${dateStr}-grid-${gridSize}`);
  const rng = mulberry32(seed);
  const total = gridSize * gridSize;

  let attempts = 0;
  while (attempts < 100) {
    attempts++;
    const values: number[] = Array.from({ length: total }, (_, i) => i);

    // Fisher-Yates shuffle with seeded RNG
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    const board: Board = values.map((val, idx) => ({
      id: val,
      value: val,
      currentPos: idx,
      targetPos: val === 0 ? total - 1 : val - 1,
      isEmpty: val === 0,
    }));

    if (isSolvable(values, gridSize) && !checkWinCondition(board)) {
      return board;
    }
  }

  // Fallback: 50 deterministic valid moves from solved state
  let currentBoard = generateSolvedBoard(gridSize);
  for (let step = 0; step < 60; step++) {
    const emptyIdx = currentBoard.findIndex((t) => t.isEmpty);
    const row = Math.floor(emptyIdx / gridSize);
    const col = emptyIdx % gridSize;
    const neighbors: number[] = [];
    if (row > 0) neighbors.push(emptyIdx - gridSize);
    if (row < gridSize - 1) neighbors.push(emptyIdx + gridSize);
    if (col > 0) neighbors.push(emptyIdx - 1);
    if (col < gridSize - 1) neighbors.push(emptyIdx + 1);

    const pick = neighbors[Math.floor(rng() * neighbors.length)];
    const newBoard = [...currentBoard];
    const temp = newBoard[emptyIdx];
    newBoard[emptyIdx] = { ...newBoard[pick], currentPos: emptyIdx };
    newBoard[pick] = { ...temp, currentPos: pick };
    currentBoard = newBoard;
  }

  return currentBoard;
}
