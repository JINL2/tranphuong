'use client';

import { use, useState } from 'react';
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

  const handleCitationClick = (citation: Citation) => {
    console.log('Page: Citation clicked, passing to SourcesSection', citation);
    setSelectedCitation(citation);
    // Auto-switch to sources tab on mobile when citation is clicked
    setActiveTab('sources');
  };

  const handleCitationClose = () => {
    console.log('Page: Citation closed');
    setSelectedCitation(null);
  };

  return (
    <div className="h-screen flex flex-col bg-white overflow-hidden">
      {/* Mobile Header with Tabs */}
      <div className="md:hidden flex-shrink-0 border-b border-gray-200">
        <div className="flex">
          <button
            onClick={() => setActiveTab('sources')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'sources'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Nguồn
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'chat'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600'
            }`}
          >
            Chat
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop: Side by side | Mobile: Tab-based */}

        {/* Sources Section */}
        <div className={`
          ${activeTab === 'sources' ? 'flex' : 'hidden'}
          md:flex md:w-[30%] flex-shrink-0 overflow-hidden
          w-full
        `}>
          <SourcesSection
            notebookId={notebookId}
            selectedCitation={selectedCitation}
            setSelectedCitation={setSelectedCitation}
            onCitationClose={handleCitationClose}
          />
        </div>

        {/* Chat Section */}
        <div className={`
          ${activeTab === 'chat' ? 'flex' : 'hidden'}
          md:flex md:w-[70%] flex-shrink-0 overflow-hidden
          w-full
        `}>
          <ChatSection
            notebookId={notebookId}
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
