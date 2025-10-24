'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Custom hook for scroll-triggered animations using Intersection Observer
 *
 * @param threshold - Percentage of element visibility to trigger animation (0-1)
 * @returns Object with ref to attach to element and isVisible state
 *
 * Features:
 * - Only animates when scrolling DOWN (not up)
 * - One-time animation (disconnects after triggering)
 * - Respects prefers-reduced-motion accessibility setting
 * - SSR-safe (handles server-side rendering, prevents hydration mismatch)
 * - Properly cleans up observer to prevent memory leaks
 */
export function useScrollAnimation(threshold: number = 0.2) {
  const ref = useRef<HTMLLIElement>(null);
  // Always start hidden to avoid hydration mismatch
  const [isVisible, setIsVisible] = useState(false);
  const prevScrollY = useRef(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if user prefers reduced motion for accessibility
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    // If user prefers reduced motion, show immediately without animation
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    // Check if element is already visible on mount (e.g., above fold)
    const rect = element.getBoundingClientRect();
    const isAboveFold = rect.top < window.innerHeight * 0.8;

    if (isAboveFold) {
      setIsVisible(true);
      hasAnimated.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only trigger once
        if (hasAnimated.current) return;

        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > prevScrollY.current;

        // Only animate when:
        // 1. Element is intersecting viewport
        // 2. User is scrolling down (not up)
        // 3. Haven't animated yet
        if (entry.isIntersecting && isScrollingDown) {
          setIsVisible(true);
          hasAnimated.current = true;
          observer.disconnect(); // Clean up - one-time animation
        }

        prevScrollY.current = currentScrollY;
      },
      {
        threshold,
        // Trigger slightly before element enters viewport
        rootMargin: '0px 0px -100px 0px'
      }
    );

    observer.observe(element);

    // Cleanup function to prevent memory leaks
    return () => {
      observer.disconnect();
    };
  }, [threshold]);

  return { ref, isVisible };
}
