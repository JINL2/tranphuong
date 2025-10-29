import Image from 'next/image';
import timelineData from '@/content/timeline/life-journey.json';
import AnimatedTimeline from '@/components/timeline/AnimatedTimeline';

export const metadata = {
  title: 'Tiểu Sử - GS. Trần Phương',
  description: 'Tiểu sử đầy đủ về hành trình cuộc đời của GS. Trần Phương - Nhà giáo, Nhà khoa học, Nhà quản lý, Chiến sĩ cách mạng',
};

export default function TieuSuPage() {
  return (
    <div className="bg-white relative z-0">
      {/* Main Content Container */}
      <div className="bg-white flex items-start justify-center">
        <div className="w-full max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">

          {/* Main Content with Top Padding for Navigation */}
          <div className="pb-16 space-y-16 lg:space-y-20 pt-16">

            {/* About Section - Về Cuộc Đời - Grid Gallery Layout */}
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
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Sau khi nghỉ hưu, ông tiếp tục cống hiến cho giáo dục bằng việc sáng lập và trực tiếp làm Hiệu trưởng Trường Đại học Kinh doanh và Công nghệ Hà Nội – đại học tư thục phi lợi nhuận đầu tiên tại Việt Nam. Từ ngôi trường này, hàng vạn sinh viên đã được đào tạo, trở thành nguồn lao động chất lượng cao cho xã hội.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Với hơn 40 năm giảng dạy và nhiều năm quản lý, ông để lại dấu ấn sâu đậm trong lòng học trò và giới học thuật. Những công trình của ông không chỉ có giá trị lý luận mà còn đậm tính nhân văn và thực tiễn. Suốt 99 năm cuộc đời, ông là biểu tượng của trí tuệ, đạo đức và tinh thần phụng sự Tổ quốc.
                  </p>
                </div>
              </div>
            </section>

            {/* Life Journey - Hành Trình Cuộc Đời */}
            <section id="hanh-trinh-cuoc-doi">
              <h2 className="text-2xl md:text-3xl font-bold mb-12">Hành Trình Cuộc Đời</h2>
              <AnimatedTimeline data={timelineData} />
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
