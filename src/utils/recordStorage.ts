import { GridSize } from '../types/puzzle';
import { BestRecord, BestRecords } from '../types/theme';
import { isRecord, readStorageJson, writeStorageJson } from './storage';

const STORAGE_KEY_RECORDS = 'sliding_puzzle_best_records';

function createDefaultRecords(): BestRecords {
  return {
    3: null,
    4: null,
    5: null,
  };
}

function normalizeBestRecord(value: unknown): BestRecord | null {
  if (!isRecord(value)) return null;

  const { bestTime, bestMoves, clearedAt } = value;
  if (
    typeof bestTime !== 'number' ||
    !Number.isFinite(bestTime) ||
    bestTime < 0 ||
    typeof bestMoves !== 'number' ||
    !Number.isFinite(bestMoves) ||
    bestMoves < 0
  ) {
    return null;
  }

  return {
    bestTime,
    bestMoves,
    clearedAt: typeof clearedAt === 'string' ? clearedAt : '',
  };
}

function normalizeBestRecords(value: unknown): BestRecords {
  if (!isRecord(value)) return createDefaultRecords();

  return {
    3: normalizeBestRecord(value['3']),
    4: normalizeBestRecord(value['4']),
    5: normalizeBestRecord(value['5']),
  };
}

export function getBestRecords(): BestRecords {
  return readStorageJson(STORAGE_KEY_RECORDS, normalizeBestRecords) ?? createDefaultRecords();
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
    writeStorageJson(STORAGE_KEY_RECORDS, currentRecords);
  }

  return { isNewRecord, records: currentRecords };
}
