import React, { useEffect, useRef } from 'react';
import {
  X,
  Music2,
  Volume2,
  VolumeX,
  RefreshCw,
  Check,
  Play,
  Sliders,
} from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMessage } from '../../i18n/format';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import './BgmSelectModal.css';

interface BgmSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BgmSelectModal: React.FC<BgmSelectModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const contentRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(isOpen, contentRef);

  const {
    bgmTracks,
    currentBgmTrackId,
    bgmMuted,
    sfxMuted,
    bgmVolume,
    sfxVolume,
    autoThemeBgm,
    switchBgm,
    toggleBgmMute,
    toggleSfxMute,
    setBgmVolume,
    setSfxVolume,
    setAutoThemeBgm,
    playSfx,
  } = useAudio();

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

  const handleSelectTrack = (trackId: string) => {
    playSfx('click');
    switchBgm(trackId, true);
  };

  return (
    <div
      className="bgm-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="bgm-modal-title"
    >
      <div
        ref={contentRef}
        className="bgm-modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bgm-modal-header">
          <div className="bgm-title-group">
            <div className="bgm-header-icon-box">
              <Music2 size={20} className="bgm-header-icon" />
            </div>
            <div>
              <h3 id="bgm-modal-title" className="bgm-modal-title">
                {t.bgmSettingsTitle}
              </h3>
              <span className="bgm-modal-subtitle">
                {t.bgmSettingsSubtitle}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="bgm-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        {/* Master Sound Settings Section */}
        <div className="bgm-volume-card">
          <div className="bgm-volume-card-header">
            <Sliders size={15} />
            <span>{t.volumeMuteControls}</span>
          </div>

          <div className="bgm-volume-controls">
            {/* BGM Volume Row */}
            <div className="volume-control-row">
              <button
                type="button"
                className={`btn-vol-mute ${bgmMuted ? 'muted' : 'active'}`}
                onClick={() => {
                  playSfx('click');
                  toggleBgmMute();
                }}
                title={bgmMuted ? t.bgmUnmute : t.bgmMute}
              >
                {bgmMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>BGM</span>
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={bgmMuted ? 0 : Math.round(bgmVolume * 100)}
                onChange={(e) => {
                  if (bgmMuted) toggleBgmMute();
                  setBgmVolume(Number(e.target.value) / 100);
                }}
                className="volume-slider"
                aria-label={t.bgmVolumeSlider}
              />
              <span className="vol-percent-text">
                {bgmMuted ? '0%' : `${Math.round(bgmVolume * 100)}%`}
              </span>
            </div>

            {/* SFX Volume Row */}
            <div className="volume-control-row">
              <button
                type="button"
                className={`btn-vol-mute ${sfxMuted ? 'muted' : 'active'}`}
                onClick={() => {
                  toggleSfxMute();
                }}
                title={sfxMuted ? t.sfxUnmute : t.sfxMute}
              >
                {sfxMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                <span>SFX</span>
              </button>

              <input
                type="range"
                min="0"
                max="100"
                value={sfxMuted ? 0 : Math.round(sfxVolume * 100)}
                onChange={(e) => {
                  if (sfxMuted) toggleSfxMute();
                  setSfxVolume(Number(e.target.value) / 100);
                }}
                className="volume-slider"
                aria-label={t.sfxVolumeSlider}
              />
              <span className="vol-percent-text">
                {sfxMuted ? '0%' : `${Math.round(sfxVolume * 100)}%`}
              </span>
            </div>
          </div>

          {/* Theme Auto-Sync Checkbox */}
          <label className="theme-bgm-sync-label">
            <input
              type="checkbox"
              checked={autoThemeBgm}
              onChange={(e) => setAutoThemeBgm(e.target.checked)}
              className="theme-sync-checkbox"
            />
            <div className="theme-sync-text">
              <span className="sync-title">
                <RefreshCw size={14} className="sync-icon" aria-hidden="true" />
                {t.autoThemeBgmTitle}
              </span>
              <span className="sync-desc">{t.autoThemeBgmDesc}</span>
            </div>
          </label>
        </div>

        {/* Playlist Section */}
        <div className="bgm-playlist-section">
          <div className="playlist-section-header">
            <span className="playlist-section-title">
              {formatMessage(t.bgmPlaylistTitle, { count: bgmTracks.length })}
            </span>
          </div>

          <div className="bgm-track-list">
            {bgmTracks.map((track) => {
              const isCurrent = track.id === currentBgmTrackId;
              const isPlayingNow = isCurrent && !bgmMuted;

              return (
                <button
                  key={track.id}
                  type="button"
                  className={`bgm-track-card ${isCurrent ? 'selected' : ''}`}
                  onClick={() => handleSelectTrack(track.id)}
                >
                  <div className="track-left-info">
                    {/* Active Equalizer Animation or Disc Icon */}
                    <div className={`track-disc-box ${isPlayingNow ? 'playing' : ''}`}>
                      {isPlayingNow ? (
                        <div className="equalizer-bars" aria-label={t.playing}>
                          <span className="eq-bar bar-1"></span>
                          <span className="eq-bar bar-2"></span>
                          <span className="eq-bar bar-3"></span>
                          <span className="eq-bar bar-4"></span>
                        </div>
                      ) : (
                        <Music2 size={18} className="track-static-icon" />
                      )}
                    </div>

                    <div className="track-text-group">
                      <div className="track-title-row">
                        <span className="track-name">{track.name}</span>
                        <span className="track-genre-badge">{t[track.genreKey]}</span>
                      </div>
                      <p className="track-description">{t[track.descriptionKey]}</p>
                    </div>
                  </div>

                  <div className="track-action-state">
                    {isCurrent ? (
                      <span className="track-playing-tag">
                        <Check size={14} />
                        {bgmMuted ? t.selectedMuted : t.playing}
                      </span>
                    ) : (
                      <span className="btn-track-play">
                        <Play size={13} />
                        {t.select}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
