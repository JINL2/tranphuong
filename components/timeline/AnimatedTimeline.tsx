'use client';

import TimelineItem from './TimelineItem';

/**
 * Animated Timeline Container Component
 *
 * Client component wrapper that renders a complete timeline with scroll-triggered animations.
 * Can be used in Server Components while maintaining animation functionality.
 *
 * Features:
 * - Accepts timeline data as props from Server Component parent
 * - Renders ordered list of TimelineItem components with animations
 * - Proper semantic HTML with aria-label for accessibility
 * - Optimized for performance with proper key props
 *
 * @example
 * // In a Server Component:
 * import timelineData from '@/content/timeline/life-journey.json';
 * import AnimatedTimeline from '@/components/timeline/AnimatedTimeline';
 *
 * export default function Page() {
 *   return <AnimatedTimeline data={timelineData} />;
 * }
 */

interface TimelineMilestone {
  id: number;
  period: string;
  title: string;
  description: string;
}

interface AnimatedTimelineProps {
  data: TimelineMilestone[];
  ariaLabel?: string;
}

export default function AnimatedTimeline({
  data,
  ariaLabel = "Life journey timeline"
}: AnimatedTimelineProps) {
  return (
    <ol aria-label={ariaLabel}>
      {data.map((milestone, idx) => (
        <TimelineItem
          key={milestone.id}
          milestone={milestone}
          index={idx}
          isLast={idx === data.length - 1}
        />
      ))}
    </ol>
  );
}
