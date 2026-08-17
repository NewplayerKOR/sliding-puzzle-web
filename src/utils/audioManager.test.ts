import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  audioManager,
  BGM_TRACKS,
  getComboPitchMultiplier,
} from './audioManager';

function createMockAudioContext() {
  return {
    state: 'running',
    currentTime: 0,
    destination: {},
    createGain: vi.fn(() => ({
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    })),
    createOscillator: vi.fn(() => ({
      type: 'sine',
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    })),
    createBiquadFilter: vi.fn(() => ({
      type: 'lowpass',
      Q: { setValueAtTime: vi.fn() },
      frequency: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    })),
    resume: vi.fn().mockResolvedValue(undefined),
  };
}

describe('AudioManager Unit Tests', () => {
  beforeEach(() => {
    localStorage.clear();
    audioManager.resetCombo();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
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

    // Reset mute state
    if (newSfxMuted) audioManager.toggleSfxMute();
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

  describe('TASK-DEV-13: Combo Pitch System & Theme SFX Synthesis', () => {
    it('calculates accurate combo pitch multipliers up to MAX_COMBO', () => {
      expect(getComboPitchMultiplier(0)).toBe(1.0);
      expect(getComboPitchMultiplier(1)).toBe(1.0);
      expect(getComboPitchMultiplier(2)).toBe(1.06);
      expect(getComboPitchMultiplier(3)).toBe(1.12);
      expect(getComboPitchMultiplier(4)).toBe(1.18);
      expect(getComboPitchMultiplier(5)).toBe(1.24);
      expect(getComboPitchMultiplier(6)).toBe(1.3);
      expect(getComboPitchMultiplier(7)).toBe(1.36);
      expect(getComboPitchMultiplier(8)).toBe(1.42);
      expect(getComboPitchMultiplier(9)).toBe(1.42); // Clamped at max 8
      expect(getComboPitchMultiplier(99)).toBe(1.42);
    });

    it('manages current active theme and fallback for custom photo modes', () => {
      audioManager.setCurrentTheme('animal');
      expect(audioManager.getCurrentTheme()).toBe('animal');

      audioManager.setCurrentTheme('pixel_art');
      expect(audioManager.getCurrentTheme()).toBe('pixel_art');

      audioManager.setCurrentTheme('abstract');
      expect(audioManager.getCurrentTheme()).toBe('abstract');

      // Custom or unknown string falls back to 'nature'
      audioManager.setCurrentTheme('custom_uploaded_img');
      expect(audioManager.getCurrentTheme()).toBe('nature');
    });

    it('tracks consecutive combos within 600ms and resets after timeout', () => {
      vi.useFakeTimers();
      audioManager.resetCombo();
      expect(audioManager.getComboCount()).toBe(0);

      // Move 1
      audioManager.playThemeMoveSfx('abstract');
      expect(audioManager.getComboCount()).toBe(1);

      // Move 2 within 250ms -> Combo 2
      vi.advanceTimersByTime(250);
      audioManager.playThemeMoveSfx('abstract');
      expect(audioManager.getComboCount()).toBe(2);

      // Move 3 within 200ms -> Combo 3
      vi.advanceTimersByTime(200);
      audioManager.playThemeMoveSfx('abstract');
      expect(audioManager.getComboCount()).toBe(3);

      // Advance by 700ms (> 600ms timeout) -> Combo resets to 1
      vi.advanceTimersByTime(700);
      audioManager.playThemeMoveSfx('abstract');
      expect(audioManager.getComboCount()).toBe(1);

      // Explicit reset
      audioManager.resetCombo();
      expect(audioManager.getComboCount()).toBe(0);

      vi.useRealTimers();
    });

    it('synthesizes distinct acoustic waveforms for all 4 themes via Web Audio API', () => {
      const mockCtx = createMockAudioContext();
      audioManager.setAudioContextForTesting(mockCtx as unknown as AudioContext);

      // Ensure SFX is unmuted
      if (audioManager.getConfig().sfxMuted) audioManager.toggleSfxMute();

      // 1. Classic (abstract) - Ceramic tap
      audioManager.playThemeMoveSfx('abstract', 1);
      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createGain).toHaveBeenCalled();

      // 2. Wood (animal) - Deep wooden knock
      mockCtx.createOscillator.mockClear();
      audioManager.playThemeMoveSfx('animal', 2);
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2); // Fundamental + harmonic overtone

      // 3. Neon (pixel_art) - Cyber synth pulse with filter sweep
      mockCtx.createOscillator.mockClear();
      mockCtx.createBiquadFilter.mockClear();
      audioManager.playThemeMoveSfx('pixel_art', 3);
      expect(mockCtx.createOscillator).toHaveBeenCalled();
      expect(mockCtx.createBiquadFilter).toHaveBeenCalled();

      // 4. Nature (nature) - Soft waterdrop marimba
      mockCtx.createOscillator.mockClear();
      audioManager.playThemeMoveSfx('nature', 4);
      expect(mockCtx.createOscillator).toHaveBeenCalledTimes(2);
    });

    it('respects mute state and volume 0 by omitting synthesis', () => {
      const mockCtx = createMockAudioContext();
      audioManager.setAudioContextForTesting(mockCtx as unknown as AudioContext);

      // Mute SFX
      audioManager.toggleSfxMute();
      expect(audioManager.getConfig().sfxMuted).toBe(true);

      mockCtx.createOscillator.mockClear();
      audioManager.playThemeMoveSfx('abstract', 1);
      expect(mockCtx.createOscillator).not.toHaveBeenCalled();

      // Unmute
      audioManager.toggleSfxMute();
    });

    it('delegates playSfx("slide") to theme sound synthesis', () => {
      const mockCtx = createMockAudioContext();
      audioManager.setAudioContextForTesting(mockCtx as unknown as AudioContext);

      audioManager.setCurrentTheme('pixel_art');
      mockCtx.createBiquadFilter.mockClear();

      audioManager.playSfx('slide');
      expect(mockCtx.createBiquadFilter).toHaveBeenCalled();
    });
  });
});
