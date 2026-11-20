import React, { useState, useEffect } from 'react';
import { Download, X, LayoutGrid } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import './PwaInstallBanner.css';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallBanner: React.FC = () => {
  const { t } = useTranslation();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isInstalling, setIsInstalling] = useState<boolean>(false);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event as BeforeInstallPromptEvent);
      setIsVisible(true);
    };

    const handleInstalled = () => {
      setIsVisible(false);
      setDeferredPrompt(null);
      setIsInstalling(false);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt || isInstalling) return;

    setIsInstalling(true);
    try {
      await deferredPrompt.prompt();
      // 수락·거부 모두 프롬프트는 1회만 사용할 수 있으므로 배너를 닫아 재사용 오류를 막음
      await deferredPrompt.userChoice;
      setIsVisible(false);
    } catch {
      // 브라우저가 설치 프롬프트를 거부하거나 이미 소비된 경우 조용히 닫음
      setIsVisible(false);
    } finally {
      setDeferredPrompt(null);
      setIsInstalling(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside className="pwa-banner-container" aria-label={t.pwaInstallPrompt}>
      <div className="pwa-banner-card">
        <div className="pwa-icon-box">
          <LayoutGrid size={24} aria-hidden="true" />
        </div>

        <div className="pwa-text-box">
          <span className="pwa-title">Sliding Block Puzzle</span>
          <span className="pwa-desc" title={t.pwaInstallPrompt}>{t.pwaInstallPrompt}</span>
        </div>
        <div className="pwa-actions">
          <button
            type="button"
            className="btn-pwa-install"
            onClick={handleInstallClick}
            disabled={isInstalling}
            aria-busy={isInstalling}
          >
            <Download size={14} aria-hidden="true" />
            <span>{t.pwaInstallBtn}</span>
          </button>
          <button type="button" className="btn-pwa-close" onClick={handleDismiss} aria-label={t.close}>
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  );
};
