import { describe, it, expect, beforeEach } from 'vitest';
import {
  checkGameCompletionAchievements,
  getStoredAchievements,
  saveStoredAchievements,
  onAchievementUnlocked,
} from './achievementManager';
import { INITIAL_ACHIEVEMENTS } from './achievementData';

const fastThreeByThreeWin = {
  gridSize: 3,
  moveCount: 20,
  elapsedTime: 25,
  stars: 3,
  themeId: 'nature',
  isCustomImage: false,
  challengeMode: 'standard',
  usedUndoCount: 0,
  streakCount: 1,
} as const;

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

  it('notifies every achievement unlocked by one completion in unlock order', () => {
    const received: string[] = [];
    const unsubscribe = onAchievementUnlocked((achievement) => {
      received.push(achievement.id);
    });

    const newly = checkGameCompletionAchievements(fastThreeByThreeWin);
    unsubscribe();

    const newlyIds = newly.map((a) => a.id);
    expect(newlyIds).toEqual(['first_victory', 'speed_demon', 'purist_no_undo']);
    expect(received).toEqual(newlyIds);
  });

  it('keeps the latest metadata while preserving saved unlock state and progress', () => {
    const staleSaved = [
      {
        id: 'first_victory',
        titleKey: 'staleTitle',
        descriptionKey: 'staleDescription',
        iconName: 'StaleIcon',
        unlockedAt: '2025-01-02T03:04:05.000Z',
        progress: 7,
        maxProgress: 99,
      },
      {
        id: 'star_collector',
        titleKey: 'staleStarTitle',
        descriptionKey: 'staleStarDescription',
        iconName: 'StaleStarIcon',
        unlockedAt: null,
        progress: 2,
        maxProgress: 99,
      },
    ];
    localStorage.setItem('sliding_puzzle_achievements', JSON.stringify(staleSaved));

    const stored = getStoredAchievements();
    const firstVictory = stored.find((a) => a.id === 'first_victory');
    const starCollector = stored.find((a) => a.id === 'star_collector');
    const latestFirstVictory = INITIAL_ACHIEVEMENTS.find((a) => a.id === 'first_victory');
    const latestStarCollector = INITIAL_ACHIEVEMENTS.find((a) => a.id === 'star_collector');

    expect(firstVictory?.titleKey).toBe(latestFirstVictory?.titleKey);
    expect(firstVictory?.descriptionKey).toBe(latestFirstVictory?.descriptionKey);
    expect(firstVictory?.iconName).toBe(latestFirstVictory?.iconName);
    expect(firstVictory?.unlockedAt).toBe('2025-01-02T03:04:05.000Z');
    expect(firstVictory?.progress).toBe(7);

    expect(starCollector?.titleKey).toBe(latestStarCollector?.titleKey);
    expect(starCollector?.maxProgress).toBe(latestStarCollector?.maxProgress);
    expect(starCollector?.progress).toBe(2);
    expect(starCollector?.unlockedAt).toBeNull();

    // 저장소에만 있던 알 수 없는 ID는 목록에 추가하지 않음
    expect(stored).toHaveLength(INITIAL_ACHIEVEMENTS.length);
  });

  it('does not mutate the initial achievement definitions when storage is empty', () => {
    localStorage.clear();

    const stored = getStoredAchievements();
    const target = stored.find((a) => a.id === 'first_victory');
    if (target) {
      target.unlockedAt = '2025-06-01T00:00:00.000Z';
    }

    expect(INITIAL_ACHIEVEMENTS.find((a) => a.id === 'first_victory')?.unlockedAt).toBeNull();
  });
});
