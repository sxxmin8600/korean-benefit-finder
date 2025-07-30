import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { validateFormData, checkRateLimit, setSecurityHeaders, ValidationError } from '@/lib/validation';
import { BenefitMatcher, BENEFIT_TEMPLATES } from '@/lib/benefitDatabase';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 새로운 템플릿 기반 혜택 데이터베이스 시스템을 사용합니다.

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

    // 1. 새로운 BenefitMatcher 시스템 사용
    const matcher = new BenefitMatcher();
    const userProfile = {
      age, region, education, income, maritalStatus, hasChildren, supportParents, interests
    };
    const customBenefits = await matcher.generateCustomBenefits(userProfile);

    // 2. ChatGPT에게 추가 분석 및 우선순위 요청
    const userProfileText = `
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
${customBenefits.map(b => `- ${b.title}: ${b.description} (신청난이도: ${b.difficulty}, 혜택크기: ${b.benefit})`).join('\n')}
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
          content: userProfileText
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
      aiRecommendations = customBenefits.map(b => ({ id: b.id, reason: "조건에 맞는 혜택입니다." }));
    }

    // 3. AI 추천에 따라 결과 정렬 및 추천 이유 추가
    const sortedBenefits = aiRecommendations
      .map((rec: any) => {
        const benefit = customBenefits.find(b => b.id === rec.id);
        return benefit ? { ...benefit, aiReason: rec.reason } : null;
      })
      .filter(Boolean);

    // AI가 추천하지 않은 나머지 혜택들도 추가
    const recommendedIds = aiRecommendations.map((rec: any) => rec.id);
    const remainingBenefits = customBenefits
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