import React, { useEffect, useRef } from 'react';
import { X, Flame, CheckCircle, Trophy } from 'lucide-react';
import { getDailyStreakData, getTodayDateString } from '../../utils/dailyChallenge';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMessage } from '../../i18n/format';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
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
  const contentRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(isOpen, contentRef);

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
      <div
        ref={contentRef}
        className="daily-modal-content"
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
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
              <span className="streak-value">
                {streakData.currentStreak}{t.streakDaysSuffix}
              </span>
            </div>
          </div>

          <div className="streak-card max">
            <div className="streak-icon-box trophy">
              <Trophy size={20} />
            </div>
            <div className="streak-info">
              <span className="streak-label">{t.maxStreak}</span>
              <span className="streak-value">
                {streakData.maxStreak}{t.streakDaysSuffix}
              </span>
            </div>
          </div>
        </div>

        {/* Monthly Calendar View */}
        <div className="daily-calendar-wrapper">
          <div className="calendar-header">
            <span>
              {formatMessage(t.dailyCalendarTitle, { year, month: month + 1 })}
            </span>
            <span className="calendar-count">
              {formatMessage(t.dailyCompletedCount, {
                completed: streakData.completedDates.filter((d) => d.startsWith(monthPrefix)).length,
                total: daysInMonth,
              })}
            </span>
          </div>

          <div className="calendar-grid">
            {days.map(({ dayNum, isCompleted, isToday }) => {
              const statusLabel = isCompleted
                ? t.dailyDayCompleted
                : isToday
                ? t.dailyDayToday
                : '';
              return (
                <div
                  key={dayNum}
                  className={`calendar-day ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`}
                  title={`${formatMessage(t.dailyDayLabel, { day: dayNum })} ${statusLabel}`.trim()}
                >
                  <span className="day-number">{dayNum}</span>
                  {isCompleted && <CheckCircle className="day-check" size={14} />}
                </div>
              );
            })}
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
                <span>{t.dailyTodayCompleted}</span>
              </>
            ) : (
              <>
                <Flame size={18} />
                <span>{t.dailyTodayStart}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
