import { describe, it, expect } from 'vitest';
import {
  generateSolvedBoard,
  getInversionCount,
  isSolvable,
  shuffleBoard,
  isAdjacent,
  checkWinCondition,
  swapTiles,
  canMoveTile,
  getLineTilesToMove,
  moveTileLine,
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

  describe('canMoveTile', () => {
    it('identifies all same-row and same-col tiles as movable on 3x3', () => {
      // Empty at 8 (row 2, col 2)
      // Movable (same row): 6 (2,0), 7 (2,1)
      // Movable (same col): 2 (0,2), 5 (1,2)
      expect(canMoveTile(7, 8, 3)).toBe(true);
      expect(canMoveTile(6, 8, 3)).toBe(true);
      expect(canMoveTile(5, 8, 3)).toBe(true);
      expect(canMoveTile(2, 8, 3)).toBe(true);

      // Non-movable (diagonal or different row/col)
      expect(canMoveTile(0, 8, 3)).toBe(false);
      expect(canMoveTile(1, 8, 3)).toBe(false);
      expect(canMoveTile(3, 8, 3)).toBe(false);
      expect(canMoveTile(4, 8, 3)).toBe(false);

      // Empty tile itself or out of bounds
      expect(canMoveTile(8, 8, 3)).toBe(false);
      expect(canMoveTile(-1, 8, 3)).toBe(false);
      expect(canMoveTile(9, 8, 3)).toBe(false);
    });

    it('identifies all 4-directional same-line tiles on 4x4 with central empty slot', () => {
      // Empty at 5 (row 1, col 1)
      // Row 1: 4 (1,0), 6 (1,2), 7 (1,3)
      expect(canMoveTile(4, 5, 4)).toBe(true);
      expect(canMoveTile(6, 5, 4)).toBe(true);
      expect(canMoveTile(7, 5, 4)).toBe(true);

      // Col 1: 1 (0,1), 9 (2,1), 13 (3,1)
      expect(canMoveTile(1, 5, 4)).toBe(true);
      expect(canMoveTile(9, 5, 4)).toBe(true);
      expect(canMoveTile(13, 5, 4)).toBe(true);

      // Non-movable
      expect(canMoveTile(0, 5, 4)).toBe(false);
      expect(canMoveTile(2, 5, 4)).toBe(false);
      expect(canMoveTile(3, 5, 4)).toBe(false);
      expect(canMoveTile(8, 5, 4)).toBe(false);
      expect(canMoveTile(10, 5, 4)).toBe(false);
      expect(canMoveTile(12, 5, 4)).toBe(false);
      expect(canMoveTile(14, 5, 4)).toBe(false);
      expect(canMoveTile(15, 5, 4)).toBe(false);
    });
  });

  describe('getLineTilesToMove', () => {
    it('returns single tile index for 1-tile adjacent move on 3x3', () => {
      const board = generateSolvedBoard(3); // Empty at 8
      expect(getLineTilesToMove(board, 7, 3)).toEqual([7]);
      expect(getLineTilesToMove(board, 5, 3)).toEqual([5]);
    });

    it('returns ordered line of indices for 2-tile move on 3x3', () => {
      const board = generateSolvedBoard(3); // Empty at 8 (row 2, col 2)
      // Click 6 (row 2, col 0) -> targets [6, 7]
      expect(getLineTilesToMove(board, 6, 3)).toEqual([6, 7]);
      // Click 2 (row 0, col 2) -> targets [2, 5]
      expect(getLineTilesToMove(board, 2, 3)).toEqual([2, 5]);
    });

    it('returns ordered line of indices for 1, 2, 3-tile moves on 4x4', () => {
      const board = generateSolvedBoard(4); // Empty at 15 (row 3, col 3)
      // 1 tile away: 14 -> [14]
      expect(getLineTilesToMove(board, 14, 4)).toEqual([14]);
      // 2 tiles away: 13 -> [13, 14]
      expect(getLineTilesToMove(board, 13, 4)).toEqual([13, 14]);
      // 3 tiles away: 12 -> [12, 13, 14]
      expect(getLineTilesToMove(board, 12, 4)).toEqual([12, 13, 14]);
      // vertical 3 tiles away: 3 (row 0, col 3) -> [3, 7, 11]
      expect(getLineTilesToMove(board, 3, 4)).toEqual([3, 7, 11]);
    });

    it('returns ordered line for reverse-direction moves on 4x4', () => {
      // Place empty at 5 (row 1, col 1)
      const board = generateSolvedBoard(4);
      const customBoard = swapTiles(board, 5, 15); // Empty now at 5

      // Click 7 (row 1, col 3 -> right 2 tiles away) -> [7, 6]
      expect(getLineTilesToMove(customBoard, 7, 4)).toEqual([7, 6]);
      // Click 13 (row 3, col 1 -> down 2 tiles away) -> [13, 9]
      expect(getLineTilesToMove(customBoard, 13, 4)).toEqual([13, 9]);
    });

    it('returns ordered line for 4-tile move on 5x5', () => {
      const board = generateSolvedBoard(5); // Empty at 24 (row 4, col 4)
      // Click 20 (row 4, col 0) -> [20, 21, 22, 23]
      expect(getLineTilesToMove(board, 20, 5)).toEqual([20, 21, 22, 23]);
      // Click 4 (row 0, col 4) -> [4, 9, 14, 19]
      expect(getLineTilesToMove(board, 4, 5)).toEqual([4, 9, 14, 19]);
    });

    it('returns null for diagonal, non-aligned, out-of-bounds, or empty tile clicks', () => {
      const board = generateSolvedBoard(3); // Empty at 8
      expect(getLineTilesToMove(board, 0, 3)).toBeNull();
      expect(getLineTilesToMove(board, 1, 3)).toBeNull();
      expect(getLineTilesToMove(board, 3, 3)).toBeNull();
      expect(getLineTilesToMove(board, 4, 3)).toBeNull();
      expect(getLineTilesToMove(board, 8, 3)).toBeNull(); // Empty itself
      expect(getLineTilesToMove(board, -1, 3)).toBeNull();
      expect(getLineTilesToMove(board, 9, 3)).toBeNull();
    });
  });

  describe('moveTileLine', () => {
    it('correctly shifts a 1-tile line (equivalent to single swap) on 3x3', () => {
      const board = generateSolvedBoard(3); // 1..8, empty at 8
      const res = moveTileLine(board, 7, 3);
      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.movedTiles).toHaveLength(1);
      expect(res.movedTiles[0].fromIndex).toBe(7);
      expect(res.movedTiles[0].toIndex).toBe(8);
      expect(res.movedTiles[0].tile.value).toBe(8);

      expect(res.newBoard[7].value).toBe(0);
      expect(res.newBoard[7].isEmpty).toBe(true);
      expect(res.newBoard[7].currentPos).toBe(7);

      expect(res.newBoard[8].value).toBe(8);
      expect(res.newBoard[8].isEmpty).toBe(false);
      expect(res.newBoard[8].currentPos).toBe(8);
    });

    it('correctly shifts a 2-tile line on 3x3 (Multi-Tile Push)', () => {
      const board = generateSolvedBoard(3); // row 2: [7, 8, 0] at indices [6, 7, 8]
      const res = moveTileLine(board, 6, 3);
      expect(res).not.toBeNull();
      if (!res) return;

      // Moved tiles: tile at 6 (val 7) -> 7, tile at 7 (val 8) -> 8
      expect(res.movedTiles).toHaveLength(2);
      expect(res.movedTiles[0]).toMatchObject({ fromIndex: 6, toIndex: 7 });
      expect(res.movedTiles[0].tile.value).toBe(7);
      expect(res.movedTiles[1]).toMatchObject({ fromIndex: 7, toIndex: 8 });
      expect(res.movedTiles[1].tile.value).toBe(8);

      // Resulting board
      expect(res.newBoard[6].value).toBe(0);
      expect(res.newBoard[6].isEmpty).toBe(true);
      expect(res.newBoard[6].currentPos).toBe(6);

      expect(res.newBoard[7].value).toBe(7);
      expect(res.newBoard[7].currentPos).toBe(7);

      expect(res.newBoard[8].value).toBe(8);
      expect(res.newBoard[8].currentPos).toBe(8);

      // Unchanged tiles (0..5)
      for (let i = 0; i <= 5; i++) {
        expect(res.newBoard[i].value).toBe(i + 1);
        expect(res.newBoard[i].currentPos).toBe(i);
      }
    });

    it('correctly shifts a 3-tile line on 4x4 (Multi-Tile Push)', () => {
      const board = generateSolvedBoard(4); // row 3: [13, 14, 15, 0] at indices [12, 13, 14, 15]
      const res = moveTileLine(board, 12, 4);
      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.movedTiles).toHaveLength(3);
      expect(res.movedTiles[0]).toMatchObject({ fromIndex: 12, toIndex: 13 });
      expect(res.movedTiles[1]).toMatchObject({ fromIndex: 13, toIndex: 14 });
      expect(res.movedTiles[2]).toMatchObject({ fromIndex: 14, toIndex: 15 });

      expect(res.newBoard[12].value).toBe(0);
      expect(res.newBoard[12].isEmpty).toBe(true);
      expect(res.newBoard[12].currentPos).toBe(12);

      expect(res.newBoard[13].value).toBe(13);
      expect(res.newBoard[13].currentPos).toBe(13);

      expect(res.newBoard[14].value).toBe(14);
      expect(res.newBoard[14].currentPos).toBe(14);

      expect(res.newBoard[15].value).toBe(15);
      expect(res.newBoard[15].currentPos).toBe(15);
    });

    it('correctly shifts a vertical 3-tile line on 4x4', () => {
      const board = generateSolvedBoard(4); // col 3: [4, 8, 12, 0] at indices [3, 7, 11, 15]
      const res = moveTileLine(board, 3, 4);
      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.movedTiles).toHaveLength(3);
      expect(res.movedTiles[0]).toMatchObject({ fromIndex: 3, toIndex: 7 });
      expect(res.movedTiles[1]).toMatchObject({ fromIndex: 7, toIndex: 11 });
      expect(res.movedTiles[2]).toMatchObject({ fromIndex: 11, toIndex: 15 });

      expect(res.newBoard[3].value).toBe(0);
      expect(res.newBoard[3].isEmpty).toBe(true);
      expect(res.newBoard[3].currentPos).toBe(3);

      expect(res.newBoard[7].value).toBe(4);
      expect(res.newBoard[11].value).toBe(8);
      expect(res.newBoard[15].value).toBe(12);
    });

    it('correctly shifts a 4-tile line on 5x5', () => {
      const board = generateSolvedBoard(5); // row 4: [21, 22, 23, 24, 0] at indices [20, 21, 22, 23, 24]
      const res = moveTileLine(board, 20, 5);
      expect(res).not.toBeNull();
      if (!res) return;

      expect(res.movedTiles).toHaveLength(4);
      expect(res.movedTiles[0]).toMatchObject({ fromIndex: 20, toIndex: 21 });
      expect(res.movedTiles[3]).toMatchObject({ fromIndex: 23, toIndex: 24 });

      expect(res.newBoard[20].value).toBe(0);
      expect(res.newBoard[20].isEmpty).toBe(true);
      expect(res.newBoard[20].currentPos).toBe(20);

      expect(res.newBoard[21].value).toBe(21);
      expect(res.newBoard[24].value).toBe(24);
    });

    it('returns null for invalid move attempts', () => {
      const board = generateSolvedBoard(3);
      expect(moveTileLine(board, 0, 3)).toBeNull();
      expect(moveTileLine(board, 8, 3)).toBeNull();
      expect(moveTileLine(board, 99, 3)).toBeNull();
    });
  });
});
