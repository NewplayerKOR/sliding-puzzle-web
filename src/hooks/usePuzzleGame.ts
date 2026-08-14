import { useState, useEffect, useCallback, useRef } from 'react';
import { Board, GameStatus, GameChallengeMode, GridSize, MoveDirection } from '../types/puzzle';
import {
  generateSolvedBoard,
  shuffleBoard,
  isAdjacent,
  checkWinCondition,
  swapTiles,
} from '../utils/puzzleLogic';
import { audioManager } from '../utils/audioManager';
import { triggerHaptic } from '../utils/haptics';

export const TIME_LIMITS: Record<GridSize, number> = {
  3: 45,  // 3x3: 45초 (Speed Run)
  4: 120, // 4x4: 120초 (2분 Standard Challenge)
  5: 300, // 5x5: 300초 (5분 Master Challenge)
};

export const MOVE_LIMITS: Record<GridSize, number> = {
  3: 35,  // 3x3: 35회
  4: 80,  // 4x4: 80회
  5: 220, // 5x5: 220회
};

export interface UsePuzzleGameReturn {
  gridSize: GridSize;
  board: Board;
  status: GameStatus;
  challengeMode: GameChallengeMode;
  moveCount: number;
  elapsedTime: number;
  remainingTime: number;
  remainingMoves: number;
  emptyIndex: number;
  isWon: boolean;
  isGameOver: boolean;
  canUndo: boolean;
  usedUndoCount: number;
  isAutoSolved: boolean;
  moveHistory: Board[];
  changeGridSize: (size: GridSize) => void;
  changeChallengeMode: (mode: GameChallengeMode) => void;
  startNewGame: (targetSize?: unknown) => void;
  startSeededGame: (board: Board, size?: GridSize) => void;
  resetGame: () => void;
  autoSolveGame: () => void;
  undoMove: () => boolean;
  moveTile: (index: number) => boolean;
  moveByDirection: (direction: MoveDirection) => boolean;
  isTileMovable: (index: number) => boolean;
}

export function usePuzzleGame(initialSize: GridSize = 4): UsePuzzleGameReturn {
  const [gridSize, setGridSize] = useState<GridSize>(initialSize);
  const [board, setBoard] = useState<Board>(() => generateSolvedBoard(initialSize));
  const [status, setStatus] = useState<GameStatus>('idle');
  const [challengeMode, setChallengeMode] = useState<GameChallengeMode>('standard');
  const [moveCount, setMoveCount] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [usedUndoCount, setUsedUndoCount] = useState<number>(0);
  const [isAutoSolved, setIsAutoSolved] = useState<boolean>(false);
  const [moveHistory, setMoveHistory] = useState<Board[]>(() => [generateSolvedBoard(initialSize)]);

  const prevStatusRef = useRef<GameStatus>(status);

  // Time Attack & Move Limit thresholds
  const timeLimit = TIME_LIMITS[gridSize];
  const moveLimit = MOVE_LIMITS[gridSize];

  const remainingTime = Math.max(0, timeLimit - elapsedTime);
  const remainingMoves = Math.max(0, moveLimit - moveCount);

  // 빈 칸(value === 0) 인덱스 계산
  const emptyIndex = board.findIndex((tile) => tile.isEmpty);

  // 특정 타일이 현재 빈 칸과 인접하여 이동 가능한지 여부
  const isTileMovable = useCallback(
    (index: number) => {
      if (emptyIndex === -1 || status === 'won' || status === 'gameover') return false;
      return isAdjacent(index, emptyIndex, gridSize);
    },
    [emptyIndex, gridSize, status]
  );

  // 승리/게임오버 상태 감지 시 사운드 및 햅틱 피드백
  useEffect(() => {
    if (status === 'won' && prevStatusRef.current !== 'won') {
      audioManager.playSfx('victory');
      triggerHaptic('victory');
    } else if (status === 'gameover' && prevStatusRef.current !== 'gameover') {
      audioManager.playSfx('blocked');
      triggerHaptic('error');
    }
    prevStatusRef.current = status;
  }, [status]);

  // 타이머 작동 및 타임어택 제한 시간 만료 체크
  useEffect(() => {
    let intervalId: number | null = null;

    if (status === 'playing') {
      intervalId = window.setInterval(() => {
        setElapsedTime((prev) => {
          const next = prev + 1;
          // 타임어택 모드에서 시간 초과 검사
          if (challengeMode === 'timeAttack' && next >= timeLimit) {
            setStatus('gameover');
          }
          return next;
        });
      }, 1000);
    }

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [status, challengeMode, timeLimit]);

  // 새 게임 시작 (셔플)
  const startNewGame = useCallback(
    (targetSize?: unknown) => {
      audioManager.playSfx('shuffle');
      audioManager.playBgm();
      const validSize: GridSize =
        typeof targetSize === 'number' && [3, 4, 5].includes(targetSize)
          ? (targetSize as GridSize)
          : gridSize;
      setGridSize(validSize);
      const shuffled = shuffleBoard(validSize);
      setBoard(shuffled);
      setMoveCount(0);
      setElapsedTime(0);
      setUsedUndoCount(0);
      setMoveHistory([shuffled]);
      setIsAutoSolved(false);
      setStatus('playing');
    },
    [gridSize]
  );

  // 시드/일일 챌린지 또는 특정 초기 보드로 게임 시작
  const startSeededGame = useCallback(
    (seededBoard: Board, size?: GridSize) => {
      audioManager.playSfx('shuffle');
      audioManager.playBgm();
      if (size && [3, 4, 5].includes(size)) {
        setGridSize(size);
      }
      setBoard(seededBoard);
      setMoveCount(0);
      setElapsedTime(0);
      setUsedUndoCount(0);
      setMoveHistory([seededBoard]);
      setIsAutoSolved(false);
      setStatus('playing');
    },
    []
  );

  // 그리드 크기 변경
  const changeGridSize = useCallback((newSize: GridSize) => {
    audioManager.playSfx('click');
    audioManager.playBgm();
    setGridSize(newSize);
    const shuffled = shuffleBoard(newSize);
    setBoard(shuffled);
    setMoveCount(0);
    setElapsedTime(0);
    setUsedUndoCount(0);
    setMoveHistory([shuffled]);
    setIsAutoSolved(false);
    setStatus('playing');
  }, []);

  // 챌린지 모드 변경
  const changeChallengeMode = useCallback((mode: GameChallengeMode) => {
    audioManager.playSfx('click');
    setChallengeMode(mode);
  }, []);

  // 보드 초기화 (정답 상태로 리셋)
  const resetGame = useCallback(() => {
    audioManager.playSfx('click');
    const solved = generateSolvedBoard(gridSize);
    setBoard(solved);
    setMoveCount(0);
    setElapsedTime(0);
    setUsedUndoCount(0);
    setMoveHistory([solved]);
    setIsAutoSolved(false);
    setStatus('idle');
  }, [gridSize]);

  // 임시 자동 클리어 (문제를 풀어 클리어한 것과 동일 처리)
  const autoSolveGame = useCallback(() => {
    setBoard(generateSolvedBoard(gridSize));
    setMoveCount((prev) => (prev > 0 ? prev : Math.max(10, gridSize * 4)));
    setElapsedTime((prev) => (prev > 0 ? prev : 12));
    setIsAutoSolved(true);
    setStatus('won');
  }, [gridSize]);

  // 1수 되돌리기 (Undo)
  const undoMove = useCallback((): boolean => {
    if (moveHistory.length <= 1 || status === 'won' || status === 'gameover') {
      audioManager.playSfx('blocked');
      return false;
    }

    audioManager.playSfx('click');
    triggerHaptic('click');

    const newHistory = [...moveHistory];
    newHistory.pop(); // Remove current state
    const prevState = newHistory[newHistory.length - 1];

    setBoard(prevState);
    setMoveHistory(newHistory);
    setMoveCount((prev) => prev + 1); // Penalty +1 move
    setUsedUndoCount((prev) => prev + 1);

    return true;
  }, [moveHistory, status]);

  // 타일 이동 로직
  const moveTile = useCallback(
    (index: number): boolean => {
      if (status === 'won' || status === 'gameover' || index === emptyIndex) {
        audioManager.playSfx('blocked');
        return false;
      }

      if (!isAdjacent(index, emptyIndex, gridSize)) {
        audioManager.playSfx('blocked');
        return false;
      }

      // 유효한 이동: 슬라이드 효과음, BGM 및 햅틱 피드백
      audioManager.playSfx('slide');
      audioManager.playBgm();
      triggerHaptic('slide');

      // 만약 idle 상태에서 첫 이동이면 바로 playing 상태로 전환
      if (status === 'idle') {
        setStatus('playing');
      }

      const newBoard = swapTiles(board, index, emptyIndex);
      const nextMoveCount = moveCount + 1;

      setBoard(newBoard);
      setMoveCount(nextMoveCount);
      setMoveHistory((prev) => (prev.length === 0 ? [board, newBoard] : [...prev, newBoard]));

      // 이동수 제한 모드에서 한도 초과 검사
      if (challengeMode === 'moveLimit' && nextMoveCount >= moveLimit && !checkWinCondition(newBoard)) {
        setStatus('gameover');
        return true;
      }

      // 승리 판정
      if (checkWinCondition(newBoard)) {
        setStatus('won');
      }

      return true;
    },
    [board, emptyIndex, gridSize, status, moveCount, challengeMode, moveLimit]
  );

  // 키보드 방향키 이동
  const moveByDirection = useCallback(
    (direction: MoveDirection): boolean => {
      if (emptyIndex === -1 || status === 'won' || status === 'gameover') return false;

      const emptyRow = Math.floor(emptyIndex / gridSize);
      const emptyCol = emptyIndex % gridSize;

      let targetIndex = -1;

      switch (direction) {
        case 'UP':
          if (emptyRow < gridSize - 1) {
            targetIndex = (emptyRow + 1) * gridSize + emptyCol;
          }
          break;
        case 'DOWN':
          if (emptyRow > 0) {
            targetIndex = (emptyRow - 1) * gridSize + emptyCol;
          }
          break;
        case 'LEFT':
          if (emptyCol < gridSize - 1) {
            targetIndex = emptyRow * gridSize + (emptyCol + 1);
          }
          break;
        case 'RIGHT':
          if (emptyCol > 0) {
            targetIndex = emptyRow * gridSize + (emptyCol - 1);
          }
          break;
      }

      if (targetIndex !== -1) {
        return moveTile(targetIndex);
      } else {
        audioManager.playSfx('blocked');
      }

      return false;
    },
    [emptyIndex, gridSize, moveTile, status]
  );

  return {
    gridSize,
    board,
    status,
    challengeMode,
    moveCount,
    elapsedTime,
    remainingTime,
    remainingMoves,
    emptyIndex,
    isWon: status === 'won',
    isGameOver: status === 'gameover',
    canUndo: moveHistory.length > 1 && status === 'playing',
    usedUndoCount,
    isAutoSolved,
    moveHistory,
    changeGridSize,
    changeChallengeMode,
    startNewGame,
    startSeededGame,
    resetGame,
    autoSolveGame,
    undoMove,
    moveTile,
    moveByDirection,
    isTileMovable,
  };
}
