import { useState, useEffect, useCallback } from 'react';
import { audioManager, SfxType, BGM_TRACKS, BgmTrack } from '../utils/audioManager';
import { ThemeId } from '../types/theme';

export function useAudio() {
  const [audioConfig, setAudioConfig] = useState(() => audioManager.getConfig());

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newConfig) => {
      setAudioConfig(newConfig);
    });
    return unsubscribe;
  }, []);

  const playSfx = useCallback((type: SfxType, themeId?: ThemeId | string) => {
    audioManager.playSfx(type, themeId);
  }, []);

  const playThemeMoveSfx = useCallback((themeId?: ThemeId | string, comboCount?: number) => {
    audioManager.playThemeMoveSfx(themeId, comboCount);
  }, []);

  const setCurrentTheme = useCallback((themeId: ThemeId | string) => {
    audioManager.setCurrentTheme(themeId);
  }, []);

  const getComboCount = useCallback(() => {
    return audioManager.getComboCount();
  }, []);

  const resetCombo = useCallback(() => {
    audioManager.resetCombo();
  }, []);

  const playBgm = useCallback(() => {
    audioManager.playBgm();
  }, []);

  const pauseBgm = useCallback(() => {
    audioManager.pauseBgm();
  }, []);

  const toggleBgmMute = useCallback(() => {
    return audioManager.toggleBgmMute();
  }, []);

  const toggleSfxMute = useCallback(() => {
    return audioManager.toggleSfxMute();
  }, []);

  const setBgmVolume = useCallback((vol: number) => {
    audioManager.setBgmVolume(vol);
  }, []);

  const setSfxVolume = useCallback((vol: number) => {
    audioManager.setSfxVolume(vol);
  }, []);

  const switchBgm = useCallback((trackId: string, forcePlay = true) => {
    audioManager.switchBgm(trackId, forcePlay);
  }, []);

  const setAutoThemeBgm = useCallback((enabled: boolean) => {
    audioManager.setAutoThemeBgm(enabled);
  }, []);

  const currentTrack: BgmTrack =
    BGM_TRACKS.find((t) => t.id === audioConfig.currentBgmTrackId) || BGM_TRACKS[0];

  return {
    ...audioConfig,
    bgmTracks: BGM_TRACKS,
    currentTrack,
    playSfx,
    playThemeMoveSfx,
    setCurrentTheme,
    getComboCount,
    resetCombo,
    playBgm,
    pauseBgm,
    toggleBgmMute,
    toggleSfxMute,
    setBgmVolume,
    setSfxVolume,
    switchBgm,
    setAutoThemeBgm,
  };
}
