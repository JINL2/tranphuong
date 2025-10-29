import { NextResponse } from 'next/server';
import books from '@/content/books/books.json';

export async function GET() {
  return NextResponse.json(books);
}
