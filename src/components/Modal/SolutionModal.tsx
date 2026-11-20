import React, { useEffect, useMemo, useRef } from 'react';
import { Eye, X } from 'lucide-react';
import { GridSize } from '../../types/puzzle';
import { GameMode } from '../../types/theme';
import { generateSolvedBoard } from '../../utils/puzzleLogic';
import { getTileSpriteStyle } from '../../utils/spriteCalculator';
import { useTranslation } from '../../i18n/useTranslation';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import './SolutionModal.css';

interface SolutionModalProps {
  isOpen: boolean;
  gridSize: GridSize;
  gameMode: GameMode;
  themeImagePath: string;
  showNumberOverlay: boolean;
  onClose: () => void;
}

/**
 * 완성된 보드를 읽기 전용으로 보여주는 미리보기 모달.
 * 실제 게임 보드·타이머·이동 수·Undo 기록은 변경하지 않는다.
 */
export const SolutionModal: React.FC<SolutionModalProps> = ({
  isOpen,
  gridSize,
  gameMode,
  themeImagePath,
  showNumberOverlay,
  onClose,
}) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const solvedBoard = useMemo(() => generateSolvedBoard(gridSize), [gridSize]);

  useModalFocusTrap(isOpen, contentRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const isPixelArtTheme = themeImagePath.includes('pixel_art');

  return (
    <div
      className="solution-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="solution-modal-title"
    >
      <div
        ref={contentRef}
        className="solution-modal-content"
        tabIndex={-1}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="solution-modal-header">
          <div className="solution-title-group">
            <Eye size={20} className="solution-icon" aria-hidden="true" />
            <h3 id="solution-modal-title" className="solution-modal-title">
              {t.checkSolution}
            </h3>
          </div>
          <button
            type="button"
            className="solution-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        <div className="solution-board-frame">
          <div
            className="solution-preview-board"
            style={{ '--grid-size': gridSize } as React.CSSProperties}
            role="img"
            aria-label={t.solutionPreviewBoard}
          >
            {solvedBoard.map((tile) => {
              if (tile.isEmpty) {
                return (
                  <div
                    key={tile.id}
                    className="solution-preview-empty"
                    aria-hidden="true"
                  />
                );
              }

              const spriteStyle =
                gameMode === 'image'
                  ? getTileSpriteStyle(tile.targetPos, gridSize, themeImagePath)
                  : undefined;
              const showNumber = gameMode === 'number' || showNumberOverlay;

              return (
                <div
                  key={tile.id}
                  className={`solution-preview-tile mode-${gameMode} ${isPixelArtTheme ? 'pixel-art' : ''}`}
                  style={spriteStyle}
                >
                  {showNumber && (
                    <span
                      className={`solution-preview-number ${gameMode === 'image' ? 'number-overlay' : ''}`}
                    >
                      {tile.value}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <p className="solution-modal-desc">{t.solutionPreviewDesc}</p>
      </div>
    </div>
  );
};
