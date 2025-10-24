# Books Content Folder Structure

This folder contains the detailed content for all books featured on the `/sach` page.

## Folder Organization

```
content/books/
├── README.md (this file)
├── books.json (master list of all books with metadata)
└── [book-slug]/
    ├── content.md (full book description, reviews, excerpts)
    └── metadata.json (title, author, year, ISBN, etc.)

public/books/
└── covers/
    ├── book-1-cover.jpg
    ├── book-2-cover.jpg
    └── ...
```

## Example Book Entry

### File: `content/books/books.json`
```json
[
  {
    "id": "tac-pham-1",
    "title": "Tên Tác Phẩm Đầy Đủ",
    "slug": "tac-pham-1",
    "author": "Tên Tác Giả",
    "year": 2020,
    "coverImage": "/books/covers/tac-pham-1.jpg",
    "quote": "Trích dẫn nổi bật từ tác phẩm",
    "excerpt": "Mô tả ngắn gọn về nội dung",
    "isbn": "978-0-123456-78-9"
  }
]
```

### File: `content/books/tac-pham-1/content.md`
```markdown
# Tên Tác Phẩm Đầy Đủ

## Giới Thiệu
Nội dung giới thiệu chi tiết về cuốn sách...

## Nội Dung Chính
Tóm tắt nội dung chi tiết...

## Đánh Giá
Nhận xét từ độc giả và phê bình...
```

## How to Add a New Book

1. Add book entry to `content/books/books.json`
2. Create folder: `content/books/[book-slug]/`
3. Add detailed content in `content/books/[book-slug]/content.md`
4. Place book cover image in `public/books/covers/[book-slug].jpg`
5. Update `/app/sach/page.tsx` to read from this data
