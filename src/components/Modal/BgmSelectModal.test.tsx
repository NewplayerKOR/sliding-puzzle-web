import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { BgmSelectModal } from './BgmSelectModal';
import { audioManager } from '../../utils/audioManager';
import { resetGlobalLanguage, setGlobalLanguage } from '../../i18n/useTranslation';

describe('BgmSelectModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
    if (audioManager.getConfig().bgmMuted) audioManager.toggleBgmMute();
    if (audioManager.getConfig().sfxMuted) audioManager.toggleSfxMute();
    audioManager.setAutoThemeBgm(false);
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    resetGlobalLanguage();
  });

  it('renders modal with 4 BGM tracks, volume controls, and theme auto-sync checkbox', () => {
    const handleClose = vi.fn();
    render(<BgmSelectModal isOpen={true} onClose={handleClose} />);

    expect(screen.getByText('BGM & 사운드 설정')).toBeDefined();
    expect(screen.getByText(/볼륨 & 음소거 컨트롤/i)).toBeDefined();
    expect(screen.getByText(/테마 선택 시 권장 BGM 자동 연동/i)).toBeDefined();

    // 4 Tracks
    expect(screen.getByText('Lo-Fi Chill')).toBeDefined();
    expect(screen.getByText('Zen Nature')).toBeDefined();
    expect(screen.getByText('Cyber Synth')).toBeDefined();
    expect(screen.getByText('Jazz Lounge')).toBeDefined();
  });

  it('switches BGM track when a track card is clicked', () => {
    const handleClose = vi.fn();
    render(<BgmSelectModal isOpen={true} onClose={handleClose} />);

    const zenTrackBtn = screen.getByRole('button', { name: /Zen Nature/i });
    fireEvent.click(zenTrackBtn);

    expect(audioManager.getConfig().currentBgmTrackId).toBe('zen');
  });

  it('switches to the current theme recommendation immediately when auto-sync is enabled', () => {
    audioManager.setAutoThemeBgm(false);
    audioManager.setCurrentTheme('pixel_art');
    audioManager.switchBgm('chill');
    render(<BgmSelectModal isOpen={true} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('checkbox'));

    expect(audioManager.getConfig().autoThemeBgm).toBe(true);
    expect(audioManager.getConfig().currentBgmTrackId).toBe('synth');

    audioManager.setAutoThemeBgm(false);
  });

  it('exposes mute action and pressed state for BGM and SFX buttons', () => {
    render(<BgmSelectModal isOpen={true} onClose={vi.fn()} />);

    const bgmMuteBtn = screen.getByRole('button', { name: 'BGM 음소거' });
    const sfxMuteBtn = screen.getByRole('button', { name: 'SFX 음소거' });
    expect(bgmMuteBtn.getAttribute('aria-pressed')).toBe('true');
    expect(sfxMuteBtn.getAttribute('aria-pressed')).toBe('true');

    fireEvent.click(bgmMuteBtn);

    expect(audioManager.getConfig().bgmMuted).toBe(true);
    expect(bgmMuteBtn.getAttribute('aria-pressed')).toBe('false');
    expect(bgmMuteBtn.getAttribute('aria-label')).toBe('BGM 사운드 켜기');

    fireEvent.click(sfxMuteBtn);

    expect(audioManager.getConfig().sfxMuted).toBe(true);
    expect(sfxMuteBtn.getAttribute('aria-pressed')).toBe('false');
    expect(sfxMuteBtn.getAttribute('aria-label')).toBe('SFX 사운드 켜기');
  });

  it('adjusts volume sliders after muting', () => {
    render(<BgmSelectModal isOpen={true} onClose={vi.fn()} />);

    const sfxSlider = screen.getByLabelText('SFX 볼륨 슬라이더');
    fireEvent.change(sfxSlider, { target: { value: '40' } });
    expect(audioManager.getConfig().sfxVolume).toBe(0.4);
  });

  it('calls onClose when close button or Escape key is pressed', () => {
    const handleClose = vi.fn();
    const { rerender } = render(<BgmSelectModal isOpen={true} onClose={handleClose} />);

    const closeBtn = screen.getByLabelText('닫기');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalledTimes(2);

    rerender(<BgmSelectModal isOpen={false} onClose={handleClose} />);
    expect(screen.queryByText('BGM & 사운드 설정')).toBeNull();
  });

  it('renders English BGM metadata after switching language', () => {
    setGlobalLanguage('en');
    render(<BgmSelectModal isOpen={true} onClose={vi.fn()} />);

    expect(screen.getByText('BGM & Sound Settings')).toBeDefined();
    expect(screen.getByText('Lo-Fi / Acoustic')).toBeDefined();
    expect(
      screen.getByText('Calm, comfortable beats with acoustic guitar melodies')
    ).toBeDefined();
    expect(screen.getByText(/BGM Playlist \(4 tracks\)/i)).toBeDefined();
  });
});
