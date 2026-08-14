import { useState, useEffect, useCallback } from 'react';
import { Language, translations, Translations } from './translations';

const LANG_STORAGE_KEY = 'sliding_puzzle_lang';

export function getInitialLanguage(): Language {
  if (typeof window === 'undefined') return 'ko';
  const saved = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
  if (saved && ['ko', 'en', 'ja', 'zh'].includes(saved)) {
    return saved;
  }
  return 'ko';
}

// Global language store & subscribers
let currentGlobalLanguage: Language = getInitialLanguage();
const listeners = new Set<(lang: Language) => void>();

function setGlobalLanguage(newLang: Language) {
  currentGlobalLanguage = newLang;
  try {
    localStorage.setItem(LANG_STORAGE_KEY, newLang);
  } catch {
    // ignore
  }
  listeners.forEach((listener) => {
    try {
      listener(newLang);
    } catch {
      // ignore
    }
  });
}

export function resetGlobalLanguage() {
  currentGlobalLanguage = 'ko';
  listeners.forEach((listener) => {
    try {
      listener('ko');
    } catch {
      // ignore
    }
  });
}

export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(() => currentGlobalLanguage);

  useEffect(() => {
    const handleUpdate = (lang: Language) => {
      setLanguageState(lang);
    };
    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const changeLanguage = useCallback((newLang: Language) => {
    setGlobalLanguage(newLang);
  }, []);

  const t: Translations = translations[language] || translations.ko;

  return {
    language,
    changeLanguage,
    t,
  };
}
