import { getAssetUrl } from './assetPath';

export type SfxType = 'slide' | 'blocked' | 'shuffle' | 'click' | 'victory';

export interface BgmTrack {
  id: string;
  name: string;
  path: string;
  genre: string;
  description: string;
  recommendedThemeIds: string[];
}

export const BGM_TRACKS: BgmTrack[] = [
  {
    id: 'chill',
    name: 'Lo-Fi Chill',
    path: getAssetUrl('assets/audio/bgm_chill.wav'),
    genre: '칠홉 / 어쿠스틱',
    description: '차분하고 편안한 비트와 어쿠스틱 기타 선율',
    recommendedThemeIds: ['abstract'],
  },
  {
    id: 'zen',
    name: 'Zen Nature',
    path: getAssetUrl('assets/audio/bgm_zen_nature.wav'),
    genre: '자연 / 앰비언트',
    description: '맑은 자연의 숨결과 평온한 명상 앰비언스',
    recommendedThemeIds: ['nature'],
  },
  {
    id: 'synth',
    name: 'Cyber Synth',
    path: getAssetUrl('assets/audio/bgm_cyber_synth.wav'),
    genre: '신스웨이브 / 일렉트로',
    description: '미래적인 신시사이저와 레트로 사이버네틱 리듬',
    recommendedThemeIds: ['pixel_art'],
  },
  {
    id: 'jazz',
    name: 'Jazz Lounge',
    path: getAssetUrl('assets/audio/bgm_jazz_cafe.wav'),
    genre: '보사노바 재즈',
    description: '세련된 카페 무드의 감미로운 피아노 재즈 선율',
    recommendedThemeIds: ['animal'],
  },
];

export interface AudioConfig {
  sfxVolume: number;
  bgmVolume: number;
  sfxMuted: boolean;
  bgmMuted: boolean;
  currentBgmTrackId: string;
  autoThemeBgm: boolean;
}

const STORAGE_KEY_SFX_MUTED = 'sliding_puzzle_sfx_muted';
const STORAGE_KEY_BGM_MUTED = 'sliding_puzzle_bgm_muted';
const STORAGE_KEY_SFX_VOL = 'sliding_puzzle_sfx_vol';
const STORAGE_KEY_BGM_VOL = 'sliding_puzzle_bgm_vol';
const STORAGE_KEY_CURRENT_BGM = 'sliding_puzzle_current_bgm';
const STORAGE_KEY_AUTO_THEME_BGM = 'sliding_puzzle_auto_theme_bgm';

const SFX_PATHS: Record<SfxType, string[]> = {
  slide: ['assets/audio/sfx_slide.mp3', 'assets/audio/sfx_slide.wav'].map(getAssetUrl),
  blocked: ['assets/audio/sfx_blocked.mp3', 'assets/audio/sfx_blocked.wav'].map(getAssetUrl),
  shuffle: ['assets/audio/sfx_shuffle.mp3', 'assets/audio/sfx_shuffle.wav'].map(getAssetUrl),
  click: ['assets/audio/sfx_click.mp3', 'assets/audio/sfx_click.wav'].map(getAssetUrl),
  victory: ['assets/audio/sfx_victory.mp3', 'assets/audio/sfx_victory.wav'].map(getAssetUrl),
};

class AudioManager {
  private static instance: AudioManager;
  private bgmAudio: HTMLAudioElement | null = null;
  private sfxPool: Map<SfxType, HTMLAudioElement[]> = new Map();
  private sfxPoolSize = 3;
  private isUserInteracted = false;
  private isBgmPlaying = false;
  private fadeInterval: number | null = null;
  private listeners: Set<(config: AudioConfig) => void> = new Set();

  private config: AudioConfig = {
    sfxVolume: 0.8,
    bgmVolume: 0.35,
    sfxMuted: false,
    bgmMuted: false,
    currentBgmTrackId: 'chill',
    autoThemeBgm: true,
  };

  private constructor() {
    this.loadSettings();
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      this.initBgm();
      this.initSfxPool();
      this.setupUserInteractionListener();
    }
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
    }
    return AudioManager.instance;
  }

  private loadSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      const sfxMuted = localStorage.getItem(STORAGE_KEY_SFX_MUTED);
      const bgmMuted = localStorage.getItem(STORAGE_KEY_BGM_MUTED);
      const sfxVol = localStorage.getItem(STORAGE_KEY_SFX_VOL);
      const bgmVol = localStorage.getItem(STORAGE_KEY_BGM_VOL);
      const currentBgm = localStorage.getItem(STORAGE_KEY_CURRENT_BGM);
      const autoTheme = localStorage.getItem(STORAGE_KEY_AUTO_THEME_BGM);

      if (sfxMuted !== null) this.config.sfxMuted = sfxMuted === 'true';
      if (bgmMuted !== null) this.config.bgmMuted = bgmMuted === 'true';
      if (sfxVol !== null) this.config.sfxVolume = parseFloat(sfxVol);
      if (bgmVol !== null) this.config.bgmVolume = parseFloat(bgmVol);
      if (currentBgm && BGM_TRACKS.some((t) => t.id === currentBgm)) {
        this.config.currentBgmTrackId = currentBgm;
      }
      if (autoTheme !== null) this.config.autoThemeBgm = autoTheme === 'true';
    } catch {
      // Storage unavailable fallback
    }
  }

  private saveSettings(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY_SFX_MUTED, String(this.config.sfxMuted));
      localStorage.setItem(STORAGE_KEY_BGM_MUTED, String(this.config.bgmMuted));
      localStorage.setItem(STORAGE_KEY_SFX_VOL, String(this.config.sfxVolume));
      localStorage.setItem(STORAGE_KEY_BGM_VOL, String(this.config.bgmVolume));
      localStorage.setItem(STORAGE_KEY_CURRENT_BGM, this.config.currentBgmTrackId);
      localStorage.setItem(STORAGE_KEY_AUTO_THEME_BGM, String(this.config.autoThemeBgm));
    } catch {
      // Storage error ignored
    }
    this.notifyListeners();
  }

  private getTrack(trackId: string): BgmTrack {
    return BGM_TRACKS.find((t) => t.id === trackId) || BGM_TRACKS[0];
  }

  private initBgm(): void {
    try {
      const track = this.getTrack(this.config.currentBgmTrackId);
      this.bgmAudio = new Audio(track.path);
      this.bgmAudio.loop = true;
      this.bgmAudio.volume = this.config.bgmMuted ? 0 : this.config.bgmVolume;
      this.bgmAudio.preload = 'auto';
    } catch {
      this.bgmAudio = null;
    }
  }

  private initSfxPool(): void {
    (Object.keys(SFX_PATHS) as SfxType[]).forEach((type) => {
      const pool: HTMLAudioElement[] = [];
      const primaryPath = SFX_PATHS[type][0];
      const fallbackPath = SFX_PATHS[type][1];
      for (let i = 0; i < this.sfxPoolSize; i++) {
        try {
          const audio = new Audio(primaryPath);
          audio.preload = 'auto';
          if (fallbackPath) {
            audio.addEventListener(
              'error',
              () => {
                if (audio.src !== fallbackPath) {
                  audio.src = fallbackPath;
                }
              },
              { once: true }
            );
          }
          pool.push(audio);
        } catch {
          // Ignore initialization error in unsupported environments
        }
      }
      this.sfxPool.set(type, pool);
    });
  }

  private setupUserInteractionListener(): void {
    const handleFirstInteraction = () => {
      if (this.isUserInteracted) return;
      this.isUserInteracted = true;
      if (!this.config.bgmMuted && !this.isBgmPlaying) {
        this.playBgm();
      }
      window.removeEventListener('click', handleFirstInteraction);
      window.removeEventListener('keydown', handleFirstInteraction);
      window.removeEventListener('touchstart', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction, { passive: true });
    window.addEventListener('keydown', handleFirstInteraction, { passive: true });
    window.addEventListener('touchstart', handleFirstInteraction, { passive: true });
  }

  public playBgm(): void {
    if (!this.bgmAudio || this.config.bgmMuted) return;
    try {
      this.bgmAudio.volume = this.config.bgmVolume;
      const playPromise = this.bgmAudio.play();
      if (playPromise !== undefined && typeof playPromise.then === 'function') {
        playPromise
          .then(() => {
            this.isBgmPlaying = true;
          })
          .catch(() => {
            this.isBgmPlaying = false;
          });
      } else {
        this.isBgmPlaying = true;
      }
    } catch {
      this.isBgmPlaying = false;
    }
  }

  public pauseBgm(): void {
    if (!this.bgmAudio) return;
    try {
      this.bgmAudio.pause();
    } catch {
      // Ignore error
    }
    this.isBgmPlaying = false;
  }

  /**
   * Switch BGM track with a smooth 0.3s fade-out -> fade-in transition
   */
  public switchBgm(trackId: string, forcePlay = false): void {
    const targetTrack = this.getTrack(trackId);
    const prevTrackId = this.config.currentBgmTrackId;
    this.config.currentBgmTrackId = targetTrack.id;
    this.saveSettings();

    if (prevTrackId === targetTrack.id && this.isBgmPlaying && !forcePlay) {
      return;
    }

    if (typeof window === 'undefined' || typeof Audio === 'undefined') return;

    if (this.fadeInterval !== null) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    const currentAudio = this.bgmAudio;
    const shouldPlay = (this.isBgmPlaying || this.isUserInteracted || forcePlay) && !this.config.bgmMuted;

    if (currentAudio && this.isBgmPlaying) {
      // Fade out (approx 150ms)
      const startVol = currentAudio.volume;
      const steps = 6;
      let currentStep = 0;
      const stepTime = 25; // 6 * 25ms = 150ms

      this.fadeInterval = window.setInterval(() => {
        currentStep++;
        const factor = Math.max(0, 1 - currentStep / steps);
        if (currentAudio) {
          try {
            currentAudio.volume = startVol * factor;
          } catch {
            // Ignore volume setting errors
          }
        }

        if (currentStep >= steps) {
          if (this.fadeInterval !== null) {
            clearInterval(this.fadeInterval);
            this.fadeInterval = null;
          }
          this.startNewTrack(targetTrack, shouldPlay);
        }
      }, stepTime);
    } else {
      this.startNewTrack(targetTrack, shouldPlay);
    }
  }

  private startNewTrack(track: BgmTrack, shouldPlay: boolean): void {
    try {
      if (this.bgmAudio) {
        this.bgmAudio.pause();
      }
      this.bgmAudio = new Audio(track.path);
      this.bgmAudio.loop = true;
      this.bgmAudio.preload = 'auto';

      if (shouldPlay) {
        this.bgmAudio.volume = 0;
        const playPromise = this.bgmAudio.play();
        this.isBgmPlaying = true;

        if (playPromise !== undefined && typeof playPromise.then === 'function') {
          playPromise
            .then(() => {
              this.fadeInBgm();
            })
            .catch(() => {
              this.isBgmPlaying = false;
            });
        } else {
          this.fadeInBgm();
        }
      } else {
        this.bgmAudio.volume = this.config.bgmMuted ? 0 : this.config.bgmVolume;
        this.isBgmPlaying = false;
      }
    } catch {
      this.isBgmPlaying = false;
    }
  }

  private fadeInBgm(): void {
    if (!this.bgmAudio) return;
    const targetVol = this.config.bgmVolume;
    const steps = 8;
    let currentStep = 0;
    const stepTime = 20; // 8 * 20ms = 160ms (Total fade-in ~0.16s)

    if (this.fadeInterval !== null) {
      clearInterval(this.fadeInterval);
      this.fadeInterval = null;
    }

    this.fadeInterval = window.setInterval(() => {
      currentStep++;
      const factor = Math.min(1, currentStep / steps);
      if (this.bgmAudio) {
        try {
          this.bgmAudio.volume = targetVol * factor;
        } catch {
          // Ignore volume setting errors
        }
      }

      if (currentStep >= steps) {
        if (this.fadeInterval !== null) {
          clearInterval(this.fadeInterval);
          this.fadeInterval = null;
        }
        if (this.bgmAudio) {
          try {
            this.bgmAudio.volume = targetVol;
          } catch {
            // Ignore volume setting errors
          }
        }
      }
    }, stepTime);
  }

  /**
   * Syncs BGM with selected theme if autoThemeBgm option is enabled
   */
  public syncThemeBgm(themeId: string): void {
    if (!this.config.autoThemeBgm) return;

    const matched = BGM_TRACKS.find((t) => t.recommendedThemeIds.includes(themeId));
    if (matched && matched.id !== this.config.currentBgmTrackId) {
      this.switchBgm(matched.id);
    }
  }

  public setAutoThemeBgm(enabled: boolean): void {
    this.config.autoThemeBgm = enabled;
    this.saveSettings();
  }

  public toggleBgmMute(): boolean {
    this.config.bgmMuted = !this.config.bgmMuted;
    if (this.bgmAudio) {
      if (this.config.bgmMuted) {
        this.pauseBgm();
      } else {
        this.playBgm();
      }
    }
    this.saveSettings();
    return this.config.bgmMuted;
  }

  public setBgmVolume(volume: number): void {
    this.config.bgmVolume = Math.max(0, Math.min(1, volume));
    if (this.bgmAudio && !this.config.bgmMuted) {
      this.bgmAudio.volume = this.config.bgmVolume;
    }
    this.saveSettings();
  }

  public playSfx(type: SfxType): void {
    if (this.config.sfxMuted || typeof window === 'undefined') return;

    const pool = this.sfxPool.get(type);
    if (!pool || pool.length === 0) {
      try {
        const audio = new Audio(SFX_PATHS[type][0]);
        audio.volume = this.config.sfxVolume;
        const playPromise = audio.play();
        if (playPromise !== undefined && typeof playPromise.catch === 'function') {
          playPromise.catch(() => {});
        }
      } catch {
        // Suppress audio play error
      }
      return;
    }

    const audio = pool.find((a) => a.paused || a.ended) || pool[0];
    try {
      audio.currentTime = 0;
      audio.volume = this.config.sfxVolume;
      const playPromise = audio.play();
      if (playPromise !== undefined && typeof playPromise.catch === 'function') {
        playPromise.catch(() => {});
      }
    } catch {
      // Suppress audio play error
    }
  }

  public toggleSfxMute(): boolean {
    this.config.sfxMuted = !this.config.sfxMuted;
    this.saveSettings();
    return this.config.sfxMuted;
  }

  public setSfxVolume(volume: number): void {
    this.config.sfxVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings();
  }

  public getConfig(): AudioConfig {
    return { ...this.config };
  }

  public getCurrentTrack(): BgmTrack {
    return this.getTrack(this.config.currentBgmTrackId);
  }

  public subscribe(listener: (config: AudioConfig) => void): () => void {
    this.listeners.add(listener);
    listener(this.getConfig());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const config = this.getConfig();
    this.listeners.forEach((listener) => listener(config));
  }
}

export const audioManager = AudioManager.getInstance();
