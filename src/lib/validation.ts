// 입력 데이터 검증 및 sanitization 유틸리티

interface FormDataInput {
  age: string;
  region: string;
  education: string;
  income: string;
  maritalStatus: string;
  hasChildren: string;
  supportParents: string;
  interests: string[];
}

// 허용된 값들 정의
const ALLOWED_VALUES = {
  age: ['10대', '20대', '30대', '40대', '50대', '60대 이상'],
  region: ['서울', '경기', '인천', '부산', '대구', '광주', '대전', '울산', '세종', '강원', '충북', '충남', '전북', '전남', '경북', '경남', '제주'],
  education: ['고등학교 졸업', '대학교 재학', '대학교 졸업', '대학원 재학', '대학원 졸업'],
  income: ['중위소득 50% 이하', '중위소득 80% 이하', '중위소득 100% 이하', '중위소득 120% 이하', '중위소득 150% 이하', '중위소득 150% 초과'],
  maritalStatus: ['미혼', '기혼', '이혼', '사별'],
  hasChildren: ['있음', '없음'],
  supportParents: ['있음', '없음'],
  interests: ['주거 지원', '교육/취업', '창업/금융', '복지/의료', '문화/여가', '농업/환경']
};

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// 문자열 sanitization
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    throw new ValidationError('입력값이 문자열이 아닙니다');
  }
  
  return input
    .trim()
    .replace(/[<>\"'&]/g, '') // XSS 방지를 위한 위험한 문자 제거
    .substring(0, 100); // 길이 제한
}

// 배열 sanitization
export function sanitizeArray(input: unknown): string[] {
  if (!Array.isArray(input)) {
    throw new ValidationError('입력값이 배열이 아닙니다');
  }
  
  return input
    .filter(item => typeof item === 'string')
    .map(item => sanitizeString(item))
    .slice(0, 10); // 최대 10개로 제한
}

// 폼 데이터 검증
export function validateFormData(data: unknown): FormDataInput {
  if (!data || typeof data !== 'object') {
    throw new ValidationError('유효하지 않은 데이터 형식입니다');
  }

  const input = data as Record<string, unknown>;

  // 필수 필드 검증
  const requiredFields = ['age', 'region', 'education', 'income', 'maritalStatus', 'hasChildren', 'supportParents'];
  for (const field of requiredFields) {
    if (!input[field] || typeof input[field] !== 'string') {
      throw new ValidationError(`${field} 필드가 누락되었거나 유효하지 않습니다`, field);
    }
  }

  // interests 배열 검증
  if (!input.interests || !Array.isArray(input.interests)) {
    throw new ValidationError('관심사 필드가 누락되었거나 유효하지 않습니다', 'interests');
  }

  // 각 필드별 값 검증
  const validatedData: FormDataInput = {
    age: sanitizeString(input.age as string),
    region: sanitizeString(input.region as string),
    education: sanitizeString(input.education as string),
    income: sanitizeString(input.income as string),
    maritalStatus: sanitizeString(input.maritalStatus as string),
    hasChildren: sanitizeString(input.hasChildren as string),
    supportParents: sanitizeString(input.supportParents as string),
    interests: sanitizeArray(input.interests)
  };

  // 허용된 값인지 검증
  for (const [field, value] of Object.entries(validatedData)) {
    if (field === 'interests') {
      const interests = value as string[];
      for (const interest of interests) {
        if (!ALLOWED_VALUES.interests.includes(interest)) {
          throw new ValidationError(`유효하지 않은 관심사입니다: ${interest}`, field);
        }
      }
    } else {
      const allowedValues = ALLOWED_VALUES[field as keyof typeof ALLOWED_VALUES];
      if (allowedValues && !allowedValues.includes(value as string)) {
        throw new ValidationError(`유효하지 않은 ${field} 값입니다: ${value}`, field);
      }
    }
  }

  return validatedData;
}

// Rate limiting을 위한 간단한 메모리 기반 저장소
const requestCounts = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(identifier: string, maxRequests = 5, windowMs = 60000): boolean {
  const now = Date.now();
  const record = requestCounts.get(identifier);

  if (!record || now - record.lastReset > windowMs) {
    // 새로운 윈도우 시작
    requestCounts.set(identifier, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= maxRequests) {
    return false; // Rate limit 초과
  }

  record.count++;
  return true;
}

// 보안 헤더 설정
export function setSecurityHeaders(response: Response): Response {
  const headers = new Headers(response.headers);
  
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-XSS-Protection', '1; mode=block');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';");
  
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}