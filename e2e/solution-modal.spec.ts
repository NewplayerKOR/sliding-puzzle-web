import { expect, test, type Page } from '@playwright/test';

async function startStandard3x3(page: Page) {
  await page.goto('/');
  const card = page.locator('.mode-card.standard');
  await card.locator('.size-pill', { hasText: '3×3' }).click();
  await card.locator('.btn-play-mode.standard').click();
  await page.locator('.btn-theme-start-game').click();
  await expect(page.locator('.puzzle-board')).toBeVisible();
}

async function readBoard(page: Page): Promise<number[]> {
  return page.evaluate(() => {
    const board = new Array<number>(9).fill(0);
    for (const tile of document.querySelectorAll<HTMLElement>('.tile-slider')) {
      const row = Number(tile.style.getPropertyValue('--tile-row'));
      const col = Number(tile.style.getPropertyValue('--tile-col'));
      const label = tile.querySelector('button')?.getAttribute('aria-label') ?? '';
      board[row * 3 + col] = Number(label.match(/\d+/)?.[0] ?? 0);
    }
    return board;
  });
}

async function openSolution(page: Page) {
  await page.getByRole('button', { name: '정답 보기' }).click();
  const dialog = page.getByRole('dialog', { name: '정답 보기' });
  await expect(dialog).toBeVisible();
  return dialog;
}

test.describe('정답 보기 미리보기', () => {
  test('보드를 바꾸지 않고 포커스 트랩과 Escape 복귀를 제공한다', async ({ page }) => {
    await startStandard3x3(page);
    const before = await readBoard(page);

    const dialog = await openSolution(page);
    await expect(dialog.locator('.solution-preview-tile')).toHaveCount(8);
    expect(await readBoard(page)).toEqual(before);

    for (let index = 0; index < 8; index += 1) {
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(() =>
          Boolean(document.activeElement?.closest('.solution-modal-content'))
        )
      ).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(page.locator('.puzzle-board')).toBeVisible();
  });

  test.describe('360×640 모바일', () => {
    test.use({ viewport: { width: 360, height: 640 } });

    test('모달과 정답 보드가 가로로 넘치지 않고 닫기 버튼이 44px 이상이다', async ({ page }) => {
      await startStandard3x3(page);
      await openSolution(page);

      const metrics = await page.evaluate(() => {
        const content = document.querySelector('.solution-modal-content') as HTMLElement;
        const board = document.querySelector('.solution-preview-board') as HTMLElement;
        const close = document.querySelector('.solution-close-btn') as HTMLElement;
        const contentRect = content.getBoundingClientRect();
        const boardRect = board.getBoundingClientRect();
        const closeRect = close.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          contentLeft: contentRect.left,
          contentRight: contentRect.right,
          boardWidth: boardRect.width,
          closeWidth: closeRect.width,
          closeHeight: closeRect.height,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.contentLeft).toBeGreaterThanOrEqual(0);
      expect(metrics.contentRight).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.boardWidth).toBeLessThanOrEqual(metrics.innerWidth - 32);
      expect(metrics.closeWidth).toBeGreaterThanOrEqual(44);
      expect(metrics.closeHeight).toBeGreaterThanOrEqual(44);
    });
  });

  test.describe('1280×800 데스크톱', () => {
    test.use({ viewport: { width: 1280, height: 800 } });

    test('모달이 화면 안에 배치되고 문서 오버플로가 없다', async ({ page }) => {
      await startStandard3x3(page);
      await openSolution(page);

      const metrics = await page.evaluate(() => {
        const content = document.querySelector('.solution-modal-content') as HTMLElement;
        const rect = content.getBoundingClientRect();
        return {
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
          top: rect.top,
          bottom: rect.bottom,
          innerHeight: window.innerHeight,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.innerWidth);
      expect(metrics.top).toBeGreaterThanOrEqual(0);
      expect(metrics.bottom).toBeLessThanOrEqual(metrics.innerHeight);
    });
  });
});
