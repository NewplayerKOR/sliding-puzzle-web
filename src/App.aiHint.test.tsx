import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import App from './App';
import { resetGlobalLanguage } from './i18n/useTranslation';

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}));

class FakeWorker {
  static instances: FakeWorker[] = [];

  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  onmessageerror: ((event: MessageEvent) => void) | null = null;
  postMessage = vi.fn();
  terminate = vi.fn();

  constructor() {
    FakeWorker.instances.push(this);
  }
}

const createMemoryStorage = () => {
  const store = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, String(value));
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
    clear: vi.fn(() => {
      store.clear();
    }),
    key: vi.fn((index: number) => Array.from(store.keys())[index] ?? null),
    get length() {
      return store.size;
    },
  };
};

const startStandardGame = () => {
  fireEvent.click(screen.getByText(/게임 시작 \(4×4\)/i));
  fireEvent.click(screen.getByText('이 테마로 게임 시작'));
};

const aiHintButton = () => document.querySelector('.btn-ai-hint') as HTMLButtonElement;

const sentRequest = (worker: FakeWorker) =>
  worker.postMessage.mock.calls[0][0] as { requestId: number };

const hintResult = (requestId: number) => ({
  data: {
    result: { tileValue: 1, tileIndex: 0, direction: 'up' },
    requestId,
  },
});

describe('App AI hint lifecycle', () => {
  beforeEach(() => {
    FakeWorker.instances = [];
    vi.stubGlobal('localStorage', createMemoryStorage());
    vi.stubGlobal('Worker', FakeWorker as unknown as typeof Worker);
    resetGlobalLanguage();
    window.HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.pause = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    resetGlobalLanguage();
  });

  it('ignores a stale hint result after the board changes', () => {
    render(<App />);
    startStandardGame();

    const worker = FakeWorker.instances[0];
    fireEvent.click(aiHintButton());
    const request = sentRequest(worker);

    fireEvent.click(screen.getByText(/새 게임/i));
    expect(screen.queryByText('탐색 중...')).toBeNull();

    act(() => {
      worker.onmessage?.(hintResult(request.requestId) as MessageEvent);
    });

    expect(document.querySelector('.tile-ai-hint-overlay')).toBeNull();
    expect(document.querySelector('.global-toast-banner')).toBeNull();
  });

  it('shows a localized message when the solver returns no hint', () => {
    render(<App />);
    startStandardGame();

    const worker = FakeWorker.instances[0];
    fireEvent.click(aiHintButton());
    const request = sentRequest(worker);

    act(() => {
      worker.onmessage?.({ data: { result: null, requestId: request.requestId } } as MessageEvent);
    });

    expect(
      screen.getByText(
        '이동 가능한 힌트를 찾지 못했습니다. 보드를 섞은 뒤 다시 시도해 주세요.'
      )
    ).toBeDefined();
    expect(aiHintButton().textContent).toContain('3s');
    expect(aiHintButton().disabled).toBe(true);
  });

  it('clears the calculating state and notifies on worker errors', () => {
    render(<App />);
    startStandardGame();

    const worker = FakeWorker.instances[0];
    fireEvent.click(aiHintButton());

    act(() => {
      worker.onerror?.(new ErrorEvent('error', { message: 'worker failed' }));
    });

    expect(
      screen.getByText('AI 힌트 계산에 실패했습니다. 다시 시도해 주세요.')
    ).toBeDefined();
    expect(screen.queryByText('탐색 중...')).toBeNull();
    expect(worker.terminate).toHaveBeenCalled();
  });

  it('times out a stalled worker and ignores late results', () => {
    vi.useFakeTimers();
    render(<App />);
    startStandardGame();

    const worker = FakeWorker.instances[0];
    fireEvent.click(aiHintButton());
    const request = sentRequest(worker);

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(
      screen.getByText('AI 힌트 계산 시간이 초과되었습니다. 다시 시도해 주세요.')
    ).toBeDefined();
    expect(worker.terminate).toHaveBeenCalled();
    expect(aiHintButton().textContent).toContain('3s');

    act(() => {
      worker.onmessage?.(hintResult(request.requestId) as MessageEvent);
    });

    expect(document.querySelector('.tile-ai-hint-overlay')).toBeNull();
  });
});
