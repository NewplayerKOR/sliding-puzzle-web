import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DailyModal } from './DailyModal';
import { saveDailyCompletion } from '../../utils/dailyChallenge';
import { resetGlobalLanguage, setGlobalLanguage } from '../../i18n/useTranslation';

const renderModal = () =>
  render(<DailyModal isOpen={true} onClose={() => {}} onStartDaily={() => {}} />);

describe('DailyModal i18n', () => {
  beforeEach(() => {
    localStorage.clear();
    resetGlobalLanguage();
  });

  afterEach(() => {
    cleanup();
    resetGlobalLanguage();
  });

  it('renders Korean calendar strings by default', () => {
    renderModal();
    const now = new Date();

    expect(
      screen.getByText(new RegExp(`${now.getFullYear()}년 ${now.getMonth() + 1}월`))
    ).toBeDefined();
    expect(screen.getByText(/완료 \d+\/\d+일/)).toBeDefined();
    expect(screen.getByTitle(/^1일( \(오늘의 도전\))?$/)).toBeDefined();
    expect(screen.getByText('오늘의 퍼즐 도전하기')).toBeDefined();
  });

  it('renders English calendar strings after switching language', () => {
    setGlobalLanguage('en');
    renderModal();
    const now = new Date();

    expect(
      screen.getByText(
        new RegExp(`Attendance in ${now.getMonth() + 1}/${now.getFullYear()}`)
      )
    ).toBeDefined();
    expect(screen.getByText(/\d+\/\d+ days completed/)).toBeDefined();
    expect(screen.getByTitle(/^Day 1( \(Today's challenge\))?$/)).toBeDefined();
    expect(screen.getByText("Play today's puzzle")).toBeDefined();
  });

  it('exposes each calendar day status and today as a labeled listitem', () => {
    renderModal();
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();

    const list = screen.getByRole('list', {
      name: new RegExp(`${now.getFullYear()}년 ${now.getMonth() + 1}월 출석 현황`),
    });
    expect(list).toBeDefined();
    expect(screen.getAllByRole('listitem')).toHaveLength(daysInMonth);

    const today = screen.getByRole('listitem', {
      name: new RegExp(`${now.getDate()}일.*오늘의 도전`),
    });
    expect(today.getAttribute('aria-current')).toBe('date');
  });

  it('keeps the completed day label in the list structure', () => {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${(now.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    saveDailyCompletion(todayStr);

    renderModal();

    const completedDay = screen.getByRole('listitem', {
      name: new RegExp(`${now.getDate()}일.*클리어 완료`),
    });
    expect(completedDay.className).toContain('completed');
    expect(completedDay.getAttribute('aria-current')).toBe('date');
  });
});
