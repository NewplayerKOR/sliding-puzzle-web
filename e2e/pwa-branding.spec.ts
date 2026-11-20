import { expect, test } from '@playwright/test';

test('PWA 설치 배너가 360×640·1280×800에서 화면 안에 표시되고 선택 후 닫힌다', async ({ page }) => {
  await page.goto('/');

  await page.evaluate(() => {
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.assign(event, {
      prompt: async () => {},
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: 'web' }),
    });
    window.dispatchEvent(event);
  });

  const banner = page.getByRole('complementary', { name: /앱으로 설치/ });
  await expect(banner).toBeVisible();

  for (const viewport of [
    { width: 360, height: 640 },
    { width: 1280, height: 800 },
  ]) {
    await page.setViewportSize(viewport);
    await page.waitForTimeout(400);

    const metrics = await page.evaluate(() => {
      const container = document.querySelector('.pwa-banner-container') as HTMLElement;
      const card = document.querySelector('.pwa-banner-card') as HTMLElement;
      const install = document.querySelector('.btn-pwa-install') as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const cardRect = card.getBoundingClientRect();
      const installRect = install.getBoundingClientRect();
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        innerHeight: window.innerHeight,
        container: {
          left: containerRect.left,
          right: containerRect.right,
          top: containerRect.top,
          bottom: containerRect.bottom,
        },
        cardWidth: cardRect.width,
        installHeight: installRect.height,
      };
    });

    expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.container.left).toBeGreaterThanOrEqual(0);
    expect(metrics.container.right).toBeLessThanOrEqual(metrics.innerWidth);
    expect(metrics.container.top).toBeGreaterThanOrEqual(0);
    expect(metrics.container.bottom).toBeLessThanOrEqual(metrics.innerHeight);
    expect(metrics.cardWidth).toBeLessThanOrEqual(480);
    expect(metrics.installHeight).toBeGreaterThanOrEqual(44);
  }

  await page.getByRole('button', { name: /홈 화면에 설치/ }).click();
  await expect(banner).toBeHidden();
});
