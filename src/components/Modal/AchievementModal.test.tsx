import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { AchievementModal } from './AchievementModal';
import { INITIAL_ACHIEVEMENTS } from '../../utils/achievementData';
import { saveStoredAchievements } from '../../utils/achievementManager';
import { resetGlobalLanguage } from '../../i18n/useTranslation';

describe('AchievementModal progress accessibility', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
  });

  afterEach(() => {
    cleanup();
    localStorage.clear();
    resetGlobalLanguage();
  });

  it('exposes locked achievement progress as a labeled progressbar', () => {
    saveStoredAchievements(
      INITIAL_ACHIEVEMENTS.map((achievement) =>
        achievement.id === 'star_collector'
          ? { ...achievement, progress: 2 }
          : achievement
      )
    );

    render(<AchievementModal isOpen={true} onClose={() => {}} />);

    const progressbar = screen.getByRole('progressbar', { name: '별들의 수집가' });
    expect(progressbar.getAttribute('aria-valuemin')).toBe('0');
    expect(progressbar.getAttribute('aria-valuemax')).toBe('3');
    expect(progressbar.getAttribute('aria-valuenow')).toBe('2');
    expect(progressbar.getAttribute('aria-valuetext')).toBe('2 / 3');
  });
});
