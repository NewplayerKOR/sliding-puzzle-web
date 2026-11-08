// LocalStorage 접근·JSON 파싱·스키마 검증 실패를 흡수하는 공통 유틸.
// 저장소가 차단된 브라우저나 손상된 값이 있어도 호출부는 기본값으로 계속 동작함.

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStorage(): Storage | null {
  if (typeof window === 'undefined') return null;
  try {
    return window.localStorage ?? null;
  } catch {
    // 쿠키·저장소 차단 설정 등으로 접근 자체가 예외를 던지는 환경
    return null;
  }
}

export function readStorageItem(key: string): string | null {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function writeStorageItem(key: string, value: string): boolean {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(key, value);
    return true;
  } catch {
    // 용량 초과·저장소 차단 등 쓰기 실패는 호출부에서 무시할 수 있게 false로 반환
    return false;
  }
}

export function removeStorageItem(key: string): void {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // ignore
  }
}

/**
 * 저장된 JSON을 읽어 normalize로 스키마를 검증함.
 * 값이 없거나 JSON이 손상됐거나 normalize가 예외를 던지면 null을 반환함.
 */
export function readStorageJson<T>(
  key: string,
  normalize: (value: unknown) => T | null
): T | null {
  const raw = readStorageItem(key);
  if (raw === null) return null;
  try {
    return normalize(JSON.parse(raw) as unknown);
  } catch {
    return null;
  }
}

export function writeStorageJson(key: string, value: unknown): boolean {
  try {
    return writeStorageItem(key, JSON.stringify(value));
  } catch {
    return false;
  }
}
