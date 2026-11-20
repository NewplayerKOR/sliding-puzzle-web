import React from 'react';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { cleanup, render } from '@testing-library/react';
import { WinModal } from './WinModal';
import { resetGlobalLanguage } from '../../i18n/useTranslation';

const confettiMock = vi.hoisted(() => Object.assign(vi.fn(), { reset: vi.fn() }));

vi.mock('canvas-confetti', () => ({
  default: confettiMock,
}));

const baseProps = {
  moveCount: 12,
  elapsedTime: 30,
  gridSize: 3 as const,
  moveHistory: [],
  onPlayAgain: vi.fn(),
  onNextLevel: vi.fn(),
};

describe('WinModal confetti lifecycle', () => {
  beforeEach(() => {
    resetGlobalLanguage();
    confettiMock.mockClear();
    confettiMock.reset.mockClear();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    resetGlobalLanguage();
  });

  it('cancels the RAF loop and clears the confetti canvas when closed', () => {
    const cancelSpy = vi
      .spyOn(window, 'cancelAnimationFrame')
      .mockImplementation(() => {});
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 7);

    const { rerender } = render(<WinModal isOpen={true} {...baseProps} />);

    expect(confettiMock).toHaveBeenCalled();

    rerender(<WinModal isOpen={false} {...baseProps} />);

    expect(cancelSpy).toHaveBeenCalledWith(7);
    expect(confettiMock.reset).toHaveBeenCalledTimes(1);
  });

  it('skips confetti when reduced motion is requested', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn(
        (query: string) =>
          ({
            matches: query.includes('prefers-reduced-motion'),
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          }) as unknown as MediaQueryList
      )
    );

    render(<WinModal isOpen={true} {...baseProps} />);

    expect(confettiMock).not.toHaveBeenCalled();
  });
});
