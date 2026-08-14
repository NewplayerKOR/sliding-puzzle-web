import { Achievement } from '../types/achievement';
import { INITIAL_ACHIEVEMENTS } from './achievementData';
import { GridSize } from '../types/puzzle';
import { ThemeId } from '../types/theme';

const ACHIEVEMENTS_STORAGE_KEY = 'sliding_puzzle_achievements';
const STATS_STORAGE_KEY = 'sliding_puzzle_achievement_stats';

interface AchievementStats {
  threeStarCount: number;
  clearedThemes: string[];
  hasUsedUndoInGame: boolean;
}

type AchievementUnlockListener = (achievement: Achievement) => void;
const listeners: Set<AchievementUnlockListener> = new Set();

export function onAchievementUnlocked(callback: AchievementUnlockListener): () => void {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function notifyUnlock(achievement: Achievement) {
  listeners.forEach((cb) => {
    try {
      cb(achievement);
    } catch {
      // ignore
    }
  });
}

export function getStoredAchievements(): Achievement[] {
  if (typeof window === 'undefined') return INITIAL_ACHIEVEMENTS;
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    if (raw) {
      const saved: Achievement[] = JSON.parse(raw);
      // Merge in case initial achievements updated
      return INITIAL_ACHIEVEMENTS.map((init) => {
        const found = saved.find((s) => s.id === init.id);
        return found ? { ...init, ...found } : init;
      });
    }
  } catch {
    // ignore
  }
  return INITIAL_ACHIEVEMENTS;
}

export function saveStoredAchievements(achievements: Achievement[]) {
  try {
    localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(achievements));
  } catch {
    // ignore
  }
}

function getStats(): AchievementStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  return { threeStarCount: 0, clearedThemes: [], hasUsedUndoInGame: false };
}

function saveStats(stats: AchievementStats) {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // ignore
  }
}

export interface GameCompletionContext {
  gridSize: GridSize;
  moveCount: number;
  elapsedTime: number;
  stars: number;
  themeId: ThemeId;
  isCustomImage: boolean;
  challengeMode: 'standard' | 'timeAttack' | 'moveLimit';
  usedUndoCount: number;
  streakCount: number;
}

/**
 * Check and unlock achievements upon game completion
 */
export function checkGameCompletionAchievements(ctx: GameCompletionContext): Achievement[] {
  const currentList = getStoredAchievements();
  const newlyUnlocked: Achievement[] = [];
  const stats = getStats();

  const unlock = (id: string) => {
    const target = currentList.find((a) => a.id === id);
    if (target && !target.unlockedAt) {
      target.unlockedAt = new Date().toISOString();
      newlyUnlocked.push(target);
      notifyUnlock(target);
    }
  };

  // 1. First victory
  unlock('first_victory');

  // 2. Speed Demon (3x3 in <= 30s)
  if (ctx.gridSize === 3 && ctx.elapsedTime <= 30) {
    unlock('speed_demon');
  }

  // 3. Master Tactician (4x4 in <= 50 moves)
  if (ctx.gridSize === 4 && ctx.moveCount <= 50) {
    unlock('master_tactician');
  }

  // 4. Grandmaster (5x5 completed)
  if (ctx.gridSize === 5) {
    unlock('grandmaster_5x5');
  }

  // 5. Star Collector (3 stars x 3 times)
  if (ctx.stars === 3) {
    stats.threeStarCount += 1;
    const starAch = currentList.find((a) => a.id === 'star_collector');
    if (starAch) {
      starAch.progress = Math.min(stats.threeStarCount, 3);
      if (stats.threeStarCount >= 3) {
        unlock('star_collector');
      }
    }
  }

  // 6. Purist (No Undo)
  if (ctx.usedUndoCount === 0) {
    unlock('purist_no_undo');
  }

  // 7. Daily Streak 3
  if (ctx.streakCount >= 3) {
    const streakAch = currentList.find((a) => a.id === 'daily_streak_3');
    if (streakAch) {
      streakAch.progress = Math.min(ctx.streakCount, 3);
      unlock('daily_streak_3');
    }
  }

  // 8. Theme Explorer
  if (!stats.clearedThemes.includes(ctx.themeId) && !ctx.isCustomImage) {
    stats.clearedThemes.push(ctx.themeId);
  }
  const themeAch = currentList.find((a) => a.id === 'theme_explorer');
  if (themeAch) {
    themeAch.progress = Math.min(stats.clearedThemes.length, 4);
    if (stats.clearedThemes.length >= 4) {
      unlock('theme_explorer');
    }
  }

  // 9. Custom Photographer
  if (ctx.isCustomImage) {
    unlock('custom_photographer');
  }

  // 10. Time Attack Survivor
  if (ctx.challengeMode === 'timeAttack') {
    unlock('time_attack_survivor');
  }

  // 11. Move Limit Master
  if (ctx.challengeMode === 'moveLimit') {
    unlock('move_limit_master');
  }

  // 12. Puzzle Legend (All 11 achievements unlocked)
  const totalOtherUnlocked = currentList.filter((a) => a.id !== 'puzzle_legend' && a.unlockedAt).length;
  const legendAch = currentList.find((a) => a.id === 'puzzle_legend');
  if (legendAch) {
    legendAch.progress = totalOtherUnlocked;
    if (totalOtherUnlocked >= 11) {
      unlock('puzzle_legend');
    }
  }

  saveStats(stats);
  saveStoredAchievements(currentList);

  return newlyUnlocked;
}
