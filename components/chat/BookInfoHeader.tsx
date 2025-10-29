'use client';

import { useState, useEffect } from 'react';

interface BookInfoHeaderProps {
  bookTitle: string;
  summary: string;
}

const BookInfoHeader = ({ bookTitle, summary }: BookInfoHeaderProps) => {
  // Default: collapsed on mobile (false), expanded on desktop (true)
  const [isOpen, setIsOpen] = useState(true);

  // Detect mobile and collapse summary on initial mount
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsOpen(false);
    }
  }, []);

  return (
    <div className="border-b border-gray-200 bg-white flex-shrink-0">
      <div className="px-4 md:px-9 py-3 md:py-4">
        {/* Title Row with Toggle Button */}
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Book Title */}
          <h3 className="font-bold text-gray-900 flex-1 min-w-0" style={{ fontSize: '14px' }}>
            {bookTitle}
          </h3>

          {/* Toggle Button - aligned with title */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition-colors"
            aria-label={isOpen ? 'Collapse summary' : 'Expand summary'}
          >
            <svg
              className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Summary */}
        {isOpen && (
          <div className="book-summary-scroll">
            {summary ? (
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap" style={{ fontSize: '13px' }}>
                {summary}
              </p>
            ) : (
              <p className="text-gray-500 leading-relaxed italic" style={{ fontSize: '13px' }}>
                Loading summary...
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookInfoHeader;
