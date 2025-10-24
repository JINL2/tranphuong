import { useEffect, RefObject } from 'react';

/**
 * Custom hook to trap focus within a dialog/modal
 * @param ref - Reference to the container element
 * @param isActive - Whether the focus trap is active
 */
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  isActive: boolean
) {
  useEffect(() => {
    if (!isActive || !ref.current) return;

    const container = ref.current;

    // Get all focusable elements
    const getFocusableElements = (): HTMLElement[] => {
      const selector =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
      return Array.from(container.querySelectorAll(selector)).filter(
        (el) => {
          const htmlEl = el as HTMLElement;
          return (
            !htmlEl.hasAttribute('disabled') &&
            htmlEl.tabIndex !== -1 &&
            htmlEl.offsetParent !== null // visible check
          );
        }
      ) as HTMLElement[];
    };

    // Handle Tab key to trap focus
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Shift + Tab: Move focus backwards
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      }
      // Tab: Move focus forwards
      else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Focus first element on mount
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      // Focus first input or button
      const firstInput = focusableElements.find(
        (el) => el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'
      );
      (firstInput || focusableElements[0]).focus();
    }

    container.addEventListener('keydown', handleTab);

    return () => {
      container.removeEventListener('keydown', handleTab);
    };
  }, [ref, isActive]);
}
