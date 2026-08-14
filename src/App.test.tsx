import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';

// Mock canvas-confetti
vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

// Mock Audio
beforeEach(() => {
  localStorage.clear();
  resetGlobalLanguage();
  window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = vi.fn();
});

const startStandardGame = (sizeLabel = '4×4') => {
  fireEvent.click(screen.getByText(new RegExp(`게임 시작 \\(${sizeLabel}\\)`, 'i')));
  const startWithThemeBtn = screen.getByText('이 테마로 게임 시작');
  fireEvent.click(startWithThemeBtn);
};

describe('App Component Integration', () => {
  it('renders title screen with 4 game modes and utility badges', () => {
    render(<App />);

    expect(screen.getAllByText(/Sliding Puzzle/i).length).toBeGreaterThan(0);
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(screen.getByText('타임어택')).toBeDefined();
    expect(screen.getByText('이동 제한')).toBeDefined();
    expect(screen.getByText('일일 챌린지')).toBeDefined();
    expect(screen.getByText('업적 도감')).toBeDefined();
  });

  it('starts standard game via theme selection modal and renders game board', () => {
    render(<App />);

    const startBtn = screen.getByText(/게임 시작 \(4×4\)/i);
    fireEvent.click(startBtn);

    // Theme selection modal opens
    expect(screen.getByText(/퍼즐 테마 선택/i)).toBeDefined();
    expect(screen.getByText(/선택한 모드:/i)).toBeDefined();

    // Click start game with theme
    const startWithThemeBtn = screen.getByText('이 테마로 게임 시작');
    fireEvent.click(startWithThemeBtn);

    expect(screen.getByText('이동 수')).toBeDefined();
    expect(screen.getByText('시간')).toBeDefined();
    expect(screen.getByText('홈으로')).toBeDefined();
    expect(screen.getByText('되돌리기')).toBeDefined();
    expect(screen.getByText(/새 게임/i)).toBeDefined();
  });

  it('renders undo button in Controls and is initially disabled without moves', () => {
    render(<App />);
    startStandardGame('4×4');

    const undoBtn = screen.getByText('되돌리기');
    expect(undoBtn).toBeDefined();
    expect(undoBtn.closest('button')?.hasAttribute('disabled')).toBe(true);
  });

  it('navigates back to title screen when Home button is clicked', () => {
    render(<App />);

    // Go to game
    startStandardGame('4×4');
    expect(screen.getByText('홈으로')).toBeDefined();

    // Click Home
    fireEvent.click(screen.getByText('홈으로'));
    expect(screen.getByText('일반 모드')).toBeDefined();
    expect(screen.getByText('타임어택')).toBeDefined();
  });


  it('opens and closes the hint preview modal', () => {
    render(<App />);
    startStandardGame('4×4');

    const hintBtn = screen.getByText('미리보기');
    fireEvent.click(hintBtn);

    expect(screen.getByText(/완성본 미리보기/i)).toBeDefined();

    const closeBtn = screen.getByLabelText('닫기');
    fireEvent.click(closeBtn);

    expect(screen.queryByText(/완성본 미리보기/i)).toBeNull();
  });

  it('opens Daily Challenge modal and Daily calendar from Title Screen', () => {
    render(<App />);
    const streakBtn = screen.getByTitle(/연속 스트릭/i);
    fireEvent.click(streakBtn);

    expect(screen.getByText(/오늘의 퍼즐 챌린지/i)).toBeDefined();
    expect(screen.getAllByText(/현재 연속 스트릭/i).length).toBeGreaterThan(0);
  });

  it('opens Achievements Trophy Gallery modal from Title Screen', () => {
    render(<App />);

    const trophyBtn = screen.getByText('업적 도감');
    fireEvent.click(trophyBtn);

    expect(screen.getByText(/업적 & 트로피 도감/i)).toBeDefined();
    expect(screen.getByText('첫 승리의 기쁨')).toBeDefined();
    expect(screen.getByText('스피드 데몬')).toBeDefined();
  });

  it('switches language cleanly across the entire app via language select', () => {
    render(<App />);

    const langSelect = screen.getByLabelText('언어 선택');
    fireEvent.change(langSelect, { target: { value: 'en' } });

    // Title screen translations updated immediately
    expect(screen.getByText('Standard')).toBeDefined();
    expect(screen.getByText('Time Attack')).toBeDefined();
    expect(screen.getByText('Move Limit')).toBeDefined();
    expect(screen.getByText('Daily Puzzle')).toBeDefined();
    expect(screen.getByText('Trophies')).toBeDefined();

    // Enter game through theme modal
    fireEvent.click(screen.getByText(/Play Now \(4×4\)/i));
    fireEvent.click(screen.getByText('이 테마로 게임 시작'));

    expect(screen.getByText('Moves')).toBeDefined();
    expect(screen.getByText('Time')).toBeDefined();
    expect(screen.getByText('Home')).toBeDefined();
  });

  it('starts Time Attack mode with 45s countdown on 3x3', () => {
    render(<App />);

    // Select 3x3 on Time Attack card
    const timeAttack3x3Btn = screen.getByText('3×3 (45초)');
    fireEvent.click(timeAttack3x3Btn);

    const playTimeAttack = screen.getByText(/타임어택 \(45초 도전\)/i);
    fireEvent.click(playTimeAttack);

    // Confirm in theme modal
    fireEvent.click(screen.getByText('이 테마로 게임 시작'));

    expect(screen.getByText('남은 시간')).toBeDefined();
    expect(screen.getByText('00:45')).toBeDefined();
  });

  it('starts Move Limit mode with 35 moves on 3x3', () => {
    render(<App />);

    // Select 3x3 on Move Limit card
    const moveLimit3x3Btn = screen.getByText('3×3 (35회)');
    fireEvent.click(moveLimit3x3Btn);

    const playMoveLimit = screen.getByText(/이동 제한 \(35수 도전\)/i);
    fireEvent.click(playMoveLimit);

    // Confirm in theme modal
    fireEvent.click(screen.getByText('이 테마로 게임 시작'));

    expect(screen.getByText('남은 이동')).toBeDefined();
    expect(screen.getByText('35')).toBeDefined();
  });

  it('triggers win modal and timelapse player when solved state is achieved', () => {
    render(<App />);

    // Select 3x3 on Standard card
    const standard3x3Btn = screen.getByText('3×3');
    fireEvent.click(standard3x3Btn);

    startStandardGame('3×3');
    fireEvent.click(screen.getByText(/정답 보기/i));

    // Move tile 8 to empty slot (index 7 -> index 8)
    const tile8First = screen.getByRole('button', { name: /타일 8/i });
    fireEvent.click(tile8First);

    // Move tile 8 back (index 8 -> index 7)
    const tile8Second = screen.getByRole('button', { name: /타일 8/i });
    fireEvent.click(tile8Second);

    // Modal should appear
    expect(screen.getByText(/퍼즐 완성! 축하합니다!/i)).toBeDefined();
    expect(screen.getByText(/다시 플레이/i)).toBeDefined();
    expect(screen.getByText(/결과 카드 공유/i)).toBeDefined();
  });

  it('triggers win modal when Auto Clear button is clicked', () => {
    render(<App />);
    startStandardGame('4×4');

    // Click auto clear button
    const autoClearBtn = screen.getByText('자동 클리어');
    fireEvent.click(autoClearBtn);

    // Modal should appear immediately
    expect(screen.getByText(/퍼즐 완성! 축하합니다!/i)).toBeDefined();
    expect(screen.getByText(/다시 플레이/i)).toBeDefined();
  });
});
