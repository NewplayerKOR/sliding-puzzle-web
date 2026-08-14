import React, { useEffect } from 'react';
import { X, Trophy, Lock, CheckCircle2, Zap, Compass, Crown, Star, ShieldCheck, Flame, Palette, Camera, Clock, Footprints, Medal } from 'lucide-react';
import { getStoredAchievements } from '../../utils/achievementManager';
import { useTranslation } from '../../i18n/useTranslation';
import { getAssetUrl } from '../../utils/assetPath';
import './AchievementModal.css';

interface AchievementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const iconMap: Record<string, React.FC<{ size?: number; className?: string }>> = {
  Trophy,
  Zap,
  Compass,
  Crown,
  Star,
  ShieldCheck,
  Flame,
  Palette,
  Camera,
  Clock,
  Footprints,
  Medal,
};

export const AchievementModal: React.FC<AchievementModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const achievements = getStoredAchievements();
  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="achieve-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="achieve-modal-title"
    >
      <div className="achieve-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="achieve-modal-header">
          <div className="achieve-title-group">
            <img
              src={getAssetUrl('assets/icons/badge_trophy.png')}
              alt="업적"
              className="achieve-header-img"
            />
            <div>
              <h3 id="achieve-modal-title" className="achieve-modal-title">
                {t.achievementsTitle}
              </h3>
              <span className="achieve-progress-badge">
                달성률: {unlockedCount} / {achievements.length} ({Math.round((unlockedCount / achievements.length) * 100)}%)
              </span>
            </div>
          </div>

          <button
            type="button"
            className="achieve-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        <p className="achieve-modal-subtitle">{t.achievementsSubtitle}</p>

        {/* 12 Achievements Grid */}
        <div className="achieve-grid">
          {achievements.map((item) => {
            const isUnlocked = Boolean(item.unlockedAt);
            const IconComponent = iconMap[item.iconName] || Trophy;

            return (
              <div
                key={item.id}
                className={`achieve-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              >
                <div className="achieve-card-icon-box">
                  {isUnlocked ? (
                    <IconComponent size={22} className="achieve-icon" />
                  ) : (
                    <Lock size={20} className="achieve-lock-icon" />
                  )}
                </div>

                <div className="achieve-card-info">
                  <div className="achieve-card-title-row">
                    <h4 className="achieve-item-title">{item.title}</h4>
                    {isUnlocked && (
                      <span className="achieve-unlocked-tag">
                        <CheckCircle2 size={13} />
                        완료
                      </span>
                    )}
                  </div>
                  <p className="achieve-item-desc">{item.description}</p>

                  {/* Optional Progress bar */}
                  {!isUnlocked && item.maxProgress && (
                    <div className="achieve-progress-bar-wrapper">
                      <div
                        className="achieve-progress-bar-fill"
                        style={{
                          width: `${Math.min(100, Math.round(((item.progress || 0) / item.maxProgress) * 100))}%`,
                        }}
                      />
                      <span className="achieve-progress-text">
                        {item.progress || 0} / {item.maxProgress}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
