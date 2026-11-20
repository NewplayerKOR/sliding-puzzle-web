import { expect, test } from '@playwright/test';

const openThemeModal = async (page: import('@playwright/test').Page) => {
  await page.goto('/');
  await page.locator('.mode-card.standard .btn-play-mode.standard').click();
  await expect(page.getByRole('dialog', { name: '퍼즐 테마 선택' })).toBeVisible();
};

test.describe('모달 배경 스크롤 잠금', () => {
  test('360×640에서 모달을 연 채 휠·PageDown을 눌러도 배경이 스크롤되지 않는다', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 640 });
    await openThemeModal(page);

    const before = await page.evaluate(() => ({
      scrollY: window.scrollY,
      overflow: document.body.style.overflow,
    }));
    expect(before.overflow).toBe('hidden');

    await page.mouse.wheel(0, 900);
    await page.keyboard.press('PageDown');
    await page.waitForTimeout(200);

    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe('hidden');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: '퍼즐 테마 선택' })).toBeHidden();
    await expect.poll(() => page.evaluate(() => document.body.style.overflow)).toBe('');
  });

  test('1280×800에서 모달 내부 Tab 순환과 Escape 복귀가 유지된다', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await openThemeModal(page);

    for (let index = 0; index < 10; index += 1) {
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(() =>
          Boolean(document.activeElement?.closest('.theme-modal-content'))
        )
      ).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: '퍼즐 테마 선택' })).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe('');
  });
});
