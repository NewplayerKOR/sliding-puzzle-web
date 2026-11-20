import { expect, test } from '@playwright/test';

test.describe('PWA 최초 설치 오프라인', () => {
  test('최초 방문 직후 오프라인 재로드에서도 타이틀 화면이 렌더링된다', async ({ browser }) => {
    test.slow();

    const context = await browser.newContext();
    const page = await context.newPage();
    const failedScripts: string[] = [];

    page.on('requestfailed', (request) => {
      if (request.resourceType() === 'script' || request.resourceType() === 'stylesheet') {
        failedScripts.push(request.url());
      }
    });

    await page.goto('/');
    await page.waitForFunction(
      () => Boolean(navigator.serviceWorker?.controller),
      undefined,
      { timeout: 30_000 }
    );

    const cacheInfo = await page.evaluate(async () => {
      const keys = await caches.keys();
      const cacheName = keys.find((key) => key.startsWith('sliding-puzzle-'));
      if (!cacheName) throw new Error('sliding-puzzle cache not found');

      const cache = await caches.open(cacheName);
      const urls = (await cache.keys()).map((request) => new URL(request.url).pathname);
      return { keys, urls };
    });

    expect(cacheInfo.keys).toContain('sliding-puzzle-v2.4');
    expect(cacheInfo.urls.some((url) => /\/assets\/index-.*\.js$/.test(url))).toBe(true);
    expect(cacheInfo.urls.some((url) => /\/assets\/index-.*\.css$/.test(url))).toBe(true);
    expect(cacheInfo.urls.some((url) => /\/assets\/solver\.worker-.*\.js$/.test(url))).toBe(
      true
    );

    await context.setOffline(true);
    await page.reload({ waitUntil: 'domcontentloaded' });

    await expect(page.locator('.title-screen-container')).toBeVisible();
    expect(await page.locator('#root > *').count()).toBeGreaterThan(0);
    expect(failedScripts).toEqual([]);

    await context.close();
  });
});
