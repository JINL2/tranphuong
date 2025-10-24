'use client';

/**
 * Example Chat Page with Resizable Panels
 * 
 * Copy this to your app/tro-chuyen/page.tsx file
 * or wherever your chat page is located
 */

import { useSearchParams } from 'next/navigation';
import ResizablePanel from '@/components/ui/resizable-panel';
import SourcesSection from '@/components/chat/SourcesSection';
import ChatSection from '@/components/chat/ChatSection';

export default function ChatPageExample() {
  // Get notebook ID from URL parameters
  const searchParams = useSearchParams();
  const notebookId = searchParams.get('notebookId') || 'your-default-notebook-id';

  return (
    <div className="h-screen w-full overflow-hidden bg-white">
      <ResizablePanel
        leftPanel={
          <SourcesSection notebookId={notebookId} />
        }
        rightPanel={
          <ChatSection notebookId={notebookId} />
        }
        defaultLeftWidth={40}
        minLeftWidth={25}
        maxLeftWidth={70}
      />
    </div>
  );
}
