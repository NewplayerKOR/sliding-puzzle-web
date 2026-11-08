import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { ServiceWorkerUpdateBanner } from './ServiceWorkerUpdateBanner';
import { SW_APPLY_UPDATE_EVENT, SW_UPDATE_AVAILABLE_EVENT } from '../../utils/swUpdateManager';
import { resetGlobalLanguage } from '../../i18n/useTranslation';

describe('ServiceWorkerUpdateBanner', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
  });

  afterEach(() => {
    cleanup();
    resetGlobalLanguage();
  });

  it('stays hidden until an update is available and dispatches an apply request on click', () => {
    render(<ServiceWorkerUpdateBanner />);
    expect(screen.queryByText(/새 버전이 준비되었습니다/)).toBeNull();

    act(() => {
      window.dispatchEvent(new CustomEvent(SW_UPDATE_AVAILABLE_EVENT));
    });
    expect(screen.getByText(/새 버전이 준비되었습니다/)).toBeDefined();

    const handleApply = vi.fn();
    window.addEventListener(SW_APPLY_UPDATE_EVENT, handleApply);

    fireEvent.click(screen.getByRole('button', { name: /지금 업데이트/ }));

    expect(handleApply).toHaveBeenCalledTimes(1);
    expect(screen.queryByText(/새 버전이 준비되었습니다/)).toBeNull();
    window.removeEventListener(SW_APPLY_UPDATE_EVENT, handleApply);
  });

  it('hides the notice without applying when the user chooses later', () => {
    render(<ServiceWorkerUpdateBanner />);

    act(() => {
      window.dispatchEvent(new CustomEvent(SW_UPDATE_AVAILABLE_EVENT));
    });

    const handleApply = vi.fn();
    window.addEventListener(SW_APPLY_UPDATE_EVENT, handleApply);

    fireEvent.click(screen.getByRole('button', { name: '나중에' }));

    expect(handleApply).not.toHaveBeenCalled();
    expect(screen.queryByText(/새 버전이 준비되었습니다/)).toBeNull();
    window.removeEventListener(SW_APPLY_UPDATE_EVENT, handleApply);
  });
});
