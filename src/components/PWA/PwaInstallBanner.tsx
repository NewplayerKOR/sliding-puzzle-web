import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { getAssetUrl } from '../../utils/assetPath';
import './PwaInstallBanner.css';

export const PwaInstallBanner: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="pwa-banner-container" role="banner">
      <div className="pwa-banner-card">
        <div className="pwa-icon-box">
          <img src={getAssetUrl('assets/icons/badge_trophy.png')} alt="App Icon" className="pwa-app-icon" />
        </div>

        <div className="pwa-text-box">
          <span className="pwa-title">Sliding Block Puzzle</span>
          <span className="pwa-desc">{t.pwaInstallPrompt}</span>
        </div>
        <div className="pwa-actions">
          <button type="button" className="btn-pwa-install" onClick={handleInstallClick}>
            <Download size={14} />
            <span>{t.pwaInstallBtn}</span>
          </button>
          <button type="button" className="btn-pwa-close" onClick={handleDismiss} aria-label={t.close}>
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
