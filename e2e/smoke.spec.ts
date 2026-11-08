import { expect, test, type Page } from '@playwright/test';

const GRID_SIZE = 3;

async function startStandardGame(
  page: Page,
  options: { numberMode?: boolean } = {}
) {
  await page.goto('/');
  const card = page.locator('.mode-card.standard');
  await card.locator('.size-pill', { hasText: '3×3' }).click();
  await card.locator('.btn-play-mode.standard').click();

  await expect(page.locator('.theme-modal-content')).toBeVisible();
  if (options.numberMode !== false) {
    await page.locator('.mode-toggle-btn').nth(1).click();
  }
  await page.locator('.btn-theme-start-game').click();
  await expect(page.locator('.puzzle-board')).toBeVisible();
}

async function readBoard(page: Page, size = GRID_SIZE): Promise<number[]> {
  return page.evaluate((gridSize) => {
    const board = new Array<number>(gridSize * gridSize).fill(0);
    for (const tile of document.querySelectorAll<HTMLElement>('.tile-slider')) {
      const row = Number(tile.style.getPropertyValue('--tile-row'));
      const col = Number(tile.style.getPropertyValue('--tile-col'));
      const label = tile.querySelector('button')?.getAttribute('aria-label') ?? '';
      const value = Number(label.match(/\d+/)?.[0] ?? 0);
      board[row * gridSize + col] = value;
    }
    return board;
  }, size);
}

async function clickTile(page: Page, position: number, size = GRID_SIZE) {
  await page.evaluate(
    ({ target, gridSize }) => {
      for (const tile of document.querySelectorAll<HTMLElement>('.tile-slider')) {
        const row = Number(tile.style.getPropertyValue('--tile-row'));
        const col = Number(tile.style.getPropertyValue('--tile-col'));
        if (row * gridSize + col === target) {
          tile.querySelector<HTMLButtonElement>('button')?.click();
          return;
        }
      }
      throw new Error(`tile not found at position ${target}`);
    },
    { target: position, gridSize: size }
  );
  // PuzzleBoard의 입력 스로틀(80ms)보다 여유 있게 대기한다.
  await page.waitForTimeout(110);
}

function solveBoard(start: number[], size = GRID_SIZE): number[] {
  const goal = [...Array(size * size - 1).keys()].map((index) => index + 1);
  goal.push(0);
  const goalKey = goal.join(',');
  const startKey = start.join(',');
  const queue: string[] = [startKey];
  const previous = new Map<string, string | null>([[startKey, null]]);
  const movedPosition = new Map<string, number>();
  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  while (queue.length > 0) {
    const currentKey = queue.shift() as string;
    if (currentKey === goalKey) break;

    const current = currentKey.split(',').map(Number);
    const empty = current.indexOf(0);
    const row = Math.floor(empty / size);
    const col = empty % size;

    for (const [rowDelta, colDelta] of directions) {
      const nextRow = row + rowDelta;
      const nextCol = col + colDelta;
      if (nextRow < 0 || nextRow >= size || nextCol < 0 || nextCol >= size) continue;

      const tilePosition = nextRow * size + nextCol;
      const next = [...current];
      [next[empty], next[tilePosition]] = [next[tilePosition], next[empty]];
      const nextKey = next.join(',');

      if (previous.has(nextKey)) continue;
      previous.set(nextKey, currentKey);
      movedPosition.set(nextKey, tilePosition);
      queue.push(nextKey);
    }
  }

  if (!previous.has(goalKey)) {
    throw new Error('board is not solvable');
  }

  const path: number[] = [];
  let currentKey: string | null = goalKey;
  while (currentKey !== null) {
    const parent = previous.get(currentKey) ?? null;
    if (parent === null) break;
    path.push(movedPosition.get(currentKey) as number);
    currentKey = parent;
  }
  return path.reverse();
}

test.describe('핵심 플레이 스모크', () => {
  test('타이틀→테마→이동/Undo→AI 힌트→3×3 승리를 완료한다', async ({ page }) => {
    test.setTimeout(60_000);
    const pageErrors: string[] = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    await startStandardGame(page);
    const initialBoard = await readBoard(page);
    expect(await page.locator('.stat-card .stat-value').first().innerText()).toBe('0');

    const solution = solveBoard(initialBoard);
    expect(solution.length).toBeGreaterThan(0);

    await clickTile(page, solution[0]);
    await expect(page.locator('.stat-card .stat-value').first()).toHaveText('1');

    await page.locator('.toolbar-row .toolbar-btn').first().click();
    await expect(page.locator('.stat-card .stat-value').first()).toHaveText('2');
    expect(await readBoard(page)).toEqual(initialBoard);

    await page.locator('.btn-ai-hint').click();
    await expect(page.locator('.tile-ai-hint-overlay').first()).toBeVisible({ timeout: 10_000 });

    const boardBeforeSolve = await readBoard(page);
    for (const position of solveBoard(boardBeforeSolve)) {
      await clickTile(page, position);
    }

    await expect(page.locator('.modal-content')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.win-stars-row')).toBeVisible();

    const stored = await page.evaluate(() => ({
      records: JSON.parse(localStorage.getItem('sliding_puzzle_best_records') ?? '{}'),
      achievements: JSON.parse(localStorage.getItem('sliding_puzzle_achievements') ?? '[]'),
    }));
    expect(stored.records['3']).toBeTruthy();
    expect(
      stored.achievements.some(
        (achievement: { id: string; unlockedAt: string | null }) =>
          achievement.id === 'first_victory' && achievement.unlockedAt
      )
    ).toBe(true);
    expect(pageErrors).toEqual([]);
  });
});

test.describe('모달 포커스 트랩', () => {
  test('테마 모달 안에서 Tab이 순환하고 Escape 후 시작 버튼으로 복귀한다', async ({ page }) => {
    await page.goto('/');
    const playButton = page.locator('.mode-card.standard .btn-play-mode.standard');
    await playButton.click();

    const modal = page.locator('.theme-modal-content');
    await expect(modal).toBeVisible();
    await expect
      .poll(() =>
        page.evaluate(() => Boolean(document.activeElement?.closest('.theme-modal-content')))
      )
      .toBe(true);

    for (let index = 0; index < 15; index += 1) {
      await page.keyboard.press('Tab');
      expect(
        await page.evaluate(() => Boolean(document.activeElement?.closest('.theme-modal-content')))
      ).toBe(true);
    }

    await page.keyboard.press('Escape');
    await expect(modal).toBeHidden();
    await expect
      .poll(() => page.evaluate(() => document.activeElement?.className ?? ''))
      .toContain('btn-play-mode');
  });
});

test.describe('다국어 전환', () => {
  test('EN 전환 시 html lang과 주요 UI가 영어로 유지된다', async ({ page }) => {
    await page.goto('/');
    await page.locator('.title-lang-select').selectOption('en');

    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.btn-play-mode.standard')).toContainText('Play Now');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('.title-lang-select')).toHaveValue('en');
    await expect(page.locator('.btn-play-mode.standard')).toContainText('Play Now');
  });
});

test.describe('360px 모바일 레이아웃', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('가로 오버플로 없이 타이틀과 게임 보드가 표시된다', async ({ page }) => {
    await page.goto('/');
    const titleMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(titleMetrics.scrollWidth).toBeLessThanOrEqual(titleMetrics.innerWidth);

    await startStandardGame(page, { numberMode: false });
    const gameMetrics = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
    }));
    expect(gameMetrics.scrollWidth).toBeLessThanOrEqual(gameMetrics.innerWidth);

    const board = await page.locator('.puzzle-board').boundingBox();
    expect(board).not.toBeNull();
    expect(board?.width ?? 0).toBeLessThanOrEqual(360);
    expect((board?.y ?? 0) + (board?.height ?? 0)).toBeLessThanOrEqual(801);
  });
});
