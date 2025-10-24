'use client';

import { Plus } from 'lucide-react';

/**
 * AddTributeButton - Card-style link that triggers GlobalAddTributeForm
 *
 * Uses hash navigation (#add-tribute) to trigger the global form overlay.
 * This ensures consistent centered form behavior across all pages.
 *
 * The actual form is rendered by GlobalAddTributeForm in layout.tsx
 */
export default function AddTributeButton() {
  return (
    <a
      href="#add-tribute"
      className="border-2 border-dashed border-gray-300 hover:border-gray-400 rounded-lg p-6 transition-all duration-300 bg-white hover:bg-gray-50 flex flex-col items-center justify-center text-center min-h-[200px] group w-full"
      aria-label="Góp kỷ niệm"
    >
      <div className="mb-3 p-3 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
        <Plus className="w-6 h-6 text-gray-600" />
      </div>
      <p className="text-sm font-medium text-gray-700 mb-1">
        Góp kỷ niệm
      </p>
      <p className="text-xs text-gray-500">
        Chia sẻ ảnh, câu chuyện, lời tưởng nhớ của bạn
      </p>
    </a>
  );
}
