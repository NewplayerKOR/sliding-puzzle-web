import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  registerServiceWorker,
  SW_APPLY_UPDATE_EVENT,
  SW_UPDATE_AVAILABLE_EVENT,
} from './swUpdateManager';

type EventHandler = (event?: unknown) => void;

function createEventSource<T extends Record<string, unknown>>(base: T) {
  const listeners = new Map<string, EventHandler[]>();
  return Object.assign(base, {
    addEventListener(type: string, handler: EventHandler) {
      const handlers = listeners.get(type) ?? [];
      handlers.push(handler);
      listeners.set(type, handlers);
    },
    emit(type: string, event?: unknown) {
      for (const handler of listeners.get(type) ?? []) handler(event);
    },
  });
}

const originalServiceWorkerDescriptor = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');

interface ServiceWorkerMockOptions {
  controller?: ServiceWorker | null;
  existingRegistration?: { active?: unknown; waiting?: unknown } | null;
}

function installServiceWorkerMock(
  registrationPromise: Promise<unknown>,
  options: ServiceWorkerMockOptions = {}
) {
  const container = createEventSource({
    controller:
      options.controller === undefined ? ({} as ServiceWorker) : options.controller,
    register: vi.fn(() => registrationPromise),
    getRegistration: vi.fn(() =>
      Promise.resolve(options.existingRegistration ?? undefined)
    ),
  });
  Object.defineProperty(navigator, 'serviceWorker', {
    configurable: true,
    value: container,
  });
  return container;
}

function startRegistration(reloadPage = vi.fn()) {
  registerServiceWorker('/sub/sw.js', reloadPage);
  if (document.readyState !== 'complete') {
    window.dispatchEvent(new Event('load'));
  }
  return reloadPage;
}

afterEach(() => {
  if (originalServiceWorkerDescriptor) {
    Object.defineProperty(navigator, 'serviceWorker', originalServiceWorkerDescriptor);
  } else {
    delete (navigator as { serviceWorker?: unknown }).serviceWorker;
  }
  vi.restoreAllMocks();
});

describe('registerServiceWorker', () => {
  it('notifies when a newly installed worker waits behind an existing controller', async () => {
    const worker = createEventSource({ state: 'installing', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: null as unknown, installing: worker });
    const container = installServiceWorkerMock(Promise.resolve(registration));
    const handleUpdate = vi.fn();
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalledWith('/sub/sw.js', { updateViaCache: 'none' }));

    registration.emit('updatefound');
    worker.state = 'installed';
    worker.emit('statechange');

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);
  });

  it('does not reload before the user accepts, then posts SKIP_WAITING and reloads once', async () => {
    const worker = createEventSource({ state: 'installing', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: null as unknown, installing: worker });
    const container = installServiceWorkerMock(Promise.resolve(registration));
    const reloadPage = startRegistration();

    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());

    registration.emit('updatefound');
    worker.state = 'installed';
    worker.emit('statechange');

    container.emit('controllerchange');
    expect(reloadPage).not.toHaveBeenCalled();

    window.dispatchEvent(new Event(SW_APPLY_UPDATE_EVENT));
    expect(worker.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

    container.emit('controllerchange');
    expect(reloadPage).toHaveBeenCalledTimes(1);

    container.emit('controllerchange');
    expect(reloadPage).toHaveBeenCalledTimes(1);
  });

  it('notifies immediately when a waiting worker already exists on registration', async () => {
    const waitingWorker = createEventSource({ state: 'installed', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: waitingWorker, installing: null });
    const container = installServiceWorkerMock(Promise.resolve(registration));
    const handleUpdate = vi.fn();
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());
    await vi.waitFor(() => expect(handleUpdate).toHaveBeenCalledTimes(1));

    window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);
  });

  it('ignores the installation event when there is no existing controller', async () => {
    const worker = createEventSource({ state: 'installing', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: null as unknown, installing: worker });
    const container = installServiceWorkerMock(Promise.resolve(registration));
    container.controller = null;
    const handleUpdate = vi.fn();
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());

    registration.emit('updatefound');
    worker.state = 'installed';
    worker.emit('statechange');

    expect(handleUpdate).not.toHaveBeenCalled();
    window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);
  });

  it('ignores the first-install event when the controller activates before statechange', async () => {
    const worker = createEventSource({ state: 'installing', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: null as unknown, installing: worker });
    const container = installServiceWorkerMock(Promise.resolve(registration), {
      controller: null,
    });
    const handleUpdate = vi.fn();
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());

    registration.emit('updatefound');
    // 첫 설치 중 controller가 먼저 활성화되는 WebKit 레이스를 모사함
    container.controller = {} as ServiceWorker;
    worker.state = 'installed';
    worker.emit('statechange');

    expect(handleUpdate).not.toHaveBeenCalled();
    window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);
  });

  it('notifies for an update after a hard reload even without a current controller', async () => {
    const worker = createEventSource({ state: 'installing', postMessage: vi.fn() });
    const registration = createEventSource({ waiting: null as unknown, installing: worker });
    const container = installServiceWorkerMock(Promise.resolve(registration), {
      controller: null,
      existingRegistration: { active: { state: 'activated' }, waiting: null },
    });
    const handleUpdate = vi.fn();
    window.addEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());

    registration.emit('updatefound');
    worker.state = 'installed';
    worker.emit('statechange');

    expect(handleUpdate).toHaveBeenCalledTimes(1);
    window.removeEventListener(SW_UPDATE_AVAILABLE_EVENT, handleUpdate);
  });

  it('warns without throwing when registration fails', async () => {
    const container = installServiceWorkerMock(Promise.reject(new Error('registration failed')));
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

    startRegistration();
    await vi.waitFor(() => expect(container.register).toHaveBeenCalled());
    await vi.waitFor(() => expect(warn).toHaveBeenCalled());
  });
});
