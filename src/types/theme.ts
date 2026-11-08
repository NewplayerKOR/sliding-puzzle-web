import { GridSize } from './puzzle';
import type { Translations } from '../i18n/translations';

export type ThemeId = 'nature' | 'pixel_art' | 'abstract' | 'animal';

export type GameMode = 'image' | 'number';

// 번역 키만 보관하는 테마 원본 정의
export interface ThemeDefinition {
  id: ThemeId;
  nameKey: keyof Translations;
  categoryKey: keyof Translations;
  descriptionKey: keyof Translations;
  imagePath: string;
}

// 현재 언어로 해석된 테마 정보
export interface ThemeInfo {
  id: ThemeId;
  name: string;
  category: string;
  description: string;
  imagePath: string;
  thumbnailPath?: string;
}

export type Theme = ThemeInfo;

export interface BestRecord {
  bestTime: number; // in seconds
  bestMoves: number;
  clearedAt: string; // ISO date string
}

export type BestRecords = Record<GridSize, BestRecord | null>;
