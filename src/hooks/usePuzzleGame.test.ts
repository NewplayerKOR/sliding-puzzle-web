import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePuzzleGame } from './usePuzzleGame';

describe('usePuzzleGame Hook', () => {
  it('initializes with solved board and idle state', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    expect(result.current.gridSize).toBe(3);
    expect(result.current.status).toBe('idle');
    expect(result.current.moveCount).toBe(0);
    expect(result.current.elapsedTime).toBe(0);
    expect(result.current.board).toHaveLength(9);
    expect(result.current.emptyIndex).toBe(8);
  });

  it('allows moving adjacent tiles and increments moveCount', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    // Initially tile at index 7 (value 8) is adjacent to empty slot at 8
    expect(result.current.isTileMovable(7)).toBe(true);
    expect(result.current.isTileMovable(5)).toBe(true);
    expect(result.current.isTileMovable(0)).toBe(false); // Far away

    // Move tile 7 into empty slot 8
    act(() => {
      const moved = result.current.moveTile(7);
      expect(moved).toBe(true);
    });

    expect(result.current.moveCount).toBe(1);
    expect(result.current.emptyIndex).toBe(7);
    expect(result.current.status).toBe('playing');
  });

  it('rejects moving non-adjacent tiles', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    act(() => {
      const moved = result.current.moveTile(0);
      expect(moved).toBe(false);
    });

    expect(result.current.moveCount).toBe(0);
    expect(result.current.emptyIndex).toBe(8);
  });

  it('moves tiles using direction keys', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    // Empty slot at index 8 (bottom-right: row 2, col 2)
    // 'DOWN': tile above empty slot (row 1, col 2 => index 5) moves down into empty slot
    act(() => {
      const moved = result.current.moveByDirection('DOWN');
      expect(moved).toBe(true);
    });

    expect(result.current.emptyIndex).toBe(5);
    expect(result.current.moveCount).toBe(1);
  });

  it('changes grid size and reinitializes game with new size', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    act(() => {
      result.current.changeGridSize(5);
    });

    expect(result.current.gridSize).toBe(5);
    expect(result.current.board).toHaveLength(25);
    expect(result.current.moveCount).toBe(0);
    expect(result.current.status).toBe('playing');
  });

  it('detects win condition when user restores solved board', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    // Move tile 7 -> empty slot 8
    act(() => {
      result.current.moveTile(7);
    });
    expect(result.current.isWon).toBe(false);

    // Move it back 8 -> empty slot 7
    act(() => {
      result.current.moveTile(8);
    });
    expect(result.current.isWon).toBe(true);
    expect(result.current.status).toBe('won');
  });

  it('safely handles startNewGame when SyntheticEvent or object is passed (BUG-01)', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    // Simulate clicking onClick handler where event object is passed to startNewGame
    act(() => {
      (result.current.startNewGame as any)({ type: 'click', target: {} });
    });

    expect(result.current.gridSize).toBe(3);
    expect(result.current.board).toHaveLength(9);
    expect(result.current.status).toBe('playing');
  });

  it('triggers auto-clear with solved board, won state, and sets isAutoSolved', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    act(() => {
      result.current.startNewGame();
    });
    expect(result.current.status).toBe('playing');
    expect(result.current.isAutoSolved).toBe(false);

    act(() => {
      result.current.autoSolveGame();
    });

    expect(result.current.status).toBe('won');
    expect(result.current.isWon).toBe(true);
    expect(result.current.isAutoSolved).toBe(true);
    expect(result.current.moveCount).toBeGreaterThan(0);
    expect(result.current.elapsedTime).toBeGreaterThan(0);
  });

  it('updates gridSize state and creates matching board size in startNewGame (BUG-00)', () => {
    const { result } = renderHook(() => usePuzzleGame(4));

    expect(result.current.gridSize).toBe(4);
    expect(result.current.board).toHaveLength(16);

    act(() => {
      result.current.startNewGame(5);
    });

    expect(result.current.gridSize).toBe(5);
    expect(result.current.board).toHaveLength(25);

    act(() => {
      result.current.startNewGame(3);
    });

    expect(result.current.gridSize).toBe(3);
    expect(result.current.board).toHaveLength(9);
  });

  it('performs undo move, restores previous state, and tracks usedUndoCount (BUG-01)', () => {
    const { result } = renderHook(() => usePuzzleGame(3));

    expect(result.current.canUndo).toBe(false);

    // Make a move
    act(() => {
      result.current.moveTile(7);
    });

    expect(result.current.moveCount).toBe(1);
    expect(result.current.canUndo).toBe(true);
    expect(result.current.emptyIndex).toBe(7);

    // Undo
    act(() => {
      const undone = result.current.undoMove();
      expect(undone).toBe(true);
    });

    expect(result.current.usedUndoCount).toBe(1);
    expect(result.current.emptyIndex).toBe(8); // Restored to 8
    expect(result.current.moveCount).toBe(2); // +1 penalty move
  });
});
