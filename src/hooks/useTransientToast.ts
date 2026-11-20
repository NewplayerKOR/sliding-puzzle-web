import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * 짧은 액션 피드백 메시지를 표시하고 마지막 메시지 기준으로 표시 시간을 보장함.
 * 새 메시지가 오면 이전 타이머를 정리하므로 연속 알림에서도 조기 종료되지 않는다.
 */
export function useTransientToast(durationMs = 3000) {
  const [message, setMessage] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  const clearToastTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const showToast = useCallback(
    (nextMessage: string) => {
      clearToastTimer();
      setMessage(nextMessage);
      timerRef.current = window.setTimeout(() => {
        timerRef.current = null;
        setMessage(null);
      }, durationMs);
    },
    [clearToastTimer, durationMs]
  );

  const dismissToast = useCallback(() => {
    clearToastTimer();
    setMessage(null);
  }, [clearToastTimer]);

  useEffect(() => clearToastTimer, [clearToastTimer]);

  return { message, showToast, dismissToast };
}
