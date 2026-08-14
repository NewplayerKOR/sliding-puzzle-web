import { describe, it, expect, vi, beforeEach } from 'vitest';
import { audioManager, BGM_TRACKS } from './audioManager';

describe('AudioManager Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  it('provides all 4 predefined BGM tracks with valid properties', () => {
    expect(BGM_TRACKS.length).toBe(4);
    const ids = BGM_TRACKS.map((t) => t.id);
    expect(ids).toContain('chill');
    expect(ids).toContain('zen');
    expect(ids).toContain('synth');
    expect(ids).toContain('jazz');

    BGM_TRACKS.forEach((track) => {
      expect(track.name).toBeTruthy();
      expect(track.genre).toBeTruthy();
      expect(track.path).toContain('assets/audio/');
      expect(track.recommendedThemeIds.length).toBeGreaterThan(0);
    });
  });

  it('allows setting BGM and SFX volume clamped between 0 and 1', () => {
    audioManager.setBgmVolume(0.5);
    expect(audioManager.getConfig().bgmVolume).toBe(0.5);

    audioManager.setBgmVolume(1.5);
    expect(audioManager.getConfig().bgmVolume).toBe(1.0);

    audioManager.setBgmVolume(-0.2);
    expect(audioManager.getConfig().bgmVolume).toBe(0.0);

    audioManager.setSfxVolume(0.7);
    expect(audioManager.getConfig().sfxVolume).toBe(0.7);

    audioManager.setSfxVolume(2.0);
    expect(audioManager.getConfig().sfxVolume).toBe(1.0);
  });

  it('toggles BGM and SFX mute states and saves to localStorage', () => {
    const prevBgmMuted = audioManager.getConfig().bgmMuted;
    const newBgmMuted = audioManager.toggleBgmMute();
    expect(newBgmMuted).toBe(!prevBgmMuted);
    expect(audioManager.getConfig().bgmMuted).toBe(!prevBgmMuted);
    expect(localStorage.getItem('sliding_puzzle_bgm_muted')).toBe(String(!prevBgmMuted));

    const prevSfxMuted = audioManager.getConfig().sfxMuted;
    const newSfxMuted = audioManager.toggleSfxMute();
    expect(newSfxMuted).toBe(!prevSfxMuted);
    expect(audioManager.getConfig().sfxMuted).toBe(!prevSfxMuted);
    expect(localStorage.getItem('sliding_puzzle_sfx_muted')).toBe(String(!prevSfxMuted));
  });

  it('switches BGM track and persists to localStorage', () => {
    audioManager.switchBgm('zen');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('zen');
    expect(audioManager.getCurrentTrack().id).toBe('zen');
    expect(localStorage.getItem('sliding_puzzle_current_bgm')).toBe('zen');

    audioManager.switchBgm('synth');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('synth');
    expect(localStorage.getItem('sliding_puzzle_current_bgm')).toBe('synth');
  });

  it('syncs BGM with theme when autoThemeBgm is enabled', () => {
    audioManager.setAutoThemeBgm(true);
    expect(audioManager.getConfig().autoThemeBgm).toBe(true);

    // nature theme recommends 'zen'
    audioManager.syncThemeBgm('nature');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('zen');

    // pixel_art theme recommends 'synth'
    audioManager.syncThemeBgm('pixel_art');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('synth');

    // animal theme recommends 'jazz'
    audioManager.syncThemeBgm('animal');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('jazz');

    // Disabling autoThemeBgm prevents automatic change
    audioManager.setAutoThemeBgm(false);
    audioManager.syncThemeBgm('nature');
    expect(audioManager.getConfig().currentBgmTrackId).toBe('jazz');
  });
});
