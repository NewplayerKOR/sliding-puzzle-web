import { useEffect } from 'react';

/**
 * 모달이 열린 동안 배경 문서 스크롤을 잠그고, 닫힐 때 이전 스타일을 복원함.
 * 스크롤바가 사라지는 레이아웃 이동을 막기 위해 보정 폭을 함께 적용한다.
 */
export function useBodyScrollLock(isLocked: boolean) {
  useEffect(() => {
    if (!isLocked || typeof document === 'undefined') return;

    const root = document.documentElement;
    const body = document.body;
    const previousRootOverflow = root.style.overflow;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = Math.max(0, window.innerWidth - document.documentElement.clientWidth);

    // 문서 스크롤은 html이 담당하므로 루트와 body를 함께 잠가야 모바일·데스크톱에서 확실히 막힘
    root.style.overflow = 'hidden';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      root.style.overflow = previousRootOverflow;
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
    };
  }, [isLocked]);
}
