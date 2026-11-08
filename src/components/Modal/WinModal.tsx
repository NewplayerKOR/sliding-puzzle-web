import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Timer, Footprints, Trophy, Star, Play, Pause, RotateCcw, Share2 } from 'lucide-react';
import { Board, GridSize, GameChallengeMode } from '../../types/puzzle';
import { shareOrDownloadResult } from '../../utils/shareCardGenerator';
import { useTranslation } from '../../i18n/useTranslation';
import { calculateStars } from '../../utils/starCalculator';
import { getAssetUrl } from '../../utils/assetPath';
import { formatMessage } from '../../i18n/format';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import './WinModal.css';

interface WinModalProps {
  isOpen: boolean;
  moveCount: number;
  elapsedTime: number;
  gridSize: GridSize;
  challengeMode?: GameChallengeMode;
  isNewRecord?: boolean;
  moveHistory?: Board[];
  themeName?: string;
  themeImageSrc?: string;
  onPlayAgain: () => void;
  onNextLevel: (nextSize: GridSize) => void;
  onNotify?: (msg: string) => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  moveCount,
  elapsedTime,
  gridSize,
  challengeMode = 'standard',
  isNewRecord = false,
  moveHistory = [],
  themeName = 'Theme',
  themeImageSrc = getAssetUrl('assets/images/theme_nature.png'),
  onPlayAgain,
  onNextLevel,
  onNotify = () => {},
}) => {

  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(isOpen, contentRef);

  // Replay timelapse state
  const [showReplay, setShowReplay] = useState<boolean>(false);
  const [replayStep, setReplayStep] = useState<number>(0);
  const [isPlayingReplay, setIsPlayingReplay] = useState<boolean>(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(200); // ms per step

  useEffect(() => {
    if (isOpen) {
      // 승리 축하 Confetti는 1회성 피드백으로 유지하되, reduced motion에서는 생략함
      const reduceMotion =
        typeof window.matchMedia === 'function' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!reduceMotion) {
        const duration = 2.5 * 1000;
        const animationEnd = Date.now() + duration;

        const frame = () => {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.7 },
            colors: ['#BB3E0B', '#D9480F', '#22221D', '#F2B892', '#F7F7F3'],
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.7 },
            colors: ['#BB3E0B', '#D9480F', '#22221D', '#F2B892', '#F7F7F3'],
          });

          if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
          }
        };

        frame();
      }

      setShowReplay(false);
      setReplayStep(0);
      setIsPlayingReplay(false);
    }
  }, [isOpen]);

  // Replay interval timer
  useEffect(() => {
    let timer: number | null = null;
    if (isPlayingReplay && moveHistory.length > 0) {
      timer = window.setInterval(() => {
        setReplayStep((prev) => {
          if (prev >= moveHistory.length - 1) {
            setIsPlayingReplay(false);
            return prev;
          }
          return prev + 1;
        });
      }, replaySpeed);
    }
    return () => {
      if (timer !== null) clearInterval(timer);
    };
  }, [isPlayingReplay, moveHistory.length, replaySpeed]);

  if (!isOpen) return null;

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 투명하고 정밀한 별점 및 피드백 텍스트 산출
  const { stars, feedbackKey } = calculateStars({
    gridSize,
    challengeMode,
    moveCount,
    elapsedTime,
  });

  const nextSize: GridSize | null = gridSize === 3 ? 4 : gridSize === 4 ? 5 : null;

  const handleShareCard = () => {
    shareOrDownloadResult(
      {
        gridSize,
        moveCount,
        elapsedTime,
        stars,
        themeName,
        themeImageSrc,
      },
      onNotify
    );
  };

  const currentReplayBoard =
    moveHistory.length > 0 && replayStep < moveHistory.length
      ? moveHistory[replayStep]
      : null;

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={contentRef} className="modal-content" tabIndex={-1}>
        {/* 클리어 트로피 */}
        <div className="modal-trophy-wrapper">
          <Trophy size={36} className="win-trophy-icon" aria-hidden="true" />
        </div>

        {isNewRecord && (
          <div className="new-record-badge" role="status">
            <span>{t.newRecord}</span>
          </div>
        )}

        <h2 id="modal-title" className="modal-title">
          {t.winTitle}
        </h2>
        <p className="modal-subtitle">
          {formatMessage(t.winSubtitle, { size: gridSize })}
        </p>

        {/* 클리어 별점 (0~3성) 및 조건 피드백 */}
        <div
          className="stars-sprite-wrapper"
          aria-label={formatMessage(t.starsEarnedLabel, { stars })}
        >
          <div className="win-stars-row">
            {[1, 2, 3].map((index) => (
              <Star
                key={index}
                size={32}
                className={index <= stars ? 'win-star-earned' : 'win-star-empty'}
                fill={index <= stars ? 'currentColor' : 'none'}
                aria-hidden="true"
              />
            ))}
          </div>
          <p className="win-star-criteria-text">{t[feedbackKey]}</p>
        </div>

        <div className="modal-stats-grid">
          <div className="modal-stat-box">
            <div className="stat-label-group">
              <Footprints size={16} />
              <span>{t.totalMoves}</span>
            </div>
            <span className="stat-main-value u-numeric">
              {formatMessage(t.moveCountValue, { count: moveCount })}
            </span>
          </div>

          <div className="modal-stat-box">
            <div className="stat-label-group">
              <Timer size={16} />
              <span>{t.timeElapsed}</span>
            </div>
            <span className="stat-main-value u-numeric">{formatTime(elapsedTime)}</span>
          </div>
        </div>

        {/* Timelapse Replay Toggle Section */}
        {moveHistory.length > 1 && (
          <div className="replay-timelapse-section">
            {!showReplay ? (
              <button
                type="button"
                className="btn-open-replay"
                onClick={() => {
                  setShowReplay(true);
                  setReplayStep(0);
                  setIsPlayingReplay(true);
                }}
              >
                <Play size={16} />
                <span>
                  {t.replayTimelapse} (
                  {formatMessage(t.replayOpen, { count: moveHistory.length - 1 })})
                </span>
              </button>
            ) : (
              <div className="replay-player-box">
                <div className="replay-header">
                  <span className="replay-title">{t.replayTimelapse}</span>
                  <span className="replay-step-info">
                    {formatMessage(t.replayStepInfo, {
                      current: replayStep,
                      total: moveHistory.length - 1,
                    })}
                  </span>
                </div>

                {/* Mini Replay Board */}
                {currentReplayBoard && (
                  <div
                    className="replay-mini-board"
                    style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
                  >
                    {currentReplayBoard.map((tile) => (
                      <div
                        key={tile.id}
                        className={`mini-tile ${tile.isEmpty ? 'mini-empty' : ''}`}
                      >
                        {!tile.isEmpty && tile.value}
                      </div>
                    ))}
                  </div>
                )}

                {/* Player Controls */}
                <div className="replay-controls-row">
                  <button
                    type="button"
                    className="replay-btn"
                    onClick={() => setIsPlayingReplay(!isPlayingReplay)}
                  >
                    {isPlayingReplay ? <Pause size={16} /> : <Play size={16} />}
                    <span>{isPlayingReplay ? t.replayPause : t.replayPlay}</span>
                  </button>

                  <button
                    type="button"
                    className="replay-btn"
                    onClick={() => {
                      setReplayStep(0);
                      setIsPlayingReplay(true);
                    }}
                  >
                    <RotateCcw size={16} />
                    <span>{t.replayReset}</span>
                  </button>

                  <button
                    type="button"
                    className="replay-btn speed"
                    onClick={() => setReplaySpeed(replaySpeed === 200 ? 100 : 200)}
                  >
                    <span>{replaySpeed === 200 ? '1x' : '2x'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Share & Action Buttons */}
        <div className="share-actions-row">
          <button type="button" className="btn-share-result" onClick={handleShareCard}>
            <Share2 size={16} />
            <span>{t.shareResult}</span>
          </button>
        </div>

        <div className="modal-actions">
          <button type="button" className="modal-btn btn-retry" onClick={() => onPlayAgain()}>
            <RotateCcw size={16} aria-hidden="true" />
            <span>{t.playAgain}</span>
          </button>

          {nextSize && (
            <button
              type="button"
              className="modal-btn btn-next"
              onClick={() => onNextLevel(nextSize)}
            >
              <span>{nextSize}×{nextSize} {t.nextLevel}</span>
              <Play size={16} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
