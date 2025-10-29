'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ChevronRight } from 'lucide-react';
import booksData from '@/content/books/books.json';

export default function Home() {
  return (
    <div className="bg-white relative z-0">
      {/* Hero Container - Profile + quotation block */}
      <div className="min-h-screen flex flex-col items-center justify-start px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pb-16 md:pb-20">
        <div className="space-y-6 w-full max-w-[1000px]">

          {/* Profile Section - Avatar + Name/Dates/Roles */}
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex-shrink-0">
              <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px] rounded-xl overflow-hidden relative">
                <Image
                  src="/new ava.jpg"
                  alt="GS. Trần Phương"
                  fill
                  className="object-cover object-center"
                  priority
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
                />
              </div>
            </div>

            {/* Profile Info - Centered */}
            <div className="flex flex-col items-center text-center w-full">
              <h1 className="hero-name mb-3">
                GS. Trần Phương
              </h1>

              <div className="hero-dates mb-4" aria-label="Birth and death years">
                1/11/1927 - 18/10/2025
              </div>

              <div className="hero-roles">
                <span>Nhà giáo</span>
                <span className="mx-1">•</span>
                <span>Chiến{'\u00A0'}sĩ{'\u00A0'}cách{'\u00A0'}mạng</span>
                <span className="mx-1">•</span>
                <br className="sm:hidden" />
                <span>Nhà{'\u00A0'}khoa{'\u00A0'}học</span>
                <span className="mx-1">•</span>
                <span>Nhà{'\u00A0'}quản{'\u00A0'}lý</span>
              </div>
            </div>
          </div>

          {/* Quotation Section - CENTERED with decorative quote mark */}
          <div className="w-full max-w-[1000px] mx-auto py-2">
            <blockquote className="quote-wrapper text-center relative">
              <p className="quotation-text">
                Tôi muốn kể về một thời kỳ lịch sử mà tôi là tác nhân và cũng là nhân chứng, với những cảm nhận, suy nghĩ và tình cảm của mình, để con cháu hiểu được cách đây 100 năm, cha ông họ đã sống như thế nào, đã suy nghĩ và hành động như thế nào để tạo lập ra cái hiện tại mà ngày nay họ đang thừa hưởng...
              </p>
            </blockquote>
          </div>

          {/* Books Grid - Integrated into Profile Section */}
          <div className="w-full max-w-[1000px] mx-auto pt-4 pb-12">
            {/* Section Title with Subtitle */}
            <div className="flex flex-col items-center sm:flex-row sm:items-baseline sm:justify-start gap-2 sm:gap-4 mb-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center sm:text-left">Chat cùng ông</h2>
              <p className="hero-roles text-center sm:text-left">Đặt câu hỏi để hiểu về ông - Với sự hỗ trợ của AI.</p>
            </div>

            <div className="books-container">
              <ul className="books-grid" aria-label="Published books">
                {booksData.map((book) => (
                  <li key={book.id}>
                    <div className="book-item-wrapper">
                      <Link href={`/sach#book-${book.id}`} className="book-cover-link block">
                        <div className="book-cover relative">
                          <Image
                            src={book.coverImage}
                            alt={book.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 160px, 180px"
                          />
                        </div>
                      </Link>
                      <Link
                        href={`/sach/${book.id}`}
                        className="inline-flex items-center justify-center gap-2 mt-3 px-4 py-2 border text-sm font-medium rounded-lg hover:scale-105 transition-all duration-200 w-full"
                        style={{ borderColor: 'var(--primary)', color: 'var(--primary)', backgroundColor: 'transparent' }}
                      >
                        <MessageCircle className="w-4 h-4" strokeWidth={2} />
                        Chat
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white flex items-start justify-center px-6 sm:px-8 lg:px-12">
        <div className="w-full max-w-[1000px] mx-auto -mt-8 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-20">

          {/* Main Content */}
          <div className="pb-16 space-y-16 lg:space-y-20">

          {/* About Section - Giới Thiệu - Grid Gallery Layout */}
          <section className="border-t border-gray-200 pt-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-left max-sm:text-center">Ông là ai?</h2>

            {/* Grid Gallery Integration - Mosaic Layout */}
            <div className="biography-grid">

              {/* Row 1: Young Photo (left) + Paragraph 1 (right) */}
              <div className="bio-photo-container bio-photo-young">
                <div className="bio-photo-wrapper">
                  <Image
                    src="/young.jpg"
                    alt="GS. Trần Phương thời thanh niên"
                    width={150}
                    height={210}
                    className="bio-photo"
                    style={{ objectPosition: 'center 30%' }}
                  />
                </div>
              </div>

              <div className="bio-text-block bio-text-1">
                <p className="text-gray-700 leading-relaxed">
                  GS. Trần Phương, tên thật Vũ Văn Dung, là con một nhà nho nghèo ở làng Xuân Đào, Hưng Yên. Từ năm 17 tuổi, ông đã tham gia phong trào cách mạng và cống hiến trong cả hai cuộc kháng chiến chống Pháp và Mỹ. Sau hòa bình, ông dành trọn tâm huyết cho nghiên cứu kinh tế và quản lý nhà nước, từng giữ nhiều trọng trách quan trọng trước khi trở thành Phó Chủ tịch Hội đồng Bộ trưởng (nay là Phó Thủ tướng Chính phủ).
                </p>
              </div>

              {/* Row 2: Paragraphs 2 & 3 with Old Photo floated right */}
              <div className="bio-text-block bio-text-2">
                <div className="bio-photo-container bio-photo-old bio-photo-float-right">
                  <div className="bio-photo-wrapper">
                    <Image
                      src="/z5122159191005_9ac4cbd3be47ebe7c02ef64dbbee2b08-1536x1021.jpg"
                      alt="GS. Trần Phương tuổi già"
                      width={170}
                      height={360}
                      className="bio-photo"
                      style={{ objectPosition: 'left center' }}
                    />
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Sau khi nghỉ hưu, ông tiếp tục cống hiến cho giáo dục bằng việc sáng lập và trực tiếp làm Hiệu trưởng Trường Đại học Kinh doanh và Công nghệ Hà Nội – đại học tư thục phi lợi nhuận đầu tiên tại Việt Nam. Từ ngôi trường này, hàng vạn sinh viên đã được đào tạo, trở thành nguồn lao động chất lượng cao cho xã hội.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Với hơn 40 năm giảng dạy và nhiều năm quản lý, ông để lại dấu ấn sâu đậm trong lòng học trò và giới học thuật. Những công trình của ông không chỉ có giá trị lý luận mà còn đậm tính nhân văn và thực tiễn. Suốt 99 năm cuộc đời, ông là biểu tượng của trí tuệ, đạo đức và tinh thần phụng sự Tổ quốc.
                </p>
              </div>
            </div>

            {/* Link - Left Aligned */}
            <div className="pt-6">
              <Link
                href="/tieu-su"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Xem tiểu sử đầy đủ
                <ChevronRight className="w-4 h-4" strokeWidth={2} />
              </Link>
            </div>
          </section>

          {/* Note: Legacy & Writings Section (Di Sản) - Reserved for future content */}
        </div>
      </div>
      </div>
    </div>
  );
}
