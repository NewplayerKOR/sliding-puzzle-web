import { describe, it, expect, beforeEach } from 'vitest';
import { checkGameCompletionAchievements, getStoredAchievements, saveStoredAchievements } from './achievementManager';
import { INITIAL_ACHIEVEMENTS } from './achievementData';

describe('achievementManager', () => {
  beforeEach(() => {
    localStorage.clear();
    saveStoredAchievements(INITIAL_ACHIEVEMENTS);
  });

  it('unlocks first_victory on any completion', () => {
    const newly = checkGameCompletionAchievements({
      gridSize: 3,
      moveCount: 40,
      elapsedTime: 45,
      stars: 2,
      themeId: 'nature',
      isCustomImage: false,
      challengeMode: 'standard',
      usedUndoCount: 1,
      streakCount: 1,
    });

    expect(newly.some((a) => a.id === 'first_victory')).toBe(true);
    const stored = getStoredAchievements();
    expect(stored.find((a) => a.id === 'first_victory')?.unlockedAt).toBeDefined();
  });

  it('unlocks speed_demon when 3x3 completed under 30s', () => {
    const newly = checkGameCompletionAchievements({
      gridSize: 3,
      moveCount: 20,
      elapsedTime: 25,
      stars: 3,
      themeId: 'nature',
      isCustomImage: false,
      challengeMode: 'standard',
      usedUndoCount: 0,
      streakCount: 1,
    });

    expect(newly.some((a) => a.id === 'speed_demon')).toBe(true);
    expect(newly.some((a) => a.id === 'purist_no_undo')).toBe(true);
  });

  it('unlocks grandmaster_5x5 on 5x5 completion', () => {
    const newly = checkGameCompletionAchievements({
      gridSize: 5,
      moveCount: 150,
      elapsedTime: 200,
      stars: 3,
      themeId: 'abstract',
      isCustomImage: false,
      challengeMode: 'standard',
      usedUndoCount: 0,
      streakCount: 1,
    });

    expect(newly.some((a) => a.id === 'grandmaster_5x5')).toBe(true);
  });
});
