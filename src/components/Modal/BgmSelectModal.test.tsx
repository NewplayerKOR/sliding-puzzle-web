import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BgmSelectModal } from './BgmSelectModal';
import { audioManager } from '../../utils/audioManager';

describe('BgmSelectModal Component', () => {
  beforeEach(() => {
    localStorage.clear();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
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

  it('toggles BGM mute and adjusts volume sliders', () => {
    const handleClose = vi.fn();
    render(<BgmSelectModal isOpen={true} onClose={handleClose} />);

    const bgmMuteBtn = screen.getByTitle(/BGM 음소거/i);
    fireEvent.click(bgmMuteBtn);

    expect(audioManager.getConfig().bgmMuted).toBe(true);

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
});
