import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import { usePuzzleGame } from './hooks/usePuzzleGame';
import { Header } from './components/Header/Header';
import { Controls } from './components/Controls/Controls';
import { PuzzleBoard } from './components/Board/PuzzleBoard';
import { TitleScreen } from './components/Title/TitleScreen';
import { WinModal } from './components/Modal/WinModal';
import { HintModal } from './components/Modal/HintModal';
import { ThemeModal } from './components/Modal/ThemeModal';
import { CustomImageModal } from './components/Modal/CustomImageModal';
import { DailyModal } from './components/Modal/DailyModal';
import { AchievementModal } from './components/Modal/AchievementModal';
import { GameOverModal } from './components/Modal/GameOverModal';
import { BgmSelectModal } from './components/Modal/BgmSelectModal';
import { SolutionModal } from './components/Modal/SolutionModal';
import { AchievementToast } from './components/Achievement/AchievementToast';
import { PwaInstallBanner } from './components/PWA/PwaInstallBanner';
import { ServiceWorkerUpdateBanner } from './components/PWA/ServiceWorkerUpdateBanner';
import { GameMode, ThemeId, Theme } from './types/theme';
import { GameChallengeMode, GridSize } from './types/puzzle';
import { getLocalizedTheme, DEFAULT_THEME_ID } from './utils/themeData';
import { getBestRecords, saveBestRecord } from './utils/recordStorage';
import { useAssetPreloader } from './hooks/useAssetPreloader';
import { useTransientToast } from './hooks/useTransientToast';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { preloadAllThemeAssets } from './utils/assetPreloader';
import { audioManager } from './utils/audioManager';
import { findNextOptimalMove, AISolutionStep } from './utils/aiSolver';
import { generateDailyBoard, saveDailyCompletion, getDailyStreakData, getTodayDateString, createBoardKey, ActiveDailyChallenge } from './utils/dailyChallenge';
import { checkGameCompletionAchievements } from './utils/achievementManager';
import { calculateStars } from './utils/starCalculator';
import { useTranslation } from './i18n/useTranslation';
import { readStorageItem, removeStorageItem } from './utils/storage';
import './styles/App.css';

const AI_HINT_TIMEOUT_MS = 5000;
const CUSTOM_IMAGE_STORAGE_KEY = 'sliding_puzzle_custom_image';
type AiHintErrorKey = 'aiHintUnavailable' | 'aiHintFailed' | 'aiHintTimeout';

export const App: React.FC = () => {
  // 언어 변경 시 App도 다시 렌더링해 테마명·공유 카드 문자열을 갱신함
  const { t } = useTranslation();

  // 화면 전환 상태 ('title' | 'game')
  const [currentScreen, setCurrentScreen] = useState<'title' | 'game'>('title');

  const {
    gridSize,
    board,
    status,
    challengeMode,
    moveCount,
    elapsedTime,
    remainingTime,
    remainingMoves,
    isWon,
    isGameOver,
    canUndo,
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
  } = usePuzzleGame(4);


  // 모드 및 테마 상태
  const [gameMode, setGameMode] = useState<GameMode>('image');
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME_ID);

  // 최초에는 코어 이미지와 현재 테마만 로드하고 나머지 테마는 지연 로드함
  useAssetPreloader(themeId);

  const [customImageSrc, setCustomImageSrc] = useState<string | null>(() => {
    const saved = readStorageItem(CUSTOM_IMAGE_STORAGE_KEY);
    return saved && saved.startsWith('data:image/') ? saved : null;
  });
  const [activeDaily, setActiveDaily] = useState<ActiveDailyChallenge | null>(null);
  const [showNumberOverlay, setShowNumberOverlay] = useState<boolean>(true);

  // 테마 변경 시 오디오 매니저의 효과음 음색 동기화
  useEffect(() => {
    audioManager.setCurrentTheme(customImageSrc ? 'nature' : themeId);
  }, [themeId, customImageSrc]);

  // 모달 제어 상태
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isCustomImageModalOpen, setIsCustomImageModalOpen] = useState<boolean>(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [isBgmModalOpen, setIsBgmModalOpen] = useState<boolean>(false);
  const [isSolutionOpen, setIsSolutionOpen] = useState<boolean>(false);
  const [pendingGameStart, setPendingGameStart] = useState<{
    mode: GameChallengeMode;
    size: GridSize;
    isDaily?: boolean;
  } | null>(null);

  // 테마 모달을 열 때만 나머지 테마 미리보기를 지연 로드해 전환 깜빡임을 방지함
  useEffect(() => {
    if (isThemeModalOpen) {
      preloadAllThemeAssets();
    }
  }, [isThemeModalOpen]);

  // 어떤 모달이든 열려 있으면 배경 콘텐츠와 보드 입력을 비활성화함
  const isAnyModalOpen =
    isHintOpen ||
    isThemeModalOpen ||
    isCustomImageModalOpen ||
    isDailyModalOpen ||
    isAchievementModalOpen ||
    isBgmModalOpen ||
    isSolutionOpen ||
    isWon ||
    isGameOver;

  // 모달이 하나라도 열려 있으면 배경 문서 스크롤을 잠금
  useBodyScrollLock(isAnyModalOpen);

  // 승리·게임오버가 발생하면 열려 있던 보조 모달을 닫아 aria-modal 다이얼로그가
  // 동시에 두 개 노출되지 않도록 함. GameOver의 정답 보기는 이 전환 이후에 열림.
  useEffect(() => {
    if (!isWon && !isGameOver) return;

    setIsHintOpen(false);
    setIsThemeModalOpen(false);
    setIsCustomImageModalOpen(false);
    setIsDailyModalOpen(false);
    setIsAchievementModalOpen(false);
    setIsBgmModalOpen(false);
    setIsSolutionOpen(false);
    setPendingGameStart(null);
  }, [isWon, isGameOver]);

  // AI 힌트 상태
  const [aiHint, setAiHint] = useState<AISolutionStep | null>(null);
  const [isAiCalculating, setIsAiCalculating] = useState<boolean>(false);
  const [aiCooldown, setAiCooldown] = useState<number>(0);
  const [aiHintError, setAiHintError] = useState<AiHintErrorKey | null>(null);
  const solverWorkerRef = useRef<Worker | null>(null);
  const latestRequestIdRef = useRef<number>(0);
  const requestSequenceRef = useRef<number>(0);
  const pendingRequestIdRef = useRef<number | null>(null);
  const aiHintTimerRef = useRef<number | null>(null);

  // 최고 기록 및 토스트 알림 상태
  const [bestRecords, setBestRecords] = useState(() => getBestRecords());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const { message: toastMessage, showToast } = useTransientToast();

  const clearAiHintTimer = useCallback(() => {
    if (aiHintTimerRef.current !== null) {
      window.clearTimeout(aiHintTimerRef.current);
      aiHintTimerRef.current = null;
    }
  }, []);

  // 진행 중인 요청을 무효화하고 오류 상태를 사용자 안내로 전환함
  const markAiHintFailure = useCallback(
    (errorKey: AiHintErrorKey) => {
      latestRequestIdRef.current += 1;
      pendingRequestIdRef.current = null;
      clearAiHintTimer();
      setIsAiCalculating(false);
      setAiCooldown(3);
      setAiHint(null);
      setAiHintError(errorKey);
    },
    [clearAiHintTimer]
  );

  const createSolverWorker = useCallback((): Worker | null => {
    try {
      const worker = new Worker(
        new URL('./workers/solver.worker.ts', import.meta.url),
        { type: 'module' }
      );

      worker.onmessage = (e: MessageEvent<{ result: AISolutionStep | null; requestId: number }>) => {
        const { result, requestId } = e.data;
        if (requestId !== latestRequestIdRef.current) return;

        if (result) {
          pendingRequestIdRef.current = null;
          clearAiHintTimer();
          setIsAiCalculating(false);
          setAiCooldown(3);
          setAiHint(result);
        } else {
          markAiHintFailure('aiHintUnavailable');
        }
      };

      const handleFailure = () => {
        const hadPendingRequest = pendingRequestIdRef.current !== null;
        // 오류가 난 Worker는 진행 중인 요청이 없어도 폐기해 다음 요청에서 새로 생성함
        worker.terminate();
        if (solverWorkerRef.current === worker) {
          solverWorkerRef.current = null;
        }
        if (hadPendingRequest) {
          markAiHintFailure('aiHintFailed');
        }
      };

      worker.onerror = () => handleFailure();
      worker.onmessageerror = () => handleFailure();

      return worker;
    } catch {
      return null;
    }
  }, [clearAiHintTimer, markAiHintFailure]);

  // Web Worker 초기화 (요청 시점에 이미 생성된 Worker는 덮어쓰지 않음)
  useEffect(() => {
    if (!solverWorkerRef.current) {
      solverWorkerRef.current = createSolverWorker();
    }

    return () => {
      clearAiHintTimer();
      solverWorkerRef.current?.terminate();
      solverWorkerRef.current = null;
    };
  }, [createSolverWorker, clearAiHintTimer]);

  // 보드·그리드·게임 상태가 바뀌면 진행 중인 힌트 요청과 표시를 즉시 무효화함
  useLayoutEffect(() => {
    latestRequestIdRef.current += 1;
    pendingRequestIdRef.current = null;
    clearAiHintTimer();
    setIsAiCalculating(false);
    setAiHint(null);
  }, [board, gridSize, status, clearAiHintTimer]);

  // 힌트 실패 사유를 현재 언어의 토스트로 표시함
  useEffect(() => {
    if (!aiHintError) return;

    showToast(t[aiHintError]);
    const timer = window.setTimeout(() => {
      setAiHintError(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [aiHintError, t, showToast]);

  // AI 힌트 쿨다운 타이머
  useEffect(() => {
    let timer: number | null = null;
    if (aiCooldown > 0) {
      timer = window.setInterval(() => {
        setAiCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => {
      if (timer !== null) clearInterval(timer);
    };
  }, [aiCooldown]);

  // 이동 발생 시 AI 힌트 가이드 자동 클리어
  const handleTileClick = useCallback(
    (index: number) => {
      setAiHint(null);
      moveTile(index);
    },
    [moveTile]
  );

  const handleMoveByDirection = useCallback(
    (dir: any) => {
      setAiHint(null);
      moveByDirection(dir);
    },
    [moveByDirection]
  );

  // AI 힌트 요청
  const handleRequestAiHint = useCallback(() => {
    if (
      aiCooldown > 0 ||
      pendingRequestIdRef.current !== null ||
      status === 'won' ||
      status === 'gameover'
    ) {
      return;
    }

    const requestId = ++requestSequenceRef.current;
    latestRequestIdRef.current = requestId;
    pendingRequestIdRef.current = requestId;
    setIsAiCalculating(true);
    setAiHint(null);
    clearAiHintTimer();

    aiHintTimerRef.current = window.setTimeout(() => {
      if (latestRequestIdRef.current !== requestId) return;
      markAiHintFailure('aiHintTimeout');
      // 응답이 멈춘 Worker는 폐기하고 다음 요청에서 새로 생성함
      solverWorkerRef.current?.terminate();
      solverWorkerRef.current = null;
    }, AI_HINT_TIMEOUT_MS);

    let worker = solverWorkerRef.current;
    if (!worker) {
      worker = createSolverWorker();
      solverWorkerRef.current = worker;
    }

    if (worker) {
      try {
        worker.postMessage({
          board,
          gridSize,
          requestId,
        });
      } catch {
        markAiHintFailure('aiHintFailed');
        worker.terminate();
        if (solverWorkerRef.current === worker) {
          solverWorkerRef.current = null;
        }
      }
      return;
    }

    // Worker를 생성할 수 없는 환경에서는 동기 계산으로 폴백함.
    // 5초 Worker 타임아웃을 먼저 취소해야 폴백 성공 후 늦게 도착한 타임아웃이 힌트를 지우지 않음.
    clearAiHintTimer();
    aiHintTimerRef.current = window.setTimeout(() => {
      if (latestRequestIdRef.current !== requestId) return;
      pendingRequestIdRef.current = null;
      clearAiHintTimer();
      setIsAiCalculating(false);
      setAiCooldown(3);

      try {
        const step = findNextOptimalMove(board, gridSize);
        if (step) {
          setAiHint(step);
        } else {
          markAiHintFailure('aiHintUnavailable');
        }
      } catch {
        markAiHintFailure('aiHintFailed');
      }
    }, 30);
  }, [
    aiCooldown,
    status,
    board,
    gridSize,
    clearAiHintTimer,
    createSolverWorker,
    markAiHintFailure,
  ]);

  // 현재 테마 객체 결정 (커스텀 이미지 우선)
  const currentTheme: Theme = customImageSrc
    ? {
        id: 'nature',
        name: t.customThemeName,
        description: t.customThemeDescription,
        imagePath: customImageSrc,
        thumbnailPath: customImageSrc,
        category: t.customThemeCategory,
      }
    : getLocalizedTheme(themeId, t);

  // 승리 시 신기록 검사, 일일 챌린지 저장 및 업적 체크 (자동 클리어 치트 방지)
  useEffect(() => {
    if (status === 'won' && elapsedTime > 0 && !isAutoSolved) {
      const { isNewRecord: recordAchieved, records: updatedRecords } = saveBestRecord(
        gridSize,
        elapsedTime,
        moveCount
      );
      setIsNewRecord(recordAchieved);
      setBestRecords(updatedRecords);

      // 일일 챌린지 클리어 기록: 시작 날짜와 실제 시작 보드가 모두 일치할 때만 저장함
      const dailyBoardMatches =
        activeDaily !== null &&
        moveHistory.length > 0 &&
        createBoardKey(moveHistory[0]) === activeDaily.boardKey;
      if (activeDaily && dailyBoardMatches) {
        saveDailyCompletion(activeDaily.date);
      }

      // 정밀 별점 계산
      const { stars } = calculateStars({
        gridSize,
        challengeMode,
        moveCount,
        elapsedTime,
      });

      // 12종 업적 달성 검사
      const streak = getDailyStreakData().currentStreak;
      checkGameCompletionAchievements({
        gridSize,
        moveCount,
        elapsedTime,
        stars,
        themeId,
        isCustomImage: Boolean(customImageSrc),
        challengeMode,
        usedUndoCount,
        streakCount: streak,
      });
    } else {
      setIsNewRecord(false);
    }
  }, [status, elapsedTime, moveCount, gridSize, activeDaily, moveHistory, customImageSrc, themeId, challengeMode, usedUndoCount, isAutoSolved]);

  // 게임을 완전히 떠날 때만 세션을 초기화함. 정답 보기는 이 함수를 호출하지 않음.
  const handleReturnHome = () => {
    setActiveDaily(null);
    setIsSolutionOpen(false);
    resetGame();
    setCurrentScreen('title');
  };

  // 새 게임을 시작하면 이전 Daily 컨텍스트를 반드시 해제함
  const handleStartNewGame = () => {
    setActiveDaily(null);
    startNewGame();
  };

  // 타이틀 화면에서 특정 모드로 게임 시작
  const handleStartFromTitle = (mode: GameChallengeMode, size: GridSize) => {
    setActiveDaily(null);
    changeChallengeMode(mode);
    changeGridSize(size);
    setCurrentScreen('game');
  };

  // 일일 챌린지 시작 핸들러
  const handleStartDailyChallenge = () => {
    const date = getTodayDateString();
    const dailyBoard = generateDailyBoard(date, 4);
    changeChallengeMode('standard');
    setActiveDaily({ date, boardKey: createBoardKey(dailyBoard) });
    startSeededGame(dailyBoard, 4);
    setCurrentScreen('game');
  };

  // 챌린지 모드를 바꾸면 Daily 보드 컨텍스트를 해제함
  const handleSelectChallengeMode = (mode: GameChallengeMode) => {
    setActiveDaily(null);
    changeChallengeMode(mode);
  };

  // 메인화면에서 모드 선택 시 테마 선택 모달을 띄우는 핸들러
  const handleRequestModeWithTheme = (mode: GameChallengeMode, size: GridSize) => {
    setPendingGameStart({ mode, size, isDaily: false });
    setIsThemeModalOpen(true);
  };

  const handleRequestDailyWithTheme = () => {
    setPendingGameStart({ mode: 'standard', size: 4, isDaily: true });
    setIsThemeModalOpen(true);
  };

  // 테마 모달에서 테마 확정 후 게임 시작
  const handleConfirmThemeStart = (selectedTheme: ThemeId, mode: GameMode) => {
    removeStorageItem(CUSTOM_IMAGE_STORAGE_KEY);
    setCustomImageSrc(null);
    setThemeId(selectedTheme);
    setGameMode(mode);
    audioManager.syncThemeBgm(selectedTheme);
    if (pendingGameStart) {
      if (pendingGameStart.isDaily) {
        handleStartDailyChallenge();
      } else {
        handleStartFromTitle(pendingGameStart.mode, pendingGameStart.size);
      }
      setPendingGameStart(null);
    }
    setIsThemeModalOpen(false);
  };

  // 커스텀 이미지 적용 핸들러
  const handleApplyCustomImage = (dataUrl: string) => {
    setActiveDaily(null);
    setCustomImageSrc(dataUrl);
    setGameMode('image');
    startNewGame();
    setCurrentScreen('game');
  };

  // 토스트 메시지 노티파이어: 새 메시지마다 이전 타이머를 정리해 3초 표시를 보장함
  const handleNotify = showToast;

  return (
    <div className="app-container">
      {/* 글로벌 업적 달성 토스트 */}
      <AchievementToast />

      {/* 액션 피드백 토스트 (결과 복사/다운로드 등) */}
      {toastMessage && (
        <div className="global-toast-banner" role="status">
          <span>{toastMessage}</span>
        </div>
      )}

      <div
        className="app-content"
        inert={isAnyModalOpen}
        aria-hidden={isAnyModalOpen ? true : undefined}
      >
        {currentScreen === 'title' ? (
          /* 메인 타이틀 화면 */
          <TitleScreen
            currentTheme={currentTheme}
            onSelectTheme={(newTheme) => {
              removeStorageItem(CUSTOM_IMAGE_STORAGE_KEY);
              setCustomImageSrc(null);
              setThemeId(newTheme);
              audioManager.syncThemeBgm(newTheme);
            }}
            onStartGame={handleRequestModeWithTheme}
            onStartDaily={handleRequestDailyWithTheme}
            onOpenCustomImageModal={() => setIsCustomImageModalOpen(true)}
            onOpenDailyModal={() => setIsDailyModalOpen(true)}
            onOpenAchievementModal={() => setIsAchievementModalOpen(true)}
            onOpenThemeModal={() => {
              setPendingGameStart(null);
              setIsThemeModalOpen(true);
            }}
            onOpenBgmModal={() => setIsBgmModalOpen(true)}
          />
        ) : (
          /* 게임 플레이 화면 */
          <main className="game-main">
            <Header
              moveCount={moveCount}
              elapsedTime={elapsedTime}
              remainingTime={remainingTime}
              remainingMoves={remainingMoves}
              status={status}
              challengeMode={challengeMode}
              gridSize={gridSize}
              bestRecord={bestRecords[gridSize]}
              onOpenDaily={() => setIsDailyModalOpen(true)}
              onOpenBgmModal={() => setIsBgmModalOpen(true)}
              onReturnHome={handleReturnHome}
            />

            <div className="game-card">
              <Controls
                gridSize={gridSize}
                challengeMode={challengeMode}
                showNumberOverlay={showNumberOverlay}
                isAiCalculating={isAiCalculating}
                aiCooldown={aiCooldown}
                canUndo={canUndo}
                usedUndoCount={usedUndoCount}
                onUndo={undoMove}
                onSelectGridSize={(s) => {
                  setActiveDaily(null);
                  changeGridSize(s);
                }}
                onSelectChallengeMode={handleSelectChallengeMode}
                onToggleNumberOverlay={() => setShowNumberOverlay((prev) => !prev)}
                onOpenThemeModal={() => {
                  // 모달을 열기만 해서는 커스텀 이미지를 유지하고, 테마 확정·변경 시에만 제거함
                  setPendingGameStart(null);
                  setIsThemeModalOpen(true);
                }}
                onOpenHintModal={() => setIsHintOpen(true)}
                onOpenCustomImageModal={() => setIsCustomImageModalOpen(true)}
                onOpenDailyModal={() => setIsDailyModalOpen(true)}
                onOpenAchievementModal={() => setIsAchievementModalOpen(true)}
                onRequestAiHint={handleRequestAiHint}
                onShuffle={handleStartNewGame}
                onViewSolution={() => setIsSolutionOpen(true)}
                onAutoSolve={autoSolveGame}
              />

              <PuzzleBoard
                gridSize={gridSize}
                board={board}
                gameMode={gameMode}
                themeImagePath={currentTheme.imagePath}
                showNumberOverlay={showNumberOverlay}
                aiHint={aiHint}
                isInputBlocked={isAnyModalOpen}
                isTileMovable={isTileMovable}
                onTileClick={handleTileClick}
                onMoveByDirection={handleMoveByDirection}
              />
            </div>
          </main>
        )}

        <footer className="app-footer">
          <p>Sliding Block Puzzle • 100% Serverless Web App • A* Engine & PWA</p>
        </footer>

        {/* PWA 설치 배너 */}
        <PwaInstallBanner />
      </div>

      {/* Service Worker 업데이트 안내 배너 */}
      <ServiceWorkerUpdateBanner />

      {/* 완성본 미리보기 모달 */}
      <HintModal
        isOpen={isHintOpen}
        theme={currentTheme}
        onClose={() => setIsHintOpen(false)}
      />

      {/* 테마 선택 모달 */}
      <ThemeModal
        isOpen={isThemeModalOpen}
        currentThemeId={themeId}
        currentGameMode={gameMode}
        pendingModeInfo={pendingGameStart}
        onSelectTheme={(newTheme, newMode) => {
          removeStorageItem(CUSTOM_IMAGE_STORAGE_KEY);
          setCustomImageSrc(null);
          setThemeId(newTheme);
          setGameMode(newMode);
          audioManager.syncThemeBgm(newTheme);
        }}
        onModeChange={(newMode) => setGameMode(newMode)}
        onConfirmStart={handleConfirmThemeStart}
        onClose={() => {
          setPendingGameStart(null);
          setIsThemeModalOpen(false);
        }}
      />

      {/* BGM 트랙 및 사운드 설정 모달 */}
      <BgmSelectModal
        isOpen={isBgmModalOpen}
        onClose={() => setIsBgmModalOpen(false)}
      />

      {/* 읽기 전용 정답 보드 미리보기 모달 */}
      <SolutionModal
        isOpen={isSolutionOpen}
        gridSize={gridSize}
        gameMode={gameMode}
        themeImagePath={currentTheme.imagePath}
        showNumberOverlay={showNumberOverlay}
        onClose={() => setIsSolutionOpen(false)}
      />

      {/* 커스텀 사진 업로드 및 1:1 크롭 모달 */}
      <CustomImageModal
        isOpen={isCustomImageModalOpen}
        onClose={() => setIsCustomImageModalOpen(false)}
        onApplyCustomImage={handleApplyCustomImage}
      />

      {/* 일일 챌린지 및 스트릭 모달 */}
      <DailyModal
        isOpen={isDailyModalOpen}
        onClose={() => setIsDailyModalOpen(false)}
        onStartDaily={handleStartDailyChallenge}
      />

      {/* 업적 및 트로피 도감 모달 */}
      <AchievementModal
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
      />

      {/* 게임오버 모달 (타임어택 / 이동제한 실패) */}
      <GameOverModal
        isOpen={isGameOver && !isSolutionOpen}
        challengeMode={challengeMode}
        onRetry={handleStartNewGame}
        onViewSolution={() => setIsSolutionOpen(true)}
        onClose={handleReturnHome}
      />

      {/* 승리 축하 및 타임랩스/공유 모달 */}
      <WinModal
        isOpen={isWon}
        moveCount={moveCount}
        elapsedTime={elapsedTime}
        gridSize={gridSize}
        challengeMode={challengeMode}
        isNewRecord={isNewRecord}
        moveHistory={moveHistory}
        themeName={currentTheme.name}
        themeImageSrc={currentTheme.imagePath}
        onPlayAgain={handleStartNewGame}
        onNextLevel={(next) => {
          setActiveDaily(null);
          changeGridSize(next);
        }}
        onNotify={handleNotify}
      />
    </div>
  );
};

export default App;
