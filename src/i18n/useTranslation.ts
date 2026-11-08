import { useState, useEffect, useCallback } from 'react';
import { Language, translations, Translations } from './translations';
import { readStorageItem, writeStorageItem } from '../utils/storage';

const LANG_STORAGE_KEY = 'sliding_puzzle_lang';
const SUPPORTED_LANGUAGES: Language[] = ['ko', 'en', 'ja', 'zh'];

export function getInitialLanguage(): Language {
  const saved = readStorageItem(LANG_STORAGE_KEY);
  if (saved && SUPPORTED_LANGUAGES.includes(saved as Language)) {
    return saved as Language;
  }
  return 'ko';
}

function applyDocumentLanguage(lang: Language) {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lang;
  }
}

// Global language store & subscribers
let currentGlobalLanguage: Language = getInitialLanguage();
const listeners = new Set<(lang: Language) => void>();

applyDocumentLanguage(currentGlobalLanguage);

export function getCurrentLanguage(): Language {
  return currentGlobalLanguage;
}

export function setGlobalLanguage(newLang: Language) {
  currentGlobalLanguage = newLang;
  applyDocumentLanguage(newLang);
  writeStorageItem(LANG_STORAGE_KEY, newLang);
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
  applyDocumentLanguage('ko');
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
