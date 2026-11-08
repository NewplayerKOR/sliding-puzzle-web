import { Timer, Footprints, Globe, Flame, Home, Music } from 'lucide-react';
import { GameStatus, GameChallengeMode, GridSize } from '../../types/puzzle';
import { BestRecord } from '../../types/theme';
import { useAudio } from '../../hooks/useAudio';
import { useTranslation } from '../../i18n/useTranslation';
import { Language } from '../../i18n/translations';
import { getDailyStreakData } from '../../utils/dailyChallenge';
import { getAssetUrl } from '../../utils/assetPath';
import { formatMessage } from '../../i18n/format';
import './Header.css';

interface HeaderProps {
  moveCount: number;
  elapsedTime: number;
  remainingTime?: number;
  remainingMoves?: number;
  status: GameStatus;
  challengeMode?: GameChallengeMode;
  gridSize: GridSize;
  bestRecord: BestRecord | null;
  onOpenDaily?: () => void;
  onOpenBgmModal?: () => void;
  onReturnHome?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  moveCount,
  elapsedTime,
  remainingTime = 0,
  remainingMoves = 0,
  challengeMode = 'standard',
  gridSize,
  bestRecord,
  onOpenDaily,
  onOpenBgmModal,
  onReturnHome,
}) => {
  const { bgmMuted, sfxMuted, toggleBgmMute, toggleSfxMute, playSfx } = useAudio();
  const { language, changeLanguage, t } = useTranslation();
  const streakData = getDailyStreakData();

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleBgm = () => {
    playSfx('click');
    toggleBgmMute();
  };

  const handleToggleSfx = () => {
    toggleSfxMute();
  };

  const isTimeAttack = challengeMode === 'timeAttack';
  const isMoveLimit = challengeMode === 'moveLimit';

  return (
    <header className="game-header">
      {/* Top Utility Bar */}
      <div className="header-top-row">
        {/* Left: Home Return Button */}
        {onReturnHome && (
          <button
            type="button"
            className="btn-home-return"
            onClick={() => {
              playSfx('click');
              onReturnHome();
            }}
            title={t.homeTitle}
          >
            <Home size={15} />
            <span>{t.homeTitle}</span>
          </button>
        )}

        <div className="header-top-right">
          {/* Daily Streak Indicator */}
          {onOpenDaily && (
            <button
              type="button"
              className="daily-streak-btn"
              onClick={() => {
                playSfx('click');
                onOpenDaily();
              }}
              title={`${t.currentStreak}: ${streakData.currentStreak}${t.streakDaysSuffix}`}
            >
              <Flame size={16} className="streak-flame" />
              <span>{streakData.currentStreak}{t.streakDaysSuffix}</span>
            </button>
          )}

          {/* Language Selector Dropdown */}
          <div className="lang-select-wrapper">
            <Globe size={15} className="lang-icon" />
            <select
              value={language}
              onChange={(e) => changeLanguage(e.target.value as Language)}
              className="lang-select"
              aria-label={t.languageSelect}
            >
              <option value="ko">{t.languageKorean}</option>
              <option value="en">{t.languageEnglish}</option>
              <option value="ja">{t.languageJapanese}</option>
              <option value="zh">{t.languageChinese}</option>
            </select>
          </div>

          {/* Audio Controls */}
          <div className="audio-controls" role="group" aria-label={t.audioSettings}>
            {/* BGM Track Selector Modal Trigger */}
            {onOpenBgmModal && (
              <button
                type="button"
                className="audio-btn bgm-track-btn"
                onClick={() => {
                  playSfx('click');
                  onOpenBgmModal();
                }}
                title={t.bgmSettingsTitle}
                aria-label={t.bgmTrackSettings}
              >
                <Music size={15} />
                <span className="audio-btn-label">BGM</span>
              </button>
            )}

            <button
              type="button"
              className={`audio-btn ${!bgmMuted ? 'active' : 'muted'}`}
              onClick={handleToggleBgm}
              title={bgmMuted ? t.soundOn : t.soundOff}
              aria-label={`${t.bgm} ${bgmMuted ? t.soundOn : t.soundOff}`}
            >
              <img
                src={!bgmMuted ? getAssetUrl('assets/icons/icon_sound_on.png') : getAssetUrl('assets/icons/icon_sound_off.png')}
                alt="BGM"
                className="audio-icon-img"
              />
            </button>

            <button
              type="button"
              className={`audio-btn ${!sfxMuted ? 'active' : 'muted'}`}
              onClick={handleToggleSfx}
              title={sfxMuted ? t.soundOn : t.soundOff}
              aria-label={`${t.sfx} ${sfxMuted ? t.soundOn : t.soundOff}`}
            >
              <img
                src={!sfxMuted ? getAssetUrl('assets/icons/icon_sound_on.png') : getAssetUrl('assets/icons/icon_sound_off.png')}
                alt="SFX"
                className="audio-icon-img"
              />
              <span className="audio-btn-label">{t.sfx}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="header-stats">
        {/* Moves Card */}
        <div className={`stat-card ${isMoveLimit ? 'urgent-limit' : ''}`} title={t.movesTotalTitle}>
          <div className="stat-icon-wrapper">
            <Footprints size={18} className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">
              {isMoveLimit ? t.movesRemaining : t.moves}
            </span>
            <span className="stat-value">
              {isMoveLimit ? remainingMoves : moveCount}
            </span>
          </div>
        </div>

        {/* Timer Card */}
        <div className={`stat-card ${isTimeAttack ? 'urgent-timer' : ''}`} title={t.elapsedTimeTitle}>
          <div className="stat-icon-wrapper">
            <Timer size={18} className="stat-icon" />
          </div>
          <div className="stat-content">
            <span className="stat-label">
              {isTimeAttack ? t.timeRemaining : t.time}
            </span>
            <span className="stat-value timer">
              {isTimeAttack ? formatTime(remainingTime) : formatTime(elapsedTime)}
            </span>
          </div>
        </div>

        {/* Best Record Card */}
        <div className="stat-card" title={formatMessage(t.bestRecordTitle, { size: gridSize })}>
          <div className="stat-icon-wrapper">
            <img
              src={getAssetUrl('assets/icons/badge_trophy.png')}
              alt={t.bestRecord}
              className="header-stat-icon-img"
            />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t.bestRecord}</span>
            <span className="stat-value small">
              {bestRecord
                ? formatMessage(t.bestRecordValue, {
                    time: formatTime(bestRecord.bestTime),
                    moves: bestRecord.bestMoves,
                  })
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

