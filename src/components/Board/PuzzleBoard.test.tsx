import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render } from '@testing-library/react';
import { PuzzleBoard } from './PuzzleBoard';
import { generateSolvedBoard } from '../../utils/puzzleLogic';

const renderBoard = () => {
  const onTileClick = vi.fn();
  const onMoveByDirection = vi.fn();

  render(
    <PuzzleBoard
      gridSize={3}
      board={generateSolvedBoard(3)}
      gameMode="number"
      themeImagePath=""
      showNumberOverlay={true}
      isTileMovable={() => true}
      onTileClick={onTileClick}
      onMoveByDirection={onMoveByDirection}
    />
  );

  return {
    board: document.querySelector('.puzzle-board') as HTMLElement,
    onMoveByDirection,
  };
};

describe('PuzzleBoard touch handling', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it('prevents native touchmove scrolling during a swipe', () => {
    const { board } = renderBoard();

    fireEvent.touchStart(board, { touches: [{ clientX: 100, clientY: 100 }] });
    const notCanceled = fireEvent.touchMove(board, {
      cancelable: true,
      touches: [{ clientX: 100, clientY: 160 }],
    });

    expect(notCanceled).toBe(false);
  });

  it('applies the swipe direction on touch end', () => {
    const { board, onMoveByDirection } = renderBoard();

    fireEvent.touchStart(board, { touches: [{ clientX: 100, clientY: 100 }] });
    fireEvent.touchEnd(board, { changedTouches: [{ clientX: 100, clientY: 160 }] });

    expect(onMoveByDirection).toHaveBeenCalledWith('DOWN');
  });
});
