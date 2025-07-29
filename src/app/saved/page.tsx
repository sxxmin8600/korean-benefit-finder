'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SavedBenefit {
  id: number;
  title: string;
  category: string;
  description: string;
  savedAt: string;
}

export default function SavedPage() {
  const [savedBenefits, setSavedBenefits] = useState<SavedBenefit[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('savedBenefits');
    if (saved) {
      setSavedBenefits(JSON.parse(saved));
    }
  }, []);

  const removeSaved = (id: number) => {
    const updated = savedBenefits.filter(b => b.id !== id);
    setSavedBenefits(updated);
    localStorage.setItem('savedBenefits', JSON.stringify(updated));
  };

  const clearAll = () => {
    setSavedBenefits([]);
    localStorage.removeItem('savedBenefits');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
            <div className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </div>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            📚 저장된 혜택
          </h1>
          <p className="text-gray-600">
            나중에 확인하고 싶은 혜택들을 저장해두셨습니다
          </p>
        </div>

        {savedBenefits.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              저장된 혜택이 없습니다
            </h2>
            <p className="text-gray-600 mb-6">
              관심 있는 혜택을 저장하여 나중에 쉽게 찾아보세요
            </p>
            <Link 
              href="/form"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              혜택 찾기 시작하기
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm flex justify-between items-center">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  총 {savedBenefits.length}개의 혜택이 저장되어 있습니다
                </h2>
              </div>
              <button
                onClick={clearAll}
                className="text-red-600 hover:text-red-700 font-medium"
              >
                전체 삭제
              </button>
            </div>

            {savedBenefits.map((benefit) => (
              <div key={benefit.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full">
                        {benefit.category}
                      </span>
                      <span>저장일: {new Date(benefit.savedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeSaved(benefit.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}