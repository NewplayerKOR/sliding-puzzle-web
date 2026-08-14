import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Upload, ZoomIn, ZoomOut, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import './CustomImageModal.css';

interface CustomImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyCustomImage: (dataUrl: string) => void;
}

const CUSTOM_IMAGE_STORAGE_KEY = 'sliding_puzzle_custom_image';

export const CustomImageModal: React.FC<CustomImageModalProps> = ({
  isOpen,
  onClose,
  onApplyCustomImage,
}) => {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageObjRef = useRef<HTMLImageElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Load existing custom image if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(CUSTOM_IMAGE_STORAGE_KEY);
      if (saved && !imageSrc) {
        setImageSrc(saved);
      }
    }
  }, [imageSrc]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Load image onto Image element when imageSrc changes
  useEffect(() => {
    if (!imageSrc) return;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageSrc;
    img.onload = () => {
      imageObjRef.current = img;
      setOffset({ x: 0, y: 0 });
      setZoom(1);
      drawCanvas();
    };
  }, [imageSrc]);

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageObjRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = canvas.width; // 512px
    ctx.clearRect(0, 0, size, size);

    // Calculate aspect fill dimensions
    const imgAspect = img.width / img.height;
    let drawW = size;
    let drawH = size;

    if (imgAspect > 1) {
      drawW = size * imgAspect;
    } else {
      drawH = size / imgAspect;
    }

    drawW *= zoom;
    drawH *= zoom;

    const drawX = (size - drawW) / 2 + offset.x;
    const drawY = (size - drawH) / 2 + offset.y;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);
  }, [zoom, offset]);

  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('이미지 파일 크기는 10MB 이하만 가능합니다.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  // Drag pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - offset.x,
        y: e.touches[0].clientY - offset.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setOffset({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    try {
      localStorage.setItem(CUSTOM_IMAGE_STORAGE_KEY, dataUrl);
    } catch {
      // quota exceeded fallback
    }
    onApplyCustomImage(dataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="custom-img-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="crop-modal-title"
    >
      <div className="custom-img-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="custom-img-header">
          <h3 id="crop-modal-title" className="custom-img-title">
            {t.cropModalTitle}
          </h3>
          <button
            type="button"
            className="custom-img-close-btn"
            onClick={onClose}
            aria-label={t.close}
          >
            <X size={20} />
          </button>
        </div>

        <p className="custom-img-subtitle">{t.cropModalSubtitle}</p>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/png,image/jpeg,image/webp,image/gif"
          style={{ display: 'none' }}
        />

        {!imageSrc ? (
          <div
            className="upload-dropzone"
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
          >
            <Upload size={40} className="upload-icon" />
            <span className="upload-prompt-text">{t.cropDragPrompt}</span>
          </div>
        ) : (
          <div className="cropper-container">
            <div
              className="canvas-viewport"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <canvas ref={canvasRef} width={512} height={512} className="crop-canvas" />
              <div className="cropper-grid-overlay" />
            </div>

            {/* Zoom Controls */}
            <div className="zoom-controls-row">
              <ZoomOut size={16} />
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="zoom-slider"
                aria-label={t.cropZoom}
              />
              <ZoomIn size={16} />
              <span className="zoom-value">{Math.round(zoom * 100)}%</span>
            </div>

            {/* Actions */}
            <div className="cropper-actions-row">
              <button
                type="button"
                className="btn-reupload"
                onClick={() => fileInputRef.current?.click()}
              >
                <RefreshCw size={16} />
                <span>{t.cropUploadBtn}</span>
              </button>

              <button type="button" className="btn-apply-crop" onClick={handleApply}>
                <Check size={18} />
                <span>{t.cropApplyBtn}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
