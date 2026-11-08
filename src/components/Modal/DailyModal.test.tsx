import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { DailyModal } from './DailyModal';
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
});
