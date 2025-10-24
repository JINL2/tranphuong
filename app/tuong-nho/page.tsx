import Link from 'next/link';
import { supabaseAdmin } from '@/lib/supabase/server';
import { convertRepliesToTributes } from '@/lib/utils/convertTribute';
import TributeCard, { Tribute } from '@/components/tribute/TributeCard';
import AddTributeButton from '@/components/tribute/AddTributeButton';

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TributeListPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || '1');
  const itemsPerPage = 12;

  // Fetch all tributes from Supabase only
  let allTributes: Tribute[] = [];

  try {
    const { data: replies } = await supabaseAdmin
      .from('replies')
      .select('*')
      .eq('is_deleted', false)
      .order('created_at', { ascending: false });

    if (replies) {
      allTributes = convertRepliesToTributes(replies);
    }
  } catch (error) {
    console.error('Failed to fetch tributes from Supabase:', error);
  }

  // 4. Calculate pagination
  const totalCount = allTributes.length;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTributes = allTributes.slice(startIndex, endIndex);

  // 5. Generate page numbers for pagination UI
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5; // Show 5 page numbers at a time

    if (totalPages <= maxVisible) {
      // If total pages <= 5, show all
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page ± 2 pages
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      // Adjust if near the start or end
      if (end - start < maxVisible - 1) {
        if (currentPage < 3) {
          end = Math.min(totalPages, maxVisible);
        } else {
          start = Math.max(1, totalPages - maxVisible + 1);
        }
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="tribute-section-title">
            Di sản lớn nhất của một đời người là những trái tim được họ truyền cảm hứng
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nơi lưu lại những kỷ niệm, những lời tri ân của người thân mến
          </p>
        </div>

        {/* Masonry Grid */}
        <div className="masonry-grid">
          {/* Add Tribute Button - First item */}
          <div className="masonry-item">
            <AddTributeButton />
          </div>

          {/* Tribute Cards */}
          {paginatedTributes.map((tribute, idx) => (
            <div key={`tribute-${tribute.id}-${idx}`} className="masonry-item">
              <TributeCard tribute={tribute} />
            </div>
          ))}
        </div>

        {/* Empty State */}
        {paginatedTributes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Không có lời tri ân nào</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12 flex-wrap">
            {/* Previous Button */}
            {currentPage > 1 && (
              <Link
                href={`/tuong-nho?page=${currentPage - 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                ‹ Trước
              </Link>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((pageNum) => (
              <Link
                key={pageNum}
                href={`/tuong-nho?page=${pageNum}`}
                className={`px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                  pageNum === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                }`}
              >
                {pageNum}
              </Link>
            ))}

            {/* Next Button */}
            {currentPage < totalPages && (
              <Link
                href={`/tuong-nho?page=${currentPage + 1}`}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                Sau ›
              </Link>
            )}
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            href="/#tuong-nho"
            className="text-sm text-gray-600 hover:text-gray-900 transition-colors inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
