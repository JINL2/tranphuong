'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { convertRepliesToTributes } from '@/lib/utils/convertTribute';
import TributeCard, { Tribute } from './TributeCard';
import AddTributeButton from './AddTributeButton';

export default function TributeGrid() {
  const [allTributes, setAllTributes] = useState<Tribute[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTributes() {
      try {
        // Fetch tributes from database only
        const response = await fetch('/api/tributes?limit=8');
        const result = await response.json();

        if (result.success && result.data) {
          const tributes = convertRepliesToTributes(result.data);
          const tributesWithSource = tributes.map(t => ({ ...t, source: 'supabase' as const }));

          setAllTributes(tributesWithSource);
          setTotalCount(result.pagination.total);
        } else {
          setAllTributes([]);
          setTotalCount(0);
        }
      } catch (error) {
        console.error('Failed to fetch tributes:', error);
        setAllTributes([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    }

    fetchTributes();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="tribute-section-title">
            Di sản lớn nhất của một đời người là những trái tim được họ truyền cảm hứng
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Nơi lưu lại những kỷ niệm, những lời tri ân của người thân mến
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-gray-600">Đang tải...</p>
          </div>
        ) : (
          <>
            {/* Tributes Masonry Grid - Pinterest/Instagram Style */}
            <div className="masonry-grid">
              {/* Add Tribute Button - Always first */}
              <div className="masonry-item">
                <AddTributeButton />
              </div>

              {/* Tribute Cards */}
              {allTributes.map((tribute, idx) => (
                <div key={`tribute-${idx}-${tribute.id}`} className="masonry-item">
                  <TributeCard tribute={tribute} />
                </div>
              ))}
            </div>

            {/* View All Link */}
            {totalCount > 8 && (
              <div className="text-center mt-12">
                <Link
                  href="/tuong-nho"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
                >
                  Xem tất cả lời tri ân ({totalCount})
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
