'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UpdateStatus {
  isUpdating: boolean;
  lastUpdate: string | null;
  lastResults: Record<string, unknown> | null;
}

export default function AdminPage() {
  const [status, setStatus] = useState<UpdateStatus>({
    isUpdating: false,
    lastUpdate: null,
    lastResults: null
  });
  const [updateLog, setUpdateLog] = useState<string[]>([]);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000); // 5초마다 상태 확인
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const response = await fetch('/api/update-benefits');
      const data = await response.json();
      if (data.success) {
        setStatus(data.data);
      }
    } catch (error) {
      console.error('상태 조회 실패:', error);
    }
  };

  const startUpdate = async () => {
    setUpdateLog(prev => [...prev, `${new Date().toLocaleString()} - 업데이트 시작...`]);
    
    try {
      const response = await fetch('/api/update-benefits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setUpdateLog(prev => [...prev, `${new Date().toLocaleString()} - ✅ ${data.message}`]);
        fetchStatus(); // 상태 새로고침
      } else {
        setUpdateLog(prev => [...prev, `${new Date().toLocaleString()} - ❌ ${data.error}`]);
      }
    } catch (error) {
      setUpdateLog(prev => [...prev, `${new Date().toLocaleString()} - ❌ 네트워크 오류`]);
    }
  };

  const clearLog = () => {
    setUpdateLog([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🔧 관리자 대시보드
          </h1>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            ← 메인으로 돌아가기
          </Link>
        </div>

        {/* 상태 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">업데이트 상태</h3>
            <div className={`text-2xl font-bold ${status.isUpdating ? 'text-orange-500' : 'text-green-500'}`}>
              {status.isUpdating ? '🔄 진행 중' : '✅ 대기 중'}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">마지막 업데이트</h3>
            <div className="text-sm text-gray-600">
              {status.lastUpdate 
                ? new Date(status.lastUpdate).toLocaleString()
                : '업데이트 기록 없음'
              }
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">새 혜택 수</h3>
            <div className="text-2xl font-bold text-blue-600">
              {status.lastResults?.uniqueNew || 0}개
            </div>
          </div>
        </div>

        {/* 업데이트 컨트롤 */}
        <div className="bg-white rounded-lg p-6 shadow mb-8">
          <h2 className="text-xl font-semibold mb-4">실시간 혜택 업데이트</h2>
          <div className="flex gap-4">
            <button
              onClick={startUpdate}
              disabled={status.isUpdating}
              className={`px-6 py-3 rounded-lg font-semibold ${
                status.isUpdating
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {status.isUpdating ? '업데이트 중...' : '🚀 업데이트 시작'}
            </button>
            
            <button
              onClick={fetchStatus}
              className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              📊 상태 새로고침
            </button>
          </div>

          <div className="mt-4 p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h4 className="font-semibold text-yellow-800">작동 방식:</h4>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>1. 정부 기관 RSS 및 웹사이트에서 최신 공지사항 수집</li>
              <li>2. ChatGPT가 수집된 데이터에서 실제 혜택 정보 추출</li>
              <li>3. 기존 혜택과 중복 제거 후 새로운 혜택만 추가</li>
              <li>4. 품질 점수 기반으로 신뢰도 높은 정보만 선별</li>
            </ul>
          </div>
        </div>

        {/* 최근 결과 */}
        {status.lastResults && (
          <div className="bg-white rounded-lg p-6 shadow mb-8">
            <h2 className="text-xl font-semibold mb-4">최근 업데이트 결과</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">📊 통계</h3>
                <ul className="space-y-1 text-sm">
                  <li>수집된 공지: {status.lastResults.totalScraped}개</li>
                  <li>추출된 혜택: {status.lastResults.totalExtracted}개</li>
                  <li>고품질 혜택: {status.lastResults.highQuality}개</li>
                  <li>신규 추가: {status.lastResults.uniqueNew}개</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">📂 카테고리별</h3>
                <ul className="space-y-1 text-sm">
                  {Object.entries(status.lastResults.categories || {}).map(([category, count]) => (
                    <li key={category}>{category}: {count as number}개</li>
                  ))}
                </ul>
              </div>
            </div>

            {status.lastResults.benefits && status.lastResults.benefits.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold mb-2">🆕 새로 발견된 혜택 (미리보기)</h3>
                <div className="space-y-2">
                  {status.lastResults.benefits.slice(0, 5).map((benefit: Record<string, unknown>, index: number) => (
                    <div key={index} className="p-3 bg-gray-50 rounded border-l-4 border-green-400">
                      <div className="font-medium">{benefit.title}</div>
                      <div className="text-sm text-gray-600">{benefit.agency} - {benefit.category}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 업데이트 로그 */}
        <div className="bg-white rounded-lg p-6 shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">📝 업데이트 로그</h2>
            <button
              onClick={clearLog}
              className="text-sm text-red-600 hover:text-red-700"
            >
              로그 지우기
            </button>
          </div>
          
          <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm max-h-96 overflow-y-auto">
            {updateLog.length === 0 ? (
              <div className="text-gray-500">로그가 없습니다.</div>
            ) : (
              updateLog.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}