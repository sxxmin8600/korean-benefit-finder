import OpenAI from 'openai';
import type { ScrapedBenefit } from './scraper';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface ExtractedBenefit {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: '쉬움' | '보통' | '어려움';
  benefit: '높음' | '중간' | '낮음';
  agency: string;
  eligibility: string;
  documents: string[];
  applyUrl: string;
  conditions: {
    age?: string[];
    income?: string[];
    education?: string[];
    region?: string[];
    maritalStatus?: string[];
    hasChildren?: string[];
    interests: string[];
  };
  sourceUrl: string;
  extractedAt: string;
  isNew: boolean;
}

/**
 * AI가 크롤링된 데이터에서 혜택 정보를 추출
 */
export async function extractBenefitsWithAI(scrapedData: ScrapedBenefit[]): Promise<ExtractedBenefit[]> {
  const results: ExtractedBenefit[] = [];
  
  // 배치로 처리 (한 번에 5개씩)
  const batchSize = 5;
  for (let i = 0; i < scrapedData.length; i += batchSize) {
    const batch = scrapedData.slice(i, i + batchSize);
    
    try {
      const extractedBatch = await processBatch(batch);
      results.push(...extractedBatch);
      
      // API 요청 간격 조절
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error('배치 처리 오류:', error);
    }
  }
  
  return results;
}

async function processBatch(batch: ScrapedBenefit[]): Promise<ExtractedBenefit[]> {
  const batchContent = batch.map((item, index) => 
    `[${index + 1}] 제목: ${item.title}\n내용: ${item.content}\n기관: ${item.agency}\nURL: ${item.url}\n---`
  ).join('\n\n');

  const systemPrompt = `당신은 한국의 정부 지원 혜택 전문 분석가입니다. 
주어진 공지사항들에서 실제 정부/기업 지원 혜택을 찾아 구조화해주세요.

다음 기준으로 판단해주세요:
- 실제 혜택이나 지원금이 있는 경우만 추출
- 단순 공지나 행사 안내는 제외
- 신청 가능한 구체적인 프로그램만 포함

응답 형식: JSON 배열
[
  {
    "isActualBenefit": true/false,
    "title": "혜택명",
    "category": "주거 지원|교육/취업|창업/금융|복지/의료|문화/여가|농업/환경",
    "description": "혜택 설명 (100자 이내)",
    "difficulty": "쉬움|보통|어려움",
    "benefit": "높음|중간|낮음",
    "agency": "담당기관명",
    "eligibility": "신청 자격 요약",
    "documents": ["필요서류1", "필요서류2"],
    "conditions": {
      "age": ["해당 연령대"],
      "income": ["해당 소득구간"],
      "interests": ["해당 카테고리"]
    },
    "originalIndex": 해당_항목_번호
  }
]`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: batchContent }
    ],
    temperature: 0.3,
    max_tokens: 2000
  });

  try {
    const aiResponse = completion.choices[0].message.content;
    if (!aiResponse) return [];

    const extractedData = JSON.parse(aiResponse);
    const results: ExtractedBenefit[] = [];

    for (const item of extractedData) {
      if (item.isActualBenefit && item.originalIndex && batch[item.originalIndex - 1]) {
        const originalItem = batch[item.originalIndex - 1];
        
        results.push({
          id: `extracted_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          title: item.title,
          category: item.category,
          description: item.description,
          difficulty: item.difficulty,
          benefit: item.benefit,
          agency: item.agency || originalItem.agency,
          eligibility: item.eligibility,
          documents: item.documents || [],
          applyUrl: originalItem.url,
          conditions: {
            age: item.conditions?.age || [],
            income: item.conditions?.income || [],
            education: item.conditions?.education || [],
            region: item.conditions?.region || [],
            maritalStatus: item.conditions?.maritalStatus || [],
            hasChildren: item.conditions?.hasChildren || [],
            interests: item.conditions?.interests || [item.category]
          },
          sourceUrl: originalItem.url,
          extractedAt: new Date().toISOString(),
          isNew: true
        });
      }
    }

    console.log(`✨ ${results.length}개의 새로운 혜택을 추출했습니다.`);
    return results;

  } catch (parseError) {
    console.error('AI 응답 파싱 오류:', parseError);
    return [];
  }
}

/**
 * 기존 혜택과 중복 제거
 */
export function removeDuplicates(
  existingBenefits: any[], 
  newBenefits: ExtractedBenefit[]
): ExtractedBenefit[] {
  
  const existingTitles = new Set(
    existingBenefits.map(b => b.title.toLowerCase().replace(/\s+/g, ''))
  );
  
  return newBenefits.filter(newBenefit => {
    const normalizedTitle = newBenefit.title.toLowerCase().replace(/\s+/g, '');
    return !existingTitles.has(normalizedTitle);
  });
}

/**
 * 추출된 혜택의 품질 점수 계산
 */
export function calculateQualityScore(benefit: ExtractedBenefit): number {
  let score = 0;
  
  // 제목과 설명 길이
  if (benefit.title.length > 5) score += 20;
  if (benefit.description.length > 20) score += 20;
  
  // 신청 자격 명시 여부
  if (benefit.eligibility.length > 10) score += 15;
  
  // 필요 서류 정보
  if (benefit.documents.length > 0) score += 15;
  
  // 조건 정보 완성도
  const conditionCount = Object.values(benefit.conditions).filter(arr => arr.length > 0).length;
  score += conditionCount * 5;
  
  // URL 유효성
  if (benefit.applyUrl.startsWith('http')) score += 10;
  
  return Math.min(score, 100);
}

/**
 * 통합 실행 함수
 */
export async function processScrapedData(scrapedData: ScrapedBenefit[]): Promise<{
  newBenefits: ExtractedBenefit[];
  summary: {
    totalScraped: number;
    totalExtracted: number;
    highQuality: number;
    categories: Record<string, number>;
  }
}> {
  console.log('🤖 AI 혜택 추출 시작...');
  
  const extractedBenefits = await extractBenefitsWithAI(scrapedData);
  
  // 품질 점수 계산 및 필터링
  const qualityBenefits = extractedBenefits
    .map(benefit => ({
      ...benefit,
      qualityScore: calculateQualityScore(benefit)
    }))
    .filter(benefit => benefit.qualityScore >= 60) // 60점 이상만
    .sort((a, b) => b.qualityScore - a.qualityScore);

  // 카테고리별 통계
  const categories: Record<string, number> = {};
  qualityBenefits.forEach(benefit => {
    categories[benefit.category] = (categories[benefit.category] || 0) + 1;
  });

  return {
    newBenefits: qualityBenefits,
    summary: {
      totalScraped: scrapedData.length,
      totalExtracted: extractedBenefits.length,
      highQuality: qualityBenefits.length,
      categories
    }
  };
}