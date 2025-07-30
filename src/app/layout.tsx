import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "맞춤 혜택 찾기 - AI 기반 정부/기업 지원 서비스 추천",
  description: "AI가 개인 정보를 분석하여 최적의 정부 지원금, 기업 혜택, 복지 서비스를 추천해드립니다. 주거, 교육, 취업, 창업, 복지 등 다양한 분야의 맞춤형 혜택을 찾아보세요.",
  keywords: "정부지원금, 혜택찾기, 복지서비스, AI추천, 맞춤혜택, 청년지원, 주거지원, 교육지원, 창업지원",
  authors: [{ name: "맞춤 혜택 찾기" }],
  openGraph: {
    title: "맞춤 혜택 찾기 - AI 기반 정부/기업 지원 서비스 추천",
    description: "AI가 개인 정보를 분석하여 최적의 정부 지원금, 기업 혜택, 복지 서비스를 추천해드립니다.",
    type: "website",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "맞춤 혜택 찾기 - AI 기반 정부/기업 지원 서비스 추천",
    description: "AI가 개인 정보를 분석하여 최적의 정부 지원금, 기업 혜택, 복지 서비스를 추천해드립니다.",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1, maximum-scale=5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
