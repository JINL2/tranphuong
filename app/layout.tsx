import type { Metadata } from "next";
import { Geist, Geist_Mono, Noto_Serif } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import ConditionalFooter from "@/components/layout/ConditionalFooter";
import ConditionalMain from "@/components/layout/ConditionalMain";
import GlobalAddTributeForm from "@/components/tribute/GlobalAddTributeForm";
import ScrollToTop from "@/components/common/ScrollToTop";
import { QueryProvider } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSerif = Noto_Serif({
  variable: "--font-serif",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Di sản - GS. Trần Phương",
  description: "Trang web tưởng nhớ và lưu giữ di sản của GS. Trần Phương - Nhà giáo, Chiến sĩ cách mạng, Nhà khoa học, Nhà quản lý",
  openGraph: {
    title: "Di sản - GS. Trần Phương",
    description: "Trang web tưởng nhớ và lưu giữ di sản của GS. Trần Phương",
    url: "https://tranphuong.life",
    siteName: "Di sản - GS. Trần Phương",
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Di sản - GS. Trần Phương",
    description: "Trang web tưởng nhớ và lưu giữ di sản của GS. Trần Phương",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSerif.variable} antialiased`}
      >
        <QueryProvider>
          <Navigation />
          <ConditionalMain>
            {children}
          </ConditionalMain>
          <ConditionalFooter />
          {/* Global form accessible from any page via #add-tribute */}
          <GlobalAddTributeForm />
          {/* Scroll to top button - appears after 400px scroll */}
          <ScrollToTop />
        </QueryProvider>
      </body>
    </html>
  );
}
