import { describe, it, expect, vi, afterEach } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Tile } from './Tile';
import { resetGlobalLanguage } from '../../i18n/useTranslation';

const baseTile = {
  id: 1,
  value: 1,
  currentPos: 0,
  targetPos: 0,
  isEmpty: false,
};

const renderTile = (overrides: Partial<Parameters<typeof Tile>[0]> = {}) => {
  const onClick = vi.fn();
  render(
    <Tile
      tile={baseTile}
      gridSize={3}
      isMovable={false}
      gameMode="number"
      themeImagePath=""
      showNumberOverlay={true}
      onClick={onClick}
      {...overrides}
    />
  );
  return { onClick };
};

describe('Tile accessibility contract (TASK-DEV-46)', () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    resetGlobalLanguage();
  });

  it('keeps a non-movable tile focusable with aria-disabled instead of disabled', () => {
    const { onClick } = renderTile({ isMovable: false });
    const button = screen.getByRole('button', { name: /타일 1/ });

    expect(button.hasAttribute('disabled')).toBe(false);
    expect(button.getAttribute('aria-disabled')).toBe('true');

    button.focus();
    expect(document.activeElement).toBe(button);

    // aria-disabled 타일 활성화는 막고 실제 이동 검사는 moveTile이 담당함
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('activates a movable tile on click', () => {
    const { onClick } = renderTile({ isMovable: true });
    fireEvent.click(screen.getByRole('button', { name: /이동 가능/ }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('exposes the AI hint in the button name and keeps the overlay decorative', () => {
    renderTile({ isMovable: true, isAiHintTarget: true, aiHintDirection: 'up' });

    const button = screen.getByRole('button', { name: /AI 추천 이동/ });
    expect(button).toBeDefined();
    // 버튼 내부에 중첩 live-region을 두지 않음
    expect(button.querySelector('[role="status"]')).toBeNull();
    const overlay = button.querySelector('.tile-ai-hint-overlay');
    expect(overlay?.getAttribute('aria-hidden')).toBe('true');
  });

  it('renders the empty slot as role=none without accessibility-tree noise', () => {
    renderTile({ tile: { ...baseTile, isEmpty: true } });
    const empty = document.querySelector('.tile-empty');
    expect(empty?.getAttribute('role')).toBe('none');
    expect(empty?.getAttribute('aria-hidden')).toBe('true');
  });
});
