import React, { useState } from 'react';
import {
  Shield,
  Clock,
  Footprints,
  Flame,
  Camera,
  Globe,
  Trophy,
  Calendar,
  Music,
  Volume2,
  VolumeX,
  Play,
} from 'lucide-react';
import { GameChallengeMode, GridSize } from '../../types/puzzle';
import { ThemeId, Theme } from '../../types/theme';
import { useTranslation } from '../../i18n/useTranslation';
import { Language } from '../../i18n/translations';
import { useAudio } from '../../hooks/useAudio';
import { getDailyStreakData } from '../../utils/dailyChallenge';
import { TIME_LIMITS, MOVE_LIMITS } from '../../hooks/usePuzzleGame';
import { formatMessage } from '../../i18n/format';
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
    <main className="title-screen-container">
      {/* Top Utility Bar */}
      <div className="title-top-bar">
        <div className="title-top-left">
          <button
            type="button"
            className="title-badge-btn daily"
            onClick={onOpenDailyModal}
            title={`${t.currentStreak}: ${streakData.currentStreak}${t.streakDaysSuffix}`}
          >
            <Flame size={14} />
            <span>{streakData.currentStreak}{t.streakDaysSuffix} {t.streakBadgeText}</span>
          </button>

          <button
            type="button"
            className="title-badge-btn trophy"
            onClick={onOpenAchievementModal}
            title={t.achievements}
          >
            <Trophy size={14} />
            <span>{t.achievements}</span>
          </button>
        </div>

        <div className="title-top-right">
          {/* Language Selector */}
          <label className="title-lang-select-wrapper">
            <Globe size={14} className="title-lang-icon" />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="title-lang-select"
              aria-label={t.languageSelect}
            >
              <option value="ko">{t.languageKorean}</option>
              <option value="en">{t.languageEnglish}</option>
              <option value="ja">{t.languageJapanese}</option>
              <option value="zh">{t.languageChinese}</option>
            </select>
          </label>

          {/* Audio Controls */}
          <div className="title-audio-controls" role="group" aria-label={t.audioSettings}>
            {onOpenBgmModal && (
              <button
                type="button"
                className="title-audio-btn bgm-track-btn"
                onClick={() => {
                  playSfx('click');
                  onOpenBgmModal();
                }}
                title={t.bgmSettingsTitle}
                aria-label={t.bgmTrackSettings}
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
              aria-label={t.bgm}
            >
              {bgmMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
            </button>

            <button
              type="button"
              className={`title-audio-btn ${!sfxMuted ? 'active' : 'muted'}`}
              onClick={toggleSfxMute}
              title={sfxMuted ? t.soundOn : t.soundOff}
              aria-label={t.sfx}
            >
              {sfxMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
              <span>{t.sfx}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Hero Title Section */}
      <div className="title-hero-section">
        <h1 className="title-main-heading">{t.appTitle}</h1>
        <p className="title-hero-desc">{t.titleHeroSub}</p>
      </div>

      {/* 4 Mode Selection Cards Grid */}
      <div className="mode-cards-grid">
        {/* 1. 일반 모드 (Standard Mode) */}
        <div
          className={`mode-card standard ${selectedMode === 'standard' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('standard')}
        >
          <div className="mode-card-header">
            <span className="mode-index">01</span>
            <div className="mode-icon-box standard">
              <Shield size={20} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeStandard}</h2>
              <span className="mode-tag-badge">{t.sizeNormal.split(' ')[0]}</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeStandardDesc}</p>

          <div className="mode-size-pills" role="group" aria-label={t.difficultyLabel}>
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${standardSize === sz ? 'active' : ''}`}
                aria-pressed={standardSize === sz}
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
            <Play size={16} aria-hidden="true" />
            <span>{t.startPlay} ({standardSize}×{standardSize})</span>
          </button>
        </div>

        {/* 2. 타임어택 모드 (Time Attack) */}
        <div
          className={`mode-card timeattack ${selectedMode === 'timeAttack' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('timeAttack')}
        >
          <div className="mode-card-header">
            <span className="mode-index">02</span>
            <div className="mode-icon-box timeattack">
              <Clock size={20} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeTimeAttack}</h2>
              <span className="mode-tag-badge urgent">SPEED</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeTimeAttackDesc}</p>

          <div className="mode-size-pills" role="group" aria-label={t.difficultyLabel}>
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${timeAttackSize === sz ? 'active' : ''}`}
                aria-pressed={timeAttackSize === sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMode('timeAttack');
                  setTimeAttackSize(sz);
                }}
              >
                {formatMessage(t.timePillTemplate, { size: sz, seconds: TIME_LIMITS[sz] })}
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
            <Play size={16} aria-hidden="true" />
            <span>
              {formatMessage(t.timeAttackStartTemplate, {
                mode: t.modeTimeAttack,
                seconds: TIME_LIMITS[timeAttackSize],
              })}
            </span>
          </button>
        </div>

        {/* 3. 이동 제한 모드 (Move Limit) */}
        <div
          className={`mode-card movelimit ${selectedMode === 'moveLimit' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('moveLimit')}
        >
          <div className="mode-card-header">
            <span className="mode-index">03</span>
            <div className="mode-icon-box movelimit">
              <Footprints size={20} />
            </div>
            <div className="mode-title-group">
              <h2 className="mode-card-title">{t.modeMoveLimit}</h2>
              <span className="mode-tag-badge limit">TACTICS</span>
            </div>
          </div>

          <p className="mode-card-desc">{t.modeMoveLimitDesc}</p>

          <div className="mode-size-pills" role="group" aria-label={t.difficultyLabel}>
            {([3, 4, 5] as GridSize[]).map((sz) => (
              <button
                key={sz}
                type="button"
                className={`size-pill ${moveLimitSize === sz ? 'active' : ''}`}
                aria-pressed={moveLimitSize === sz}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedMode('moveLimit');
                  setMoveLimitSize(sz);
                }}
              >
                {formatMessage(t.movePillTemplate, { size: sz, moves: MOVE_LIMITS[sz] })}
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
            <Play size={16} aria-hidden="true" />
            <span>
              {formatMessage(t.moveLimitStartTemplate, {
                mode: t.modeMoveLimit,
                moves: MOVE_LIMITS[moveLimitSize],
              })}
            </span>
          </button>
        </div>

        {/* 4. 오늘의 퍼즐 (Daily Challenge) */}
        <div
          className={`mode-card daily ${selectedMode === 'daily' ? 'selected' : ''}`}
          onClick={() => setSelectedMode('daily')}
        >
          <div className="mode-card-header">
            <span className="mode-index">04</span>
            <div className="mode-icon-box daily">
              <Flame size={20} />
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
            <Play size={16} aria-hidden="true" />
            <span>{formatMessage(t.dailyStartTemplate, { mode: t.dailyChallenge })}</span>
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
          <Camera size={18} aria-hidden="true" />
          <span>{t.cropModalTitle}</span>
        </button>
      </div>
    </main>
  );
};
