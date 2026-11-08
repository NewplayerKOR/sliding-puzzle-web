import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles } from 'lucide-react';
import { Achievement } from '../../types/achievement';
import { onAchievementUnlocked } from '../../utils/achievementManager';
import { audioManager } from '../../utils/audioManager';
import { useTranslation } from '../../i18n/useTranslation';
import './AchievementToast.css';

export const AchievementToast: React.FC = () => {
  const { t } = useTranslation();
  const [current, setCurrent] = useState<Achievement | null>(null);

  useEffect(() => {
    const unsubscribe = onAchievementUnlocked((achievement) => {
      audioManager.playSfx('victory');
      setCurrent(achievement);
      const timer = setTimeout(() => {
        setCurrent(null);
      }, 4500);
      return () => clearTimeout(timer);
    });

    return unsubscribe;
  }, []);

  if (!current) return null;

  return (
    <div className="achievement-toast-container" role="alert" aria-live="assertive">
      <div className="achievement-toast-card">
        <div className="toast-icon-wrapper">
          <Trophy size={24} className="toast-trophy-icon" />
          <Sparkles size={14} className="toast-sparkle-icon" />
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
