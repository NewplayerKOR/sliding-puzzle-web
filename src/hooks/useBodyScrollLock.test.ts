import { describe, expect, it, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useBodyScrollLock } from './useBodyScrollLock';

describe('useBodyScrollLock', () => {
  afterEach(() => {
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  });

  it('locks root and body scrolling while active and restores the previous styles', () => {
    document.documentElement.style.overflow = 'auto';
    document.body.style.overflow = 'auto';

    const { rerender } = renderHook(({ locked }) => useBodyScrollLock(locked), {
      initialProps: { locked: false },
    });
    expect(document.documentElement.style.overflow).toBe('auto');
    expect(document.body.style.overflow).toBe('auto');

    rerender({ locked: true });
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');

    rerender({ locked: false });
    expect(document.documentElement.style.overflow).toBe('auto');
    expect(document.body.style.overflow).toBe('auto');
  });

  it('restores the root and body styles on unmount', () => {
    document.documentElement.style.overflow = 'scroll';
    document.body.style.overflow = 'scroll';

    const { unmount } = renderHook(() => useBodyScrollLock(true));
    expect(document.documentElement.style.overflow).toBe('hidden');
    expect(document.body.style.overflow).toBe('hidden');

    unmount();
    expect(document.documentElement.style.overflow).toBe('scroll');
    expect(document.body.style.overflow).toBe('scroll');
  });
});
