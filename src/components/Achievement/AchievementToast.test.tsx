import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
import { AchievementToast } from './AchievementToast';
import {
  checkGameCompletionAchievements,
  saveStoredAchievements,
} from '../../utils/achievementManager';
import { INITIAL_ACHIEVEMENTS } from '../../utils/achievementData';
import { resetGlobalLanguage } from '../../i18n/useTranslation';
import { audioManager } from '../../utils/audioManager';

vi.mock('../../utils/audioManager', () => ({
  audioManager: {
    playSfx: vi.fn(),
  },
}));

const mockedPlaySfx = vi.mocked(audioManager.playSfx);

// jsdom은 localStorage 쓰기 후 storage 이벤트를 0ms 타이머로 전달한다.
// 업적 토스트 자체 타이머만 남기기 위해 저장소 이벤트 타이머를 먼저 소진한다.
function flushStorageEventTimers() {
  act(() => {
    vi.advanceTimersByTime(0);
  });
}

function unlockFastThreeByThreeWin() {
  return checkGameCompletionAchievements({
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
}

describe('AchievementToast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    resetGlobalLanguage();
    saveStoredAchievements(INITIAL_ACHIEVEMENTS);
    mockedPlaySfx.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.useRealTimers();
    resetGlobalLanguage();
    localStorage.clear();
  });

  it('shows every achievement unlocked by one completion in order', () => {
    render(<AchievementToast />);

    act(() => {
      unlockFastThreeByThreeWin();
    });
    flushStorageEventTimers();

    expect(screen.getByText('첫 승리의 기쁨')).toBeDefined();
    expect(screen.queryByText('스피드 데몬')).toBeNull();
    expect(screen.queryByText('완벽한 직관 (No Undo)')).toBeNull();
    expect(mockedPlaySfx).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(1);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('첫 승리의 기쁨')).toBeNull();
    expect(screen.getByText('스피드 데몬')).toBeDefined();
    expect(screen.queryByText('완벽한 직관 (No Undo)')).toBeNull();
    expect(mockedPlaySfx).toHaveBeenCalledTimes(2);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByText('스피드 데몬')).toBeNull();
    expect(screen.getByText('완벽한 직관 (No Undo)')).toBeDefined();
    expect(mockedPlaySfx).toHaveBeenCalledTimes(3);

    act(() => {
      vi.advanceTimersByTime(4500);
    });

    expect(screen.queryByRole('alert')).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
    expect(mockedPlaySfx).toHaveBeenCalledTimes(3);
  });

  it('clears the pending toast timer on unmount', () => {
    const { unmount } = render(<AchievementToast />);

    act(() => {
      unlockFastThreeByThreeWin();
    });
    flushStorageEventTimers();

    expect(vi.getTimerCount()).toBe(1);

    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
