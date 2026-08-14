import { describe, it, expect } from 'vitest';
import { findNextOptimalMove } from './aiSolver';
import { generateSolvedBoard } from './puzzleLogic';

describe('aiSolver', () => {
  it('returns null when board is already solved', () => {
    const solved = generateSolvedBoard(3);
    const move = findNextOptimalMove(solved, 3);
    expect(move).toBeNull();
  });

  it('correctly identifies the 1-step move to solve a 3x3 puzzle', () => {
    // Solved 3x3 is: [1,2,3, 4,5,6, 7,8,0]
    // Move tile 8 to position 8: [1,2,3, 4,5,6, 7,0,8]
    const solved = generateSolvedBoard(3);
    // Swap 8 (pos 7) and 0 (pos 8)
    const board = [...solved];
    board[7] = { ...solved[8], currentPos: 7, value: 0, isEmpty: true };
    board[8] = { ...solved[7], currentPos: 8, value: 8, isEmpty: false };

    const nextMove = findNextOptimalMove(board, 3);
    expect(nextMove).toBeDefined();
    expect(nextMove?.tileValue).toBe(8);
    expect(nextMove?.direction).toBe('left');
  });

  it('suggests a valid adjacent movable tile for 4x4', () => {
    const solved = generateSolvedBoard(4);
    // Swap tile 15 with empty tile 16
    const board = [...solved];
    board[14] = { ...solved[15], currentPos: 14, value: 0, isEmpty: true };
    board[15] = { ...solved[14], currentPos: 15, value: 15, isEmpty: false };

    const nextMove = findNextOptimalMove(board, 4);
    expect(nextMove).toBeDefined();
    expect(nextMove?.tileValue).toBe(15);
  });
});
