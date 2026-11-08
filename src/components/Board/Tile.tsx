import React from 'react';
import { GridSize, TileData } from '../../types/puzzle';
import { GameMode } from '../../types/theme';
import { getTileSpriteStyle } from '../../utils/spriteCalculator';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMessage } from '../../i18n/format';
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
  const { t } = useTranslation();
  const isCorrect = tile.currentPos === tile.targetPos;

  if (tile.isEmpty) {
    return (
      <div
        className="puzzle-tile tile-empty"
        aria-hidden="true"
        role="presentation"
      />
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
      aria-label={formatMessage(isMovable ? t.tileMovableLabel : t.tileLabel, {
        value: tile.value,
      })}
      title={formatMessage(isMovable ? t.tileMoveTitle : t.tileLabel, {
        value: tile.value,
      })}
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
        <div className={`tile-ai-hint-overlay dir-${aiHintDirection || 'up'}`} role="status" aria-label={t.aiRecommendedMove}>
          <span className="hint-arrow">
            {aiHintDirection === 'down' ? '↓' : aiHintDirection === 'up' ? '↑' : aiHintDirection === 'right' ? '→' : '←'}
          </span>
        </div>
      )}
    </button>
  );
};
