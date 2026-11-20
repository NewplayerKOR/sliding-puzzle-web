import { expect, test, type Page } from '@playwright/test';

async function startStandard3x3(page: Page) {
  await page.goto('/');
  const card = page.locator('.mode-card.standard');
  await card.locator('.size-pill', { hasText: '3×3' }).click();
  await card.locator('.btn-play-mode.standard').click();
  await page.locator('.btn-theme-start-game').click();
  await expect(page.locator('.puzzle-board')).toBeVisible();
}

test.describe('접근성·파괴적 액션 UX', () => {
  test('모드 카드는 장식 컨테이너로 남고 선택은 내부 버튼으로만 바뀐다', async ({ page }) => {
    await page.goto('/');
    const standardCard = page.locator('.mode-card.standard');
    const timeAttackCard = page.locator('.mode-card.timeattack');

    await expect(standardCard).toHaveClass(/selected/);
    await timeAttackCard.click({ position: { x: 12, y: 12 } });
    await expect(standardCard).toHaveClass(/selected/);
    await expect(timeAttackCard).not.toHaveClass(/selected/);

    const computed = await page.evaluate(() => ({
      userSelect: getComputedStyle(document.body).userSelect,
      cardCursor: getComputedStyle(document.querySelector('.mode-card') as HTMLElement).cursor,
    }));
    expect(computed.userSelect).toBe('text');
    expect(computed.cardCursor).not.toBe('pointer');
  });

  test('오디오 토글은 동작과 상태를 접근성 이름·aria-pressed로 노출한다', async ({ page }) => {
    await page.goto('/');

    const bgmToggle = page.getByRole('button', { name: /^BGM (사운드 켜기|음소거)$/ });
    await expect(bgmToggle).toHaveAttribute('aria-pressed', 'true');

    await bgmToggle.click();
    await expect(bgmToggle).toHaveAttribute('aria-pressed', 'false');
    await expect(bgmToggle).toHaveAccessibleName(/사운드 켜기/);
  });

  test('진행 중 홈 복귀는 확인 후에만 게임을 폐기한다', async ({ page }) => {
    await startStandard3x3(page);

    await page.locator('.tile-filled.movable').first().click();
    await page.getByRole('button', { name: '홈으로' }).click();

    const confirm = page.getByRole('dialog', { name: '홈으로 돌아갈까요?' });
    await expect(confirm).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => document.body.style.overflow))
      .toBe('hidden');

    await page.getByRole('button', { name: '계속하기' }).click();
    await expect(confirm).toBeHidden();
    await expect(page.locator('.puzzle-board')).toBeVisible();

    await page.getByRole('button', { name: '홈으로' }).click();
    await page.getByRole('button', { name: '홈으로 돌아가기' }).click();
    await expect(confirm).toBeHidden();
    await expect(page.locator('.title-screen-container')).toBeVisible();
  });

  test('일일 캘린더와 업적 진행 바가 스크린리더용 상태를 제공한다', async ({ page }) => {
    await page.goto('/');

    await page.getByRole('button', { name: /스트릭/ }).click();
    await expect(page.getByRole('list', { name: /출석 현황/ })).toBeVisible();
    await expect(page.getByRole('listitem').first()).toHaveAttribute('aria-label', /1일/);
    await page.keyboard.press('Escape');

    await page.getByRole('button', { name: '업적 도감' }).click();
    const progressbars = page.getByRole('progressbar');
    await expect(progressbars.first()).toBeVisible();
    await expect(progressbars.first()).toHaveAttribute('aria-valuemax', /\d+/);
  });

  test('Daily 캘린더 목록이 360×640·1280×800에서 가로 오버플로 없이 표시된다', async ({
    page,
  }) => {
    for (const viewport of [
      { width: 360, height: 640 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/');
      await page.getByRole('button', { name: /스트릭/ }).click();

      const list = page.getByRole('list', { name: /출석 현황/ });
      await expect(list).toBeVisible();
      await expect(page.getByRole('listitem').first()).toHaveAttribute(
        'aria-label',
        /1일/
      );
      await expect(page.locator('[aria-current="date"]')).toHaveAttribute(
        'aria-label',
        /오늘의 도전/
      );

      const metrics = await page.evaluate(() => {
        const calendar = document.querySelector('.calendar-grid') as HTMLElement;
        const firstDay = calendar.querySelector('.calendar-day') as HTMLElement;
        const calendarRect = calendar.getBoundingClientRect();
        const firstRect = firstDay.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          listLeft: calendarRect.left,
          listRight: calendarRect.right,
          firstDayWidth: firstRect.width,
          firstDayHeight: firstRect.height,
          itemCount: calendar.children.length,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.listLeft).toBeGreaterThanOrEqual(0);
      expect(metrics.listRight).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.firstDayWidth).toBeGreaterThan(0);
      expect(metrics.firstDayHeight).toBeGreaterThan(0);
      expect(metrics.itemCount).toBeGreaterThanOrEqual(28);

      await page.keyboard.press('Escape');
    }
  });

  test.describe('360×640 모바일', () => {
    test.use({ viewport: { width: 360, height: 640 } });

    test('홈 복귀 확인 모달이 화면 안에 들어오고 가로 오버플로가 없다', async ({ page }) => {
      await startStandard3x3(page);
      await page.locator('.tile-filled.movable').first().click();
      await page.getByRole('button', { name: '홈으로' }).click();

      const metrics = await page.evaluate(() => {
        const content = document.querySelector('.confirm-modal-content') as HTMLElement;
        const rect = content.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          bottom: rect.bottom,
          innerHeight: window.innerHeight,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.left).toBeGreaterThanOrEqual(0);
      expect(metrics.right).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.top).toBeGreaterThanOrEqual(0);
      expect(metrics.bottom).toBeLessThanOrEqual(metrics.innerHeight);

      for (let index = 0; index < 4; index += 1) {
        await page.keyboard.press('Tab');
        expect(
          await page.evaluate(() =>
            Boolean(document.activeElement?.closest('.confirm-modal-content'))
          )
        ).toBe(true);
      }
    });
  });
});
