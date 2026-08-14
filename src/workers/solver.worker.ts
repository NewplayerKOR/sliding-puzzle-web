import { findNextOptimalMove } from '../utils/aiSolver';
import { Board, GridSize } from '../types/puzzle';

self.onmessage = (e: MessageEvent<{ board: Board; gridSize: GridSize; requestId: number }>) => {
  const { board, gridSize, requestId } = e.data;
  const result = findNextOptimalMove(board, gridSize);
  self.postMessage({ result, requestId });
};
