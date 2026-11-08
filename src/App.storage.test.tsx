import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

const blockedStorage = {
  getItem: () => {
    throw new Error('storage blocked');
  },
  setItem: () => {
    throw new Error('storage blocked');
  },
  removeItem: () => {
    throw new Error('storage blocked');
  },
  clear: () => {
    throw new Error('storage blocked');
  },
};

describe('App storage resilience', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', blockedStorage);
    resetGlobalLanguage();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  it('renders the title screen when storage access is blocked', () => {
    render(<App />);

    expect(screen.getAllByText(/Sliding Puzzle/i).length).toBeGreaterThan(0);
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(screen.getByText('업적 도감')).toBeDefined();
  });
});
