import { Board, GridSize, TileData } from '../types/puzzle';

/**
 * 정답 상태의 기본 보드를 생성합니다.
 * 타일 값 1 ~ (gridSize^2 - 1) 및 마지막 빈 칸(0)으로 구성됩니다.
 */
export function generateSolvedBoard(gridSize: GridSize): Board {
  const totalTiles = gridSize * gridSize;
  const board: Board = [];

  for (let i = 0; i < totalTiles; i++) {
    const isLast = i === totalTiles - 1;
    const value = isLast ? 0 : i + 1;
    const targetPos = i;

    board.push({
      id: value,
      value,
      currentPos: i,
      targetPos,
      isEmpty: isLast,
    });
  }

  return board;
}

/**
 * 1차원 보드 배열에서 빈 칸(0)을 제외한 반전수(Inversion Count)를 계산합니다.
 * 반전수: i < j 일 때 board[i] > board[j] 인 쌍의 개수
 */
export function getInversionCount(values: number[]): number {
  let inversions = 0;
  const len = values.length;

  for (let i = 0; i < len - 1; i++) {
    const valA = values[i];
    if (valA === 0) continue; // 빈 칸 제외

    for (let j = i + 1; j < len; j++) {
      const valB = values[j];
      if (valB === 0) continue; // 빈 칸 제외

      if (valA > valB) {
        inversions++;
      }
    }
  }

  return inversions;
}

/**
 * 주어진 타일 배열과 빈 칸 위치가 수학적으로 풀이 가능한(Solvable) 상태인지 검증합니다.
 *
 * 규칙:
 * 1. 그리드 크기(N)가 홀수(3, 5)인 경우:
 *    - Inversion Count가 짝수(even)여야 풀이 가능
 * 2. 그리드 크기(N)가 짝수(4)인 경우:
 *    - 아래에서부터 빈 칸의 행 번호(1-indexed, 맨 아래 행=1)를 R이라 할 때,
 *    - (Inversion Count + R)이 홀수(odd)여야 풀이 가능
 */
export function isSolvable(values: number[], gridSize: GridSize): boolean {
  const inversions = getInversionCount(values);
  const emptyIndex = values.indexOf(0);
  const rowFromTop = Math.floor(emptyIndex / gridSize);
  const rowFromBottom = gridSize - rowFromTop; // 1-indexed from bottom

  if (gridSize % 2 === 1) {
    // 홀수 그리드 (3x3, 5x5)
    return inversions % 2 === 0;
  } else {
    // 짝수 그리드 (4x4)
    return (inversions + rowFromBottom) % 2 === 1;
  }
}

/**
 * 두 1차원 인덱스가 상/하/좌/우로 인접해 있는지 검사합니다.
 */
export function isAdjacent(pos1: number, pos2: number, gridSize: GridSize): boolean {
  const row1 = Math.floor(pos1 / gridSize);
  const col1 = pos1 % gridSize;
  const row2 = Math.floor(pos2 / gridSize);
  const col2 = pos2 % gridSize;

  const rowDiff = Math.abs(row1 - row2);
  const colDiff = Math.abs(col1 - col2);

  return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
}

/**
 * 100% 풀이가 보장되는 셔플 보드를 생성합니다.
 * Fisher-Yates 알고리즘으로 무작위 셔플 후, 풀이 불가능한 경우 인접 타일을 스왑하여 보정합니다.
 */
export function shuffleBoard(gridSize: GridSize): Board {
  const validSize: GridSize =
    typeof gridSize === 'number' && [3, 4, 5].includes(gridSize)
      ? (gridSize as GridSize)
      : 4;

  const totalTiles = validSize * validSize;
  const values: number[] = [];

  for (let i = 0; i < totalTiles; i++) {
    values.push(i === totalTiles - 1 ? 0 : i + 1);
  }

  // Fisher-Yates 무작위 셔플 (최대 100회 안전 루프 제한)
  let isShuffledValid = false;
  let attempts = 0;
  const maxAttempts = 100;

  while (!isShuffledValid && attempts < maxAttempts) {
    attempts++;

    for (let i = totalTiles - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }

    // 풀이 불가능한 상태라면, 빈 칸이 아닌 연속된 두 타일을 교환하여 반전수 홀/짝을 뒤집어 보정
    if (!isSolvable(values, validSize)) {
      // 0이 아닌 첫 두 인접 원소 찾아서 스왑
      let swapped = false;
      for (let i = 0; i < totalTiles - 1; i++) {
        if (values[i] !== 0 && values[i + 1] !== 0) {
          [values[i], values[i + 1]] = [values[i + 1], values[i]];
          swapped = true;
          break;
        }
      }
      if (!swapped) {
        // 만약 0이 끼어있었다면 첫 번째와 세 번째(0이 아닌) 스왑
        for (let i = 0; i < totalTiles - 2; i++) {
          if (values[i] !== 0 && values[i + 2] !== 0 && values[i + 1] === 0) {
            [values[i], values[i + 2]] = [values[i + 2], values[i]];
            break;
          }
        }
      }
    }

    // 셔플된 결과가 우연히 이미 완성된 정답 상태인지 확인 (정답 상태면 다시 셔플)
    let isAlreadySolved = true;
    for (let i = 0; i < totalTiles - 1; i++) {
      if (values[i] !== i + 1) {
        isAlreadySolved = false;
        break;
      }
    }
    if (values[totalTiles - 1] !== 0) {
      isAlreadySolved = false;
    }

    if (!isAlreadySolved && isSolvable(values, validSize)) {
      isShuffledValid = true;
    }
  }

  // 만약 100회 도달 시에도 정답 상태거나 미검증 상태라면 마지막 방어 보정
  if (!isSolvable(values, validSize)) {
    for (let i = 0; i < totalTiles - 1; i++) {
      if (values[i] !== 0 && values[i + 1] !== 0) {
        [values[i], values[i + 1]] = [values[i + 1], values[i]];
        break;
      }
    }
  }

  // Board 객체 구조로 매핑
  const board: Board = values.map((val, currentIdx) => {
    const isEmpty = val === 0;
    const targetPos = isEmpty ? totalTiles - 1 : val - 1;

    return {
      id: val,
      value: val,
      currentPos: currentIdx,
      targetPos,
      isEmpty,
    };
  });

  return board;
}

/**
 * 모든 타일이 정답 위치에 정렬되었는지 승리 조건을 판정합니다.
 */
export function checkWinCondition(board: Board): boolean {
  return board.every((tile) => tile.currentPos === tile.targetPos);
}

/**
 * 특정 타일과 빈 칸의 위치를 교환(Swap)한 새 보드 배열을 반환합니다.
 */
export function swapTiles(board: Board, tileIndex: number, emptyIndex: number): Board {
  const newBoard = board.map((tile) => ({ ...tile }));

  const tile = newBoard[tileIndex];
  const emptyTile = newBoard[emptyIndex];

  // 위치 스왑
  tile.currentPos = emptyIndex;
  emptyTile.currentPos = tileIndex;

  newBoard[tileIndex] = emptyTile;
  newBoard[emptyIndex] = tile;

  return newBoard;
}

/**
 * 특정 타일이 빈 칸과 동일한 행 또는 열에 위치하여 이동 가능한지(멀티 타일 슬라이드 포함) 검사합니다.
 */
export function canMoveTile(index: number, emptyIndex: number, gridSize: GridSize): boolean {
  if (
    index < 0 ||
    index >= gridSize * gridSize ||
    emptyIndex < 0 ||
    emptyIndex >= gridSize * gridSize ||
    index === emptyIndex
  ) {
    return false;
  }

  const row = Math.floor(index / gridSize);
  const col = index % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  return row === emptyRow || col === emptyCol;
}

/**
 * 클릭한 타일과 빈 슬롯 사이의 이동 대상 타일 인덱스 목록을 반환합니다.
 * 클릭한 타일부터 빈 슬롯 직전 타일까지의 순서([clickedIndex, ..., nextToEmpty])로 반환하며,
 * 같은 행/열이 아니거나 유효하지 않은 경우 null을 반환합니다.
 */
export function getLineTilesToMove(
  board: Board,
  clickedIndex: number,
  gridSize: GridSize
): number[] | null {
  if (clickedIndex < 0 || clickedIndex >= gridSize * gridSize) {
    return null;
  }

  const emptyIndex = board.findIndex((tile) => tile.isEmpty);
  if (emptyIndex === -1 || clickedIndex === emptyIndex) {
    return null;
  }

  const clickedRow = Math.floor(clickedIndex / gridSize);
  const clickedCol = clickedIndex % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  if (clickedRow !== emptyRow && clickedCol !== emptyCol) {
    return null;
  }

  const indices: number[] = [];

  if (clickedRow === emptyRow) {
    const step = clickedCol < emptyCol ? 1 : -1;
    for (let curr = clickedIndex; curr !== emptyIndex; curr += step) {
      indices.push(curr);
    }
  } else {
    const step = clickedRow < emptyRow ? gridSize : -gridSize;
    for (let curr = clickedIndex; curr !== emptyIndex; curr += step) {
      indices.push(curr);
    }
  }

  return indices;
}

export interface MoveLineResult {
  newBoard: Board;
  movedTiles: Array<{
    tile: TileData;
    fromIndex: number;
    toIndex: number;
  }>;
}

/**
 * 클릭한 타일부터 빈 슬롯 사이의 모든 타일을 빈 슬롯 방향으로 1칸씩 연쇄 슬라이드한 새 보드와 이동 내역을 반환합니다.
 */
export function moveTileLine(
  board: Board,
  clickedIndex: number,
  gridSize: GridSize
): MoveLineResult | null {
  const lineIndices = getLineTilesToMove(board, clickedIndex, gridSize);
  if (!lineIndices || lineIndices.length === 0) {
    return null;
  }

  const emptyIndex = board.findIndex((tile) => tile.isEmpty);
  if (emptyIndex === -1) {
    return null;
  }

  const clickedRow = Math.floor(clickedIndex / gridSize);
  const clickedCol = clickedIndex % gridSize;
  const emptyRow = Math.floor(emptyIndex / gridSize);
  const emptyCol = emptyIndex % gridSize;

  const step =
    clickedRow === emptyRow
      ? clickedCol < emptyCol
        ? 1
        : -1
      : clickedRow < emptyRow
      ? gridSize
      : -gridSize;

  const newBoard = board.map((tile) => ({ ...tile }));
  const movedTiles: Array<{
    tile: TileData;
    fromIndex: number;
    toIndex: number;
  }> = [];

  const emptyTileOriginal = newBoard[emptyIndex];
  const emptyTile: TileData = {
    ...emptyTileOriginal,
    currentPos: clickedIndex,
  };

  // 빈 칸에 가장 가까운 타일부터 차례대로 빈 칸 쪽으로 1칸씩 이동
  for (let i = lineIndices.length - 1; i >= 0; i--) {
    const fromIndex = lineIndices[i];
    const toIndex = fromIndex + step;
    const tile = newBoard[fromIndex];
    tile.currentPos = toIndex;
    newBoard[toIndex] = tile;
    movedTiles.unshift({ tile, fromIndex, toIndex });
  }

  // 빈 슬롯을 클릭되었던 최초 타일 위치에 배치
  newBoard[clickedIndex] = emptyTile;

  return {
    newBoard,
    movedTiles,
  };
}
