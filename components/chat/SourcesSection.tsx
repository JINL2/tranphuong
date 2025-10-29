'use client';

import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Loader2, XCircle, Upload } from 'lucide-react';
import { useSources } from '@/hooks/useSources';
import type { Source } from '@/types/chat/database';
import SourceContentViewer from '@/components/chat/SourceContentViewer';

interface Citation {
  citation_id: number;
  source_id: string;
  source_title: string;
  source_type: string;
  chunk_index?: number;
  excerpt?: string;
  chunk_lines_from?: number;
  chunk_lines_to?: number;
}

interface SourcesSectionProps {
  notebookId: string;
  selectedCitation?: Citation | null;
  onCitationClose?: () => void;
  setSelectedCitation?: (citation: Citation | null) => void;
  autoSelectFirst?: boolean;
  onAutoSelectComplete?: () => void;
}

const SourcesSection = ({
  notebookId,
  selectedCitation,
  onCitationClose,
  setSelectedCitation,
  autoSelectFirst = false,
  onAutoSelectComplete
}: SourcesSectionProps) => {
  const { sources, isLoading } = useSources(notebookId);
  const [selectedSourceForViewing, setSelectedSourceForViewing] = useState<Source | null>(null);

  const renderSourceIcon = (type: string) => {
    const iconMap: Record<string, string> = {
      'pdf': '📄',
      'text': '📝',
      'website': '🌐',
      'youtube': '🎥',
      'audio': '🎵'
    };
    return iconMap[type] || '📄';
  };

  const renderProcessingStatus = (status: string | null | undefined) => {
    switch (status) {
      case 'uploading':
        return <Upload className="h-4 w-4 animate-pulse text-blue-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'pending':
        return <Loader2 className="h-4 w-4 animate-pulse text-gray-400" />;
      default:
        return <Loader2 className="h-4 w-4 animate-pulse text-gray-400" />;
    }
  };

  // Get source content from memory (InsightsLM approach)
  const getSourceContent = (citation: Citation) => {
    const source = sources?.find(s => s.id === citation.source_id);
    return source?.content || '';
  };

  const getSourceSummary = (citation: Citation) => {
    const source = sources?.find(s => s.id === citation.source_id);
    return source?.summary || '';
  };

  const getSourceUrl = (citation: Citation) => {
    const source = sources?.find(s => s.id === citation.source_id);
    return source?.url || '';
  };

  const getSelectedSourceContent = () => {
    return selectedSourceForViewing?.content || '';
  };

  const getSelectedSourceSummary = () => {
    return selectedSourceForViewing?.summary || '';
  };

  const getSelectedSourceUrl = () => {
    return selectedSourceForViewing?.url || '';
  };

  const handleSourceClick = (source: Source) => {
    // Clear any existing citation state first
    if (setSelectedCitation) {
      setSelectedCitation(null);
    }

    // Set the selected source for viewing
    setSelectedSourceForViewing(source);
  };

  const handleBackToSources = () => {
    setSelectedSourceForViewing(null);
    if (setSelectedCitation) {
      setSelectedCitation(null);
    }
  };

  // Auto-select first source on initial load
  useEffect(() => {
    if (autoSelectFirst && !isLoading && sources && sources.length > 0 && !selectedSourceForViewing) {
      // Auto-select the first source
      handleSourceClick(sources[0]);

      // Mark auto-selection as complete
      if (onAutoSelectComplete) {
        onAutoSelectComplete();
      }
    }
  }, [autoSelectFirst, isLoading, sources, selectedSourceForViewing, onAutoSelectComplete]);

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 border-b border-gray-200 flex-shrink-0" style={{ height: '64px' }}>
        <div className="flex items-center justify-between h-full">
          <h2 className="text-lg font-medium text-gray-900">Nguồn</h2>
        </div>
      </div>

      {/* Sources List - Top Section (flexible height, but can shrink) */}
      <div className="flex-shrink-0 overflow-y-auto border-b border-gray-200" style={{ maxHeight: selectedCitation || selectedSourceForViewing ? '40%' : '100%' }}>
        <div className="px-4 py-4">
          {isLoading ? (
            <div className="text-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">Loading sources...</p>
            </div>
          ) : sources && sources.length > 0 ? (
            <div className="space-y-3">
              {sources.map((source: Source) => (
                <div
                  key={source.id}
                  onClick={() => handleSourceClick(source)}
                  className={`p-3 border rounded-lg transition-colors cursor-pointer ${
                    selectedSourceForViewing?.id === source.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-start justify-between space-x-3">
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className="w-6 h-6 bg-white rounded border border-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden">
                        <span className="text-base">{renderSourceIcon(source.type)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm text-gray-900 truncate block">{source.title}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0 py-[4px]">
                      {renderProcessingStatus(source.processing_status)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Saved sources will appear here</h3>
              <p className="text-sm text-gray-600 mb-4">Sources will be displayed once added.</p>
            </div>
          )}
        </div>
      </div>

      {/* Source Content Viewer - Bottom Section (appears when citation or source is selected) */}
      {selectedCitation && (
        <div className="flex-1 overflow-hidden flex flex-col border-t-2 border-gray-300">
          <SourceContentViewer
            citation={selectedCitation}
            sourceContent={getSourceContent(selectedCitation)}
            sourceSummary={getSourceSummary(selectedCitation)}
            sourceUrl={getSourceUrl(selectedCitation)}
            className="flex-1 overflow-hidden"
            isOpenedFromSourceList={false}
            onClose={handleBackToSources}
          />
        </div>
      )}

      {!selectedCitation && selectedSourceForViewing && (
        <div className="flex-1 overflow-hidden flex flex-col border-t-2 border-gray-300">
          <SourceContentViewer
            citation={{
              citation_id: -1,
              source_id: selectedSourceForViewing.id,
              source_title: selectedSourceForViewing.title,
              source_type: selectedSourceForViewing.type,
              chunk_index: 0,
              excerpt: 'Full document view'
            }}
            sourceContent={getSelectedSourceContent()}
            sourceSummary={getSelectedSourceSummary()}
            sourceUrl={getSelectedSourceUrl()}
            className="flex-1 overflow-hidden"
            isOpenedFromSourceList={true}
            onClose={handleBackToSources}
          />
        </div>
      )}
    </div>
  );
};

export default SourcesSection;
