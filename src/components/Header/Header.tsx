import { Timer, Footprints, Globe, Flame, Home, Music } from 'lucide-react';
import { GameStatus, GameChallengeMode, GridSize } from '../../types/puzzle';
import { BestRecord } from '../../types/theme';
import { useAudio } from '../../hooks/useAudio';
import { useTranslation } from '../../i18n/useTranslation';
import { Language } from '../../i18n/translations';
import { getDailyStreakData } from '../../utils/dailyChallenge';
import { getAssetUrl } from '../../utils/assetPath';
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
              aria-label="언어 선택"
            >
              <option value="ko">한국어</option>
              <option value="en">English</option>
              <option value="ja">日本語</option>
              <option value="zh">中文</option>
            </select>
          </div>

          {/* Audio Controls */}
          <div className="audio-controls" role="group" aria-label="오디오 설정">
            {/* BGM Track Selector Modal Trigger */}
            {onOpenBgmModal && (
              <button
                type="button"
                className="audio-btn bgm-track-btn"
                onClick={() => {
                  playSfx('click');
                  onOpenBgmModal();
                }}
                title="BGM 트랙 및 사운드 설정"
                aria-label="BGM 트랙 설정"
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
              aria-label="BGM On/Off"
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
              aria-label="SFX On/Off"
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
        <div className={`stat-card ${isMoveLimit ? 'urgent-limit' : ''}`} title="총 이동 횟수">
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
        <div className={`stat-card ${isTimeAttack ? 'urgent-timer' : ''}`} title="진행 시간">
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
        <div className="stat-card" title={`${gridSize}x${gridSize} 최고 기록`}>
          <div className="stat-icon-wrapper">
            <img
              src={getAssetUrl('assets/icons/badge_trophy.png')}
              alt="최고 기록"
              className="header-stat-icon-img"
            />
          </div>
          <div className="stat-content">
            <span className="stat-label">{t.bestRecord}</span>
            <span className="stat-value small">
              {bestRecord
                ? `${formatTime(bestRecord.bestTime)} / ${bestRecord.bestMoves}회`
                : '-'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

