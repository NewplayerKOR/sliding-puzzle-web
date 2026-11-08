const CACHE_NAME = 'sliding-puzzle-v2.1';
// 서브패스 배포에서도 동작하도록 SW 위치 기준으로 셸 URL을 계산함
const INDEX_URL = new URL('./index.html', self.location.href).href;
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './assets/audio/bgm_chill.wav',
  './assets/audio/bgm_zen_nature.wav',
  './assets/audio/bgm_cyber_synth.wav',
  './assets/audio/bgm_jazz_cafe.wav',
  './assets/audio/sfx_slide.mp3',
  './assets/audio/sfx_blocked.mp3',
  './assets/audio/sfx_shuffle.mp3',
  './assets/audio/sfx_victory.mp3',
  './assets/audio/sfx_click.mp3',
  './assets/images/theme_nature.png',
  './assets/images/theme_pixel_art.png',
  './assets/images/theme_abstract.png',
  './assets/images/theme_animal.png',
  './assets/sprites/sheet_ui_fx.css',
  './assets/sprites/sheet_ui_fx.png',
  './assets/sprites/ui_icons_spritesheet.png',
  './assets/sprites/fx_animations_spritesheet.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-192.png',
  './assets/icons/icon-maskable-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/badge_trophy.png',
  './assets/icons/icon_sound_on.png',
  './assets/icons/icon_sound_off.png',
  './assets/icons/icon_theme_selector.png',
  './assets/icons/icon_hint.png',
  './assets/icons/icon_number_toggle.png',
  './assets/icons/icon_play.png',
  './assets/icons/icon_reset.png',
  './assets/icons/stars_0.png',
  './assets/icons/stars_1.png',
  './assets/icons/stars_2.png',
  './assets/icons/stars_3.png',
  './assets/icons/ui_empty_slot_glow.png',
];

// addAll이 하나라도 실패하면 전체 프리캐시가 비므로 자산별로 재시도함
async function precacheAssets() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll(ASSETS_TO_CACHE);
  } catch (err) {
    console.warn('[SW] Precache addAll failed, caching assets individually:', err);
    await Promise.all(
      ASSETS_TO_CACHE.map(async (asset) => {
        try {
          await cache.add(asset);
        } catch (assetErr) {
          console.warn('[SW] Failed to cache asset:', asset, assetErr);
        }
      })
    );
  }
}

// Install: 셸과 자산을 프리캐시하되 새 버전은 사용자 확인 전까지 대기함
self.addEventListener('install', (event) => {
  event.waitUntil(precacheAssets());
});

// Activate: 이전 버전 캐시를 정리하고 열린 클라이언트에 즉시 적용함
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys.map((key) => {
            if (key !== CACHE_NAME) {
              console.log('[SW] Purging outdated cache:', key);
              return caches.delete(key);
            }
            return Promise.resolve();
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 업데이트 배너에서 사용자가 반영을 선택하면 대기 중인 워커를 활성화함
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

async function cacheNavigationResponse(request, response) {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
    await cache.put(INDEX_URL, response.clone());
  } catch (err) {
    console.warn('[SW] Failed to cache navigation response:', err);
  }
}

async function handleNavigation(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse && networkResponse.ok) {
      await cacheNavigationResponse(request, networkResponse);
      return networkResponse;
    }
    // 5xx·4xx 등 비정상 응답도 캐시된 셸로 폴백함
    const cached = (await caches.match(INDEX_URL)) || (await caches.match('./'));
    return cached || networkResponse;
  } catch (err) {
    const cached = (await caches.match(INDEX_URL)) || (await caches.match('./'));
    return cached || Response.error();
  }
}

// Fetch: Navigation은 Network First, 정적 자산은 Cache First
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const accept = event.request.headers.get('accept') || '';
  const isNavigation = event.request.mode === 'navigate' || accept.includes('text/html');

  if (isNavigation) {
    event.respondWith(handleNavigation(event.request));
    return;
  }

  // Cache First Strategy for Static Assets (Images, Sounds, JS/CSS bundles)
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (event.request.url.startsWith('http://') || event.request.url.startsWith('https://'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });
    })
  );
});
