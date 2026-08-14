import React, { useEffect } from 'react';
import { X, Flame, CheckCircle, Trophy } from 'lucide-react';
import { getDailyStreakData, getTodayDateString } from '../../utils/dailyChallenge';
import { useTranslation } from '../../i18n/useTranslation';
import './DailyModal.css';

interface DailyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartDaily: () => void;
}

export const DailyModal: React.FC<DailyModalProps> = ({
  isOpen,
  onClose,
  onStartDaily,
}) => {
  const { t } = useTranslation();
  const streakData = getDailyStreakData();
  const todayStr = getTodayDateString();
  const isTodayDone = streakData.completedDates.includes(todayStr);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Generate current month calendar dates (1 to last day of month)
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-indexed
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthPrefix = `${year}-${(month + 1).toString().padStart(2, '0')}`;

  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const dayNum = i + 1;
    const dateStr = `${monthPrefix}-${dayNum.toString().padStart(2, '0')}`;
    const isCompleted = streakData.completedDates.includes(dateStr);
    const isToday = dateStr === todayStr;
    return { dayNum, dateStr, isCompleted, isToday };
  });

  return (
    <div
      className="daily-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="daily-modal-title"
    >
      <div className="daily-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="daily-modal-header">
          <div className="daily-title-group">
            <Flame className="daily-flame-icon" size={24} />
            <h3 id="daily-modal-title" className="daily-modal-title">
              {t.dailyModalTitle}
            </h3>
          </div>
          <button
            type="button"
            className="daily-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        <p className="daily-modal-subtitle">{t.dailyModalSubtitle}</p>

        {/* Streak Stats Cards */}
        <div className="daily-streak-cards">
          <div className="streak-card current">
            <div className="streak-icon-box">
              <Flame size={20} />
            </div>
            <div className="streak-info">
              <span className="streak-label">{t.currentStreak}</span>
              <span className="streak-value">{streakData.currentStreak}일</span>
            </div>
          </div>

          <div className="streak-card max">
            <div className="streak-icon-box trophy">
              <Trophy size={20} />
            </div>
            <div className="streak-info">
              <span className="streak-label">{t.maxStreak}</span>
              <span className="streak-value">{streakData.maxStreak}일</span>
            </div>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="daily-calendar-wrapper">
          <div className="calendar-header">
            <span>
              {year}년 {month + 1}월 출석 현황
            </span>
            <span className="calendar-count">
              완료 {streakData.completedDates.filter((d) => d.startsWith(monthPrefix)).length}/{daysInMonth}일
            </span>
          </div>

          <div className="calendar-grid">
            {days.map(({ dayNum, isCompleted, isToday }) => (
              <div
                key={dayNum}
                className={`calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                title={`${dayNum}일 ${isCompleted ? '(클리어 완료)' : isToday ? '(오늘의 도전)' : ''}`}
              >
                <span className="day-number">{dayNum}</span>
                {isCompleted && <CheckCircle className="day-check" size={14} />}
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="daily-action-wrapper">
          <button
            type="button"
            className={`btn-daily-start ${isTodayDone ? 'completed-btn' : ''}`}
            onClick={() => {
              onStartDaily();
              onClose();
            }}
          >
            {isTodayDone ? (
              <>
                <CheckCircle size={18} />
                <span>오늘의 퍼즐 완료 (다시 플레이)</span>
              </>
            ) : (
              <>
                <Flame size={18} />
                <span>오늘의 퍼즐 도전하기</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
