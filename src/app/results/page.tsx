'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface FormData {
  age: string;
  region: string;
  education: string;
  income: string;
  maritalStatus: string;
  hasChildren: string;
  supportParents: string;
  interests: string[];
}

interface BenefitItem {
  id: number;
  title: string;
  category: string;
  description: string;
  difficulty: '쉬움' | '보통' | '어려움';
  benefit: '높음' | '중간' | '낮음';
  agency: string;
  eligibility: string;
  documents: string[];
  applyUrl: string;
  aiReason?: string;
}

export default function ResultsPage() {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [benefits, setBenefits] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedBenefits, setSavedBenefits] = useState<number[]>([]);

  useEffect(() => {
    const savedData = sessionStorage.getItem('benefitFormData');
    if (savedData) {
      const data = JSON.parse(savedData) as FormData;
      setFormData(data);
      analyzeWithAI(data);
    } else {
      setLoading(false);
    }

    // 저장된 혜택 목록 로드
    const saved = localStorage.getItem('savedBenefits');
    if (saved) {
      const savedList = JSON.parse(saved);
      setSavedBenefits(savedList.map((item: any) => item.id));
    }
  }, []);

  const analyzeWithAI = async (data: FormData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setBenefits(result.data.benefits);
      } else {
        setError(result.error || 'AI 분석 중 오류가 발생했습니다.');
      }
    } catch (err) {
      console.error('API 호출 실패:', err);
      setError('서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const toggleSaveBenefit = (benefit: BenefitItem) => {
    const saved = localStorage.getItem('savedBenefits');
    let savedList = saved ? JSON.parse(saved) : [];
    
    const isAlreadySaved = savedBenefits.includes(benefit.id);
    
    if (isAlreadySaved) {
      // 제거
      savedList = savedList.filter((item: any) => item.id !== benefit.id);
      setSavedBenefits(prev => prev.filter(id => id !== benefit.id));
    } else {
      // 추가
      const benefitToSave = {
        id: benefit.id,
        title: benefit.title,
        category: benefit.category,
        description: benefit.description,
        savedAt: new Date().toISOString()
      };
      savedList.push(benefitToSave);
      setSavedBenefits(prev => [...prev, benefit.id]);
    }
    
    localStorage.setItem('savedBenefits', JSON.stringify(savedList));
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case '쉬움': return 'text-green-600 bg-green-100';
      case '보통': return 'text-yellow-600 bg-yellow-100';
      case '어려움': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBenefitColor = (benefit: string) => {
    switch (benefit) {
      case '높음': return 'text-blue-600 bg-blue-100';
      case '중간': return 'text-purple-600 bg-purple-100';
      case '낮음': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">입력 정보를 찾을 수 없습니다</h2>
          <Link href="/form" className="text-blue-600 hover:underline">
            다시 입력하러 가기
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">🤖 AI가 맞춤 혜택을 분석 중...</h2>
          <p className="text-gray-600">정부/기업 서비스를 찾고 우선순위를 매기고 있습니다</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">오류가 발생했습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Link 
            href="/form"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            다시 시도하기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로
            </Link>
            <Link href="/saved" className="text-yellow-600 hover:text-yellow-700 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              저장된 혜택 ({savedBenefits.length})
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            맞춤 혜택 추천 결과
          </h1>
          <p className="text-gray-600">
            {formData.age} • {formData.region} • {formData.education} • {formData.income}
          </p>
        </div>

        {benefits.length === 0 ? (
          <div className="bg-white rounded-lg p-8 shadow-sm text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              현재 조건에 맞는 혜택을 찾지 못했습니다
            </h2>
            <p className="text-gray-600 mb-6">
              다른 조건으로 다시 검색해보시거나, 관심 분야를 추가해보세요.
            </p>
            <Link 
              href="/form"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 검색하기
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                🎯 총 {benefits.length}개의 맞춤 혜택을 찾았습니다
              </h2>
              <p className="text-gray-600">
                AI가 분석한 우선순위로 정렬되었습니다. 각 혜택의 추천 이유를 확인해보세요!
              </p>
            </div>

            {benefits.map((benefit, index) => (
              <div key={benefit.id} className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                        #{index + 1}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900">
                        {benefit.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 mb-3">{benefit.description}</p>
                    {benefit.aiReason && (
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 rounded-lg mb-3 border-l-4 border-blue-400">
                        <div className="flex items-start gap-2">
                          <span className="text-blue-600 text-sm">🤖</span>
                          <p className="text-sm text-blue-800 font-medium">
                            <span className="font-semibold">AI 추천 이유:</span> {benefit.aiReason}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex gap-2 mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(benefit.difficulty)}`}>
                        신청 {benefit.difficulty}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getBenefitColor(benefit.benefit)}`}>
                        혜택 {benefit.benefit}
                      </span>
                      <span className="px-3 py-1 rounded-full text-sm font-medium text-indigo-600 bg-indigo-100">
                        {benefit.category}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">신청 기관</h4>
                    <p className="text-gray-600">{benefit.agency}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">신청 자격</h4>
                    <p className="text-gray-600">{benefit.eligibility}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">필요 서류</h4>
                  <div className="flex flex-wrap gap-2">
                    {benefit.documents.map((doc, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <a
                    href={benefit.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    신청하러 가기
                  </a>
                  <button 
                    onClick={() => toggleSaveBenefit(benefit)}
                    className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                      savedBenefits.includes(benefit.id)
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="w-4 h-4" fill={savedBenefits.includes(benefit.id) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    {savedBenefits.includes(benefit.id) ? '저장됨' : '저장하기'}
                  </button>
                </div>
              </div>
            ))}

            <div className="text-center">
              <Link 
                href="/form"
                className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                다른 조건으로 다시 검색
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}