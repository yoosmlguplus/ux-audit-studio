# UX Audit Engine v2 — Core Engine Specification

> Claude Code에 이 문서를 전달하면 v2와 동일한 검수 정확도를 재현할 수 있습니다.
> UI/디자인 코드는 제외하고, **검수 엔진(프롬프트 + 데이터 + 스코어링)** 만 포함합니다.

---

## 목차
1. [아키텍처 개요](#1-아키텍처-개요)
2. [UDS 디자인 토큰 데이터](#2-uds-디자인-토큰-데이터)
3. [검수 규칙 데이터](#3-검수-규칙-데이터)
4. [엔진 함수](#4-엔진-함수)
5. [API 호출 설정](#5-api-호출-설정)
6. [서비스 유형별 설정](#6-서비스-유형별-설정)
7. [핵심 설계 원칙](#7-핵심-설계-원칙)

---

## 1. 아키텍처 개요

```
입력 (이미지/URL/Figma)
  │
  ▼
buildAllPolicyItems()     ← 84개 Policy 항목 통합
  │
  ▼
buildAuditPrompt()        ← 모드별 + 서비스유형별 프롬프트 생성
  │                          ctx 맥락 태그 필터링 지시 포함
  ▼
runAIAudit()              ← Claude API 호출 (temperature: 0)
  │                          이미지: 2000px 압축 전송
  │                          Figma: mcp_servers 연결
  │                          URL/Proto: web_search 도구
  ▼
parseAIJSON()             ← 3단계 JSON 파싱 (직접→경계탐색→괄호보정)
  │
  ▼
scoreFromAIResults()      ← verdict 처리 + 범위 조정 + 점수 산출
  │                          서비스유형별 배점 분기
  │                          ctx 기반 out-of-scope 제외
  ▼
result 객체 반환           ← score, verdict, breakdown, issues, passes, skipped, outOfScope
```

### 서비스 유형 3종

| 유형 | Policy 배점 | DS 배점 | 추가 기능 |
|---|---|---|---|
| 브랜드 서비스 (`brand`) | 60 | 40 | DS Rules 전체 적용 |
| 별도 서비스 (`separate`) | 100 | 제외 | DS 미적용 서비스 대상 |
| 사용성 검증 (`usability`) | 100 | 제외 | 학술적 UX 전문가 의견 추가 |

### 검수 모드 4종

| 모드 | 입력 | 도구 | skip 처리 |
|---|---|---|---|
| `image` | 스크린샷 | Claude Vision | 허용 (분모 제외) |
| `figma` | Figma URL + 스크린샷 | Figma MCP | fail 전환 |
| `url` | 서비스 URL | web_search | fail 전환 |
| `prototype` | 프로토타입 URL | web_search | 범위 적응형 (o 허용) |

---

## 2. UDS 디자인 토큰 데이터

```javascript
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

```

---

## 3. 검수 규칙 데이터

### 3-1. DS Rules + QA Pillars + QA Rules + UX Checklist + UI Checklist + Screen Patterns

```javascript
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
  { id: "UXC_GL_03", cat: "목표 & 문제 정의", q: "이 기능이 없으면 사용자가 불편함을 느끼는가?", ctx: "all" },
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
```

### 3-2. 데이터 요약

| 데이터 | 항목 수 | 용도 |
|---|---|---|
| `DS_RULES` | 18개 | 디자인 시스템 빌드 규칙 (auto 플래그로 자동검수 대상 구분) |
| `QA_PILLARS` | 4개 | Perfect Fit / Make Sense / Be Transparent / Seamless Flow |
| `QA_RULES` | 24개 | 4 Pillars × 8 Principles × 3 Rules |
| `UX_CHECKLIST` | 34개 | 9 카테고리, ctx 맥락 태그 포함 |
| `UI_CHECKLIST` | 26개 | 7 카테고리, ctx 맥락 태그 포함 |
| `SCREEN_PATTERNS` | 19개 | 7 카테고리 화면 패턴 |
| **Policy 합계** | **84개** | QA_RULES + UX_CHECKLIST + UI_CHECKLIST |

### 3-3. ctx 맥락 태그 체계

| ctx | 적용 조건 | 항목 수 |
|---|---|---|
| `all` | 모든 화면 | 33 |
| `dynamic` | 동적검수 전용 (이미지 모드 제외) | 14 |
| `form` | 입력/폼 화면 | 포함 9 |
| `flow` | 멀티스텝 플로우 | 포함 6 |
| `error` | 에러/예외 화면 | 포함 7 |
| `list` | 목록 화면 | 포함 2 |
| `info` | 정보 표시 | 포함 1 |

---

## 4. 엔진 함수

> 이 코드가 검수 정확도를 결정하는 핵심입니다.

```javascript
function buildAllPolicyItems() {
  return [
    ...QA_RULES.map(r => ({ id: r.id, msg: r.rule, source: "UX Policy", pillar: r.pillar, principle: r.principle, detail: r.detail, severity: r.severity, ctx: "all" })),
    ...UX_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UX Checklist", cat: r.cat, severity: "warning", ctx: r.ctx || "all" })),
    ...UI_CHECKLIST.map(r => ({ id: r.id, msg: r.q, source: "UI Checklist", cat: r.cat, severity: "warning", ctx: r.ctx || "all" })),
  ];
}

function buildAuditPrompt(screenName, allItems, dsRules, mode, extraCtx, serviceType) {
  var pList = allItems.map(function(r){return r.id+"|"+r.msg+"|ctx:"+r.ctx;}).join("\n");
  var dList = dsRules.map(function(r){return r.id+"|"+r.rule;}).join("\n");

  var usabilityBlock = "";
  if (serviceType === "usability") {
    usabilityBlock = "\n\n## USABILITY EXPERT OPINION (사용성 검증 모드 전용)\nAfter scoring all items, provide an additional expert opinion section in the JSON response.\nAnalyze the screen from these academic/conventional UX perspectives:\n- Nielsen's 10 Heuristics (가시성, 일치성, 사용자 제어, 일관성, 오류 방지, 재인식, 유연성, 미적 설계, 오류 복구, 도움말)\n- Fitts' Law (터치 타겟 크기, CTA 배치)\n- Hick's Law (선택지 수, 인지 부하)\n- Gestalt Principles (근접성, 유사성, 연속성, 폐합)\n- Accessibility (WCAG 대비율, 키보드 접근, 스크린리더)\nProvide 3-5 key findings in 'ux_opinion' field as array of {rule, finding, suggestion} objects.\nrule: which principle, finding: Korean 1 sentence, suggestion: Korean 1 sentence.";
  }

  var ctxGuide = "\n\n## CONTEXT-AWARE FILTERING (CRITICAL)\nEach checklist item has a ctx tag. FIRST identify the screen type, THEN apply only matching items.\n\nScreen type → ctx mapping:\n- Homepage/Dashboard/Info display → all, info, list\n- Product list/Search results → all, list, info\n- Form/Input/Registration → all, form, flow\n- Error/Empty/Failure page → all, error\n- Multi-step flow screen → all, flow, form\n- Settings/Config screen → all, form\n- Detail/Content page → all, info\n\nctx meanings:\n- 'all': applies to every screen\n- 'form': only if screen has input fields, selections, or form elements\n- 'flow': only if screen is part of a multi-step journey\n- 'error': only if screen shows error, empty, failure, or exception states\n- 'list': only if screen displays lists, grids, or collections of items\n- 'info': only if screen displays informational content\n- 'dynamic': only in Figma/URL/Prototype mode (skip in image mode)\n\nIf an item's ctx does NOT match the screen type → mark as 'o' (out of scope, not scored).\nDo NOT force-fail items that are simply not relevant to this screen's purpose.";

  var modeBlock = "";
  if (mode === "figma") {
    modeBlock = "Mode: FIGMA FILE. Use Figma MCP to read frames, tokens, variants, layer names.\n- Inspect ALL frames for flow continuity and navigation consistency.\n- Check color variable bindings, text style tokens, spacing tokens.\n- Verify component variant states (default/hover/active/disabled).\n- If a screenshot is also provided, cross-reference visual with MCP data.\n- Items with ctx='dynamic' CAN be judged via MCP (variant states, interaction specs).\n- Every in-scope item MUST be p or f. Use 'o' only for ctx mismatch.\nFigma URL: "+(extraCtx||"");
  } else if (mode === "prototype") {
    modeBlock = "Mode: PROTOTYPE URL — Scope-Aware Usability Audit\nPrototype URL: "+(extraCtx||"")+"\n\nCRITICAL: Prototypes are often PARTIAL.\n1. First identify prototype scope: screens, flows, boundaries.\n2. For each item: check ctx tag AND prototype scope. If either doesn't match → 'o'.\n3. Only score items within BOTH screen context AND prototype scope.\n4. DS Rules excluded (no code access).";
  } else if (mode === "url") {
    modeBlock = "Mode: LIVE URL. Use web_search to analyze page.\n- Every in-scope item MUST be p or f.\nURL: "+(extraCtx||"");
  } else {
    modeBlock = "Mode: STATIC IMAGE.\n- First identify screen type from the image content.\n- Apply context filtering: only score items whose ctx matches the screen type.\n- Items with ctx='dynamic' → always 'o' in image mode.\n- Items whose ctx doesn't match screen type → 'o'.\n- Remaining items: judge strictly p or f based on what you SEE.";
  }

  var dsBlock = mode === "prototype" ? "" : "\n\nDS("+dsRules.length+"):\n"+dList;
  var verdictHelp = "Verdicts: p(pass), f(fail), o(out of scope/context mismatch). Reason Korean max 15 chars.";
  var scopeFields = mode === "prototype" ? ",\"sc\":0,\"fl\":\"\",\"bd\":\"\"" : "";

  var uxOpinionField = serviceType === "usability" ? ",\"ux_opinion\":[{\"rule\":\"원칙\",\"finding\":\"발견\",\"suggestion\":\"제안\"}]" : "";

  return "You are a UX/UI audit engine.\nScreen: "+screenName+"\n\n"+modeBlock+ctxGuide+usabilityBlock+"\n\n"+verdictHelp+"\n\nPolicy("+allItems.length+"):\n"+pList+dsBlock+"\n\nONLY valid JSON:\n{\"a\":{\"p\":\"목적\",\"u\":\"사용자\",\"f\":[\"기능\"],\"t\":\"유형\",\"st\":\"screen_type\""+scopeFields+"},\"r\":[{\"id\":\"ID\",\"v\":\"p\",\"m\":\"근거\"}]"+uxOpinionField+"}";
}

function scoreFromAIResults(aiResults, mode, serviceType) {
  const allItems = buildAllPolicyItems();
  const dsAutoRules = DS_RULES.filter(r => r.auto);
  const isProto = mode === "prototype";
  const noDS = isProto || serviceType === "separate" || serviceType === "usability";

  // DS excluded: 100% from Policy. Otherwise: Policy 60 + DS 40.
  const POLICY_MAX = noDS ? 100 : 60;
  const DS_MAX = noDS ? 0 : 40;

  const policyItems = allItems.length;
  const dsItems = dsAutoRules.length;
  const policyPerRule = POLICY_MAX / policyItems;
  const dsPerRule = dsItems > 0 ? DS_MAX / dsItems : 0;

  let policyLost = 0, dsLost = 0;
  const issues = [], passes = [], skipped = [], outOfScope = [];
  const policyBreakdown = { "UX Policy": { fail: 0, total: QA_RULES.length, oos: 0 }, "UX Checklist": { fail: 0, total: UX_CHECKLIST.length, oos: 0 }, "UI Checklist": { fail: 0, total: UI_CHECKLIST.length, oos: 0 } };

  const resultMap = {};
  (aiResults || []).forEach(r => { resultMap[r.id] = r; });

  const isDynamic = mode === "figma" || mode === "url" || mode === "prototype";

  // Policy scoring
  allItems.forEach(item => {
    const ai = resultMap[item.id];
    const rawV = ai?.verdict || "skip";
    const reason = ai?.reason || "";

    // "o" = out of scope — excluded from scoring entirely
    if (rawV === "o" || rawV === "out_of_scope") {
      outOfScope.push({ id: item.id, msg: item.msg, category: item.source, reason: reason || "범위 밖" });
      if (policyBreakdown[item.source]) policyBreakdown[item.source].oos += 1;
      return;
    }

    const v = (rawV === "skip" && isDynamic && !isProto) ? "fail" : rawV;

    if (v === "fail") {
      policyLost += 1;
      if (policyBreakdown[item.source]) policyBreakdown[item.source].fail += 1;
      let pillarName, principleName;
      if (item.source === "UX Policy") {
        const pillar = QA_PILLARS.find(p => p.id === item.pillar);
        const principle = pillar?.principles.find(pr => pr.id === item.principle);
        pillarName = pillar?.name; principleName = principle?.ko;
      }
      issues.push({ id: item.id, msg: item.msg, fix: reason || (rawV==="skip" ? "동적 검수 미확인" : ""), stage: "Policy", status: "fail", category: item.source, severity: item.severity, deduction: 0, pillarName, principleName, cat: item.cat, aiReason: reason });
    } else if (v === "skip") {
      skipped.push({ id: item.id, msg: item.msg, category: item.source, reason: reason || "이미지에서 판단 불가" });
      if (policyBreakdown[item.source]) policyBreakdown[item.source].oos += 1;
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
      const v = (rawV === "skip" && isDynamic) ? "fail" : rawV;

      if (v === "fail") {
        const d = +dsPerRule.toFixed(1);
        dsLost += d;
        issues.push({ id: item.id, msg: item.rule, fix: reason || (rawV==="skip" ? "동적 검수 미확인" : ""), stage: "DS", status: "fail", category: "DS", severity: item.severity, deduction: d, aiReason: reason });
      } else if (v === "skip") {
        skipped.push({ id: item.id, msg: item.rule, category: "DS", reason: reason || "이미지에서 판단 불가" });
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
  var noDS = mode==="prototype" || serviceType==="separate" || serviceType==="usability";
  var extra = mode==="figma" ? figmaUrl : (mode==="url"||mode==="prototype") ? pageUrl : "";
  var prompt = buildAuditPrompt(screenName, allItems, noDS ? [] : dsAuto, mode, extra, serviceType);

  var messages = [{role:"user",content:[]}];
  if ((mode==="image"||mode==="figma") && imageBase64) {
    var mt = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
    messages[0].content.push({type:"image",source:{type:"base64",media_type:mt,data:imageBase64.split(",")[1]}});
  }
  messages[0].content.push({type:"text",text:prompt});

  var apiBody = {model:"claude-sonnet-4-20250514",max_tokens:8000,temperature:0,messages:messages};
  if (mode==="figma"&&figmaUrl) { apiBody.mcp_servers=[{type:"url",url:"https://mcp.figma.com/mcp",name:"figma-mcp"}]; }
  if (mode==="url"||mode==="prototype") { apiBody.tools=[{type:"web_search_20250305",name:"web_search"}]; }

  try {
    var response = await fetch("https://api.anthropic.com/v1/messages", {
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
    result.auditMode = mode;
    result.serviceType = serviceType;
    result.uxOpinion = parsed.ux_opinion || null;
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
```

---

## 5. API 호출 설정 (정확도에 직접 영향)

```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 8000,
  temperature: 0,              // ★ 핵심: 동일 입력 → 동일 결과
  messages: [
    { role: "user", content: [
      { type: "image", source: { type: "base64", media_type: "image/jpeg", data: "..." } },
      { type: "text", text: prompt }
    ]}
  ]
}
```

### 이미지 전처리
- 원본: 화면 표시용 (리사이즈 없음)
- API용: **최대 2000px**로 리사이즈 + JPEG 85% 압축
- 8000px 초과 시 API 400 에러 발생하므로 반드시 리사이즈 필요

### 모드별 도구 설정
- `figma` → `apiBody.mcp_servers = [{type:"url", url:"https://mcp.figma.com/mcp", name:"figma-mcp"}]`
- `url`, `prototype` → `apiBody.tools = [{type:"web_search_20250305", name:"web_search"}]`

---

## 6. 서비스 유형별 설정

### 배점 분기 (scoreFromAIResults 내부)

```javascript
const noDS = isProto || serviceType === "separate" || serviceType === "usability";
const POLICY_MAX = noDS ? 100 : 60;
const DS_MAX = noDS ? 0 : 40;
```

### 프롬프트 분기 (buildAuditPrompt 내부)

```javascript
// DS Rules를 프롬프트에서 제외
var prompt = buildAuditPrompt(screenName, allItems, noDS ? [] : dsAuto, mode, extra, serviceType);
```

### 사용성 검증 추가 프롬프트

```
serviceType === "usability" 일 때 추가되는 지시:
- Nielsen's 10 Heuristics
- Fitts' Law (터치 타겟 크기, CTA 배치)
- Hick's Law (선택지 수, 인지 부하)
- Gestalt Principles (근접성, 유사성, 연속성, 폐합)
- Accessibility (WCAG 대비율, 키보드 접근)

→ ux_opinion 필드로 3-5개 전문가 의견 반환
```

---

## 7. 핵심 설계 원칙 (정확도를 높이는 요소)

### 7-1. 프롬프트 설계

1. **화면 유형 먼저 파악** — AI가 화면의 목적, 사용자, 기능을 먼저 분석한 뒤 채점
2. **ctx 맥락 필터링** — 화면 유형과 무관한 항목을 `o`(out of scope)로 제외하여 오판 방지
3. **압축 응답 형식** — `v`(verdict), `m`(reason) 등 짧은 키로 토큰 절약, 15자 이내 근거
4. **모드별 분리 지시** — Image/Figma/URL/Prototype 각각 다른 분석 방법과 제약 조건 명시

### 7-2. 스코어링 설계

1. **범위 적응형 채점** — out-of-scope/skip 항목을 분모에서 제외하여 공정한 점수 산출
2. **균등 감점** — 범위 내 항목당 동일 감점 (`POLICY_MAX / policyInScope`)
3. **세부 breakdown도 in-scope 기준** — 카테고리별 통과율이 총점과 일관
4. **temperature: 0** — 동일 입력에 대한 결정론적 출력으로 재현성 보장

### 7-3. JSON 파싱 안정성

```
1차: 직접 JSON.parse
2차: { } 경계 탐색 후 substring 파싱
3차: 잘린 JSON의 미닫힌 [] {} 자동 보정 후 파싱
```

→ API 응답이 잘리거나 markdown fence로 감싸여도 안정적으로 파싱

### 7-4. result 객체 구조

```javascript
{
  score: Number,           // 0~100
  verdict: String,         // "PASS" | "FAIL" | "ERROR"
  auditMode: String,       // "image" | "figma" | "url" | "prototype"
  serviceType: String,     // "brand" | "separate" | "usability"
  breakdown: {
    policy: Number, policyMax: Number,
    ds: Number, dsMax: Number,
    policyDetail: {
      "UX Policy":    { fail, total, oos },
      "UX Checklist": { fail, total, oos },
      "UI Checklist": { fail, total, oos },
    }
  },
  issues: Array,           // fail 항목 (감점순 정렬)
  passes: Array,           // pass 항목
  skipped: Array,          // 판단 불가 항목
  outOfScope: Array,       // 범위 밖 항목
  scoredCount: Number,     // 실제 채점 항목 수
  skippedCount: Number,
  outOfScopeCount: Number,
  screenAnalysis: Object,  // AI 화면 분석 결과
  uxOpinion: Array | null, // 사용성 검증 모드 전용
  timestamp: String
}
```

---

## Claude Code에 전달할 핵심 지시

이 문서의 코드를 그대로 사용하되, 다음 사항을 반드시 유지하세요:

1. **프롬프트의 CONTEXT-AWARE FILTERING 섹션 전체** — 이것이 오판율을 크게 낮추는 핵심
2. **temperature: 0** — 이걸 빼면 매번 점수가 달라짐
3. **ctx 태그가 포함된 체크리스트 항목 전체** — 태그 없으면 맥락 필터링 불가
4. **3단계 JSON 파싱** — API 응답 잘림 대응 필수
5. **이미지 2000px 리사이즈** — 안 하면 8000px 초과 에러
6. **범위 적응형 점수 산출** — out-of-scope 분모 제외 로직
