'use client';

import { usePathname } from 'next/navigation';

export default function Footer() {
  const pathname = usePathname();
  const isChatPage = pathname?.startsWith('/sach/');

  return (
    <footer
      className={`bg-muted border-t border-divider ${
        isChatPage
          ? 'hidden md:block md:fixed md:bottom-0 md:left-0 md:right-0 md:z-10'
          : ''
      }`}
    >
      <div className="container mx-auto px-6 py-3">
        <div className="text-center text-xs text-text-secondary leading-tight">
          <p className="font-semibold">GS. Trần Phương (1927 - 2025)</p>
        </div>
      </div>
    </footer>
  );
}
