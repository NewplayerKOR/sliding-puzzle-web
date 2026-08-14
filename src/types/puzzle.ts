export type GridSize = 3 | 4 | 5;

export type GameStatus = 'idle' | 'playing' | 'paused' | 'won' | 'gameover';

export type GameChallengeMode = 'standard' | 'timeAttack' | 'moveLimit';

export interface Position {
  row: number;
  col: number;
}

export interface TileData {
  id: number;           // 고유 ID (1 ~ N^2 - 1, 빈 칸은 0)
  value: number;        // 표시 숫자 (0은 빈 칸)
  currentPos: number;   // 현재 1차원 인덱스 (0 ~ N^2 - 1)
  targetPos: number;    // 정답 1차원 인덱스 (value === 0 ? N^2 - 1 : value - 1)
  isEmpty: boolean;     // 빈 칸 여부
}

export type Board = TileData[];

export type MoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
