import { describe, it, expect } from 'vitest';
import {
  generateSolvedBoard,
  getInversionCount,
  isSolvable,
  shuffleBoard,
  isAdjacent,
  checkWinCondition,
  swapTiles,
} from './puzzleLogic';
import { GridSize } from '../types/puzzle';

describe('puzzleLogic Core Engine', () => {
  describe('generateSolvedBoard', () => {
    it.each([3, 4, 5] as GridSize[])('creates a valid solved board for %ix%i', (size) => {
      const board = generateSolvedBoard(size);
      expect(board).toHaveLength(size * size);

      // Check values
      for (let i = 0; i < size * size - 1; i++) {
        expect(board[i].value).toBe(i + 1);
        expect(board[i].isEmpty).toBe(false);
        expect(board[i].currentPos).toBe(i);
        expect(board[i].targetPos).toBe(i);
      }

      // Last tile is empty
      const lastTile = board[size * size - 1];
      expect(lastTile.value).toBe(0);
      expect(lastTile.isEmpty).toBe(true);
      expect(lastTile.currentPos).toBe(size * size - 1);
      expect(lastTile.targetPos).toBe(size * size - 1);

      // Solved board should pass win check
      expect(checkWinCondition(board)).toBe(true);
    });
  });

  describe('getInversionCount', () => {
    it('calculates 0 inversions for sorted array', () => {
      expect(getInversionCount([1, 2, 3, 4, 5, 6, 7, 8, 0])).toBe(0);
    });

    it('calculates known inversion counts correctly', () => {
      // 1 2 3
      // 4 5 6
      // 8 7 0 => 8 > 7 is 1 inversion
      expect(getInversionCount([1, 2, 3, 4, 5, 6, 8, 7, 0])).toBe(1);

      // 1 8 2
      // 0 4 3
      // 7 6 5 => pairs: (8,2), (8,4), (8,3), (8,7), (8,6), (8,5), (4,3), (7,6), (7,5), (6,5) = 10 inversions
      expect(getInversionCount([1, 8, 2, 0, 4, 3, 7, 6, 5])).toBe(10);
    });
  });

  describe('isSolvable', () => {
    it('handles 3x3 (odd grid) correctly', () => {
      // Solved state: inversions = 0 (even) => solvable
      expect(isSolvable([1, 2, 3, 4, 5, 6, 7, 8, 0], 3)).toBe(true);

      // 1 inversion => unsolvable
      expect(isSolvable([1, 2, 3, 4, 5, 6, 8, 7, 0], 3)).toBe(false);

      // 10 inversions => solvable
      expect(isSolvable([1, 8, 2, 0, 4, 3, 7, 6, 5], 3)).toBe(true);
    });

    it('handles 4x4 (even grid) correctly', () => {
      // Solved state: inversions = 0, blank is at bottom row (row 1 from bottom).
      // (inversions + rowFromBottom) = 0 + 1 = 1 (odd) => solvable
      const solved4x4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 0];
      expect(isSolvable(solved4x4, 4)).toBe(true);

      // Swap 14 and 15: inversions = 1, blank still at bottom row (row 1 from bottom)
      // 1 + 1 = 2 (even) => unsolvable
      const unsolvable4x4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 14, 0];
      expect(isSolvable(unsolvable4x4, 4)).toBe(false);

      // Move blank up one row (to index 11): rowFromBottom = 2.
      // Inversions = 3 (13 > 12, 14 > 12, 15 > 12).
      // (inversions + rowFromBottom) = 3 + 2 = 5 (odd) => solvable!
      const solvableMoved4x4 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 13, 14, 15, 12];
      expect(isSolvable(solvableMoved4x4, 4)).toBe(true);
    });
  });

  describe('shuffleBoard', () => {
    it.each([3, 4, 5] as GridSize[])('always generates a 100%% solvable board for %ix%i', (size) => {
      // Run 50 shuffles per size to guarantee consistency
      for (let run = 0; run < 50; run++) {
        const board = shuffleBoard(size);
        expect(board).toHaveLength(size * size);

        const values = board.map((t) => t.value);
        expect(isSolvable(values, size)).toBe(true);
        expect(checkWinCondition(board)).toBe(false); // Must not start in solved state
      }
    });

    it('handles invalid gridSize parameters defensively without infinite loops (BUG-01)', () => {
      // Pass invalid objects / types as any to verify fallback to default 4x4
      const board1 = shuffleBoard({} as any);
      expect(board1).toHaveLength(16);

      const board2 = shuffleBoard(null as any);
      expect(board2).toHaveLength(16);

      const board3 = shuffleBoard(undefined as any);
      expect(board3).toHaveLength(16);

      const board4 = shuffleBoard(NaN as any);
      expect(board4).toHaveLength(16);

      const board5 = shuffleBoard(99 as any);
      expect(board5).toHaveLength(16);
    });
  });

  describe('isAdjacent', () => {
    it('correctly identifies orthogonal adjacency on a 4x4 grid', () => {
      // Index 5 (row 1, col 1):
      // Neighbors: Up=1 (row 0, col 1), Down=9 (row 2, col 1), Left=4 (row 1, col 0), Right=6 (row 1, col 2)
      expect(isAdjacent(5, 1, 4)).toBe(true);
      expect(isAdjacent(5, 9, 4)).toBe(true);
      expect(isAdjacent(5, 4, 4)).toBe(true);
      expect(isAdjacent(5, 6, 4)).toBe(true);

      // Diagonals and far cells
      expect(isAdjacent(5, 0, 4)).toBe(false); // Diagonal Top-Left
      expect(isAdjacent(5, 2, 4)).toBe(false); // Diagonal Top-Right
      expect(isAdjacent(5, 8, 4)).toBe(false); // Diagonal Bottom-Left
      expect(isAdjacent(5, 10, 4)).toBe(false); // Diagonal Bottom-Right
      expect(isAdjacent(5, 15, 4)).toBe(false); // Far away
      expect(isAdjacent(3, 4, 4)).toBe(false); // Wrap around row boundary (row 0 col 3 vs row 1 col 0)
    });
  });

  describe('swapTiles', () => {
    it('swaps two tile positions and updates their currentPos', () => {
      const board = generateSolvedBoard(3);
      const emptyIdx = 8;
      const tileIdx = 7;

      const newBoard = swapTiles(board, tileIdx, emptyIdx);
      expect(newBoard[tileIdx].value).toBe(0);
      expect(newBoard[tileIdx].isEmpty).toBe(true);
      expect(newBoard[tileIdx].currentPos).toBe(tileIdx);

      expect(newBoard[emptyIdx].value).toBe(8);
      expect(newBoard[emptyIdx].isEmpty).toBe(false);
      expect(newBoard[emptyIdx].currentPos).toBe(emptyIdx);
    });
  });
});
