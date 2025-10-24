'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
  date: string;
  category: string;
  width: number;
  height: number;
}

interface ImageLightboxProps {
  image: GalleryImage;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export default function ImageLightbox({
  image,
  onClose,
  onNext,
  onPrevious,
  hasNext = false,
  hasPrevious = false,
}: ImageLightboxProps) {
  // Keyboard navigation
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight' && hasNext && onNext) {
        onNext();
      } else if (event.key === 'ArrowLeft' && hasPrevious && onPrevious) {
        onPrevious();
      }
    },
    [onClose, onNext, onPrevious, hasNext, hasPrevious]
  );

  useEffect(() => {
    // Add keyboard listener
    document.addEventListener('keydown', handleKeyDown);
    // Prevent body scroll when lightbox is open
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  return (
    <div
      className="fixed inset-0 z-[9998] backdrop-blur-md bg-gray-900/20 flex items-center justify-center p-4 pt-24 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Close button - positioned below navigation bar */}
      <button
        onClick={onClose}
        className="fixed top-24 right-4 z-[9998] p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
        aria-label="Đóng"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Previous button */}
      {hasPrevious && onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrevious();
          }}
          className="fixed left-4 top-1/2 -translate-y-1/2 z-[9998] p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-lg hidden sm:block"
          aria-label="Ảnh trước"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next button */}
      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="fixed right-4 top-1/2 -translate-y-1/2 z-[9998] p-3 rounded-full bg-white text-gray-900 hover:bg-gray-100 transition-colors shadow-lg hidden sm:block"
          aria-label="Ảnh tiếp theo"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Image container */}
      <div
        className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image */}
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="relative max-w-full max-h-[50vh] sm:max-h-[75vh]">
            <Image
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              className="max-w-full max-h-[50vh] sm:max-h-[75vh] w-auto h-auto object-contain rounded-lg"
              quality={95}
              priority
            />
          </div>
        </div>

        {/* Mobile navigation hints */}
        <div className="sm:hidden mt-4 flex items-center gap-4 text-sm">
          {hasPrevious && (
            <button
              onClick={onPrevious}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-gray-900 shadow-md border border-gray-200 hover:bg-gray-50"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Trước</span>
            </button>
          )}
          {hasNext && (
            <button
              onClick={onNext}
              className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white text-gray-900 shadow-md border border-gray-200 hover:bg-gray-50"
            >
              <span>Tiếp</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
