'use client';

import { useEffect, useRef } from 'react';

interface UseAutoResizeTextareaOptions {
  /** Minimum height in pixels (default: 48px) */
  minHeight?: number;
  /** Maximum height in pixels (default: 200px) */
  maxHeight?: number;
  /** Enable smooth transitions (default: false for better performance) */
  enableTransition?: boolean;
}

/**
 * Custom hook for auto-resizing textarea
 *
 * Features:
 * - Automatically adjusts height based on content
 * - Respects min/max height constraints
 * - Handles Vietnamese diacritics correctly
 * - Optimized for performance (< 16ms resize)
 * - No external dependencies
 *
 * @example
 * const textareaRef = useAutoResizeTextarea(message, {
 *   minHeight: 48,
 *   maxHeight: 200
 * });
 *
 * return <textarea ref={textareaRef} value={message} />;
 */
export function useAutoResizeTextarea(
  value: string,
  options: UseAutoResizeTextareaOptions = {}
) {
  const {
    minHeight = 48,
    maxHeight = 200,
    enableTransition = false,
  } = options;

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to 'auto' to get accurate scrollHeight
    // This is necessary to shrink the textarea when content is deleted
    textarea.style.height = 'auto';

    // Calculate new height based on content
    const scrollHeight = textarea.scrollHeight;
    const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight);

    // Apply new height
    textarea.style.height = `${newHeight}px`;

    // Enable/disable vertical scrolling based on whether we hit max height
    if (scrollHeight > maxHeight) {
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.overflowY = 'hidden';
    }

    // Optional: Add smooth transition (disabled by default for better performance)
    if (enableTransition) {
      textarea.style.transition = 'height 0.1s ease';
    }
  }, [value, minHeight, maxHeight, enableTransition]);

  return textareaRef;
}
