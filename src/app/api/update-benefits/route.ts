import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllSources } from '@/lib/scraper';
import { processScrapedData, removeDuplicates } from '@/lib/aiExtractor';
import { checkRateLimit, setSecurityHeaders } from '@/lib/validation';

// 실행 상태 추적
let isUpdating = false;
let lastUpdate: Date | null = null;
let updateResults: Record<string, unknown> | null = null;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting 체크 (관리자 기능이므로 더 엄격하게)
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
    
    if (!checkRateLimit(ip, 2, 300000)) { // 5분당 2회로 제한
      const response = NextResponse.json({
        success: false,
        error: '업데이트 요청 한도를 초과했습니다. 5분 후 다시 시도해주세요.',
        code: 'ADMIN_RATE_LIMIT_EXCEEDED'
      }, { status: 429 });
      
      return setSecurityHeaders(response);
    }

    // 이미 업데이트 중인지 확인
    if (isUpdating) {
      const response = NextResponse.json({
        success: false,
        error: '이미 업데이트가 진행 중입니다.',
        isUpdating: true,
        code: 'UPDATE_IN_PROGRESS'
      }, { status: 429 });
      
      return setSecurityHeaders(response);
    }

    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      const response = NextResponse.json({
        success: false,
        error: 'OpenAI API 키가 설정되지 않았습니다.',
        code: 'MISSING_API_KEY'
      }, { status: 500 });
      
      return setSecurityHeaders(response);
    }

    isUpdating = true;
    console.log('🚀 실시간 혜택 업데이트 시작...');

    // 1. 웹 스크래핑 및 RSS 수집
    const scrapedData = await scrapeAllSources();
    
    if (scrapedData.length === 0) {
      isUpdating = false;
      const response = NextResponse.json({
        success: true,
        message: '새로운 데이터가 없습니다.',
        data: {
          totalScraped: 0,
          newBenefits: [],
          summary: { totalScraped: 0, totalExtracted: 0, highQuality: 0, categories: {} }
        }
      });
      
      return setSecurityHeaders(response);
    }

    // 2. AI로 혜택 정보 추출
    const { newBenefits, summary } = await processScrapedData(scrapedData);

    // 3. 기존 혜택과 중복 제거 (실제로는 DB에서 가져와야 함)
    const existingBenefits = []; // 실제로는 DB에서 조회
    const uniqueBenefits = removeDuplicates(existingBenefits, newBenefits);

    // 4. 결과 저장 (실제로는 DB에 저장)
    updateResults = {
      timestamp: new Date().toISOString(),
      totalScraped: summary.totalScraped,
      totalExtracted: summary.totalExtracted,
      highQuality: summary.highQuality,
      uniqueNew: uniqueBenefits.length,
      categories: summary.categories,
      benefits: uniqueBenefits.slice(0, 10) // 처음 10개만 미리보기
    };

    lastUpdate = new Date();
    isUpdating = false;

    console.log(`✅ 업데이트 완료: ${uniqueBenefits.length}개의 새로운 혜택 발견`);

    const response = NextResponse.json({
      success: true,
      message: `${uniqueBenefits.length}개의 새로운 혜택을 발견했습니다.`,
      data: updateResults
    });
    
    return setSecurityHeaders(response);

  } catch (error: unknown) {
    isUpdating = false;
    
    // 보안 로깅
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[UPDATE ERROR] ${new Date().toISOString()}:`, {
      message: errorMessage,
      ip: ip.replace(/\d+$/, 'xxx')
    });

    const response = NextResponse.json({
      success: false,
      error: '업데이트 중 오류가 발생했습니다.',
      code: 'UPDATE_ERROR'
    }, { status: 500 });
    
    return setSecurityHeaders(response);
  }
}

// 업데이트 상태 조회
export async function GET(request: NextRequest) {
  // GET 요청도 rate limiting 적용
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0] : request.headers.get("x-real-ip") || "127.0.0.1";
  
  if (!checkRateLimit(ip, 20, 60000)) { // 분당 20회
    const response = NextResponse.json({
      success: false,
      error: '요청 한도를 초과했습니다.',
      code: 'STATUS_RATE_LIMIT_EXCEEDED'
    }, { status: 429 });
    
    return setSecurityHeaders(response);
  }
  
  const response = NextResponse.json({
    success: true,
    data: {
      isUpdating,
      lastUpdate: lastUpdate?.toISOString() || null,
      lastResults: updateResults
    }
  });
  
  return setSecurityHeaders(response);
}