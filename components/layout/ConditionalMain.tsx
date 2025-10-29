'use client';

import { usePathname } from 'next/navigation';

export default function ConditionalMain({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Chat pages need fixed height layout
  const isChatPage = pathname?.startsWith('/sach/');

  if (isChatPage) {
    // Fixed height for chat pages - fills viewport minus navigation (80px)
    return (
      <main className="chat-page-main">
        {children}
      </main>
    );
  }

  // Regular pages get flexible height
  return (
    <main className="min-h-screen pt-20">
      {children}
    </main>
  );
}
