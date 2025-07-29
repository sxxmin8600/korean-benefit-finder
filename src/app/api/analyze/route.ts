import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateFormData, checkRateLimit, setSecurityHeaders, ValidationError } from '@/lib/validation';
import { BenefitMatcher } from '@/lib/benefitDatabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 정부/기업 서비스 데이터베이스 (실제로는 별도 DB에서 가져와야 함)
const benefitDatabase = [
  // 주거 지원
  {
    id: 1,
    title: "청년 전세자금대출",
    category: "주거 지원",
    description: "만 19~34세 청년을 위한 전세자금 대출 지원",
    difficulty: "보통",
    benefit: "높음",
    agency: "한국주택금융공사",
    eligibility: "만 19~34세, 무주택자, 소득 기준 충족",
    documents: ["소득증명서", "전세계약서", "등본"],
    applyUrl: "https://www.hf.go.kr",
    conditions: {
      age: ["20대", "30대"],
      income: ["중위소득 120% 이하", "중위소득 100% 이하", "중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: 2,
    title: "LH 행복주택",
    category: "주거 지원",
    description: "청년, 신혼부부 등을 위한 공공임대주택",
    difficulty: "보통",
    benefit: "높음",
    agency: "한국토지주택공사",
    eligibility: "청년, 신혼부부, 소득 기준 충족",
    documents: ["소득증명서", "주민등록등본", "혼인관계증명서"],
    applyUrl: "https://www.lh.co.kr",
    conditions: {
      age: ["20대", "30대"],
      income: ["중위소득 100% 이하", "중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: 3,
    title: "주택청약종합저축",
    category: "주거 지원", 
    description: "주택 구입을 위한 청약 저축 및 청약 자격 부여",
    difficulty: "쉬움",
    benefit: "중간",
    agency: "국토교통부",
    eligibility: "무주택 세대주, 소득 기준 충족",
    documents: ["소득증명서", "주민등록등본"],
    applyUrl: "https://www.applyhome.co.kr",
    conditions: {
      age: ["20대", "30대", "40대"],
      interests: ["주거 지원"]
    }
  },

  // 교육/취업
  {
    id: 4,
    title: "국가장학금 I유형",
    category: "교육/취업",
    description: "소득분위별 맞춤형 장학금 지원",
    difficulty: "쉬움",
    benefit: "높음",
    agency: "한국장학재단",
    eligibility: "대학재학생, 소득 8분위 이하",
    documents: ["가족관계증명서", "소득증명서"],
    applyUrl: "https://www.kosaf.go.kr",
    conditions: {
      age: ["20대", "30대"],
      education: ["대학교 졸업", "전문대학 졸업"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["교육/취업"]
    }
  },
  {
    id: 5,
    title: "청년내일채움공제",
    category: "교육/취업",
    description: "중소기업 취업 청년을 위한 장기재직 지원금",
    difficulty: "보통",
    benefit: "중간",
    agency: "고용노동부",
    eligibility: "만 15~34세, 중소기업 정규직 취업자",
    documents: ["재직증명서", "통장사본"],
    applyUrl: "https://www.work.go.kr",
    conditions: {
      age: ["20대", "30대"],
      interests: ["교육/취업"]
    }
  },
  {
    id: 6,
    title: "국가근로장학금",
    category: "교육/취업",
    description: "대학생 근로를 통한 학비 지원",
    difficulty: "쉬움",
    benefit: "중간",
    agency: "한국장학재단",
    eligibility: "대학재학생, 소득 8분위 이하",
    documents: ["재학증명서", "소득증명서"],
    applyUrl: "https://www.kosaf.go.kr",
    conditions: {
      age: ["20대"],
      education: ["대학교 졸업", "전문대학 졸업"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["교육/취업"]
    }
  },
  {
    id: 7,
    title: "취업성공패키지",
    category: "교육/취업",
    description: "취업 취약계층 맞춤형 취업지원 서비스",
    difficulty: "보통",
    benefit: "중간",
    agency: "고용노동부",
    eligibility: "저소득층, 중장년층, 청년층",
    documents: ["소득증명서", "구직등록증"],
    applyUrl: "https://www.work.go.kr",
    conditions: {
      age: ["20대", "30대", "40대", "50대"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하"],
      interests: ["교육/취업"]
    }
  },

  // 창업/금융
  {
    id: 8,
    title: "창업지원자금 융자",
    category: "창업/금융", 
    description: "예비창업자 및 창업 초기기업 자금 지원",
    difficulty: "어려움",
    benefit: "높음",
    agency: "중소벤처기업부",
    eligibility: "예비창업자, 창업 7년 미만 기업",
    documents: ["사업계획서", "소득증명서", "신용조회서"],
    applyUrl: "https://www.k-startup.go.kr",
    conditions: {
      age: ["20대", "30대", "40대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: 9,
    title: "청년창업사관학교",
    category: "창업/금융",
    description: "청년 예비창업자 교육 및 자금 지원",
    difficulty: "어려움",
    benefit: "높음",
    agency: "중소벤처기업부",
    eligibility: "만 39세 이하 예비창업자",
    documents: ["사업아이디어서", "소득증명서"],
    applyUrl: "https://www.k-startup.go.kr",
    conditions: {
      age: ["20대", "30대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: 10,
    title: "소상공인 경영안정자금",
    category: "창업/금융",
    description: "소상공인 운영자금 및 시설자금 지원",
    difficulty: "보통",
    benefit: "중간",
    agency: "소상공인시장진흥공단",
    eligibility: "소상공인, 매출액 기준 충족",
    documents: ["사업자등록증", "매출신고서", "소득증명서"],
    applyUrl: "https://www.semas.or.kr",
    conditions: {
      age: ["30대", "40대", "50대"],
      interests: ["창업/금융"]
    }
  },

  // 복지/의료
  {
    id: 11,
    title: "한부모가족 양육비 지원",
    category: "복지/의료",
    description: "한부모가족의 자녀 양육을 위한 생계비 지원",
    difficulty: "쉬움",
    benefit: "높음",
    agency: "여성가족부",
    eligibility: "한부모가족, 소득 기준 충족",
    documents: ["가족관계증명서", "소득증명서", "주민등록등본"],
    applyUrl: "http://www.mogef.go.kr",
    conditions: {
      hasChildren: ["있음"],
      maritalStatus: ["기타"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: 12,
    title: "기초연금",
    category: "복지/의료",
    description: "65세 이상 어르신 기초연금 지급",
    difficulty: "쉬움",
    benefit: "중간",
    agency: "보건복지부",
    eligibility: "65세 이상, 소득 기준 충족",
    documents: ["신분증", "통장사본", "소득증명서"],
    applyUrl: "https://www.mohw.go.kr",
    conditions: {
      age: ["60대 이상"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: 13,
    title: "아동수당",
    category: "복지/의료",
    description: "만 8세 미만 아동에게 지급하는 양육 지원금",
    difficulty: "쉬움",
    benefit: "중간",
    agency: "보건복지부",
    eligibility: "만 8세 미만 아동 양육가정",
    documents: ["가족관계증명서", "주민등록등본"],
    applyUrl: "https://www.mohw.go.kr",
    conditions: {
      hasChildren: ["있음"],
      age: ["20대", "30대", "40대"],
      interests: ["복지/의료"]
    }
  },
  {
    id: 14,
    title: "의료급여",
    category: "복지/의료",
    description: "저소득층 의료비 지원",
    difficulty: "보통",
    benefit: "높음",
    agency: "보건복지부",
    eligibility: "기초생활수급자, 차상위계층",
    documents: ["소득증명서", "의료진단서", "가족관계증명서"],
    applyUrl: "https://www.mohw.go.kr",
    conditions: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["복지/의료"]
    }
  },

  // 문화/여가
  {
    id: 15,
    title: "문화누리카드",
    category: "문화/여가",
    description: "저소득층 문화예술, 여행, 체육활동 지원",
    difficulty: "쉬움",
    benefit: "낮음",
    agency: "문화체육관광부",
    eligibility: "기초생활수급자, 차상위계층",
    documents: ["소득증명서", "신분증"],
    applyUrl: "https://www.culture.go.kr",
    conditions: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["문화/여가"]
    }
  },
  {
    id: 16,
    title: "청년문화예술패스",
    category: "문화/여가",
    description: "청년층 문화예술 활동 지원",
    difficulty: "쉬움",
    benefit: "낮음",
    agency: "문화체육관광부",
    eligibility: "만 19~24세 청년",
    documents: ["신분증", "학생증"],
    applyUrl: "https://www.culture.go.kr",
    conditions: {
      age: ["20대"],
      interests: ["문화/여가"]
    }
  },

  // 농업/환경
  {
    id: 17,
    title: "청년농업인 영농정착지원금",
    category: "농업/환경",
    description: "청년 농업인 초기 영농 정착 자금 지원",
    difficulty: "어려움",
    benefit: "높음",
    agency: "농림축산식품부",
    eligibility: "만 18~40세 청년농업인",
    documents: ["영농계획서", "농지소유확인서", "소득증명서"],
    applyUrl: "https://www.mafra.go.kr",
    conditions: {
      age: ["20대", "30대", "40대"],
      interests: ["농업/환경"]
    }
  },
  {
    id: 18,
    title: "신재생에너지 설치지원",
    category: "농업/환경",
    description: "주택용 신재생에너지 설치비용 지원",
    difficulty: "보통",
    benefit: "중간",
    agency: "한국에너지공단",
    eligibility: "주택 소유자, 소득 기준 충족",
    documents: ["건물등기부등본", "설치계획서", "소득증명서"],
    applyUrl: "https://www.knrec.or.kr",
    conditions: {
      age: ["30대", "40대", "50대"],
      interests: ["농업/환경"]
    }
  }
];

// 캐시 저장소 (실제 운영에서는 Redis 등 사용)
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 10 * 60 * 1000; // 10분

// 기존 검증 로직은 validation.ts로 이동됨

export async function POST(request: NextRequest) {
  try {
    // 1. Rate limiting 체크 (IP 기반)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
    
    if (!checkRateLimit(ip, 8, 60000)) { // 분당 8회로 제한 강화
      const response = NextResponse.json({
        success: false,
        error: '요청 한도를 초과했습니다. 1분 후 다시 시도해주세요.',
        code: 'RATE_LIMIT_EXCEEDED'
      }, { status: 429 });
      
      return setSecurityHeaders(response);
    }

    // 2. Content-Type 검증
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const response = NextResponse.json({
        success: false,
        error: '잘못된 Content-Type입니다.',
        code: 'INVALID_CONTENT_TYPE'
      }, { status: 400 });
      
      return setSecurityHeaders(response);
    }

    // 3. 요청 본문 크기 제한 (이미 Next.js에서 기본 제한이 있지만 추가 검증)
    const body = await request.json().catch(() => null);
    if (!body) {
      const response = NextResponse.json({
        success: false,
        error: '유효하지 않은 JSON 형식입니다.',
        code: 'INVALID_JSON'
      }, { status: 400 });
      
      return setSecurityHeaders(response);
    }
    
    // 4. 강화된 입력 유효성 검사
    let validatedData;
    try {
      validatedData = validateFormData(body);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(`[SECURITY] Validation failed from IP ${ip}:`, error.message, error.field);
        
        const response = NextResponse.json({
          success: false,
          error: error.message,
          field: error.field,
          code: 'VALIDATION_ERROR'
        }, { status: 400 });
        
        return setSecurityHeaders(response);
      }
      throw error;
    }

    const { age, region, education, income, maritalStatus, hasChildren, supportParents, interests } = validatedData;

    // 캐시 키 생성
    const cacheKey = JSON.stringify({ age, region, education, income, maritalStatus, hasChildren, supportParents, interests: interests.sort() });
    
    // 캐시 확인
    const cached = cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      const response = NextResponse.json({
        success: true,
        data: cached.data,
        cached: true
      });
      
      return setSecurityHeaders(response);
    }

    // 1. 조건 기반 필터링
    const filteredBenefits = benefitDatabase.filter(benefit => {
      // 연령 조건 확인
      if (benefit.conditions.age && !benefit.conditions.age.includes(age)) {
        return false;
      }

      // 소득 조건 확인
      if (benefit.conditions.income && !benefit.conditions.income.includes(income)) {
        return false;
      }

      // 자녀 유무 조건 확인
      if (benefit.conditions.hasChildren && !benefit.conditions.hasChildren.includes(hasChildren)) {
        return false;
      }

      // 혼인 상태 조건 확인
      if (benefit.conditions.maritalStatus && !benefit.conditions.maritalStatus.includes(maritalStatus)) {
        return false;
      }

      // 교육 수준 조건 확인
      if (benefit.conditions.education && !benefit.conditions.education.includes(education)) {
        return false;
      }

      // 관심 분야 조건 확인
      if (benefit.conditions.interests && interests.length > 0) {
        return benefit.conditions.interests.some((interest: string) => interests.includes(interest));
      }

      return true;
    });

    // 2. ChatGPT에게 추가 분석 및 우선순위 요청
    const userProfile = `
사용자 정보:
- 연령대: ${age}
- 거주지역: ${region}
- 최종학력: ${education}
- 소득수준: ${income}
- 혼인상태: ${maritalStatus}
- 자녀유무: ${hasChildren}
- 부모부양: ${supportParents}
- 관심분야: ${interests.join(', ')}

매칭된 혜택들:
${filteredBenefits.map(b => `- ${b.title}: ${b.description} (신청난이도: ${b.difficulty}, 혜택크기: ${b.benefit})`).join('\n')}
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 한국의 정부/기업 지원 서비스 전문가입니다. 
사용자의 상황을 분석하여 혜택을 우선순위로 정렬하고, 각 혜택에 대한 간단한 추천 이유를 제공해주세요.

우선순위 기준:
1. 신청 난이도 (쉬움 > 보통 > 어려움)
2. 혜택 크기 (높음 > 중간 > 낮음)  
3. 사용자 상황과의 적합성

응답 형식: JSON 배열로 혜택 ID와 추천 이유를 포함해주세요.
예시: [{"id": 1, "reason": "청년층에게 가장 필요한 주거 지원이며 신청이 비교적 간단합니다."}, ...]`
        },
        {
          role: "user", 
          content: userProfile
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    let aiRecommendations = [];
    try {
      const content = completion.choices[0].message.content;
      if (content) {
        aiRecommendations = JSON.parse(content);
      }
    } catch (parseError) {
      console.log('AI 응답 파싱 실패, 기본 정렬 사용');
      aiRecommendations = filteredBenefits.map(b => ({ id: b.id, reason: "조건에 맞는 혜택입니다." }));
    }

    // 3. AI 추천에 따라 결과 정렬 및 추천 이유 추가
    const sortedBenefits = aiRecommendations
      .map((rec: any) => {
        const benefit = filteredBenefits.find(b => b.id === rec.id);
        return benefit ? { ...benefit, aiReason: rec.reason } : null;
      })
      .filter(Boolean);

    // AI가 추천하지 않은 나머지 혜택들도 추가
    const recommendedIds = aiRecommendations.map((rec: any) => rec.id);
    const remainingBenefits = filteredBenefits
      .filter(b => !recommendedIds.includes(b.id))
      .map(b => ({ ...b, aiReason: "조건에 맞는 추가 혜택입니다." }));

    const finalResults = [...sortedBenefits, ...remainingBenefits];

    const responseData = {
      benefits: finalResults,
      totalCount: finalResults.length,
      userProfile: {
        age, region, education, income, maritalStatus, hasChildren, supportParents, interests
      }
    };

    // 캐시에 저장
    cache.set(cacheKey, {
      data: responseData,
      timestamp: Date.now()
    });

    const response = NextResponse.json({
      success: true,
      data: responseData,
      cached: false
    });
    
    return setSecurityHeaders(response);

  } catch (error: unknown) {
    // 보안 로깅: 민감 정보 제거
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[API ERROR] ${new Date().toISOString()}:`, {
      message: errorMessage,
      ip: ip.replace(/\d+$/, 'xxx'), // IP 마지막 바이트 마스킹
      userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown'
    });
    
    // OpenAI API 관련 에러 처리
    const errorObj = error as { code?: string };
    if (errorObj.code === 'insufficient_quota') {
      const response = NextResponse.json({
        success: false,
        error: 'AI 서비스 사용량이 초과되었습니다. 관리자에게 문의해주세요.',
        code: 'AI_QUOTA_EXCEEDED'
      }, { status: 503 });
      
      return setSecurityHeaders(response);
    }
    
    if (errorObj.code === 'rate_limit_exceeded') {
      const response = NextResponse.json({
        success: false,
        error: 'AI 서비스 요청이 너무 많습니다. 잠시 후 다시 시도해주세요.',
        code: 'AI_RATE_LIMIT'
      }, { status: 429 });
      
      return setSecurityHeaders(response);
    }
    
    // 일반적인 에러
    const response = NextResponse.json({
      success: false,
      error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
      code: 'INTERNAL_ERROR'
    }, { status: 500 });
    
    return setSecurityHeaders(response);
  }
}

// API Key 유효성 검사
if (!process.env.OPENAI_API_KEY) {
  console.error('OPENAI_API_KEY is not set');
}