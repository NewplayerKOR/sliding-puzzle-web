import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { ThemeInfo } from '../../types/theme';
import { getAssetUrl } from '../../utils/assetPath';
import './HintModal.css';

interface HintModalProps {
  isOpen: boolean;
  theme: ThemeInfo;
  onClose: () => void;
}

export const HintModal: React.FC<HintModalProps> = ({ isOpen, theme, onClose }) => {
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
            <img src={getAssetUrl('assets/icons/icon_hint.png')} alt="힌트" className="modal-header-icon-img" />

            <h3 id="hint-title" className="hint-title">
              완성본 미리보기: {theme.name}
            </h3>
          </div>
          <button type="button" className="hint-close-btn" onClick={onClose} aria-label="닫기">
            <X size={20} />
          </button>
        </div>

        <div className="hint-image-container">
          <img src={theme.imagePath} alt={theme.name} className="hint-preview-image" />
        </div>

        <p className="hint-footer-desc">
          💡 이 이미지를 완성할 수 있도록 타일을 순서대로 맞춰보세요.
        </p>
      </div>
    </div>
  );
};
