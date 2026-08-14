import { GridSize } from './puzzle';

export type ThemeId = 'nature' | 'pixel_art' | 'abstract' | 'animal';

export type GameMode = 'image' | 'number';

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
