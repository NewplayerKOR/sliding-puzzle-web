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
        role="none"
      />
    );
  }

  const spriteStyle =
    gameMode === 'image'
      ? getTileSpriteStyle(tile.targetPos, gridSize, themeImagePath)
      : undefined;

  const isPixelArtTheme = themeImagePath.includes('pixel_art');

  const hintLabel = isAiHintTarget ? `, ${t.aiRecommendedMove}` : '';

  return (
    <button
      type="button"
      className={`puzzle-tile tile-filled mode-${gameMode} ${isPixelArtTheme ? 'pixel-art' : ''} ${isMovable ? 'movable' : ''} ${isCorrect ? 'correct' : ''}`}
      style={spriteStyle}
      onClick={() => {
        // aria-disabled 타일은 포커스를 유지하되 활성화는 막음 (실제 이동 검사는 moveTile이 담당)
        if (!isMovable) return;
        onClick();
      }}
      aria-disabled={!isMovable}
      aria-label={`${formatMessage(isMovable ? t.tileMovableLabel : t.tileLabel, {
        value: tile.value,
      })}${hintLabel}`}
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
      {/* 버튼 내부 live-region 중첩을 피하려고 장식으로 처리하고 힌트 문구는 버튼 이름에 포함함 */}
      {isAiHintTarget && (
        <div className={`tile-ai-hint-overlay dir-${aiHintDirection || 'up'}`} aria-hidden="true">
          <span className="hint-arrow" aria-hidden="true">
            {aiHintDirection === 'down' ? '↓' : aiHintDirection === 'up' ? '↑' : aiHintDirection === 'right' ? '→' : '←'}
          </span>
        </div>
      )}
    </button>
  );
};
