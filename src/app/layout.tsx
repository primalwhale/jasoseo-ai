import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "자소서AI - AI 자기소개서 생성기",
  description: "AI가 30초만에 합격 자소서를 작성해드립니다. 회사명과 직무만 입력하면 맞춤형 자기소개서를 무료로 생성합니다.",
  keywords: ["자기소개서", "자소서", "AI", "취업", "이력서", "채용", "자소서 작성"],
  openGraph: {
    title: "자소서AI - AI 자기소개서 생성기",
    description: "AI가 30초만에 합격 자소서를 작성해드립니다.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} font-sans antialiased bg-gray-900 text-white`}>
        <nav className="border-b border-gray-800 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <a href="/" className="text-xl font-bold text-white">
              자소서<span className="text-indigo-500">AI</span>
            </a>
            <span className="text-xs text-gray-500 border border-gray-700 rounded-full px-3 py-1">
              Beta
            </span>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
