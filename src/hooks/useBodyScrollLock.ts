import { useEffect } from 'react';

/**
 * 모달이 열린 동안 배경 문서 스크롤을 잠그고, 닫힐 때 이전 스타일을 복원함.
 * 스크롤바가 사라지는 레이아웃 이동을 막기 위해 보정 폭을 함께 적용한다.
 *
 * modern-web-guidance `prevent-page-scroll-under-modal-dialog`은 html/body의
 * `overflow: hidden` 고정을 지양하고 `dialog:modal { overscroll-behavior: contain }`을
 * 권장한다. 현재 커스텀 오버레이 구조에서는 iOS 러버밴딩·Safari 구형 대응과
 * `e2e/mobile-scroll` 회귀(모달 중 배경 scrollY 불변) 때문에 overflow 잠금을 유지하고,
 * `src/styles/index.css`의 오버레이·콘텐츠 `overscroll-behavior: contain`으로 체인을
 * 함께 차단한다. native `dialog`로 마이그레이션하면 이 훅을 제거하고 CSS만 남긴다.
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
