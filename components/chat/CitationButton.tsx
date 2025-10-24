'use client';

import React, { useState } from 'react';

interface CitationButtonProps {
  chunkIndex: number;
  onClick: () => void;
  className?: string;
  excerpt?: string;
}

const CitationButton = ({ chunkIndex, onClick, className = '', excerpt }: CitationButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <span className="relative inline-block">
      <button
        type="button"
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`inline-flex items-center justify-center w-6 h-6 p-0 ml-1 text-xs font-medium transition-all duration-200 rounded-full ${
          isHovered
            ? 'bg-blue-500 text-white border-blue-500 scale-110'
            : 'text-blue-600 border-blue-300 bg-white hover:bg-blue-50 hover:border-blue-400 border'
        } ${className}`}
        style={{
          verticalAlign: 'middle',
          cursor: 'pointer',
        }}
      >
        {chunkIndex + 1}
      </button>
      {excerpt && isHovered && (
        <span 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50"
        >
          <span className="block max-w-sm line-clamp-3">{excerpt}</span>
          <span className="block text-gray-400 mt-1 text-[10px]">Click to view source</span>
        </span>
      )}
    </span>
  );
};

export default CitationButton;
