'use client';

import { useScrollAnimation } from '@/app/hooks/useScrollAnimation';
import { parseBoldText } from '@/lib/utils/textFormatting';

/**
 * Timeline Item Component with Scroll Animation
 *
 * Displays a single milestone in the life journey timeline with scroll-triggered fade-in animation.
 *
 * Features:
 * - Intersection Observer-based animation triggers when scrolling down
 * - Staggered delay animation for period, dot, and content elements
 * - Accessibility support (respects prefers-reduced-motion)
 * - SSR-safe with proper hydration handling
 *
 * @example
 * <TimelineItem
 *   milestone={{
 *     id: 1,
 *     period: "1927",
 *     title: "Ra Đời",
 *     description: "Born in Hưng Yên province"
 *   }}
 *   index={0}
 *   isLast={false}
 * />
 */

export interface TimelineItemProps {
  milestone: {
    id: number;
    period: string;
    title: string;
    description: string;
  };
  index: number;
  isLast: boolean;
}

export default function TimelineItem({ milestone, index, isLast }: TimelineItemProps) {
  // Hook for scroll-triggered animation with 20% visibility threshold
  const { ref, isVisible } = useScrollAnimation(0.2);

  return (
    <li
      ref={ref}
      className={`flex gap-4 sm:gap-6 transition-all duration-600 ${
        isVisible ? 'timeline-item-visible' : 'timeline-item-hidden'
      }`}
      style={{
        // Stagger animation: 50ms delay per item for cascading effect
        transitionDelay: `${index * 50}ms`
      }}
    >
      {/* Column 1: Period - Right Aligned, Vertically Centered with Title */}
      <div className="w-24 sm:w-40 text-right flex-shrink-0 flex items-center justify-end h-6 timeline-period">
        <span className="text-sm text-gray-500">
          {milestone.period}
        </span>
      </div>

      {/* Column 2: Dot + Line - Center, Stretches to Full Height */}
      <div className="flex flex-col items-center flex-shrink-0 self-stretch">
        <div className="timeline-dot mt-1.5"></div>
        {!isLast && (
          <div className="timeline-line w-0.5 flex-1 mt-2"></div>
        )}
      </div>

      {/* Column 3: Content - Left Aligned */}
      <div className={`flex-1 timeline-content ${!isLast ? 'pb-8' : ''}`}>
        <h3 className="font-semibold text-gray-900 text-base leading-6 mb-2">
          {milestone.title}
        </h3>
        <p className="text-sm text-gray-700 leading-relaxed">
          {parseBoldText(milestone.description)}
        </p>
      </div>
    </li>
  );
}
