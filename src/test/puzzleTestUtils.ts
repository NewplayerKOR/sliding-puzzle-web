import { fireEvent } from '@testing-library/react';

export type TestMoveDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const DIRECTION_KEYS: Record<TestMoveDirection, string> = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
};

/**
 * 현재 렌더링된 타일 위치와 aria-label을 읽어 1차원 보드로 복원함.
 * 빈 칸은 0으로 채움.
 */
export function readBoard(size = 3): number[] {
  const board = new Array<number>(size * size).fill(0);

  document.querySelectorAll<HTMLElement>('.tile-slider').forEach((tile) => {
    const row = Number(tile.style.getPropertyValue('--tile-row'));
    const col = Number(tile.style.getPropertyValue('--tile-col'));
    const label = tile.querySelector('button')?.getAttribute('aria-label') ?? '';
    const value = Number(label.match(/\d+/)?.[0] ?? 0);
    board[row * size + col] = value;
  });

  return board;
}

/** 보드 위치(index)에 있는 타일 버튼을 클릭함. */
export function clickBoardPosition(position: number, size = 3): void {
  const target = Array.from(document.querySelectorAll<HTMLElement>('.tile-slider')).find(
    (tile) => {
      const row = Number(tile.style.getPropertyValue('--tile-row'));
      const col = Number(tile.style.getPropertyValue('--tile-col'));
      return row * size + col === position;
    }
  );

  const button = target?.querySelector<HTMLButtonElement>('button');
  if (!button) {
    throw new Error(`tile not found at position ${position}`);
  }
  fireEvent.click(button);
}

/** 현재 빈 칸 기준으로 실제 이동이 가능한 방향을 반환함. */
export function getMovableDirection(size = 3): TestMoveDirection | null {
  const board = readBoard(size);
  const empty = board.indexOf(0);
  if (empty === -1) return null;

  const row = Math.floor(empty / size);
  const col = empty % size;
  if (row > 0) return 'DOWN';
  if (row < size - 1) return 'UP';
  if (col > 0) return 'RIGHT';
  return 'LEFT';
}

export function pressMovableDirection(size = 3): TestMoveDirection | null {
  const direction = getMovableDirection(size);
  if (!direction) return null;
  fireEvent.keyDown(window, { key: DIRECTION_KEYS[direction] });
  return direction;
}

/** 3×3 등 작은 보드에서 최단 이동 순서를 BFS로 계산함. */
export function solveBoard(start: number[], size = 3): number[] {
  const goal = [...Array(size * size - 1).keys()].map((index) => index + 1);
  goal.push(0);
  const goalKey = goal.join(',');
  const startKey = start.join(',');

  if (startKey === goalKey) return [];

  const queue: string[] = [startKey];
  const previous = new Map<string, string | null>([[startKey, null]]);
  const movedPosition = new Map<string, number>();
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const currentKey = queue.shift() as string;
    if (currentKey === goalKey) break;

    const current = currentKey.split(',').map(Number);
    const empty = current.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;

    for (const [rowDelta, colDelta] of directions) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) continue;

      const tilePosition = nextRow * size + nextCol;
      const next = [...current];
      [next[empty], next[tilePosition]] = [next[tilePosition], next[empty]];
      const nextKey = next.join(',');

      if (previous.has(nextKey)) continue;
      previous.set(nextKey, currentKey);
      movedPosition.set(nextKey, tilePosition);
      queue.push(nextKey);
    }
  }

  if (!previous.has(goalKey)) {
    throw new Error('board is not solvable');
  }

  const path: number[] = [];
  let currentKey: string | null = goalKey;
  while (currentKey !== null) {
    const parent: string | null = previous.get(currentKey) ?? null;
    if (parent === null) break;
    path.push(movedPosition.get(currentKey) as number);
    currentKey = parent;
  }

  return path.reverse();
}
