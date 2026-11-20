import { expect, test, type Page } from '@playwright/test';

const SW_UPDATE_AVAILABLE = 'sliding-puzzle:sw-update-available';

async function showUpdateBanner(page: Page) {
  await page.evaluate((eventName) => {
    window.dispatchEvent(new CustomEvent(eventName));
  }, SW_UPDATE_AVAILABLE);
  const banner = page.locator('.sw-update-banner');
  await expect(banner).toBeVisible();
  // slide-down 애니메이션이 끝난 뒤 위치를 측정함
  await page.waitForTimeout(400);
}

async function getBannerPlacement(page: Page) {
  return page.evaluate(() => {
    const banner = document.querySelector('.sw-update-banner') as HTMLElement;
    const topBar = document.querySelector('.title-top-bar, .header-top-row') as HTMLElement;
    const bannerRect = banner.getBoundingClientRect();
    const buttonBottoms = Array.from(topBar.querySelectorAll('button')).map(
      (button) => button.getBoundingClientRect().bottom
    );

    return {
      bannerTop: bannerRect.top,
      bannerLeft: bannerRect.left,
      bannerRight: bannerRect.right,
      headerButtonBottom: Math.max(...buttonBottoms),
      innerWidth: window.innerWidth,
      scrollWidth: document.documentElement.scrollWidth,
    };
  });
}

test.describe('PWA 첫 설치 업데이트 배너', () => {
  test('첫 설치에서는 controller가 활성화돼도 업데이트 배너를 표시하지 않는다', async ({
    page,
  }) => {
    await page.goto('/');

    await expect
      .poll(() => page.evaluate(() => Boolean(navigator.serviceWorker?.controller)), {
        timeout: 15_000,
      })
      .toBe(true);

    // WebKit에서 controller 활성화 직후 오탐이 발생하던 구간을 지나도 배너가 없어야 함
    await page.waitForTimeout(2500);
    await expect(page.locator('.sw-update-banner')).toHaveCount(0);
  });

  test('업데이트 배너는 헤더 버튼을 가리지 않고 화면 안에 표시된다', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await page.goto('/');
    await expect(page.locator('.title-screen-container')).toBeVisible();

    await showUpdateBanner(page);
    const title360 = await getBannerPlacement(page);
    expect(title360.bannerTop).toBeGreaterThanOrEqual(title360.headerButtonBottom);
    expect(title360.bannerLeft).toBeGreaterThanOrEqual(0);
    expect(title360.bannerRight).toBeLessThanOrEqual(title360.innerWidth);
    expect(title360.scrollWidth).toBeLessThanOrEqual(title360.innerWidth);
    await page.getByRole('button', { name: '나중에' }).click();
    await expect(page.locator('.sw-update-banner')).toHaveCount(0);

    await page.setViewportSize({ width: 1280, height: 800 });
    await showUpdateBanner(page);
    const title1280 = await getBannerPlacement(page);
    expect(title1280.bannerTop).toBeGreaterThanOrEqual(title1280.headerButtonBottom);
    expect(title1280.bannerLeft).toBeGreaterThanOrEqual(0);
    expect(title1280.bannerRight).toBeLessThanOrEqual(title1280.innerWidth);
    await page.getByRole('button', { name: '나중에' }).click();

    await page.setViewportSize({ width: 360, height: 640 });
    const card = page.locator('.mode-card.standard');
    await card.locator('.size-pill', { hasText: '3×3' }).click();
    await card.locator('.btn-play-mode.standard').click();
    await page.locator('.btn-theme-start-game').click();
    await expect(page.locator('.puzzle-board')).toBeVisible();

    await showUpdateBanner(page);
    const game360 = await getBannerPlacement(page);
    expect(game360.bannerTop).toBeGreaterThanOrEqual(game360.headerButtonBottom);
    expect(game360.bannerLeft).toBeGreaterThanOrEqual(0);
    expect(game360.bannerRight).toBeLessThanOrEqual(game360.innerWidth);
    expect(game360.scrollWidth).toBeLessThanOrEqual(game360.innerWidth);
  });
});
