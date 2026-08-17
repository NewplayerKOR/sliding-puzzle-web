const CACHE_NAME = 'sliding-puzzle-v2.0';
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

// Install: Pre-cache core shell & assets and activate immediately
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('[SW] Cache addAll warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Purge all stale caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purging outdated cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Network First for Navigation/HTML, Cache First for hashed static assets
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const isNavigation =
    event.request.mode === 'navigate' ||
    (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    // Network First Strategy for HTML / Navigation
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
              cache.put('./index.html', responseToCache.clone());
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // Offline fallback
          return caches.match('./index.html').then((cached) => cached || caches.match('./'));
        })
    );
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
