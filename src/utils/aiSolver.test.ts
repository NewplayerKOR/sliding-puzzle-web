import { describe, it, expect } from 'vitest';
import { findNextOptimalMove, AISolutionStep } from './aiSolver';
import { generateSolvedBoard, isAdjacent, swapTiles } from './puzzleLogic';
import { mulberry32 } from './prng';
import { Board, GridSize } from '../types/puzzle';

function solvedValues(gridSize: GridSize): number[] {
  const total = gridSize * gridSize;
  const values: number[] = [];
  for (let i = 0; i < total; i++) {
    values.push(i === total - 1 ? 0 : i + 1);
  }
  return values;
}

function valuesToBoard(values: number[], gridSize: GridSize): Board {
  const total = gridSize * gridSize;
  return values.map((val, idx) => ({
    id: val,
    value: val,
    currentPos: idx,
    targetPos: val === 0 ? total - 1 : val - 1,
    isEmpty: val === 0,
  }));
}

/** Solvable random board built from a random walk (always reachable). */
function randomWalkBoard(gridSize: GridSize, seed: number, moves = 300): Board {
  const rng = mulberry32(seed);
  const values = solvedValues(gridSize);
  let empty = values.length - 1;

  for (let i = 0; i < moves; i++) {
    const row = Math.floor(empty / gridSize);
    const col = empty % gridSize;
    const candidates: number[] = [];
    if (row > 0) candidates.push(empty - gridSize);
    if (row < gridSize - 1) candidates.push(empty + gridSize);
    if (col > 0) candidates.push(empty - 1);
    if (col < gridSize - 1) candidates.push(empty + 1);
    const pick = candidates[Math.floor(rng() * candidates.length)];
    values[empty] = values[pick];
    values[pick] = 0;
    empty = pick;
  }

  return valuesToBoard(values, gridSize);
}

function emptyIndex(board: Board): number {
  return board.findIndex((t) => t.isEmpty);
}

interface Trace {
  board: Board;
  prevTileValue: number | null;
  prevEmptyIdx: number | null;
}

function followHint(trace: Trace, hint: AISolutionStep, gridSize: GridSize): void {
  const emptyIdx = emptyIndex(trace.board);
  // Hint must reference a tile adjacent to the empty slot
  expect(isAdjacent(hint.tileIndex, emptyIdx, gridSize)).toBe(true);
  // Hint must not immediately reverse the previous hint (same tile back and forth)
  if (trace.prevTileValue !== null && trace.prevEmptyIdx !== null) {
    const isReversal = hint.tileValue === trace.prevTileValue && hint.tileIndex === trace.prevEmptyIdx;
    expect(isReversal).toBe(false);
  }
  trace.prevTileValue = hint.tileValue;
  trace.prevEmptyIdx = emptyIdx;
  trace.board = swapTiles(trace.board, hint.tileIndex, emptyIdx);
}

/** Follow N hints and assert zero same-tile oscillation along the way. */
function assertNoOscillation(gridSize: GridSize, seed: number, hintCount: number): void {
  const trace: Trace = { board: randomWalkBoard(gridSize, seed), prevTileValue: null, prevEmptyIdx: null };
  for (let i = 0; i < hintCount; i++) {
    const hint = findNextOptimalMove(trace.board, gridSize);
    expect(hint).not.toBeNull();
    followHint(trace, hint as AISolutionStep, gridSize);
  }
}

/** Following hints (served from the cached solution path) solves the board. */
function assertHintsSolvePuzzle(gridSize: GridSize, seed: number, cap: number): void {
  const trace: Trace = { board: randomWalkBoard(gridSize, seed), prevTileValue: null, prevEmptyIdx: null };
  let nulls = 0;
  for (let i = 0; i < cap; i++) {
    const hint = findNextOptimalMove(trace.board, gridSize);
    if (hint === null) {
      nulls++;
      break;
    }
    followHint(trace, hint, gridSize);
    if (trace.board.every((t) => t.currentPos === t.targetPos)) break;
  }
  expect(nulls).toBe(0);
  expect(trace.board.every((t) => t.currentPos === t.targetPos)).toBe(true);
}

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

  it('returns null for solved 4x4 and 5x5 boards', () => {
    expect(findNextOptimalMove(generateSolvedBoard(4), 4)).toBeNull();
    expect(findNextOptimalMove(generateSolvedBoard(5), 5)).toBeNull();
  });

  it('returns null (no fake hint) when the 4x4 search budget is exhausted', () => {
    const board = randomWalkBoard(4, 20260817, 400);
    const move = findNextOptimalMove(board, 4, { maxNodes: 10 });
    expect(move).toBeNull();
  });

  it('3x3 hints solve the puzzle without oscillation', () => {
    const trace: Trace = { board: randomWalkBoard(3, 4242, 100), prevTileValue: null, prevEmptyIdx: null };
    for (let i = 0; i < 60; i++) {
      const hint = findNextOptimalMove(trace.board, 3);
      if (hint === null) break;
      followHint(trace, hint, 3);
      if (trace.board.every((t) => t.currentPos === t.targetPos)) break;
    }
    expect(trace.board.every((t) => t.currentPos === t.targetPos)).toBe(true);
  });

  it(
    '4x4: 10 consecutive hints never reverse the same tile (no oscillation)',
    () => {
      assertNoOscillation(4, 1234, 10);
    },
    30000
  );

  it(
    '5x5: 10 consecutive hints never reverse the same tile (no oscillation)',
    () => {
      assertNoOscillation(5, 5678, 10);
    },
    30000
  );

  it(
    '4x4: following hints completes the puzzle',
    () => {
      assertHintsSolvePuzzle(4, 7777, 200);
    },
    30000
  );

  it(
    '5x5: following hints completes the puzzle',
    () => {
      assertHintsSolvePuzzle(5, 8888, 400);
    },
    30000
  );

  it(
    '5x5: following hints completes the puzzle (hard board)',
    () => {
      assertHintsSolvePuzzle(5, 1212, 400);
    },
    30000
  );
});
