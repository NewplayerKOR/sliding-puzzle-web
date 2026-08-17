import React, { useState } from 'react';
import {
  Shield,
  Clock,
  Footprints,
  Flame,
  Camera,
  Globe,
  Sparkles,
  Calendar,
  Music,
} from 'lucide-react';
import { GameChallengeMode, GridSize } from '../../types/puzzle';
import { ThemeId, Theme } from '../../types/theme';
import { useTranslation } from '../../i18n/useTranslation';
import { Language } from '../../i18n/translations';
import { useAudio } from '../../hooks/useAudio';
import { getDailyStreakData } from '../../utils/dailyChallenge';
import { TIME_LIMITS, MOVE_LIMITS } from '../../hooks/usePuzzleGame';
import { getAssetUrl } from '../../utils/assetPath';
import './TitleScreen.css';

interface TitleScreenProps {
  currentTheme: Theme;
  onSelectTheme: (themeId: ThemeId) => void;
  onStartGame: (mode: GameChallengeMode, size: GridSize) => void;
  onStartDaily: () => void;
  onOpenCustomImageModal: () => void;
  onOpenDailyModal: () => void;
  onOpenAchievementModal: () => void;
  onOpenThemeModal: () => void;
  onOpenBgmModal?: () => void;
}

export const TitleScreen: React.FC<TitleScreenProps> = ({
  onStartGame,
  onStartDaily,
  onOpenCustomImageModal,
  onOpenDailyModal,
  onOpenAchievementModal,
  onOpenBgmModal,
}) => {
  const { language, changeLanguage, t } = useTranslation();
  const { bgmMuted, sfxMuted, toggleBgmMute, toggleSfxMute, playSfx } = useAudio();
  const streakData = getDailyStreakData();

  // Selected size per mode
  const [selectedMode, setSelectedMode] = useState<GameChallengeMode | 'daily'>('standard');
  const [standardSize, setStandardSize] = useState<GridSize>(4);
  const [timeAttackSize, setTimeAttackSize] = useState<GridSize>(4);
  const [moveLimitSize, setMoveLimitSize] = useState<GridSize>(4);

  const handleModeClick = (mode: GameChallengeMode, size: GridSize) => {
    setSelectedMode(mode);
    playSfx('click');
    onStartGame(mode, size);
  };

  const handleDailyClick = () => {
    setSelectedMode('daily');
    playSfx('click');
    onStartDaily();
  };

  return (
    <div className="title-screen-container">
      {/* Top Utility Bar */}
      <div className="title-top-bar">
        <div className="title-top-left">
          <button
            type="button"
            className="title-badge-btn daily"
            onClick={onOpenDailyModal}
            title={`${t.currentStreak}: ${streakData.currentStreak}${t.streakDaysSuffix}`}
          >
            <Flame size={16} className="flame-pulse" />
            <span>{streakData.currentStreak}{t.streakDaysSuffix} {t.streakBadgeText}</span>
          </button>

          <button
            type="button"
            className="title-badge-btn trophy"
            onClick={onOpenAchievementModal}
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

        <div className="title-top-right">
          {/* Language Selector */}
          <div className="title-lang-select-wrapper">
            <Globe size={14} className="title-lang-icon" />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="title-lang-select"
              aria-label="언어 선택"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Audio Controls */}
          <div className="title-audio-controls" role="group" aria-label="오디오 설정">
            {onOpenBgmModal && (
              <button
                type="button"
                className="title-audio-btn bgm-track-btn"
                onClick={() => {
                  playSfx('click');
                  onOpenBgmModal();
                }}
                title="BGM 트랙 및 사운드 설정"
                aria-label="BGM 트랙 설정"
              >
                <Music size={14} />
                <span>BGM</span>
              </button>
            )}

            <button
              type="button"
              className={`title-audio-btn ${!bgmMuted ? 'active' : 'muted'}`}
              onClick={() => {
                playSfx('click');
                toggleBgmMute();
              }}
              title={bgmMuted ? t.soundOn : t.soundOff}
              aria-label="BGM"
            >
              <img
                src={!bgmMuted ? getAssetUrl('assets/icons/icon_sound_on.png') : getAssetUrl('assets/icons/icon_sound_off.png')}
                alt="BGM"
                className="title-audio-icon-img"
              />
            </button>

            <button
              type="button"
              className={`title-audio-btn ${!sfxMuted ? 'active' : 'muted'}`}
              onClick={toggleSfxMute}
              title={sfxMuted ? t.soundOn : t.soundOff}
              aria-label="SFX"
            >
              <img
                src={!sfxMuted ? getAssetUrl('assets/icons/icon_sound_on.png') : getAssetUrl('assets/icons/icon_sound_off.png')}
                alt="SFX"
                className="title-audio-icon-img"
              />
              <span>{t.sfx}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="title-hero-section">
        <div className="title-logo-badge">
          <Sparkles size={16} className="sparkle-icon" />
          <span>PUZZLE MASTER</span>
        </div>
        <h1 className="title-main-heading">
          <span className="hero-emoji">🧩</span> {t.appTitle}
        </h1>
        <p className="title-hero-desc">{t.titleHeroSub}</p>
      </div>

      {/* 4 Mode Selection Cards Grid */}
      <div className="mode-cards-grid">
        {/* 1. 일반 모드 (Standard Mode) */}
        <div
          className={`mode-card standard ${selectedMode === 'standard' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('standard')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMode('standard'); }}
          aria-pressed={selectedMode === 'standard'}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box standard">
              <Shield size={24} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeStandard}</h2>
              <span className="mode-tag-badge">{t.sizeNormal.split(' ')[0]}</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeStandardDesc}</p>

          <div className="mode-size-pills">
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${standardSize === sz ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMode('standard');
                  setStandardSize(sz);
                }}
              >
                {sz}×{sz}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-play-mode standard"
            onClick={(e) => {
              e.stopPropagation();
              handleModeClick('standard', standardSize);
            }}
          >
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="시작"
              className="action-icon-img"
            />
            <span>{t.startPlay} ({standardSize}×{standardSize})</span>
          </button>
        </div>

        {/* 2. 타임어택 모드 (Time Attack) */}
        <div
          className={`mode-card timeattack ${selectedMode === 'timeAttack' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('timeAttack')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMode('timeAttack'); }}
          aria-pressed={selectedMode === 'timeAttack'}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box timeattack">
              <Clock size={24} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeTimeAttack}</h2>
              <span className="mode-tag-badge urgent">SPEED</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeTimeAttackDesc}</p>

          <div className="mode-size-pills">
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${timeAttackSize === sz ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMode('timeAttack');
                  setTimeAttackSize(sz);
                }}
              >
                {sz}×{sz} ({TIME_LIMITS[sz]}초)
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-play-mode timeattack"
            onClick={(e) => {
              e.stopPropagation();
              handleModeClick('timeAttack', timeAttackSize);
            }}
          >
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="시작"
              className="action-icon-img"
            />
            <span>{t.modeTimeAttack} ({TIME_LIMITS[timeAttackSize]}초 도전)</span>
          </button>
        </div>

        {/* 3. 이동 제한 모드 (Move Limit) */}
        <div
          className={`mode-card movelimit ${selectedMode === 'moveLimit' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('moveLimit')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMode('moveLimit'); }}
          aria-pressed={selectedMode === 'moveLimit'}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box movelimit">
              <Footprints size={24} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeMoveLimit}</h2>
              <span className="mode-tag-badge limit">TACTICS</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeMoveLimitDesc}</p>

          <div className="mode-size-pills">
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${moveLimitSize === sz ? 'active' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMode('moveLimit');
                  setMoveLimitSize(sz);
                }}
              >
                {sz}×{sz} ({MOVE_LIMITS[sz]}회)
              </button>
            ))}
          </div>

          <button
            type="button"
            className="btn-play-mode movelimit"
            onClick={(e) => {
              e.stopPropagation();
              handleModeClick('moveLimit', moveLimitSize);
            }}
          >
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="시작"
              className="action-icon-img"
            />
            <span>{t.modeMoveLimit} ({MOVE_LIMITS[moveLimitSize]}수 도전)</span>
          </button>
        </div>

        {/* 4. 오늘의 퍼즐 (Daily Challenge) */}
        <div
          className={`mode-card daily ${selectedMode === 'daily' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('daily')}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedMode('daily'); }}
          aria-pressed={selectedMode === 'daily'}
        >
          <div className="mode-card-header">
            <div className="mode-icon-box daily">
              <Flame size={24} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.dailyChallenge}</h2>
              <span className="mode-tag-badge streak">STREAK</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeDailyDesc}</p>

          <div className="daily-streak-preview">
            <Calendar size={16} />
            <span>{t.currentStreak}: {streakData.currentStreak}{t.streakDaysSuffix} ({t.maxStreak}: {streakData.maxStreak}{t.streakDaysSuffix})</span>
          </div>

          <button
            type="button"
            className="btn-play-mode daily"
            onClick={(e) => {
              e.stopPropagation();
              handleDailyClick();
            }}
          >
            <img
              src={getAssetUrl('assets/icons/icon_play.png')}
              alt="시작"
              className="action-icon-img"
            />
            <span>{t.dailyChallenge} 시작하기</span>
          </button>
        </div>
      </div>

      {/* Bottom Photo Custom Button */}
      <div className="title-bottom-actions">
        <button
          type="button"
          className="btn-custom-photo-hero"
          onClick={onOpenCustomImageModal}
        >
          <Camera size={18} />
          <span>📸 {t.cropModalTitle}</span>
        </button>
      </div>
    </div>
  );
};
