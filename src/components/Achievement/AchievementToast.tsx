import React, { useState, useEffect } from 'react';
import { Trophy } from 'lucide-react';
import { Achievement } from '../../types/achievement';
import { onAchievementUnlocked } from '../../utils/achievementManager';
import { audioManager } from '../../utils/audioManager';
import { useTranslation } from '../../i18n/useTranslation';
import './AchievementToast.css';

const TOAST_DURATION_MS = 4500;

export const AchievementToast: React.FC = () => {
  const { t } = useTranslation();
  // 한 번의 승리로 여러 업적이 달성돼도 마지막 1건만 덮어쓰지 않도록 큐에 보관함
  const [queue, setQueue] = useState<Achievement[]>([]);
  const current = queue[0] ?? null;

  useEffect(() => {
    const unsubscribe = onAchievementUnlocked((achievement) => {
      setQueue((prev) => [...prev, achievement]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!current) return;

    // 표시 중인 업적에 맞춰 효과음을 재생하고, 표시 시간이 끝나면 다음 업적으로 넘어감
    audioManager.playSfx('victory');
    const timer = setTimeout(() => {
      setQueue((prev) => prev.slice(1));
    }, TOAST_DURATION_MS);

    return () => clearTimeout(timer);
  }, [current]);

  if (!current) return null;

  return (
    <div
      key={current.id}
      className="achievement-toast-container"
      role="alert"
      aria-live="assertive"
    >
      <div className="achievement-toast-card">
        <div className="toast-icon-wrapper">
          <Trophy size={22} className="toast-trophy-icon" />
        </div>
        <div className="toast-text-content">
          <span className="toast-tag">{t.achievementUnlocked}</span>
          <h4 className="toast-title">{t[current.titleKey]}</h4>
          <p className="toast-desc">{t[current.descriptionKey]}</p>
        </div>
      </div>
    </div>
  );
};
