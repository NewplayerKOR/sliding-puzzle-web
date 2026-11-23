import React, { useEffect, useRef } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useModalFocusTrap } from '../../hooks/useModalFocusTrap';
import './ConfirmModal.css';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

/** 진행 중인 게임을 폐기하는 등 되돌릴 수 없는 동작 전에 확인을 받는 모달. */
export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useModalFocusTrap(isOpen, contentRef);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="confirm-modal-overlay"
      onClick={onCancel}
    >
      <div
        ref={contentRef}
        className="confirm-modal-content"
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-description"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="confirm-modal-icon-box">
          <AlertTriangle size={22} aria-hidden="true" />
        </div>

        <div className="confirm-modal-text">
          <h3 id="confirm-modal-title" className="confirm-modal-title">
            {title}
          </h3>
          <p id="confirm-modal-description" className="confirm-modal-description">
            {description}
          </p>
        </div>

        <div className="confirm-modal-actions">
          <button
            type="button"
            className="confirm-btn cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="confirm-btn destructive"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
