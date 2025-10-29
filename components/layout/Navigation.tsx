'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import booksData from '@/content/books/books.json';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBooksDropdownOpen, setIsBooksDropdownOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);

  const chatBooks = [
    { id: 1, title: 'Một thời hào hùng (hồi ký)' },
    { id: 2, title: 'Vì sự nghiệp trồng người (1996 - 2016)' },
    { id: 4, title: 'Khoa học phụng sự cách mạng - Tập 2 (1973 - 2014)' },
    { id: 3, title: 'Khoa học phụng sự cách mạng - Tập 1 (1961 - 1971)' },
    { id: 5, title: 'Giáo sư Trần Phương trong tâm thức đồng nghiệp và bạn bè (Nhiều tác giả)' },
  ];

  const navItems = [
    { href: '/', label: 'Trang chủ' },
    { href: '/tieu-su', label: 'Tiểu sử' },
    { href: '/sach', label: 'Sách', hasDropdown: true },
    { href: '/thu-vien-anh', label: 'Thư viện ảnh' },
    // { href: '/tuong-nho', label: 'Tưởng nhớ' }, // Hidden per user request
    { href: '#', label: 'Chat cùng ông', isButton: true, isChatButton: true },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-divider shadow-sm z-[9999] pointer-events-auto">
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between md:justify-center h-20">
          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex items-center gap-5 lg:gap-6">
            {navItems.map((item) => {
              if (item.hasDropdown) {
                // Sách dropdown item
                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={() => setIsBooksDropdownOpen(true)}
                    onMouseLeave={() => setIsBooksDropdownOpen(false)}
                  >
                    <Link
                      href={item.href}
                      className="text-sm md:text-[0.9375rem] lg:text-base font-medium tracking-[0.3px] px-3 py-2 rounded-md text-primary hover:text-accent hover:bg-gray-50 transition-all duration-200 inline-flex items-center gap-1"
                    >
                      {item.label}
                      <svg
                        className="w-3 h-3 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </Link>

                    {/* Dropdown Panel */}
                    {isBooksDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-divider rounded-md shadow-lg overflow-hidden z-50">
                        {booksData.map((book) => (
                          <Link
                            key={book.id}
                            href={`/sach#book-${book.id}`}
                            className="block px-4 py-3 text-sm text-primary hover:bg-gray-50 hover:text-accent transition-colors border-b border-gray-100 last:border-0"
                          >
                            {book.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              // Button style for "Chat cùng ông"
              if (item.isButton) {
                return (
                  <button
                    key={item.href}
                    onClick={() => setIsChatModalOpen(true)}
                    className="text-sm md:text-[0.9375rem] lg:text-base font-medium tracking-[0.3px] px-3 py-2 rounded-[var(--radius)] text-primary border border-primary hover:scale-105 transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    <MessageCircle className="w-3 h-3" strokeWidth={2} />
                    {item.label}
                  </button>
                );
              }

              // Regular nav items
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm md:text-[0.9375rem] lg:text-base font-medium tracking-[0.3px] px-3 py-2 rounded-md text-primary hover:text-accent hover:bg-gray-50 transition-all duration-200"
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-primary focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Mobile: Chat cùng ông Button - Right Aligned */}
          <button
            onClick={() => setIsChatModalOpen(true)}
            className="md:hidden text-xs font-medium px-3 py-1.5 rounded-full border border-primary text-primary hover:bg-primary hover:text-white active:scale-95 transition-all inline-flex items-center gap-1"
            aria-label="Chat cùng ông"
          >
            <MessageCircle className="w-3.5 h-3.5" strokeWidth={2.5} />
            <span>Chat</span>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-6 bg-white">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => {
                if (item.hasDropdown) {
                  // Sách dropdown item for mobile
                  return (
                    <div key={item.href}>
                      <button
                        onClick={() => setIsBooksDropdownOpen(!isBooksDropdownOpen)}
                        className="text-sm font-medium text-primary hover:text-accent transition-colors flex items-center justify-between w-full"
                      >
                        {item.label}
                        <svg
                          className={`w-4 h-4 transition-transform ${isBooksDropdownOpen ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Mobile Books Submenu */}
                      {isBooksDropdownOpen && (
                        <div className="mt-2 ml-4 flex flex-col space-y-3">
                          {booksData.map((book) => (
                            <Link
                              key={book.id}
                              href={`/sach#book-${book.id}`}
                              className="text-sm text-primary hover:text-accent transition-colors"
                              onClick={() => {
                                setIsMenuOpen(false);
                                setIsBooksDropdownOpen(false);
                              }}
                            >
                              {book.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                // Button style for "Chat cùng ông"
                if (item.isButton) {
                  return (
                    <button
                      key={item.href}
                      onClick={() => {
                        setIsChatModalOpen(true);
                        setIsMenuOpen(false);
                      }}
                      className="text-sm font-medium text-primary border border-primary rounded-[var(--radius)] px-3 py-2 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3 h-3" strokeWidth={2} />
                      {item.label}
                    </button>
                  );
                }

                // Regular nav items
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-primary hover:text-accent transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {isChatModalOpen && (
        <div
          className="fixed inset-0 bg-white/50 backdrop-blur-md z-[10000] flex items-center justify-center p-4"
          onClick={() => setIsChatModalOpen(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-primary">Chat cùng ông</h2>
              <button
                onClick={() => setIsChatModalOpen(false)}
                className="text-gray-500 hover:text-primary transition-colors"
                aria-label="Đóng"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6">Chọn cuốn sách để bắt đầu trò chuyện với AI về cuộc đời và công trình của GS. Trần Phương:</p>

              <div className="flex flex-col gap-3">
                {chatBooks.map((book) => (
                  <Link
                    key={book.id}
                    href={`/sach/${book.id}`}
                    onClick={() => setIsChatModalOpen(false)}
                    className="w-full px-6 py-4 border border-gray-300 rounded-lg text-left hover:border-primary hover:bg-gray-50 transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors flex-shrink-0" />
                      <span className="text-sm md:text-base font-medium text-primary">{book.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
