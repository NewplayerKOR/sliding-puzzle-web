import { describe, it, expect } from 'vitest';
import { translations, Language } from './translations';
import { getInitialLanguage } from './useTranslation';

describe('i18n translations', () => {
  const languages: Language[] = ['ko', 'en', 'ja', 'zh'];
  const baseKeys = Object.keys(translations.ko) as Array<keyof typeof translations.ko>;

  it('all languages have all defined keys without missing translations', () => {
    languages.forEach((lang) => {
      const dict = translations[lang];
      expect(dict).toBeDefined();
      baseKeys.forEach((key) => {
        expect(dict[key], `Missing key "${key}" in language "${lang}"`).toBeDefined();
        expect(typeof dict[key]).toBe('string');
        expect(dict[key].length).toBeGreaterThan(0);
      });
    });
  });

  it('detects fallback language cleanly', () => {
    const lang = getInitialLanguage();
    expect(['ko', 'en', 'ja', 'zh']).toContain(lang);
  });
});
