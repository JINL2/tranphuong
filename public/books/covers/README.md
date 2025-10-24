# Book Cover Images

Place your book cover images in this folder.

## Image Requirements

- **Format**: JPG or PNG
- **Recommended size**: 240px × 360px (2:3 aspect ratio)
- **Max file size**: 500KB for optimal loading
- **Naming convention**: Use book slug from `content/books/books.json`

## Example Files

```
tac-pham-1.jpg
tac-pham-2.jpg
tac-pham-3.jpg
tac-pham-4.jpg
tac-pham-5.jpg
```

## How to Reference

In your `books.json`, reference images like:
```json
"coverImage": "/books/covers/tac-pham-1.jpg"
```

In Next.js Image component:
```jsx
<Image
  src="/books/covers/tac-pham-1.jpg"
  alt="Tác Phẩm 1"
  width={240}
  height={360}
/>
```
