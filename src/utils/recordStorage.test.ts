import { describe, it, expect, beforeEach } from 'vitest';
import { getBestRecords, saveBestRecord } from './recordStorage';

describe('recordStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty records initially', () => {
    const records = getBestRecords();
    expect(records[3]).toBeNull();
    expect(records[4]).toBeNull();
    expect(records[5]).toBeNull();
  });

  it('saves new record when none exists', () => {
    const { isNewRecord, records } = saveBestRecord(3, 45, 20);
    expect(isNewRecord).toBe(true);
    expect(records[3]?.bestTime).toBe(45);
    expect(records[3]?.bestMoves).toBe(20);

    const reloaded = getBestRecords();
    expect(reloaded[3]?.bestTime).toBe(45);
  });

  it('detects better record by faster time', () => {
    saveBestRecord(4, 100, 50);
    const { isNewRecord, records } = saveBestRecord(4, 80, 60);
    expect(isNewRecord).toBe(true);
    expect(records[4]?.bestTime).toBe(80);
  });

  it('does not overwrite with worse time', () => {
    saveBestRecord(4, 100, 50);
    const { isNewRecord, records } = saveBestRecord(4, 120, 30);
    expect(isNewRecord).toBe(false);
    expect(records[4]?.bestTime).toBe(100);
  });
});
