import { useEffect } from 'react';

/**
 * 모달이 열린 동안 배경 문서 스크롤을 잠그고, 닫힐 때 이전 스타일을 복원함.
 * 스크롤바가 사라지는 레이아웃 이동을 막기 위해 보정 폭을 함께 적용한다.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked]);
}
