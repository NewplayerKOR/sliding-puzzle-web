import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  isRecord,
  readStorageItem,
  writeStorageItem,
  removeStorageItem,
  readStorageJson,
  writeStorageJson,
} from './storage';

const KEY = 'sliding_puzzle_storage_test';

const throwingStorage = {
  getItem: () => {
    throw new Error('storage blocked');
  },
  setItem: () => {
    throw new Error('storage blocked');
  },
  removeItem: () => {
    throw new Error('storage blocked');
  },
  clear: () => {
    throw new Error('storage blocked');
  },
};

describe('storage', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    localStorage.clear();
  });

  it('reads, writes and removes string values', () => {
    expect(readStorageItem(KEY)).toBeNull();
    expect(writeStorageItem(KEY, 'hello')).toBe(true);
    expect(readStorageItem(KEY)).toBe('hello');
    removeStorageItem(KEY);
    expect(readStorageItem(KEY)).toBeNull();
  });

  it('reads JSON through a schema validator', () => {
    localStorage.setItem(KEY, JSON.stringify({ count: 2 }));

    const result = readStorageJson(KEY, (value) => {
      if (!isRecord(value) || typeof value.count !== 'number') return null;
      return { count: value.count };
    });

    expect(result).toEqual({ count: 2 });
  });

  it('returns null for corrupt JSON and validator exceptions', () => {
    localStorage.setItem(KEY, '{not-json');
    expect(readStorageJson(KEY, () => 'unreachable')).toBeNull();

    localStorage.setItem(KEY, JSON.stringify({ ok: true }));
    expect(
      readStorageJson(KEY, () => {
        throw new Error('invalid schema');
      })
    ).toBeNull();
  });

  it('returns false when JSON serialization fails', () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;

    expect(writeStorageJson(KEY, circular)).toBe(false);
    expect(readStorageItem(KEY)).toBeNull();
  });

  it('absorbs blocked storage access on read, write and remove', () => {
    vi.stubGlobal('localStorage', throwingStorage);

    expect(readStorageItem(KEY)).toBeNull();
    expect(writeStorageItem(KEY, 'value')).toBe(false);
    expect(writeStorageJson(KEY, { value: 1 })).toBe(false);
    expect(readStorageJson(KEY, () => 'value')).toBeNull();
    expect(() => removeStorageItem(KEY)).not.toThrow();
  });
});
