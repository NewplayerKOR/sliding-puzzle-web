import React, { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const isFocusableTarget = (element: HTMLElement): boolean => {
  if (element.hasAttribute('hidden')) return false;
  if (element.getAttribute('aria-hidden') === 'true') return false;
  if (element.style.display === 'none') return false;
  if (element.closest('[hidden], [aria-hidden="true"], [inert]')) return false;
  return true;
};

export const getFocusableElements = (container: HTMLElement): HTMLElement[] =>
  Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isFocusableTarget);

/**
 * 모달이 열린 동안 초기 포커스 이동·Tab 순환·닫기 후 포커스 복원을 담당함.
 * 각 모달 콘텐츠 컨테이너는 tabIndex={-1}을 가져야 포커스 가능한 자식이 없을 때도 포커스를 받을 수 있음.
 */
export const useModalFocusTrap = (
  isOpen: boolean,
  containerRef: React.RefObject<HTMLElement | null>
) => {
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const container = containerRef.current;
    if (!container) return;

    const activeElement = document.activeElement;
    previouslyFocusedRef.current =
      activeElement instanceof HTMLElement ? activeElement : null;

    const initialFocusable = getFocusableElements(container)[0];
    (initialFocusable ?? container).focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = getFocusableElements(container);
      if (focusableElements.length === 0) {
        event.preventDefault();
        container.focus();
        return;
      }

      const currentElement = document.activeElement;
      const currentIndex =
        currentElement instanceof HTMLElement ? focusableElements.indexOf(currentElement) : -1;

      let nextIndex: number;
      if (event.shiftKey) {
        nextIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
      } else {
        nextIndex =
          currentIndex === -1 || currentIndex === focusableElements.length - 1
            ? 0
            : currentIndex + 1;
      }

      event.preventDefault();
      focusableElements[nextIndex].focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      const previousElement = previouslyFocusedRef.current;
      previouslyFocusedRef.current = null;
      if (
        previousElement &&
        previousElement.isConnected &&
        typeof previousElement.focus === 'function'
      ) {
        previousElement.focus();
      }
    };
  }, [isOpen, containerRef]);
};
