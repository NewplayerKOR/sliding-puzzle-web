import { describe, expect, it, vi } from 'vitest';
import swSource from '../../public/sw.js?raw';

const SW_URL = 'https://example.com/sub/sw.js';
const INDEX_URL = 'https://example.com/sub/index.html';

type Listener = (event: Record<string, unknown>) => void;

interface HarnessOptions {
  addAllFails?: boolean;
  cachedIndex?: unknown;
  cachedShell?: unknown;
  fetchImpl?: (request: unknown) => Promise<unknown>;
}

function createHarness(options: HarnessOptions = {}) {
  const listeners: Record<string, Listener[]> = {};
  const cacheStore = new Map<string, unknown>();
  const addedAssets: string[] = [];
  const warnings: unknown[][] = [];
  const skipWaiting = vi.fn();
  const claim = vi.fn();

  if (options.cachedIndex !== undefined) {
    cacheStore.set(INDEX_URL, options.cachedIndex);
  }
  if (options.cachedShell !== undefined) {
    cacheStore.set(new URL('./', SW_URL).href, options.cachedShell);
  }

  const cache = {
    addAll: vi.fn(async (assets: string[]) => {
      if (options.addAllFails) throw new Error('addAll failed');
      for (const asset of assets) cacheStore.set(new URL(asset, SW_URL).href, { asset });
    }),
    add: vi.fn(async (asset: string) => {
      addedAssets.push(asset);
      cacheStore.set(new URL(asset, SW_URL).href, { asset });
    }),
    put: vi.fn(async (request: { url?: string } | string, response: unknown) => {
      const key = typeof request === 'string' ? new URL(request, SW_URL).href : String(request.url);
      cacheStore.set(key, response);
    }),
  };

  const caches = {
    open: vi.fn(async () => cache),
    keys: vi.fn(async () => ['sliding-puzzle-v2.0', 'sliding-puzzle-v2.1']),
    delete: vi.fn(async () => true),
    match: vi.fn(async (key: string) => cacheStore.get(new URL(key, SW_URL).href)),
  };

  const fetchMock = vi.fn(
    options.fetchImpl ?? (async () => ({ ok: true, status: 200 }))
  );
  const self = {
    location: { href: SW_URL },
    addEventListener: (type: string, handler: Listener) => {
      const handlers = listeners[type] ?? [];
      handlers.push(handler);
      listeners[type] = handlers;
    },
    skipWaiting,
    clients: { claim },
  };

  const run = new Function('self', 'caches', 'fetch', 'console', 'URL', 'Response', swSource);
  run(
    self,
    caches,
    fetchMock,
    { warn: (...args: unknown[]) => warnings.push(args), log: () => {} },
    URL,
    { error: () => ({ type: 'error' }) }
  );

  const dispatch = async (type: string, event: Record<string, unknown> = {}) => {
    const waitUntil: Promise<unknown>[] = [];
    const respondWith: Promise<unknown>[] = [];
    const eventObject = {
      ...event,
      waitUntil: (promise: Promise<unknown>) => waitUntil.push(promise),
      respondWith: (promise: Promise<unknown>) => respondWith.push(promise),
    };

    for (const handler of listeners[type] ?? []) handler(eventObject);
    await Promise.all(waitUntil);
    return respondWith[0];
  };

  return { dispatch, cache, caches, cacheStore, addedAssets, skipWaiting, claim, warnings, fetchMock };
}

function createNavigationRequest() {
  return {
    method: 'GET',
    mode: 'navigate',
    url: 'https://example.com/sub/',
    headers: { get: (name: string) => (name.toLowerCase() === 'accept' ? 'text/html' : null) },
  };
}

describe('public/sw.js', () => {
  it('precaches on install without activating immediately to protect the running game', async () => {
    const harness = createHarness();

    await harness.dispatch('install');

    expect(harness.cache.addAll).toHaveBeenCalledWith(
      expect.arrayContaining(['./', './index.html', './assets/icons/icon-192.png'])
    );
    expect(harness.skipWaiting).not.toHaveBeenCalled();
  });

  it('caches assets individually when addAll rejects', async () => {
    const harness = createHarness({ addAllFails: true });

    await harness.dispatch('install');

    expect(harness.addedAssets).toContain('./index.html');
    expect(harness.addedAssets.length).toBeGreaterThan(1);
    expect(harness.warnings.length).toBeGreaterThan(0);
  });

  it('activates the waiting worker only when the client requests SKIP_WAITING', async () => {
    const harness = createHarness();

    await harness.dispatch('message', { data: { type: 'OTHER' } });
    expect(harness.skipWaiting).not.toHaveBeenCalled();

    await harness.dispatch('message', { data: { type: 'SKIP_WAITING' } });
    expect(harness.skipWaiting).toHaveBeenCalledTimes(1);
  });

  it('purges stale caches on activate and claims clients', async () => {
    const harness = createHarness();

    await harness.dispatch('activate');

    expect(harness.caches.delete).toHaveBeenCalledWith('sliding-puzzle-v2.0');
    expect(harness.caches.delete).not.toHaveBeenCalledWith('sliding-puzzle-v2.1');
    expect(harness.claim).toHaveBeenCalledTimes(1);
  });

  it('serves the cached shell when the navigation response is not ok', async () => {
    const cachedIndex = { source: 'cache' };
    const harness = createHarness({
      cachedIndex,
      fetchImpl: async () => ({ ok: false, status: 502 }),
    });

    const response = await harness.dispatch('fetch', { request: createNavigationRequest() });

    expect(response).toBe(cachedIndex);
  });

  it('falls back to the shell cache URL when the index cache entry is missing', async () => {
    const cachedShell = { source: 'shell' };
    const harness = createHarness({
      cachedShell,
      fetchImpl: async () => ({ ok: false, status: 503 }),
    });

    const response = await harness.dispatch('fetch', { request: createNavigationRequest() });

    expect(response).toBe(cachedShell);
  });

  it('serves the cached shell when the navigation request fails', async () => {
    const cachedIndex = { source: 'cache' };
    const harness = createHarness({
      cachedIndex,
      fetchImpl: async () => {
        throw new Error('offline');
      },
    });

    const response = await harness.dispatch('fetch', { request: createNavigationRequest() });

    expect(response).toBe(cachedIndex);
  });

  it('caches a successful navigation response under the request and shell URL', async () => {
    const networkResponse = { ok: true, status: 200, clone() { return this; } };
    const harness = createHarness({ fetchImpl: async () => networkResponse });

    const response = await harness.dispatch('fetch', { request: createNavigationRequest() });

    expect(response).toBe(networkResponse);
    expect(harness.cacheStore.get('https://example.com/sub/')).toBe(networkResponse);
    expect(harness.cacheStore.get(INDEX_URL)).toBe(networkResponse);
  });

  it('returns a network error when offline and nothing is cached', async () => {
    const harness = createHarness({
      fetchImpl: async () => {
        throw new Error('offline');
      },
    });

    const response = await harness.dispatch('fetch', { request: createNavigationRequest() });

    expect(response).toEqual({ type: 'error' });
  });
});
