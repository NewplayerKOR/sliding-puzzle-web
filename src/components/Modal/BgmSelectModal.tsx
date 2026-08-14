import React, { useEffect } from 'react';
import {
  X,
  Music2,
  Volume2,
  VolumeX,
  Sparkles,
  Check,
  Play,
  Sliders,
} from 'lucide-react';
import { useAudio } from '../../hooks/useAudio';
import './BgmSelectModal.css';

interface BgmSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BgmSelectModal: React.FC<BgmSelectModalProps> = ({ isOpen, onClose }) => {

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
      <div className="bgm-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="bgm-modal-header">
          <div className="bgm-title-group">
            <div className="bgm-header-icon-box">
              <Music2 size={20} className="bgm-header-icon" />
            </div>
            <div>
              <h3 id="bgm-modal-title" className="bgm-modal-title">
                BGM & 사운드 설정
              </h3>
              <span className="bgm-modal-subtitle">
                플레이리스트 트랙 선택 및 음량 조절
              </span>
            </div>
          </div>
          <button
            type="button"
            className="bgm-close-btn"
            onClick={onClose}
            aria-label="닫기"
          >
            <X size={20} />
          </button>
        </div>

        {/* Master Sound Settings Section */}
        <div className="bgm-volume-card">
          <div className="bgm-volume-card-header">
            <Sliders size={15} />
            <span>볼륨 & 음소거 컨트롤</span>
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
                title={bgmMuted ? 'BGM 켜기' : 'BGM 음소거'}
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
                aria-label="BGM 볼륨 슬라이더"
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
                title={sfxMuted ? 'SFX 켜기' : 'SFX 음소거'}
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
                aria-label="SFX 볼륨 슬라이더"
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
                <Sparkles size={14} className="sparkle-sync-icon" />
                테마 선택 시 권장 BGM 자동 연동
              </span>
              <span className="sync-desc">
                자연/픽셀/동물 등 테마 분위기에 맞추어 BGM을 자동 전환합니다.
              </span>
            </div>
          </label>
        </div>

        {/* Playlist Section */}
        <div className="bgm-playlist-section">
          <div className="playlist-section-header">
            <span className="playlist-section-title">
              🎵 BGM 트랙 플레이리스트 ({bgmTracks.length}곡)
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
                        <div className="equalizer-bars" aria-label="재생 중">
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
                        <span className="track-genre-badge">{track.genre}</span>
                      </div>
                      <p className="track-description">{track.description}</p>
                    </div>
                  </div>

                  <div className="track-action-state">
                    {isCurrent ? (
                      <span className="track-playing-tag">
                        <Check size={14} />
                        {bgmMuted ? '선택됨 (음소거)' : '재생 중'}
                      </span>
                    ) : (
                      <span className="btn-track-play">
                        <Play size={13} />
                        선택
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
