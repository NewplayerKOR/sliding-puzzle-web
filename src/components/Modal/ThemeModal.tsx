import React, { useState, useEffect, useRef } from 'react';
import { X, Check } from 'lucide-react';
import { ThemeId, GameMode } from '../../types/theme';
import { GameChallengeMode, GridSize } from '../../types/puzzle';
import { THEME_LIST, localizeTheme } from '../../utils/themeData';
import { getAssetUrl } from '../../utils/assetPath';
import { useTranslation } from '../../i18n/useTranslation';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import './ThemeModal.css';

export interface PendingModeInfo {
  mode: GameChallengeMode;
  size: GridSize;
  isDaily?: boolean;
}

interface ThemeModalProps {
  isOpen: boolean;
  currentThemeId: ThemeId;
  currentGameMode: GameMode;
  pendingModeInfo?: PendingModeInfo | null;
  onSelectTheme: (id: ThemeId, mode: GameMode) => void;
  onModeChange?: (mode: GameMode) => void;
  onConfirmStart?: (id: ThemeId, mode: GameMode) => void;
  onClose: () => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  currentThemeId,
  currentGameMode,
  pendingModeInfo,
  onSelectTheme,
  onModeChange,
  onConfirmStart,
  onClose,
}) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<ThemeId>(currentThemeId);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(currentGameMode);

  useModalFocusTrap(isOpen, contentRef);

  useEffect(() => {
    if (isOpen) {
      setSelectedThemeId(currentThemeId);
      setSelectedGameMode(currentGameMode);
    }
  }, [isOpen, currentThemeId, currentGameMode]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCardClick = (id: ThemeId) => {
    setSelectedThemeId(id);
    // 게임 중 즉시 테마를 바꿀 때만 적용하고, 시작 전 선택은 확정 시 반영함
    if (!pendingModeInfo) {
      onSelectTheme(id, selectedGameMode);
      onClose();
    }
  };

  const handleModeToggle = (mode: GameMode) => {
    setSelectedGameMode(mode);
    // 게임 중 모드 전환은 테마·커스텀 이미지를 유지함
    if (!pendingModeInfo) {
      if (onModeChange) {
        onModeChange(mode);
      } else {
        onSelectTheme(selectedThemeId, mode);
      }
    }
  };

  const handleStartGame = () => {
    onSelectTheme(selectedThemeId, selectedGameMode);
    if (onConfirmStart) {
      onConfirmStart(selectedThemeId, selectedGameMode);
    } else {
      onClose();
    }
  };


  const getModeBadgeText = () => {
    if (!pendingModeInfo) return null;
    if (pendingModeInfo.isDaily) {
      return `🔥 ${t.dailyChallenge} (4×4)`;
    }
    const modeName =
      pendingModeInfo.mode === 'timeAttack'
        ? `⚡ ${t.modeTimeAttack}`
        : pendingModeInfo.mode === 'moveLimit'
        ? `👣 ${t.modeMoveLimit}`
        : `🛡️ ${t.modeStandard}`;
    return `${modeName} • ${pendingModeInfo.size}×${pendingModeInfo.size}`;
  };

  return (
    <div
      className="theme-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-modal-title"
    >
      <div
        ref={contentRef}
        className="theme-modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="theme-modal-header">
          <div className="theme-title-group">
            <img
              src={getAssetUrl('assets/icons/icon_theme_selector.png')}
              alt={t.themeSelect}
              className="modal-header-icon-img"
            />
            <h3 id="theme-modal-title" className="theme-modal-title">
              {t.themeModalTitle}
            </h3>
          </div>
          <button
            type="button"
            className="theme-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Mode Info Badge (When launched from title screen) */}
        {pendingModeInfo ? (
          <div className="theme-pending-mode-badge">
            <span className="pending-badge-label">{t.selectedModeLabel}</span>
            <strong className="pending-badge-val">{getModeBadgeText()}</strong>
          </div>
        ) : (
          <p className="theme-modal-subtitle">{t.themeModalSubtitle}</p>
        )}

        {/* Game Mode Toggle */}
        <div className="theme-modal-mode-toggle">
          <button
            type="button"
            className={`mode-toggle-btn ${selectedGameMode === 'image' ? 'active' : ''}`}
            onClick={() => handleModeToggle('image')}
          >
            {t.imageMode}
          </button>
          <button
            type="button"
            className={`mode-toggle-btn ${selectedGameMode === 'number' ? 'active' : ''}`}
            onClick={() => handleModeToggle('number')}
          >
            {t.numberMode}
          </button>
        </div>

        <div className="theme-grid">
          {THEME_LIST.map((themeDefinition) => {
            const theme = localizeTheme(themeDefinition, t);
            const isSelected = theme.id === selectedThemeId;
            return (
              <button
                key={theme.id}
                type="button"
                className={`theme-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleCardClick(theme.id)}
              >
                <div className="theme-thumbnail-wrapper">
                  <img
                    src={theme.imagePath}
                    alt={theme.name}
                    className="theme-thumbnail"
                  />
                  {isSelected && (
                    <div className="theme-selected-badge" aria-label={t.selected}>
                      <Check size={16} />
                    </div>
                  )}
                </div>
                <div className="theme-card-info">
                  <div className="theme-card-header">
                    <span className="theme-name">{theme.name}</span>
                    <span className="theme-category">{theme.category}</span>
                  </div>
                  <p className="theme-desc">{theme.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Start Game Button (Pre-game flow) */}
        {pendingModeInfo && (
          <div className="theme-modal-footer">
            <button
              type="button"
              className="btn-theme-start-game"
              onClick={handleStartGame}
            >
              <img
                src={getAssetUrl('assets/icons/icon_play.png')}
                alt={t.startPlay}
                className="action-icon-img"
              />
              <span>{t.themeStart}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
