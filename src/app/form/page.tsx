'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function FormPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    region: '',
    education: '',
    income: '',
    maritalStatus: '',
    hasChildren: '',
    supportParents: '',
    interests: [] as string[]
  });

  const handleInterestChange = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // 폼 데이터를 세션 스토리지에 저장
      sessionStorage.setItem('benefitFormData', JSON.stringify(formData));
      
      // 약간의 지연을 추가하여 로딩 상태를 보여줌
      await new Promise(resolve => setTimeout(resolve, 500));
      
      router.push('/results');
    } catch (error) {
      console.error('폼 제출 오류:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <Link href="/" className="inline-block mb-6">
            <div className="text-gray-700 hover:text-blue-600 transition-colors flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              홈으로 돌아가기
            </div>
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📝 맞춤 혜택 찾기
          </h1>
          <p className="text-xl text-gray-700">
            간단한 정보만 입력하시면 AI가 최적의 혜택을 찾아드립니다
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl p-10 shadow-2xl border border-gray-200 space-y-8">
          {/* 연령대 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              🎂 연령대 <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.age} 
              onChange={(e) => setFormData({...formData, age: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              required
            >
              <option value="" className="text-gray-500">선택해주세요</option>
              <option value="20대" className="text-black">20대</option>
              <option value="30대" className="text-black">30대</option>
              <option value="40대" className="text-black">40대</option>
              <option value="50대" className="text-black">50대</option>
              <option value="60대 이상" className="text-black">60대 이상</option>
            </select>
          </div>

          {/* 거주지역 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              🏠 거주지역 <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.region} 
              onChange={(e) => setFormData({...formData, region: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg text-black focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              required
            >
              <option value="" className="text-gray-500">선택해주세요</option>
              <option value="서울" className="text-black">서울특별시</option>
              <option value="부산" className="text-black">부산광역시</option>
              <option value="대구" className="text-black">대구광역시</option>
              <option value="인천" className="text-black">인천광역시</option>
              <option value="광주" className="text-black">광주광역시</option>
              <option value="대전" className="text-black">대전광역시</option>
              <option value="울산" className="text-black">울산광역시</option>
              <option value="세종" className="text-black">세종특별자치시</option>
              <option value="경기" className="text-black">경기도</option>
              <option value="강원" className="text-black">강원도</option>
              <option value="충북" className="text-black">충청북도</option>
              <option value="충남" className="text-black">충청남도</option>
              <option value="전북" className="text-black">전라북도</option>
              <option value="전남" className="text-black">전라남도</option>
              <option value="경북" className="text-black">경상북도</option>
              <option value="경남" className="text-black">경상남도</option>
              <option value="제주" className="text-black">제주특별자치도</option>
            </select>
          </div>

          {/* 학력 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              🎓 최종학력 <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.education} 
              onChange={(e) => setFormData({...formData, education: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg text-black focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
              required
            >
              <option value="" className="text-gray-500">선택해주세요</option>
              <option value="고등학교 졸업" className="text-black">고등학교 졸업</option>
              <option value="대학교 재학" className="text-black">대학교 재학</option>
              <option value="대학교 졸업" className="text-black">대학교 졸업</option>
              <option value="대학원 재학" className="text-black">대학원 재학</option>
              <option value="대학원 졸업" className="text-black">대학원 졸업</option>
            </select>
          </div>

          {/* 소득수준 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              💰 소득수준 <span className="text-red-500">*</span>
            </label>
            <select 
              value={formData.income} 
              onChange={(e) => setFormData({...formData, income: e.target.value})}
              className="w-full p-4 border-2 border-gray-300 rounded-xl text-lg text-black focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
              required
            >
              <option value="" className="text-gray-500">선택해주세요</option>
              <option value="기초생활수급자" className="text-black">기초생활수급자</option>
              <option value="차상위계층" className="text-black">차상위계층</option>
              <option value="중위소득 50% 이하" className="text-black">중위소득 50% 이하</option>
              <option value="중위소득 80% 이하" className="text-black">중위소득 80% 이하</option>
              <option value="중위소득 100% 이하" className="text-black">중위소득 100% 이하</option>
              <option value="중위소득 120% 이하" className="text-black">중위소득 120% 이하</option>
              <option value="중위소득 120% 초과" className="text-black">중위소득 120% 초과</option>
            </select>
          </div>

          {/* 혼인상태 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              💑 혼인상태
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['미혼', '기혼', '기타'].map((status) => (
                <label key={status} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-pink-300 cursor-pointer">
                  <input
                    type="radio"
                    name="maritalStatus"
                    value={status}
                    checked={formData.maritalStatus === status}
                    onChange={(e) => setFormData({...formData, maritalStatus: e.target.value})}
                    className="mr-2"
                  />
                  <span className="font-medium text-black">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 자녀유무 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              👶 자녀 유무
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['있음', '없음'].map((status) => (
                <label key={status} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-yellow-300 cursor-pointer">
                  <input
                    type="radio"
                    name="hasChildren"
                    value={status}
                    checked={formData.hasChildren === status}
                    onChange={(e) => setFormData({...formData, hasChildren: e.target.value})}
                    className="mr-2"
                  />
                  <span className="font-medium text-black">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 부모부양 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              👨‍👩‍👧‍👦 부모 부양 여부
            </label>
            <div className="grid grid-cols-2 gap-4">
              {['있음', '없음'].map((status) => (
                <label key={status} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-teal-300 cursor-pointer">
                  <input
                    type="radio"
                    name="supportParents"
                    value={status}
                    checked={formData.supportParents === status}
                    onChange={(e) => setFormData({...formData, supportParents: e.target.value})}
                    className="mr-2"
                  />
                  <span className="font-medium text-black">{status}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 관심분야 */}
          <div>
            <label className="block text-lg font-bold text-black mb-4">
              ⭐ 관심 분야 <span className="text-sm font-normal text-gray-600">(복수선택 가능)</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: '주거 지원', icon: '🏠' },
                { name: '교육/취업', icon: '📚' },
                { name: '창업/금융', icon: '💼' },
                { name: '복지/의료', icon: '❤️' },
                { name: '문화/여가', icon: '🎨' },
                { name: '농업/환경', icon: '🌱' }
              ].map((interest) => (
                <label key={interest.name} className="flex items-center p-3 bg-white rounded-lg border-2 border-gray-300 hover:border-indigo-300 cursor-pointer">
                  <input
                    type="checkbox"
                    value={interest.name}
                    checked={formData.interests.includes(interest.name)}
                    onChange={() => handleInterestChange(interest.name)}
                    className="mr-2"
                  />
                  <span className="mr-2">{interest.icon}</span>
                  <span className="font-medium text-black">{interest.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="pt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-6 px-8 rounded-xl text-xl font-bold transition-all duration-200 shadow-xl flex items-center justify-center gap-3 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105'
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  🤖 AI가 분석 중...
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  ✨ AI가 맞춤 혜택 찾기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}