import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ThemeInfo } from '../../types/theme';
import { getAssetUrl } from '../../utils/assetPath';
import { useTranslation } from '../../i18n/useTranslation';
import { formatMessage } from '../../i18n/format';
import './HintModal.css';

interface HintModalProps {
  isOpen: boolean;
  theme: ThemeInfo;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, theme, onClose }) => {
  const { t } = useTranslation();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="hint-modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="hint-title">
      <div className="hint-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="hint-modal-header">
          <div className="hint-title-group">
            <img src={getAssetUrl('assets/icons/icon_hint.png')} alt={t.previewHint} className="modal-header-icon-img" />

            <h3 id="hint-title" className="hint-title">
              {formatMessage(t.hintTitleWithTheme, { theme: theme.name })}
            </h3>
          </div>
          <button type="button" className="hint-close-btn" onClick={onClose} aria-label={t.close}>
            <X size={20} />
          </button>
        </div>

        <div className="hint-image-container">
          <img src={theme.imagePath} alt={theme.name} className="hint-preview-image" />
        </div>

        <p className="hint-footer-desc">{t.hintModalDesc}</p>
      </div>
    </div>
  );
};
