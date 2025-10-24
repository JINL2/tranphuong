'use client';

import Link from 'next/link';
import Image from 'next/image';
import timelineData from '@/content/timeline/life-journey.json';
import booksData from '@/content/books/books.json';
import AnimatedTimeline from '@/components/timeline/AnimatedTimeline';
import TributeGrid from '@/components/tribute/TributeGrid';

export default function Home() {
  return (
    <div className="bg-white relative z-0">
      {/* Hero Container - Profile + quotation block */}
      <div className="min-h-screen flex flex-col items-center justify-start px-6 sm:px-8 lg:px-12 pt-16 pb-12 sm:pb-16 md:pb-20">
        <div className="space-y-12 max-w-[720px] lg:max-w-none">

          {/* Profile Section - Avatar + Name/Dates/Roles */}
          <div className="flex flex-col items-center gap-6 w-full">
            <div className="flex-shrink-0">
              <div className="w-[200px] h-[200px] sm:w-[240px] sm:h-[240px] lg:w-[280px] lg:h-[280px] rounded-xl overflow-hidden relative">
                <Image
                  src="/Grandpa image copy.JPG"
                  alt="GS. Trần Phương"
                  fill
                  className="object-cover object-[center_20%]"
                  priority
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 240px, 280px"
                  style={{ transform: 'scale(1.02)' }}
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
          <div className="w-full max-w-[90%] sm:max-w-[85%] lg:max-w-[900px] mx-auto px-2 sm:px-4 lg:px-6 py-4">
            <blockquote className="quote-wrapper text-center relative">
              <p className="quotation-text mb-4">
                Đổi mới không phải là một sự kiện, mà là một thái độ sống.
                <br />
                Ai còn dám nghĩ khác, dám làm khác vì cái đúng - người đó vẫn đang đổi mới.
              </p>
              <cite className="quotation-context block text-center mx-auto">
                Ở tuổi 69, sau khi nghỉ hưu, ông sáng lập Trường Đại học Kinh doanh và Công nghệ Hà Nội – đại học tư thục phi lợi nhuận đầu tiên của Việt Nam, đào tạo hàng trăm nghìn lao động chất lượng cao cho xã hội.
                <br className="hidden md:block" />
                <strong className="font-medium">Suốt 99 năm cuộc đời, ông tận hiến trọn vẹn cho Tổ quốc.</strong>
              </cite>
            </blockquote>
          </div>

        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white flex items-start justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12 -mt-8 sm:-mt-12 md:-mt-14 lg:-mt-16 xl:-mt-20">

          {/* Main Content */}
          <div className="pb-16 space-y-16 lg:space-y-20">

          {/* About Section - Giới Thiệu - Grid Gallery Layout */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-12">Về Cuộc Đời</h2>

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
                <p className="text-gray-700 leading-relaxed">
                  Sau khi nghỉ hưu, ông tiếp tục cống hiến cho giáo dục bằng việc sáng lập và trực tiếp làm Hiệu trưởng Trường Đại học Kinh doanh và Công nghệ Hà Nội – đại học tư thục phi lợi nhuận đầu tiên tại Việt Nam. Từ ngôi trường này, hàng vạn sinh viên đã được đào tạo, trở thành nguồn lao động chất lượng cao cho xã hội.
                </p>
                <br />
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Books Section */}
          <section>
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-0">
                Sách
              </h2>
              <Link
                href="/sach"
                className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              >
                Xem thêm
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Books Quotation */}
            <blockquote className="books-quote-wrapper mb-8">
              <p className="books-quotation-text">
                Tôi muốn kể về một thời kỳ lịch sử mà tôi là tác nhân và cũng là nhân chứng, với những cảm nhận, suy nghĩ và tình cảm của mình, để con cháu hiểu được cách đây 100 năm, cha ông họ đã sống như thế nào, đã suy nghĩ và hành động như thế nào để tạo lập ra cái hiện tại mà ngày nay họ đang thừa hưởng...
              </p>
            </blockquote>

            {/* Horizontal Scrolling Books Grid */}
            <div className="books-container">
              <ul className="books-grid" aria-label="Published books">
                {booksData.map((book) => (
                  <li key={book.id}>
                    <Link href={`/sach#book-${book.id}`} className="book-item">
                      <div className="book-cover relative">
                        <Image
                          src={book.coverImage}
                          alt={book.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 160px, 180px"
                        />
                      </div>
                      <h3 className="book-title">{book.title}</h3>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <div className="border-t border-gray-200"></div>

          {/* Life Journey - Hành Trình Cuộc Đời */}
          <section id="hanh-trinh-cuoc-doi">
            <h2 className="text-2xl md:text-3xl font-bold mb-12">Hành Trình Cuộc Đời</h2>
            <AnimatedTimeline data={timelineData} />
          </section>

          {/* TEMPORARILY HIDDEN - Legacy & Writings Section (Di Sản)
              Uncomment this section when ready to add content
          <div className="border-t border-gray-200"></div>

          <section>
            <div className="flex items-center gap-4 sm:gap-6 mb-6 border-b border-gray-200">
              <button className="tab-active text-sm">
                Bài Viết
              </button>
              <Link href="/thu-vien-anh" className="tab-inactive text-sm">
                Hình Ảnh
              </Link>
              <Link href="/sach" className="tab-inactive text-sm">
                Tác Phẩm
              </Link>
            </div>

            <div className="space-y-6">
              {[
                {
                  title: 'Về Giáo Dục Và Tương Lai',
                  excerpt: 'Giáo dục không chỉ là truyền đạt kiến thức, mà còn là việc thắp lên ngọn lửa đam mê học hỏi trong mỗi học trò. Đó là nhiệm vụ cao cả nhất của người thầy.',
                  source: 'Bài viết năm 1985'
                },
                {
                  title: 'Triết Lý Sống Của Một Nhà Giáo',
                  excerpt: 'Nghề giáo là nghề "gõ đầu trẻ" - tưởng đơn giản nhưng thực ra là nghệ thuật tinh tế nhất. Mỗi đầu óc đều khác nhau, mỗi học trò đều cần một cách tiếp cận riêng.',
                  source: 'Hồi ký năm 1998'
                },
                {
                  title: 'Di Sản Văn Hóa Và Trách Nhiệm Thế Hệ',
                  excerpt: 'Thế hệ trẻ không chỉ kế thừa di sản của cha ông mà còn phải phát huy và làm phong phú thêm. Đó là trách nhiệm mà không thể né tránh.',
                  source: 'Bài phát biểu năm 2005'
                },
              ].map((article, idx) => (
                <article key={idx} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <h3 className="font-semibold text-gray-900 mb-3 text-base">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-700 mb-3 leading-relaxed italic">
                    &ldquo;{article.excerpt}&rdquo;
                  </p>
                  <div className="text-xs text-gray-500">
                    {article.source}
                  </div>
                </article>
              ))}
            </div>

            <button className="w-full mt-6 py-3 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Xem thêm di sản
            </button>
          </section>
          END TEMPORARILY HIDDEN SECTION */}
        </div>
      </div>
      </div>

      {/* Section Divider with Extra Padding */}
      <div className="bg-white flex items-start justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="border-t border-gray-200"></div>
        </div>
      </div>

      {/* Tributes Section - New Grid Layout */}
      <TributeGrid />
    </div>
  );
}
