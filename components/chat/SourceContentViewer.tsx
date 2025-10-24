'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Citation } from '@/types/chat/message';

interface SourceContentViewerProps {
  citation: Citation | null;
  sourceContent?: string;
  sourceSummary?: string;
  sourceUrl?: string;
  className?: string;
  isOpenedFromSourceList?: boolean;
  onClose?: () => void;
}

const SourceContentViewer = ({ 
  citation, 
  sourceContent, 
  sourceSummary,
  sourceUrl,
  className = '',
  isOpenedFromSourceList = false,
  onClose
}: SourceContentViewerProps) => {
  const highlightedContentRef = useRef<HTMLDivElement>(null);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  
  // Control accordion state based on how the viewer was opened
  const [accordionValue, setAccordionValue] = useState<string>(
    isOpenedFromSourceList ? "guide" : ""
  );

  // Check if we have valid citation line data (indicating a real citation click)
  const hasValidCitationLines = citation && 
    typeof citation.chunk_lines_from === 'number' && 
    typeof citation.chunk_lines_to === 'number' &&
    citation.chunk_lines_from > 0;

  console.log('SourceContentViewer: Render with citation', {
    citationId: citation?.citation_id,
    sourceId: citation?.source_id,
    hasValidCitationLines,
    isOpenedFromSourceList,
    chunkLinesFrom: citation?.chunk_lines_from,
    chunkLinesTo: citation?.chunk_lines_to,
    hasSourceContent: !!sourceContent,
    sourceContentLength: sourceContent?.length
  });

  // Auto-scroll to highlighted content when citation changes and has valid line data
  useEffect(() => {
    console.log('SourceContentViewer: Auto-scroll effect triggered', {
      hasValidCitationLines,
      citationId: citation?.citation_id,
      chunkLinesFrom: citation?.chunk_lines_from,
      hasScrollAreaRef: !!scrollAreaViewportRef.current
    });

    if (hasValidCitationLines && citation?.chunk_lines_from && scrollAreaViewportRef.current) {
      console.log('SourceContentViewer: Starting auto-scroll process');

      const timer = setTimeout(() => {
        const scrollAreaElement = scrollAreaViewportRef.current;
        if (!scrollAreaElement) return;

        // Find the actual viewport element within the ScrollArea
        const viewport = scrollAreaElement.querySelector('[data-radix-scroll-area-viewport]') as HTMLElement;

        if (viewport) {
          // Find the first highlighted line using data-line attribute
          const firstHighlightedLine = viewport.querySelector(`[data-line="${citation.chunk_lines_from}"]`) as HTMLElement;

          if (firstHighlightedLine) {
            console.log('SourceContentViewer: Scroll calculation', {
              lineNumber: citation.chunk_lines_from,
              highlightedOffsetTop: firstHighlightedLine.offsetTop,
              highlightedHeight: firstHighlightedLine.clientHeight,
              viewportHeight: viewport.clientHeight,
              currentScrollTop: viewport.scrollTop
            });

            // Calculate scroll position to center the highlighted content
            const scrollTop = firstHighlightedLine.offsetTop - (viewport.clientHeight / 2) + (firstHighlightedLine.clientHeight / 2);
            const targetScrollTop = Math.max(0, scrollTop);

            console.log('SourceContentViewer: Scrolling to line', {
              lineNumber: citation.chunk_lines_from,
              targetScrollTop
            });

            viewport.scrollTo({
              top: targetScrollTop,
              behavior: 'smooth'
            });
          } else {
            console.log('SourceContentViewer: First highlighted line not found', {
              lineNumber: citation.chunk_lines_from
            });
          }
        } else {
          console.log('SourceContentViewer: Viewport not found');
        }
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [citation?.citation_id, citation?.chunk_lines_from, citation?.chunk_lines_to, citation?.source_id, hasValidCitationLines]);

  // Close guide when a real citation is clicked (has valid line data)
  useEffect(() => {
    if (hasValidCitationLines) {
      console.log('SourceContentViewer: Closing guide for real citation');
      setAccordionValue("");
    }
  }, [hasValidCitationLines]);

  if (!citation || !sourceContent) {
    return (
      <div className="p-4 text-center text-gray-500">
        <p className="text-sm">Select a citation to view source content</p>
      </div>
    );
  }

  const getSourceIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'pdf': '/file-types/PDF.svg',
      'text': '/file-types/TXT.png',
      'website': '/file-types/WEB.svg',
      'youtube': '/file-types/MP3.png',
      'audio': '/file-types/MP3.png',
      'doc': '/file-types/DOC.png',
      'multiple-websites': '/file-types/WEB.svg',
      'copied-text': '/file-types/TXT.png'
    };

    const iconUrl = iconMap[type] || iconMap['text']; // fallback to TXT icon
    
    return (
      <img 
        src={iconUrl} 
        alt={`${type} icon`} 
        className="w-full h-full object-contain"
        onError={(e) => {
          // Fallback to a simple text indicator if image fails to load
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          target.parentElement!.innerHTML = '📄';
        }}
      />
    );
  };

  // Split content into lines for highlighting
  // Handle different line break formats and clean up the content
  const normalizedContent = sourceContent
    .replace(/\r\n/g, '\n')  // Convert Windows line breaks
    .replace(/\r/g, '\n');    // Convert old Mac line breaks

  const lines = normalizedContent.split('\n');

  console.log('SourceContentViewer: Content lines info', {
    totalLines: lines.length,
    chunkLinesFrom: citation.chunk_lines_from,
    chunkLinesTo: citation.chunk_lines_to,
    willHighlight: hasValidCitationLines,
    firstFewLines: lines.slice(0, 5),
    rawContentPreview: sourceContent.substring(0, 200)
  });

  // Determine the highlight range based on whether we have valid citation line data
  let startLine: number;
  let endLine: number;
  let isLineNumberOutOfRange = false;

  if (hasValidCitationLines) {
    // Check if the line numbers are within the valid range
    if (citation.chunk_lines_from! > lines.length || citation.chunk_lines_to! > lines.length) {
      console.warn('SourceContentViewer: Line numbers out of range', {
        chunkLinesFrom: citation.chunk_lines_from,
        chunkLinesTo: citation.chunk_lines_to,
        totalLines: lines.length,
        excerpt: citation.excerpt
      });
      isLineNumberOutOfRange = true;
      startLine = -1;
      endLine = -1;
    } else {
      // For real citations with valid line data, highlight the specific lines
      startLine = citation.chunk_lines_from!;
      endLine = citation.chunk_lines_to!;
      console.log('SourceContentViewer: Will highlight lines', { startLine, endLine });
    }
  } else {
    // For source list clicks or citations without line data, don't highlight
    startLine = -1;
    endLine = -1;
    console.log('SourceContentViewer: No highlighting (no valid line data)');
  }

  const renderHighlightedContent = () => {
    return lines.map((line, index) => {
      const lineNumber = index + 1;
      const isHighlighted = startLine > 0 && lineNumber >= startLine && lineNumber <= endLine;
      const isFirstHighlightedLine = isHighlighted && lineNumber === startLine;

      return (
        <div
          key={index}
          data-line={lineNumber}
          ref={isFirstHighlightedLine ? highlightedContentRef : null}
          className={`py-2 px-3 rounded leading-relaxed ${
            isHighlighted
              ? 'border-l-4'
              : 'hover:bg-gray-50'
          }`}
          style={isHighlighted ? {
            backgroundColor: '#eadef9',
            borderLeftColor: '#9333ea'
          } : {}}
        >
          <span className={isHighlighted ? 'font-medium' : ''}>{line}</span>
        </div>
      );
    });
  };

  return (
    <div className={`flex flex-col h-full overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {getSourceIcon(citation.source_type)}
            </div>
            <span className="font-medium text-gray-900 truncate">{citation.source_title}</span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 p-1 hover:bg-gray-100 rounded transition-colors flex-shrink-0"
              aria-label="Close source viewer"
            >
              <svg 
                className="w-5 h-5 text-gray-600" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Source Guide Accordion */}
      {sourceSummary && (
        <div className="border-b border-gray-200 flex-shrink-0">
          <div className="border-0">
            <button
              onClick={() => setAccordionValue(accordionValue === "guide" ? "" : "guide")}
              className="w-full px-4 py-3 text-sm font-medium hover:no-underline hover:bg-blue-50 flex items-center justify-between" 
              style={{ color: '#234776' }}
            >
              <div className="flex items-center space-x-2">
                <svg xmlns="http://www.w3.org/2000/svg" height="16px" viewBox="0 -960 960 960" width="16px" fill="#234776">
                  <path d="M166.67-120.67 120-167.33l317.67-318L254-531l194-121-16.33-228 175 147L818-818.33l-85.67 211.66L880-432l-228.67-16.67-120.66 194L485-438.33 166.67-120.67Zm24.66-536L120-728l72-72 71.33 71.33-72 72Zm366.34 233 58-94.33 111 8.33-72-85 41.66-102.66-102.66 41.66-85-71.66L517-616.67l-94.33 59 108 26.67 27 107.33Zm171 303.67-71.34-72 71.34-71.33 71.33 72L728.67-120ZM575-576Z"/>
                </svg>
                <span>Source guide</span>
              </div>
              <svg 
                className={`w-4 h-4 transition-transform ${accordionValue === "guide" ? "rotate-180" : ""}`}
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {accordionValue === "guide" && (
              <div className="px-4 pb-4">
                <div className="text-sm text-gray-700 space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Summary</h4>
                    <p className="leading-relaxed">{sourceSummary}</p>
                  </div>
                  
                  {/* Show URL for website sources */}
                  {citation.source_type === 'website' && sourceUrl && (
                    <div>
                      <h4 className="font-medium mb-2">URL</h4>
                      <a 
                        href={sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline break-all text-sm"
                      >
                        {sourceUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <ScrollArea className="flex-1 h-full" ref={scrollAreaViewportRef}>
        <div className="p-4">
          {/* Show citation info box when line numbers are out of range */}
          {isLineNumberOutOfRange && (
            <div className="mb-6">
              <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded-r-lg shadow-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-purple-900 mb-2">Referenced excerpt from source</h4>
                    <div className="text-sm text-purple-800 leading-relaxed bg-white p-3 rounded border border-purple-200">
                      <p className="italic">&ldquo;This content is referenced from the original document but cannot be precisely located in the current view.&rdquo;</p>
                    </div>
                    <p className="text-xs text-purple-700 mt-3">
                      💡 The AI referenced lines {citation.chunk_lines_from}-{citation.chunk_lines_to} from the original document. You can browse the full source content below.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Full source content */}
          {isLineNumberOutOfRange && (
            <div className="mb-3">
              <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Full source document
              </h3>
            </div>
          )}

          <div className="prose prose-gray max-w-none space-y-1">
            {renderHighlightedContent()}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default SourceContentViewer;
