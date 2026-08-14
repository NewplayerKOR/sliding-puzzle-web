import React, { useState, useEffect, useRef } from 'react';
import { GridSize, TileData } from '../../types/puzzle';
import { GameMode } from '../../types/theme';
import { getTileSpriteStyle } from '../../utils/spriteCalculator';
import './Tile.css';

interface TileProps {
  tile: TileData;
  gridSize: GridSize;
  isMovable: boolean;
  isAiHintTarget?: boolean;
  aiHintDirection?: string;
  gameMode: GameMode;
  themeImagePath: string;
  showNumberOverlay: boolean;
  onClick: () => void;
}

export const Tile: React.FC<TileProps> = ({
  tile,
  gridSize,
  isMovable,
  isAiHintTarget = false,
  aiHintDirection,
  gameMode,
  themeImagePath,
  showNumberOverlay,
  onClick,
}) => {
  const isCorrect = tile.currentPos === tile.targetPos;
  const prevCorrectRef = useRef<boolean>(isCorrect);
  const [showSparkle, setShowSparkle] = useState<boolean>(false);

  // 타일이 정답 위치에 새로 안착했을 때 Sparkle VFX 발동
  useEffect(() => {
    if (!tile.isEmpty && isCorrect && !prevCorrectRef.current) {
      setShowSparkle(true);
      const timer = setTimeout(() => setShowSparkle(false), 600);
      return () => clearTimeout(timer);
    }
    prevCorrectRef.current = isCorrect;
  }, [isCorrect, tile.isEmpty]);

  if (tile.isEmpty) {
    return (
      <div
        className="puzzle-tile tile-empty"
        aria-hidden="true"
        role="presentation"
      >
        <div className="empty-slot-indicator" />
      </div>
    );
  }

  const spriteStyle =
    gameMode === 'image'
      ? getTileSpriteStyle(tile.targetPos, gridSize, themeImagePath)
      : undefined;

  const isPixelArtTheme = themeImagePath.includes('pixel_art');

  return (
    <button
      type="button"
      className={`puzzle-tile tile-filled mode-${gameMode} ${isPixelArtTheme ? 'pixel-art' : ''} ${isMovable ? 'movable' : ''} ${isCorrect ? 'correct' : ''}`}
      style={spriteStyle}
      onClick={onClick}
      disabled={!isMovable}
      aria-label={`타일 ${tile.value}${isMovable ? ' (이동 가능)' : ''}`}
      title={isMovable ? `타일 ${tile.value} 이동하기` : `타일 ${tile.value}`}
    >
      {/* 숫자 모드 또는 오버레이 힌트 활성화 시 숫자 표시 */}
      {(gameMode === 'number' || showNumberOverlay) && (
        <span className={`tile-number ${gameMode === 'image' ? 'number-overlay' : ''}`}>
          {tile.value}
        </span>
      )}

      {/* 정답 위치 인디케이터 (숫자 모드일 때 점 표시) */}
      {gameMode === 'number' && isCorrect && (
        <span className="tile-indicator" aria-hidden="true" />
      )}

      {/* AI 스마트 힌트 타겟 펄스 및 방향 화살표 */}
      {isAiHintTarget && (
        <div className={`tile-ai-hint-overlay dir-${aiHintDirection || 'up'}`} role="status" aria-label="AI 추천 이동">
          <span className="hint-arrow">
            {aiHintDirection === 'down' ? '↓' : aiHintDirection === 'up' ? '↑' : aiHintDirection === 'right' ? '→' : '←'}
          </span>
        </div>
      )}

      {/* 정답 안착 시 6-frame Sparkle VFX Sequence */}
      {showSparkle && <div className="tile-sparkle-fx animated-sparkle" aria-hidden="true" />}
    </button>
  );
};
