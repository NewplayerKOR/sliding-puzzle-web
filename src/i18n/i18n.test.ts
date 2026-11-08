import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { translations, Language } from './translations';
import {
  getCurrentLanguage,
  getInitialLanguage,
  resetGlobalLanguage,
  setGlobalLanguage,
} from './useTranslation';
import { formatMessage } from './format';

describe('i18n translations', () => {
  const languages: Language[] = ['ko', 'en', 'ja', 'zh'];
  const baseKeys = Object.keys(translations.ko) as Array<keyof typeof translations.ko>;

  beforeEach(() => {
    localStorage.removeItem('sliding_puzzle_lang');
    resetGlobalLanguage();
  });

  afterEach(() => {
    resetGlobalLanguage();
  });

  it('all languages have all defined keys without missing or empty translations', () => {
    languages.forEach((lang) => {
      const dict = translations[lang];
      expect(dict).toBeDefined();
      expect(Object.keys(dict).sort()).toEqual([...baseKeys].sort());
      baseKeys.forEach((key) => {
        expect(dict[key], `Missing key "${key}" in language "${lang}"`).toBeDefined();
        expect(typeof dict[key]).toBe('string');
        expect(dict[key].trim().length, `Empty key "${key}" in language "${lang}"`).toBeGreaterThan(0);
      });
    });
  });

  it('has no Korean hardcoding in EN/JA/ZH dictionaries', () => {
    (['en', 'ja', 'zh'] as Language[]).forEach((lang) => {
      baseKeys.forEach((key) => {
        expect(
          translations[lang][key],
          `Korean text left in "${key}" for language "${lang}"`
        ).not.toMatch(/[가-힣]/);
      });
    });
  });

  it('syncs document.documentElement.lang with the selected language', () => {
    setGlobalLanguage('en');
    expect(getCurrentLanguage()).toBe('en');
    expect(document.documentElement.lang).toBe('en');

    setGlobalLanguage('ja');
    expect(document.documentElement.lang).toBe('ja');

    resetGlobalLanguage();
    expect(document.documentElement.lang).toBe('ko');
  });

  it('detects fallback language cleanly', () => {
    const lang = getInitialLanguage();
    expect(['ko', 'en', 'ja', 'zh']).toContain(lang);
  });

  it('falls back to ko for unsupported language values', () => {
    localStorage.setItem('sliding_puzzle_lang', 'fr');
    expect(getInitialLanguage()).toBe('ko');
  });

  it('falls back to ko when storage access is blocked', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('storage blocked');
      },
      setItem: () => {
        throw new Error('storage blocked');
      },
      removeItem: () => {
        throw new Error('storage blocked');
      },
    });

    expect(getInitialLanguage()).toBe('ko');
    expect(() => setGlobalLanguage('en')).not.toThrow();
    vi.unstubAllGlobals();
  });

  it('formats placeholder templates and keeps unknown placeholders', () => {
    expect(formatMessage('{mode} ({seconds}s)', { mode: 'Time Attack', seconds: 45 })).toBe(
      'Time Attack (45s)'
    );
    expect(formatMessage('{missing}', {})).toBe('{missing}');
  });
});
