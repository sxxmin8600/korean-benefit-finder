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

// 90개의 실제 정부/기업 혜택 템플릿
export const BENEFIT_TEMPLATES: BenefitTemplate[] = [
  // 주거 지원 (20개)
  {
    id: "housing_001",
    title: "청년 전세자금대출",
    category: "주거 지원",
    agency: "주택도시기금",
    baseDescription: "만 19~34세 청년을 대상으로 한 전세자금 대출 지원",
    eligibilityTemplate: "만 19~34세 청년, 연소득 7천만원 이하",
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
    baseDescription: "신혼부부를 위한 공공임대주택 우선공급",
    eligibilityTemplate: "혼인 7년 이내 또는 6세 이하 자녀 보유, 소득요건 충족",
    documentsTemplate: ["혼인관계증명서", "가족관계증명서", "소득증명서", "주민등록등본"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["신혼", "부부", "특별공급", "임대주택"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      maritalStatus: ["기혼"],
      income: ["중위소득 100% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_003",
    title: "청년 월세 한시 특별지원",
    category: "주거 지원",
    agency: "국토교통부",
    baseDescription: "청년의 주거비 부담 완화를 위한 월세 지원",
    eligibilityTemplate: "만 19~34세, 원가족과 별도 거주, 소득기준 충족",
    documentsTemplate: ["신분증", "임대차계약서", "소득증명서", "통장사본"],
    applyUrlTemplate: "https://www.gov.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["월세", "청년", "주거비", "지원"],
    targetGroups: {
      age: ["20대", "30대"],
      income: ["중위소득 60% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_004",
    title: "청년 주택 드림 청약통장",
    category: "주거 지원",
    agency: "주택도시기금",
    baseDescription: "청년층 주택 구입을 위한 청약저축 지원",
    eligibilityTemplate: "만 19~34세, 연소득 3천만원 이하",
    documentsTemplate: ["신분증", "소득증명서", "통장사본"],
    applyUrlTemplate: "https://nhuf.molit.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["청약", "저축", "청년", "주택구입"],
    targetGroups: {
      age: ["20대", "30대"],
      income: ["중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_005",
    title: "기존주택 전세임대",
    category: "주거 지원",
    agency: "LH한국토지주택공사",
    baseDescription: "기존 주택을 활용한 전세임대주택 지원",
    eligibilityTemplate: "무주택 세대구성원, 소득기준 충족",
    documentsTemplate: ["주민등록등본", "소득증명서", "혼인관계증명서"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["전세임대", "기존주택", "무주택"],
    targetGroups: {
      income: ["중위소득 50% 이하", "중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_006",
    title: "청년 매입임대주택",
    category: "주거 지원",
    agency: "LH한국토지주택공사",
    baseDescription: "청년을 위한 매입임대주택 공급",
    eligibilityTemplate: "만 19~39세 청년, 무주택 세대구성원",
    documentsTemplate: ["신분증", "주민등록등본", "소득증명서"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["매입임대", "청년", "무주택"],
    targetGroups: {
      age: ["20대", "30대"],
      income: ["중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_007",
    title: "주거급여",
    category: "주거 지원",
    agency: "국토교통부",
    baseDescription: "저소득층의 주거비 부담 완화를 위한 급여 지원",
    eligibilityTemplate: "기준 중위소득 47% 이하",
    documentsTemplate: ["사회보장급여 신청서", "소득증명서", "임대차계약서"],
    applyUrlTemplate: "https://www.molit.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["주거급여", "저소득층", "임대료"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하"],
      interests: ["주거 지원", "복지/의료"]
    }
  },
  {
    id: "housing_008",
    title: "청년 안심주택",
    category: "주거 지원",
    agency: "서울주택도시공사",
    baseDescription: "청년층을 위한 안심주택 공급",
    eligibilityTemplate: "만 19~39세, 서울 거주/근무",
    documentsTemplate: ["신분증", "재직증명서", "소득증명서"],
    applyUrlTemplate: "https://www.sh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["안심주택", "청년", "서울"],
    targetGroups: {
      age: ["20대", "30대"],
      region: ["서울"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_009",
    title: "주택청약종합저축",
    category: "주거 지원",
    agency: "주택도시기금",
    baseDescription: "주택 구입을 위한 청약저축 지원",
    eligibilityTemplate: "무주택 세대구성원",
    documentsTemplate: ["신분증", "주민등록등본"],
    applyUrlTemplate: "https://www.applyhome.co.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["청약저축", "주택구입", "무주택"],
    targetGroups: {
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_010",
    title: "다자녀 특별공급",
    category: "주거 지원",
    agency: "LH한국토지주택공사",
    baseDescription: "다자녀 가구를 위한 주택 특별공급",
    eligibilityTemplate: "미성년자 3명 이상 양육",
    documentsTemplate: ["가족관계증명서", "주민등록등본", "소득증명서"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["다자녀", "특별공급", "가족"],
    targetGroups: {
      hasChildren: ["있음"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_011",
    title: "행복주택",
    category: "주거 지원",
    agency: "LH한국토지주택공사",
    baseDescription: "대학생, 청년, 신혼부부 등을 위한 행복주택",
    eligibilityTemplate: "대학생, 청년, 신혼부부 등 계층별 요건 충족",
    documentsTemplate: ["신분증", "소득증명서", "재학증명서"],
    applyUrlTemplate: "https://www.lh.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["행복주택", "대학생", "청년", "신혼부부"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학", "대학교 졸업"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_012",
    title: "주거환경개선사업",
    category: "주거 지원",
    agency: "국토교통부",
    baseDescription: "노후 주거지역의 환경개선을 위한 사업",
    eligibilityTemplate: "해당 지역 거주자",
    documentsTemplate: ["주민등록등본", "건물등기부등본"],
    applyUrlTemplate: "https://www.molit.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["주거환경", "개선", "노후지역"],
    targetGroups: {
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_013",
    title: "장애인 주택개조비 지원",
    category: "주거 지원",
    agency: "보건복지부",
    baseDescription: "장애인의 주거편의를 위한 주택개조비 지원",
    eligibilityTemplate: "등록장애인, 소득기준 충족",
    documentsTemplate: ["장애인등록증", "소득증명서", "견적서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["장애인", "주택개조", "편의시설"],
    targetGroups: {
      income: ["중위소득 100% 이하"],
      interests: ["주거 지원", "복지/의료"]
    }
  },
  {
    id: "housing_014",
    title: "임대주택 보증금 지원",
    category: "주거 지원",
    agency: "주택도시기금",
    baseDescription: "임대주택 입주를 위한 보증금 지원",
    eligibilityTemplate: "무주택 세대구성원, 소득기준 충족",
    documentsTemplate: ["임대차계약서", "소득증명서", "신분증"],
    applyUrlTemplate: "https://www.hf.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["보증금", "임대주택", "무주택"],
    targetGroups: {
      income: ["중위소득 80% 이하"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_015",
    title: "취약계층 주거지원",
    category: "주거 지원",
    agency: "보건복지부",
    baseDescription: "취약계층을 위한 종합적 주거지원",
    eligibilityTemplate: "기초생활수급자, 차상위계층",
    documentsTemplate: ["수급자증명서", "소득인정액확인서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["취약계층", "주거지원", "기초수급"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["주거 지원", "복지/의료"]
    }
  },
  {
    id: "housing_016",
    title: "노인 주거복지시설",
    category: "주거 지원",
    agency: "보건복지부",
    baseDescription: "노인을 위한 주거복지시설 지원",
    eligibilityTemplate: "65세 이상 노인, 소득기준 충족",
    documentsTemplate: ["신분증", "소득증명서", "건강진단서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["노인", "주거복지", "시설"],
    targetGroups: {
      age: ["60대 이상"],
      income: ["중위소득 100% 이하"],
      interests: ["주거 지원", "복지/의료"]
    }
  },
  {
    id: "housing_017",
    title: "한부모가족 주거지원",
    category: "주거 지원",
    agency: "여성가족부",
    baseDescription: "한부모가족을 위한 주거지원 서비스",
    eligibilityTemplate: "한부모가족, 소득기준 충족",
    documentsTemplate: ["한부모가족증명서", "소득증명서"],
    applyUrlTemplate: "https://www.mogef.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["한부모", "가족", "주거지원"],
    targetGroups: {
      hasChildren: ["있음"],
      income: ["중위소득 60% 이하"],
      interests: ["주거 지원", "복지/의료"]
    }
  },
  {
    id: "housing_018",
    title: "청년 셰어하우스 지원",
    category: "주거 지원",
    agency: "서울시",
    baseDescription: "청년을 위한 셰어하우스 운영 지원",
    eligibilityTemplate: "만 19~39세, 서울 거주/근무",
    documentsTemplate: ["신분증", "소득증명서", "재직증명서"],
    applyUrlTemplate: "https://youth.seoul.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["셰어하우스", "청년", "공유주거"],
    targetGroups: {
      age: ["20대", "30대"],
      region: ["서울"],
      interests: ["주거 지원"]
    }
  },
  {
    id: "housing_019",
    title: "농촌 주택개량사업",
    category: "주거 지원",
    agency: "농림축산식품부",
    baseDescription: "농촌지역 주택 개량을 위한 지원",
    eligibilityTemplate: "농촌지역 거주, 농업 종사자",
    documentsTemplate: ["농업경영체등록증", "건축허가서", "견적서"],
    applyUrlTemplate: "https://www.mafra.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["농촌", "주택개량", "농업"],
    targetGroups: {
      interests: ["주거 지원", "농업/환경"]
    }
  },
  {
    id: "housing_020",
    title: "주택바우처",
    category: "주거 지원",
    agency: "국토교통부",
    baseDescription: "저소득층 주거비 지원을 위한 바우처",
    eligibilityTemplate: "기준 중위소득 50% 이하",
    documentsTemplate: ["사회보장급여신청서", "임대차계약서"],
    applyUrlTemplate: "https://www.molit.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["바우처", "주거비", "저소득층"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층", "중위소득 50% 이하"],
      interests: ["주거 지원", "복지/의료"]
    }
  },

  // 교육/취업 (20개)
  {
    id: "education_001",
    title: "청년 구직활동지원금",
    category: "교육/취업",
    agency: "고용노동부",
    baseDescription: "구직활동 중인 청년에게 지원금 제공",
    eligibilityTemplate: "만 18~34세, 구직 중인 청년",
    documentsTemplate: ["신분증", "구직신청서", "통장사본"],
    applyUrlTemplate: "https://www.work.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["구직", "청년", "활동지원금"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학", "대학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_002",
    title: "국가장학금 1유형",
    category: "교육/취업",
    agency: "한국장학재단",
    baseDescription: "소득연계형 국가장학금 지원",
    eligibilityTemplate: "대학 재학생, 소득기준 충족",
    documentsTemplate: ["재학증명서", "소득증명서", "성적증명서"],
    applyUrlTemplate: "https://www.kosaf.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["장학금", "대학생", "소득연계"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학"],
      income: ["중위소득 80% 이하"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_003",
    title: "청년 취업성공패키지",
    category: "교육/취업",
    agency: "고용노동부",
    baseDescription: "청년 취업을 위한 종합적 지원 서비스",
    eligibilityTemplate: "만 18~34세, 미취업자",
    documentsTemplate: ["신분증", "참여신청서", "소득증명서"],
    applyUrlTemplate: "https://www.work.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["취업", "패키지", "청년", "직업훈련"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_004",
    title: "내일배움카드",
    category: "교육/취업",
    agency: "고용노동부",
    baseDescription: "직업능력개발을 위한 훈련비 지원",
    eligibilityTemplate: "15세 이상 재직자, 구직자",
    documentsTemplate: ["신분증", "신청서", "재직증명서"],
    applyUrlTemplate: "https://www.hrd.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["직업훈련", "배움카드", "능력개발"],
    targetGroups: {
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_005",
    title: "대학원생 연구장려금",
    category: "교육/취업",
    agency: "과학기술정보통신부",
    baseDescription: "대학원생 연구활동 지원을 위한 장려금",
    eligibilityTemplate: "대학원 재학생, 연구활동 참여",
    documentsTemplate: ["재학증명서", "연구계획서", "지도교수 추천서"],
    applyUrlTemplate: "https://www.msit.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["대학원생", "연구", "장려금"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학원 재학", "대학원 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_006",
    title: "청년 디지털 일자리",
    category: "교육/취업",
    agency: "과학기술정보통신부",
    baseDescription: "청년을 위한 디지털 분야 일자리 지원",
    eligibilityTemplate: "만 15~34세, 미취업자",
    documentsTemplate: ["신분증", "참여신청서", "학력증명서"],
    applyUrlTemplate: "https://work.go.kr/digitalwork",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["디지털", "일자리", "청년", "IT"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학", "대학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_007",
    title: "고졸자 특별전형 지원",
    category: "교육/취업",
    agency: "교육부",
    baseDescription: "고등학교 졸업자를 위한 대학 특별전형",
    eligibilityTemplate: "고등학교 졸업 예정자 또는 졸업자",
    documentsTemplate: ["졸업증명서", "성적증명서", "자기소개서"],
    applyUrlTemplate: "https://www.moe.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["고졸자", "특별전형", "대학진학"],
    targetGroups: {
      age: ["20대"],
      education: ["고등학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_008",
    title: "여성 새로일하기센터",
    category: "교육/취업",
    agency: "여성가족부",
    baseDescription: "경력단절 여성의 취업을 위한 종합 지원",
    eligibilityTemplate: "경력단절 여성",
    documentsTemplate: ["신분증", "경력증명서", "참여신청서"],
    applyUrlTemplate: "https://www.mogef.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["여성", "경력단절", "취업지원"],
    targetGroups: {
      age: ["30대", "40대", "50대"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_009",
    title: "특성화 고등학교 지원",
    category: "교육/취업",
    agency: "교육부",
    baseDescription: "특성화 고등학교 학생 지원 프로그램",
    eligibilityTemplate: "특성화고 재학생",
    documentsTemplate: ["재학증명서", "성적증명서"],
    applyUrlTemplate: "https://www.moe.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["특성화고", "직업교육", "학생지원"],
    targetGroups: {
      age: ["20대"],
      education: ["고등학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_010",
    title: "폴리텍 대학 무료교육",
    category: "교육/취업",
    agency: "한국폴리텍대학",
    baseDescription: "기술교육을 위한 무료 직업훈련",
    eligibilityTemplate: "15세 이상 교육희망자",
    documentsTemplate: ["신분증", "학력증명서", "신청서"],
    applyUrlTemplate: "https://www.kopo.ac.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["폴리텍", "기술교육", "무료교육"],
    targetGroups: {
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_011",
    title: "청년 해외진출 지원",
    category: "교육/취업",
    agency: "외교부",
    baseDescription: "청년의 해외진출을 위한 종합 지원",
    eligibilityTemplate: "만 18~34세 청년",
    documentsTemplate: ["신분증", "어학성적증명서", "참여신청서"],
    applyUrlTemplate: "https://www.mofa.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["해외진출", "청년", "글로벌"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학", "대학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_012",
    title: "중소기업 취업연계 장학금",
    category: "교육/취업",
    agency: "중소벤처기업부",
    baseDescription: "중소기업 취업 연계 장학금 지원",
    eligibilityTemplate: "대학 재학생, 중소기업 취업 의지",
    documentsTemplate: ["재학증명서", "취업약정서", "성적증명서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["중소기업", "취업연계", "장학금"],
    targetGroups: {
      age: ["20대"],
      education: ["대학교 재학"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_013",
    title: "직업능력개발계좌",
    category: "교육/취업",
    agency: "고용노동부",
    baseDescription: "개인별 직업능력개발을 위한 계좌 지원",
    eligibilityTemplate: "재직자, 구직자",
    documentsTemplate: ["신분증", "신청서", "훈련과정 수강신청서"],
    applyUrlTemplate: "https://www.hrd.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["직업능력", "개발계좌", "훈련"],
    targetGroups: {
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_014",
    title: "대학생 현장실습 지원",
    category: "교육/취업",
    agency: "교육부",
    baseDescription: "대학생 현장실습 참여 지원",
    eligibilityTemplate: "대학 재학생",
    documentsTemplate: ["재학증명서", "현장실습 신청서"],
    applyUrlTemplate: "https://www.moe.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["현장실습", "대학생", "실무경험"],
    targetGroups: {
      age: ["20대"],
      education: ["대학교 재학"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_015",
    title: "IT 부트캠프 지원",
    category: "교육/취업",
    agency: "과학기술정보통신부",
    baseDescription: "IT 분야 집중교육 프로그램 지원",
    eligibilityTemplate: "만 18~35세, IT 분야 관심자",
    documentsTemplate: ["신분증", "참여신청서", "동기서"],
    applyUrlTemplate: "https://www.msit.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["IT", "부트캠프", "프로그래밍"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 재학", "대학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_016",
    title: "장애인 직업재활",
    category: "교육/취업",
    agency: "보건복지부",
    baseDescription: "장애인의 직업재활을 위한 종합 지원",
    eligibilityTemplate: "등록장애인",
    documentsTemplate: ["장애인등록증", "의료진단서", "신청서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["장애인", "직업재활", "취업지원"],
    targetGroups: {
      interests: ["교육/취업", "복지/의료"]
    }
  },
  {
    id: "education_017",
    title: "군복무자 취업지원",
    category: "교육/취업",
    agency: "국방부",
    baseDescription: "전역 예정자 및 전역자 취업 지원",
    eligibilityTemplate: "군복무 전역 예정자 또는 전역자",
    documentsTemplate: ["전역증명서", "신분증", "참여신청서"],
    applyUrlTemplate: "https://www.mnd.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["군복무", "전역자", "취업지원"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_018",
    title: "평생학습계좌제",
    category: "교육/취업",
    agency: "교육부",
    baseDescription: "개인의 평생학습 이력관리 지원",
    eligibilityTemplate: "학습희망자",
    documentsTemplate: ["신분증", "학습이력서"],
    applyUrlTemplate: "https://www.all.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["평생학습", "학점은행", "학습계좌"],
    targetGroups: {
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_019",
    title: "지역인재 9급 공무원 특채",
    category: "교육/취업",
    agency: "인사혁신처",
    baseDescription: "지역인재 대상 9급 공무원 특별채용",
    eligibilityTemplate: "해당 지역 출신 대학 졸업 예정자",
    documentsTemplate: ["졸업증명서", "주민등록등본", "성적증명서"],
    applyUrlTemplate: "https://www.mpm.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["지역인재", "공무원", "특별채용"],
    targetGroups: {
      age: ["20대", "30대"],
      education: ["대학교 졸업"],
      interests: ["교육/취업"]
    }
  },
  {
    id: "education_020",
    title: "산학협력 인턴십",
    category: "교육/취업",
    agency: "교육부",
    baseDescription: "산학협력을 통한 대학생 인턴십 지원",
    eligibilityTemplate: "대학 재학생",
    documentsTemplate: ["재학증명서", "인턴십 신청서", "성적증명서"],
    applyUrlTemplate: "https://www.moe.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["산학협력", "인턴십", "실무경험"],
    targetGroups: {
      age: ["20대"],
      education: ["대학교 재학"],
      interests: ["교육/취업"]
    }
  },

  // 창업/금융 (20개)
  {
    id: "startup_001",
    title: "청년창업 지원자금",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "청년 창업자를 위한 초기 자금 지원",
    eligibilityTemplate: "만 39세 이하 창업자, 창업 7년 이내",
    documentsTemplate: ["사업계획서", "신분증", "사업자등록증"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["청년창업", "창업자금", "초기투자"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_002",
    title: "K-스타트업 그랜드 챌린지",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "글로벌 창업기업 육성 프로그램",
    eligibilityTemplate: "혁신기술 보유 스타트업",
    documentsTemplate: ["사업계획서", "기술증명서", "팀 구성서"],
    applyUrlTemplate: "https://www.k-startup.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["K-스타트업", "글로벌", "혁신기술"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      education: ["대학교 졸업", "대학원 졸업"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_003",
    title: "소상공인 창업자금",
    category: "창업/금융",
    agency: "소상공인시장진흥공단",
    baseDescription: "소상공인 창업을 위한 자금 지원",
    eligibilityTemplate: "소상공인 창업 희망자",
    documentsTemplate: ["사업계획서", "재무계획서", "신분증"],
    applyUrlTemplate: "https://www.semas.or.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["소상공인", "창업자금", "자영업"],
    targetGroups: {
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_004",
    title: "기술창업 지원사업",
    category: "창업/금융",
    agency: "과학기술정보통신부",
    baseDescription: "기술기반 창업기업 지원",
    eligibilityTemplate: "기술창업 기업, 창업 7년 이내",
    documentsTemplate: ["기술개발계획서", "사업계획서", "특허증"],
    applyUrlTemplate: "https://www.msit.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["기술창업", "R&D", "혁신"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      education: ["대학교 졸업", "대학원 졸업"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_005",
    title: "여성기업 지원자금",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "여성이 대표인 기업을 위한 자금 지원",
    eligibilityTemplate: "여성 대표 중소기업",
    documentsTemplate: ["사업자등록증", "대표자 신분증", "사업계획서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["여성기업", "여성창업", "성별지원"],
    targetGroups: {
      age: ["30대", "40대", "50대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_006",
    title: "사회적기업 육성지원",
    category: "창업/금융",
    agency: "고용노동부",
    baseDescription: "사회적기업 설립 및 운영 지원",
    eligibilityTemplate: "사회적기업 인증 또는 예비사회적기업",
    documentsTemplate: ["사회적기업 인증서", "사업계획서"],
    applyUrlTemplate: "https://www.moel.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["사회적기업", "사회적가치", "취약계층"],
    targetGroups: {
      interests: ["창업/금융", "복지/의료"]
    }
  },
  {
    id: "startup_007",
    title: "청년 마이크로크레딧",
    category: "창업/금융",
    agency: "신용보증기금",
    baseDescription: "청년층을 위한 소액 창업자금 지원",
    eligibilityTemplate: "만 18~34세, 신용등급 무관",
    documentsTemplate: ["신분증", "사업계획서", "통장사본"],
    applyUrlTemplate: "https://www.kodit.co.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["마이크로크레딧", "소액창업", "청년"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_008",
    title: "농업창업 지원사업",
    category: "창업/금융",
    agency: "농림축산식품부",
    baseDescription: "농업 분야 창업 지원",
    eligibilityTemplate: "농업 창업 희망자",
    documentsTemplate: ["사업계획서", "농업교육이수증", "토지이용계획서"],
    applyUrlTemplate: "https://www.mafra.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["농업창업", "귀농", "농촌"],
    targetGroups: {
      interests: ["창업/금융", "농업/환경"]
    }
  },
  {
    id: "startup_009",
    title: "벤처기업 확인제도",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "벤처기업 확인을 통한 각종 지원 혜택",
    eligibilityTemplate: "벤처투자기업, 연구개발기업, 기술평가보증기업",
    documentsTemplate: ["기술평가서", "투자확인서", "연구개발비 증빙"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["벤처기업", "기술평가", "투자"],
    targetGroups: {
      education: ["대학교 졸업", "대학원 졸업"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_010",
    title: "예비창업패키지",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "예비창업자를 위한 종합 지원 패키지",
    eligibilityTemplate: "사업계획서 보유 예비창업자",
    documentsTemplate: ["사업계획서", "팀구성서", "기술설명서"],
    applyUrlTemplate: "https://www.k-startup.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["예비창업", "패키지", "종합지원"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_011",
    title: "중소기업 정책자금",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "중소기업 운영자금 및 시설자금 지원",
    eligibilityTemplate: "중소기업 대표",
    documentsTemplate: ["사업자등록증", "재무제표", "사업계획서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["중소기업", "정책자금", "운영자금"],
    targetGroups: {
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_012",
    title: "신용보증 지원",
    category: "창업/금융",
    agency: "신용보증기금",
    baseDescription: "중소기업 대출을 위한 신용보증 지원",
    eligibilityTemplate: "중소기업, 창업기업",
    documentsTemplate: ["사업자등록증", "재무제표", "대출신청서"],
    applyUrlTemplate: "https://www.kodit.co.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["신용보증", "대출보증", "금융지원"],
    targetGroups: {
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_013",
    title: "혁신창업허브",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "혁신적 창업아이템 발굴 및 지원",
    eligibilityTemplate: "혁신기술 보유 창업팀",
    documentsTemplate: ["기술설명서", "사업모델 계획서", "팀구성서"],
    applyUrlTemplate: "https://www.k-startup.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["혁신창업", "기술혁신", "창업허브"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      education: ["대학교 졸업", "대학원 졸업"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_014",
    title: "재창업 지원사업",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "재창업자를 위한 맞춤형 지원",
    eligibilityTemplate: "재창업 희망자",
    documentsTemplate: ["폐업증명서", "신용회복계획서", "사업계획서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["재창업", "신용회복", "재도전"],
    targetGroups: {
      age: ["30대", "40대", "50대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_015",
    title: "크라우드펀딩 지원",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "크라우드펀딩을 통한 창업자금 조달 지원",
    eligibilityTemplate: "혁신 아이템 보유 창업자",
    documentsTemplate: ["상품설명서", "마케팅계획서", "펀딩계획서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["크라우드펀딩", "자금조달", "마케팅"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_016",
    title: "수출기업 금융지원",
    category: "창업/금융",
    agency: "산업통상자원부",
    baseDescription: "수출기업을 위한 금융지원",
    eligibilityTemplate: "수출실적 보유 중소기업",
    documentsTemplate: ["수출실적증명서", "신용장", "사업계획서"],
    applyUrlTemplate: "https://www.motie.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["수출기업", "무역금융", "글로벌"],
    targetGroups: {
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_017",
    title: "지역특화 창업지원",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "지역 특성을 활용한 창업 지원",
    eligibilityTemplate: "해당 지역 내 창업자",
    documentsTemplate: ["사업계획서", "지역연관성 증명서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["지역특화", "지역창업", "상생"],
    targetGroups: {
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_018",
    title: "온라인 쇼핑몰 창업지원",
    category: "창업/금융",
    agency: "중소벤처기업부",
    baseDescription: "온라인 쇼핑몰 창업 및 운영 지원",
    eligibilityTemplate: "온라인 쇼핑몰 창업 희망자",
    documentsTemplate: ["사업계획서", "상품기획서", "마케팅계획서"],
    applyUrlTemplate: "https://www.mss.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["온라인쇼핑몰", "전자상거래", "디지털"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_019",
    title: "부품소재 창업지원",
    category: "창업/금융",
    agency: "산업통상자원부",
    baseDescription: "부품소재 분야 창업기업 지원",
    eligibilityTemplate: "부품소재기업 창업자",
    documentsTemplate: ["기술개발계획서", "시장분석서", "사업계획서"],
    applyUrlTemplate: "https://www.motie.go.kr",
    difficulty: "어려움",
    benefit: "높음",
    keywords: ["부품소재", "제조업", "기술창업"],
    targetGroups: {
      education: ["대학교 졸업", "대학원 졸업"],
      interests: ["창업/금융"]
    }
  },
  {
    id: "startup_020",
    title: "문화콘텐츠 창업지원",
    category: "창업/금융",
    agency: "문화체육관광부",
    baseDescription: "문화콘텐츠 분야 창업 지원",
    eligibilityTemplate: "문화콘텐츠 창업자",
    documentsTemplate: ["콘텐츠기획서", "제작계획서", "사업계획서"],
    applyUrlTemplate: "https://www.mcst.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["문화콘텐츠", "엔터테인먼트", "창작"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      interests: ["창업/금융", "문화/여가"]
    }
  },

  // 복지/의료 (15개)
  {
    id: "welfare_001",
    title: "기초생활보장급여",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "생계, 의료, 주거, 교육 등 기본생활 보장",
    eligibilityTemplate: "기준 중위소득 30~50% 이하",
    documentsTemplate: ["사회보장급여신청서", "소득재산신고서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["기초생활", "생계급여", "의료급여"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_002",
    title: "아동수당",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "8세 미만 아동에게 지급하는 수당",
    eligibilityTemplate: "8세 미만 아동 보유 가정",
    documentsTemplate: ["아동수당 신청서", "가족관계증명서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["아동수당", "양육비", "자녀"],
    targetGroups: {
      hasChildren: ["있음"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_003",
    title: "국민연금",
    category: "복지/의료",
    agency: "국민연금공단",
    baseDescription: "노후 소득보장을 위한 사회보험",
    eligibilityTemplate: "18세 이상 60세 미만 국민",
    documentsTemplate: ["국민연금 가입신청서", "신분증"],
    applyUrlTemplate: "https://www.nps.or.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["국민연금", "노후보장", "사회보험"],
    targetGroups: {
      age: ["20대", "30대", "40대", "50대"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_004",
    title: "장애인연금",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "중증장애인의 생활안정을 위한 연금",
    eligibilityTemplate: "만 18세 이상 중증장애인",
    documentsTemplate: ["장애인등록증", "소득재산신고서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["장애인연금", "중증장애", "생활보장"],
    targetGroups: {
      income: ["중위소득 70% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_005",
    title: "한부모가족 지원",
    category: "복지/의료",
    agency: "여성가족부",
    baseDescription: "한부모가족의 생활안정 및 자립지원",
    eligibilityTemplate: "한부모가족, 소득기준 충족",
    documentsTemplate: ["한부모가족증명서", "가족관계증명서"],
    applyUrlTemplate: "https://www.mogef.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["한부모", "양육비", "자립지원"],
    targetGroups: {
      hasChildren: ["있음"],
      income: ["중위소득 60% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_006",
    title: "노인장기요양보험",
    category: "복지/의료",
    agency: "국민건강보험공단",
    baseDescription: "노인의 장기요양 서비스 지원",
    eligibilityTemplate: "만 65세 이상 또는 65세 미만 노인성 질병자",
    documentsTemplate: ["장기요양인정신청서", "의사소견서"],
    applyUrlTemplate: "https://www.longtermcare.or.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["장기요양", "노인돌봄", "요양서비스"],
    targetGroups: {
      age: ["60대 이상"],
      supportParents: ["있음"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_007",
    title: "임신·출산 진료비 지원",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "임신·출산 관련 의료비 지원",
    eligibilityTemplate: "임신부",
    documentsTemplate: ["임신확인서", "신분증"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["임신", "출산", "의료비"],
    targetGroups: {
      age: ["20대", "30대", "40대"],
      maritalStatus: ["기혼"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_008",
    title: "영유아 보육료 지원",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "어린이집 이용 영유아 보육료 지원",
    eligibilityTemplate: "만 0~5세 영유아 보유 가정",
    documentsTemplate: ["보육료지원신청서", "가족관계증명서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["보육료", "영유아", "어린이집"],
    targetGroups: {
      hasChildren: ["있음"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_009",
    title: "긴급복지 지원",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "갑작스런 위기상황에 처한 가구 지원",
    eligibilityTemplate: "생계곤란 등 위기상황 가구",
    documentsTemplate: ["긴급지원신청서", "위기상황 증빙서류"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["긴급복지", "위기지원", "생계곤란"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_010",
    title: "사회서비스 이용권",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "돌봄, 가사, 간병 등 사회서비스 이용권",
    eligibilityTemplate: "서비스별 이용기준 충족",
    documentsTemplate: ["서비스이용신청서", "소득증명서"],
    applyUrlTemplate: "https://www.socialservice.or.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["사회서비스", "돌봄", "바우처"],
    targetGroups: {
      age: ["60대 이상"],
      income: ["중위소득 140% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_011",
    title: "건강보험료 경감",
    category: "복지/의료",
    agency: "국민건강보험공단",
    baseDescription: "저소득층 건강보험료 경감 지원",
    eligibilityTemplate: "소득 하위 50% 이하",
    documentsTemplate: ["건강보험료경감신청서", "소득증명서"],
    applyUrlTemplate: "https://www.nhis.or.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["건강보험료", "경감", "의료비"],
    targetGroups: {
      income: ["중위소득 50% 이하"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_012",
    title: "푸드뱅크 지원",
    category: "복지/의료",
    agency: "농림축산식품부",
    baseDescription: "저소득층 식품 지원 서비스",
    eligibilityTemplate: "기초생활수급자, 차상위계층",
    documentsTemplate: ["수급자증명서", "신청서"],
    applyUrlTemplate: "https://www.foodbank1377.org",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["푸드뱅크", "식품지원", "기부"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_013",
    title: "독거노인 돌봄서비스",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "독거노인을 위한 종합 돌봄서비스",
    eligibilityTemplate: "만 65세 이상 독거노인",
    documentsTemplate: ["돌봄서비스신청서", "건강상태확인서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["독거노인", "돌봄서비스", "안전확인"],
    targetGroups: {
      age: ["60대 이상"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_014",
    title: "청소년 상담지원",
    category: "복지/의료",
    agency: "여성가족부",
    baseDescription: "청소년의 심리·정서적 문제 상담 지원",
    eligibilityTemplate: "만 9~24세 청소년",
    documentsTemplate: ["상담신청서", "보호자동의서"],
    applyUrlTemplate: "https://www.mogef.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["청소년", "상담", "심리지원"],
    targetGroups: {
      age: ["20대"],
      interests: ["복지/의료"]
    }
  },
  {
    id: "welfare_015",
    title: "의료급여",
    category: "복지/의료",
    agency: "보건복지부",
    baseDescription: "저소득층 의료비 지원",
    eligibilityTemplate: "의료급여 수급권자",
    documentsTemplate: ["의료급여증", "진료비계산서"],
    applyUrlTemplate: "https://www.mohw.go.kr",
    difficulty: "쉬움",
    benefit: "높음",
    keywords: ["의료급여", "의료비", "진료비"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["복지/의료"]
    }
  },

  // 문화/여가 (10개)
  {
    id: "culture_001",
    title: "문화누리카드",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "저소득층을 위한 문화예술·여행·체육활동 지원",
    eligibilityTemplate: "기초생활수급자, 차상위계층",
    documentsTemplate: ["수급자증명서", "신분증"],
    applyUrlTemplate: "https://www.munhwanuricard.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["문화누리", "문화활동", "여행"],
    targetGroups: {
      income: ["기초생활수급자", "차상위계층"],
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_002",
    title: "청년 문화예술 지원",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "청년 문화예술인 창작활동 지원",
    eligibilityTemplate: "만 18~34세 문화예술인",
    documentsTemplate: ["작품포트폴리오", "활동계획서", "신분증"],
    applyUrlTemplate: "https://www.mcst.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["청년예술", "창작지원", "문화활동"],
    targetGroups: {
      age: ["20대", "30대"],
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_003",
    title: "생활체육 프로그램 지원",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "국민 생활체육 활동 지원",
    eligibilityTemplate: "생활체육 참여 희망자",
    documentsTemplate: ["참여신청서", "건강상태확인서"],
    applyUrlTemplate: "https://www.mcst.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["생활체육", "운동", "건강"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_004",
    title: "도서관 독서문화 프로그램",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "도서관 기반 독서문화 프로그램 운영",
    eligibilityTemplate: "도서관 이용자",
    documentsTemplate: ["도서관 회원증", "참여신청서"],
    applyUrlTemplate: "https://www.nl.go.kr",
    difficulty: "쉬움",
    benefit: "낮음",
    keywords: ["도서관", "독서", "문화프로그램"],
    targetGroups: {
      interests: ["문화/여가", "교육/취업"]
    }
  },
  {
    id: "culture_005",
    title: "전통문화 체험 프로그램",
    category: "문화/여가",
    agency: "문화재청",
    baseDescription: "전통문화 체험 및 교육 프로그램",
    eligibilityTemplate: "전통문화 체험 희망자",
    documentsTemplate: ["참여신청서", "신분증"],
    applyUrlTemplate: "https://www.cha.go.kr",
    difficulty: "쉬움",
    benefit: "낮음",
    keywords: ["전통문화", "체험", "문화재"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_006",
    title: "문화재 보존 활동 지원",
    category: "문화/여가",
    agency: "문화재청",
    baseDescription: "문화재 보존 및 관리 활동 지원",
    eligibilityTemplate: "문화재 보존 활동 참여자",
    documentsTemplate: ["활동계획서", "자격증명서"],
    applyUrlTemplate: "https://www.cha.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["문화재보존", "역사", "봉사"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_007",
    title: "문화예술교육 지원",
    category: "문화/여가",
    agency: "한국문화예술교육진흥원",
    baseDescription: "다양한 계층 대상 문화예술교육 지원",
    eligibilityTemplate: "문화예술교육 참여 희망자",
    documentsTemplate: ["참여신청서", "교육과정선택서"],
    applyUrlTemplate: "https://www.arte.or.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["문화예술교육", "창작", "예술"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_008",
    title: "국민여가 캠핑장 지원",
    category: "문화/여가",
    agency: "산림청",
    baseDescription: "국민 여가활동을 위한 캠핑장 이용 지원",
    eligibilityTemplate: "캠핑장 이용 희망자",
    documentsTemplate: ["예약신청서", "신분증"],
    applyUrlTemplate: "https://www.forest.go.kr",
    difficulty: "쉬움",
    benefit: "낮음",
    keywords: ["캠핑", "여가", "자연"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_009",
    title: "스포츠 강좌 이용권",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "저소득층 유·청소년 스포츠 활동 지원",
    eligibilityTemplate: "기초생활수급자, 차상위계층 유·청소년",
    documentsTemplate: ["수급자증명서", "가족관계증명서"],
    applyUrlTemplate: "https://www.svoucher.or.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["스포츠", "유청소년", "이용권"],
    targetGroups: {
      age: ["20대"],
      income: ["기초생활수급자", "차상위계층"],
      interests: ["문화/여가"]
    }
  },
  {
    id: "culture_010",
    title: "문화다양성 프로그램",
    category: "문화/여가",
    agency: "문화체육관광부",
    baseDescription: "다문화 이해 증진을 위한 문화프로그램",
    eligibilityTemplate: "다문화 프로그램 참여 희망자",
    documentsTemplate: ["참여신청서", "신분증"],
    applyUrlTemplate: "https://www.mcst.go.kr",
    difficulty: "쉬움",
    benefit: "낮음",
    keywords: ["다문화", "문화다양성", "이해증진"],
    targetGroups: {
      interests: ["문화/여가"]
    }
  },

  // 농업/환경 (5개)
  {
    id: "agriculture_001",
    title: "귀농귀촌 종합센터 지원",
    category: "농업/환경",
    agency: "농림축산식품부",
    baseDescription: "귀농귀촌을 위한 종합적 지원 서비스",
    eligibilityTemplate: "귀농귀촌 희망자",
    documentsTemplate: ["귀농계획서", "교육이수증명서"],
    applyUrlTemplate: "https://www.returnfarm.com",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["귀농", "귀촌", "농촌생활"],
    targetGroups: {
      age: ["30대", "40대", "50대"],
      interests: ["농업/환경"]
    }
  },
  {
    id: "agriculture_002",
    title: "친환경농업 직불제",
    category: "농업/환경",
    agency: "농림축산식품부",
    baseDescription: "친환경농업 실천 농가에 대한 직접지불금",
    eligibilityTemplate: "친환경농업 인증 농가",
    documentsTemplate: ["친환경인증서", "농업경영체등록증"],
    applyUrlTemplate: "https://www.mafra.go.kr",
    difficulty: "보통",
    benefit: "중간",
    keywords: ["친환경농업", "직불제", "유기농"],
    targetGroups: {
      interests: ["농업/환경"]
    }
  },
  {
    id: "agriculture_003",
    title: "농업기술 교육지원",
    category: "농업/환경",
    agency: "농촌진흥청",
    baseDescription: "농업인 대상 기술교육 및 컨설팅 지원",
    eligibilityTemplate: "농업 종사자",
    documentsTemplate: ["농업경영체등록증", "교육신청서"],
    applyUrlTemplate: "https://www.rda.go.kr",
    difficulty: "쉬움",
    benefit: "중간",
    keywords: ["농업기술", "교육", "컨설팅"],
    targetGroups: {
      interests: ["농업/환경"]
    }
  },
  {
    id: "agriculture_004",
    title: "환경보전 프로그램",
    category: "농업/환경",
    agency: "환경부",
    baseDescription: "환경보전 활동 참여자 지원",
    eligibilityTemplate: "환경보전 활동 참여자",
    documentsTemplate: ["활동계획서", "참여신청서"],
    applyUrlTemplate: "https://www.me.go.kr",
    difficulty: "쉬움",
    benefit: "낮음",
    keywords: ["환경보전", "생태", "봉사"],
    targetGroups: {
      interests: ["농업/환경"]
    }
  },
  {
    id: "agriculture_005",
    title: "신재생에너지 보급지원",
    category: "농업/환경",
    agency: "산업통상자원부",
    baseDescription: "가정용 신재생에너지 설치 지원",
    eligibilityTemplate: "주택 소유자",
    documentsTemplate: ["건물등기부등본", "설치계획서"],
    applyUrlTemplate: "https://www.motie.go.kr",
    difficulty: "보통",
    benefit: "높음",
    keywords: ["신재생에너지", "태양광", "에너지절약"],
    targetGroups: {
      interests: ["농업/환경"]
    }
  }
];

export class BenefitMatcher {
  async generateCustomBenefits(userProfile: any): Promise<any[]> {
    // 1. 기본 매칭 - 모든 템플릿에 대해 적합성 점수 계산
    const scoredBenefits = BENEFIT_TEMPLATES.map(template => {
      const score = this.calculateMatchScore(template, userProfile);
      return {
        ...this.templateToBenefit(template, userProfile),
        matchScore: score
      };
    });

    // 2. 점수 기준으로 정렬하고 필터링 
    const sortedBenefits = scoredBenefits
      .sort((a, b) => b.matchScore - a.matchScore);

    // 3. 동적 필터링: 상위 점수와의 차이를 고려하여 적절한 개수 반환
    if (sortedBenefits.length === 0) return [];
    
    const topScore = sortedBenefits[0].matchScore;
    const minAcceptableScore = Math.max(30, topScore - 50); // 최고점수 대비 50점 차이까지 허용
    
    const filteredBenefits = sortedBenefits.filter(benefit => 
      benefit.matchScore >= minAcceptableScore
    );

    // 4. 최소 3개, 최대 25개 범위에서 동적 조정
    const minResults = Math.min(3, filteredBenefits.length);
    const maxResults = Math.min(25, filteredBenefits.length);
    
    // 점수 차이가 큰 경우 더 적은 수로 제한
    let finalCount = maxResults;
    if (filteredBenefits.length > 10) {
      const scoreGap = topScore - filteredBenefits[9].matchScore;
      if (scoreGap > 30) {
        finalCount = Math.min(10, maxResults);
      }
    }
    
    return filteredBenefits.slice(0, Math.max(minResults, finalCount));
  }

  private calculateMatchScore(template: BenefitTemplate, userProfile: any): number {
    let score = 0;
    const targetGroups = template.targetGroups;

    // 관심사 매칭 (가장 중요한 요소)
    if (targetGroups.interests && userProfile.interests) {
      const matchingInterests = targetGroups.interests.filter(interest =>
        userProfile.interests.includes(interest)
      );
      if (matchingInterests.length > 0) {
        score += 50; // 기본 점수
      }
    }

    // 연령대 매칭 (필수 조건으로 강화)
    if (targetGroups.age && targetGroups.age.length > 0) {
      if (targetGroups.age.includes(userProfile.age)) {
        score += 20;
      } else {
        // 연령 조건이 명시되어 있는데 맞지 않으면 큰 점수 차감
        score -= 50;
      }
    }

    // 지역 매칭
    if (targetGroups.region && targetGroups.region.includes(userProfile.region)) {
      score += 15;
    }

    // 학력 매칭
    if (targetGroups.education && targetGroups.education.includes(userProfile.education)) {
      score += 10;
    }

    // 소득 매칭
    if (targetGroups.income && targetGroups.income.includes(userProfile.income)) {
      score += 25;
    }

    // 혼인상태 매칭
    if (targetGroups.maritalStatus && targetGroups.maritalStatus.includes(userProfile.maritalStatus)) {
      score += 10;
    }

    // 자녀유무 매칭
    if (targetGroups.hasChildren && targetGroups.hasChildren.includes(userProfile.hasChildren)) {
      score += 15;
    }

    // 부모부양 매칭
    if (targetGroups.supportParents && targetGroups.supportParents.includes(userProfile.supportParents)) {
      score += 10;
    }

    // 혜택 크기와 난이도에 따른 가중치
    if (template.benefit === '높음') score += 10;
    if (template.difficulty === '쉬움') score += 5;

    return score;
  }

  private templateToBenefit(template: BenefitTemplate, userProfile: any): any {
    return {
      id: template.id,
      title: template.title,
      category: template.category,
      description: template.baseDescription,
      difficulty: template.difficulty,
      benefit: template.benefit,
      agency: template.agency,
      eligibility: this.generateEligibility(template, userProfile),
      documents: template.documentsTemplate,
      applyUrl: template.applyUrlTemplate
    };
  }

  private generateEligibility(template: BenefitTemplate, userProfile: any): string {
    return template.eligibilityTemplate;
  }
}