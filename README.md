# Trang Web Tưởng Niệm / Memorial Website

Trang web tưởng nhớ và lưu giữ di sản của một người vĩ đại, được xây dựng với Next.js 14, TypeScript, và Tailwind CSS.

## 🎯 Tính năng

### Đã hoàn thành
- ✅ Thiết kế responsive, hiện đại (lấy cảm hứng từ ynharari.com)
- ✅ Hệ thống màu sắc và typography chuyên nghiệp
- ✅ Navigation và Footer component
- ✅ Trang chủ với hero section, giới thiệu, và CTA
- ✅ Cấu trúc dự án chuẩn Next.js 14

### Đang phát triển
- 🔄 Trang tiểu sử với timeline
- 🔄 Thư viện sách với PDF viewer
- 🔄 Nguồn tham khảo
- 🔄 Thư viện ảnh với lightbox
- 🔄 Chat AI với RAG (Retrieval-Augmented Generation)
- 🔄 Tích hợp Supabase backend

## 🚀 Công nghệ

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS Variables
- **Database**: Supabase (PostgreSQL + Storage)
- **AI**: OpenAI GPT-4o / Anthropic Claude 3.5 Sonnet
- **Deployment**: Vercel

## 📁 Cấu trúc thư mục

```
memorial-website/
├── app/                      # Next.js App Router
│   ├── (routes)/
│   │   ├── page.tsx         # Trang chủ
│   │   ├── tieu-su/         # Tiểu sử
│   │   ├── sach/            # Thư viện sách
│   │   ├── nguon-tham-khao/ # Nguồn tham khảo
│   │   ├── thu-vien-anh/    # Thư viện ảnh
│   │   └── tro-chuyen/      # Chat AI
│   ├── api/                 # API Routes
│   │   ├── chat/            # LLM endpoint
│   │   └── embeddings/      # RAG processing
│   ├── layout.tsx           # Root layout
│   └── globals.css          # Global styles
├── components/
│   ├── ui/                  # Design system components
│   ├── layout/              # Navigation, Footer
│   └── features/            # Domain-specific components
├── lib/
│   ├── supabase/           # Database client
│   ├── llm/                # OpenAI/Anthropic integration
│   └── rag/                # Vector search
└── public/                 # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: `#011e35` - Deep blue (text, headers)
- **Accent**: `#fe5d2c` - Orange (CTAs, links)
- **Muted**: `#f8f8f8` - Light gray (backgrounds)
- **Divider**: `#dcdcdc` - Border/divider

### Typography
- **Small**: 13px
- **Base**: 16px
- **Medium**: 20px
- **Large**: 36px

## 🛠️ Cài đặt và chạy

### Prerequisites
- Node.js 18+
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
```

### Chạy development server
```bash
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000) để xem kết quả.

### Build production
```bash
npm run build
npm start
```

## 🔐 Environment Variables

Tạo file `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (hoặc Anthropic)
OPENAI_API_KEY=your_openai_key
# ANTHROPIC_API_KEY=your_anthropic_key
```

## 📊 Database Schema (Supabase)

```sql
-- Biography sections
CREATE TABLE biography (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_title TEXT NOT NULL,
  content TEXT,
  order_index INTEGER,
  image_url TEXT,
  date_range TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Books
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  cover_url TEXT,
  publication_year INTEGER,
  pdf_url TEXT,
  chapters JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('article', 'video', 'interview', 'book')),
  url TEXT,
  thumbnail TEXT,
  description TEXT,
  date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  caption TEXT,
  category TEXT,
  date_taken DATE,
  location TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embeddings for RAG
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  embedding vector(1536),
  source_type TEXT,
  source_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create index for vector similarity search
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops);
```

## 🤖 LLM Integration

### RAG Architecture
1. **Data Preparation**: Nội dung từ tiểu sử, sách, nguồn tham khảo được embedding
2. **Vector Storage**: Lưu trong Supabase với pgvector
3. **Query Processing**:
   - User question → Embedding
   - Vector similarity search
   - Retrieve top-k relevant contexts
4. **LLM Generation**: Context + Question → Vietnamese answer

### Example API Call
```typescript
POST /api/chat
{
  "message": "Ông sinh năm nào và ở đâu?",
  "conversation_id": "uuid"
}

Response:
{
  "response": "Ông sinh năm 19XX tại...",
  "sources": [
    { "type": "biography", "id": "uuid", "excerpt": "..." }
  ]
}
```

## 🌐 Triển khai (Deployment)

### Vercel
```bash
vercel --prod
```

### Environment Variables
Cấu hình tất cả biến môi trường trong Vercel Dashboard.

## 🔜 Next Steps

1. **Content Management**: Xây dựng admin panel để quản lý nội dung
2. **Internationalization**: Hỗ trợ đa ngôn ngữ (i18n)
3. **Analytics**: Tích hợp Google Analytics hoặc Plausible
4. **SEO**: Optimization cho search engines
5. **Performance**: Image optimization, lazy loading, caching

## 📝 License

Private project - All rights reserved.

---

**Lưu ý**: Đây là template cơ bản. Bạn cần thay thế nội dung placeholder bằng thông tin thực tế về người được tưởng niệm.
