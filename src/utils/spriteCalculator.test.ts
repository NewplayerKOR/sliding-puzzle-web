import { describe, it, expect } from 'vitest';
import { getTileSpriteStyle } from './spriteCalculator';

describe('spriteCalculator', () => {
  it('calculates background-position correctly for 3x3 grid', () => {
    // 3x3: columns 0, 1, 2 => 0%, 50%, 100%
    const style0 = getTileSpriteStyle(0, 3, '/test.png'); // row 0, col 0
    expect(style0.backgroundPosition).toBe('0% 0%');
    expect(style0.backgroundSize).toBe('300% 300%');

    const style1 = getTileSpriteStyle(1, 3, '/test.png'); // row 0, col 1
    expect(style1.backgroundPosition).toBe('50% 0%');

    const style4 = getTileSpriteStyle(4, 3, '/test.png'); // row 1, col 1
    expect(style4.backgroundPosition).toBe('50% 50%');

    const style8 = getTileSpriteStyle(8, 3, '/test.png'); // row 2, col 2
    expect(style8.backgroundPosition).toBe('100% 100%');
  });

  it('calculates background-position correctly for 4x4 grid', () => {
    // 4x4: col 3, row 3 => 100% 100%
    const style15 = getTileSpriteStyle(15, 4, '/test.png');
    expect(style15.backgroundPosition).toBe('100% 100%');
    expect(style15.backgroundSize).toBe('400% 400%');

    const style5 = getTileSpriteStyle(5, 4, '/test.png'); // row 1, col 1 => (1/3)*100%
    expect(parseFloat(style5.backgroundPosition.split(' ')[0])).toBeCloseTo(33.333, 1);
  });
});
