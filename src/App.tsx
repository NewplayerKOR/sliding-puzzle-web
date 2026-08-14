import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import { AchievementToast } from './components/Achievement/AchievementToast';
import { PwaInstallBanner } from './components/PWA/PwaInstallBanner';
import { GameMode, ThemeId, Theme } from './types/theme';
import { GameChallengeMode, GridSize } from './types/puzzle';
import { THEMES, DEFAULT_THEME_ID } from './utils/themeData';
import { getBestRecords, saveBestRecord } from './utils/recordStorage';
import { useAssetPreloader } from './hooks/useAssetPreloader';
import { audioManager } from './utils/audioManager';
import { findNextOptimalMove, AISolutionStep } from './utils/aiSolver';
import { generateDailyBoard, saveDailyCompletion, getDailyStreakData, getTodayDateString } from './utils/dailyChallenge';
import { checkGameCompletionAchievements } from './utils/achievementManager';
import { calculateStars } from './utils/starCalculator';
import './styles/App.css';

export const App: React.FC = () => {
  // 에셋 백그라운드 사전 로드 (테마 변경 시 깜빡임 완전 제거)
  useAssetPreloader();

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
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sliding_puzzle_custom_image');
    }
    return null;
  });
  const [isDailyGameActive, setIsDailyGameActive] = useState<boolean>(false);
  const [showNumberOverlay, setShowNumberOverlay] = useState<boolean>(true);

  // 모달 제어 상태
  const [isHintOpen, setIsHintOpen] = useState<boolean>(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState<boolean>(false);
  const [isCustomImageModalOpen, setIsCustomImageModalOpen] = useState<boolean>(false);
  const [isDailyModalOpen, setIsDailyModalOpen] = useState<boolean>(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState<boolean>(false);
  const [isBgmModalOpen, setIsBgmModalOpen] = useState<boolean>(false);
  const [pendingGameStart, setPendingGameStart] = useState<{
    mode: GameChallengeMode;
    size: GridSize;
    isDaily?: boolean;
  } | null>(null);

  // AI 힌트 상태
  const [aiHint, setAiHint] = useState<AISolutionStep | null>(null);
  const [isAiCalculating, setIsAiCalculating] = useState<boolean>(false);
  const [aiCooldown, setAiCooldown] = useState<number>(0);
  const solverWorkerRef = useRef<Worker | null>(null);
  const latestRequestIdRef = useRef<number>(0);

  // 최고 기록 및 토스트 알림 상태
  const [bestRecords, setBestRecords] = useState(() => getBestRecords());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Web Worker 초기화
  useEffect(() => {
    try {
      solverWorkerRef.current = new Worker(
        new URL('./workers/solver.worker.ts', import.meta.url),
        { type: 'module' }
      );
      solverWorkerRef.current.onmessage = (e) => {
        const { result, requestId } = e.data;
        if (requestId === latestRequestIdRef.current) {
          setAiHint(result);
          setIsAiCalculating(false);
          setAiCooldown(3);
        }
      };
    } catch {
      solverWorkerRef.current = null;
    }

    return () => {
      solverWorkerRef.current?.terminate();
    };
  }, []);

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
    if (aiCooldown > 0 || isAiCalculating || status === 'won' || status === 'gameover') return;
    setIsAiCalculating(true);
    const reqId = Date.now();
    latestRequestIdRef.current = reqId;

    if (solverWorkerRef.current) {
      solverWorkerRef.current.postMessage({
        board,
        gridSize,
        requestId: reqId,
      });
    } else {
      // Fallback: Synchronous calculation
      setTimeout(() => {
        if (latestRequestIdRef.current === reqId) {
          const step = findNextOptimalMove(board, gridSize);
          setAiHint(step);
          setIsAiCalculating(false);
          setAiCooldown(3);
        }
      }, 30);
    }
  }, [aiCooldown, isAiCalculating, status, board, gridSize]);

  // 현재 테마 객체 결정 (커스텀 이미지 우선)
  const currentTheme: Theme = customImageSrc
    ? {
        id: 'nature',
        name: '내 사진 (Custom)',
        description: '사용자 정의 업로드 이미지',
        imagePath: customImageSrc,
        thumbnailPath: customImageSrc,
        category: 'photo',
      }
    : THEMES[themeId];

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

      // 일일 챌린지 클리어 기록
      if (isDailyGameActive) {
        saveDailyCompletion(getTodayDateString());
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
  }, [status, elapsedTime, moveCount, gridSize, isDailyGameActive, customImageSrc, themeId, challengeMode, usedUndoCount, isAutoSolved]);

  // 타이틀 화면에서 특정 모드로 게임 시작
  const handleStartFromTitle = (mode: GameChallengeMode, size: GridSize) => {
    setIsDailyGameActive(false);
    changeChallengeMode(mode);
    changeGridSize(size);
    setCurrentScreen('game');
  };

  // 일일 챌린지 시작 핸들러
  const handleStartDailyChallenge = () => {
    setIsDailyGameActive(true);
    changeChallengeMode('standard');
    const dailyBoard = generateDailyBoard(getTodayDateString(), 4);
    startSeededGame(dailyBoard, 4);
    setCurrentScreen('game');
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
    try {
      localStorage.removeItem('sliding_puzzle_custom_image');
    } catch {}
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
    setCustomImageSrc(dataUrl);
    setGameMode('image');
    startNewGame();
    setCurrentScreen('game');
  };

  // 토스트 메시지 노티파이어
  const handleNotify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

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

      {currentScreen === 'title' ? (
        /* 메인 타이틀 화면 */
        <TitleScreen
          currentTheme={currentTheme}
          onSelectTheme={(newTheme) => {
            try {
              localStorage.removeItem('sliding_puzzle_custom_image');
            } catch {}
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
            onReturnHome={() => {
              resetGame();
              setCurrentScreen('title');
            }}
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
                setIsDailyGameActive(false);
                changeGridSize(s);
              }}
              onSelectChallengeMode={changeChallengeMode}
              onToggleNumberOverlay={() => setShowNumberOverlay((prev) => !prev)}
              onOpenThemeModal={() => {
                try {
                  localStorage.removeItem('sliding_puzzle_custom_image');
                } catch {}
                setCustomImageSrc(null);
                setPendingGameStart(null);
                setIsThemeModalOpen(true);
              }}
              onOpenHintModal={() => setIsHintOpen(true)}
              onOpenCustomImageModal={() => setIsCustomImageModalOpen(true)}
              onOpenDailyModal={() => setIsDailyModalOpen(true)}
              onOpenAchievementModal={() => setIsAchievementModalOpen(true)}
              onRequestAiHint={handleRequestAiHint}
              onShuffle={() => {
                setIsDailyGameActive(false);
                startNewGame();
              }}
              onReset={resetGame}
              onAutoSolve={autoSolveGame}
            />

            <PuzzleBoard
              gridSize={gridSize}
              board={board}
              gameMode={gameMode}
              themeImagePath={currentTheme.imagePath}
              showNumberOverlay={showNumberOverlay}
              aiHint={aiHint}
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
          try {
            localStorage.removeItem('sliding_puzzle_custom_image');
          } catch {}
          setCustomImageSrc(null);
          setThemeId(newTheme);
          setGameMode(newMode);
          audioManager.syncThemeBgm(newTheme);
        }}
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
        isOpen={isGameOver}
        challengeMode={challengeMode}
        onRetry={() => startNewGame()}
        onViewSolution={() => resetGame()}
        onClose={() => resetGame()}
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
        onPlayAgain={startNewGame}
        onNextLevel={(next) => {
          setIsDailyGameActive(false);
          changeGridSize(next);
        }}
        onNotify={handleNotify}
      />
    </div>
  );
};

export default App;
