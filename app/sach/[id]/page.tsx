'use client';

import { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import SourcesSection from '@/components/chat/SourcesSection';
import ChatSection from '@/components/chat/ChatSection';
import type { Citation } from '@/types/chat/message';

// Mapping of book IDs to notebook IDs
const BOOK_TO_NOTEBOOK_MAP: Record<string, string> = {
  '1': '50d53e8e-b7fd-4bf4-8d3c-1fbca402068e', // Book 1: Hồi Ký Trần Phương: Một Thời Hào Hùng
  '2': 'dbc96f86-a585-47c9-9f5e-b4e883f20336', // Book 2: VÌ SỰ NGHIỆP TRỒNG NGƯỜI
  '3': 'e4b1319f-5178-44ba-881c-5818fd99ce91', // Book 3: Khoa Học Phụng Sự Cách Mạng (Tuyển Tập Các Công Trình Nghiên Cứu Khoa Học) - Tập 1 [FIXED]
  '4': '589bef35-c563-48ef-975e-9c84d4bed91a', // Book 4: Tóm tắt Bộ sưu tập Các Công trình Nghiên cứu Khoa học của Trần Phương - Tập 2: Khoa học Phụng sự Cách mạng
  '5': '079e8c57-6b9d-465a-a29a-8a59e686bc15', // Book 5: Giáo sư Trần Phương trong tâm thức đồng nghiệp và bạn bè [CORRECTED: 8c57 not 8cc7]
};

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

function ChatPageContent({ notebookId, bookId }: { notebookId: string; bookId: string }) {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null);
  const [activeTab, setActiveTab] = useState<'sources' | 'chat'>('chat');
  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount and set appropriate default tab
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // On desktop, default to sources tab; on mobile, default to chat tab
      if (!mobile) {
        setActiveTab('sources');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCitationClick = (citation: Citation) => {
    setSelectedCitation(citation);
    // Auto-switch to sources tab on mobile when citation is clicked
    setActiveTab('sources');
  };

  const handleCitationClose = () => {
    setSelectedCitation(null);
  };

  return (
    <div className="flex flex-col bg-white overflow-hidden h-full">
      {/* Mobile Header with Tabs */}
      <div className="md:hidden flex-shrink-0 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'sources'
                ? 'border-b-2'
                : 'text-gray-600'
            }`}
            style={activeTab === 'sources' ? {
              color: 'var(--primary)',
              borderBottomColor: 'var(--primary)'
            } : undefined}
          >
            Nguồn
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'chat'
                ? 'border-b-2'
                : 'text-gray-600'
            }`}
            style={activeTab === 'chat' ? {
              color: 'var(--primary)',
              borderBottomColor: 'var(--primary)'
            } : undefined}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex min-h-0">
        {/* Desktop: Side by side | Mobile: Tab-based */}

        {/* Sources Section */}
        <div className={`
          ${activeTab === 'sources' ? 'flex' : 'hidden'}
          md:flex md:w-[25%] flex-shrink-0
          w-full h-full
        `}>
          <SourcesSection
            notebookId={notebookId}
            selectedCitation={selectedCitation}
            setSelectedCitation={setSelectedCitation}
            onCitationClose={handleCitationClose}
            autoSelectFirst={!hasAutoSelected}
            onAutoSelectComplete={() => setHasAutoSelected(true)}
          />
        </div>

        {/* Chat Section */}
        <div className={`
          ${activeTab === 'chat' ? 'flex' : 'hidden'}
          md:flex md:w-[75%] flex-shrink-0
          w-full h-full
        `}>
          <ChatSection
            notebookId={notebookId}
            bookId={bookId}
            onCitationClick={handleCitationClick}
          />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const bookId = resolvedParams.id;
  
  // Get the notebook ID for this book
  const notebookId = BOOK_TO_NOTEBOOK_MAP[bookId];
  
  // If no mapping exists, show 404
  if (!notebookId) {
    notFound();
  }

  return <ChatPageContent notebookId={notebookId} bookId={bookId} />;
}
