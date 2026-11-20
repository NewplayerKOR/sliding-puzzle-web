import { expect, test, type CDPSession, type Page } from '@playwright/test';

const VIEWPORTS = [
  { width: 360, height: 640 },
  { width: 360, height: 800 },
  { width: 412, height: 839 },
];

const getScrollMetrics = (page: Page) =>
  page.evaluate(() => ({
    scrollY: window.scrollY,
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
    scrollHeight: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
  }));

const waitForScroll = async (page: Page) => {
  await page.waitForTimeout(180);
};

async function swipe(
  client: CDPSession,
  page: Page,
  from: { x: number; y: number },
  to: { x: number; y: number }
) {
  const steps = 8;
  await client.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: from.x, y: from.y, id: 1 }],
  });

  for (let step = 1; step <= steps; step += 1) {
    await client.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [
        {
          x: from.x + ((to.x - from.x) * step) / steps,
          y: from.y + ((to.y - from.y) * step) / steps,
          id: 1,
        },
      ],
    });
    await page.waitForTimeout(16);
  }

  await client.send('Input.dispatchTouchEvent', {
    type: 'touchEnd',
    touchPoints: [],
  });
  await waitForScroll(page);
}

async function swipeUpUntilBottom(client: CDPSession, page: Page) {
  const { innerHeight } = await getScrollMetrics(page);

  for (let attempt = 0; attempt < 8; attempt += 1) {
    await swipe(
      client,
      page,
      { x: 8, y: innerHeight * 0.82 },
      { x: 8, y: innerHeight * 0.18 }
    );

    const atBottom = await page.evaluate(
      () => window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2
    );
    if (atBottom) return true;
  }

  return false;
}

async function startStandard3x3(page: Page) {
  const card = page.locator('.mode-card.standard');
  await card.locator('.size-pill', { hasText: '3×3' }).click();
  await card.locator('.btn-play-mode.standard').click();
  await page.locator('.btn-theme-start-game').click();
  await expect(page.locator('.puzzle-board')).toBeVisible();
}

for (const viewport of VIEWPORTS) {
  test.describe(`모바일 문서 스크롤 ${viewport.width}×${viewport.height}`, () => {
    test.use({ viewport, hasTouch: true, isMobile: true });

    test('타이틀 화면이 touch swipe와 wheel로 스크롤된다', async ({ page }) => {
      await page.goto('/');
      await expect(page.locator('.title-screen-container')).toBeVisible();

      const before = await getScrollMetrics(page);
      expect(before.scrollHeight).toBeGreaterThan(before.innerHeight);
      expect(before.scrollWidth).toBeLessThanOrEqual(before.innerWidth);

      const client = await page.context().newCDPSession(page);

      // wheel 입력이 루트 문서로 전달되는지 먼저 확인함
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 8,
        y: viewport.height / 2,
        deltaX: 0,
        deltaY: 600,
      });
      await waitForScroll(page);
      await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

      // touch swipe로 마지막 콘텐츠까지 이동함
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(120);
      const reachedBottom = await swipeUpUntilBottom(client, page);
      expect(reachedBottom).toBe(true);

      const after = await getScrollMetrics(page);
      expect(after.scrollY).toBeGreaterThan(0);
      expect(after.scrollWidth).toBeLessThanOrEqual(after.innerWidth);
    });

    test('게임 화면이 touch swipe로 마지막 콘텐츠까지 스크롤된다', async ({ page }) => {
      await page.goto('/');
      await startStandard3x3(page);

      const before = await getScrollMetrics(page);
      expect(before.scrollWidth).toBeLessThanOrEqual(before.innerWidth);

      if (before.scrollHeight > before.innerHeight + 2) {
        const client = await page.context().newCDPSession(page);
        const reachedBottom = await swipeUpUntilBottom(client, page);
        expect(reachedBottom).toBe(true);

        const after = await getScrollMetrics(page);
        expect(after.scrollY).toBeGreaterThan(0);
        expect(after.scrollWidth).toBeLessThanOrEqual(after.innerWidth);
      } else {
        // 1화면에 맞는 뷰포트에서는 이미 마지막 콘텐츠에 도달한 상태임
        expect(before.scrollHeight).toBeLessThanOrEqual(before.innerHeight + 2);
      }
    });

    test('모달이 열린 동안 배경 스크롤이 잠기고 닫힌 뒤 복원된다', async ({ page }) => {
      await page.goto('/');
      await page.locator('.mode-card.standard .btn-play-mode.standard').click();

      const modal = page.getByRole('dialog', { name: '퍼즐 테마 선택' });
      await expect(modal).toBeVisible();

      const locked = await page.evaluate(() => ({
        overflow: document.body.style.overflow,
        scrollY: window.scrollY,
      }));
      expect(locked.overflow).toBe('hidden');

      const client = await page.context().newCDPSession(page);
      await swipe(
        client,
        page,
        { x: viewport.width / 2, y: viewport.height * 0.8 },
        { x: viewport.width / 2, y: viewport.height * 0.2 }
      );
      await client.send('Input.dispatchMouseEvent', {
        type: 'mouseWheel',
        x: 8,
        y: viewport.height / 2,
        deltaX: 0,
        deltaY: 600,
      });
      await waitForScroll(page);

      expect(await page.evaluate(() => window.scrollY)).toBe(locked.scrollY);

      await page.keyboard.press('Escape');
      await expect(modal).toBeHidden();
      expect(await page.evaluate(() => document.body.style.overflow)).toBe('');

      const afterClose = await getScrollMetrics(page);
      if (afterClose.scrollHeight > afterClose.innerHeight + 2) {
        await swipe(
          client,
          page,
          { x: 8, y: viewport.height * 0.82 },
          { x: 8, y: viewport.height * 0.18 }
        );
        await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
      }
    });

    test('보드 스와이프는 타일만 이동시키고 페이지를 스크롤하지 않는다', async ({ page }) => {
      await page.goto('/');
      await startStandard3x3(page);

      const boardState = await page.evaluate(() => {
        const occupied = Array.from(
          document.querySelectorAll<HTMLElement>('.tile-slider')
        ).map((tile) => {
          const row = Number(tile.style.getPropertyValue('--tile-row'));
          const col = Number(tile.style.getPropertyValue('--tile-col'));
          return row * 3 + col;
        });
        const emptyIndex = Array.from({ length: 9 }, (_, index) => index).find(
          (index) => !occupied.includes(index)
        );
        const slots = document.querySelectorAll<HTMLElement>('.grid-background-slot');
        const slot = slots[emptyIndex as number];
        const rect = slot.getBoundingClientRect();
        return {
          emptyIndex,
          center: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
          scrollY: window.scrollY,
          moveCount: Number(
            document.querySelectorAll('.stat-value')[0]?.textContent?.trim() ?? 0
          ),
        };
      });

      expect(boardState.emptyIndex).toBeGreaterThanOrEqual(0);

      const emptyRow = Math.floor((boardState.emptyIndex as number) / 3);
      const emptyCol = (boardState.emptyIndex as number) % 3;
      let direction = 'UP';
      if (emptyRow >= 2) direction = 'DOWN';
      else if (emptyRow === 0) direction = emptyCol < 2 ? 'LEFT' : 'RIGHT';

      const delta =
        direction === 'UP'
          ? { x: 0, y: -60 }
          : direction === 'DOWN'
          ? { x: 0, y: 60 }
          : direction === 'LEFT'
          ? { x: -60, y: 0 }
          : { x: 60, y: 0 };

      const client = await page.context().newCDPSession(page);
      await swipe(client, page, boardState.center, {
        x: boardState.center.x + delta.x,
        y: boardState.center.y + delta.y,
      });

      const after = await page.evaluate(() => ({
        scrollY: window.scrollY,
        moveCount: Number(
          document.querySelectorAll('.stat-value')[0]?.textContent?.trim() ?? 0
        ),
      }));

      expect(after.scrollY).toBe(boardState.scrollY);
      expect(after.moveCount).toBeGreaterThan(boardState.moveCount);
    });
  });
}
