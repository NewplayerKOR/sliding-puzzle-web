import { describe, expect, it, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
  afterEach(() => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('locks body scrolling while active and restores the previous style', () => {
    document.body.style.overflow = 'auto';

    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: false },
    });
    expect(document.body.style.overflow).toBe('auto');

    rerender({ locked: true });
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });
    expect(document.body.style.overflow).toBe('auto');
  });

  it('restores the body style on unmount', () => {
    document.body.style.overflow = 'scroll';

    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.body.style.overflow).toBe('scroll');
  });
});
