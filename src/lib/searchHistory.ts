// 검색 기록 관리 유틸리티

export interface SearchHistoryItem {
  id: string;
  timestamp: number;
  formData: {
    age: string;
    region: string;
    education: string;
    income: string;
    maritalStatus: string;
    hasChildren: string;
    supportParents: string;
    interests: string[];
  };
  displayName: string; // 사용자가 쉽게 알아볼 수 있는 이름
  resultCount?: number; // 검색 결과 개수
}

const STORAGE_KEY = 'searchHistory';
const MAX_HISTORY_COUNT = 10; // 최대 10개까지 저장

// 검색 기록을 localStorage에서 가져오기
export function getSearchHistory(): SearchHistoryItem[] {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('검색 기록을 불러오는 중 오류:', error);
    return [];
  }
}

// 검색 기록에 새 항목 추가
export function addToSearchHistory(formData: SearchHistoryItem['formData'], resultCount?: number): void {
  try {
    const history = getSearchHistory();
    
    // 표시 이름 생성
    const displayName = generateDisplayName(formData);
    
    // 중복 검사 (같은 조건은 제거하고 최신으로 업데이트)
    const filteredHistory = history.filter(item => 
      JSON.stringify(item.formData) !== JSON.stringify(formData)
    );
    
    // 새 항목 생성
    const newItem: SearchHistoryItem = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      formData,
      displayName,
      resultCount
    };
    
    // 최신 항목을 맨 앞에 추가
    const updatedHistory = [newItem, ...filteredHistory].slice(0, MAX_HISTORY_COUNT);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('검색 기록 저장 중 오류:', error);
  }
}

// 검색 기록에서 특정 항목 삭제
export function removeFromSearchHistory(id: string): void {
  try {
    const history = getSearchHistory();
    const updatedHistory = history.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error('검색 기록 삭제 중 오류:', error);
  }
}

// 모든 검색 기록 삭제
export function clearSearchHistory(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('검색 기록 전체 삭제 중 오류:', error);
  }
}

// 표시 이름 생성 (사용자가 쉽게 알아볼 수 있도록)
function generateDisplayName(formData: SearchHistoryItem['formData']): string {
  const parts = [];
  
  if (formData.age) parts.push(formData.age);
  if (formData.region) parts.push(formData.region);
  if (formData.income) {
    // 소득 수준을 간단히 표시
    if (formData.income.includes('기초생활')) parts.push('기초수급');
    else if (formData.income.includes('차상위')) parts.push('차상위');
    else if (formData.income.includes('50%')) parts.push('저소득');
    else if (formData.income.includes('80%')) parts.push('중저소득');
    else if (formData.income.includes('100%')) parts.push('중간소득');
    else if (formData.income.includes('120%')) parts.push('중상소득');
    else parts.push('고소득');
  }
  
  // 주요 관심사 1-2개만 표시
  if (formData.interests.length > 0) {
    const mainInterests = formData.interests.slice(0, 2).join(', ');
    parts.push(mainInterests);
  }
  
  return parts.join(' • ') || '검색 기록';
}

// 상대적 시간 표시 (예: "2시간 전", "3일 전")
export function getRelativeTimeString(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  
  if (diff < minute) {
    return '방금 전';
  } else if (diff < hour) {
    const minutes = Math.floor(diff / minute);
    return `${minutes}분 전`;
  } else if (diff < day) {
    const hours = Math.floor(diff / hour);
    return `${hours}시간 전`;
  } else if (diff < week) {
    const days = Math.floor(diff / day);
    return `${days}일 전`;
  } else {
    const weeks = Math.floor(diff / week);
    return `${weeks}주 전`;
  }
}