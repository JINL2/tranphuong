'use client';

import { useState, useEffect } from 'react';
import questionsData from '@/content/books/suggestedQuestions.json';

interface SuggestedQuestionsProps {
  bookId: string;
  onQuestionClick: (question: string) => void;
  isDisabled?: boolean;
}

interface QuestionState {
  visible: string[];
  used: string[];
  available: string[];
}

export default function SuggestedQuestions({
  bookId,
  onQuestionClick,
  isDisabled = false
}: SuggestedQuestionsProps) {
  // Load all questions for this book
  const allQuestions = questionsData[bookId as keyof typeof questionsData] || [];

  // Always initialize with default state (fixes hydration mismatch)
  const [state, setState] = useState<QuestionState>({
    visible: allQuestions.slice(0, 3),
    used: [],
    available: allQuestions.slice(3)
  });

  // Hydrate from sessionStorage after mount (client-side only)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `questions-book-${bookId}`;
      const saved = sessionStorage.getItem(storageKey);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setState(parsed);
        } catch {
          // Keep default state if parsing fails
        }
      }
    }
  }, [bookId]);

  // Save state to sessionStorage whenever it changes (after initial hydration)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storageKey = `questions-book-${bookId}`;
      sessionStorage.setItem(storageKey, JSON.stringify(state));
    }
  }, [state, bookId]);

  // Handle question click
  const handleClick = (question: string) => {
    if (isDisabled) return;

    // Send message
    onQuestionClick(question);

    // Update state
    setState(prev => {
      const nextAvailable = prev.available[0];

      if (nextAvailable) {
        // Replace clicked with next available
        return {
          visible: prev.visible.map(q => q === question ? nextAvailable : q),
          used: [...prev.used, question],
          available: prev.available.slice(1)
        };
      } else {
        // No more available - remove clicked question
        return {
          visible: prev.visible.filter(q => q !== question),
          used: [...prev.used, question],
          available: []
        };
      }
    });
  };

  // If all questions used, hide component
  if (state.used.length >= allQuestions.length) {
    return null;
  }

  return (
    <div className="relative z-10">
      {/* Scrollable container - responsive padding: 16px mobile, 36px desktop */}
      <div className="overflow-x-auto scrollbar-hide px-4 md:px-9 pt-1 pb-3 relative z-20">
        {/* Mobile: horizontal scroll with fixed card width | Desktop: flex equal width cards */}
        <div className="flex gap-3 min-w-min md:min-w-0 pb-2">
          {state.visible.map((question, index) => (
            <button
              key={`${question.substring(0, 20)}-${index}`}
              onClick={() => handleClick(question)}
              disabled={isDisabled}
              className={`
                flex-shrink-0 md:flex-1 w-[280px] md:w-auto
                min-h-[80px] md:min-h-[100px] p-3 md:px-4 md:py-3
                bg-white border border-gray-300 rounded-xl
                text-left text-sm text-gray-900 leading-relaxed
                transition-all duration-200
                relative
                ${isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:border-gray-500 hover:shadow-lg hover:scale-[1.02] cursor-pointer active:scale-[0.98]'
                }
              `}
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
