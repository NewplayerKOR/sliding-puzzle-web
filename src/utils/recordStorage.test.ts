import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBestRecords, saveBestRecord } from './recordStorage';

const STORAGE_KEY = 'sliding_puzzle_best_records';

describe('recordStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
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

  it('falls back for corrupt JSON and drops malformed records', () => {
    localStorage.setItem(STORAGE_KEY, '{broken');
    expect(getBestRecords()).toEqual({ 3: null, 4: null, 5: null });

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        3: { bestTime: '10', bestMoves: 5, clearedAt: '2026-01-01' },
        4: { bestTime: 20, bestMoves: 30, clearedAt: 123 },
        5: { bestTime: -1, bestMoves: 10, clearedAt: '2026-01-01' },
      })
    );

    const records = getBestRecords();
    expect(records[3]).toBeNull();
    expect(records[4]).toEqual({ bestTime: 20, bestMoves: 30, clearedAt: '' });
    expect(records[5]).toBeNull();
  });

  it('treats non-object JSON as empty records', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([1, 2, 3]));

    expect(getBestRecords()).toEqual({ 3: null, 4: null, 5: null });
  });

  it('does not mutate the shared defaults when storage writes are blocked', () => {
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

    const first = saveBestRecord(3, 30, 10);
    expect(first.isNewRecord).toBe(true);
    expect(first.records[3]?.bestTime).toBe(30);

    expect(getBestRecords()).toEqual({ 3: null, 4: null, 5: null });
  });
});
