import { NextRequest, NextResponse } from 'next/server';
import { scrapeAllSources } from '@/lib/scraper';
import { processScrapedData, removeDuplicates } from '@/lib/aiExtractor';

// 실행 상태 추적
let isUpdating = false;
let lastUpdate: Date | null = null;
let updateResults: Record<string, unknown> | null = null;

export async function POST(request: NextRequest) {
  try {
    // 이미 업데이트 중인지 확인
    if (isUpdating) {
      return NextResponse.json({
        success: false,
        error: '이미 업데이트가 진행 중입니다.',
        isUpdating: true
      }, { status: 429 });
    }

    // API 키 확인
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: 'OpenAI API 키가 설정되지 않았습니다.'
      }, { status: 500 });
    }

    isUpdating = true;
    console.log('🚀 실시간 혜택 업데이트 시작...');

    // 1. 웹 스크래핑 및 RSS 수집
    const scrapedData = await scrapeAllSources();
    
    if (scrapedData.length === 0) {
      isUpdating = false;
      return NextResponse.json({
        success: true,
        message: '새로운 데이터가 없습니다.',
        data: {
          totalScraped: 0,
          newBenefits: [],
          summary: { totalScraped: 0, totalExtracted: 0, highQuality: 0, categories: {} }
        }
      });
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

    return NextResponse.json({
      success: true,
      message: `${uniqueBenefits.length}개의 새로운 혜택을 발견했습니다.`,
      data: updateResults
    });

  } catch (error: unknown) {
    isUpdating = false;
    console.error('업데이트 오류:', error);

    return NextResponse.json({
      success: false,
      error: '업데이트 중 오류가 발생했습니다.',
      details: error.message
    }, { status: 500 });
  }
}

// 업데이트 상태 조회
export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    data: {
      isUpdating,
      lastUpdate: lastUpdate?.toISOString() || null,
      lastResults: updateResults
    }
  });
}