import React from 'react';

/**
 * Text Formatting Utilities
 *
 * Shared utilities for parsing and formatting text content across the memorial website.
 */

/**
 * Parses bold markdown syntax (**text**) and converts to React elements with font-weight styling
 *
 * @param text - String containing markdown bold syntax
 * @returns Array of React elements (strings and <strong> tags)
 *
 * @example
 * parseBoldText("This is **bold** text")
 * // Returns: ["This is ", <strong>bold</strong>, " text"]
 */
export function parseBoldText(text: string): (string | React.JSX.Element)[] {
  // Split by markdown bold pattern: **content**
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, index) => {
    // Check if this part is a bold markdown section
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove ** markers and render as bold
      const boldText = part.slice(2, -2);
      return <strong key={index} className="font-semibold">{boldText}</strong>;
    }
    // Return plain text as-is
    return part;
  });
}
