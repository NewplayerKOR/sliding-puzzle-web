import { CSSProperties } from 'react';
import { GridSize } from '../types/puzzle';

export interface TileSpriteStyle extends CSSProperties {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
  backgroundRepeat: string;
}

/**
 * 타일의 정답 위치(targetPos)와 그리드 크기(gridSize)를 기반으로
 * CSS 스프라이트 백그라운드 스타일을 계산합니다.
 */
export function getTileSpriteStyle(
  targetPos: number,
  gridSize: GridSize,
  imagePath: string
): TileSpriteStyle {
  const targetRow = Math.floor(targetPos / gridSize);
  const targetCol = targetPos % gridSize;

  // 백분율 계산: col / (N - 1) * 100%
  const posX = gridSize > 1 ? Number(((targetCol / (gridSize - 1)) * 100).toFixed(4)) : 0;
  const posY = gridSize > 1 ? Number(((targetRow / (gridSize - 1)) * 100).toFixed(4)) : 0;

  return {
    backgroundImage: `url("${imagePath}")`,
    backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
    backgroundOrigin: 'border-box',
  };
}
