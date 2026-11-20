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

  // 등록 시작 시점의 제어 상태를 보관함. 첫 설치 중에는 WebKit 등에서
  // controller가 설치 완료 전에 먼저 활성화될 수 있으므로, 이후 시점의 controller로
  // 업데이트 여부를 판단하면 첫 설치를 업데이트로 오인함.
  const hadControllerAtStart = Boolean(navigator.serviceWorker.controller);

  const getExistingRegistration = async (): Promise<ServiceWorkerRegistration | null> => {
    if (typeof navigator.serviceWorker.getRegistration !== 'function') return null;

    try {
      return (await navigator.serviceWorker.getRegistration()) ?? null;
    } catch {
      return null;
    }
  };

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

  const register = async () => {
    // 등록 전에 기존 워커가 있었는지 확인해 첫 설치와 업데이트를 구분함.
    // controller가 없는 하드 리로드에서도 기존 active 워커가 있으면 업데이트로 취급함.
    const existingRegistration = await getExistingRegistration();
    const hadExistingWorker = Boolean(
      existingRegistration?.active || existingRegistration?.waiting
    );
    const isFirstInstall = !hadControllerAtStart && !hadExistingWorker;

    navigator.serviceWorker
      .register(url, { updateViaCache: 'none' })
      .then((registration) => {
        // 이전 세션에서 대기 중인 워커가 있으면 즉시 안내함
        if (registration.waiting && !isFirstInstall) {
          notifyUpdateAvailable(registration.waiting);
        }

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            // 첫 설치에서는 controller가 먼저 활성화돼도 업데이트 배너를 표시하지 않음
            if (newWorker.state === 'installed' && !isFirstInstall) {
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
