import { Board, GridSize } from '../types/puzzle';
import { generateSolvedBoard, isSolvable, checkWinCondition } from './puzzleLogic';
import { getTodayDateString, hashStringToSeed, mulberry32 } from './prng';
import { isRecord, readStorageJson, writeStorageJson } from './storage';

export { getTodayDateString };

export interface DailyStreakData {
  currentStreak: number;
  maxStreak: number;
  lastCompletedDate: string | null;
  completedDates: string[]; // List of YYYY-MM-DD strings
}

const DAILY_STORAGE_KEY = 'sliding_puzzle_daily_streak';
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function createEmptyStreakData(): DailyStreakData {
  return { currentStreak: 0, maxStreak: 0, lastCompletedDate: null, completedDates: [] };
}

function toNonNegativeInteger(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

// 손상된 필드가 있어도 유효한 값만 살려 스트릭 UI가 예외 없이 동작하게 함.
function normalizeDailyStreakData(value: unknown): DailyStreakData | null {
  if (!isRecord(value)) return null;

  const completedDates = Array.isArray(value.completedDates)
    ? Array.from(
        new Set(
          value.completedDates.filter(
            (date): date is string => typeof date === 'string' && DATE_PATTERN.test(date)
          )
        )
      )
    : [];
  const currentStreak = toNonNegativeInteger(value.currentStreak);
  const maxStreak = Math.max(toNonNegativeInteger(value.maxStreak), currentStreak);
  const lastCompletedDate =
    typeof value.lastCompletedDate === 'string' && DATE_PATTERN.test(value.lastCompletedDate)
      ? value.lastCompletedDate
      : null;

  return { currentStreak, maxStreak, lastCompletedDate, completedDates };
}

export function getDailyStreakData(): DailyStreakData {
  const parsed = readStorageJson(DAILY_STORAGE_KEY, normalizeDailyStreakData);
  if (parsed) {
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
  return createEmptyStreakData();
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

  writeStorageJson(DAILY_STORAGE_KEY, updated);

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
