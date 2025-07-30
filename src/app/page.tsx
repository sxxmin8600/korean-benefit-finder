'use client';

import Link from "next/link";
import { useEffect, useState } from 'react';
import { getSearchHistory, getRelativeTimeString, type SearchHistoryItem } from '@/lib/searchHistory';

export default function Home() {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const history = getSearchHistory().slice(0, 3); // 최근 3개만 표시
    setSearchHistory(history);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            맞춤형 혜택 찾기
          </h1>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
            간단한 정보 입력만으로 당신에게 맞는<br className="hidden sm:block" />
            정부, 기업 지원 서비스를 AI가 찾아드립니다
          </p>
          <Link 
            href="/form"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            🚀 혜택 찾기 시작하기
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">간단한 입력</h3>
            <p className="text-gray-800 leading-relaxed">복잡한 서류 없이 기본 정보만 입력하면 됩니다</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">AI 맞춤 추천</h3>
            <p className="text-gray-800 leading-relaxed">최신 AI가 당신의 상황에 맞는 혜택을 찾아드립니다</p>
          </div>

          <div className="bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-white/20">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-900">우선순위 정렬</h3>
            <p className="text-gray-800 leading-relaxed">신청 난이도와 혜택 크기를 고려한 우선순위 제공</p>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-sm rounded-xl p-10 shadow-xl border border-white/20">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">이런 혜택을 찾을 수 있어요</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                🏠 주거 지원
              </h3>
              <ul className="text-blue-700 space-y-2 font-medium">
                <li>• 청년 전세자금대출</li>
                <li>• LH 행복주택</li>
                <li>• 주택청약저축</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center">
                📚 교육/취업
              </h3>
              <ul className="text-green-700 space-y-2 font-medium">
                <li>• 국가장학금</li>
                <li>• 직업훈련 지원</li>
                <li>• 취업성공패키지</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-indigo-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-purple-800 mb-4 flex items-center">
                💼 창업/금융
              </h3>
              <ul className="text-purple-700 space-y-2 font-medium">
                <li>• 청년창업자금</li>
                <li>• 소상공인 대출</li>
                <li>• 기업 지원사업</li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-red-100 p-6 rounded-lg">
              <h3 className="text-lg font-bold text-orange-800 mb-4 flex items-center">
                ❤️ 복지/의료
              </h3>
              <ul className="text-orange-700 space-y-2 font-medium">
                <li>• 한부모가족 지원</li>
                <li>• 의료비 지원</li>
                <li>• 민생회복지원금</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 최근 검색 기록 섹션 */}
        {searchHistory.length > 0 && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🕒 최근 검색 기록
              </h2>
              <p className="text-gray-600">
                이전 검색 조건으로 빠르게 다시 찾아보세요
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {searchHistory.map((item) => (
                <Link
                  key={item.id}
                  href={`/form?history=${item.id}`}
                  className="bg-white/95 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 text-sm">{item.displayName}</h3>
                    {item.resultCount && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {item.resultCount}개
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mb-3">{getRelativeTimeString(item.timestamp)}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-blue-600 font-medium">다시 검색하기</span>
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-6">
              <Link
                href="/form"
                className="text-blue-600 hover:text-blue-700 transition-colors text-sm font-medium"
              >
                모든 검색 기록 보기 →
              </Link>
            </div>
          </div>
        )}

        <div className="text-center mt-16">
          <Link 
            href="/form"
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-xl text-xl font-bold hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-xl"
          >
            ✨ 지금 바로 시작하기
          </Link>
        </div>
      </div>
    </div>
  );
}
