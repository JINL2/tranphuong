# Timeline Data Documentation

## Overview

This folder contains structured timeline data for the life journey ("Hành trình cuộc đời") of GS. Trần Phương.

## Files

- `life-journey.json` - Complete chronological timeline of life events and career milestones

## Data Structure

### Schema

Each timeline entry follows this structure:

```json
{
  "id": number,              // Unique identifier
  "period": string,          // Display date in Vietnamese format (e.g., "1/11/1927", "1975 - 2021")
  "year": number | null,     // Primary year for grouping/filtering
  "startDate": string | null, // ISO 8601 date for programmatic sorting (e.g., "1927-11-01")
  "endDate": string | null,  // ISO 8601 end date for ranges (null for single events)
  "title": string,           // Short descriptive title
  "description": string,     // Full event description (may contain **markdown** for bold text)
  "category": string,        // Event category (see below)
  "importance": string       // Relative importance (high|medium|low)
}
```

### Categories

- `birth` - Birth and early life
- `education` - Educational milestones
- `revolution` - Revolutionary activities during wartime
- `career` - Professional positions and career milestones
- `retirement` - Retirement event
- `honor` - Awards, honors, and recognition

### Importance Levels

- `high` - Major life milestones (birth, key positions, major honors)
- `medium` - Important but secondary events
- `low` - Supporting details (not currently used but available for future)

## Usage Examples

### Import in React/Next.js

```tsx
import timelineData from '@/content/timeline/life-journey.json';

// Display all events
timelineData.map(event => (
  <div key={event.id}>
    <h3>{event.title}</h3>
    <p>{event.period}</p>
    <p>{event.description}</p>
  </div>
));

// Filter by category
const educationEvents = timelineData.filter(e => e.category === 'education');

// Sort by date
const sortedEvents = timelineData.sort((a, b) =>
  new Date(a.startDate || 0).getTime() - new Date(b.startDate || 0).getTime()
);
```

### Rendering Markdown Bold Text

Description fields may contain `**text**` for bold emphasis. Example processing:

```tsx
const renderDescription = (text: string) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
};
```

Or use a markdown library like `react-markdown`.

## Data Notes

1. **Date Formats**:
   - `startDate` and `endDate` are in ISO 8601 format (`YYYY-MM-DD`) for programmatic use
   - `period` preserves the original Vietnamese display format
   - Some events (like honors) may have `null` dates

2. **Date Ranges**:
   - Single events: `endDate` is `null`
   - Ranges: Both `startDate` and `endDate` are populated
   - Ongoing: `endDate` may be `null` for open-ended periods

3. **Bold Text**:
   - Important positions and honors are marked with `**text**` in descriptions
   - These should be rendered as bold text in the UI

4. **Chronological Order**:
   - Entries are ordered chronologically by `id`
   - Can be re-sorted using `startDate` for precise ordering

## Maintenance

When adding new timeline entries:

1. Assign a unique `id` (increment from last entry)
2. Use original Vietnamese date format for `period`
3. Convert to ISO 8601 for `startDate` and `endDate`
4. Assign appropriate `category`
5. Set `importance` based on significance
6. Use `**bold**` for key positions/honors in description
7. Keep entries in chronological order

## Future Enhancements

Possible additions to the schema:

- `location` - Geographic location of event
- `relatedPeople` - Array of related individuals
- `images` - Array of image URLs for the period
- `sources` - References/citations
- `tags` - Additional categorization keywords
