'use client';

import React, { useState, useEffect } from 'react';
import { Send, Loader2, RefreshCw } from 'lucide-react';
import { useNotebook } from '@/hooks/useNotebook';
import { useSources } from '@/hooks/useSources';
import { useChatMessages } from '@/hooks/useChatMessages';
import { useAutoResizeTextarea } from '@/hooks/useAutoResizeTextarea';
import { FEATURES } from '@/lib/features';
import MarkdownRenderer from './MarkdownRenderer';
import SuggestedQuestions from './SuggestedQuestions';
import BookInfoHeader from './BookInfoHeader';
import type { Citation } from '@/types/chat/message';

interface ChatSectionProps {
  notebookId: string;
  bookId: string;
  onCitationClick?: (citation: Citation) => void;
}

const ChatSection = ({ notebookId, bookId, onCitationClick }: ChatSectionProps) => {
  // Generate unique session ID on component mount (changes on refresh/re-enter)
  const [sessionId] = useState(() => crypto.randomUUID());

  const [message, setMessage] = useState('');
  const [pendingUserMessage, setPendingUserMessage] = useState<string | null>(null);
  const [showAiLoading, setShowAiLoading] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [bookTitle, setBookTitle] = useState('');
  const [bookSummary, setBookSummary] = useState('');

  // Auto-resize textarea hook (only used if FEATURES.AUTO_EXPANDING_TEXTAREA is true)
  const textareaRef = useAutoResizeTextarea(message, {
    minHeight: 48,
    maxHeight: 200
  });

  const { notebook } = useNotebook(notebookId);
  const { sources } = useSources(notebookId);
  const { messages, sendMessage, isSending, refetch, isLoading } = useChatMessages(sessionId, notebookId);
  
  const sourceCount = sources?.length || 0;
  const hasProcessedSource = sources?.some(source => source.processing_status === 'completed') || false;
  const isChatDisabled = !hasProcessedSource;

  // Handle citation click (InsightsLM approach - pass to parent)
  const handleCitationClick = (citation: Citation) => {
    console.log('ChatSection: Citation clicked', {
      citationId: citation.citation_id,
      sourceId: citation.source_id,
      chunkLinesFrom: citation.chunk_lines_from,
      chunkLinesTo: citation.chunk_lines_to
    });

    // Pass to parent component (page.tsx) to handle
    onCitationClick?.(citation);
  };

  // Load book data from books.json
  useEffect(() => {
    const loadBookData = async () => {
      try {
        const response = await fetch('/api/books');
        const books = await response.json();
        const book = books.find((b: any) => b.id === parseInt(bookId));
        if (book) {
          setBookTitle(book.title);
          setBookSummary(book.excerpt);
        }
      } catch (error) {
        console.error('Failed to load book data:', error);
      }
    };
    loadBookData();
  }, [bookId]);

  // Detect mobile for Enter key behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Clear pending message when we get new messages
  useEffect(() => {
    if (messages.length > lastMessageCount) {
      console.log('📬 New messages detected:', messages.length, 'vs', lastMessageCount);

      if (pendingUserMessage) {
        console.log('✅ Clearing pending message');
        setPendingUserMessage(null);
      }

      if (showAiLoading) {
        console.log('✅ Clearing AI loading');
        setShowAiLoading(false);
      }
    }
    setLastMessageCount(messages.length);
  }, [messages.length, lastMessageCount, pendingUserMessage, showAiLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || message.trim();
    
    if (!messageText || !notebookId || isChatDisabled || isSending || pendingUserMessage) {
      return;
    }

    console.log('📤 Sending message:', messageText);
    
    setPendingUserMessage(messageText);
    setMessage('');
    
    try {
      await sendMessage({
        sessionId: sessionId,
        notebookId: notebookId,
        content: messageText
      });
      
      console.log('✅ Message sent, waiting for response...');
      setShowAiLoading(true);
      
      setTimeout(async () => {
        console.log('🔄 Refetch attempt 1...');
        await refetch();
      }, 2000);
      
      setTimeout(async () => {
        console.log('🔄 Refetch attempt 2...');
        await refetch();
      }, 5000);
      
      setTimeout(async () => {
        console.log('🔄 Refetch attempt 3...');
        await refetch();
      }, 10000);
      
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      setPendingUserMessage(null);
      setShowAiLoading(false);
      setMessage(messageText);
    }
  };

  const isUserMessage = (msg: { message?: { type?: string; role?: string } }) => {
    const messageType = msg.message?.type || msg.message?.role;
    return messageType === 'human' || messageType === 'user';
  };

  const shouldShowClearButton = messages.length > 0;

  const getPlaceholderText = () => {
    if (isChatDisabled) {
      if (sourceCount === 0) {
        return "Tải lên tài liệu để bắt đầu...";
      } else {
        return "Vui lòng đợi trong khi tài liệu đang được xử lý...";
      }
    }
    // Desktop: Show examples, Mobile: Short version
    return isMobile
      ? "Hãy đặt câu hỏi..."
      : "Hãy đặt câu hỏi... (ví dụ: Những ý chính | Tóm tắt đầy đủ | Ông là ai?)";
  };

  return (
    <div className="flex-1 flex h-full bg-white overflow-hidden">
      {/* Chat Area */}
      <div className="flex-1 flex flex-col h-full w-full">
        {/* Header */}
        <div className="px-4 md:px-9 border-b border-gray-200 flex-shrink-0" style={{ height: '64px' }}>
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-medium text-gray-900">Chat</h2>
              <span className="text-xs text-gray-500">
                ({messages.length} messages{isLoading && ' - loading...'})
              </span>
            </div>
            {shouldShowClearButton && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear the chat history?')) {
                    window.location.reload();
                  }
                }}
                disabled={isChatDisabled}
                className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Clear Chat</span>
              </button>
            )}
          </div>
        </div>

        {/* Book Info Header - shows book title and collapsible summary */}
        {bookTitle && (
          <BookInfoHeader
            bookTitle={bookTitle}
            summary={bookSummary}
          />
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 md:px-9 py-6">
            <div className="space-y-6 md:max-w-[90%]">
              {isLoading && messages.length === 0 && (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto mb-3" />
                  <p className="text-sm text-gray-600">Loading messages...</p>
                </div>
              )}
              
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${isUserMessage(msg) ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`${
                      isUserMessage(msg)
                        ? 'max-w-2xl px-4 py-3 bg-blue-600 rounded-2xl'
                        : 'max-w-3xl px-4 py-3 bg-gray-50 rounded-2xl'
                    }`}
                  >
                    <div 
                      className={`text-sm leading-relaxed ${
                        isUserMessage(msg) ? '!text-white' : 'text-gray-900'
                      }`}
                      style={isUserMessage(msg) ? { color: '#ffffff' } : undefined}
                    >
                      <MarkdownRenderer 
                        content={msg.message.content}
                        onCitationClick={handleCitationClick}
                        isUserMessage={isUserMessage(msg)}
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              {pendingUserMessage && (
                <div className="flex justify-end">
                  <div className="max-w-2xl px-4 py-3 bg-blue-600 rounded-2xl">
                    <p className="text-sm whitespace-pre-wrap !text-white" style={{ color: '#ffffff' }}>
                      {pendingUserMessage}
                    </p>
                  </div>
                </div>
              )}
              
              {showAiLoading && (
                <div className="flex justify-start">
                  <div className="flex items-center space-x-2 px-4 py-3 bg-gray-100 rounded-2xl">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Input Area - Fixed above footer */}
        <div className="border-t border-gray-200 flex-shrink-0">
          {/* Text Input Row - Responsive padding: 16px mobile, 36px desktop */}
          <div className="px-4 md:px-9 pt-3 pb-2 flex items-start gap-2 md:gap-3 relative z-0">
            {FEATURES.AUTO_EXPANDING_TEXTAREA ? (
              // NEW: Auto-expanding textarea for better UX with long questions
              <textarea
                ref={textareaRef}
                rows={1}
                placeholder={getPlaceholderText()}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    // Desktop: Enter = Send, Shift+Enter = New Line
                    // Mobile: Enter = New Line (mobile keyboards make Shift+Enter hard)
                    if (!e.shiftKey && !isMobile) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }
                }}
                disabled={isChatDisabled || isSending || !!pendingUserMessage}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:border-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base resize-none overflow-hidden transition-colors"
                style={{ minHeight: '48px', maxHeight: '200px' }}
              />
            ) : (
              // FALLBACK: Single-line input (original behavior)
              <input
                type="text"
                placeholder={getPlaceholderText()}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isChatDisabled || isSending || !!pendingUserMessage}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:border-gray-800 disabled:bg-gray-100 disabled:cursor-not-allowed text-sm md:text-base transition-colors"
              />
            )}
            <button
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || isChatDisabled || isSending || !!pendingUserMessage}
              className="w-12 h-12 md:w-auto md:px-6 md:py-3 bg-gray-800 text-white rounded-full hover:bg-gray-900 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center flex-shrink-0"
            >
              {isSending || pendingUserMessage ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Suggested Questions - Shows below input */}
          <SuggestedQuestions
            bookId={bookId}
            onQuestionClick={(question) => handleSendMessage(question)}
            isDisabled={isChatDisabled || isSending || !!pendingUserMessage}
          />

          {/* Disclaimer text - Responsive padding matches input above */}
          <p className="text-center text-xs text-gray-500 px-4 md:px-9 pb-3">
            Phản hồi của AI có thể không chính xác; vui lòng kiểm chứng lại thông tin và <span className="font-bold">không sử dụng làm trích dẫn</span>.
          </p>
        </div>
      </div>

    </div>
  );
};

export default ChatSection;
