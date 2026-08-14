import { useState, useEffect, useCallback } from 'react';
import { audioManager, SfxType, BGM_TRACKS, BgmTrack } from '../utils/audioManager';

export function useAudio() {
  const [audioConfig, setAudioConfig] = useState(() => audioManager.getConfig());

  useEffect(() => {
    const unsubscribe = audioManager.subscribe((newConfig) => {
      setAudioConfig(newConfig);
    });
    return unsubscribe;
  }, []);

  const playSfx = useCallback((type: SfxType) => {
    audioManager.playSfx(type);
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
