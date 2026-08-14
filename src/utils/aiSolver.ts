import { Board, GridSize } from '../types/puzzle';

export type MoveDirection = 'up' | 'down' | 'left' | 'right';

export interface AISolutionStep {
  tileValue: number;
  tileIndex: number;
  direction: MoveDirection;
}

/**
 * Calculate Manhattan distance heuristic
 */
function manhattanDistance(values: number[], gridSize: GridSize): number {
  let dist = 0;
  const total = gridSize * gridSize;
  for (let i = 0; i < total; i++) {
    const val = values[i];
    if (val === 0) continue; // Skip empty tile
    const targetPos = val - 1;
    const curRow = Math.floor(i / gridSize);
    const curCol = i % gridSize;
    const targetRow = Math.floor(targetPos / gridSize);
    const targetCol = targetPos % gridSize;
    dist += Math.abs(curRow - targetRow) + Math.abs(curCol - targetCol);
  }
  return dist;
}

/**
 * Linear conflict heuristic for higher precision on 3x3 and 4x4
 */
function linearConflict(values: number[], gridSize: GridSize): number {
  let conflict = 0;

  // Row conflicts
  for (let row = 0; row < gridSize; row++) {
    const rowTiles: { val: number; col: number; targetCol: number }[] = [];
    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      const val = values[idx];
      if (val !== 0) {
        const targetRow = Math.floor((val - 1) / gridSize);
        const targetCol = (val - 1) % gridSize;
        if (targetRow === row) {
          rowTiles.push({ val, col, targetCol });
        }
      }
    }

    for (let i = 0; i < rowTiles.length; i++) {
      for (let j = i + 1; j < rowTiles.length; j++) {
        if (rowTiles[i].targetCol > rowTiles[j].targetCol && rowTiles[i].col < rowTiles[j].col) {
          conflict += 2;
        }
      }
    }
  }

  // Column conflicts
  for (let col = 0; col < gridSize; col++) {
    const colTiles: { val: number; row: number; targetRow: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
      const idx = row * gridSize + col;
      const val = values[idx];
      if (val !== 0) {
        const targetRow = Math.floor((val - 1) / gridSize);
        const targetCol = (val - 1) % gridSize;
        if (targetCol === col) {
          colTiles.push({ val, row, targetRow });
        }
      }
    }

    for (let i = 0; i < colTiles.length; i++) {
      for (let j = i + 1; j < colTiles.length; j++) {
        if (colTiles[i].targetRow > colTiles[j].targetRow && colTiles[i].row < colTiles[j].row) {
          conflict += 2;
        }
      }
    }
  }

  return conflict;
}

function totalHeuristic(values: number[], gridSize: GridSize): number {
  return manhattanDistance(values, gridSize) + linearConflict(values, gridSize);
}

function isTargetSolved(values: number[]): boolean {
  const total = values.length;
  for (let i = 0; i < total - 1; i++) {
    if (values[i] !== i + 1) return false;
  }
  return values[total - 1] === 0;
}

interface Node {
  state: number[];
  emptyIdx: number;
  g: number;
  h: number;
  f: number;
  firstMove: AISolutionStep | null;
  parentKey: string | null;
}

/**
 * Solve puzzle and find the next optimal move using A* / IDA*
 */
export function findNextOptimalMove(board: Board, gridSize: GridSize): AISolutionStep | null {
  const currentValues = board.map((t) => t.value);
  if (isTargetSolved(currentValues)) return null;

  const emptyIdx = currentValues.indexOf(0);

  // Generate valid candidate next moves
  const emptyRow = Math.floor(emptyIdx / gridSize);
  const emptyCol = emptyIdx % gridSize;
  const candidates: { tileIdx: number; dir: MoveDirection }[] = [];

  if (emptyRow > 0) candidates.push({ tileIdx: emptyIdx - gridSize, dir: 'down' }); // tile moves down into empty
  if (emptyRow < gridSize - 1) candidates.push({ tileIdx: emptyIdx + gridSize, dir: 'up' }); // tile moves up
  if (emptyCol > 0) candidates.push({ tileIdx: emptyIdx - 1, dir: 'right' }); // tile moves right
  if (emptyCol < gridSize - 1) candidates.push({ tileIdx: emptyIdx + 1, dir: 'left' }); // tile moves left

  if (candidates.length === 0) return null;

  // 1. For 3x3: Full A* search
  if (gridSize === 3) {
    const startNode: Node = {
      state: currentValues,
      emptyIdx,
      g: 0,
      h: totalHeuristic(currentValues, gridSize),
      f: totalHeuristic(currentValues, gridSize),
      firstMove: null,
      parentKey: null,
    };

    const openSet: Node[] = [startNode];
    const closedSet: Set<string> = new Set();
    let steps = 0;
    const maxSteps = 4000;

    while (openSet.length > 0 && steps < maxSteps) {
      steps++;
      // Pop node with smallest f
      let bestIdx = 0;
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].f < openSet[bestIdx].f) bestIdx = i;
      }
      const current = openSet.splice(bestIdx, 1)[0];

      if (isTargetSolved(current.state)) {
        return current.firstMove;
      }

      const key = current.state.join(',');
      closedSet.add(key);

      const eRow = Math.floor(current.emptyIdx / gridSize);
      const eCol = current.emptyIdx % gridSize;

      const moves: { nIdx: number; dir: MoveDirection }[] = [];
      if (eRow > 0) moves.push({ nIdx: current.emptyIdx - gridSize, dir: 'down' });
      if (eRow < gridSize - 1) moves.push({ nIdx: current.emptyIdx + gridSize, dir: 'up' });
      if (eCol > 0) moves.push({ nIdx: current.emptyIdx - 1, dir: 'right' });
      if (eCol < gridSize - 1) moves.push({ nIdx: current.emptyIdx + 1, dir: 'left' });

      for (const m of moves) {
        const nextState = [...current.state];
        const movedTileVal = nextState[m.nIdx];
        nextState[current.emptyIdx] = movedTileVal;
        nextState[m.nIdx] = 0;

        const nextKey = nextState.join(',');
        if (closedSet.has(nextKey)) continue;

        const firstMove =
          current.firstMove || {
            tileValue: movedTileVal,
            tileIndex: m.nIdx,
            direction: m.dir,
          };

        const g = current.g + 1;
        const h = totalHeuristic(nextState, gridSize);
        const f = g + h;

        openSet.push({
          state: nextState,
          emptyIdx: m.nIdx,
          g,
          h,
          f,
          firstMove,
          parentKey: key,
        });
      }
    }
  }

  // 2. For 4x4 / 5x5: Deep 3-step Min-Heuristic Lookahead
  let bestCandidate = candidates[0];
  let minScore = Infinity;

  for (const c of candidates) {
    const nextState = [...currentValues];
    const movedVal = nextState[c.tileIdx];
    nextState[emptyIdx] = movedVal;
    nextState[c.tileIdx] = 0;

    let score = totalHeuristic(nextState, gridSize);

    // 2nd step lookahead
    const nEmpty = c.tileIdx;
    const nRow = Math.floor(nEmpty / gridSize);
    const nCol = nEmpty % gridSize;
    const nextMoves: number[] = [];
    if (nRow > 0 && nEmpty - gridSize !== emptyIdx) nextMoves.push(nEmpty - gridSize);
    if (nRow < gridSize - 1 && nEmpty + gridSize !== emptyIdx) nextMoves.push(nEmpty + gridSize);
    if (nCol > 0 && nEmpty - 1 !== emptyIdx) nextMoves.push(nEmpty - 1);
    if (nCol < gridSize - 1 && nEmpty + 1 !== emptyIdx) nextMoves.push(nEmpty + 1);

    if (nextMoves.length > 0) {
      let min2 = Infinity;
      for (const m2 of nextMoves) {
        const state2 = [...nextState];
        state2[nEmpty] = state2[m2];
        state2[m2] = 0;
        const h2 = totalHeuristic(state2, gridSize);
        if (h2 < min2) min2 = h2;
      }
      score = score * 0.4 + min2 * 0.6;
    }

    if (score < minScore) {
      minScore = score;
      bestCandidate = c;
    }
  }

  return {
    tileValue: currentValues[bestCandidate.tileIdx],
    tileIndex: bestCandidate.tileIdx,
    direction: bestCandidate.dir,
  };
}
