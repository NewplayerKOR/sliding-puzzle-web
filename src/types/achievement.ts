import type { Translations } from '../i18n/translations';

export interface Achievement {
  id: string;
  titleKey: keyof Translations;
  descriptionKey: keyof Translations;
  iconName: string;
  unlockedAt: string | null; // ISO Date string if unlocked
  progress?: number;
  maxProgress?: number;
}

export type AchievementId =
  | 'first_victory'
  | 'speed_demon'
  | 'master_tactician'
  | 'grandmaster_5x5'
  | 'star_collector'
  | 'purist_no_undo'
  | 'daily_streak_3'
  | 'theme_explorer'
  | 'custom_photographer'
  | 'time_attack_survivor'
  | 'move_limit_master'
  | 'puzzle_legend';
