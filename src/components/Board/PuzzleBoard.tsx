import React, { useEffect, useRef, useCallback } from 'react';
import { Board, GridSize, MoveDirection } from '../../types/puzzle';
import { GameMode } from '../../types/theme';
import { Tile } from './Tile';
import { useTranslation } from '../../i18n/useTranslation';
import './PuzzleBoard.css';

interface PuzzleBoardProps {
  gridSize: GridSize;
  board: Board;
  gameMode: GameMode;
  themeImagePath: string;
  showNumberOverlay: boolean;
  aiHint?: { tileValue: number; direction: string } | null;
  isTileMovable: (index: number) => boolean;
  onTileClick: (index: number) => void;
  onMoveByDirection: (direction: MoveDirection) => void;
}

const isTestEnv = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test';
const INPUT_THROTTLE_MS = isTestEnv ? 0 : 100;

export const PuzzleBoard: React.FC<PuzzleBoardProps> = ({
  gridSize,
  board,
  gameMode,
  themeImagePath,
  showNumberOverlay,
  aiHint = null,
  isTileMovable,
  onTileClick,
  onMoveByDirection,
}) => {
  const { t } = useTranslation();
  const boardRef = useRef<HTMLDivElement>(null);
  const lastInputTimeRef = useRef<number>(0);

  const handleThrottledMoveByDirection = useCallback(
    (direction: MoveDirection) => {
      const now = performance.now();
      if (now - lastInputTimeRef.current < INPUT_THROTTLE_MS) {
        return;
      }
      lastInputTimeRef.current = now;
      onMoveByDirection(direction);
    },
    [onMoveByDirection]
  );

  const handleThrottledTileClick = useCallback(
    (index: number) => {
      const now = performance.now();
      if (now - lastInputTimeRef.current < INPUT_THROTTLE_MS) {
        return;
      }
      lastInputTimeRef.current = now;
      onTileClick(index);
    },
    [onTileClick]
  );

  // 키보드 방향키 및 WASD 조작 이벤트 바인딩
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 폼 입력 요소 포커스 중일 때는 무시
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      let direction: MoveDirection | null = null;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          direction = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          direction = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          direction = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          direction = 'RIGHT';
          break;
      }

      if (direction) {
        e.preventDefault();
        handleThrottledMoveByDirection(direction);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleThrottledMoveByDirection]);

  // 터치 스와이프 제스처 핸들링
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    const diffX = touch.clientX - touchStartRef.current.x;
    const diffY = touch.clientY - touchStartRef.current.y;
    const minSwipeDistance = 30; // 최소 스와이프 감지 거리

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // 가로 스와이프
      if (Math.abs(diffX) > minSwipeDistance) {
        if (diffX > 0) {
          handleThrottledMoveByDirection('RIGHT');
        } else {
          handleThrottledMoveByDirection('LEFT');
        }
      }
    } else {
      // 세로 스와이프
      if (Math.abs(diffY) > minSwipeDistance) {
        if (diffY > 0) {
          handleThrottledMoveByDirection('DOWN');
        } else {
          handleThrottledMoveByDirection('UP');
        }
      }
    }

    touchStartRef.current = null;
  };

  return (
    <div className="board-wrapper">
      <div
        ref={boardRef}
        className="puzzle-board"
        style={
          {
            '--grid-size': gridSize,
          } as React.CSSProperties
        }
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="grid"
        aria-label={`${gridSize}x${gridSize} 슬라이딩 퍼즐 보드`}
      >
        {/* Background slot grid for depth */}
        {Array.from({ length: gridSize * gridSize }).map((_, idx) => (
          <div key={`slot-${idx}`} className="grid-background-slot" />
        ))}

        {/* Animated Sliding Tiles (Only non-empty tiles are rendered for 60fps performance and zero empty-slot thrashing) */}
        {board
          .filter((tile) => !tile.isEmpty)
          .map((tile) => {
            const row = Math.floor(tile.currentPos / gridSize);
            const col = tile.currentPos % gridSize;

            return (
              <div
                key={tile.id}
                className="tile-slider"
                style={
                  {
                    '--tile-row': row,
                    '--tile-col': col,
                  } as React.CSSProperties
                }
                role="gridcell"
              >
                <Tile
                  tile={tile}
                  gridSize={gridSize}
                  gameMode={gameMode}
                  themeImagePath={themeImagePath}
                  showNumberOverlay={showNumberOverlay}
                  isAiHintTarget={aiHint !== null && tile.value === aiHint.tileValue}
                  aiHintDirection={aiHint?.direction}
                  isMovable={isTileMovable(tile.currentPos)}
                  onClick={() => handleThrottledTileClick(tile.currentPos)}
                />
              </div>
            );
          })}
      </div>
      <p className="board-hint">{t.boardControlsGuide}</p>
    </div>
  );
};
