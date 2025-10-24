'use client';

import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import imagesData from '@/content/gallery/images.json';
import ImageLightbox from '@/components/gallery/ImageLightbox';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  caption: string;
  date: string;
  category: string;
  width: number;
  height: number;
  isFromDatabase?: boolean;
}

interface SupabaseReply {
  id: number;
  created_at: string;
  name: string | null;
  position: string | null;
  contents: string | null;
  image_url: string | null;
  is_deleted: boolean | null;
}

export default function PhotoGallery() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');
  const [lightboxImage, setLightboxImage] = useState<GalleryImage | null>(null);
  const [databaseImages, setDatabaseImages] = useState<GalleryImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Pagination configuration: 12 images per page
  // Mobile (2 cols): 6 rows | Tablet (3 cols): 4 rows | Desktop (4 cols): 3 rows
  const IMAGES_PER_PAGE = 12;

  // Fetch images from Supabase
  useEffect(() => {
    const fetchDatabaseImages = async () => {
      try {
        const response = await fetch('/api/tributes');
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            // Convert database replies to gallery images
            const convertedImages: GalleryImage[] = result.data
              .filter((reply: SupabaseReply) => reply.image_url) // Only include replies with images
              .map((reply: SupabaseReply) => ({
                id: 1000 + reply.id, // Offset ID to avoid conflicts with default images
                src: reply.image_url!,
                alt: reply.name || 'Ảnh từ người tri ân',
                caption: reply.contents || reply.name || 'Ảnh tri ân',
                date: new Date(reply.created_at).toLocaleDateString('vi-VN'),
                category: reply.position || 'Khác', // Use position column for category
                width: 800,
                height: 800,
                isFromDatabase: true
              }));
            setDatabaseImages(convertedImages);
          }
        }
      } catch (error) {
        console.error('Error fetching database images:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDatabaseImages();
  }, []);

  // Combine default images and database images
  const allImages = useMemo(() => {
    return [...imagesData, ...databaseImages];
  }, [databaseImages]);

  // Get unique categories (including predefined ones)
  const categories = useMemo(() => {
    const predefinedCategories = [
      'Tất cả',
      'Người Thầy',
      'Nhà Kinh Tế',
      'Chiến Sĩ Cách Mạng',
      'Gia Đình',
      'Khác'
    ];

    return predefinedCategories;
  }, []);

  // Filter images by category
  const filteredImages = useMemo(() => {
    if (selectedCategory === 'Tất cả') {
      return allImages;
    }
    return allImages.filter((img) => img.category === selectedCategory);
  }, [selectedCategory, allImages]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredImages.length / IMAGES_PER_PAGE);

  // Get images for current page
  const paginatedImages = useMemo(() => {
    const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
    const endIndex = startIndex + IMAGES_PER_PAGE;
    return filteredImages.slice(startIndex, endIndex);
  }, [filteredImages, currentPage, IMAGES_PER_PAGE]);

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory]);

  // Scroll to top when page changes (smooth scroll to gallery start)
  useEffect(() => {
    if (currentPage > 1) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentPage]);

  // Handle image click
  const handleImageClick = (image: GalleryImage) => {
    setLightboxImage(image);
  };

  // Handle lightbox navigation
  const handleNext = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === lightboxImage.id
    );
    const nextIndex = (currentIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex] as GalleryImage);
  };

  const handlePrevious = () => {
    if (!lightboxImage) return;
    const currentIndex = filteredImages.findIndex(
      (img) => img.id === lightboxImage.id
    );
    const previousIndex =
      currentIndex === 0 ? filteredImages.length - 1 : currentIndex - 1;
    setLightboxImage(filteredImages[previousIndex] as GalleryImage);
  };

  const hasNext =
    lightboxImage &&
    filteredImages.findIndex((img) => img.id === lightboxImage.id) <
      filteredImages.length - 1;

  const hasPrevious =
    lightboxImage &&
    filteredImages.findIndex((img) => img.id === lightboxImage.id) > 0;

  return (
    <div className="min-h-screen bg-white -mt-24 pt-24">
      {/* Header */}
      <div className="py-8 sm:py-12 px-6 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
          Thư Viện Ảnh
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Những khoảnh khắc đáng nhớ trong cuộc đời Giáo sư Trần Phương
        </p>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Image count */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <p className="text-sm text-gray-500 text-center">
          {filteredImages.length} ảnh
          <span className="text-gray-400"> · Trang {currentPage}/{totalPages}</span>
        </p>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-gray-900 border-r-transparent"></div>
            <p className="mt-4 text-gray-500">Đang tải ảnh...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
              {paginatedImages.map((image) => (
                <button
                  key={image.id}
                  onClick={() => handleImageClick(image as GalleryImage)}
                  className="aspect-square rounded-lg overflow-hidden relative group cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                  aria-label={`Xem ảnh: ${image.caption}`}
                >
                  {/* Image */}
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    quality={85}
                  />
                </button>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredImages.length > 0 && (
              <nav
                aria-label="Điều hướng trang thư viện ảnh"
                className="mt-8 flex items-center justify-center gap-2"
              >
                {/* Previous Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  aria-label="Trang trước"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="hidden sm:inline">← Trước</span>
                  <span className="sm:hidden">←</span>
                </button>

                {/* Page Numbers - Desktop only */}
                <div className="hidden md:flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1);

                    const showEllipsis =
                      (page === currentPage - 2 && currentPage > 3) ||
                      (page === currentPage + 2 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return (
                        <span key={page} className="px-2 text-gray-400">
                          ...
                        </span>
                      );
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        aria-label={`Trang ${page}`}
                        aria-current={page === currentPage ? 'page' : undefined}
                        className={`min-w-[40px] px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          page === currentPage
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                {/* Page indicator - Mobile only */}
                <div className="md:hidden px-4 py-2 text-sm text-gray-600">
                  Trang {currentPage} / {totalPages}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  aria-label="Trang sau"
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span className="hidden sm:inline">Sau →</span>
                  <span className="sm:hidden">→</span>
                </button>
              </nav>
            )}

            {/* Empty state */}
            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Không có ảnh nào trong danh mục này</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          image={lightboxImage}
          onClose={() => setLightboxImage(null)}
          onNext={hasNext ? handleNext : undefined}
          onPrevious={hasPrevious ? handlePrevious : undefined}
          hasNext={!!hasNext}
          hasPrevious={!!hasPrevious}
        />
      )}
    </div>
  );
}
