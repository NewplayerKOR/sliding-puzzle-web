import { Achievement } from '../types/achievement';
import { INITIAL_ACHIEVEMENTS } from './achievementData';
import { GridSize } from '../types/puzzle';
import { ThemeId } from '../types/theme';
import { isRecord, readStorageJson, writeStorageJson } from './storage';

const ACHIEVEMENTS_STORAGE_KEY = 'sliding_puzzle_achievements';
const STATS_STORAGE_KEY = 'sliding_puzzle_achievement_stats';
const ACHIEVEMENT_THEME_IDS: ThemeId[] = ['nature', 'pixel_art', 'abstract', 'animal'];

interface AchievementStats {
  threeStarCount: number;
  clearedThemes: string[];
  hasUsedUndoInGame: boolean;
}

interface StoredAchievementState {
  unlockedAt: string | null;
  progress?: number;
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

function toNonNegativeInteger(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0
    ? Math.floor(value)
    : 0;
}

function isThemeId(value: unknown): value is ThemeId {
  return typeof value === 'string' && (ACHIEVEMENT_THEME_IDS as string[]).includes(value);
}

function createEmptyStats(): AchievementStats {
  return { threeStarCount: 0, clearedThemes: [], hasUsedUndoInGame: false };
}

// 저장된 업적 배열에서 달성 상태와 진행도만 추출하고, 잘못된 항목은 무시함.
function parseStoredAchievements(value: unknown): Map<string, StoredAchievementState> {
  const result = new Map<string, StoredAchievementState>();
  if (!Array.isArray(value)) return result;

  for (const item of value) {
    if (!isRecord(item) || typeof item.id !== 'string') continue;

    result.set(item.id, {
      unlockedAt: typeof item.unlockedAt === 'string' ? item.unlockedAt : null,
      progress:
        typeof item.progress === 'number' && Number.isFinite(item.progress) && item.progress >= 0
          ? Math.floor(item.progress)
          : undefined,
    });
  }

  return result;
}

function normalizeStats(value: unknown): AchievementStats | null {
  if (!isRecord(value)) return null;

  return {
    threeStarCount: toNonNegativeInteger(value.threeStarCount),
    clearedThemes: Array.isArray(value.clearedThemes)
      ? Array.from(new Set(value.clearedThemes.filter(isThemeId)))
      : [],
    hasUsedUndoInGame: value.hasUsedUndoInGame === true,
  };
}

export function getStoredAchievements(): Achievement[] {
  const saved = readStorageJson(ACHIEVEMENTS_STORAGE_KEY, parseStoredAchievements);

  // 정적 메타데이터는 최신 정의를 쓰고, 저장된 달성 상태·진행도만 유지함.
  return INITIAL_ACHIEVEMENTS.map((init) => {
    const found = saved?.get(init.id);
    if (!found) return { ...init };

    return {
      ...init,
      unlockedAt: found.unlockedAt,
      progress: found.progress ?? init.progress,
    };
  });
}

export function saveStoredAchievements(achievements: Achievement[]) {
  writeStorageJson(ACHIEVEMENTS_STORAGE_KEY, achievements);
}

function getStats(): AchievementStats {
  return readStorageJson(STATS_STORAGE_KEY, normalizeStats) ?? createEmptyStats();
}

function saveStats(stats: AchievementStats) {
  writeStorageJson(STATS_STORAGE_KEY, stats);
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
