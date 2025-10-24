import { QueryProvider } from "@/app/providers";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <QueryProvider>{children}</QueryProvider>;
}
