import { useState, useCallback, useRef, useEffect } from "react";

// ═══════════════════════════════════════════
// UDS DESIGN SYSTEM DATA (REAL)
// ═══════════════════════════════════════════

const UDS_COLORS = {
  brand: [
    { token: "container-brand-primary-low", hex: "#FEF1F7", usage: "브랜드 배경 (약한)" },
    { token: "container-brand-primary", hex: "#FA2993", usage: "브랜드 메인 (CTA)" },
    { token: "container-brand-primary-high", hex: "#E10975", usage: "브랜드 강조" },
    { token: "container-brand-secondary", hex: "#1A1A1A", usage: "보조 브랜드" },
    { token: "text-brand-primary", hex: "#FA2993", usage: "브랜드/할인 텍스트" },
    { token: "icon-brand-primary", hex: "#FA2993", usage: "브랜드 아이콘" },
  ],
  base: [
    { token: "background-base-low", hex: "#FCFCFC", usage: "기본 배경, 카드 배경" },
    { token: "background-base-high", hex: "#F2F2F2", usage: "강조 배경" },
    { token: "text-base-primary", hex: "#1A1A1A", usage: "기본 텍스트" },
    { token: "text-base-secondary", hex: "#474747", usage: "보조 텍스트" },
    { token: "text-base-tertiary", hex: "#696969", usage: "3차 텍스트" },
    { token: "text-base-white", hex: "#FFFFFF", usage: "고정 흰색" },
    { token: "icon-base-primary", hex: "#1A1A1A", usage: "기본 아이콘" },
    { token: "icon-base-secondary", hex: "#747474", usage: "보조 아이콘" },
    { token: "border-base-higher", hex: "#EBEBEB", usage: "약한 보더" },
    { token: "border-base-high", hex: "#BDBDBD", usage: "중간 보더" },
  ],
  status: [
    { token: "status-container-positive", hex: "#E6F9ED", usage: "성공 배경" },
    { token: "status-container-negative", hex: "#FEF2F2", usage: "오류 배경" },
    { token: "status-text-negative", hex: "#DC2626", usage: "오류/미납 텍스트" },
    { token: "status-border-negative", hex: "#F87171", usage: "오류 보더" },
    { token: "status-container-disabled", hex: "#F3F4F6", usage: "비활성 배경" },
    { token: "status-text-disabled", hex: "#9CA3AF", usage: "비활성 텍스트" },
  ],
  frame: [
    { token: "frame-base-low", hex: "#FCFCFC", usage: "폼/상세/설정 프레임" },
    { token: "frame-base-high", hex: "#F2F2F2", usage: "홈/대시보드/리스트 프레임" },
  ],
};

const UDS_TYPOGRAPHY = [
  { token: "display/medium", size: 28, weight: 700, lh: "130%", usage: "화면 타이틀 (대)" },
  { token: "title/large", size: 32, weight: 700, lh: "48px", usage: "페이지 타이틀" },
  { token: "title/small-1", size: 18, weight: 700, lh: "130%", usage: "섹션 타이틀" },
  { token: "title/small-2", size: 18, weight: 700, lh: "24px", usage: "섹션 타이틀 (고정)" },
  { token: "body/large", size: 18, weight: 500, lh: "150%", usage: "본문 텍스트" },
  { token: "body/medium", size: 16, weight: 400, lh: "26px", usage: "설명/보조 텍스트" },
  { token: "body/small", size: 14, weight: 500, lh: "150%", usage: "상세 텍스트" },
  { token: "label/large", size: 18, weight: 700, lh: "auto", usage: "라벨 (대)" },
  { token: "label/medium-bold", size: 16, weight: 700, lh: "auto", usage: "라벨 강조" },
  { token: "label/medium", size: 16, weight: 500, lh: "auto", usage: "버튼/칩/탭 라벨" },
  { token: "label/small", size: 12, weight: 500, lh: "18px", usage: "배지/캡션" },
];

const UDS_SPACING = {
  layout: [
    { token: "layout-x-20", value: "20px", usage: "모듈 좌우 마진" },
    { token: "layout-y-16", value: "16px", usage: "Header 직후 필터 모듈 상단" },
    { token: "layout-y-40", value: "40px", usage: "첫 모듈 상단" },
    { token: "layout-y-64", value: "64px", usage: "모듈 간 기본" },
    { token: "layout-y-80", value: "80px", usage: "최대 블록 간격" },
  ],
  gap: [
    { token: "gap-none", value: "0px", usage: "모듈 스택" },
    { token: "gap-2", value: "2px", usage: "Checkbox ↔ Checkbox" },
    { token: "gap-8", value: "8px", usage: "버튼/칩 그룹" },
    { token: "gap-12", value: "12px", usage: "TextField 간" },
    { token: "gap-16", value: "16px", usage: "Card 간" },
    { token: "gap-20", value: "20px", usage: "Header ↔ Contents" },
  ],
  radius: [
    { token: "radius-none", value: "0px", usage: "최상위 프레임" },
    { token: "radius-small", value: "4px", usage: "버튼, 텍스트 필드" },
    { token: "radius-medium", value: "8px", usage: "카드, Dialog" },
    { token: "radius-large", value: "12px", usage: "BottomSheet (상단)" },
    { token: "radius-full", value: "9999px", usage: "칩, 태그, Segment" },
  ],
};

const UDS_COMPONENTS = [
  { cat: "Navigation", items: ["OS Bar Top", "Header", "Header Logo", "Header Search", "Header Dropdown", "Tab", "Bottom Navigation", "OS Keyboard"] },
  { cat: "Button/CTA", items: ["Button Page", "Button Module", "Button Inline", "CTA", "BtnGroup CTA", "BtnGroup Card", "BtnGroup Dialog", "BtnGroup BottomSheet"] },
  { cat: "Control", items: ["Checkbox", "Checkbox Group", "Radio", "Radio Group", "Toggle", "Segment", "Stepper", "Text Button", "Chip Group Selection", "Chip Group Trigger"] },
  { cat: "Input", items: ["Text Field Group", "TF Text", "TF Email", "TF Phone", "TF Password", "TF Card", "TF RRN", "Dropdown", "Dropdown Connected", "Search", "Textarea"] },
  { cat: "Content Text", items: ["Module Header", "Text Set Title xL~xS", "Badge", "Footer", "Footer Accordion"] },
  { cat: "Content Card/List", items: ["Card", "Card Checkbox", "Card Thumbnail", "Card ThumbnailBox", "Card Group", "Image Card Group L/S", "List Group", "List", "List Body", "List Body Checkbox", "List Card", "Content List Card", "Content List Card Info"] },
  { cat: "Content Tile", items: ["Tile Group Thumbnail", "Tile Contained Group", "Thumbnail", "Thumbnail Box", "Video", "TableCard"] },
  { cat: "Layout/Overlay", items: ["Divider", "Chip Group Filter", "Bottom Sheet", "Dialog", "Snackbar", "Menu", "Indicator Counter", "Indicator Progress", "Scrollbar", "Quick Menu", "Hero"] },
];

const DS_RULES = [
  { id: "DS_001", cat: "토큰", rule: "하드코딩 컬러 금지 — 변수 바인딩 필수", severity: "critical", auto: true },
  { id: "DS_002", cat: "토큰", rule: "텍스트 스타일 토큰 적용 필수 (fontSize/fontName만 설정 금지)", severity: "critical", auto: true },
  { id: "DS_003", cat: "프레임", rule: "최상위 프레임 402px 고정, HUG + minHeight 874", severity: "critical", auto: true },
  { id: "DS_004", cat: "프레임", rule: "frame-base-low/high 맥락 토큰 매핑 준수", severity: "critical", auto: true },
  { id: "DS_005", cat: "프레임", rule: "onFrameHigh 규칙 — 하위 컴포넌트 variant 일치", severity: "critical", auto: true },
  { id: "DS_006", cat: "레이아웃", rule: "모듈 좌우 마진 20px (layout-x-20)", severity: "warning", auto: true },
  { id: "DS_007", cat: "레이아웃", rule: "첫 모듈 paddingTop=40, 이후=64", severity: "warning", auto: true },
  { id: "DS_008", cat: "레이아웃", rule: "CTA 앞 FILL height spacer 배치", severity: "critical", auto: true },
  { id: "DS_009", cat: "컴포넌트", rule: "Segment 최대 3개 — 4+ 시 Tab 사용", severity: "warning", auto: true },
  { id: "DS_010", cat: "컴포넌트", rule: "Button Group 내부 수동 조립 금지", severity: "critical", auto: false },
  { id: "DS_011", cat: "컴포넌트", rule: "Button 아이콘 최대 1개 (start/end 동시 금지)", severity: "warning", auto: true },
  { id: "DS_012", cat: "컴포넌트", rule: "Tab 최소 2개 — 1개 단독 사용 금지", severity: "warning", auto: true },
  { id: "DS_013", cat: "텍스트", rule: "word-break: textAutoResize='HEIGHT' + 너비 고정", severity: "warning", auto: true },
  { id: "DS_014", cat: "텍스트", rule: "기본값 텍스트 잔존 금지 (레이블, 텍스트, 타이틀영역입니다.)", severity: "critical", auto: true },
  { id: "DS_015", cat: "텍스트", rule: "CTA 문구 1줄 제한 + 행동 지향적 작성", severity: "warning", auto: false },
  { id: "DS_016", cat: "카드", rule: "frame-high 위 카드 → low-level1 fill + cornerRadius=8", severity: "critical", auto: true },
  { id: "DS_017", cat: "컴포넌트", rule: "Content List Card 텍스트 오버라이드 금지 → 커스텀 대체", severity: "critical", auto: false },
  { id: "DS_018", cat: "컴포넌트", rule: "Module Header description 항상 OFF", severity: "warning", auto: true },
];

const QA_PILLARS = [
  { id: "PF", name: "Perfect Fit", color: "#2563EB", principles: [
    { id: "SD", name: "Smart Defaults", ko: "기본값 최적화", desc: "사용자에게 가장 합리적인 선택을 기본으로 제공합니다." },
    { id: "RM", name: "Right Moment", ko: "맥락 기반 정보 제공", desc: "필요한 정보만, 필요한 순간에 전달합니다." },
  ]},
  { id: "MS", name: "Make Sense", color: "#7C3AED", principles: [
    { id: "FA", name: "Focused Actions", ko: "핵심 행동 중심 설계", desc: "불필요한 요소를 줄이고 핵심 행동에 집중합니다." },
    { id: "EU", name: "Easy to Understand", ko: "직관적 이해", desc: "복잡한 정보도 이해하기 쉬운 구조로 정리합니다." },
  ]},
  { id: "BT", name: "Be Transparent", color: "#059669", principles: [
    { id: "NH", name: "No Hidden Tricks", ko: "투명한 정보 제공", desc: "사용자가 이해해야 할 정보는 숨기지 않습니다." },
    { id: "SR", name: "See the Result", ko: "결과 가시성", desc: "선택에 따른 변화와 결과를 바로 확인할 수 있도록 합니다." },
  ]},
  { id: "SF", name: "Seamless Flow", color: "#D97706", principles: [
    { id: "LW", name: "Lead the Way", ko: "행동 흐름 유도", desc: "다음에 필요한 행동을 자연스럽게 안내합니다." },
    { id: "CA", name: "Continue Anytime", ko: "작업 연속성 보장", desc: "중단된 작업을 쉽게 다시 시작할 수 있도록 지원합니다." },
  ]},
];

const QA_RULES = [
  // ── Perfect Fit > Smart Defaults ──
  { id: "PF_SD_01", pillar: "PF", principle: "SD", rule: "기본값은 사용자 데이터 및 익숙한 패턴 기반으로 설정한다", severity: "critical", auto: false,
    detail: "신규 가입 시 기존 요금제·주소·결제수단 등을 사전 세팅. Dropdown·Radio 등에 가장 빈번한 값을 default로 선택" },
  { id: "PF_SD_02", pillar: "PF", principle: "SD", rule: "반복 입력 정보는 자동 완성 또는 사전 채움으로 제공한다", severity: "warning", auto: false,
    detail: "Text Field에 이전 입력값 자동완성, 주소·전화번호 자동 채움. autoFill flag 활성화 필수" },
  { id: "PF_SD_03", pillar: "PF", principle: "SD", rule: "기본값은 가장 합리적으로 설정하되 항상 수정 가능해야 한다", severity: "critical", auto: false,
    detail: "기본 선택된 항목에 isSelected=true 표시 + 다른 옵션 선택 가능 상태 유지. isDisabled로 고정 금지" },

  // ── Perfect Fit > Right Moment ──
  { id: "PF_RM_01", pillar: "PF", principle: "RM", rule: "현재 맥락과 무관한 정보 및 알림은 노출하지 않는다", severity: "warning", auto: false,
    detail: "결제 흐름 중 프로모션 배너 삽입 금지. 현재 Stage와 무관한 안내 텍스트 제거" },
  { id: "PF_RM_02", pillar: "PF", principle: "RM", rule: "의사결정 시점에 즉시 활용 가능한 정보만 제공한다", severity: "critical", auto: false,
    detail: "요금제 선택 화면에 가격·데이터·혜택 핵심 정보 즉시 노출. '자세히 보기' 뒤에 핵심 정보 숨기기 금지" },
  { id: "PF_RM_03", pillar: "PF", principle: "RM", rule: "정보는 단계 흐름에 따라 점진적으로 노출한다", severity: "warning", auto: false,
    detail: "Step Form 패턴 활용 — 한 화면에 모든 입력을 나열하지 않고 Progress 기반 단계별 노출" },

  // ── Make Sense > Focused Actions ──
  { id: "MS_FA_01", pillar: "MS", principle: "FA", rule: "한 화면은 하나의 주요 행동을 중심으로 구성한다", severity: "critical", auto: false,
    detail: "Primary CTA 1개만 강조. filled+primary 버튼은 화면당 1개. 보조 액션은 secondary/ghost로 위계 구분" },
  { id: "MS_FA_02", pillar: "MS", principle: "FA", rule: "보조 기능은 행동을 방해하지 않는 수준으로 최소화한다", severity: "warning", auto: false,
    detail: "주요 흐름과 무관한 버튼·링크를 CTA 근처에 배치 금지. 보조 액션은 Module 하단 또는 Footer 영역으로" },
  { id: "MS_FA_03", pillar: "MS", principle: "FA", rule: "복잡한 작업은 단일 목적 단위로 분해한다", severity: "warning", auto: false,
    detail: "가입 7단계 이상 금지 → 5단계 이하. formCount>4 시 Step Form 패턴으로 분리" },

  // ── Make Sense > Easy to Understand ──
  { id: "MS_EU_01", pillar: "MS", principle: "EU", rule: "용어와 문장은 사용자 중심의 쉬운 언어로 작성한다", severity: "warning", auto: false,
    detail: "내부 용어·약어 사용 금지 (예: 'VoLTE' → '고화질 통화'). CTA는 행동 지향적 문구 ('확인' → '요금제 변경하기')" },
  { id: "MS_EU_02", pillar: "MS", principle: "EU", rule: "정보는 위계와 구조를 갖춰 시각적으로 정리한다", severity: "critical", auto: true,
    detail: "Display→Title→Body→Label 타이포 위계 준수. 섹션 간 Module Header 사용. spacing 토큰으로 시각적 그룹핑" },
  { id: "MS_EU_03", pillar: "MS", principle: "EU", rule: "유사한 정보와 기능은 일관된 방식으로 그룹화한다", severity: "critical", auto: true,
    detail: "동일 계층 요소 동일 스타일. 아이콘 Line/Fill 혼용 금지. 디자인 토큰 외 컬러 금지" },

  // ── Be Transparent > No Hidden Tricks ──
  { id: "BT_NH_01", pillar: "BT", principle: "NH", rule: "비용, 조건, 제한사항은 명확하고 눈에 띄게 표시한다", severity: "critical", auto: false,
    detail: "가격은 text-brand-primary 또는 display 토큰으로 강조. 약정·위약금은 status-text-negative. Footer 안에만 숨기기 금지" },
  { id: "BT_NH_02", pillar: "BT", principle: "NH", rule: "탈퇴, 해지 등 사용자 권한 기능은 쉽게 접근 가능해야 한다", severity: "critical", auto: false,
    detail: "해지·탈퇴 메뉴를 depth 3 이상에 숨기기 금지. 설정 화면 1depth 내 접근 보장" },
  { id: "BT_NH_03", pillar: "BT", principle: "NH", rule: "사용자의 오해를 유도하는 다크 패턴을 사용하지 않는다", severity: "critical", auto: false,
    detail: "해지 버튼을 isDisabled/ghost로 약화 금지. 의도적 혼란 유발 CTA 배치 금지. 체크박스 사전 체크 금지 (마케팅 동의 등)" },

  // ── Be Transparent > See the Result ──
  { id: "BT_SR_01", pillar: "BT", principle: "SR", rule: "모든 인터랙션에는 즉각적인 피드백을 제공한다", severity: "critical", auto: false,
    detail: "버튼 Pressed/Focused State Layer 적용. 로딩 시 스켈레톤/스피너. Snackbar로 작업 완료 피드백" },
  { id: "BT_SR_02", pillar: "BT", principle: "SR", rule: "중요한 변경은 사전 미리보기 또는 결과 예측을 제공한다", severity: "warning", auto: false,
    detail: "요금제 변경 시 예상 청구 금액 시뮬레이션. 결제 전 요약 화면 (Checkout Summary 패턴) 필수" },
  { id: "BT_SR_03", pillar: "BT", principle: "SR", rule: "결과는 변화된 상태를 명확히 인지할 수 있게 표현한다", severity: "warning", auto: false,
    detail: "변경 전/후 비교 표시. Completion 패턴으로 결과 화면 제공. 토글/체크박스 상태 전환 시 시각적 피드백" },

  // ── Seamless Flow > Lead the Way ──
  { id: "SF_LW_01", pillar: "SF", principle: "LW", rule: "다음 단계 행동은 명확한 CTA로 제시한다", severity: "critical", auto: false,
    detail: "CTA 문구 구체적 행동 명시 ('다음' 금지 → '약관 동의하고 계속하기'). CTA 하단 고정 (Spacer + FILL 패턴)" },
  { id: "SF_LW_02", pillar: "SF", principle: "LW", rule: "오류 상황에서는 해결 가능한 경로를 함께 제공한다", severity: "critical", auto: false,
    detail: "isError=true 시 status-text-negative + 구체적 해결 안내. 에러 화면에 '다시 시도' CTA + 고객센터 연결" },
  { id: "SF_LW_03", pillar: "SF", principle: "LW", rule: "복잡한 과정은 단계별 가이드 또는 온보딩으로 지원한다", severity: "warning", auto: false,
    detail: "3단계 이상 흐름에 [Indicator] Progress 배치. Step Form 패턴 + 단계 안내 텍스트" },

  // ── Seamless Flow > Continue Anytime ──
  { id: "SF_CA_01", pillar: "SF", principle: "CA", rule: "진행 상태와 입력 데이터는 자동 저장한다", severity: "critical", auto: false,
    detail: "폼 입력 중 이탈 시 데이터 유지. save_state flag 활성화. 뒤로가기 시 입력값 보존" },
  { id: "SF_CA_02", pillar: "SF", principle: "CA", rule: "재진입 시 마지막 상태를 복원하여 즉시 이어서 수행하도록 한다", severity: "warning", auto: false,
    detail: "가입 중단 후 재접속 시 마지막 단계부터 재개. Progress 상태 유지" },
  { id: "SF_CA_03", pillar: "SF", principle: "CA", rule: "다양한 환경에서도 동일한 진행 상태를 유지하도록 동기화한다", severity: "warning", auto: false,
    detail: "모바일↔데스크탑 간 상태 동기화. 앱 종료 후 재진입 시 동일 상태 복원" },
];

// ═══════════════════════════════════════════
// SELF CHECKLISTS — UX(34) + UI(26) = 60개 항목
// Policy 스코어링에 포함됨
// ═══════════════════════════════════════════
const UX_CHECKLIST = [
  // ctx: "all"=모든화면, "flow"=플로우가 있는 화면, "form"=입력화면, "error"=에러/예외화면, "list"=목록화면, "info"=정보표시화면, "dynamic"=동적검수만
  // 목표 & 문제 정의 (3)
  { id: "UXC_GL_01", cat: "목표 & 문제 정의", q: "이 화면/기능의 사용자 목표가 명확한가?", ctx: "all" },
  { id: "UXC_GL_02", cat: "목표 & 문제 정의", q: "비즈니스 또는 개선 목표에 부합하는가?", ctx: "all" },
  { id: "UXC_GL_03", cat: "목표 & 문제 정의", q: "이 기능이 없어도 사용자는 불편함이 없는가?", ctx: "all" },
  // 사용자 & 맥락 (3)
  { id: "UXC_CT_01", cat: "사용자 & 맥락", q: "타깃 사용자가 누구인지 명확한가?", ctx: "all" },
  { id: "UXC_CT_02", cat: "사용자 & 맥락", q: "사용 상황(시간, 장소, 디바이스)을 고려했는가?", ctx: "all" },
  { id: "UXC_CT_03", cat: "사용자 & 맥락", q: "사용자 권한/상태 차이를 반영했는가?", ctx: "form,error" },
  // 정보 구조 (IA) (5)
  { id: "UXC_IA_01", cat: "정보 구조 (IA)", q: "정보가 논리적으로 묶여 있는가?", ctx: "all" },
  { id: "UXC_IA_02", cat: "정보 구조 (IA)", q: "메뉴/섹션 명칭이 직관적인가?", ctx: "list,info" },
  { id: "UXC_IA_03", cat: "정보 구조 (IA)", q: "메뉴의 깊이가 3단계 이하로 설계되어있는가?", ctx: "dynamic" },
  { id: "UXC_IA_04", cat: "정보 구조 (IA)", q: "사용자가 길을 잃지 않는 구조인가?", ctx: "flow" },
  { id: "UXC_IA_05", cat: "정보 구조 (IA)", q: "사용자가 다음 경로를 즉시 인지할 수 있는가?", ctx: "all" },
  // 사용자 여정 & 플로우 (5)
  { id: "UXC_FL_01", cat: "사용자 여정 & 플로우", q: "사용 흐름이 자연스럽고 예측 가능한가?", ctx: "flow" },
  { id: "UXC_FL_02", cat: "사용자 여정 & 플로우", q: "불필요한 단계는 없는가?", ctx: "flow,form" },
  { id: "UXC_FL_03", cat: "사용자 여정 & 플로우", q: "되돌리기/취소가 가능한가?", ctx: "flow,form" },
  { id: "UXC_FL_04", cat: "사용자 여정 & 플로우", q: "현재 단계가 사용자에게 인지되는가?", ctx: "flow,form" },
  { id: "UXC_FL_05", cat: "사용자 여정 & 플로우", q: "중단 시 재진입이 가능한가?", ctx: "dynamic" },
  // 인지 부하 & 이해도 (4)
  { id: "UXC_CG_01", cat: "인지 부하 & 이해도", q: "한 화면에 너무 많은 결정을 요구하지 않는가?", ctx: "all" },
  { id: "UXC_CG_02", cat: "인지 부하 & 이해도", q: "중요한 정보가 시각적으로 강조되는가?", ctx: "all" },
  { id: "UXC_CG_03", cat: "인지 부하 & 이해도", q: "용어와 표현이 사용자 친화적인가?", ctx: "all" },
  { id: "UXC_CG_04", cat: "인지 부하 & 이해도", q: "학습 없이 직관적으로 인지할 수 있는가?", ctx: "all" },
  // 상호작용 & 피드백 (4)
  { id: "UXC_IT_01", cat: "상호작용 & 피드백", q: "사용자의 행동에 즉각적인 피드백이 있는가?", ctx: "dynamic" },
  { id: "UXC_IT_02", cat: "상호작용 & 피드백", q: "시스템 상태가 항상 보이는가?", ctx: "dynamic" },
  { id: "UXC_IT_03", cat: "상호작용 & 피드백", q: "오류 발생 시 원인과 해결 방법을 안내하는가?", ctx: "error" },
  { id: "UXC_IT_04", cat: "상호작용 & 피드백", q: "실수 방지(Confirm, 안내)가 적절한가?", ctx: "form,error" },
  // 일관성 & 학습성 (4)
  { id: "UXC_CS_01", cat: "일관성 & 학습성", q: "기존 서비스 UX 패턴과 일관되는가?", ctx: "all" },
  { id: "UXC_CS_02", cat: "일관성 & 학습성", q: "동일한 행동은 동일한 결과를 주는가?", ctx: "dynamic" },
  { id: "UXC_CS_03", cat: "일관성 & 학습성", q: "한 번 배우면 다른 화면에도 적용 가능한가?", ctx: "all" },
  { id: "UXC_CS_04", cat: "일관성 & 학습성", q: "예외 케이스가 최소화되었는가?", ctx: "flow,form" },
  // 엣지 케이스 & 오류 상황 (4)
  { id: "UXC_EG_01", cat: "엣지 케이스 & 오류 상황", q: "데이터 없음/로딩/실패 상태가 정의되었는가?", ctx: "error,list" },
  { id: "UXC_EG_02", cat: "엣지 케이스 & 오류 상황", q: "오류 발생 시 대안을 제시하는가?", ctx: "error" },
  { id: "UXC_EG_03", cat: "엣지 케이스 & 오류 상황", q: "권한/상태에 따른 UX 분기가 명확한가?", ctx: "error,form" },
  { id: "UXC_EG_04", cat: "엣지 케이스 & 오류 상황", q: "예상 밖 행동에도 시스템이 안정적인가?", ctx: "dynamic" },
  // 개선 가능성 & 확장성 (2)
  { id: "UXC_EX_01", cat: "개선 가능성 & 확장성", q: "향후 기능 확장이 가능한 구조인가?", ctx: "all" },
  { id: "UXC_EX_02", cat: "개선 가능성 & 확장성", q: "운영 리소스 효율화가 가능한가?", ctx: "all" },
];

const UI_CHECKLIST = [
  // ctx: "all"=모든화면, "visual"=시각요소가 있는 화면, "form"=입력화면, "error"=에러화면, "dynamic"=동적검수만
  // 시각적 일관성 (5)
  { id: "UIC_VC_01", cat: "시각적 일관성", q: "디자인 시스템 컴포넌트를 사용했는가?", ctx: "all" },
  { id: "UIC_VC_02", cat: "시각적 일관성", q: "컬러 사용이 가이드에 부합하는가?", ctx: "all" },
  { id: "UIC_VC_03", cat: "시각적 일관성", q: "아이콘 스타일이 통일되어 있는가?", ctx: "all" },
  { id: "UIC_VC_04", cat: "시각적 일관성", q: "그림자, 보더, 라운드 값이 일관적인가?", ctx: "all" },
  { id: "UIC_VC_05", cat: "시각적 일관성", q: "동일한 기능은 동일한 UI로 표현되었는가?", ctx: "all" },
  // 컴포넌트 상태 (5)
  { id: "UIC_CS_01", cat: "컴포넌트 상태", q: "기본/Hover/Active/Disabled 상태가 정의되었는가?", ctx: "form,dynamic" },
  { id: "UIC_CS_02", cat: "컴포넌트 상태", q: "에러 상태 UI가 존재하는가?", ctx: "error,form" },
  { id: "UIC_CS_03", cat: "컴포넌트 상태", q: "로딩 상태가 정의되어 있는가?", ctx: "dynamic" },
  { id: "UIC_CS_04", cat: "컴포넌트 상태", q: "빈 상태(Empty state)를 고려했는가?", ctx: "list,error" },
  { id: "UIC_CS_05", cat: "컴포넌트 상태", q: "상태 변화가 사용자에게 명확하게 인지되는가?", ctx: "dynamic" },
  // 타이포그래피 (3)
  { id: "UIC_TP_01", cat: "타이포그래피", q: "폰트 종류·크기·두께가 가이드와 일치하는가?", ctx: "all" },
  { id: "UIC_TP_02", cat: "타이포그래피", q: "텍스트 위계(제목/본문/보조)가 명확한가?", ctx: "all" },
  { id: "UIC_TP_03", cat: "타이포그래피", q: "강조 텍스트 남용은 없는가?", ctx: "all" },
  // 컬러 & 대비 (3)
  { id: "UIC_CC_01", cat: "컬러 & 대비", q: "색상만으로 의미를 전달하지 않았는가?", ctx: "all" },
  { id: "UIC_CC_02", cat: "컬러 & 대비", q: "비활성/활성/에러 상태가 명확한가?", ctx: "form,error" },
  { id: "UIC_CC_03", cat: "컬러 & 대비", q: "다크모드(있다면)에서도 가독성이 유지되는가?", ctx: "dynamic" },
  // 인터랙션 (4)
  { id: "UIC_IN_01", cat: "인터랙션", q: "작동 가능한 요소가 시각적으로 명확한가?", ctx: "all" },
  { id: "UIC_IN_02", cat: "인터랙션", q: "애니메이션이 과도하지 않은가?", ctx: "dynamic" },
  { id: "UIC_IN_03", cat: "인터랙션", q: "전환(Transition)이 자연스러운가?", ctx: "dynamic" },
  { id: "UIC_IN_04", cat: "인터랙션", q: "시각적 피드백이 즉시 제공되는가?", ctx: "dynamic" },
  // 반응형 & 디바이스 대응 (4)
  { id: "UIC_RS_01", cat: "반응형 & 디바이스 대응", q: "멀티 디바이스 대응이 고려되었는가?", ctx: "dynamic" },
  { id: "UIC_RS_02", cat: "반응형 & 디바이스 대응", q: "최소 터치 영역(약 44px)이 확보되었는가?", ctx: "all" },
  { id: "UIC_RS_03", cat: "반응형 & 디바이스 대응", q: "화면 회전 시 레이아웃 문제가 없는가?", ctx: "dynamic" },
  { id: "UIC_RS_04", cat: "반응형 & 디바이스 대응", q: "작은 화면에서 정보 손실이 없는가?", ctx: "all" },
  // UI 품질 체크 (3)
  { id: "UIC_QC_01", cat: "UI 품질 체크", q: "기존 서비스 UI와 어색하지 않은가?", ctx: "all" },
  { id: "UIC_QC_02", cat: "UI 품질 체크", q: "불필요한 장식 요소는 없는가?", ctx: "all" },
  { id: "UIC_QC_03", cat: "UI 품질 체크", q: "유지보수 관점에서 복잡하지 않은가?", ctx: "all" },
];

const SCREEN_PATTERNS = [
  { id: "form-step", name: "Step Form", cat: "Form", desc: "단계별 입력 (Progress + 입력 조합 + CTA)" },
  { id: "form-simple", name: "Simple Form", cat: "Form", desc: "단일 단계 입력 (TextField Group + CTA)" },
  { id: "form-verify", name: "Verification", cat: "Form", desc: "인증 화면 (안내 + 입력 + Keyboard)" },
  { id: "form-terms", name: "약관 동의", cat: "Form", desc: "전체/개별 체크박스 + 마스터 규칙" },
  { id: "form-complete", name: "Completion", cat: "Form", desc: "완료 상태 (아이콘 + 결과 + CTA)" },
  { id: "dash-charge", name: "요금 대시보드", cat: "Dashboard", desc: "금액 히어로 + Dropdown + Tile Group" },
  { id: "dash-home", name: "My 홈", cat: "Dashboard", desc: "인사말 + 요금 카드 + Bottom Nav" },
  { id: "dash-bill", name: "청구서", cat: "Dashboard", desc: "Hero 금액 + Card Thumbnail + Content List" },
  { id: "list-product", name: "Product List", cat: "List", desc: "Chip Filter + Dropdown + Product Card" },
  { id: "list-tab", name: "Tab + Filter List", cat: "List", desc: "Tab + Chip Filter + Image Card Group" },
  { id: "list-grid", name: "Grid Card", cat: "List", desc: "Module Header + Chip Filter + 2열 그리드" },
  { id: "set-toggle", name: "Toggle 설정", cat: "Settings", desc: "Module Header + Content Card Toggle" },
  { id: "set-radio", name: "Radio 설정", cat: "Settings", desc: "Module Header hero + Radio Group + CTA" },
  { id: "detail-product", name: "상품 상세", cat: "Detail", desc: "스크롤+고정 (이미지 + Tab + CTA)" },
  { id: "detail-checkout", name: "결제", cat: "Detail", desc: "정보 + Divider + 금액 + 결제수단 + CTA" },
  { id: "overlay-sheet", name: "Bottom Sheet", cat: "Overlay", desc: "Dimmed + handle + 선택 + Button Group" },
  { id: "overlay-dialog", name: "Dialog", cat: "Overlay", desc: "Dimmed + dialog(322px) + Button Group" },
  { id: "special-search", name: "Search View", cat: "Special", desc: "Header Search + 최근/인기 + Keyboard" },
  { id: "special-empty", name: "Empty State", cat: "Special", desc: "아이콘(100×100) + 메시지" },
];

// ═══════════════════════════════════════════
// STYLE CONSTANTS
// ═══════════════════════════════════════════
const BRAND = "#FA2993";
const BRAND_LOW = "#FEF1F7";
const BRAND_HIGH = "#E10975";
const BG = "#F2F2F2";
const SURFACE = "#FCFCFC";
const TEXT1 = "#1A1A1A";
const TEXT2 = "#474747";
const TEXT3 = "#696969";
const BORDER = "#EBEBEB";

const sevCfg = {
  critical: { c: "#DC2626", bg: "#FEF2F2", l: "Critical" },
  warning: { c: "#D97706", bg: "#FFFBEB", l: "Warning" },
  info: { c: "#2563EB", bg: "#EFF6FF", l: "Info" },
};
const stCfg = {
  pass: { c: "#059669", bg: "#ECFDF5", icon: "✓" },
  fail: { c: "#DC2626", bg: "#FEF2F2", icon: "✗" },
  warn: { c: "#D97706", bg: "#FFFBEB", icon: "!" },
};

// ═══════════════════════════════════════════
// SIDEBAR
// ═══════════════════════════════════════════
function SideNav({ active, onNav, flowServiceType }) {
  const [expanded, setExpanded] = useState({ audit: true, rules: true });
  const toggle = (k) => setExpanded(p => ({ ...p, [k]: !p[k] }));

  const auditPages = ["audit-brand", "audit-linked", "audit-usability"];
  const rulesPages = ["qarules", "checklist", "customer-exp", "tokens", "typography", "components", "dsrules", "patterns", "rules-registry"];

  // flow-audit 페이지일 때 flowServiceType에 따라 해당 audit 메뉴 활성화
  const effectiveActive = active === "flow-audit"
    ? (flowServiceType === "linked" ? "audit-linked" : flowServiceType === "usability" ? "audit-usability" : "audit-brand")
    : active;

  const isActive = (id) => effectiveActive === id;
  const isGroupActive = (pages) => pages.includes(effectiveActive);

  // Chevron SVG (피그마 원본 20×20)
  const Chevron = ({ open }) => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ transition: "transform .2s", transform: open ? "rotate(0deg)" : "rotate(180deg)", flexShrink: 0 }}>
      <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <div style={{ width: 240, minWidth: 240, background: TEXT1, display: "flex", flexDirection: "column", height: "100vh", fontFamily: "'Pretendard',system-ui,sans-serif" }}>
      {/* Logo: widgets-line 아이콘 36×36, position: left 26, top 40 */}
      <div style={{ padding: "40px 0 0 26px" }}>
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M15 19.5001C15.8284 19.5001 16.5 20.1717 16.5 21.0001V30.0001C16.4999 30.8285 15.8284 31.5001 15 31.5001H6C5.17162 31.5001 4.50008 30.8285 4.5 30.0001V21.0001C4.5 20.1717 5.17157 19.5001 6 19.5001H15ZM7.5 28.5001H13.5V22.5001H7.5V28.5001Z" fill={BRAND} />
          <path fillRule="evenodd" clipRule="evenodd" d="M30 19.5001C30.8284 19.5001 31.5 20.1717 31.5 21.0001V30.0001C31.4999 30.8285 30.8284 31.5001 30 31.5001H21C20.1716 31.5001 19.5001 30.8285 19.5 30.0001V21.0001C19.5 20.1717 20.1716 19.5001 21 19.5001H30ZM22.5 28.5001H28.5V22.5001H22.5V28.5001Z" fill={BRAND} />
          <path fillRule="evenodd" clipRule="evenodd" d="M24.4395 3.07484C25.0252 2.48905 25.9762 2.48905 26.562 3.07484L32.9253 9.43958C33.511 10.0254 33.511 10.9749 32.9253 11.5607L26.562 17.924C25.9762 18.5097 25.0252 18.5097 24.4395 17.924L18.0762 11.5607C17.4904 10.9749 17.4905 10.0254 18.0762 9.43958L24.4395 3.07484ZM21.2578 10.5001L25.5 14.7423L29.7437 10.5001L25.5 6.25794L21.2578 10.5001Z" fill={BRAND} />
          <path fillRule="evenodd" clipRule="evenodd" d="M15 4.50013C15.8284 4.50013 16.5 5.1717 16.5 6.00013V15.0001C16.4999 15.8285 15.8284 16.5001 15 16.5001H6C5.17162 16.5001 4.50008 15.8285 4.5 15.0001V6.00013C4.5 5.1717 5.17157 4.50013 6 4.50013H15ZM7.5 13.5001H13.5V7.50013H7.5V13.5001Z" fill={BRAND} />
        </svg>
      </div>

      {/* Menu: left 6, top 111, width 228 */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, padding: "25px 6px 0", overflowY: "auto", width: 240 }}>
        {/* Dashboard: height 44, padding 8px 20px, rounded 3px */}
        <button onClick={() => onNav("dashboard")} style={{
          display: "flex", alignItems: "center", height: 44, padding: "8px 20px",
          border: "none", width: "100%", borderRadius: 3,
          background: isActive("dashboard") ? "rgba(250,41,147,0.1)" : "transparent",
          color: isActive("dashboard") ? "#FA2993" : "#fff",
          fontSize: 18, fontWeight: isActive("dashboard") ? 700 : 500, lineHeight: 1.5,
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>Dashboard</button>

        {/* Audit: 활성 시 bg rgba(250,41,147,0.1), color #FA2993, weight 700 */}
        <button onClick={() => toggle("audit")} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 43, padding: "8px 20px", border: "none", width: "100%", borderRadius: 3,
          background: isGroupActive(auditPages) ? "rgba(250,41,147,0.1)" : "transparent",
          color: isGroupActive(auditPages) ? "#FA2993" : "#fff",
          fontSize: 18, fontWeight: isGroupActive(auditPages) ? 700 : 500,
          lineHeight: 1.5, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>
          <span>Audit</span>
          <Chevron open={expanded.audit} />
        </button>

        {/* Audit 서브: padding 16px 10px, gap 12px, list-disc, margin-left 27px */}
        {expanded.audit && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 10px", width: 228 }}>
            {[
              { id: "audit-brand", label: "브랜드 서비스" },
              { id: "audit-linked", label: "연계 서비스" },
              { id: "audit-usability", label: "외부 서비스 검증" },
            ].map(item => (
              <div key={item.id} onClick={() => onNav(item.id)} style={{
                display: "flex", alignItems: "center", gap: 8,
                paddingLeft: 17, cursor: "pointer",
                color: isActive(item.id) ? "#fff" : "#747474",
                fontSize: 18, fontWeight: 500, lineHeight: 1.5, fontFamily: "inherit",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* Results: height 43, padding 8px 20px */}
        <button onClick={() => onNav("results")} style={{
          display: "flex", alignItems: "center", gap: 10, height: 43, padding: "8px 20px",
          border: "none", width: "100%", borderRadius: 3,
          background: isActive("results") ? "rgba(250,41,147,0.1)" : "transparent",
          color: isActive("results") ? "#FA2993" : "#fff",
          fontSize: 18, fontWeight: isActive("results") ? 700 : 500, lineHeight: 1.5,
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>Results</button>

        {/* Insights: height 43, padding 8px 20px */}
        <button onClick={() => onNav("insights")} style={{
          display: "flex", alignItems: "center", gap: 10, height: 43, padding: "8px 20px",
          border: "none", width: "100%", borderRadius: 3,
          background: isActive("insights") ? "rgba(250,41,147,0.1)" : "transparent",
          color: isActive("insights") ? "#FA2993" : "#fff",
          fontSize: 18, fontWeight: isActive("insights") ? 700 : 500, lineHeight: 1.5,
          cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>Insights</button>

        {/* Rules */}
        <button onClick={() => toggle("rules")} style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 43, padding: "8px 20px", border: "none", width: "100%", borderRadius: 3,
          background: isGroupActive(rulesPages) ? "rgba(250,41,147,0.1)" : "transparent",
          color: isGroupActive(rulesPages) ? "#FA2993" : "#fff",
          fontSize: 18, fontWeight: isGroupActive(rulesPages) ? 700 : 500,
          lineHeight: 1.5, cursor: "pointer", textAlign: "left", fontFamily: "inherit",
        }}>
          <span>Rules</span>
          <Chevron open={expanded.rules} />
        </button>

        {/* Rules 서브: padding 16px 10px, gap 12px, color #747474 */}
        {expanded.rules && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "16px 10px", width: 228 }}>
            {[
              { id: "qarules", label: "UX Rules" },
              { id: "checklist", label: "Checklist" },
              { id: "customer-exp", label: "고객기대수준" },
              { id: "tokens", label: "UI Asset" },
              { id: "dsrules", label: "UI Rules" },
              { id: "patterns", label: "Pattern" },
              { id: "rules-registry", label: "Rules Registry" },
            ].map(item => (
              <div key={item.id} onClick={() => onNav(item.id)} style={{
                display: "flex", alignItems: "center", gap: 8,
                paddingLeft: 17, cursor: "pointer",
                color: isActive(item.id) ? "#fff" : "#747474",
                fontSize: 18, fontWeight: 500, lineHeight: 1.5, fontFamily: "inherit",
              }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "currentColor", flexShrink: 0 }} />
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════
function Dashboard({ onNav }) {
  const policyCount = QA_RULES.length + UX_CHECKLIST.length + UI_CHECKLIST.length;
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1200, overflowY: "auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>UX Audit Dashboard</h1>
      <p style={{ color: TEXT3, margin: "0 0 28px", fontSize: 13 }}>UDS 디자인 시스템 기반 통신 서비스 UX 자동 검수 엔진</p>

      {/* ── Quick Actions: 3 검수 유형 ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 32 }}>
        {[
          { id: "audit-brand", icon: "◆", title: "브랜드 서비스 검수", desc: "UX Policy + Checklist + Design System", scope: "Policy·DS 전체 적용", color: BRAND, bg: BRAND_LOW },
          { id: "audit-linked", icon: "○", title: "연계 서비스 검수", desc: "UX Policy + Checklist (DS 미적용)", scope: "Policy만 적용, DS 제외", color: "#7C3AED", bg: "#F5F3FF" },
          { id: "audit-usability", icon: "☰", title: "사용성 검증", desc: "UX Policy + Checklist + UX Rules", scope: "통상적·학술적 UX 룰 적용", color: "#059669", bg: "#ECFDF5" },
        ].map(a => (
          <button key={a.id} onClick={() => onNav(a.id)} style={{
            background: SURFACE, border: `1.5px solid ${BORDER}`, borderRadius: 12, padding: "22px 20px", textAlign: "left",
            cursor: "pointer", fontFamily: "inherit", transition: "all .15s", position: "relative", overflow: "hidden",
          }} onMouseEnter={e => { e.currentTarget.style.borderColor = a.color; e.currentTarget.style.boxShadow = `0 4px 20px ${a.color}18`; }} onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <span style={{ width: 36, height: 36, borderRadius: 10, background: a.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: a.color }}>{a.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 700, color: TEXT1 }}>{a.title}</span>
            </div>
            <div style={{ fontSize: 12, color: TEXT2, marginBottom: 8, lineHeight: 1.5 }}>{a.desc}</div>
            <div style={{ fontSize: 10.5, padding: "3px 10px", borderRadius: 6, background: a.bg, color: a.color, fontWeight: 600, display: "inline-block" }}>{a.scope}</div>
          </button>
        ))}
      </div>

      {/* ── Stats: Policy, DS Rules, UI Patterns ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
        {[
          { label: "UX Policy", value: policyCount, sub: `Policy ${QA_RULES.length} + UX CL ${UX_CHECKLIST.length} + UI CL ${UI_CHECKLIST.length}`, color: "#D97706", target: "qarules" },
          { label: "DS Rules", value: DS_RULES.length, sub: `${DS_RULES.filter(r => r.severity === "critical").length} Critical · ${DS_RULES.filter(r => r.auto).length} Auto`, color: "#DC2626", target: "dsrules" },
          { label: "UI Patterns", value: SCREEN_PATTERNS.length, sub: "7 Pattern Categories", color: "#059669", target: "patterns" },
        ].map((s, i) => (
          <button key={i} onClick={() => onNav(s.target)} style={{
            background: SURFACE, borderRadius: 10, padding: "20px 18px", border: `1px solid ${BORDER}`, position: "relative",
            overflow: "hidden", cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "border-color .15s",
          }} onMouseEnter={e => e.currentTarget.style.borderColor = s.color} onMouseLeave={e => e.currentTarget.style.borderColor = BORDER}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2.5, background: s.color }} />
            <div style={{ fontSize: 11, color: TEXT3, fontWeight: 500, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: TEXT1, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "#9CA3AF", marginTop: 6 }}>{s.sub}</div>
          </button>
        ))}
      </div>

      {/* ── Token Architecture ── */}
      <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: 24 }}>
        <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, margin: "0 0 14px" }}>Token Architecture</h3>
        <div style={{ display: "flex", alignItems: "center", gap: 0, flexWrap: "wrap" }}>
          {[
            { label: "Primitive", desc: "원시 값 (팔레트, 스케일)", color: "#E5E7EB" },
            { label: "Semantic", desc: "역할 매핑 (사용 토큰)", color: BRAND_LOW },
            { label: "Component", desc: "컴포넌트 적용", color: "#ECFDF5" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center" }}>
              <div style={{ padding: "14px 20px", borderRadius: 8, background: t.color, minWidth: 160 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>{t.label}</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{t.desc}</div>
              </div>
              {i < 2 && <div style={{ width: 32, height: 2, background: BORDER, flexShrink: 0 }} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SELF CHECKLIST PAGE (UX 34 + UI 26)
// ═══════════════════════════════════════════
function ChecklistPage() {
  const [tab, setTab] = useState("ux");
  const list = tab === "ux" ? UX_CHECKLIST : UI_CHECKLIST;
  const cats = [...new Set(list.map(r => r.cat))];
  const ctxColors = { all: "#6B7280", form: "#2563EB", flow: "#7C3AED", error: "#DC2626", list: "#D97706", info: "#059669", dynamic: "#9333EA" };
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Self Checklist</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>UX {UX_CHECKLIST.length}개 + UI {UI_CHECKLIST.length}개 = {UX_CHECKLIST.length + UI_CHECKLIST.length}개 항목 · ctx 맥락 태그 기반 화면 유형별 필터링</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 20, borderBottom: `1px solid ${BORDER}` }}>
        {[{ id: "ux", label: "UX Checklist ("+UX_CHECKLIST.length+")" }, { id: "ui", label: "UI Checklist ("+UI_CHECKLIST.length+")" }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "10px 20px", border: "none", borderBottom: `2px solid ${tab === t.id ? BRAND : "transparent"}`,
            background: "transparent", color: tab === t.id ? BRAND : TEXT3, fontSize: 13, fontWeight: tab === t.id ? 600 : 400,
            cursor: "pointer", fontFamily: "inherit",
          }}>{t.label}</button>
        ))}
      </div>
      {cats.map(cat => (
        <div key={cat} style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, margin: "0 0 10px" }}>{cat} ({list.filter(r => r.cat === cat).length})</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {list.filter(r => r.cat === cat).map(r => (
              <div key={r.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 10, fontWeight: 700, fontFamily: "monospace", color: TEXT3, width: 72, flexShrink: 0 }}>{r.id}</span>
                <span style={{ flex: 1, fontSize: 13, color: TEXT1 }}>{r.q}</span>
                <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                  {(r.ctx || "all").split(",").map(c => (
                    <span key={c} style={{ fontSize: 9, padding: "2px 7px", borderRadius: 4, background: (ctxColors[c] || "#6B7280") + "14", color: ctxColors[c] || "#6B7280", fontWeight: 600 }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// TOKENS PAGE
// ═══════════════════════════════════════════
function TokensPage({ initialTab }) {
  const [tab, setTab] = useState(initialTab || "colors");
  const [colorGroup, setColorGroup] = useState("brand");
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Design Tokens</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>Primitive → Semantic → Component 토큰 아키텍처 · Font: Pretendard</p>
      <div style={{ display: "flex", gap: 4, marginBottom: 24, borderBottom: `1px solid ${BORDER}` }}>
        {["colors", "typography", "spacing", "radius"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "9px 16px", border: "none", background: "none", fontSize: 13,
            fontWeight: tab === t ? 600 : 400, color: tab === t ? BRAND : TEXT3,
            borderBottom: tab === t ? `2px solid ${BRAND}` : "2px solid transparent",
            cursor: "pointer", fontFamily: "inherit", marginBottom: -1, textTransform: "capitalize",
          }}>{t}</button>
        ))}
      </div>

      {tab === "colors" && (
        <>
          <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
            {Object.keys(UDS_COLORS).map(g => (
              <button key={g} onClick={() => setColorGroup(g)} style={{
                padding: "5px 14px", borderRadius: 20, border: "1px solid",
                borderColor: colorGroup === g ? BRAND : BORDER,
                background: colorGroup === g ? BRAND_LOW : "transparent",
                color: colorGroup === g ? BRAND_HIGH : TEXT3,
                fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
              }}>{g}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
            {UDS_COLORS[colorGroup].map((c, i) => (
              <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px", display: "flex", gap: 12, alignItems: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: c.hex, border: "1px solid rgba(0,0,0,0.06)", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1, fontFamily: "monospace" }}>{c.token}</div>
                  <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{c.hex} · {c.usage}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "typography" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {UDS_TYPOGRAPHY.map((t, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "14px 18px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16 }}>
                <span style={{ fontSize: Math.min(t.size, 24), fontWeight: t.weight, color: TEXT1, lineHeight: 1.3, minWidth: 200 }}>{t.token}</span>
                <span style={{ fontSize: 11, color: TEXT3 }}>{t.usage}</span>
              </div>
              <div style={{ display: "flex", gap: 20, fontSize: 11, color: TEXT3, flexShrink: 0 }}>
                <span>{t.size}px</span><span>w{t.weight}</span><span>LH {t.lh}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === "spacing" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {[{ title: "Layout", data: UDS_SPACING.layout }, { title: "Gap", data: UDS_SPACING.gap }].map((g, gi) => (
            <div key={gi}>
              <h3 style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 10 }}>{g.title}</h3>
              {g.data.map((s, i) => (
                <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <div style={{ width: 60, fontSize: 12, fontWeight: 500, color: TEXT1, fontFamily: "monospace" }}>{s.value}</div>
                  <div style={{ width: Math.min(parseInt(s.value), 80), height: 16, borderRadius: 3, background: `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`, opacity: 0.6 }} />
                  <div style={{ fontSize: 11, color: TEXT3 }}>{s.token} — {s.usage}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {tab === "radius" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {UDS_SPACING.radius.map((r, i) => (
            <div key={i} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "20px 16px", textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: r.value, border: `3px solid ${BRAND}`, background: BRAND_LOW, margin: "0 auto 10px" }} />
              <div style={{ fontSize: 12, fontWeight: 600, color: TEXT1 }}>{r.token}</div>
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 2 }}>{r.value}</div>
              <div style={{ fontSize: 10, color: "#9CA3AF", marginTop: 2 }}>{r.usage}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// COMPONENTS PAGE
// ═══════════════════════════════════════════
function ComponentsPage() {
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Component Catalog</h1>
      <p style={{ color: TEXT3, margin: "0 0 24px", fontSize: 13 }}>Core Component v1.0.0 · {UDS_COMPONENTS.reduce((a, c) => a + c.items.length, 0)} components across {UDS_COMPONENTS.length} categories</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14 }}>
        {UDS_COMPONENTS.map((cat, ci) => (
          <div key={ci} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{cat.cat}</span>
              <span style={{ fontSize: 11, color: BRAND, fontWeight: 600, background: BRAND_LOW, padding: "2px 8px", borderRadius: 10 }}>{cat.items.length}</span>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
              {cat.items.map((item, ii) => (
                <span key={ii} style={{ fontSize: 11, padding: "3px 8px", borderRadius: 4, background: BG, color: TEXT2 }}>{item}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SCREEN PATTERNS PAGE
// ═══════════════════════════════════════════
function PatternsPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...new Set(SCREEN_PATTERNS.map(p => p.cat))];
  const filtered = filter === "all" ? SCREEN_PATTERNS : SCREEN_PATTERNS.filter(p => p.cat === filter);
  const catColors = { Form: "#2563EB", Dashboard: "#7C3AED", List: "#059669", Settings: "#D97706", Detail: BRAND, Overlay: "#DC2626", Special: "#6B7280" };
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Screen Patterns</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>화면 요청 → 모듈 선택 → 패턴 매칭 → 컴포넌트 빌드</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1px solid",
            borderColor: filter === c ? BRAND : BORDER, background: filter === c ? BRAND_LOW : "transparent",
            color: filter === c ? BRAND_HIGH : TEXT3, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{c === "all" ? "전체" : c}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {filtered.map(p => (
          <div key={p.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "18px 16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: catColors[p.cat] + "18", color: catColors[p.cat] }}>{p.cat}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 4 }}>{p.name}</div>
            <div style={{ fontSize: 12, color: TEXT3, lineHeight: 1.5 }}>{p.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// UX POLICY PAGE (4 Pillars × 8 Principles × 24 Rules)
// ═══════════════════════════════════════════
function QARulesPage() {
  const [activePillar, setActivePillar] = useState("all");
  const [expanded, setExpanded] = useState(null);

  const getPillar = (id) => QA_PILLARS.find(p => p.id === id);
  const getPrinciple = (pillarId, princId) => {
    const p = getPillar(pillarId);
    return p?.principles.find(pr => pr.id === princId);
  };

  const filteredRules = activePillar === "all" ? QA_RULES : QA_RULES.filter(r => r.pillar === activePillar);
  const critCount = QA_RULES.filter(r => r.severity === "critical").length;
  const warnCount = QA_RULES.filter(r => r.severity === "warning").length;

  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>UX Policy</h1>
      <p style={{ color: TEXT3, margin: "0 0 24px", fontSize: 13 }}>
        4 Pillars · 8 Principles · {QA_RULES.length} Rules — {critCount} Critical · {warnCount} Warning
      </p>

      {/* Pillar Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
        {QA_PILLARS.map(pillar => {
          const isActive = activePillar === pillar.id;
          const ruleCount = QA_RULES.filter(r => r.pillar === pillar.id).length;
          return (
            <button key={pillar.id} onClick={() => setActivePillar(isActive ? "all" : pillar.id)} style={{
              background: isActive ? pillar.color + "0A" : SURFACE,
              border: `1.5px solid ${isActive ? pillar.color : BORDER}`,
              borderRadius: 10, padding: "18px 16px", textAlign: "left", cursor: "pointer",
              fontFamily: "inherit", transition: "all .15s", position: "relative", overflow: "hidden",
            }}>
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: pillar.color }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: TEXT1, marginBottom: 6 }}>{pillar.name}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {pillar.principles.map(pr => (
                  <div key={pr.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: pillar.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 11, color: TEXT2 }}>{pr.name}</span>
                    <span style={{ fontSize: 10, color: pillar.color }}>{pr.ko}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 10, fontSize: 11, color: TEXT3 }}>{ruleCount} rules</div>
            </button>
          );
        })}
      </div>

      {/* Rules grouped by Principle */}
      {(activePillar === "all" ? QA_PILLARS : QA_PILLARS.filter(p => p.id === activePillar)).map(pillar => (
        <div key={pillar.id} style={{ marginBottom: 32 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <div style={{ width: 4, height: 24, borderRadius: 2, background: pillar.color }} />
            <h2 style={{ fontSize: 18, fontWeight: 700, color: TEXT1, margin: 0 }}>{pillar.name}</h2>
          </div>

          {pillar.principles.map(principle => {
            const rules = filteredRules.filter(r => r.pillar === pillar.id && r.principle === principle.id);
            if (rules.length === 0) return null;
            return (
              <div key={principle.id} style={{ marginBottom: 20 }}>
                {/* Principle Header */}
                <div style={{
                  background: pillar.color + "08", borderRadius: 10, padding: "16px 20px", marginBottom: 8,
                  borderLeft: `4px solid ${pillar.color}`,
                }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: TEXT1 }}>{principle.name}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: pillar.color }}>{principle.ko}</span>
                  </div>
                  <div style={{ fontSize: 12, color: TEXT2, marginTop: 4 }}>{principle.desc}</div>
                </div>

                {/* Rules under this principle */}
                <div style={{ display: "flex", flexDirection: "column", gap: 5, paddingLeft: 4 }}>
                  {rules.map(r => {
                    const isOpen = expanded === r.id;
                    return (
                      <div key={r.id} onClick={() => setExpanded(isOpen ? null : r.id)} style={{
                        background: SURFACE, border: `1px solid ${isOpen ? pillar.color : BORDER}`,
                        borderRadius: 8, padding: "12px 16px", cursor: "pointer", transition: "all .12s",
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4, background: sevCfg[r.severity].bg, color: sevCfg[r.severity].c, flexShrink: 0 }}>{sevCfg[r.severity].l}</span>
                          <span style={{ flex: 1, fontSize: 13, fontWeight: 500, color: TEXT1 }}>{r.rule}</span>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 8, background: r.auto ? "#ECFDF5" : BG, color: r.auto ? "#059669" : "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{r.auto ? "Auto" : "Manual"}</span>
                          <span style={{ fontSize: 11, color: TEXT3, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform .15s", flexShrink: 0 }}>▾</span>
                        </div>
                        {isOpen && (
                          <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${BORDER}`, fontSize: 12.5, color: TEXT2, lineHeight: 1.7 }}>
                            {r.detail}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// DS RULES PAGE (18 rules)
// ═══════════════════════════════════════════
function DSRulesPage() {
  const [filter, setFilter] = useState("all");
  const cats = ["all", ...new Set(DS_RULES.map(r => r.cat))];
  const filtered = filter === "all" ? DS_RULES : DS_RULES.filter(r => r.cat === filter);
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Design System Rules</h1>
      <p style={{ color: TEXT3, margin: "0 0 20px", fontSize: 13 }}>UDS 빌드 시 준수해야 하는 {DS_RULES.length}개 규칙 · {DS_RULES.filter(r => r.auto).length}개 자동 검수 가능</p>
      <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            padding: "5px 14px", borderRadius: 20, border: "1px solid",
            borderColor: filter === c ? BRAND : BORDER, background: filter === c ? BRAND_LOW : "transparent",
            color: filter === c ? BRAND_HIGH : TEXT3, fontSize: 12, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
          }}>{c === "all" ? "전체" : c}</button>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {filtered.map(r => (
          <div key={r.id} style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, background: sevCfg[r.severity].bg, color: sevCfg[r.severity].c, flexShrink: 0 }}>{sevCfg[r.severity].l}</span>
            <span style={{ fontSize: 10, fontWeight: 500, padding: "3px 8px", borderRadius: 4, background: BRAND_LOW, color: BRAND, flexShrink: 0 }}>{r.cat}</span>
            <span style={{ flex: 1, fontSize: 13, color: TEXT1 }}>{r.rule}</span>
            <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 10, background: r.auto ? "#ECFDF5" : BG, color: r.auto ? "#059669" : "#9CA3AF", fontWeight: 500, flexShrink: 0 }}>{r.auto ? "Auto" : "Manual"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// AI AUDIT ENGINE — Claude API 기반 콘텐츠 분석
//   Policy = UX Policy(24) + UX Checklist(34) + UI Checklist(26) = 84 항목
//   100점 = Policy(60) + DS(40) 감점 방식
// ═══════════════════════════════════════════

function buildAllPolicyItems() {
  return [
    ...QA_RULES.map(r => ({ id: r.id, msg: r.rule, source: "UX Policy", pillar: r.pillar, principle: r.principle, detail: r.detail, severity: r.severity, ctx: "all" })),
    ...UX_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UX Checklist", cat: r.cat, severity: "warning", ctx: r.ctx || "all" })),
    ...UI_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UI Checklist", cat: r.cat, severity: "warning", ctx: r.ctx || "all" })),
  ];
}

function buildUDSSpec() {
  var colors = [];
  Object.keys(UDS_COLORS).forEach(function(group) {
    UDS_COLORS[group].forEach(function(c) { colors.push(c.hex); });
  });
  var uniqueColors = colors.filter(function(v, i, a) { return a.indexOf(v) === i; });

  var typoSpec = UDS_TYPOGRAPHY.map(function(t) {
    return t.token + ": " + t.size + "px/w" + t.weight;
  }).join(", ");

  var spacingSpec = UDS_SPACING.layout.map(function(s) {
    return s.token + "=" + s.value;
  }).join(", ");

  var radiusSpec = UDS_SPACING.radius.map(function(r) {
    return r.token + "=" + r.value;
  }).join(", ");

  return "\n\n## UDS DESIGN SYSTEM SPEC (비교 기준)\n" +
    "Font: Pretendard ONLY. 다른 폰트 사용 시 fail.\n" +
    "허용 폰트 사이즈: " + UDS_TYPOGRAPHY.map(function(t){return t.size+"px";}).filter(function(v,i,a){return a.indexOf(v)===i;}).join(", ") + ". 이 외 사이즈 → fail.\n" +
    "타이포 토큰: " + typoSpec + "\n" +
    "허용 컬러 (HEX): " + uniqueColors.join(", ") + ". 이 팔레트에 없는 컬러 사용 시 → fail.\n" +
    "레이아웃: " + spacingSpec + "\n" +
    "Radius: " + radiusSpec + "\n" +
    "프레임: 최상위 프레임 402px 너비, minHeight 874.\n" +
    "컴포넌트: UDS 라이브러리 컴포넌트 사용 필수. 커스텀 조립 금지.\n";
}

function buildAuditPrompt(screenName, allItems, dsRules, mode, extraCtx, serviceType) {
  var pList = allItems.map(function(r){return r.id+"|"+r.msg+"|ctx:"+r.ctx;}).join("\n");
  var dList = dsRules.map(function(r){return r.id+"|"+r.rule;}).join("\n");

  var udsSpec = buildUDSSpec();

  var ctxGuide = "\n\n## CONTEXT-AWARE FILTERING\nEach checklist item has a ctx tag. FIRST identify the screen type, THEN apply only matching items.\n\nScreen type → ctx mapping:\n- Homepage/Dashboard/Info display → all, info, list\n- Product list/Search results → all, list, info\n- Form/Input/Registration → all, form, flow\n- Error/Empty/Failure page → all, error\n- Multi-step flow screen → all, flow, form\n- Settings/Config screen → all, form\n- Detail/Content page → all, info\n\nctx meanings:\n- 'all': applies to every screen\n- 'form': only if screen has input fields, selections, or form elements\n- 'flow': only if screen is part of a multi-step journey\n- 'error': only if screen shows error, empty, failure, or exception states\n- 'list': only if screen displays lists, grids, or collections of items\n- 'info': only if screen displays informational content\n- 'dynamic': only in Figma/URL/Prototype mode (skip in image mode)\n\nIf an item's ctx does NOT match the screen type → mark as 'o' (out of scope, not scored).\nDo NOT force-fail items that are simply not relevant to this screen's purpose.";

  var strictGuide = "\n\n## AUDIT RULES\n" +
    "Judge each item FAIRLY based on the rules provided.\n" +
    "- For each rule: if the screen clearly violates it → fail. If it complies → pass. If you cannot determine from the image → 'o' (out of scope).\n" +
    "- DS Rules: Compare visible colors, font sizes, spacings against UDS spec. Only fail if there is a CLEAR mismatch.\n" +
    "  - Example: if a color is visibly different from the allowed palette → DS_001 fail.\n" +
    "  - Example: if text size appears to match an allowed size → DS_002 pass.\n" +
    "- UX Rules: Evaluate based on visible content and structure.\n" +
    "  - If CTA text is generic ('확인', '다음') → SF_LW_01 fail.\n" +
    "  - If information hierarchy is well structured → MS_EU_02 pass.\n" +
    "- Be specific in reason. Describe what you observed, not just '준수함'.\n" +
    "- Do NOT fail items just because you are uncertain. Only fail when there is clear evidence of violation.\n";

  var modeBlock = "";
  if (mode === "figma") {
    modeBlock = "Mode: FIGMA FILE. Use Figma MCP to read frames, tokens, variants, layer names.\n- Inspect ALL frames for flow continuity and navigation consistency.\n- Check color variable bindings, text style tokens, spacing tokens.\n- Verify component variant states (default/hover/active/disabled).\n- If a screenshot is also provided, cross-reference visual with MCP data.\n- Items with ctx='dynamic' CAN be judged via MCP (variant states, interaction specs).\n- Every in-scope item MUST be p or f. Use 'o' only for ctx mismatch.\nFigma URL: "+(extraCtx||"");
  } else if (mode === "prototype") {
    modeBlock = "Mode: PROTOTYPE URL — Scope-Aware Usability Audit\nPrototype URL: "+(extraCtx||"")+"\n\nCRITICAL: Prototypes are often PARTIAL.\n1. First identify prototype scope: screens, flows, boundaries.\n2. For each item: check ctx tag AND prototype scope. If either doesn't match → 'o'.\n3. Only score items within BOTH screen context AND prototype scope.\n4. DS Rules excluded (no code access).";
  } else if (mode === "url") {
    modeBlock = "Mode: LIVE URL. Use web_search to analyze page.\n- Every in-scope item MUST be p or f.\nURL: "+(extraCtx||"");
  } else {
    modeBlock = "Mode: STATIC IMAGE — VISUAL AUDIT.\n- First identify screen type from the image content.\n- Apply context filtering: only score items whose ctx matches the screen type.\n- Items with ctx='dynamic' (인터랙션, 상태전환, 애니메이션 등 이미지에서 판단 불가한 항목) → always 'o'.\n- Items whose ctx doesn't match screen type → 'o'.\n- For in-scope items: judge based on the rules and UDS spec provided.\n- For DS Rules: compare visible colors and font sizes against the allowed values. Only fail if there is a CLEAR visible mismatch.\n- If you cannot determine compliance from the image → mark as 'o', NOT fail.\n- Give fair judgments: pass when compliant, fail when clearly violating, 'o' when uncertain.";
  }

  var dsBlock = (mode === "prototype" || serviceType === "linked" || serviceType === "usability") ? "" : "\n\nDS("+dsRules.length+"):\n"+dList;
  var verdictHelp = "Verdicts: p(pass), f(fail), o(out of scope/context mismatch). Reason: Korean, specific observation, max 20 chars.";
  var scopeFields = mode === "prototype" ? ",\"sc\":0,\"fl\":\"\",\"bd\":\"\"" : "";

  // 사용성 검증 모드: 학술적 UX 원칙 + 전문가 의견
  var usabilityBlock = "";
  var usabilityJsonFields = "";
  if (serviceType === "usability") {
    usabilityBlock = "\n\n## USABILITY EXPERT MODE\n" +
      "You are a senior UX researcher and usability expert.\n" +
      "In addition to the Policy checklist, evaluate this screen using established UX theories:\n\n" +
      "1. Nielsen's 10 Usability Heuristics:\n" +
      "   - Visibility of system status\n" +
      "   - Match between system and real world\n" +
      "   - User control and freedom\n" +
      "   - Consistency and standards\n" +
      "   - Error prevention\n" +
      "   - Recognition rather than recall\n" +
      "   - Flexibility and efficiency of use\n" +
      "   - Aesthetic and minimalist design\n" +
      "   - Help users recognize, diagnose, recover from errors\n" +
      "   - Help and documentation\n\n" +
      "2. Cognitive Load Theory: Is the mental effort reasonable?\n" +
      "3. Fitts's Law: Are touch targets sized and positioned appropriately?\n" +
      "4. Gestalt Principles: Are visual groupings logical?\n" +
      "5. Accessibility (WCAG): Color contrast, text readability, touch target size (44px+)\n\n" +
      "Based on your analysis, provide:\n" +
      "- 'expert': Array of 3-5 expert opinions. Each with 'type' (positive/issue/suggestion), 'principle' (which theory), and 'comment' (Korean, 2-3 sentences).\n" +
      "- These are YOUR professional opinions beyond the checklist rules.\n" +
      "- Focus on actionable insights that a designer can immediately apply.\n";
    usabilityJsonFields = ",\"expert\":[{\"type\":\"issue\",\"principle\":\"Nielsen #4\",\"comment\":\"의견\"}]";
  }

  var roleDesc = serviceType === "usability"
    ? "You are a senior UX researcher conducting a usability audit."
    : "You are a professional UX/UI audit engine. Judge fairly based on rules.";

  return roleDesc+"\nScreen: "+screenName+"\n\n"+modeBlock+(serviceType === "usability" ? "" : udsSpec)+strictGuide+ctxGuide+usabilityBlock+"\n\n"+verdictHelp+"\n\nPolicy("+allItems.length+"):\n"+pList+dsBlock+"\n\nONLY valid JSON:\n{\"a\":{\"p\":\"목적\",\"u\":\"사용자\",\"f\":[\"기능\"],\"t\":\"유형\",\"st\":\"screen_type\""+scopeFields+usabilityJsonFields+"},\"r\":[{\"id\":\"ID\",\"v\":\"p\",\"m\":\"근거\"}]}";
}

function scoreFromAIResults(aiResults, mode, serviceType) {
  const allItems = buildAllPolicyItems();
  const dsAutoRules = DS_RULES.filter(r => r.auto);
  const isProto = mode === "prototype";
  const noDS = isProto || serviceType === "linked" || serviceType === "usability";

  // DS excluded: 100% from Policy. Otherwise: Policy 60 + DS 40.
  const POLICY_MAX = noDS ? 100 : 60;
  const DS_MAX = noDS ? 0 : 40;

  const policyItems = allItems.length;
  const dsItems = dsAutoRules.length;
  const policyPerRule = POLICY_MAX / policyItems;
  const dsPerRule = dsItems > 0 ? DS_MAX / dsItems : 0;

  let policyLost = 0, dsLost = 0;
  const issues = [], passes = [], skipped = [], outOfScope = [];
  const policyBreakdown = { "UX Policy": { fail: 0, total: QA_RULES.length }, "UX Checklist": { fail: 0, total: UX_CHECKLIST.length }, "UI Checklist": { fail: 0, total: UI_CHECKLIST.length } };

  const resultMap = {};
  (aiResults || []).forEach(r => { resultMap[r.id] = r; });

  const isDynamic = mode === "figma" || mode === "url" || mode === "prototype";

  // Policy scoring
  allItems.forEach(item => {
    const ai = resultMap[item.id];
    const rawV = ai?.verdict || "skip";
    const reason = ai?.reason || "";

    // "o" = out of scope (prototype only) — excluded from scoring entirely
    if (rawV === "o" || rawV === "out_of_scope") {
      outOfScope.push({ id: item.id, msg: item.msg, category: item.source, reason: reason || "프로토타입 범위 밖" });
      return;
    }

    // skip(응답 누락, 판단 불가) → 범위밖 처리
    if (rawV === "skip") {
      outOfScope.push({ id: item.id, msg: item.msg, category: item.source, reason: reason || "AI 응답 누락" });
      return;
    }

    const v = rawV;

    if (v === "fail") {
      policyLost += 1;
      if (policyBreakdown[item.source]) policyBreakdown[item.source].fail += 1;
      let pillarName, principleName;
      if (item.source === "UX Policy") {
        const pillar = QA_PILLARS.find(p => p.id === item.pillar);
        const principle = pillar?.principles.find(pr => pr.id === item.principle);
        pillarName = pillar?.name; principleName = principle?.ko;
      }
      issues.push({ id: item.id, msg: item.msg, fix: reason || "", stage: "Policy", status: "fail", category: item.source, severity: item.severity, deduction: 0, pillarName, principleName, cat: item.cat, aiReason: reason });
    } else {
      passes.push({ id: item.id, msg: item.msg, stage: "Policy", status: "pass", category: item.source, aiReason: reason });
    }
  });

  // DS scoring (skipped when noDS)
  if (!noDS) {
    dsAutoRules.forEach(item => {
      const ai = resultMap[item.id];
      const rawV = ai?.verdict || "skip";
      const reason = ai?.reason || "";
      if (rawV === "skip") {
        outOfScope.push({ id: item.id, msg: item.rule, category: "DS", reason: reason || "AI 응답 누락" });
        return;
      }

      const v = rawV;

      if (v === "fail") {
        const d = +dsPerRule.toFixed(1);
        dsLost += d;
        issues.push({ id: item.id, msg: item.rule, fix: reason || "", stage: "DS", status: "fail", category: "DS", severity: item.severity, deduction: d, aiReason: reason });
      } else {
        passes.push({ id: item.id, msg: item.rule, stage: "DS", status: "pass", category: "DS", aiReason: reason });
      }
    });
  }

  // Adjust scoring: exclude skip + out-of-scope from denominator
  const policyOOS = outOfScope.filter(s => s.category !== "DS").length;
  const policySkipped = skipped.filter(s => s.category !== "DS").length;
  const policyInScope = allItems.length - policyOOS - policySkipped;
  const dsChecked = noDS ? 0 : dsAutoRules.length - skipped.filter(s => s.category === "DS").length;
  const adjustedPolicyPer = policyInScope > 0 ? POLICY_MAX / policyInScope : 0;
  const adjustedDsPer = dsChecked > 0 ? DS_MAX / dsChecked : 0;

  let adjPolicyLost = 0, adjDsLost = 0;
  issues.forEach(iss => {
    if (iss.stage === "Policy") { const d = +adjustedPolicyPer.toFixed(2); iss.deduction = d; adjPolicyLost += d; }
    else if (iss.stage === "DS") { const d = +adjustedDsPer.toFixed(1); iss.deduction = d; adjDsLost += d; }
  });

  const totalScore = Math.max(0, Math.min(100, Math.round(100 - adjPolicyLost - adjDsLost)));
  const verdict = totalScore >= 70 ? "PASS" : "FAIL";

  return {
    score: totalScore, verdict,
    breakdown: { policy: Math.round(Math.max(0, POLICY_MAX - adjPolicyLost)), policyMax: POLICY_MAX, ds: Math.round(Math.max(0, DS_MAX - adjDsLost)), dsMax: DS_MAX, policyDetail: policyBreakdown },
    issues: issues.sort((a, b) => (b.deduction || 0) - (a.deduction || 0)),
    passes, skipped, outOfScope,
    scoredCount: policyInScope + dsChecked,
    skippedCount: skipped.length,
    outOfScopeCount: outOfScope.length,
    total: issues.length + passes.length,
  };
}

function parseAIJSON(raw) {
  var j = raw.replace(/```json/g,"").replace(/```/g,"").trim();
  try { return JSON.parse(j); } catch(e1) {
    var s=j.indexOf("{"), e2=j.lastIndexOf("}");
    if(s>=0&&e2>s){var sub=j.substring(s,e2+1);try{return JSON.parse(sub);}catch(e3){
      var ob=(sub.match(/{/g)||[]).length-(sub.match(/}/g)||[]).length;
      var oa=(sub.match(/\[/g)||[]).length-(sub.match(/\]/g)||[]).length;
      var f=sub; for(var i=0;i<oa;i++)f+="]"; for(var k=0;k<ob;k++)f+="}";
      try{return JSON.parse(f);}catch(e4){}
    }}
  }
  return null;
}

async function runAIAudit(screenName, opts) {
  var mode = opts.mode || "image";
  var imageBase64 = opts.image || null;
  var figmaUrl = opts.figmaUrl || null;
  var pageUrl = opts.pageUrl || null;
  var serviceType = opts.serviceType || "brand";

  var allItems = buildAllPolicyItems();
  var dsAuto = DS_RULES.filter(function(r){return r.auto;});
  var noDS = mode==="prototype" || serviceType==="linked" || serviceType==="usability";
  var extra = mode==="figma" ? figmaUrl : (mode==="url"||mode==="prototype") ? pageUrl : "";
  var prompt = buildAuditPrompt(screenName, allItems, noDS ? [] : dsAuto, mode, extra, serviceType);

  var messages = [{role:"user",content:[]}];
  if ((mode==="image"||mode==="figma") && imageBase64) {
    var mt = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
    messages[0].content.push({type:"image",source:{type:"base64",media_type:mt,data:imageBase64.split(",")[1]}});
  }
  messages[0].content.push({type:"text",text:prompt});

  var apiBody = {model:"claude-sonnet-4-20250514",max_tokens:16000,temperature:0,messages:messages};
  if (mode==="figma"&&figmaUrl) { apiBody.mcp_servers=[{type:"url",url:"https://mcp.figma.com/mcp",name:"figma-mcp"}]; }
  if (mode==="url"||mode==="prototype") { apiBody.tools=[{type:"web_search_20250305",name:"web_search"}]; }

  try {
    var response = await fetch("/api/audit", {
      method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(apiBody),
    });
    if (!response.ok) { var eb=await response.text().catch(function(){return "";}); throw new Error("API "+response.status+": "+eb.substring(0,200)); }
    var data = await response.json();

    // Find last text block (final JSON output)
    var lastText = "";
    for (var bi=(data.content||[]).length-1;bi>=0;bi--) {
      if (data.content[bi].type==="text"&&data.content[bi].text) { lastText=data.content[bi].text; break; }
    }
    var allText = (data.content||[]).map(function(c){return c.text||"";}).join("");
    var textToParse = lastText || allText;
    if (!textToParse||textToParse.length<10) throw new Error("AI 응답이 비어 있습니다.");

    var parsed = parseAIJSON(textToParse) || parseAIJSON(allText);
    if (!parsed) throw new Error("AI 응답 파싱 실패. 다시 시도해 주세요.");

    var aiResults = (parsed.r||parsed.results||[]).map(function(r) {
      var v=r.v||r.verdict||"s";
      return {id:r.id, verdict:v==="p"?"pass":v==="f"?"fail":v==="s"?"skip":v==="o"?"o":v, reason:r.m||r.reason||""};
    });

    var a=parsed.a||parsed.screen_analysis||{};
    var result = scoreFromAIResults(aiResults, mode, serviceType);
    result.screenAnalysis = {purpose:a.p||a.purpose||"",target_user:a.u||a.target_user||"",key_features:a.f||a.key_features||[],content_type:a.t||a.content_type||"",screenType:a.st||"",screens:a.sc||0,flow:a.fl||"",boundary:a.bd||""};
    result.expertOpinions = a.expert || [];
    result.auditMode = mode;
    result.serviceType = serviceType;
    result.timestamp = new Date().toLocaleString("ko-KR");
    return result;
  } catch (err) {
    console.error("AI Audit error:",err);
    return {score:0,verdict:"ERROR",auditMode:mode,breakdown:{policy:0,policyMax:60,ds:0,dsMax:40,policyDetail:{}},issues:[],passes:[],skipped:[],outOfScope:[],scoredCount:0,skippedCount:0,outOfScopeCount:0,total:0,error:String(err.message||err),timestamp:new Date().toLocaleString("ko-KR")};
  }
}

// ═══════════════════════════════════════════
// RESULT DETAIL POPUP
// ═══════════════════════════════════════════
function ResultPopup({ result, onClose }) {
  if (!result) return null;
  const isPASS = result.verdict === "PASS";
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [openSections, setOpenSections] = useState({ issues: true, passes: false, skipped: false, oos: false });
  const issuesRef = useRef(); const passesRef = useRef(); const skippedRef = useRef(); const oosRef = useRef();
  const refsMap = { issues: issuesRef, passes: passesRef, skipped: skippedRef, oos: oosRef };

  const scrollTo = (key) => {
    setOpenSections(p => ({ ...p, [key]: true }));
    setTimeout(() => { refsMap[key]?.current?.scrollIntoView({ behavior: "smooth", block: "start" }); }, 80);
  };

  const catColors = { "UX Policy": { c: "#0891B2", bg: "#ECFEFF" }, "UX Checklist": { c: "#7C3AED", bg: "#F5F3FF" }, "UI Checklist": { c: "#D97706", bg: "#FFFBEB" }, "DS": { c: "#6B7280", bg: "#F3F4F6" } };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
      <div style={{ position: "relative", width: "92%", maxWidth: 1100, height: "88vh", background: SURFACE, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: TEXT1 }}>Audit Report</span>
            <span style={{ fontSize: 12, color: TEXT3 }}>{result.input?.screenName || "-"}</span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{result.verdict}</span>
            {result.auditMode && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: result.auditMode==="figma"?"#EDE9FE":result.auditMode==="prototype"?"#F5F3FF":result.auditMode==="url"?"#DBEAFE":"#F3F4F6", color: result.auditMode==="figma"?"#7C3AED":result.auditMode==="prototype"?"#6D28D9":result.auditMode==="url"?"#2563EB":"#6B7280", fontWeight: 600 }}>{result.auditMode==="figma"?"Figma":result.auditMode==="prototype"?"Proto":result.auditMode==="url"?"URL":"Image"}</span>}
            {result.serviceType && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: result.serviceType==="brand"?BRAND_LOW:result.serviceType==="linked"?"#F5F3FF":"#ECFDF5", color: result.serviceType==="brand"?BRAND:result.serviceType==="linked"?"#7C3AED":"#059669", fontWeight: 600 }}>{result.serviceType==="brand"?"브랜드":result.serviceType==="linked"?"연계":result.serviceType==="usability"?"사용성":""}</span>}
          </div>
          <button onClick={onClose} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE, cursor: "pointer", fontSize: 16, color: TEXT3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
        </div>

        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* LEFT */}
          <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", borderRight: `1px solid ${BORDER}` }}>
            {/* Score */}
            <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 20, padding: 18, borderRadius: 12, background: isPASS ? "#F0FDF4" : "#FFF5F5", border: `1px solid ${isPASS ? "#BBF7D0" : "#FECACA"}` }}>
              <div style={{ position: "relative", width: 80, height: 80, flexShrink: 0 }}>
                <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                  <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="7" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke={isPASS ? "#059669" : "#DC2626"} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${result.score * 2.64} 264`} />
                </svg>
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: TEXT1 }}>{result.score}</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 700, color: isPASS ? "#059669" : "#DC2626", marginBottom: 4 }}>{isPASS ? "PASS" : "FAIL"}</div>
                <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                  <span style={{ color: "#0891B2" }}>Policy <b>{result.breakdown.policy}</b>/{result.breakdown.policyMax}</span>
                  {result.breakdown.dsMax > 0 && <span style={{ color: "#6B7280" }}>DS <b>{result.breakdown.ds}</b>/{result.breakdown.dsMax}</span>}
                </div>
              </div>
            </div>

            {/* AI Analysis */}
            {result.screenAnalysis && (
              <div style={{ padding: "12px 14px", borderRadius: 8, background: "#F0F9FF", border: "1px solid #BAE6FD", marginBottom: 12, fontSize: 12, color: TEXT2, lineHeight: 1.6 }}>
                <b style={{ color: "#0369A1" }}>AI 분석</b> — {result.screenAnalysis.purpose} · {result.screenAnalysis.screenType || result.screenAnalysis.content_type}
              </div>
            )}

            {/* Clickable Chips */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              {[
                { key: "issues", label: "이슈", count: result.issues.length, bg: "#FEF2F2", c: "#DC2626" },
                { key: "passes", label: "통과", count: result.passes.length, bg: "#ECFDF5", c: "#059669" },
                ...(result.skippedCount > 0 ? [{ key: "skipped", label: "판단불가", count: result.skippedCount, bg: "#FEF3C7", c: "#92400E" }] : []),
                ...(result.outOfScopeCount > 0 ? [{ key: "oos", label: "범위밖", count: result.outOfScopeCount, bg: "#EDE9FE", c: "#6D28D9" }] : []),
              ].map(ch => (
                <span key={ch.key} onClick={() => scrollTo(ch.key)} style={{
                  fontSize: 11, padding: "5px 12px", borderRadius: 6, background: ch.bg, color: ch.c, cursor: "pointer",
                  border: openSections[ch.key] ? `1.5px solid ${ch.c}` : "1.5px solid transparent",
                  fontWeight: openSections[ch.key] ? 700 : 500, transition: "all .15s",
                }}>{ch.label} {ch.count}</span>
              ))}
            </div>

            {/* Issues Section */}
            <div ref={issuesRef}>
              <h3 onClick={() => setOpenSections(p => ({...p, issues: !p.issues}))} style={{ fontSize: 13, fontWeight: 600, color: "#DC2626", margin: "0 0 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, transform: openSections.issues?"rotate(90deg)":"rotate(0)", transition: "transform .15s", display: "inline-block" }}>▸</span>
                {isPASS ? "보완 권장사항" : "이슈"} ({result.issues.length})
              </h3>
              {openSections.issues && <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 16 }}>
                {result.issues.map((iss, i) => {
                  const sc = catColors[iss.category] || catColors.DS;
                  const isSel = selectedIssue === i;
                  return (
                    <div key={i} onClick={() => setSelectedIssue(isSel ? null : i)} style={{
                      background: isSel ? "#FFF5F5" : "#fff", border: `1px solid ${isSel ? "#FCA5A5" : BORDER}`, borderRadius: 8,
                      padding: "10px 12px", borderLeft: `3px solid ${sc.c}`, cursor: "pointer", transition: "all .1s",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: sc.bg, color: sc.c }}>{iss.category}</span>
                        {iss.pillarName && <span style={{ fontSize: 10, color: TEXT3 }}>{iss.pillarName}</span>}
                        {iss.cat && <span style={{ fontSize: 10, color: TEXT3 }}>{iss.cat}</span>}
                        <span style={{ fontSize: 10, color: BRAND, fontWeight: 600, marginLeft: "auto" }}>-{(iss.deduction||0).toFixed(1)}</span>
                        {isSel && <span style={{ fontSize: 8, padding: "1px 5px", borderRadius: 3, background: "#DC2626", color: "#fff" }}>선택</span>}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500 }}>{iss.msg}</div>
                      {iss.fix && <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>→ {iss.fix}</div>}
                    </div>
                  );
                })}
              </div>}
            </div>

            {/* Passes Section */}
            <div ref={passesRef}>
              <h3 onClick={() => setOpenSections(p => ({...p, passes: !p.passes}))} style={{ fontSize: 13, fontWeight: 600, color: "#059669", margin: "0 0 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10, transform: openSections.passes?"rotate(90deg)":"rotate(0)", transition: "transform .15s", display: "inline-block" }}>▸</span>
                통과 ({result.passes.length})
              </h3>
              {openSections.passes && <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16 }}>
                {result.passes.map((p, i) => (
                  <div key={i} style={{ padding: "5px 10px", borderRadius: 6, background: "#F0FDF4", fontSize: 12, color: "#065F46" }}>
                    <span style={{ fontWeight: 700 }}>✓ </span>{p.msg}
                    {p.aiReason && <span style={{ fontSize: 11, color: "#059669", marginLeft: 6 }}>({p.aiReason})</span>}
                  </div>
                ))}
              </div>}
            </div>

            {/* Skipped Section */}
            {result.skipped && result.skipped.length > 0 && (
              <div ref={skippedRef}>
                <h3 onClick={() => setOpenSections(p => ({...p, skipped: !p.skipped}))} style={{ fontSize: 13, fontWeight: 600, color: "#92400E", margin: "0 0 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, transform: openSections.skipped?"rotate(90deg)":"rotate(0)", transition: "transform .15s", display: "inline-block" }}>▸</span>
                  판단불가 ({result.skipped.length})
                </h3>
                {openSections.skipped && <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16 }}>
                  {result.skipped.map((s, i) => (
                    <div key={i} style={{ padding: "5px 10px", borderRadius: 6, background: "#FFFBEB", border: "1px dashed #FDE68A", fontSize: 12, color: "#92400E" }}>— {s.msg}{s.reason && <span style={{ color: "#B45309", marginLeft: 4 }}>({s.reason})</span>}</div>
                  ))}
                </div>}
              </div>
            )}

            {/* Out of Scope Section */}
            {result.outOfScope && result.outOfScope.length > 0 && (
              <div ref={oosRef}>
                <h3 onClick={() => setOpenSections(p => ({...p, oos: !p.oos}))} style={{ fontSize: 13, fontWeight: 600, color: "#6D28D9", margin: "0 0 8px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontSize: 10, transform: openSections.oos?"rotate(90deg)":"rotate(0)", transition: "transform .15s", display: "inline-block" }}>▸</span>
                  범위밖 ({result.outOfScope.length})
                </h3>
                {openSections.oos && <div style={{ display: "flex", flexDirection: "column", gap: 3, marginBottom: 16 }}>
                  {result.outOfScope.map((s, i) => (
                    <div key={i} style={{ padding: "5px 10px", borderRadius: 6, background: "#F5F3FF", border: "1px dashed #DDD6FE", fontSize: 12, color: "#6D28D9" }}>○ {s.msg}{s.reason && <span style={{ color: "#7C3AED", marginLeft: 4 }}>({s.reason})</span>}</div>
                  ))}
                </div>}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div style={{ width: 380, flexShrink: 0, overflowY: "auto", padding: "20px 24px", background: BG }}>
            {/* Image with issue overlay */}
            {result.input?.imagePreview && (
              <div style={{ background: SURFACE, borderRadius: 10, padding: 10, border: `1px solid ${selectedIssue !== null ? "#FCA5A5" : BORDER}`, marginBottom: 16, transition: "border-color .2s" }}>
                <div style={{ position: "relative" }}>
                  <img src={result.input.imagePreview} style={{ width: "100%", borderRadius: 8, display: "block" }} alt="" />
                  {selectedIssue !== null && result.issues[selectedIssue] && (
                    <div style={{ position: "absolute", inset: 0, borderRadius: 8, border: "2.5px solid #DC2626", background: "rgba(220,38,38,0.05)" }}>
                      <div style={{ position: "absolute", bottom: 8, left: 8, right: 8, background: "rgba(220,38,38,0.93)", borderRadius: 8, padding: "10px 12px", color: "#fff", fontSize: 11, lineHeight: 1.5 }}>
                        <div style={{ fontWeight: 700, marginBottom: 2, display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", color: "#DC2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>{selectedIssue + 1}</span>
                          {result.issues[selectedIssue].category}
                        </div>
                        <div>{result.issues[selectedIssue].msg}</div>
                        {result.issues[selectedIssue].fix && <div style={{ color: "#FCA5A5", marginTop: 3 }}>→ {result.issues[selectedIssue].fix}</div>}
                      </div>
                    </div>
                  )}
                </div>
                {selectedIssue === null && <div style={{ fontSize: 10, color: TEXT3, marginTop: 6, textAlign: "center" }}>좌측 이슈 항목을 클릭하면 여기에 표시됩니다</div>}
              </div>
            )}

            {/* Info */}
            <div style={{ background: SURFACE, borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 2 }}>화면명</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{result.input?.screenName || "-"}</div>
            </div>
            {result.input?.url && <div style={{ background: SURFACE, borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 2 }}>URL</div>
              <div style={{ fontSize: 11, color: "#2563EB", wordBreak: "break-all" }}>{result.input.url}</div>
            </div>}

            {/* Breakdown Bars */}
            <div style={{ background: SURFACE, borderRadius: 10, padding: 14, border: `1px solid ${BORDER}`, marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>배점</div>
              {[{ label: "Policy", max: result.breakdown.policyMax, val: result.breakdown.policy, color: "#0891B2" },
                ...(result.breakdown.dsMax > 0 ? [{ label: "DS", max: result.breakdown.dsMax, val: result.breakdown.ds, color: "#6B7280" }] : []),
              ].map((b, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: TEXT2 }}>{b.label}</span><span style={{ fontWeight: 600, color: b.color }}>{b.val}/{b.max}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: BORDER }}><div style={{ height: 5, borderRadius: 3, background: b.color, width: `${(b.val/b.max)*100}%` }} /></div>
                </div>
              ))}
            </div>
            {result.breakdown.policyDetail && <div style={{ background: SURFACE, borderRadius: 10, padding: 14, border: `1px solid ${BORDER}` }}>
              <div style={{ fontSize: 11, color: TEXT3, marginBottom: 8 }}>Policy 세부</div>
              {Object.entries(result.breakdown.policyDetail).map(([n, d], i) => {
                const cc = {"UX Policy":"#0891B2","UX Checklist":"#7C3AED","UI Checklist":"#D97706"}[n];
                const pr = d.total > 0 ? Math.round(((d.total-d.fail)/d.total)*100) : 100;
                return <div key={i} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 2 }}>
                    <span style={{ color: TEXT2 }}>{n}</span><span style={{ fontSize: 10, color: cc }}>{d.total-d.fail}/{d.total} · {pr}%</span>
                  </div>
                  <div style={{ height: 4, borderRadius: 2, background: BORDER }}><div style={{ height: 4, borderRadius: 2, background: cc, width: `${pr}%` }} /></div>
                </div>;
              })}
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// AUDIT PAGE
// ═══════════════════════════════════════════
function AuditPage({ archive, onAddResult, onNav, serviceType, flows, setActiveFlowId, setFlowServiceType }) {
  const svcCfg = {
    brand: { title: "브랜드 서비스 검수", desc: "UX Policy + Self Checklist + Design System 전체 적용", color: BRAND, scope: "Policy(60) + DS(40) = 100점" },
    linked: { title: "연계 서비스 검수", desc: "UX Policy + Self Checklist만 적용 · DS Rules 채점 제외", color: "#7C3AED", scope: "Policy 100점 (DS 제외)" },
    usability: { title: "사용성 검증", desc: "UX Policy + Self Checklist + 통상적·학술적 UX 룰 적용", color: "#059669", scope: "Policy 100점 (사용성 관점)" },
  }[serviceType] || { title: "UX Audit Engine", desc: "검수 모드를 선택하세요", color: BRAND, scope: "" };
  const [inputType, setInputType] = useState("flow");
  const [figmaUrl, setFigmaUrl] = useState("");
  const [screenName, setScreenName] = useState("");
  const [urlValue, setUrlValue] = useState("");
  const [urlType, setUrlType] = useState("prototype");
  const [jsonValue, setJsonValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageForApi, setImageForApi] = useState(null);
  const [popupResult, setPopupResult] = useState(null);
  const [error, setError] = useState(null);
  const [figmaConnected, setFigmaConnected] = useState(false);
  const fileRef = useRef();

  const resizeImage = useCallback((dataUrl, maxSize) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width <= maxSize && height <= maxSize) { resolve(dataUrl); return; }
        const scale = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = dataUrl;
    });
  }, []);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (file) {
      const r = new FileReader();
      r.onload = async (ev) => {
        const original = ev.target.result;
        setImagePreview(original);
        const compressed = await resizeImage(original, 2000);
        setImageForApi(compressed);
      };
      r.readAsDataURL(file);
    }
  }, [resizeImage]);

  const resetAll = () => {
    setFigmaUrl(""); setScreenName(""); setUrlValue(""); setUrlType("prototype"); setJsonValue(""); setImagePreview(null); setImageForApi(null); setFigmaConnected(false); setError(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const connectFigma = () => {
    if (!figmaUrl) return;
    setFigmaConnected(false);
    setTimeout(() => setFigmaConnected(true), 1200);
  };

  const doAudit = async () => {
    const name = screenName || "화면 검수";
    setLoading(true); setError(null);

    const baseMsgs = ["화면 콘텐츠 분석 중...", "화면 목적과 구조 파악 중...", "UX Policy 검수 중...", "UI 체크리스트 검증 중...", "DS 규칙 확인 중...", "점수 산출 중..."];
    const figmaMsgs = ["Figma MCP 연결 중...", "프레임 구조 분석 중...", "디자인 토큰 검증 중...", "컴포넌트 variant 확인 중...", "화면 플로우 검수 중...", "점수 산출 중..."];
    const urlMsgs = ["URL 페이지 로딩 중...", "페이지 구조 분석 중...", "인터랙션 패턴 확인 중...", "네비게이션 플로우 검수 중...", "UX Policy 검증 중...", "점수 산출 중..."];
    const protoMsgs = ["프로토타입 URL 접속 중...", "화면 플로우 탐색 중...", "인터랙션 요소 작동 확인 중...", "네비게이션 연결 검수 중...", "사용성 항목 평가 중...", "점수 산출 중..."];
    const msgs = inputType === "figma" ? figmaMsgs : inputType === "url" ? (urlType === "prototype" ? protoMsgs : urlMsgs) : baseMsgs;
    let mi = 0;
    setLoadingMsg(msgs[0]);
    const interval = setInterval(() => { mi = Math.min(mi + 1, msgs.length - 1); setLoadingMsg(msgs[mi]); }, 3000);

    try {
      const res = await runAIAudit(name, {
        mode: inputType === "figma" ? "figma" : inputType === "url" ? (urlType === "prototype" ? "prototype" : "url") : "image",
        image: imageForApi || null,
        figmaUrl: figmaUrl || null,
        pageUrl: urlValue || null,
        serviceType: serviceType || "brand",
      });
      clearInterval(interval);

      if (res.error) {
        setError(res.error);
        setLoading(false);
        return;
      }

      res.input = { type: inputType, screenName: name, imagePreview, url: urlValue, figmaUrl: figmaUrl || null, serviceType: serviceType };
      res.id = Date.now();
      onAddResult(res);
      setPopupResult(res);
    } catch (err) {
      clearInterval(interval);
      setError("AI 분석 중 오류가 발생했습니다: " + err.message);
    }
    setLoading(false);
  };

  const canRun = inputType === "figma" ? (figmaConnected && !!screenName.trim()) : inputType === "image" ? (!!imagePreview && !!screenName.trim()) : inputType === "url" ? (!!urlValue.trim() && !!screenName.trim()) : !!screenName.trim();

  // 탭 아이콘 SVGs (피그마 원본 18×18)
  const tabIcons = {
    figma: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M9.12891 1.5C9.72556 1.50006 10.2978 1.73728 10.7197 2.15918L14.3408 5.78027C14.7627 6.20218 14.9999 6.77444 15 7.37109V14.25C15 15.4926 13.9926 16.5 12.75 16.5H5.25C4.00736 16.5 3 15.4926 3 14.25V3.75C3 2.50736 4.00736 1.5 5.25 1.5H9.12891ZM5.25 3C4.83579 3 4.5 3.33579 4.5 3.75V14.25C4.5 14.6642 4.83579 15 5.25 15H12.75C13.1642 15 13.5 14.6642 13.5 14.25V7.5H10.5C9.67157 7.5 9 6.82843 9 6V3H5.25ZM10.5 6H12.4395L10.5 4.06055V6Z" fill="currentColor" /></svg>,
    flow: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path fillRule="evenodd" clipRule="evenodd" d="M13.875 2.25C15.3247 2.25 16.5 3.42525 16.5 4.875C16.5 6.32475 15.3247 7.5 13.875 7.5C12.6996 7.5 11.7046 6.72742 11.3701 5.66235H9.75V10.7812C9.75 11.3836 10.1873 11.8817 10.7615 11.9802C11.1867 11.1039 12.0856 10.5 13.125 10.5C14.5747 10.5 15.75 11.6753 15.75 13.125C15.75 14.5747 14.5747 15.75 13.125 15.75C11.7897 15.75 10.6877 14.7529 10.522 13.4626C9.23308 13.2495 8.25 12.1306 8.25 10.7812V5.66235H6.62988C6.29543 6.72742 5.30044 7.5 4.125 7.5C2.67525 7.5 1.5 6.32475 1.5 4.875C1.5 3.42525 2.67525 2.25 4.125 2.25C5.32765 2.25 6.34049 3.05903 6.65112 4.16235H11.3489C11.6595 3.05903 12.6723 2.25 13.875 2.25ZM13.125 12C12.5037 12 12 12.5037 12 13.125C12 13.7463 12.5037 14.25 13.125 14.25C13.7463 14.25 14.25 13.7463 14.25 13.125C14.25 12.5037 13.7463 12 13.125 12ZM13.875 3.75C13.2537 3.75 12.75 4.25368 12.75 4.875C12.75 5.49632 13.2537 6 13.875 6C14.4963 6 15 5.49632 15 4.875C15 4.25368 14.4963 3.75 13.875 3.75Z" fill="currentColor" /></svg>,
    image: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M10.125 5.625C10.3929 5.62501 10.6407 5.76798 10.7747 6L13.6978 11.0625C13.8317 11.2945 13.8317 11.5805 13.6978 11.8125C13.5638 12.0446 13.316 12.1875 13.0481 12.1875H4.85156C4.57432 12.1875 4.31969 12.0345 4.18945 11.7898C4.05923 11.545 4.07485 11.2485 4.22974 11.0186L6.50317 7.64355L6.55957 7.56958C6.70097 7.40734 6.9068 7.31251 7.125 7.3125C7.37446 7.3125 7.60743 7.43667 7.74683 7.64355L8.16577 8.26611L9.47534 6C9.60933 5.768 9.85709 5.625 10.125 5.625Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M14.25 2.625C15.4926 2.625 16.5 3.63236 16.5 4.875V13.125C16.5 14.3676 15.4926 15.375 14.25 15.375H3.75C2.54617 15.375 1.56316 14.4296 1.50293 13.2407L1.5 13.125V4.875C1.5 3.63236 2.50736 2.625 3.75 2.625H14.25ZM3.75 4.125C3.33579 4.125 3 4.46079 3 4.875V13.125L3.00366 13.2019C3.04216 13.58 3.36174 13.875 3.75 13.875H14.25C14.6642 13.875 15 13.5392 15 13.125V4.875C15 4.46079 14.6642 4.125 14.25 4.125H3.75Z" fill="currentColor"/></svg>,
    url: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M4.93906 7.06158C5.23195 6.76869 5.70745 6.76869 6.00034 7.06158C6.293 7.35443 6.29301 7.82928 6.00034 8.12213L3.87851 10.2432C2.70698 11.4148 2.70705 13.3146 3.87851 14.4861C5.05009 15.6577 6.94986 15.6577 8.12143 14.4861L10.2425 12.365C10.5354 12.0722 11.0102 12.0722 11.3031 12.365C11.596 12.6579 11.596 13.1327 11.3031 13.4256L9.18198 15.5467C7.42462 17.304 4.57533 17.304 2.81797 15.5467C1.06071 13.7893 1.06064 10.94 2.81797 9.18267L4.93906 7.06158Z" fill="currentColor"/><path d="M10.7721 6.53131C11.065 6.23841 11.5405 6.23841 11.8333 6.53131C12.126 6.82416 12.126 7.29901 11.8333 7.59185L7.59043 11.8348C7.29758 12.1275 6.82275 12.1274 6.52988 11.8348C6.23703 11.5419 6.23711 11.0671 6.52988 10.7742L10.7721 6.53131Z" fill="currentColor"/><path d="M9.18125 2.81793C10.9386 1.06068 13.7879 1.0607 15.5453 2.81793C17.3026 4.57526 17.3025 7.42458 15.5453 9.18194L13.4242 11.3038C13.1314 11.5965 12.6565 11.5963 12.3636 11.3038C12.0707 11.0109 12.0707 10.5354 12.3636 10.2425L14.4847 8.12139C15.6562 6.94982 15.6563 5.05002 14.4847 3.87847C13.3132 2.70703 11.4133 2.70702 10.2418 3.87847L8.1207 6.0003C7.82786 6.29307 7.35304 6.293 7.06015 6.0003C6.76728 5.70743 6.76732 5.23265 7.06015 4.93975L9.18125 2.81793Z" fill="currentColor"/></svg>,
    json: <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 10.8743C9.41421 10.8743 9.75 11.2101 9.75 11.6243C9.75 12.0385 9.41421 12.3743 9 12.3743H5.24927C4.83507 12.3742 4.49927 12.0385 4.49927 11.6243C4.49927 11.2101 4.83507 10.8743 5.24927 10.8743H9Z" fill="currentColor"/><path d="M12.75 10.8743C13.1642 10.8743 13.5 11.2101 13.5 11.6243C13.5 12.0385 13.1642 12.3743 12.75 12.3743H11.25C10.8358 12.3743 10.5 12.0385 10.5 11.6243C10.5 11.2101 10.8358 10.8743 11.25 10.8743H12.75Z" fill="currentColor"/><path d="M6.75 8.25C7.16409 8.2502 7.5 8.58595 7.5 9C7.4998 9.41421 7.16348 9.7502 6.74927 9.75L5.25 9.74927C4.83591 9.74907 4.5 9.41331 4.5 8.99927C4.5002 8.58518 4.83595 8.24926 5.25 8.24927L6.75 8.25Z" fill="currentColor"/><path d="M12.75 8.24927C13.1642 8.24927 13.5 8.58505 13.5 8.99927C13.5 9.41348 13.1642 9.74927 12.75 9.74927H9C8.58579 9.74927 8.25 9.41348 8.25 8.99927C8.25 8.58505 8.58579 8.24927 9 8.24927H12.75Z" fill="currentColor"/><path fillRule="evenodd" clipRule="evenodd" d="M14.25 2.625C15.4926 2.625 16.5 3.63236 16.5 4.875V13.125C16.5 14.3676 15.4926 15.375 14.25 15.375H3.75C2.54617 15.375 1.56316 14.4296 1.50293 13.2407L1.5 13.125V4.875C1.5 3.63236 2.50736 2.625 3.75 2.625H14.25ZM3.75 4.125C3.33579 4.125 3 4.46079 3 4.875V13.125L3.00366 13.2019C3.04216 13.58 3.36174 13.875 3.75 13.875H14.25C14.6642 13.875 15 13.5392 15 13.125V4.875C15 4.46079 14.6642 4.125 14.25 4.125H3.75Z" fill="currentColor"/></svg>,
  };

  const inputTabs = [
    { id: "figma", label: "Figma 링크" },
    { id: "flow", label: "Figma 플로우" },
    { id: "image", label: "이미지 업로드" },
    { id: "url", label: "URL 입력" },
    { id: "json", label: "JSON Schema" },
  ];

  return (
    <div style={{ padding: "45px 0 45px 72px", maxWidth: 1288, overflowY: "auto", fontFamily: "'Pretendard',system-ui,sans-serif" }}>
      {/* Header: title gap 4px */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#000", margin: 0, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{svcCfg.title}</h1>
        <p style={{ color: "#747474", margin: 0, fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{svcCfg.desc}</p>
      </div>

      {/* 상단 카드: bg #FCFCFC, radius 12, shadow, padding 22px 0 80px, gap 52px */}
      <div style={{ background: "#FCFCFC", borderRadius: 12, boxShadow: "0px 4px 24px rgba(0,0,0,0.02)", padding: "22px 0 80px", display: "flex", flexDirection: "column", alignItems: "center", gap: 52, marginBottom: 12 }}>

        {/* Input Type Tabs: row, gap 8, padding 0 24px */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", alignSelf: "stretch", padding: "0 24px" }}>
          {inputTabs.map(t => {
            const isSelected = inputType === t.id;
            return (
              <button key={t.id} onClick={() => setInputType(t.id)} style={{
                display: "flex", justifyContent: "center", alignItems: "center", gap: 6,
                padding: "12px 16px", borderRadius: 4, border: "none",
                background: isSelected ? "#F2F2F2" : "transparent",
                color: isSelected ? "#1A1A1A" : "#747474",
                fontSize: 14, fontWeight: 700, lineHeight: 1.5,
                cursor: "pointer", fontFamily: "inherit",
              }}>{tabIcons[t.id]} {t.label}</button>
            );
          })}
        </div>

        {/* 콘텐츠 영역 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", alignSelf: "stretch", padding: "0 24px" }}>

        {/* ── Figma 파일 연결 ── */}
        {inputType === "figma" && (
          <div>
            {/* Step 1: Figma URL + Connect */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: figmaConnected ? "#059669" : BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>1</span>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>Figma 파일 URL</label>
                {figmaConnected && <span style={{ fontSize: 11, padding: "2px 10px", borderRadius: 12, background: "#ECFDF5", color: "#059669", fontWeight: 600 }}>✓ 연결됨</span>}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input value={figmaUrl} onChange={e => { setFigmaUrl(e.target.value); setFigmaConnected(false); }}
                  placeholder="https://www.figma.com/design/FILE_KEY/..."
                  style={{ flex: 1, padding: "11px 14px", borderRadius: 8, border: `1px solid ${figmaConnected ? "#059669" : BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", background: BG, boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = BRAND} onBlur={e => e.target.style.borderColor = figmaConnected ? "#059669" : BORDER} />
                <button onClick={connectFigma} disabled={!figmaUrl.trim()} style={{
                  padding: "0 20px", borderRadius: 8, border: "none",
                  background: !figmaUrl.trim() ? "#E5E7EB" : figmaConnected ? "#059669" : TEXT1,
                  color: "#fff", fontSize: 12, fontWeight: 600, cursor: figmaUrl.trim() ? "pointer" : "default",
                  fontFamily: "inherit", whiteSpace: "nowrap",
                }}>{figmaConnected ? "✓ 연결 완료" : "연결"}</button>
              </div>
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 6 }}>
                Figma MCP를 통해 파일 구조, 프레임, 디자인 토큰, 컴포넌트 variant를 분석합니다.
              </div>
            </div>

            {/* Step 2: Screen Name + Screenshot */}
            <div style={{ opacity: figmaConnected ? 1 : 0.4, pointerEvents: figmaConnected ? "auto" : "none", transition: "opacity .3s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <span style={{ width: 22, height: 22, borderRadius: "50%", background: (figmaConnected && screenName) ? "#059669" : BRAND, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700 }}>2</span>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1 }}>검수 대상 화면명 + 스크린샷</label>
              </div>
              <input value={screenName} onChange={e => setScreenName(e.target.value)}
                placeholder="Figma 프레임 이름 또는 화면명 (예: 요금제 리스트)"
                style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG, marginBottom: 12 }} />
              <div style={{ marginBottom: 8, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["요금제 리스트", "요금제 비교", "가입 정보 입력", "사용량 대시보드", "청구서 상세", "설정", "약관 동의", "에러/Empty"].map(ex => (
                  <button key={ex} onClick={() => setScreenName(ex)} style={{ padding: "4px 10px", borderRadius: 4, border: `1px solid ${BORDER}`, background: "transparent", color: TEXT3, fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>{ex}</button>
                ))}
              </div>
              <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${imagePreview ? "#059669" : BORDER}`, borderRadius: 10, padding: imagePreview ? 12 : 20, textAlign: "center", cursor: "pointer", background: imagePreview ? "#F0FDF4" : "transparent" }}>
                {imagePreview ? <img src={imagePreview} style={{ maxWidth: "100%", maxHeight: 220, borderRadius: 8 }} alt="" /> : (
                  <><div style={{ fontSize: 13, fontWeight: 500, color: TEXT2 }}>프레임 스크린샷 업로드 (선택)</div>
                  <div style={{ fontSize: 11, color: TEXT3, marginTop: 4 }}>스크린샷을 함께 제공하면 시각적 분석이 추가됩니다</div></>
                )}
                <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
              </div>
              {figmaConnected && (
                <div style={{ marginTop: 12, padding: "12px 14px", borderRadius: 8, background: "#F0FDF4", border: "1px solid #BBF7D0", fontSize: 12, color: "#065F46" }}>
                  ✓ Figma 파일이 연결되었습니다. Figma MCP를 통해 프레임 구조, 디자인 토큰, 컴포넌트 variant를 자동 분석합니다.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── 이미지 업로드 ── */}
        {inputType === "image" && (
          <div>
            <div style={{ display: "flex", gap: 14, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명 (Context 분류용)</label>
                <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                  style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
              </div>
            </div>
            <div onClick={() => fileRef.current?.click()} style={{ border: `2px dashed ${BORDER}`, borderRadius: 10, padding: imagePreview ? 12 : 36, textAlign: "center", cursor: "pointer" }}>
              {imagePreview ? <img src={imagePreview} style={{ maxWidth: "100%", maxHeight: 280, borderRadius: 8 }} alt="" /> : (
                <><div style={{ fontSize: 32, marginBottom: 8 }}>📁</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: TEXT2 }}>화면 캡처 이미지를 업로드하세요</div>
                <div style={{ fontSize: 11, color: TEXT3, marginTop: 4 }}>PNG, JPG — Figma Export, 스크린샷 등</div></>
              )}
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handleFile} />
            </div>
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: "#FEF3C7", border: "1px solid #FDE68A", fontSize: 12, color: "#92400E" }}>
              이미지 기반 검수는 시각적 요소(레이아웃, 컬러, 타이포, 컴포넌트 구성)를 분석합니다. 동적 인터랙션 규칙은 가이드로만 제공됩니다.
            </div>
          </div>
        )}

        {/* ── URL ── */}
        {inputType === "url" && (
          <div>
            {/* URL Type Toggle */}
            <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
              {[
                { id: "prototype", label: "프로토타입 URL", desc: "Figma 프로토타입, InVision 등 — 사용성 검수만", color: "#7C3AED" },
                { id: "live", label: "라이브 URL", desc: "실제 서비스 페이지 — 코드/구조 포함 전체 검수", color: "#2563EB" },
              ].map(t => (
                <button key={t.id} onClick={() => setUrlType(t.id)} style={{
                  flex: 1, padding: "14px 16px", borderRadius: 10, border: "1.5px solid",
                  borderColor: urlType === t.id ? t.color : BORDER,
                  background: urlType === t.id ? t.color + "08" : SURFACE,
                  textAlign: "left", cursor: "pointer", fontFamily: "inherit",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: urlType === t.id ? t.color : TEXT1 }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: TEXT3, marginTop: 3 }}>{t.desc}</div>
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명</label>
              <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>{urlType === "prototype" ? "프로토타입 URL" : "서비스 URL"}</label>
            <input value={urlValue} onChange={e => setUrlValue(e.target.value)}
              placeholder={urlType === "prototype" ? "https://www.figma.com/proto/..." : "https://www.example.com/..."}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 14, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />

            {/* Mode Info */}
            <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, background: urlType === "prototype" ? "#F5F3FF" : "#EFF6FF", border: "1px solid " + (urlType === "prototype" ? "#DDD6FE" : "#BFDBFE"), fontSize: 12, color: urlType === "prototype" ? "#5B21B6" : "#1E40AF", lineHeight: 1.6 }}>
              {urlType === "prototype" ? (
                <>
                  <b>프로토타입 사용성 검수</b> — 범위 적응형 채점<br/>
                  AI가 먼저 프로토타입의 구현 범위(화면 수, 플로우, 미구현 영역)를 파악합니다.<br/>
                  구현된 범위 내 항목만 채점하고, 미구현 영역의 항목은 자동 제외됩니다. DS Rules 채점 제외.
                </>
              ) : (
                <>
                  <b>라이브 서비스 전체 검수</b> — 페이지 소스 + 인터랙션 분석<br/>
                  검수 범위: UX Policy + UI Checklist + DS Rules 전체<br/>
                  실제 페이지 구조, 반응형 레이아웃, 컴포넌트 상태, 접근성을 검증합니다.
                </>
              )}
            </div>
          </div>
        )}

        {/* ── JSON ── */}
        {inputType === "json" && (
          <div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>화면명 (Context 분류용)</label>
              <input value={screenName} onChange={e => setScreenName(e.target.value)} placeholder="예: 요금제 리스트"
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", outline: "none", boxSizing: "border-box", background: BG }} />
            </div>
            <label style={{ fontSize: 13, fontWeight: 600, color: TEXT1, display: "block", marginBottom: 8 }}>Input Schema (JSON)</label>
            <textarea value={jsonValue} onChange={e => setJsonValue(e.target.value)} rows={8} placeholder={`{\n  "screen_name": "요금제 리스트",\n  "metrics": { "plan_count": 6 },\n  "flags": { "has_comparison": false }\n}`}
              style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${BORDER}`, fontSize: 12, fontFamily: "monospace", outline: "none", boxSizing: "border-box", resize: "vertical", background: BG }} />
          </div>
        )}

        {/* ── Figma 플로우 ── */}
        {/* ── Figma 플로우: 빈 상태 (피그마 디자인) ── */}
        {inputType === "flow" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            {/* browserWindow 아이콘 100×100 */}
            <svg width="100" height="100" viewBox="0 0 100 100" fill="none" style={{ marginBottom: 0 }}>
              <path d="M14 23C14 21.3431 15.3431 20 17 20H83C84.6569 20 86 21.3431 86 23V77C86 78.6569 84.6569 80 83 80H17C15.3431 80 14 78.6569 14 77V23Z" fill="#EBE9E9"/>
              <path d="M20 51.9326C20 51.3803 20.4477 50.9326 21 50.9326H39C39.5523 50.9326 40 51.3803 40 51.9326V73.9326C40 74.4849 39.5523 74.9326 39 74.9326H21C20.4477 74.9326 20 74.4849 20 73.9326V51.9326Z" fill="#D6D5D5"/>
              <path d="M44 51.9326C44 51.3803 44.4477 50.9326 45 50.9326H79C79.5523 50.9326 80 51.3803 80 51.9326V73.9326C80 74.4849 79.5523 74.9326 79 74.9326H45C44.4477 74.9326 44 74.4849 44 73.9326V51.9326Z" fill="#D6D5D5"/>
              <path d="M20 39.9326C20 39.3803 20.4477 38.9326 21 38.9326H79C79.5523 38.9326 80 39.3803 80 39.9326V45.9326C80 46.4849 79.5523 46.9326 79 46.9326H21C20.4477 46.9326 20 46.4849 20 45.9326V39.9326Z" fill="#D6D5D5"/>
              <path d="M14 23C14 21.3431 15.3431 20 17 20H83C84.6569 20 86 21.3431 86 23V32.48C86 33.3195 85.3195 34 84.48 34H15.52C14.6805 34 14 33.3195 14 32.48V23Z" fill="#FF5DAE"/>
              <path d="M23.2705 29.5C24.6512 29.5 25.7705 28.3807 25.7705 27C25.7705 25.6193 24.6512 24.5 23.2705 24.5C21.8898 24.5 20.7705 25.6193 20.7705 27C20.7705 28.3807 21.8898 29.5 23.2705 29.5Z" fill="#CC267A"/>
              <path d="M31.2705 29.5C32.6512 29.5 33.7705 28.3807 33.7705 27C33.7705 25.6193 32.6512 24.5 31.2705 24.5C29.8898 24.5 28.7705 25.6193 28.7705 27C28.7705 28.3807 29.8898 29.5 31.2705 29.5Z" fill="#CC267A"/>
              <path d="M39.2705 29.5C40.6512 29.5 41.7705 28.3807 41.7705 27C41.7705 25.6193 40.6512 24.5 39.2705 24.5C37.8898 24.5 36.7705 25.6193 36.7705 27C36.7705 28.3807 37.8898 29.5 39.2705 29.5Z" fill="#CC267A"/>
            </svg>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18, fontWeight: 700, color: "#696969", lineHeight: 1.5 }}>Figma 플러그인에서 프레임을 전송하세요</span>
              <span style={{ fontSize: 14, fontWeight: 500, color: "#747474", lineHeight: "150%", textAlign: "center" }}>
                Figma에서 검수할 프레임을 선택하고 플러그인에서 검수 요청을 눌러주세요.<br/>수신된 프레임을 자동으로 검수합니다.
              </span>
            </div>
          </div>
        )}

        {/* ── 기타 입력 모드: Audit + Reset 버튼 ── */}
        {inputType !== "flow" && (
          <div style={{ display: "flex", gap: 10, alignItems: "center", padding: "0 24px", alignSelf: "stretch" }}>
            <button onClick={doAudit} disabled={loading || !canRun} style={{
              padding: "11px 28px", borderRadius: 8, border: "none",
              background: (loading || !canRun) ? "#D1D5DB" : `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`,
              color: "#fff", fontSize: 13, fontWeight: 600, cursor: (loading || !canRun) ? "default" : "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 8,
            }}>
              {loading ? <><span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin .8s linear infinite" }} />{loadingMsg}</> : "▶ AI Audit 실행"}
            </button>
            <button onClick={resetAll} style={{
              padding: "11px 20px", borderRadius: 8, border: `1px solid ${BORDER}`,
              background: SURFACE, color: TEXT2, fontSize: 13, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
            }}>↺ 초기화</button>
            {!loading && !canRun && (
              <span style={{ fontSize: 12, color: "#D97706" }}>{inputType==="figma" && !figmaConnected ? "Figma 파일을 먼저 연결하세요" : !screenName.trim() ? "화면명을 입력하세요" : !imagePreview && inputType==="image" ? "이미지를 업로드하세요" : "입력을 완료하세요"}</span>
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ margin: "0 24px", padding: "12px 16px", borderRadius: 8, background: "#FEF2F2", border: "1px solid #FECACA", fontSize: 12, color: "#DC2626" }}>
            ⚠ {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ padding: "20px", textAlign: "center" }}>
            <div style={{ width: 40, height: 40, border: "3px solid #E5E7EB", borderTopColor: BRAND, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
            <div style={{ fontSize: 14, fontWeight: 600, color: TEXT1, marginBottom: 4 }}>{inputType==="figma"?"Figma 파일을 분석하고 있습니다":inputType==="url"&&urlType==="prototype"?"프로토타입을 탐색하고 있습니다":inputType==="url"?"URL 페이지를 분석하고 있습니다":"AI가 화면을 분석하고 있습니다"}</div>
            <div style={{ fontSize: 12, color: TEXT3 }}>{loadingMsg}</div>
          </div>
        )}

        </div> {/* 콘텐츠 영역 닫기 */}
      </div> {/* 상단 카드 닫기 */}

      {/* 하단 카드: 최근 검수 이력 (피그마: bg #FCFCFC, radius 12, shadow, padding 22px 24px, gap 24px) */}
      {flows && flows.length > 0 && (
        <div style={{ background: "#FCFCFC", borderRadius: 12, boxShadow: "0px 4px 24px rgba(0,0,0,0.02)", padding: "22px 24px", display: "flex", flexDirection: "column", gap: 24 }}>
          {/* 헤더: space-between */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: "#474747", lineHeight: 1.3, letterSpacing: "-0.02em" }}>최근 검수 이력</span>
            <button onClick={() => { setFlowServiceType(serviceType); setActiveFlowId(null); onNav("flow-audit"); }} style={{ border: "none", background: "transparent", fontSize: 12, fontWeight: 500, color: "#747474", cursor: "pointer", fontFamily: "inherit", padding: 0 }}>전체보기</button>
          </div>
          {/* 갤러리: row, gap 12px */}
          <div style={{ display: "flex", gap: 12, overflowX: "auto" }}>
            {flows.map(f => {
              const lastIter = f.iterations[f.iterations.length - 1];
              const lastResult = lastIter?.result;
              const isPASS = lastResult?.verdict === "PASS";
              const hasResult = !!lastResult;
              return (
                <div key={f.id} onClick={() => { setFlowServiceType(serviceType); setActiveFlowId(f.id); onNav("flow-audit"); }} style={{
                  background: "#FCFCFC", border: "1px solid #EBEBEB", borderRadius: 8,
                  padding: 12, cursor: "pointer", display: "flex", flexDirection: "column", gap: 20,
                  width: 252, flexShrink: 0, transition: "all .15s",
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "#BDBDBD"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#EBEBEB"; }}
                >
                  {/* 상단: 플로우명 + 점수 */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#474747", lineHeight: "19px" }}>{f.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: "#747474", lineHeight: "14px" }}>{f.frames.length}개 화면 · {f.iterations.length}회차</span>
                    </div>
                    {hasResult && (
                      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
                        <span style={{ fontSize: 24, fontWeight: 700, color: isPASS ? "#018303" : "#DC2626", lineHeight: "29px" }}>{lastResult.score}점</span>
                      </div>
                    )}
                  </div>
                  {/* 하단: 썸네일 row gap 4, 54×54 radius 6 */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {f.frames.slice(0, 3).map((frame, fi) => (
                      <div key={fi} style={{ width: 54, height: 54, borderRadius: 6, background: "#D9D9D9", overflow: "hidden", flexShrink: 0 }}>
                        <img src={frame.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />
                      </div>
                    ))}
                    {f.frames.length > 3 && (
                      <div style={{ width: 54, height: 54, borderRadius: 6, background: "rgba(0,0,0,0.2)", position: "relative", overflow: "hidden", flexShrink: 0 }}>
                        {f.frames[3] && <img src={f.frames[3].image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />}
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <span style={{ fontSize: 12, fontWeight: 700, color: "#fff", textAlign: "center" }}>+{f.frames.length - 3}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {popupResult && <ResultPopup result={popupResult} onClose={() => setPopupResult(null)} />}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════
// RESULTS ARCHIVE PAGE
// ═══════════════════════════════════════════
function ResultsPage({ archive, onNav }) {
  const [popupResult, setPopupResult] = useState(null);
  return (
    <div style={{ padding: "36px 44px", maxWidth: 1140, overflowY: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Audit Results</h1>
          <p style={{ color: TEXT3, margin: 0, fontSize: 13 }}>검수 결과 아카이브 · {archive.length}건</p>
        </div>
        <button onClick={() => onNav("audit")} style={{
          padding: "8px 16px", borderRadius: 8, border: "none", background: `linear-gradient(135deg, ${BRAND}, ${BRAND_HIGH})`,
          color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
        }}>+ 새 Audit 실행</button>
      </div>

      {archive.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0", color: TEXT3 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 14 }}>아직 검수 결과가 없습니다.</div>
          <button onClick={() => onNav("audit")} style={{ marginTop: 16, padding: "10px 20px", borderRadius: 8, border: "none", background: BRAND, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>첫 번째 Audit 실행하기</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {archive.slice().reverse().map((r, i) => {
            const isPASS = r.verdict === "PASS";
            return (
              <button key={r.id} onClick={() => setPopupResult(r)} style={{
                background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 10,
                padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                cursor: "pointer", fontFamily: "inherit", textAlign: "left", transition: "all .12s",
                borderLeft: `4px solid ${isPASS ? "#059669" : "#DC2626"}`,
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"}
              onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                {/* Score Circle */}
                <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
                  <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="8" />
                    <circle cx="50" cy="50" r="42" fill="none" stroke={isPASS ? "#059669" : "#DC2626"} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${r.score * 2.64} 264`} />
                  </svg>
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: TEXT1 }}>{r.score}</div>
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: TEXT1 }}>{r.input?.screenName || "—"}</span>
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 10px", borderRadius: 12, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{r.verdict}</span>
                    {r.auditMode && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: r.auditMode==="figma"?"#EDE9FE":r.auditMode==="prototype"?"#F5F3FF":r.auditMode==="url"?"#DBEAFE":"#F3F4F6", color: r.auditMode==="figma"?"#7C3AED":r.auditMode==="prototype"?"#6D28D9":r.auditMode==="url"?"#2563EB":"#6B7280" }}>{r.auditMode==="prototype"?"Proto":r.auditMode}</span>}
                    {r.serviceType && <span style={{ fontSize: 9, padding: "2px 6px", borderRadius: 8, background: r.serviceType==="brand"?BRAND_LOW:r.serviceType==="linked"?"#F5F3FF":"#ECFDF5", color: r.serviceType==="brand"?BRAND:r.serviceType==="linked"?"#7C3AED":"#059669" }}>{r.serviceType==="brand"?"브랜드":r.serviceType==="linked"?"연계":r.serviceType==="usability"?"사용성":""}</span>}
                  </div>
                  <div style={{ fontSize: 11, color: TEXT3 }}>
                    Policy {r.breakdown.policy}/{r.breakdown.policyMax}{r.breakdown.dsMax > 0 ? " · DS "+r.breakdown.ds+"/"+r.breakdown.dsMax : ""} · 이슈 {r.issues.length}건
                    {r.outOfScopeCount > 0 && <span style={{ marginLeft: 4, fontSize: 9, padding: "1px 5px", borderRadius: 3, background: "#EDE9FE", color: "#6D28D9" }}>범위밖 {r.outOfScopeCount}</span>}
                  </div>
                </div>

                <div style={{ fontSize: 11, color: TEXT3, flexShrink: 0 }}>{r.timestamp}</div>
                <span style={{ fontSize: 14, color: TEXT3, flexShrink: 0 }}>→</span>
              </button>
            );
          })}
        </div>
      )}

      {popupResult && <ResultPopup result={popupResult} onClose={() => setPopupResult(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════
// FLOW AUDIT PAGE (검수 회차 관리)
// ═══════════════════════════════════════════
function generateMockResult(flowName, frames, iterNum) {
  const baseScore = Math.min(95, 45 + iterNum * 18 + Math.floor(Math.random() * 10));

  // 플로우 레벨 이슈 (화면 간 연결, 전체 흐름)
  const flowIssuePool = [
    { id: "SF_LW_01", msg: "다음 단계 CTA가 불명확 — 플로우 연결이 끊김", category: "UX Policy", severity: "critical", fix: "각 화면 CTA에 구체적 행동 문구 + 다음 단계 연결 명확히" },
    { id: "UXC_FL_01", msg: "사용 흐름이 예측 불가능", category: "UX Checklist", severity: "critical", fix: "단계 간 자연스러운 전환 + Progress Indicator 추가" },
    { id: "UXC_FL_04", msg: "현재 단계가 사용자에게 인지되지 않음", category: "UX Checklist", severity: "warning", fix: "Step Progress 컴포넌트로 현재 위치 표시" },
    { id: "SF_CA_01", msg: "진행 상태 자동 저장이 고려되지 않음", category: "UX Policy", severity: "warning", fix: "이탈 시 데이터 유지 + 재진입 복원 설계" },
    { id: "UXC_FL_02", msg: "불필요한 단계가 포함되어 있음", category: "UX Checklist", severity: "warning", fix: "입력 항목 최소화, 단계 병합 검토" },
  ];

  // 화면 레벨 이슈 풀 (특정 화면에 귀속)
  const screenIssuePool = [
    { id: "MS_EU_02", msg: "정보 위계와 구조가 불명확", category: "UX Policy", severity: "critical", fix: "Display→Title→Body 타이포 위계 적용" },
    { id: "DS_001", msg: "하드코딩 컬러 — 변수 바인딩 필수", category: "DS", severity: "critical", fix: "시맨틱 토큰으로 교체" },
    { id: "DS_006", msg: "모듈 좌우 마진 20px 미준수", category: "DS", severity: "warning", fix: "layout-x-20 토큰 적용" },
    { id: "UXC_CG_01", msg: "한 화면에 너무 많은 결정을 요구", category: "UX Checklist", severity: "warning", fix: "핵심 액션 1개로 집중" },
    { id: "PF_RM_02", msg: "의사결정 시점에 정보 부족", category: "UX Policy", severity: "critical", fix: "핵심 정보를 선택 시점에 즉시 노출" },
    { id: "UIC_VC_01", msg: "디자인 시스템 컴포넌트 미사용", category: "UI Checklist", severity: "warning", fix: "UDS 컴포넌트로 교체" },
    { id: "DS_007", msg: "첫 모듈 paddingTop=40 미준수", category: "DS", severity: "warning", fix: "layout-y-40 토큰 적용" },
    { id: "BT_SR_01", msg: "인터랙션에 즉각적 피드백 없음", category: "UX Policy", severity: "critical", fix: "Pressed State + 로딩 스피너 추가" },
    { id: "UIC_TP_02", msg: "텍스트 위계가 불명확", category: "UI Checklist", severity: "warning", fix: "title/body/label 토큰 분리 적용" },
    { id: "UIC_CS_01", msg: "기본/Hover/Active/Disabled 상태 미정의", category: "UI Checklist", severity: "warning", fix: "모든 인터랙티브 요소에 상태 정의" },
    { id: "DS_003", msg: "최상위 프레임 402px 미준수", category: "DS", severity: "critical", fix: "프레임 너비 402px 고정 + HUG 설정" },
    { id: "MS_FA_01", msg: "주요 행동이 2개 이상 경쟁", category: "UX Policy", severity: "critical", fix: "Primary CTA 1개만 강조, 나머지 secondary" },
  ];

  // 검수 회차 높을수록 이슈 감소
  const flowIssueCount = Math.max(0, Math.floor(flowIssuePool.length * (1 - iterNum * 0.35)));
  const flowIssues = flowIssuePool.slice(0, flowIssueCount).map(iss => ({
    ...iss, scope: "flow", frameName: null, frameIdx: null,
    deduction: +((15 / Math.max(1, flowIssueCount)).toFixed(1)),
  }));

  // 화면별 이슈 분배
  const screenIssues = [];
  const frameNames = frames.map(f => f.name);
  const perFrame = Math.max(1, Math.floor(screenIssuePool.length * (1 - iterNum * 0.3) / Math.max(1, frames.length)));

  frames.forEach((frame, fi) => {
    const startIdx = (fi * 3) % screenIssuePool.length;
    const count = Math.max(0, perFrame - Math.floor(Math.random() * 2));
    for (let j = 0; j < count; j++) {
      const src = screenIssuePool[(startIdx + j) % screenIssuePool.length];
      screenIssues.push({
        ...src,
        id: src.id + "_" + fi + "_" + j,
        scope: "screen",
        frameName: frame.name,
        frameIdx: fi,
        deduction: +((25 / Math.max(1, frames.length * perFrame)).toFixed(1)),
      });
    }
  });

  const allIssues = [...flowIssues, ...screenIssues];
  const totalDeduction = allIssues.reduce((s, i) => s + (i.deduction || 0), 0);
  const score = Math.max(0, Math.min(100, Math.round(100 - totalDeduction)));

  return {
    score,
    verdict: score >= 70 ? "PASS" : "FAIL",
    breakdown: {
      policy: Math.round(score * 0.6), policyMax: 60,
      ds: Math.round(score * 0.4), dsMax: 40,
      policyDetail: {
        "UX Policy": { fail: allIssues.filter(i => i.category === "UX Policy").length, total: QA_RULES.length },
        "UX Checklist": { fail: allIssues.filter(i => i.category === "UX Checklist").length, total: UX_CHECKLIST.length },
        "UI Checklist": { fail: allIssues.filter(i => i.category === "UI Checklist").length, total: UI_CHECKLIST.length },
      },
    },
    issues: allIssues,
    flowIssues,
    screenIssues,
    frameNames,
    passes: [],
    skipped: [],
    outOfScope: [],
    scoredCount: allIssues.length,
    skippedCount: 0,
    outOfScopeCount: 0,
    total: allIssues.length,
    screenAnalysis: { purpose: flowName + " 플로우 검수", screenType: "flow" },
    auditMode: "figma",
    serviceType: "brand",
    timestamp: new Date().toLocaleString("ko-KR"),
  };
}

function ResultSection({ result, iterIdx, frames, selectedFrame, setSelectedFrame }) {
  const isPASS = result.verdict === "PASS";
  const flowIssues = result.flowIssues || result.issues.filter(i => i.scope === "flow");
  const screenIssues = result.screenIssues || result.issues.filter(i => i.scope === "screen");

  const viewIdx = selectedFrame ?? 0;
  const viewFrame = frames[viewIdx];

  // 이 화면의 이슈를 UX / DS 두 그룹으로 분류
  const frameIssues = screenIssues.filter(i => i.frameIdx === viewIdx);
  const uxIssues = frameIssues.filter(i => i.category !== "DS");
  const dsIssues = frameIssues.filter(i => i.category === "DS");

  // 이슈 카드 스타일
  const cardStyle = (iss) => {
    if (iss.severity === "critical") return { bg: "#FFF5F5", border: "#FECACA", accent: "#DC2626", label: "Critical" };
    return { bg: "#FFFBEB", border: "#FDE68A", accent: "#D97706", label: "Warning" };
  };

  // 이슈 카드 렌더
  const IssueCard = ({ iss }) => {
    const cs = cardStyle(iss);
    return (
      <div style={{
        padding: "12px 14px", borderRadius: 10, background: cs.bg,
        border: `1.5px solid ${cs.border}`, borderLeft: `4px solid ${cs.accent}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: cs.accent }}>{cs.label}</span>
        </div>
        <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500, lineHeight: 1.5 }}>{iss.msg}</div>
        {iss.fix && <div style={{ fontSize: 11, color: "#059669", marginTop: 6, lineHeight: 1.5 }}>→ {iss.fix}</div>}
      </div>
    );
  };

  return (
    <div style={{ borderRadius: 12, background: SURFACE, border: `1px solid ${BORDER}`, overflow: "hidden" }}>
      {/* Top Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 20px", borderBottom: `1px solid ${BORDER}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT1 }}>v{iterIdx + 1} 검수 결과</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 12, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{result.verdict}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 10, color: TEXT3 }}>Policy {result.breakdown.policy}/{result.breakdown.policyMax} · DS {result.breakdown.ds}/{result.breakdown.dsMax}</div>
          <span style={{ fontSize: 26, fontWeight: 700, color: isPASS ? "#059669" : "#DC2626" }}>{result.score}</span>
        </div>
      </div>

      {/* Flow Issues (타이틀 아래 고정 영역) */}
      {flowIssues.length > 0 && (
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${BORDER}`, background: "#FAFAFE" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#7C3AED", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700 }}>F</span>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#7C3AED" }}>플로우 검토 ({flowIssues.length})</span>
            <span style={{ fontSize: 10, color: TEXT3 }}>— 화면 간 연결·흐름·일관성</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            {flowIssues.map((iss, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: "#F5F3FF", border: "1px solid #EDE9FE" }}>
                <span style={{ fontSize: 9, fontWeight: 600, padding: "2px 6px", borderRadius: 4, background: sevCfg[iss.severity]?.bg || "#F3F4F6", color: sevCfg[iss.severity]?.c || "#6B7280", flexShrink: 0, height: "fit-content", marginTop: 1 }}>{iss.severity === "critical" ? "Critical" : "Warning"}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500, lineHeight: 1.5 }}>{iss.msg}</div>
                  {iss.fix && <div style={{ fontSize: 11, color: "#059669", marginTop: 3 }}>→ {iss.fix}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main: Left Image + Right Cards */}
      <div style={{ display: "flex", minHeight: 460 }}>
        {/* LEFT: Image */}
        <div style={{ width: "50%", borderRight: `1px solid ${BORDER}`, background: "#F5F5F5", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: 16, overflowY: "auto" }}>
          {viewFrame?.image ? (
            <img src={viewFrame.image} style={{ width: "100%", borderRadius: 8, objectFit: "contain", boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }} alt={viewFrame.name} />
          ) : (
            <div style={{ color: TEXT3, fontSize: 13 }}>이미지 없음</div>
          )}
        </div>

        {/* RIGHT: UX + DS 분류 카드 */}
        <div style={{ width: "50%", overflowY: "auto", padding: "16px 18px" }}>
          {/* UX 이슈 */}
          {uxIssues.length > 0 && (
            <div style={{ marginBottom: dsIssues.length > 0 ? 20 : 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#0891B2" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#0891B2" }}>UX</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>Policy · Checklist ({uxIssues.length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {uxIssues.map((iss, i) => {
                  const globalIdx = frameIssues.indexOf(iss);
                  return <IssueCard key={i} iss={iss} />;
                })}
              </div>
            </div>
          )}

          {/* DS 이슈 */}
          {dsIssues.length > 0 && (
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#DC2626" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#DC2626" }}>DS</span>
                <span style={{ fontSize: 10, color: TEXT3 }}>Design System Rules ({dsIssues.length})</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {dsIssues.map((iss, i) => {
                  const globalIdx = frameIssues.indexOf(iss);
                  return <IssueCard key={i} iss={iss} />;
                })}
              </div>
            </div>
          )}

          {/* Positive */}
          {result.passes && result.passes.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#059669" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>Positive</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {result.passes.slice(0, 3).map((p, i) => (
                  <div key={i} style={{ padding: "10px 14px", borderRadius: 10, background: "#F0FDF4", border: "1.5px solid #A7F3D0", borderLeft: "4px solid #059669" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ width: 20, height: 20, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#059669" }}>Positive</span>
                    </div>
                    <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500, lineHeight: 1.5 }}>{p.msg}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expert Opinions (사용성 검증 모드) */}
          {result.expertOpinions && result.expertOpinions.length > 0 && (
            <div style={{ marginTop: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: "#2563EB" }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: "#2563EB" }}>UX 전문가 의견</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {result.expertOpinions.map((op, i) => {
                  const typeColor = op.type === "positive" ? "#059669" : op.type === "issue" ? "#DC2626" : "#2563EB";
                  const typeBg = op.type === "positive" ? "#F0FDF4" : op.type === "issue" ? "#FFF5F5" : "#EFF6FF";
                  const typeBorder = op.type === "positive" ? "#A7F3D0" : op.type === "issue" ? "#FECACA" : "#BFDBFE";
                  const typeLabel = op.type === "positive" ? "긍정" : op.type === "issue" ? "이슈" : "제안";
                  return (
                    <div key={i} style={{ padding: "12px 14px", borderRadius: 10, background: typeBg, border: `1.5px solid ${typeBorder}`, borderLeft: `4px solid ${typeColor}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 4, background: typeColor, color: "#fff" }}>{typeLabel}</span>
                        <span style={{ fontSize: 10, fontWeight: 600, color: typeColor }}>{op.principle}</span>
                      </div>
                      <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500, lineHeight: 1.6 }}>{op.comment}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Empty */}
          {frameIssues.length === 0 && (
            <div style={{ padding: "40px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>✓</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#059669" }}>이슈가 없습니다</div>
              <div style={{ fontSize: 11, color: TEXT3, marginTop: 4 }}>이 화면은 검수를 통과했습니다</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FlowAuditPage({ flows, setFlows, activeFlowId, setActiveFlowId, onNav, onAddResult, serviceType }) {
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [auditRunning, setAuditRunning] = useState(false);
  const [viewIter, setViewIter] = useState(null); // null = latest

  // 플로우 없을 때
  if (flows.length === 0) return (
    <div style={{ padding: "36px 44px", maxWidth: 900 }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>Figma 플로우 검수</h1>
      <p style={{ color: TEXT3, margin: "0 0 32px", fontSize: 13 }}>Figma 플러그인에서 프레임을 선택하고 검수를 요청하면 여기에 표시됩니다.</p>
      <div style={{ padding: "48px 32px", textAlign: "center", border: `2px dashed ${BORDER}`, borderRadius: 16 }}>
        <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.4 }}>◇</div>
        <div style={{ fontSize: 14, fontWeight: 500, color: TEXT2, marginBottom: 8 }}>대기 중</div>
        <div style={{ fontSize: 12, color: TEXT3, lineHeight: 1.6 }}>
          Figma에서 프레임을 선택하고<br/>
          플러그인의 "검수 요청 보내기"를 클릭하세요
        </div>
        <div style={{ marginTop: 20, padding: "12px 16px", borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", fontSize: 11, color: "#1E40AF", display: "inline-block" }}>
          Plugins → Development → UX Audit Studio
        </div>
      </div>
    </div>
  );

  // 갤러리 전체 리스트 (activeFlowId가 null일 때)
  if (!activeFlowId && flows.length > 0) return (
    <div style={{ padding: "36px 44px", maxWidth: 1200, overflowY: "auto" }}>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: TEXT1, margin: "0 0 4px" }}>검수 이력</h1>
      <p style={{ color: TEXT3, margin: "0 0 24px", fontSize: 13 }}>{flows.length}개 플로우 · 전체 검수 이력</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {flows.map(f => {
          const lastIter = f.iterations[f.iterations.length - 1];
          const lastResult = lastIter?.result;
          const isPASS = lastResult?.verdict === "PASS";
          const hasResult = !!lastResult;
          return (
            <div key={f.id} onClick={() => { setActiveFlowId(f.id); setViewIter(null); setSelectedFrame(null); }} style={{
              background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 12,
              padding: 14, cursor: "pointer", transition: "all .15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = BRAND; e.currentTarget.style.boxShadow = `0 2px 10px ${BRAND}15`; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = BORDER; e.currentTarget.style.boxShadow = "none"; }}
            >
              <div style={{ display: "flex", gap: 4, marginBottom: 10, height: 56, overflow: "hidden", borderRadius: 6 }}>
                {f.frames.slice(0, 4).map((frame, fi) => (
                  <div key={fi} style={{ flex: 1, minWidth: 0, background: "#F0F0F0", borderRadius: 4, overflow: "hidden", position: "relative" }}>
                    <img src={frame.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} alt="" />
                    {fi === 3 && f.frames.length > 4 && (
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 600 }}>+{f.frames.length - 4}</div>
                    )}
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</div>
                  <div style={{ fontSize: 10, color: TEXT3, marginTop: 2 }}>{f.frames.length}개 화면 · {f.iterations.length}회차 · {f.timestamp}</div>
                </div>
                {hasResult ? (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", border: `2px solid ${isPASS ? "#059669" : "#DC2626"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isPASS ? "#059669" : "#DC2626" }}>{lastResult.score}</span>
                  </div>
                ) : (
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#FFFBEB", border: "1.5px solid #FDE68A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 10 }}>
                    <span style={{ fontSize: 9, color: "#D97706", fontWeight: 600 }}>대기</span>
                  </div>
                )}
              </div>
              {f.iterations.length > 1 && (
                <div style={{ display: "flex", gap: 4, marginTop: 8 }}>
                  {f.iterations.map((iter, ii) => (
                    <div key={ii} style={{ width: 8, height: 8, borderRadius: "50%", background: iter.result ? (iter.result.verdict === "PASS" ? "#059669" : "#DC2626") : "#D1D5DB" }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const flow = flows.find(f => f.id === activeFlowId) || flows[flows.length - 1];
  const displayIterIdx = viewIter !== null ? viewIter : flow.iterations.length - 1;
  const displayIter = flow.iterations[displayIterIdx];
  const latestIter = flow.iterations[flow.iterations.length - 1];
  const prevIter = displayIterIdx > 0 ? flow.iterations[displayIterIdx - 1] : null;

  const [auditProgress, setAuditProgress] = useState("");
  const [showResultPopup, setShowResultPopup] = useState(false);

  const runRealAudit = async () => {
    setAuditRunning(true);
    try {
      const allScreenIssues = [];
      const allFlowIssues = [];
      const allPasses = [];
      const allExpertOpinions = [];
      let totalScore = 0;
      let totalPolicyScore = 0;
      let totalDsScore = 0;

      // 1. 각 프레임 개별 검수
      for (let i = 0; i < flow.frames.length; i++) {
        const frame = flow.frames[i];
        setAuditProgress(`${frame.name} 검수 중... (${i + 1}/${flow.frames.length})`);

        const res = await runAIAudit(frame.name, {
          mode: "image",
          image: frame.image,
          serviceType: serviceType || "brand",
        });

        if (res.error) continue;

        // 이슈에 프레임 정보 추가
        (res.issues || []).forEach(iss => {
          allScreenIssues.push({ ...iss, scope: "screen", frameName: frame.name, frameIdx: i });
        });
        (res.passes || []).forEach(p => {
          allPasses.push({ ...p, frameName: frame.name, frameIdx: i });
        });
        (res.expertOpinions || []).forEach(op => {
          allExpertOpinions.push({ ...op, frameName: frame.name });
        });

        totalScore += res.score || 0;
        totalPolicyScore += res.breakdown?.policy || 0;
        totalDsScore += res.breakdown?.ds || 0;
      }

      // 2. 플로우 레벨 검수 (전체 흐름 분석)
      if (flow.frames.length > 1) {
        setAuditProgress("플로우 연결성 검수 중...");
        const flowPrompt = flow.frames.map((f, i) => `화면${i + 1}: ${f.name}`).join(", ");
        const flowRes = await runAIAudit(`${flow.name} 플로우 (${flowPrompt})`, {
          mode: "image",
          image: flow.frames[0].image,
          serviceType: serviceType || "brand",
        });

        if (!flowRes.error) {
          // 플로우 관련 이슈만 추출 (SF_, UXC_FL_ 등)
          (flowRes.issues || []).forEach(iss => {
            if (iss.id && (iss.id.startsWith("SF_") || iss.id.startsWith("UXC_FL") || iss.id.startsWith("UXC_CS"))) {
              allFlowIssues.push({ ...iss, scope: "flow", frameName: null, frameIdx: null });
            }
          });
        }
      }

      // 3. 결과 합산
      const avgScore = flow.frames.length > 0 ? Math.round(totalScore / flow.frames.length) : 0;
      const avgPolicy = flow.frames.length > 0 ? Math.round(totalPolicyScore / flow.frames.length) : 0;
      const avgDs = flow.frames.length > 0 ? Math.round(totalDsScore / flow.frames.length) : 0;

      const noDS = serviceType === "linked" || serviceType === "usability";
      const combinedResult = {
        score: avgScore,
        verdict: avgScore >= 70 ? "PASS" : "FAIL",
        breakdown: { policy: avgPolicy, policyMax: noDS ? 100 : 60, ds: noDS ? 0 : avgDs, dsMax: noDS ? 0 : 40, policyDetail: {} },
        issues: [...allFlowIssues, ...allScreenIssues],
        flowIssues: allFlowIssues,
        screenIssues: allScreenIssues,
        passes: allPasses,
        frameNames: flow.frames.map(f => f.name),
        expertOpinions: allExpertOpinions,
        skipped: [],
        outOfScope: [],
        scoredCount: allScreenIssues.length + allPasses.length,
        skippedCount: 0,
        outOfScopeCount: 0,
        total: allScreenIssues.length + allFlowIssues.length + allPasses.length,
        auditMode: "figma",
        serviceType: serviceType || "brand",
        timestamp: new Date().toLocaleString("ko-KR"),
        input: { type: "figma", screenName: flow.name, imagePreview: flow.frames[0]?.image, serviceType: serviceType || "brand" },
        id: Date.now(),
      };

      setFlows(prev => prev.map(f => {
        if (f.id !== flow.id) return f;
        const newIters = [...f.iterations];
        newIters[newIters.length - 1] = { ...newIters[newIters.length - 1], result: combinedResult, status: "done" };
        return { ...f, iterations: newIters };
      }));

      onAddResult(combinedResult);
      setViewIter(null);
    } catch (err) {
      console.error("Audit error:", err);
    }
    setAuditRunning(false);
    setAuditProgress("");
  };

  const svcLabel = { brand: "브랜드 서비스 검수", linked: "연계 서비스 검수", usability: "외부 서비스 검증" }[serviceType] || "서비스 검수";
  const svcDesc = { brand: "UX Policy + Checklist + Design system 전체 적용", linked: "UX Policy + Checklist만 적용 · DS Rules 채점 제외", usability: "UX Policy + Checklist + 통상적·학술적 UX 룰 적용" }[serviceType] || "";

  return (
    <div style={{ padding: "45px 0 45px 72px", maxWidth: 1288, overflowY: "auto", fontFamily: "'Pretendard',system-ui,sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#000", margin: 0, lineHeight: 1.3, letterSpacing: "-0.02em" }}>{svcLabel}</h1>
        <p style={{ color: "#747474", margin: 0, fontSize: 16, fontWeight: 500, lineHeight: 1.5 }}>{svcDesc}</p>
      </div>

      {/* 상단 카드 (하나의 박스) */}
      <div style={{ background: "#FCFCFC", borderRadius: 12, boxShadow: "0px 4px 24px rgba(0,0,0,0.02)", padding: "22px 0 28px", display: "flex", flexDirection: "column", gap: 48, marginBottom: 12 }}>

        {/* 입력 탭 바 (비활성, flow 선택 상태) */}
        <div style={{ display: "flex", gap: 8, alignItems: "center", padding: "0 24px" }}>
          {["Figma 링크", "Figma 플로우", "이미지 업로드", "URL 입력", "JSON Schema"].map((label, i) => (
            <button key={i} style={{
              padding: "12px 16px", borderRadius: 4, border: "none",
              background: i === 1 ? "#F2F2F2" : "transparent",
              color: i === 1 ? "#1A1A1A" : "#747474",
              fontSize: 14, fontWeight: 700, cursor: "default", fontFamily: "inherit",
            }}>{label}</button>
          ))}
        </div>

        {/* 콘텐츠: 프레임 그리드 + 하단 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 80 }}>
          {/* 프레임 영역 */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "0 24px" }}>
            {/* 플로우명 + 화면 수 + 회차 드롭다운 */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4, padding: "0 4px" }}>
                <span style={{ fontSize: 20, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.3, letterSpacing: "-0.02em" }}>{flow.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: displayIter.result ? "rgba(26,26,26,0.16)" : "#24A326", flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontWeight: 500, color: displayIter.result ? "rgba(26,26,26,0.16)" : "#018303", lineHeight: "14px" }}>{flow.frames.length}개 화면 {displayIter.result ? "검수 완료" : "수신 완료"}</span>
                </div>
              </div>
              <div style={{ position: "relative" }}>
                <select value={displayIterIdx} onChange={e => { setViewIter(Number(e.target.value)); setSelectedFrame(null); }} style={{
                  padding: "10px 30px 10px 12px", borderRadius: 4, border: "none", background: "#F2F2F2",
                  fontSize: 14, fontWeight: 500, color: "#1A1A1A", fontFamily: "inherit",
                  cursor: "pointer", outline: "none", appearance: "none", WebkitAppearance: "none",
                }}>
                  {flow.iterations.map((iter, i) => (
                    <option key={i} value={i}>{i + 1}회차{iter.result ? ` (${iter.result.score}점)` : " (대기)"}</option>
                  ))}
                </select>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
                  <path d="M11.8047 6.19527C12.0651 6.45562 12.0651 6.87764 11.8047 7.138L8.47136 10.4714C8.21101 10.7318 7.78899 10.7318 7.52864 10.4714L4.19526 7.13799C3.93491 6.87764 3.93491 6.45562 4.19526 6.19527C4.45562 5.93491 4.87763 5.93491 5.13798 6.19527L8 9.05731L10.862 6.19527C11.1224 5.93491 11.5444 5.93491 11.8047 6.19527Z" fill="#1A1A1A" />
                </svg>
              </div>
            </div>

            {/* 프레임 그리드 (128×180, #F2F2F2 배경 컨테이너) */}
            <div style={{ display: "flex", gap: 8, overflowX: "auto", padding: "20px 0 20px 16px", background: "#F2F2F2", borderRadius: 12 }}>
              {flow.frames.map((frame, i) => (
                <div key={frame.id} onClick={() => setSelectedFrame(selectedFrame === i ? null : i)} style={{
                  width: 128, height: 180, flexShrink: 0, borderRadius: 8,
                  background: "#D9D9D9", border: `1px solid ${selectedFrame === i ? BRAND : "#E0E0E0"}`,
                  display: "flex", flexDirection: "column", justifyContent: "flex-end",
                  overflow: "hidden", cursor: "pointer", transition: "border-color .15s",
                  boxShadow: selectedFrame === i ? `0 0 0 2px ${BRAND}40` : "none",
                }}>
                  <img src={frame.image} style={{ width: "100%", flex: 1, objectFit: "cover", display: "block" }} alt={frame.name} />
                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "5px 8px", background: "#FCFCFC" }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#000", lineHeight: "14px", textAlign: "center", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{frame.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 하단: 검수 시작 / 진행 중 / 결과 요약 */}
          <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", padding: "0 24px" }}>
            {displayIter.result ? (
              <div onClick={() => setShowResultPopup(true)} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "12px 8px 12px 18px", borderRadius: 8,
                background: displayIter.result.verdict === "PASS" ? "#EEFBEE" : "#FDF1F1",
                cursor: "pointer", flex: 1, transition: "background .15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = displayIter.result.verdict === "PASS" ? "#E0F5E0" : "#FCE8E8"; }}
              onMouseLeave={e => { e.currentTarget.style.background = displayIter.result.verdict === "PASS" ? "#EEFBEE" : "#FDF1F1"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
                  {/* 점수 원형 (60×60, 흰 배경 + 그림자 + stroke) */}
                  <div style={{ position: "relative", width: 60, height: 60, flexShrink: 0 }}>
                    <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "#fff", boxShadow: "0px 0.94px 7.5px rgba(229,26,26,0.1)" }} />
                    <svg viewBox="0 0 60 60" style={{ position: "absolute", inset: 0, transform: "rotate(-90deg)" }}>
                      <circle cx="30" cy="30" r="28.125" fill="none" stroke="rgba(26,26,26,0.16)" strokeWidth="3.75" />
                      <circle cx="30" cy="30" r="28.125" fill="none" stroke={displayIter.result.verdict === "PASS" ? "#059669" : "#FF0000"} strokeWidth="3.75" strokeLinecap="round" strokeDasharray={`${displayIter.result.score * 1.767} 176.7`} />
                    </svg>
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: 22.5, fontWeight: 700, color: displayIter.result.verdict === "PASS" ? "#059669" : "#DA0707", letterSpacing: "-0.04em" }}>{displayIter.result.score}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#474747" }}>{displayIterIdx + 1}회차 검수 결과</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: displayIter.result.verdict === "PASS" ? "#059669" : "#DA0707", lineHeight: 1.3, letterSpacing: "-0.02em" }}>{displayIter.result.verdict} · 이슈 {displayIter.result.issues.length}건</span>
                  </div>
                </div>
                <div style={{ width: 52, height: 52, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 6L15 12L9 18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            ) : auditRunning ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", borderRadius: 8, background: "#FFFBEB" }}>
                <div style={{ width: 24, height: 24, border: "2.5px solid #E5E7EB", borderTopColor: BRAND, borderRadius: "50%", animation: "spin .8s linear infinite" }} />
                <span style={{ fontSize: 14, fontWeight: 500, color: "#92400E" }}>{auditProgress || "검수 진행 중..."}</span>
              </div>
            ) : (
              <button onClick={runRealAudit} style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "14px 20px", borderRadius: 4, border: "none",
                background: "#E10975", color: "#fff",
                fontSize: 16, fontWeight: 500, cursor: "pointer", fontFamily: "inherit",
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M8 5.14v13.72a1 1 0 001.5.86l11.04-6.86a1 1 0 000-1.72L9.5 4.28a1 1 0 00-1.5.86z" fill="#fff"/></svg>
                검수 시작
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Flow Result Popup */}
      {showResultPopup && displayIter.result && (() => {
        const r = displayIter.result;
        const isPASS = r.verdict === "PASS";
        const issues = selectedFrame === null ? r.issues : r.issues.filter(x => x.frameIdx === selectedFrame);
        const flowIss = issues.filter(x => x.scope === "flow");
        const screenIss = issues.filter(x => x.scope !== "flow");
        const catColors = { "UX Policy": { c: "#0891B2", bg: "#ECFEFF" }, "UX Checklist": { c: "#7C3AED", bg: "#F5F3FF" }, "UI Checklist": { c: "#D97706", bg: "#FFFBEB" }, "DS": { c: "#6B7280", bg: "#F3F4F6" } };
        const frameIdx = selectedFrame ?? 0;
        const frame = flow.frames[frameIdx];

        return (
          <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div onClick={() => setShowResultPopup(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
            <div style={{ position: "relative", width: "92%", maxWidth: 1200, height: "90vh", background: SURFACE, borderRadius: 16, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.2)" }}>
              {/* Header */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 24px", borderBottom: `1px solid ${BORDER}`, flexShrink: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 16, fontWeight: 700, color: TEXT1 }}>{flow.name}</span>
                  <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 12, background: BRAND_LOW, color: BRAND, fontWeight: 600 }}>v{displayIterIdx + 1}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 12px", borderRadius: 20, background: isPASS ? "#ECFDF5" : "#FEF2F2", color: isPASS ? "#059669" : "#DC2626" }}>{r.verdict}</span>
                  {r.serviceType && <span style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: r.serviceType==="brand"?BRAND_LOW:r.serviceType==="linked"?"#F5F3FF":"#ECFDF5", color: r.serviceType==="brand"?BRAND:r.serviceType==="linked"?"#7C3AED":"#059669", fontWeight: 600 }}>{r.serviceType==="brand"?"브랜드":r.serviceType==="linked"?"연계":"사용성"}</span>}
                </div>
                <button onClick={() => setShowResultPopup(false)} style={{ width: 32, height: 32, borderRadius: 8, border: `1px solid ${BORDER}`, background: SURFACE, cursor: "pointer", fontSize: 16, color: TEXT3, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "inherit" }}>✕</button>
              </div>

              <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
                {/* LEFT */}
                <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", borderRight: `1px solid ${BORDER}` }}>
                  {/* Score */}
                  <div style={{ display: "flex", gap: 20, alignItems: "center", marginBottom: 16, padding: 16, borderRadius: 12, background: isPASS ? "#F0FDF4" : "#FFF5F5", border: `1px solid ${isPASS ? "#BBF7D0" : "#FECACA"}` }}>
                    <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
                      <svg viewBox="0 0 100 100" style={{ transform: "rotate(-90deg)" }}>
                        <circle cx="50" cy="50" r="42" fill="none" stroke={BORDER} strokeWidth="7" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke={isPASS ? "#059669" : "#DC2626"} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${r.score * 2.64} 264`} />
                      </svg>
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: 22, fontWeight: 700, color: TEXT1 }}>{r.score}</span>
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: isPASS ? "#059669" : "#DC2626", marginBottom: 4 }}>{isPASS ? "PASS" : "FAIL"}</div>
                      <div style={{ display: "flex", gap: 14, fontSize: 12 }}>
                        <span style={{ color: "#0891B2" }}>Policy <b>{r.breakdown.policy}</b>/{r.breakdown.policyMax}</span>
                        {r.breakdown.dsMax > 0 && <span style={{ color: "#6B7280" }}>DS <b>{r.breakdown.ds}</b>/{r.breakdown.dsMax}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Frame Tabs */}
                  <div style={{ display: "flex", gap: 4, marginBottom: 12, overflowX: "auto", flexWrap: "wrap" }}>
                    <button onClick={() => setSelectedFrame(null)} style={{
                      padding: "5px 12px", borderRadius: 6, border: `1.5px solid ${selectedFrame === null ? BRAND : BORDER}`,
                      background: selectedFrame === null ? BRAND_LOW : "transparent", color: selectedFrame === null ? BRAND_HIGH : TEXT2,
                      fontSize: 11, fontWeight: selectedFrame === null ? 600 : 400, cursor: "pointer", fontFamily: "inherit",
                    }}>전체 ({r.issues.length})</button>
                    {flow.frames.map((fr, fi) => {
                      const cnt = r.issues.filter(x => x.frameIdx === fi).length;
                      return (
                        <button key={fi} onClick={() => setSelectedFrame(fi)} style={{
                          padding: "5px 10px", borderRadius: 6, border: `1.5px solid ${selectedFrame === fi ? BRAND : BORDER}`,
                          background: selectedFrame === fi ? BRAND_LOW : "transparent", color: selectedFrame === fi ? BRAND_HIGH : TEXT2,
                          fontSize: 10, fontWeight: selectedFrame === fi ? 600 : 400, cursor: "pointer", fontFamily: "inherit",
                          whiteSpace: "nowrap",
                        }}>{fr.name} {cnt > 0 ? `(${cnt})` : "✓"}</button>
                      );
                    })}
                  </div>

                  {/* Iteration Dots */}
                  {flow.iterations.filter(it => it.result).length > 1 && (
                    <div style={{ display: "flex", gap: 4, marginBottom: 16 }}>
                      {flow.iterations.map((iter, i) => {
                        if (!iter.result) return null;
                        const isAct = i === displayIterIdx;
                        return (
                          <button key={i} onClick={() => setViewIter(i)} style={{
                            width: 36, height: 36, borderRadius: "50%",
                            border: `2px solid ${isAct ? (iter.result.verdict === "PASS" ? "#059669" : "#DC2626") : "transparent"}`,
                            background: "#fff", boxShadow: isAct ? "0 2px 8px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.06)",
                            cursor: "pointer", fontFamily: "inherit", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 0,
                          }}>
                            <span style={{ fontSize: 7, fontWeight: 600, color: TEXT3 }}>v{i + 1}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: iter.result.verdict === "PASS" ? "#059669" : "#DC2626", lineHeight: 1 }}>{iter.result.score}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Flow Issues */}
                  {flowIss.length > 0 && selectedFrame === null && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#7C3AED", marginBottom: 6 }}>플로우 이슈 ({flowIss.length})</div>
                      {flowIss.map((iss, i) => (
                        <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#F5F3FF", border: "1px solid #DDD6FE", borderLeft: "3px solid #7C3AED", marginBottom: 4 }}>
                          <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500 }}>{iss.msg}</div>
                          {iss.fix && <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>→ {iss.fix}</div>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Screen Issues */}
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#DC2626", marginBottom: 6 }}>
                    {selectedFrame === null ? `화면 이슈 (${screenIss.length})` : `${flow.frames[selectedFrame]?.name} (${screenIss.length})`}
                  </div>
                  {screenIss.length === 0 && <div style={{ padding: 12, textAlign: "center", color: "#059669", fontSize: 12, background: "#F0FDF4", borderRadius: 8 }}>이슈 없음</div>}
                  {screenIss.map((iss, i) => {
                    const sc = catColors[iss.category] || catColors.DS;
                    return (
                      <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#fff", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${sc.c}`, marginBottom: 4 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "1px 5px", borderRadius: 4, background: sc.bg, color: sc.c }}>{iss.category}</span>
                          {iss.frameName && selectedFrame === null && <span style={{ fontSize: 9, color: TEXT3 }}>{iss.frameName}</span>}
                        </div>
                        <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500 }}>{iss.msg}</div>
                        {iss.fix && <div style={{ fontSize: 11, color: "#059669", marginTop: 2 }}>→ {iss.fix}</div>}
                      </div>
                    );
                  })}

                  {/* Expert Opinions */}
                  {r.expertOpinions && r.expertOpinions.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", marginBottom: 6 }}>UX 전문가 의견</div>
                      {r.expertOpinions.map((op, i) => {
                        const tc = op.type === "positive" ? "#059669" : op.type === "issue" ? "#DC2626" : "#2563EB";
                        return (
                          <div key={i} style={{ padding: "10px 12px", borderRadius: 8, background: "#EFF6FF", border: "1px solid #BFDBFE", borderLeft: `3px solid ${tc}`, marginBottom: 4 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, background: tc, color: "#fff" }}>{op.type === "positive" ? "긍정" : op.type === "issue" ? "이슈" : "제안"}</span>
                              <span style={{ fontSize: 10, color: tc, fontWeight: 600 }}>{op.principle}</span>
                            </div>
                            <div style={{ fontSize: 12, color: TEXT1, fontWeight: 500, lineHeight: 1.5 }}>{op.comment}</div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* RIGHT: Image */}
                <div style={{ width: 420, flexShrink: 0, overflowY: "auto", padding: 20, background: "#F5F5F5", display: "flex", alignItems: "flex-start", justifyContent: "center" }}>
                  {frame?.image ? (
                    <img src={frame.image} style={{ width: "100%", borderRadius: 8, boxShadow: "0 2px 16px rgba(0,0,0,0.08)" }} alt={frame.name} />
                  ) : (
                    <div style={{ padding: 40, textAlign: "center", color: TEXT3 }}>이미지 없음</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("dashboard");
  const [archive, setArchive] = useState([]);
  const [flows, setFlows] = useState([]);
  const [activeFlowId, setActiveFlowId] = useState(null);
  const [pluginNotice, setPluginNotice] = useState(null);
  const [flowServiceType, setFlowServiceType] = useState("brand");
  const addResult = (r) => setArchive(prev => [...prev, r]);

  // Figma Plugin 데이터 폴링 (2초 간격)
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch("/api/figma-import");
        const data = await res.json();
        if (!data || !data.type) return;

        const flowName = data.flowName || "플로우 " + new Date().toLocaleDateString("ko-KR");
        const frames = (data.frames || []).filter(f => f.image);
        if (frames.length === 0) return;

        // 플러그인에서 serviceType을 보냈으면 우선 적용
        if (data.serviceType) {
          setFlowServiceType(data.serviceType);
        }

        setFlows(prev => {
          const existing = prev.find(f => f.name === flowName);
          if (existing) {
            const updated = prev.map(f => {
              if (f.id !== existing.id) return f;
              return {
                ...f,
                frames: frames,
                iterations: [...f.iterations, {
                  version: f.iterations.length + 1,
                  timestamp: new Date().toLocaleString("ko-KR"),
                  result: null,
                  status: "pending",
                }],
              };
            });
            setActiveFlowId(existing.id);
            return updated;
          } else {
            const newFlow = {
              id: Date.now(),
              name: flowName,
              frames: frames,
              timestamp: new Date().toLocaleString("ko-KR"),
              iterations: [{
                version: 1,
                timestamp: new Date().toLocaleString("ko-KR"),
                result: null,
                status: "pending",
              }],
            };
            setActiveFlowId(newFlow.id);
            return [...prev, newFlow];
          }
        });

        // 서비스 유형에 맞는 사이드바 메뉴 활성화
        const svcPage = data.serviceType === "linked" ? "audit-linked" : data.serviceType === "usability" ? "audit-usability" : "audit-brand";
        setPage("flow-audit");
        setPluginNotice("Figma에서 " + frames.length + "개 프레임 수신 완료");
        setTimeout(() => setPluginNotice(null), 4000);
      } catch (e) {
        // 폴링 실패는 무시
      }
    };

    const interval = setInterval(poll, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "'Pretendard',-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", background: BG, color: TEXT1 }}>
      <SideNav active={page} onNav={setPage} flowServiceType={flowServiceType} />
      <div style={{ flex: 1, overflowY: "auto", position: "relative" }}>
        {/* Plugin 수신 알림 */}
        {pluginNotice && (
          <div style={{ position: "fixed", top: 16, right: 16, zIndex: 9999, padding: "12px 20px", borderRadius: 10, background: "#059669", color: "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 20px rgba(5,150,105,0.3)", animation: "slideIn .3s ease" }}>
            ✓ {pluginNotice}
          </div>
        )}

        {page === "dashboard" && <Dashboard onNav={setPage} />}
        {page === "audit-brand" && <AuditPage archive={archive} onAddResult={addResult} onNav={setPage} serviceType="brand" flows={flows} setActiveFlowId={setActiveFlowId} setFlowServiceType={setFlowServiceType} />}
        {page === "audit-linked" && <AuditPage archive={archive} onAddResult={addResult} onNav={setPage} serviceType="linked" flows={flows} setActiveFlowId={setActiveFlowId} setFlowServiceType={setFlowServiceType} />}
        {page === "audit-usability" && <AuditPage archive={archive} onAddResult={addResult} onNav={setPage} serviceType="usability" flows={flows} setActiveFlowId={setActiveFlowId} setFlowServiceType={setFlowServiceType} />}
        {page === "flow-audit" && <FlowAuditPage flows={flows} setFlows={setFlows} activeFlowId={activeFlowId} setActiveFlowId={setActiveFlowId} onNav={setPage} onAddResult={addResult} serviceType={flowServiceType} />}
        {page === "results" && <ResultsPage archive={archive} onNav={setPage} />}
        {page === "qarules" && <QARulesPage />}
        {page === "checklist" && <ChecklistPage />}
        {page === "tokens" && <TokensPage initialTab="colors" />}
        {page === "typography" && <TokensPage initialTab="typography" />}
        {page === "components" && <ComponentsPage />}
        {page === "dsrules" && <DSRulesPage />}
        {page === "patterns" && <PatternsPage />}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </div>
  );
}
