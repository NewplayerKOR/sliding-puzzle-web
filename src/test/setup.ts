// Vitest의 jsdom 환경은 Node 26에 이미 존재하는 전역 localStorage 키를 건너뛰어
// window.localStorage가 undefined로 남는다. 실제 jsdom Storage를 전역에 연결한다.
type JsdomGlobal = typeof globalThis & {
  jsdom?: { window: Window };
};

const jsdomWindow = (globalThis as JsdomGlobal).jsdom?.window;

if (jsdomWindow) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    writable: true,
    value: jsdomWindow.localStorage,
  });
  Object.defineProperty(globalThis, 'sessionStorage', {
    configurable: true,
    writable: true,
    value: jsdomWindow.sessionStorage,
  });
}
