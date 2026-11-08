export const SW_UPDATE_AVAILABLE_EVENT = 'sliding-puzzle:sw-update-available';
export const SW_APPLY_UPDATE_EVENT = 'sliding-puzzle:sw-apply-update';

/**
 * Service Worker를 등록하고 새 버전이 준비되면 업데이트 이벤트를 알린다.
 * 새 워커는 자동으로 활성화하지 않고, 사용자가 적용을 선택했을 때만 새로고침한다.
 */
export function registerServiceWorker(
  url: string,
  reloadPage: () => void = () => window.location.reload()
): void {
  if (typeof window === 'undefined' || typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  let waitingWorker: ServiceWorker | null = null;
  let updateAccepted = false;
  let reloading = false;

  const notifyUpdateAvailable = (worker: ServiceWorker) => {
    waitingWorker = worker;
    window.dispatchEvent(new CustomEvent(SW_UPDATE_AVAILABLE_EVENT));
  };

  const applyUpdate = () => {
    if (!waitingWorker) return;
    updateAccepted = true;
    waitingWorker.postMessage({ type: 'SKIP_WAITING' });
  };

  window.addEventListener(SW_APPLY_UPDATE_EVENT, applyUpdate);

  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // 사용자가 업데이트를 수락한 경우에만 새로고침해 진행 중 게임 중단을 막음
    if (!updateAccepted || reloading) return;
    reloading = true;
    reloadPage();
  });

  const register = () => {
    navigator.serviceWorker
      .register(url, { updateViaCache: 'none' })
      .then((registration) => {
        // 이전 세션에서 대기 중인 워커가 있으면 즉시 안내함
        if (registration.waiting && navigator.serviceWorker.controller) {
          notifyUpdateAvailable(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              notifyUpdateAvailable(newWorker);
            }
          });
        });
      })
      .catch((err) => {
        console.warn('[SW] Registration failed:', err);
      });
  };

  if (document.readyState === 'complete') {
    register();
  } else {
    window.addEventListener('load', register, { once: true });
  }
}
