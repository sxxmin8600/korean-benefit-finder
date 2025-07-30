'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { addToSearchHistory } from '@/lib/searchHistory';

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
  const [filteredBenefits, setFilteredBenefits] = useState<BenefitItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('데이터를 불러오는 중...');
  const [error, setError] = useState<string | null>(null);
  const [savedBenefits, setSavedBenefits] = useState<number[]>([]);
  
  // 필터링 및 정렬 상태
  const [selectedCategory, setSelectedCategory] = useState<string>('전체');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('전체');
  const [sortBy, setSortBy] = useState<string>('추천순');
  const [searchQuery, setSearchQuery] = useState<string>('');

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
      setLoadingMessage('AI가 맞춤형 혜택을 분석중입니다...');

      setLoadingMessage('정부 혜택 데이터베이스를 검색중...');
      
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      setLoadingMessage('결과를 정리하고 있습니다...');

      const result = await response.json();

      if (result.success) {
        setBenefits(result.data.benefits);
        setFilteredBenefits(result.data.benefits);
        
        // 검색 기록에 저장
        addToSearchHistory(data, result.data.benefits.length);
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

  // 필터링 및 정렬 로직
  useEffect(() => {
    let filtered = [...benefits];

    // 카테고리 필터링
    if (selectedCategory !== '전체') {
      filtered = filtered.filter(benefit => benefit.category === selectedCategory);
    }

    // 난이도 필터링
    if (selectedDifficulty !== '전체') {
      filtered = filtered.filter(benefit => benefit.difficulty === selectedDifficulty);
    }

    // 검색 필터링
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(benefit => 
        benefit.title.toLowerCase().includes(query) ||
        benefit.agency.toLowerCase().includes(query) ||
        benefit.description.toLowerCase().includes(query)
      );
    }

    // 정렬
    switch (sortBy) {
      case '추천순':
        // 기본 AI 추천 순서 유지
        break;
      case '혜택 높은순':
        filtered.sort((a, b) => {
          const order = { '높음': 3, '중간': 2, '낮음': 1 };
          return (order[b.benefit] || 0) - (order[a.benefit] || 0);
        });
        break;
      case '난이도 쉬운순':
        filtered.sort((a, b) => {
          const order = { '쉬움': 3, '보통': 2, '어려움': 1 };
          return (order[b.difficulty] || 0) - (order[a.difficulty] || 0);
        });
        break;
      case '가나다순':
        filtered.sort((a, b) => a.title.localeCompare(b.title, 'ko'));
        break;
    }

    setFilteredBenefits(filtered);
  }, [benefits, selectedCategory, selectedDifficulty, sortBy, searchQuery]);

  // 카테고리 목록 추출
  const categories = ['전체', ...Array.from(new Set(benefits.map(b => b.category)))];

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
        <div className="text-center max-w-md mx-auto p-8">
          {/* 개선된 로딩 애니메이션 */}
          <div className="relative mb-8">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl animate-pulse">🤖</div>
            </div>
          </div>
          
          {/* 동적 메시지 */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">AI 분석 진행중</h2>
          <div className="text-blue-600 font-medium mb-4 min-h-[24px]">
            {loadingMessage}
          </div>
          
          {/* 진행 단계 표시 */}
          <div className="flex justify-center space-x-2 mb-6">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
          
          <p className="text-gray-600 text-sm">
            90개의 정부/기업 서비스를 검토하여<br/>
            최적의 혜택을 추천해드립니다
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          {/* 오류 아이콘 */}
          <div className="relative mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="text-3xl text-red-500">⚠️</div>
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-4">분석 중 문제가 발생했습니다</h2>
          
          {/* 오류 메시지 박스 */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
          
          {/* 해결 방법 제안 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">💡 해결 방법</h3>
            <ul className="text-blue-700 text-sm text-left space-y-1">
              <li>• 인터넷 연결을 확인해주세요</li>
              <li>• 잠시 후 다시 시도해보세요</li>
              <li>• 문제가 지속되면 관리자에게 문의하세요</li>
            </ul>
          </div>
          
          {/* 액션 버튼들 */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                if (formData) {
                  analyzeWithAI(formData);
                }
              }}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🔄 다시 시도
            </button>
            <Link 
              href="/form"
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium text-center"
            >
              ← 폼으로 돌아가기
            </Link>
          </div>
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
            {/* 필터링 및 정렬 컨트롤 */}
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  🎯 총 {benefits.length}개 중 {filteredBenefits.length}개의 혜택
                </h2>
                
                {/* 검색바 */}
                <div className="relative w-full lg:w-80">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="혜택명, 기관명으로 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              {/* 필터링 옵션들 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {/* 카테고리 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                {/* 난이도 필터 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">신청 난이도</label>
                  <select
                    value={selectedDifficulty}
                    onChange={(e) => setSelectedDifficulty(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                  >
                    <option value="전체">전체</option>
                    <option value="쉬움">쉬움</option>
                    <option value="보통">보통</option>
                    <option value="어려움">어려움</option>
                  </select>
                </div>
                
                {/* 정렬 옵션 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">정렬 기준</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm text-black"
                  >
                    <option value="추천순">AI 추천순</option>
                    <option value="혜택 높은순">혜택 크기순</option>
                    <option value="난이도 쉬운순">난이도 쉬운순</option>
                    <option value="가나다순">가나다순</option>
                  </select>
                </div>
              </div>
              
              {/* 필터 초기화 버튼 */}
              {(selectedCategory !== '전체' || selectedDifficulty !== '전체' || sortBy !== '추천순' || searchQuery.trim()) && (
                <button
                  onClick={() => {
                    setSelectedCategory('전체');
                    setSelectedDifficulty('전체');
                    setSortBy('추천순');
                    setSearchQuery('');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  🔄 필터 초기화
                </button>
              )}
            </div>
            
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <p className="text-gray-600 text-center">
                AI가 분석한 우선순위로 정렬되었습니다. 각 혜택의 추천 이유를 확인해보세요!
              </p>
            </div>

            {filteredBenefits.length === 0 ? (
              <div className="bg-white rounded-lg p-8 shadow-sm text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  조건에 맞는 혜택이 없습니다
                </h3>
                <p className="text-gray-600 mb-4">
                  다른 필터 조건을 시도하거나 검색어를 바꿔보세요.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('전체');
                    setSelectedDifficulty('전체');
                    setSortBy('추천순');
                    setSearchQuery('');
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  🔄 필터 초기화
                </button>
              </div>
            ) : (
              filteredBenefits.map((benefit, index) => (
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
              ))
            )}

            <div className="text-center space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 더 나은 결과를 원하시나요?
                </h3>
                <p className="text-gray-600 mb-4">
                  조건을 조정하면 더 많은 혜택을 찾을 수 있어요
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button 
                    onClick={() => {
                      // 이전 검색 데이터를 유지하여 수정 가능하도록
                      if (typeof window !== 'undefined') {
                        sessionStorage.setItem('keepFormData', 'true');
                        window.location.href = '/form';
                      }
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    🔄 조건 수정하여 다시 검색
                  </button>
                  <button 
                    onClick={() => {
                      // 완전히 새로운 검색을 위해 데이터 삭제
                      if (typeof window !== 'undefined') {
                        sessionStorage.removeItem('benefitFormData');
                        sessionStorage.removeItem('keepFormData'); // 혹시 남아있을 플래그도 제거
                        window.location.href = '/form';
                      }
                    }}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✨ 새로운 조건으로 검색
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}