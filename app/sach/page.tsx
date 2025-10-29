import booksData from '@/content/books/books.json';
import Image from 'next/image';
import Link from 'next/link';

export default function BooksPage() {
  return (
    <div className="bg-background min-h-screen">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Book Sections - 5 identical layouts */}
        {booksData.map((book, index) => (
          <div key={book.id}>
            {/* Book Section */}
            <section id={`book-${book.id}`} className="py-12">
              {/* 2-Column Grid Layout */}
              <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-12">

                {/* Left Column - Book Cover Image */}
                <div className="flex justify-center md:justify-start">
                  <div className="w-[240px] h-[360px] rounded-sm overflow-hidden border border-border relative">
                    <Image
                      src={book.coverImage}
                      alt={book.title}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  </div>
                </div>

                {/* Right Column - Book Content */}
                <div className="space-y-5 md:space-y-8">
                  {/* Book Title - Serif Font */}
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-foreground leading-[1.95] md:leading-tight">
                    {book.title}
                  </h2>

                  {/* Quote - Decorative style matching homepage */}
                  <blockquote className="books-quote-wrapper">
                    <p className="books-quotation-text">
                      {book.quote}
                    </p>
                  </blockquote>

                  {/* Description Paragraph */}
                  <div className="text-base leading-relaxed text-foreground/90 space-y-4 text-justify hyphens-auto">
                    {book.excerpt.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="word-spacing-tight">{paragraph}</p>
                    ))}
                  </div>

                  {/* Read More Button */}
                  <div className="pt-4">
                    <Link
                      href={`/sach/${book.id}`}
                      className="inline-flex items-center justify-center px-8 py-3 border border-primary bg-transparent text-primary font-medium rounded-[var(--radius)] hover:scale-105 transition-all duration-200"
                    >
                      AI Chat để tìm hiểu thêm
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Separator Line - Show for all except last item */}
            {index < booksData.length - 1 && (
              <div className="border-t border-border"></div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
}
