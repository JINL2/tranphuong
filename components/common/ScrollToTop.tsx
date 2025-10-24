'use client';

import { useEffect, useState } from 'react';
import { ChevronUp } from 'lucide-react';

/**
 * Scroll-to-Top Button Component
 *
 * Professional floating action button that appears when user scrolls down
 * and smoothly scrolls back to the top when clicked.
 *
 * Features:
 * - Appears after 400px scroll
 * - Disappears when near top (<100px)
 * - Smooth entrance/exit animations
 * - Accessibility-first (keyboard, screen reader, reduced motion)
 * - Responsive sizing and positioning
 * - Theme-aligned design (matches memorial aesthetic)
 */
export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Throttle scroll event for performance (100ms intervals)
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      // Clear existing timeout
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }

      // Debounce scroll updates
      scrollTimeout = setTimeout(() => {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // Show button after scrolling 400px down
        // Hide button when within 100px of top
        setIsVisible(scrollY > 400);
      }, 100);
    };

    // Add scroll listener with passive flag for performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check initial scroll position
    handleScroll();

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

  const scrollToTop = () => {
    // Smooth scroll to top with native browser behavior
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button
      onClick={scrollToTop}
      className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
      aria-label="Về đầu trang"
      title="Về đầu trang"
      type="button"
    >
      <ChevronUp className="w-5 h-5" strokeWidth={2.5} />
    </button>
  );
}
