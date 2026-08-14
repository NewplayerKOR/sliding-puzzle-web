import { describe, it, expect } from 'vitest';
import { calculateStars } from './starCalculator';

describe('starCalculator', () => {
  it('awards 3 stars in 3x3 standard mode when under 35 moves and 45s', () => {
    const result = calculateStars({
      gridSize: 3,
      challengeMode: 'standard',
      moveCount: 20,
      elapsedTime: 30,
    });
    expect(result.stars).toBe(3);
    expect(result.feedbackKey).toBe('starCriteria3');
  });

  it('awards 2 stars in 4x4 standard mode for intermediate score', () => {
    const result = calculateStars({
      gridSize: 4,
      challengeMode: 'standard',
      moveCount: 110,
      elapsedTime: 180,
    });
    expect(result.stars).toBe(2);
    expect(result.feedbackKey).toBe('starCriteria2');
  });

  it('awards 3 stars in Time Attack 4x4 when cleared under 60 seconds', () => {
    const result = calculateStars({
      gridSize: 4,
      challengeMode: 'timeAttack',
      moveCount: 85,
      elapsedTime: 55,
    });
    expect(result.stars).toBe(3);
  });

  it('awards 3 stars in Move Limit 3x3 when cleared in 20 moves', () => {
    const result = calculateStars({
      gridSize: 3,
      challengeMode: 'moveLimit',
      moveCount: 20,
      elapsedTime: 60,
    });
    expect(result.stars).toBe(3);
  });
});
