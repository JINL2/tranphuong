# Books Page Implementation Guide

## Overview
The `/sach` page now reads book data from `content/books/books.json` and displays book cover images from `public/books/covers/`.

## Files Modified

### 1. `/app/sach/page.tsx`
**Changes:**
- Imported Next.js `Image` component for optimized image loading
- Imported book data from `@/content/books/books.json`
- Added TypeScript type safety with `Book` interface
- Updated book cover section to use `<Image>` component with actual images
- Changed `book.description` to `book.excerpt` to match JSON schema
- Updated "Đọc thêm" button to link to `/sach/{book.slug}`

**Code:**
```tsx
import Image from 'next/image';
import booksData from '@/content/books/books.json';
import type { Book } from '@/types/book';

export default function BooksPage() {
  const books = booksData as Book[];
  // ... renders books from JSON data
}
```

### 2. `/types/book.ts` (Created)
**Purpose:** TypeScript interface for type safety

**Interface:**
```typescript
export interface Book {
  id: number;
  title: string;
  slug: string;
  author: string;
  year: number;
  coverImage: string;
  quote: string;
  excerpt: string;
  isbn?: string;
  category: string;
}
```

## How to Add New Books

### Step 1: Add Book Cover Image
Place book cover image (JPG/PNG) in:
```
public/books/covers/your-book-slug.jpg
```

**Recommended specs:**
- Size: 240px × 360px (2:3 ratio)
- Format: JPG or PNG
- Max size: 500KB

### Step 2: Update books.json
Edit `content/books/books.json` and add new entry:

```json
{
  "id": 6,
  "title": "Tên Sách Mới",
  "slug": "ten-sach-moi",
  "author": "Tên Tác Giả",
  "year": 2025,
  "coverImage": "/books/covers/ten-sach-moi.jpg",
  "quote": "Trích dẫn nổi bật từ sách",
  "excerpt": "Mô tả ngắn gọn nội dung sách",
  "isbn": "978-0-123456-78-9",
  "category": "Danh mục"
}
```

### Step 3: Create Detailed Content (Optional)
Create folder and content file:
```
content/books/ten-sach-moi/
└── content.md
```

### Step 4: Restart Dev Server
```bash
npm run dev
```

The new book will automatically appear on the `/sach` page!

## Image Optimization

Next.js `Image` component automatically:
- Lazy loads images (only when visible)
- Optimizes image format (WebP when supported)
- Provides responsive sizing
- Prevents layout shift with proper dimensions

## TypeScript Support

The `Book` interface ensures:
- Auto-completion in IDE
- Type checking at compile time
- Better error detection
- Self-documenting code

## Future Enhancements

### Individual Book Pages
Create dynamic route at `/app/sach/[slug]/page.tsx` to show detailed content from `content/books/{slug}/content.md`

### Filtering & Search
Add category filters and search functionality

### Pagination
Split books into pages if list grows large

### Metadata
Add SEO metadata for each book page
