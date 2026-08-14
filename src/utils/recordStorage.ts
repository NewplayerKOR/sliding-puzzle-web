import { GridSize } from '../types/puzzle';
import { BestRecord, BestRecords } from '../types/theme';

const STORAGE_KEY_RECORDS = 'sliding_puzzle_best_records';

const DEFAULT_RECORDS: BestRecords = {
  3: null,
  4: null,
  5: null,
};

export function getBestRecords(): BestRecords {
  if (typeof window === 'undefined') return DEFAULT_RECORDS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!raw) return DEFAULT_RECORDS;
    const parsed = JSON.parse(raw);
    return {
      3: parsed[3] || null,
      4: parsed[4] || null,
      5: parsed[5] || null,
    };
  } catch {
    return DEFAULT_RECORDS;
  }
}

export function saveBestRecord(
  gridSize: GridSize,
  time: number,
  moves: number
): { isNewRecord: boolean; records: BestRecords } {
  const currentRecords = getBestRecords();
  const existing = currentRecords[gridSize];

  let isNewRecord = false;

  if (!existing) {
    isNewRecord = true;
  } else if (time < existing.bestTime || (time === existing.bestTime && moves < existing.bestMoves)) {
    isNewRecord = true;
  }

  if (isNewRecord) {
    const newRecord: BestRecord = {
      bestTime: time,
      bestMoves: moves,
      clearedAt: new Date().toISOString(),
    };

    currentRecords[gridSize] = newRecord;

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(currentRecords));
      } catch {
        // LocalStorage fallback
      }
    }
  }

  return { isNewRecord, records: currentRecords };
}
