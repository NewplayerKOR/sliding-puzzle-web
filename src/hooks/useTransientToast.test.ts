import { describe, expect, it, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useTransientToast } from './useTransientToast';

describe('useTransientToast', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('shows the latest message for the full duration after consecutive calls', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTransientToast(3000));

    act(() => result.current.showToast('첫 번째'));
    act(() => vi.advanceTimersByTime(2000));
    act(() => result.current.showToast('두 번째'));

    act(() => vi.advanceTimersByTime(2000));
    expect(result.current.message).toBe('두 번째');

    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.message).toBeNull();
  });

  it('keeps only one timer and clears it on unmount', () => {
    vi.useFakeTimers();
    const { result, unmount } = renderHook(() => useTransientToast(3000));

    act(() => result.current.showToast('첫 번째'));
    act(() => result.current.showToast('두 번째'));

    expect(vi.getTimerCount()).toBe(1);

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });

  it('dismisses immediately when requested', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useTransientToast(3000));

    act(() => result.current.showToast('메시지'));
    act(() => result.current.dismissToast());

    expect(result.current.message).toBeNull();
    expect(vi.getTimerCount()).toBe(0);
  });
});
