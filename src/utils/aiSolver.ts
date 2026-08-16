import { Board, GridSize } from '../types/puzzle';

export type MoveDirection = 'up' | 'down' | 'left' | 'right';

export interface AISolutionStep {
  tileValue: number;
  tileIndex: number;
  direction: MoveDirection;
}

/**
 * Optional tuning knobs. Extends the public signature (existing callers with
 * 2 arguments are unaffected).
 */
export interface AISolverOptions {
  /** Node budget override for the 4x4 weighted A-star search. */
  maxNodes?: number;
  /** Soft wall-clock limit for the whole computation (ms). */
  timeLimitMs?: number;
}

interface Candidate {
  tileIdx: number;
  dir: MoveDirection;
}

const OPPOSITE_DIR: Record<MoveDirection, MoveDirection> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
};

/* Search budgets / limits */
const A_STAR_BUDGET_3 = 4000; // 3x3 optimal A-star
const WEIGHTED_W = 2; // weighted A-star weight (4x4 solver): f = g + w * (MD + LC)
const FALLBACK_W = 3; // greedier weight for 5x5 fallback searches (empirically fast)
const BUDGET_4 = 200000; // 4x4 node budget
const TIMEOUT_4_MS = 2000; // 4x4 wall-clock limit
const PLACE_BUDGET = 50000; // single-tile placement primary (MD heuristic)
const PAIR_BUDGET = 100000; // joint corner-pair primary (MD-sum heuristic)
const FULL_HEURISTIC_BUDGET = 2000000; // fallback attempts (full-goal MD+LC)
const TIME_LIMIT_MS = 2800; // whole-computation wall-clock limit

/**
 * 5x5 reduction pipeline: tiles 1,2,3 and 6,11 are placed individually;
 * corner pairs (4,5) and (16,21) are solved with a joint 2-tile A-star
 * (their cells stay unfrozen during the search — no manual maneuvers).
 */
const SINGLE_STAGES: Array<[tileValue: number, cell: number]> = [
  [1, 0],
  [2, 1],
  [3, 2],
  [6, 5],
  [11, 10],
];

/** Corner pairs: tiles and their target cells (cells stay unfrozen during
 * the joint search — the growing frozen set is managed by the pipeline). */
const ROW_PAIR = {
  tiles: [4, 5] as const,
  cells: [3, 4] as const,
};

const COL_PAIR = {
  tiles: [16, 21] as const,
  cells: [15, 20] as const,
};

/** Rank mapping of the remaining 4x4 block tiles (sorted values → 1..15). */
const REDUCE_MAP: Record<number, number> = {
  7: 1,
  8: 2,
  9: 3,
  10: 4,
  12: 5,
  13: 6,
  14: 7,
  15: 8,
  17: 9,
  18: 10,
  19: 11,
  20: 12,
  22: 13,
  23: 14,
  24: 15,
};

const UNREDUCE_MAP: Record<number, number> = {};
for (const [k, v] of Object.entries(REDUCE_MAP)) {
  UNREDUCE_MAP[v] = Number(k);
}

/* ------------------------------------------------------------------------- */
/* Module-level solution cache (the worker is a long-lived singleton: a
 * computed full solution path is reused across hint requests while the
 * player follows it — instant hints, guaranteed convergence).               */
/* ------------------------------------------------------------------------- */

interface SolverMemory {
  path: AISolutionStep[] | null;
  expectedKey: string | null;
}

const solverMemory: SolverMemory = { path: null, expectedKey: null };

/* ------------------------------------------------------------------------- */
/* Heuristics (standard goal: values 1..N*N-1 in order, empty last)          */
/* ------------------------------------------------------------------------- */

function manhattanDistance(values: ArrayLike<number>, gridSize: GridSize): number {
  let dist = 0;
  const total = gridSize * gridSize;
  for (let i = 0; i < total; i++) {
    const val = values[i];
    if (val === 0) continue;
    const targetPos = val - 1;
    const curRow = Math.floor(i / gridSize);
    const curCol = i % gridSize;
    const targetRow = Math.floor(targetPos / gridSize);
    const targetCol = targetPos % gridSize;
    dist += Math.abs(curRow - targetRow) + Math.abs(curCol - targetCol);
  }
  return dist;
}

function linearConflict(values: ArrayLike<number>, gridSize: GridSize): number {
  let conflict = 0;

  for (let row = 0; row < gridSize; row++) {
    const rowTiles: { col: number; targetCol: number }[] = [];
    for (let col = 0; col < gridSize; col++) {
      const idx = row * gridSize + col;
      const val = values[idx];
      if (val !== 0) {
        const targetRow = Math.floor((val - 1) / gridSize);
        const targetCol = (val - 1) % gridSize;
        if (targetRow === row) {
          rowTiles.push({ col, targetCol });
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

  for (let col = 0; col < gridSize; col++) {
    const colTiles: { row: number; targetRow: number }[] = [];
    for (let row = 0; row < gridSize; row++) {
      const idx = row * gridSize + col;
      const val = values[idx];
      if (val !== 0) {
        const targetRow = Math.floor((val - 1) / gridSize);
        const targetCol = (val - 1) % gridSize;
        if (targetCol === col) {
          colTiles.push({ row, targetRow });
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

function totalHeuristic(values: ArrayLike<number>, gridSize: GridSize): number {
  return manhattanDistance(values, gridSize) + linearConflict(values, gridSize);
}

/** Linear-conflict pairs involving the tile at `pos` (incremental delta). */
function lcContrib(values: ArrayLike<number>, pos: number, gridSize: GridSize): number {
  const val = values[pos];
  if (val === 0) return 0;
  const targetRow = Math.floor((val - 1) / gridSize);
  const targetCol = (val - 1) % gridSize;
  const row = Math.floor(pos / gridSize);
  const col = pos % gridSize;
  let contrib = 0;

  if (targetRow === row) {
    const rowStart = row * gridSize;
    for (let c = 0; c < gridSize; c++) {
      if (c === col) continue;
      const other = values[rowStart + c];
      if (other === 0) continue;
      const otherTargetRow = Math.floor((other - 1) / gridSize);
      const otherTargetCol = (other - 1) % gridSize;
      if (otherTargetRow !== row) continue;
      if ((col < c && targetCol > otherTargetCol) || (col > c && targetCol < otherTargetCol)) {
        contrib += 2;
      }
    }
  }

  if (targetCol === col) {
    for (let r = 0; r < gridSize; r++) {
      if (r === row) continue;
      const other = values[r * gridSize + col];
      if (other === 0) continue;
      const otherTargetRow = Math.floor((other - 1) / gridSize);
      const otherTargetCol = (other - 1) % gridSize;
      if (otherTargetCol !== col) continue;
      if ((row < r && targetRow > otherTargetRow) || (row > r && targetRow < otherTargetRow)) {
        contrib += 2;
      }
    }
  }

  return contrib;
}

function buildMdTable(gridSize: GridSize): number[][] {
  const total = gridSize * gridSize;
  const table: number[][] = [];
  for (let v = 0; v < total; v++) {
    const rowTable = new Array<number>(total);
    const targetRow = v === 0 ? 0 : Math.floor((v - 1) / gridSize);
    const targetCol = v === 0 ? 0 : (v - 1) % gridSize;
    for (let pos = 0; pos < total; pos++) {
      rowTable[pos] =
        v === 0
          ? 0
          : Math.abs(Math.floor(pos / gridSize) - targetRow) + Math.abs((pos % gridSize) - targetCol);
    }
    table.push(rowTable);
  }
  return table;
}

/** Manhattan distance table from every cell to a specific target cell. */
function buildCellDistTable(gridSize: GridSize, targetCell: number): number[] {
  const total = gridSize * gridSize;
  const targetRow = Math.floor(targetCell / gridSize);
  const targetCol = targetCell % gridSize;
  const dist = new Array<number>(total);
  for (let pos = 0; pos < total; pos++) {
    dist[pos] = Math.abs(Math.floor(pos / gridSize) - targetRow) + Math.abs((pos % gridSize) - targetCol);
  }
  return dist;
}

/** Exact heuristic delta when `movedVal` slides from `oldPos` to `newPos`. */
function heuristicDelta(
  parentValues: ArrayLike<number>,
  childValues: ArrayLike<number>,
  movedVal: number,
  oldPos: number,
  newPos: number,
  gridSize: GridSize,
  mdTable: number[][]
): number {
  const dMD = mdTable[movedVal][newPos] - mdTable[movedVal][oldPos];
  const dLC = lcContrib(childValues, newPos, gridSize) - lcContrib(parentValues, oldPos, gridSize);
  return dMD + dLC;
}

function isTargetSolved(values: ArrayLike<number>): boolean {
  const total = values.length;
  for (let i = 0; i < total - 1; i++) {
    if (values[i] !== i + 1) return false;
  }
  return values[total - 1] === 0;
}

/* ------------------------------------------------------------------------- */
/* Board helpers                                                              */
/* ------------------------------------------------------------------------- */

function getCandidates(emptyIdx: number, gridSize: GridSize): Candidate[] {
  const emptyRow = Math.floor(emptyIdx / gridSize);
  const emptyCol = emptyIdx % gridSize;
  const candidates: Candidate[] = [];
  if (emptyRow > 0) candidates.push({ tileIdx: emptyIdx - gridSize, dir: 'down' });
  if (emptyRow < gridSize - 1) candidates.push({ tileIdx: emptyIdx + gridSize, dir: 'up' });
  if (emptyCol > 0) candidates.push({ tileIdx: emptyIdx - 1, dir: 'right' });
  if (emptyCol < gridSize - 1) candidates.push({ tileIdx: emptyIdx + 1, dir: 'left' });
  return candidates;
}

function encodeState(values: ArrayLike<number>): string {
  return String.fromCharCode(...(values as number[]));
}

function now(): number {
  return Date.now();
}

function applyCandidate(
  values: ArrayLike<number>,
  emptyIdx: number,
  c: Candidate
): { values: Uint16Array; emptyIdx: number } {
  const next = new Uint16Array(values.length);
  for (let i = 0; i < values.length; i++) next[i] = values[i];
  next[emptyIdx] = next[c.tileIdx];
  next[c.tileIdx] = 0;
  return { values: next, emptyIdx: c.tileIdx };
}

/* ------------------------------------------------------------------------- */
/* A-star core (shared by 3x3 / 4x4 / placement / joint pair searches)       */
/* ------------------------------------------------------------------------- */

interface AStarNode {
  state: Uint16Array;
  key: string;
  emptyIdx: number;
  g: number;
  h: number;
  f: number;
  firstMove: AISolutionStep | null;
}

class MinHeap {
  private nodes: AStarNode[] = [];

  get size(): number {
    return this.nodes.length;
  }

  private less(a: AStarNode, b: AStarNode): boolean {
    return a.f < b.f || (a.f === b.f && a.g > b.g);
  }

  push(node: AStarNode): void {
    const arr = this.nodes;
    arr.push(node);
    let i = arr.length - 1;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (this.less(arr[i], arr[parent])) {
        [arr[i], arr[parent]] = [arr[parent], arr[i]];
        i = parent;
      } else {
        break;
      }
    }
  }

  pop(): AStarNode | undefined {
    const arr = this.nodes;
    if (arr.length === 0) return undefined;
    const top = arr[0];
    const last = arr.pop() as AStarNode;
    if (arr.length > 0) {
      arr[0] = last;
      let i = 0;
      const n = arr.length;
      for (;;) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        let best = i;
        if (l < n && this.less(arr[l], arr[best])) best = l;
        if (r < n && this.less(arr[r], arr[best])) best = r;
        if (best === i) break;
        [arr[i], arr[best]] = [arr[best], arr[i]];
        i = best;
      }
    }
    return top;
  }
}

interface AStarConfig {
  values: Uint16Array;
  emptyIdx: number;
  gridSize: GridSize;
  budget: number;
  deadline: number;
  weight: number;
  frozen: Set<number> | null;
  h0: (values: Uint16Array) => number;
  hDelta: (
    parent: Uint16Array,
    child: Uint16Array,
    movedVal: number,
    oldPos: number,
    newPos: number
  ) => number;
  isGoal: (values: Uint16Array) => boolean;
}

interface AStarResult {
  move: AISolutionStep | null;
  path: AISolutionStep[] | null;
}

function aStarCore(cfg: AStarConfig): AStarResult {
  const { values, emptyIdx, gridSize, budget, deadline, weight, frozen, h0, hDelta, isGoal } = cfg;
  const startKey = encodeState(values);
  const heap = new MinHeap();
  const startH = h0(values);
  heap.push({ state: values, key: startKey, emptyIdx, g: 0, h: startH, f: startH, firstMove: null });

  const closedSet = new Set<string>();
  const parentMap = new Map<string, { parentKey: string; move: AISolutionStep }>();
  let expansions = 0;

  while (heap.size > 0) {
    if (++expansions > budget) return { move: null, path: null };
    if ((expansions & 1023) === 0 && now() > deadline) return { move: null, path: null };

    const node = heap.pop() as AStarNode;
    if (closedSet.has(node.key)) continue;
    closedSet.add(node.key);

    if (isGoal(node.state)) {
      const path: AISolutionStep[] = [];
      let cur = node.key;
      while (parentMap.has(cur)) {
        const p = parentMap.get(cur) as { parentKey: string; move: AISolutionStep };
        path.unshift(p.move);
        cur = p.parentKey;
      }
      return { move: path.length > 0 ? path[0] : null, path };
    }

    for (const c of getCandidates(node.emptyIdx, gridSize)) {
      if (frozen !== null && frozen.has(c.tileIdx)) continue;

      const child = applyCandidate(node.state, node.emptyIdx, c);
      const childKey = encodeState(child.values);
      if (closedSet.has(childKey)) continue;

      const g = node.g + 1;
      const h = node.h + hDelta(node.state, child.values, node.state[c.tileIdx], c.tileIdx, node.emptyIdx);
      const f = g + weight * h;
      const move: AISolutionStep = {
        tileValue: node.state[c.tileIdx],
        tileIndex: c.tileIdx,
        direction: c.dir,
      };

      if (!parentMap.has(childKey)) {
        parentMap.set(childKey, { parentKey: node.key, move });
      }

      heap.push({
        state: child.values,
        key: childKey,
        emptyIdx: child.emptyIdx,
        g,
        h,
        f,
        firstMove: node.firstMove ?? move,
      });
    }
  }

  return { move: null, path: null };
}

/* ------------------------------------------------------------------------- */
/* Standard-goal searches (3x3 / 4x4 / reduced 4x4 block)                    */
/* ------------------------------------------------------------------------- */

function solveStandard(
  values: Uint16Array,
  emptyIdx: number,
  gridSize: GridSize,
  budget: number,
  deadline: number,
  weight: number
): AISolutionStep[] | null {
  const mdTable = buildMdTable(gridSize);
  const res = aStarCore({
    values,
    emptyIdx,
    gridSize,
    budget,
    deadline,
    weight,
    frozen: null,
    h0: (v) => totalHeuristic(v, gridSize),
    hDelta: (p, c, movedVal, oldPos, newPos) =>
      heuristicDelta(p, c, movedVal, oldPos, newPos, gridSize, mdTable),
    isGoal: isTargetSolved,
  });
  return res.path;
}

/**
 * 4x4 solver: single weighted A-star search, f = g + w * (MD + LC).
 */
function solve4x4(
  values: Uint16Array,
  emptyIdx: number,
  budget: number,
  deadline: number
): AISolutionStep[] | null {
  return solveStandard(values, emptyIdx, 4, budget, deadline, WEIGHTED_W);
}

/* ------------------------------------------------------------------------- */
/* Frozen-mask placement searches — 5x5 reduction pipeline                   */
/* ------------------------------------------------------------------------- */

interface PlacementResult {
  moves: AISolutionStep[];
  endState: Uint16Array;
  endEmptyIdx: number;
}

/**
 * Weighted A-star that places one or more tiles at their target cells with
 * frozen masks. Primary heuristic (per spec): MD of the target tile(s) to
 * their cells. Fallback: full-goal MD + LC heuristic (rich board-wide
 * guidance) — still stops at the placement goal, so it returns a real path
 * to the subgoal either way.
 */
function placeTiles(
  state: Uint16Array,
  emptyIdx: number,
  gridSize: GridSize,
  frozen: Set<number>,
  targets: Array<{ tileValue: number; cell: number }>,
  budget: number,
  deadline: number
): PlacementResult | null {
  if (targets.every((t) => state[t.cell] === t.tileValue)) {
    return { moves: [], endState: state, endEmptyIdx: emptyIdx };
  }

  const dists = targets.map((t) => buildCellDistTable(gridSize, t.cell));
  const h0 = (v: Uint16Array): number =>
    targets.reduce((sum, t, i) => sum + dists[i][v.indexOf(t.tileValue)], 0);
  const hDelta = (
    _p: Uint16Array,
    _c: Uint16Array,
    movedVal: number,
    oldPos: number,
    newPos: number
  ): number => {
    let d = 0;
    for (let i = 0; i < targets.length; i++) {
      if (movedVal === targets[i].tileValue) {
        d += dists[i][newPos] - dists[i][oldPos];
      }
    }
    return d;
  };
  const isGoal = (v: Uint16Array): boolean => targets.every((t) => v[t.cell] === t.tileValue);

  const buildResult = (path: AISolutionStep[]): PlacementResult => {
    let s = state;
    let e = emptyIdx;
    for (const m of path) {
      const next = applyCandidate(s, e, { tileIdx: m.tileIndex, dir: m.direction });
      s = next.values;
      e = next.emptyIdx;
    }
    return { moves: path, endState: s, endEmptyIdx: e };
  };

  let res = aStarCore({
    values: state,
    emptyIdx,
    gridSize,
    budget,
    deadline,
    weight: WEIGHTED_W,
    frozen,
    h0,
    hDelta,
    isGoal,
  });
  if (res.path) return buildResult(res.path);

  // Fallback: full-goal MD+LC heuristic (frozen tiles sit at their targets
  // and contribute zero — the gradient is aligned with the subgoal).
  if (now() >= deadline) return null;
  const mdTable = buildMdTable(gridSize);
  res = aStarCore({
    values: state,
    emptyIdx,
    gridSize,
    budget: FULL_HEURISTIC_BUDGET,
    deadline,
    weight: FALLBACK_W,
    frozen,
    h0: (v) => totalHeuristic(v, gridSize),
    hDelta: (p, c, movedVal, oldPos, newPos) =>
      heuristicDelta(p, c, movedVal, oldPos, newPos, gridSize, mdTable),
    isGoal,
  });
  if (!res.path) return null;
  return buildResult(res.path);
}

/**
 * Joint A-star corner pair placement (spec: the pair cells stay unfrozen
 * during the search). If the joint search from scratch is too hard, park the
 * first tile first (single search, pair cells unfrozen) and re-run the joint
 * search from there — functionally identical, no manual maneuvers.
 */
function solveCornerPair(
  state: Uint16Array,
  emptyIdx: number,
  frozen: Set<number>,
  tiles: readonly [number, number],
  cells: readonly [number, number],
  deadline: number
): PlacementResult | null {
  const targets = [
    { tileValue: tiles[0], cell: cells[0] },
    { tileValue: tiles[1], cell: cells[1] },
  ];

  let res = placeTiles(state, emptyIdx, 5, frozen, targets, PAIR_BUDGET, deadline);
  if (res) return res;

  const firstParked = placeTiles(state, emptyIdx, 5, frozen, [targets[0]], PLACE_BUDGET, deadline);
  if (!firstParked) return null;
  res = placeTiles(firstParked.endState, firstParked.endEmptyIdx, 5, frozen, targets, PAIR_BUDGET, deadline);
  if (!res) return null;
  res.moves = [...firstParked.moves, ...res.moves];
  return res;
}

/* ------------------------------------------------------------------------- */
/* 5x5 reduction pipeline                                                     */
/* ------------------------------------------------------------------------- */

function solve5x5(state: Uint16Array, emptyIdx: number, deadline: number): AISolutionStep[] | null {
  const frozen = new Set<number>();
  const path: AISolutionStep[] = [];
  let s = state;
  let e = emptyIdx;

  // Phase 1: row 1 — tiles 1,2,3 individually, then the (4,5) joint pair.
  for (const [tv, cell] of SINGLE_STAGES.slice(0, 3)) {
    if (s[cell] === tv) {
      frozen.add(cell);
      continue;
    }
    const placed = placeTiles(s, e, 5, frozen, [{ tileValue: tv, cell }], PLACE_BUDGET, deadline);
    if (!placed) return ultimateFallback(state, emptyIdx, deadline);
    frozen.add(cell);
    path.push(...placed.moves);
    s = placed.endState;
    e = placed.endEmptyIdx;
  }

  const rowPair = solveCornerPair(s, e, frozen, ROW_PAIR.tiles, ROW_PAIR.cells, deadline);
  if (!rowPair) return ultimateFallback(state, emptyIdx, deadline);
  for (const cell of ROW_PAIR.cells) frozen.add(cell);
  path.push(...rowPair.moves);
  s = rowPair.endState;
  e = rowPair.endEmptyIdx;

  // Phase 2: column 1 — tiles 6, 11 individually, then the (16,21) joint pair.
  for (const [tv, cell] of SINGLE_STAGES.slice(3)) {
    if (s[cell] === tv) {
      frozen.add(cell);
      continue;
    }
    const placed = placeTiles(s, e, 5, frozen, [{ tileValue: tv, cell }], PLACE_BUDGET, deadline);
    if (!placed) return ultimateFallback(state, emptyIdx, deadline);
    frozen.add(cell);
    path.push(...placed.moves);
    s = placed.endState;
    e = placed.endEmptyIdx;
  }

  const colPair = solveCornerPair(s, e, frozen, COL_PAIR.tiles, COL_PAIR.cells, deadline);
  if (!colPair) return ultimateFallback(state, emptyIdx, deadline);
  for (const cell of COL_PAIR.cells) frozen.add(cell);
  path.push(...colPair.moves);
  s = colPair.endState;
  e = colPair.endEmptyIdx;

  // Phase 3: reduce the remaining 4x4 block and delegate to the 4x4 solver.
  const reduced = new Uint16Array(16);
  for (let r = 1; r <= 4; r++) {
    for (let c = 1; c <= 4; c++) {
      const v = s[r * 5 + c];
      reduced[(r - 1) * 4 + (c - 1)] = v === 0 ? 0 : REDUCE_MAP[v];
    }
  }
  const reducedEmpty = reduced.indexOf(0);
  const moves4 = solve4x4(reduced, reducedEmpty, BUDGET_4, deadline);
  if (!moves4) return ultimateFallback(state, emptyIdx, deadline);

  for (const m of moves4) {
    const gRow = 1 + Math.floor(m.tileIndex / 4);
    const gCol = 1 + (m.tileIndex % 4);
    path.push({
      tileValue: UNREDUCE_MAP[m.tileValue],
      tileIndex: gRow * 5 + gCol,
      direction: m.direction,
    });
  }

  return sanitizePath(path);
}

/** Last-resort: full-board weighted A-star solve (no frozen masks). */
function ultimateFallback(
  state: Uint16Array,
  emptyIdx: number,
  deadline: number
): AISolutionStep[] | null {
  return solveStandard(state, emptyIdx, 5, FULL_HEURISTIC_BUDGET, deadline, FALLBACK_W);
}

/**
 * Remove needless back-and-forth moves at sub-path boundaries: adjacent
 * moves of the same tile in opposite directions cancel out.
 */
function sanitizePath(moves: AISolutionStep[]): AISolutionStep[] {
  const clean: AISolutionStep[] = [];
  for (const move of moves) {
    const prev = clean[clean.length - 1];
    if (prev && prev.tileValue === move.tileValue && OPPOSITE_DIR[prev.direction] === move.direction) {
      clean.pop();
    } else {
      clean.push(move);
    }
  }
  return clean;
}

/* ------------------------------------------------------------------------- */
/* Public API                                                                 */
/* ------------------------------------------------------------------------- */

/**
 * Solve the puzzle and find the next move.
 *
 * - 3x3: optimal A-star.
 * - 4x4: single weighted A-star search, f = g + w*(MD + LC), w=2, with a
 *   node budget (200k) and a ~2s wall-clock limit.
 * - 5x5: joint sub-goal reduction — row 1 (tiles 1,2,3 individually + (4,5)
 *   joint corner pair), column 1 (6, 11 individually + (16,21) joint corner
 *   pair), then the remaining 4x4 block is rank-mapped and delegated to the
 *   4x4 solver. Frozen-cell masks replace any manual maneuvers; the corner
 *   pair cells stay unfrozen during their joint search.
 *
 * The concatenated full path is sanitized (boundary back-and-forth moves
 * removed) and cached in module memory: while the player follows the hints,
 * subsequent hints are served instantly from the cached path (guaranteed
 * convergence). If the player deviates, the solver recomputes from the new
 * board. On failure (node budget / time limit) returns null — never a fake
 * hint.
 */
export function findNextOptimalMove(
  board: Board,
  gridSize: GridSize,
  options?: AISolverOptions
): AISolutionStep | null {
  const currentValues = board.map((t) => t.value);
  if (isTargetSolved(currentValues)) {
    solverMemory.path = null;
    solverMemory.expectedKey = null;
    return null;
  }

  const emptyIdx = currentValues.indexOf(0);
  if (getCandidates(emptyIdx, gridSize).length === 0) return null;

  const state = new Uint16Array(currentValues);
  const boardKey = encodeState(state);

  // Cache hit: the player followed the previous hint — serve the next step.
  if (solverMemory.path !== null && solverMemory.path.length > 0 && solverMemory.expectedKey === boardKey) {
    const next = solverMemory.path[0];
    solverMemory.path = solverMemory.path.slice(1);
    if (solverMemory.path.length === 0) {
      solverMemory.path = null;
      solverMemory.expectedKey = null;
    } else {
      const after = applyCandidate(state, emptyIdx, { tileIdx: next.tileIndex, dir: next.direction });
      solverMemory.expectedKey = encodeState(after.values);
    }
    return next;
  }

  const timeLimit = options?.timeLimitMs ?? TIME_LIMIT_MS;
  const deadline = now() + timeLimit;

  let path: AISolutionStep[] | null = null;
  if (gridSize === 3) {
    path = solveStandard(state, emptyIdx, 3, A_STAR_BUDGET_3, deadline, 1);
  } else if (gridSize === 4) {
    const budget = options?.maxNodes ?? BUDGET_4;
    const fourDeadline = now() + Math.min(timeLimit, TIMEOUT_4_MS);
    path = solve4x4(state, emptyIdx, budget, fourDeadline);
  } else {
    path = solve5x5(state, emptyIdx, deadline);
  }

  if (!path || path.length === 0) {
    solverMemory.path = null;
    solverMemory.expectedKey = null;
    return null;
  }

  const first = path[0];
  solverMemory.path = path.slice(1);
  if (solverMemory.path.length === 0) {
    solverMemory.expectedKey = null;
  } else {
    const after = applyCandidate(state, emptyIdx, { tileIdx: first.tileIndex, dir: first.direction });
    solverMemory.expectedKey = encodeState(after.values);
  }
  return first;
}
