import React, { useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';
import { GameChallengeMode } from '../../types/puzzle';
import { useTranslation } from '../../i18n/useTranslation';
import { getAssetUrl } from '../../utils/assetPath';
import './GameOverModal.css';

interface GameOverModalProps {
  isOpen: boolean;
  challengeMode: GameChallengeMode;
  onRetry: () => void;
  onViewSolution: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  challengeMode,
  onRetry,
  onViewSolution,
  onClose,
}) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const subtitle =
    challengeMode === 'timeAttack' ? t.gameOverSubtitleTime : t.gameOverSubtitleMoves;

  return (
    <div
      className="gameover-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
    >
      <div className="gameover-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="gameover-icon-box">
          <AlertOctagon size={48} className="gameover-icon" />
        </div>

        <h2 id="gameover-title" className="gameover-title">
          {t.gameOverTitle}
        </h2>

        <p className="gameover-subtitle">{subtitle}</p>

        <div className="gameover-actions">
          <button type="button" className="btn-gameover-retry" onClick={onRetry}>
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="다시 시도"
              className="action-icon-img"
            />
            <span>{t.tryAgain}</span>
          </button>

          <button type="button" className="btn-gameover-solution" onClick={onViewSolution}>
            <img
              src={getAssetUrl('assets/icons/icon_reset.png')}
              alt="정답 확인"
              className="action-icon-img"
            />
            <span>{t.checkSolution}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

