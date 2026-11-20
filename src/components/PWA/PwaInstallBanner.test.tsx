import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { PwaInstallBanner } from './PwaInstallBanner';
import { resetGlobalLanguage } from '../../i18n/useTranslation';

const dispatchInstallPrompt = ({
  prompt = vi.fn().mockResolvedValue(undefined),
  outcome = 'accepted' as 'accepted' | 'dismissed',
}: {
  prompt?: () => Promise<void>;
  outcome?: 'accepted' | 'dismissed';
} = {}) => {
  const event = new Event('beforeinstallprompt', { cancelable: true });
  Object.assign(event, {
    prompt,
    userChoice: Promise.resolve({ outcome, platform: 'web' }),
  });

  act(() => {
    window.dispatchEvent(event);
  });

  return { event, prompt };
};

describe('PwaInstallBanner', () => {
  beforeEach(() => {
    resetGlobalLanguage();
  });

  afterEach(() => {
    cleanup();
    resetGlobalLanguage();
  });

  it('shows a complementary install region when the browser prompt is available', () => {
    render(<PwaInstallBanner />);
    expect(screen.queryByRole('complementary')).toBeNull();

    const { event } = dispatchInstallPrompt();

    expect(event.defaultPrevented).toBe(true);
    expect(screen.getByRole('complementary', { name: /앱으로 설치/ })).toBeDefined();
    expect(screen.getByRole('button', { name: /홈 화면에 설치/ })).toBeDefined();
  });

  it('uses the prompt once and hides the banner after the choice is made', async () => {
    render(<PwaInstallBanner />);
    const { prompt } = dispatchInstallPrompt({ outcome: 'dismissed' });

    await act(async () => {
      screen.getByRole('button', { name: /홈 화면에 설치/ }).click();
    });

    expect(prompt).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('complementary')).toBeNull();
    });
  });

  it('closes safely when the browser rejects the prompt', async () => {
    render(<PwaInstallBanner />);
    dispatchInstallPrompt({
      prompt: vi.fn().mockRejectedValue(new Error('prompt unavailable')),
    });

    await act(async () => {
      screen.getByRole('button', { name: /홈 화면에 설치/ }).click();
    });

    await waitFor(() => {
      expect(screen.queryByRole('complementary')).toBeNull();
    });
  });

  it('hides the banner when the app is installed from the browser UI', () => {
    render(<PwaInstallBanner />);
    dispatchInstallPrompt();

    act(() => {
      window.dispatchEvent(new Event('appinstalled'));
    });

    expect(screen.queryByRole('complementary')).toBeNull();
  });
});
