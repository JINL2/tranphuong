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
