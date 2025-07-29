// 혜택 데이터베이스 관리 시스템

export interface BenefitTemplate {
  id: string;
  title: string;
  category: string;
  agency: string;
  baseDescription: string;
  eligibilityTemplate: string;
  documentsTemplate: string[];
  applyUrlTemplate: string;
  difficulty: '쉬움' | '보통' | '어려움';
  benefit: '높음' | '중간' | '낮음';
  keywords: string[];
  targetGroups: {
    age?: string[];
    region?: string[];
    education?: string[];
    income?: string[];
    maritalStatus?: string[];
    hasChildren?: string[];
    supportParents?: string[];
    interests?: string[];
  };
}

// 기본 혜택 템플릿들 (50-100개의 실제 정부/기업 혜택)
export const BENEFIT_TEMPLATES: BenefitTemplate[] = [
  // 주거 지원 (15-20개)
  {
    id: "housing_001",
    title: "청년 전세자금대출",
    category: "주거 지원",
    agency: "주택도시기금",
    baseDescription: "만 19~34세 청년을 대상으로 한 전세자금 대출 지원",
    eligibilityTemplate: "만 19~34세 청년, 연소득 {income_limit}만원 이하",
    documentsTemplate: ["신분증", "소득증명서", "전세계약서", "주민등록등본"],
    applyUrlTemplate: "https://www.hf.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["전세", "청년", "대출", "주택"],
    targetGroups: {
      age: ["20대", "30대"],
      income: ["중위소득 80% 이하", "중위소득 100% 이하", "중위소득 120% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_002", 
    title: "신혼부부 주택특별공급",
    category: "주거 지원",
    agency: "LH한국토지주택공사",
    baseDescription: "신혼부부를 위한 공공주택 특별공급",
    eligibilityTemplate: "혼인 7년 이내 또는 예비신혼부부, 연소득 {income_limit}만원 이하",
    documentsTemplate: ["혼인관계증명서", "소득증명서", "주민등록등본", "무주택확인서"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["신혼부부", "주택공급", "특별공급"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      maritalStatus: ["기혼"],
      income: ["중위소득 100% 이하", "중위소득 120% 이하"],
      interests: ["주거 지원"]
    }
  },

  // 교육/취업 (15-20개)
  {
    id: "education_001",
    title: "국가장학금 Ⅰ유형(학생직접지원형)",
    category: "교육/취업", 
    agency: "한국장학재단",
    baseDescription: "경제적 여건에 관계없이 균등한 고등교육 기회 보장을 위한 소득연계형 장학금",
    eligibilityTemplate: "대학 재학생, 학자금지원 {income_limit} 이하",
    documentsTemplate: ["재학증명서", "성적증명서", "가족관계증명서", "소득증빙서류"],
    applyUrlTemplate: "https://www.kosaf.go.kr",
    difficulty: "쉬움",
    benefit: "높음", 
    keywords: ["장학금", "대학생", "등록금", "학자금"],
    targetGroups: {
      education: ["대학교 재학"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["교육/취업"]
    }
  },

  // 창업/금융 (10-15개)
  {
    id: "startup_001",
    title: "청년창업지원금",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "예비 청년창업자를 위한 창업지원금",
    eligibilityTemplate: "만 39세 이하 예비창업자 또는 창업 3년 이내",
    documentsTemplate: ["사업계획서", "신분증", "사업자등록증(해당시)", "통장사본"],
    applyUrlTemplate: "https://www.k-startup.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["창업", "청년", "지원금", "벤처"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["창업/금융"]
    }
  },

  // 복지/의료 (15-20개) 
  {
    id: "welfare_001",
    title: "한부모가족 아동양육비",
    category: "복지/의료",
    agency: "여성가족부",
    baseDescription: "한부모가족의 아동양육을 위한 양육비 지원",
    eligibilityTemplate: "한부모가족, 소득 {income_limit} 이하",
    documentsTemplate: ["한부모가족증명서", "소득증명서", "주민등록등본"],
    applyUrlTemplate: "https://www.mogef.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["한부모", "양육비", "아동", "지원"],
    targetGroups: {
      hasChildren: ["있음"],
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하"],
      interests: ["복지/의료"]
    }
  },

  // 더 많은 혜택들을 추가...
  // 총 50-100개의 실제 정부/기업 혜택 데이터
];

// AI를 통한 동적 혜택 생성 및 매칭
export class BenefitMatcher {
  private templates: BenefitTemplate[];

  constructor() {
    this.templates = BENEFIT_TEMPLATES;
  }

  // 사용자 입력에 따른 맞춤형 혜택 생성
  async generateCustomBenefits(userProfile: any): Promise<any[]> {
    // 1. 템플릿 기반 필터링
    const eligibleTemplates = this.filterByEligibility(userProfile);
    
    // 2. AI를 통한 동적 매개변수 적용
    const customizedBenefits = await this.customizeWithAI(eligibleTemplates, userProfile);
    
    // 3. 우선순위 및 추천 이유 생성
    const rankedBenefits = await this.rankAndExplain(customizedBenefits, userProfile);
    
    return rankedBenefits;
  }

  private filterByEligibility(userProfile: any): BenefitTemplate[] {
    return this.templates.filter(template => {
      const targets = template.targetGroups;
      
      // 나이 체크
      if (targets.age && !targets.age.includes(userProfile.age)) return false;
      
      // 지역 체크 
      if (targets.region && !targets.region.includes(userProfile.region)) return false;
      
      // 학력 체크
      if (targets.education && !targets.education.includes(userProfile.education)) return false;
      
      // 소득 체크
      if (targets.income && !targets.income.includes(userProfile.income)) return false;
      
      // 혼인상태 체크
      if (targets.maritalStatus && !targets.maritalStatus.includes(userProfile.maritalStatus)) return false;
      
      // 자녀여부 체크
      if (targets.hasChildren && !targets.hasChildren.includes(userProfile.hasChildren)) return false;
      
      // 부모부양 체크  
      if (targets.supportParents && !targets.supportParents.includes(userProfile.supportParents)) return false;
      
      // 관심분야 체크
      if (targets.interests) {
        const hasMatchingInterest = userProfile.interests.some((interest: string) => 
          targets.interests!.includes(interest)
        );
        if (!hasMatchingInterest) return false;
      }
      
      return true;
    });
  }

  private async customizeWithAI(templates: BenefitTemplate[], userProfile: any): Promise<any[]> {
    // AI가 사용자 프로필에 맞게 혜택 내용을 커스터마이징
    // 예: 소득 한도, 지역별 특성, 개인 상황에 맞는 설명 생성
    return templates.map(template => ({
      id: template.id,
      title: template.title,
      category: template.category,
      description: this.customizeDescription(template, userProfile),
      difficulty: template.difficulty,
      benefit: template.benefit,
      agency: template.agency,
      eligibility: this.customizeEligibility(template, userProfile),
      documents: template.documentsTemplate,
      applyUrl: template.applyUrlTemplate
    }));
  }

  private async rankAndExplain(benefits: any[], userProfile: any): Promise<any[]> {
    // AI가 사용자에게 가장 적합한 순서로 정렬하고 추천 이유를 생성
    return benefits.map((benefit, index) => ({
      ...benefit,
      aiReason: this.generateRecommendationReason(benefit, userProfile)
    }));
  }

  private customizeDescription(template: BenefitTemplate, userProfile: any): string {
    // 사용자 프로필에 맞게 설명 커스터마이징
    return template.baseDescription;
  }

  private customizeEligibility(template: BenefitTemplate, userProfile: any): string {
    // 소득 한도 등을 사용자 상황에 맞게 적용
    let eligibility = template.eligibilityTemplate;
    
    // 소득 기준 적용 로직
    if (userProfile.income.includes('중위소득')) {
      eligibility = eligibility.replace('{income_limit}', '중위소득 120% 이하');
    }
    
    return eligibility;
  }

  private generateRecommendationReason(benefit: any, userProfile: any): string {
    // AI가 왜 이 혜택을 추천하는지 설명 생성
    const reasons = [];
    
    if (userProfile.interests.includes(benefit.category)) {
      reasons.push(`${benefit.category} 분야에 관심을 표시하셨습니다`);
    }
    
    if (benefit.difficulty === '쉬움') {
      reasons.push('신청 절차가 간단합니다');
    }
    
    if (benefit.benefit === '높음') {
      reasons.push('혜택 규모가 큽니다');
    }
    
    return reasons.join(', ');
  }
}