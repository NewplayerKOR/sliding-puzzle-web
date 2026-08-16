import React from 'react';
import {
  Sparkles,
  Camera,
  Flame,
  Clock,
  Footprints,
  Shield,
  RotateCcw,
} from 'lucide-react';
import { GameChallengeMode, GridSize } from '../../types/puzzle';
import { audioManager } from '../../utils/audioManager';
import { useTranslation } from '../../i18n/useTranslation';
import { getAssetUrl } from '../../utils/assetPath';
import './Controls.css';

interface ControlsProps {
  gridSize: GridSize;
  challengeMode: GameChallengeMode;
  showNumberOverlay: boolean;
  isAiCalculating: boolean;
  aiCooldown: number;
  canUndo?: boolean;
  usedUndoCount?: number;
  onUndo?: () => void;
  onSelectGridSize?: (size: GridSize) => void;
  onSelectChallengeMode?: (mode: GameChallengeMode) => void;
  onToggleNumberOverlay: () => void;
  onOpenThemeModal: () => void;
  onOpenHintModal: () => void;
  onOpenCustomImageModal: () => void;
  onOpenDailyModal: () => void;
  onOpenAchievementModal: () => void;
  onRequestAiHint: () => void;
  onShuffle: () => void;
  onReset: () => void;
  onAutoSolve?: () => void;
}

export const Controls: React.FC<ControlsProps> = ({
  gridSize,
  challengeMode,
  showNumberOverlay,
  isAiCalculating,
  aiCooldown,
  canUndo,
  usedUndoCount,
  onUndo,
  onToggleNumberOverlay,
  onOpenThemeModal,
  onOpenHintModal,
  onOpenCustomImageModal,
  onOpenDailyModal,
  onOpenAchievementModal,
  onRequestAiHint,
  onShuffle,
  onReset,
  onAutoSolve,
}) => {
  const { t } = useTranslation();

  const handleAction = (action: () => void) => {
    audioManager.playSfx('click');
    action();
  };

  const getModeLabel = () => {
    if (challengeMode === 'timeAttack') return t.modeTimeAttack;
    if (challengeMode === 'moveLimit') return t.modeMoveLimit;
    return t.modeStandard;
  };

  const getSizeLabel = () => {
    if (gridSize === 3) return t.sizeEasy;
    if (gridSize === 4) return t.sizeNormal;
    return t.sizeHard;
  };

  return (
    <div className="game-controls">
      {/* 1. 고정된 현재 모드 & 난이도 인포 바 (인게임 변경 잠금) */}
      <div className="ingame-locked-info-bar">
        <div className={`locked-mode-pill ${challengeMode}`}>
          {challengeMode === 'timeAttack' ? (
            <Clock size={15} />
          ) : challengeMode === 'moveLimit' ? (
            <Footprints size={15} />
          ) : (
            <Shield size={15} />
          )}
          <span className="pill-title">{getModeLabel()}</span>
          <span className="pill-divider">•</span>
          <span className="pill-size">{getSizeLabel()}</span>
        </div>
      </div>

      {/* 2. 스마트 AI 힌트 & 유틸리티 툴바 (4등분 그리드) */}
      <div className="feature-tools-row" role="toolbar" aria-label="고급 기능 툴바">
        {/* AI 스마트 힌트 (3초 쿨다운) */}
        <button
          type="button"
          className={`btn-feature-tool btn-ai-hint ${isAiCalculating ? 'calculating' : ''} ${aiCooldown > 0 ? 'cooldown' : ''}`}
          onClick={() => handleAction(onRequestAiHint)}
          disabled={isAiCalculating || aiCooldown > 0}
          title={aiCooldown > 0 ? `${t.aiHintCooldown} (${aiCooldown}s)` : t.aiHint}
        >
          <Sparkles size={16} className={isAiCalculating ? 'spinning' : ''} />
          <span>
            {isAiCalculating
              ? t.aiHintCalculating
              : aiCooldown > 0
              ? `${aiCooldown}s`
              : t.aiHint}
          </span>
        </button>

        {/* 내 사진 업로드 */}
        <button
          type="button"
          className="btn-feature-tool"
          onClick={() => handleAction(onOpenCustomImageModal)}
          title={t.customPhoto}
        >
          <Camera size={16} />
          <span>{t.customPhoto}</span>
        </button>

        {/* 일일 챌린지 캘린더 */}
        <button
          type="button"
          className="btn-feature-tool btn-daily"
          onClick={() => handleAction(onOpenDailyModal)}
          title={t.dailyChallenge}
        >
          <Flame size={16} />
          <span>{t.dailyChallenge}</span>
        </button>

        {/* 12종 업적 도감 */}
        <button
          type="button"
          className="btn-feature-tool btn-achievement"
          onClick={() => handleAction(onOpenAchievementModal)}
          title={t.achievements}
        >
          <img
            src={getAssetUrl('assets/icons/badge_trophy.png')}
            alt="업적"
            className="toolbar-icon-img"
          />
          <span>{t.achievements}</span>
        </button>
      </div>

      {/* 3. 모드 및 테마 설정 줄 (4등분 툴바) */}
      <div className="toolbar-row" role="toolbar" aria-label="보조 설정">
        {/* 되돌리기 (Undo) */}
        {onUndo && (
          <button
            type="button"
            className="toolbar-btn"
            onClick={() => handleAction(onUndo)}
            disabled={!canUndo}
            title={usedUndoCount !== undefined && usedUndoCount > 0 ? `${t.undo} (${usedUndoCount})` : t.undo}
          >
            <RotateCcw size={16} />
            <span>{t.undo}</span>
          </button>
        )}

        {/* 테마 선택 모달 */}
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => handleAction(onOpenThemeModal)}
          title={t.themeSelect}
        >
          <img
            src={getAssetUrl('assets/icons/icon_theme_selector.png')}
            alt="테마 선택"
            className="toolbar-icon-img"
          />
          <span>{t.themeSelect}</span>
        </button>

        {/* 완성본 미리보기 모달 */}
        <button
          type="button"
          className="toolbar-btn"
          onClick={() => handleAction(onOpenHintModal)}
          title={t.previewHint}
        >
          <img
            src={getAssetUrl('assets/icons/icon_hint.png')}
            alt="미리보기"
            className="toolbar-icon-img"
          />
          <span>{t.previewHint}</span>
        </button>

        {/* 번호 힌트 오버레이 토글 */}
        <button
          type="button"
          className={`toolbar-btn ${showNumberOverlay ? 'active-mode' : ''}`}
          onClick={() => handleAction(onToggleNumberOverlay)}
          title={t.numberHint}
        >
          <img
            src={getAssetUrl('assets/icons/icon_number_toggle.png')}
            alt="번호 힌트"
            className="toolbar-icon-img"
          />
          <span>{t.numberHint}</span>
        </button>
      </div>

      {/* 4. 게임 액션 버튼 줄 (새 게임 셔플, 정답 보기 리셋, 자동 클리어) - 3등분 그리드 */}
      <div className="action-buttons">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => handleAction(onShuffle)}
          title={t.newGame}
        >
          <img
            src={getAssetUrl('assets/icons/icon_play.png')}
            alt="새 게임"
            className="action-icon-img"
          />
          <span>{t.newGame}</span>
        </button>

        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => handleAction(onReset)}
          title={t.resetBoard}
        >
          <img
            src={getAssetUrl('assets/icons/icon_reset.png')}
            alt="정답 보기"
            className="action-icon-img"
          />
          <span>{t.resetBoard}</span>
        </button>

        {onAutoSolve && !import.meta.env.PROD && (
          <button
            type="button"
            className="btn btn-autoclear"
            onClick={() => handleAction(onAutoSolve)}
            title={t.autoClear}
          >
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="자동 클리어"
              className="action-icon-img"
            />
            <span>{t.autoClear}</span>
          </button>
        )}
      </div>
    </div>
  );
};
