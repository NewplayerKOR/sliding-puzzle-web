import React, { useEffect, useState } from 'react';
import { RefreshCw, X } from 'lucide-react';
import { useTranslation } from '../../i18n/useTranslation';
import { SW_APPLY_UPDATE_EVENT, SW_UPDATE_AVAILABLE_EVENT } from '../../utils/swUpdateManager';
import './ServiceWorkerUpdateBanner.css';

export const ServiceWorkerUpdateBanner: React.FC = () => {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdateAvailable = () => setIsVisible(true);
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdateAvailable);
    return () => window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdateAvailable);
  }, []);

  if (!isVisible) return null;

  const handleApply = () => {
    window.dispatchEvent(new Event(SW_APPLY_UPDATE_EVENT));
    setIsVisible(false);
  };

  return (
    <div className="sw-update-banner" role="status" aria-live="polite">
      <div className="sw-update-card">
        <span className="sw-update-desc">{t.pwaUpdateAvailable}</span>
        <div className="sw-update-actions">
          <button
            type="button"
            className="btn-sw-update"
            onClick={handleApply}
            aria-label={t.pwaUpdateNow}
          >
            <RefreshCw size={14} />
            <span>{t.pwaUpdateNow}</span>
          </button>
          <button
            type="button"
            className="btn-sw-dismiss"
            onClick={() => setIsVisible(false)}
            aria-label={t.pwaUpdateLater}
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
