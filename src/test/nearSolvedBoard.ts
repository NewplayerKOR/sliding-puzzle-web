import { Board } from '../types/puzzle';

/**
 * 3×3 정답 보드에서 타일 7과 8을 오른쪽으로 한 칸씩 옮긴 2수 풀이 보드.
 * 승리 모달 테스트에서 BFS 탐색 비용을 줄일 때 사용함.
 */
export function createNearSolved3x3Board(): Board {
  return [
    { id: 1, value: 1, currentPos: 0, targetPos: 0, isEmpty: false },
    { id: 2, value: 2, currentPos: 1, targetPos: 1, isEmpty: false },
    { id: 3, value: 3, currentPos: 2, targetPos: 2, isEmpty: false },
    { id: 4, value: 4, currentPos: 3, targetPos: 3, isEmpty: false },
    { id: 5, value: 5, currentPos: 4, targetPos: 4, isEmpty: false },
    { id: 6, value: 6, currentPos: 5, targetPos: 5, isEmpty: false },
    { id: 0, value: 0, currentPos: 6, targetPos: 8, isEmpty: true },
    { id: 7, value: 7, currentPos: 7, targetPos: 6, isEmpty: false },
    { id: 8, value: 8, currentPos: 8, targetPos: 7, isEmpty: false },
  ];
}

/**
 * 4×4 정답 보드에서 타일 14와 15를 오른쪽으로 한 칸씩 옮긴 2수 풀이 보드.
 * Daily 컨텍스트 테스트에서 실제 4×4 BFS 비용 없이 승리 경로를 만들 때 사용함.
 */
export function createNearSolved4x4Board(): Board {
  const board: Board = [];

  for (let value = 1; value <= 13; value += 1) {
    board.push({
      id: value,
      value,
      currentPos: value - 1,
      targetPos: value - 1,
      isEmpty: false,
    });
  }

  board.push({ id: 0, value: 0, currentPos: 13, targetPos: 15, isEmpty: true });
  board.push({ id: 14, value: 14, currentPos: 14, targetPos: 13, isEmpty: false });
  board.push({ id: 15, value: 15, currentPos: 15, targetPos: 14, isEmpty: false });

  return board;
}
