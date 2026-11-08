# DESIGN_SYSTEM.md - 심플·어반 디자인 시스템

[적용 범위]

- TASK-DEV-25에서 전역 디자인 토큰과 가독성 기준을 정의함. 화면별 CSS 마이그레이션은 TASK-DEV-26, 시각 회귀 검증은 TASK-QA-09에서 수행함.
- 새 코드는 `--color-*`, `--font-*`, `--space-*`, `--radius-*`, `--border-*`, `--shadow-*`, `--motion-*` 토큰을 사용함.
- `--bg-*`, `--text-*`, `--primary-*`, `--success-*`, `--amber-*`, `--radius-sm|md|lg|xl`, `--shadow-lg|xl`, `--transition-*`는 기존 화면 호환용 별칭임. TASK-DEV-26에서 화면별 CSS와 함께 제거함.
- 토큰 정의 위치는 `src/styles/index.css`의 `:root`이며, 전역 셸 적용은 `src/styles/App.css`와 `index.html`에서 확인할 수 있음.

---

## 1. 디자인 원칙

1. **도시적 유틸리티**: 교통 표지판·건축 도면·편집 디자인처럼 장식보다 정보 구조와 여백으로 위계를 만든다.
2. **단일 신호색**: off-white·concrete·charcoal 중립 팔레트에 signal orange 1개만 강조색으로 사용한다. 성공·경고·오류 색은 의미 전달에만 제한한다.
3. **표면은 면과 보더로 구분**: 1px 보더를 우선하고 그림자·블러·그라데이션은 기능적 예외 외 사용하지 않는다.
4. **기능성 모션만 유지**: 상태 변화 피드백과 타일 슬라이드에만 모션을 사용한다. pulse·bounce·spring 장식은 사용하지 않는다.
5. **아이콘 단일화**: lucide 단일 라인 아이콘 또는 텍스트 라벨을 사용하고 UI 문구에 이모지를 넣지 않는다.
6. **읽기 우선**: 최소 글자 크기·대비·행간·숫자 정렬 기준을 지키고, 장식보다 본문 가독성을 우선한다.

---

## 2. 디자인 토큰

### 2.1 Color - Neutral

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--color-ink` | `#171713` | 워드마크·최상위 제목 |
| `--color-charcoal` | `#22221D` | 기본 텍스트 |
| `--color-graphite` | `#4E4E47` | 보조 텍스트·설명 |
| `--color-steel` | `#62625A` | 메타 텍스트·비활성 상태 |
| `--color-concrete-strong` | `#A3A39A` | 장식 보더·비활성 아이콘 |
| `--color-concrete` | `#D2D2C9` | 기본 구조 보더 |
| `--color-concrete-soft` | `#E4E4DC` | 보조 표면·입력 배경 |
| `--color-canvas` | `#EFEFEA` | 앱 배경 |
| `--color-paper` | `#F7F7F3` | 기본 카드·패널 표면 |
| `--color-white` | `#FFFFFF` | 반전 텍스트·최상위 표면 |

### 2.2 Color - Signal

단일 강조색은 signal orange 계열만 사용한다. 모드·테마별 강조색을 새로 만들지 않는다.

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--color-signal-50` | `#FDF1E8` | 선택 배경·약한 강조 |
| `--color-signal-100` | `#F9DDC8` | 선택 영역·호버 배경 |
| `--color-signal-200` | `#F2B892` | 보조 보더·비활성 강조 |
| `--color-signal-500` | `#D9480F` | UI 보더·아이콘·3:1 이상 경계 |
| `--color-signal-600` | `#BB3E0B` | 기본 CTA·링크 텍스트·포커스 링 |
| `--color-signal-700` | `#9A3412` | CTA 호버·진한 강조 표면 |
| `--color-signal-800` | `#7C2D12` | 진한 표면 보더·최대 대비 강조 |

### 2.3 Color - Semantic

의미색은 성공·경고·오류 상태에만 사용한다. 장식 목적의 색상 강조에는 사용하지 않는다.

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--color-success-subtle` | `#E8F3EC` | 성공 배경 |
| `--color-success` | `#2F7D4F` | 성공 아이콘·표시 |
| `--color-success-strong` | `#1F6A3D` | 성공 텍스트 |
| `--color-warning-subtle` | `#FAF1DE` | 경고 배경 |
| `--color-warning` | `#8A5A12` | 경고 텍스트·아이콘 |
| `--color-warning-strong` | `#6F470C` | 경고 강조 텍스트 |
| `--color-danger-subtle` | `#FCEDEA` | 오류 배경 |
| `--color-danger` | `#C63A2F` | 오류 아이콘·표시 |
| `--color-danger-strong` | `#A62B22` | 오류 텍스트 |

### 2.4 Typography

Plus Jakarta Sans·Google Fonts 의존을 제거하고 시스템 폰트 스택을 사용한다. 숫자는 monospace와 `tabular-nums`를 조합한다.

| 토큰 | 값 |
| :--- | :--- |
| `--font-sans` | `system-ui, -apple-system, 'Segoe UI', 'Malgun Gothic', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif` |
| `--font-mono` | `ui-monospace, 'SFMono-Regular', 'Cascadia Mono', 'Roboto Mono', Consolas, monospace` |
| `--font-size-xs` | `12px` |
| `--font-size-sm` | `14px` |
| `--font-size-md` | `16px` |
| `--font-size-lg` | `18px` |
| `--font-size-xl` | `24px` |
| `--font-size-2xl` | `32px` |
| `--font-size-3xl` | `40px` |
| `--line-height-tight` | `1.25` |
| `--line-height-snug` | `1.4` |
| `--line-height-normal` | `1.5` |
| `--line-height-relaxed` | `1.65` |
| `--font-weight-regular` | `400` |
| `--font-weight-medium` | `500` |
| `--font-weight-semibold` | `600` |
| `--font-weight-bold` | `700` |

### 2.5 Spacing

4px 기준의 8단계 이하 스케일을 사용한다. 임의의 `0.65rem`·`10px` 같은 중간값을 새로 만들지 않는다.

| 토큰 | 값 | 토큰 | 값 |
| :--- | :--- | :--- | :--- |
| `--space-0` | `0` | `--space-1` | `4px` |
| `--space-2` | `8px` | `--space-3` | `12px` |
| `--space-4` | `16px` | `--space-5` | `20px` |
| `--space-6` | `24px` | `--space-8` | `32px` |
| `--space-10` | `40px` | `--space-12` | `48px` |
| `--space-16` | `64px` | | |

### 2.6 Radius / Border / Shadow

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--radius-0` | `0` | 테이블·구분선·각진 표면 |
| `--radius-1` | `4px` | 버튼·입력·작은 패널 |
| `--radius-2` | `8px` | 카드·모달 패널 최대 반경 |
| `--border-width` | `1px` | 기본 보더 |
| `--border-color` | `var(--color-concrete)` | 구조 보더 |
| `--border-color-strong` | `#82827A` | 입력·상호작용 경계 |
| `--border-default` | `1px solid var(--color-concrete)` | 공통 표면 보더 |
| `--focus-ring-width` | `2px` | 키보드 포커스 링 |
| `--focus-ring-offset` | `2px` | 포커스 링 간격 |
| `--shadow-none` | `none` | 기본 표면 |
| `--shadow-sm` | `0 1px 0 rgba(23, 23, 19, 0.06)` | 최소 구분 |
| `--shadow-md` | `0 2px 4px rgba(23, 23, 19, 0.08)` | 떠 있는 배너 |
| `--shadow-lg` | `0 4px 12px rgba(23, 23, 19, 0.10)` | 레거시 별칭 |
| `--shadow-xl` | `0 8px 24px rgba(23, 23, 19, 0.12)` | 레거시 별칭, TASK-DEV-26에서 제거 |

### 2.7 Motion

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--motion-duration-fast` | `120ms` | 타일 슬라이드·호버·포커스 |
| `--motion-duration-base` | `180ms` | 모달·배너 진입 |
| `--motion-duration-slow` | `240ms` | 제한적 상태 전환 |
| `--motion-ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 기본 감속 |
| `--motion-ease-enter` | `cubic-bezier(0, 0, 0.2, 1)` | 진입 |
| `--motion-ease-exit` | `cubic-bezier(0.4, 0, 1, 1)` | 퇴장 |

`prefers-reduced-motion: reduce`에서는 `index.css`의 전역 규칙이 애니메이션·트랜지션 시간을 0.01ms로 줄이고 반복을 1회로 제한한다. 새 모션을 추가할 때도 이 규칙을 우회하지 않는다.

### 2.8 Layer / Layout

| 토큰 | 값 | 용도 |
| :--- | :--- | :--- |
| `--z-base` | `0` | 기본 콘텐츠 |
| `--z-sticky` | `100` | 고정 헤더 |
| `--z-overlay` | `1000` | 모달 배경 |
| `--z-modal` | `1100` | 모달 패널 |
| `--z-toast` | `2000` | 토스트·업데이트 배너 |
| `--layout-content-max` | `500px` | 게임 콘텐츠 최대 폭 |
| `--layout-page-max` | `960px` | 페이지 최대 폭 |
| `--gutter-inline` | `var(--space-4)` | 기본 좌우 여백 |
| `--gutter-block` | `var(--space-6)` | 기본 상하 여백 |

---

## 3. 가독성 기준

### 3.1 글자 크기·행간·굵기

- 본문은 **14~16px**, 긴 설명은 **16px**을 기본으로 한다.
- 메타데이터·배지·캡션은 **최소 12px**이며 12px 미만은 금지한다.
- 제목은 `--line-height-tight`(1.25), UI 라벨은 `--line-height-snug`(1.4), 본문은 `--line-height-normal`(1.5), 장문은 `--line-height-relaxed`(1.65)를 사용한다.
- 굵기는 **400/500/600/700**만 사용한다. 기존 800·900은 TASK-DEV-26에서 700 이하로 정리한다.
- 한 줄에 들어가는 본문 길이는 데스크톱 기준 60~75자, 모바일에서는 30~40자를 넘기지 않도록 줄바꿈과 최대 폭을 함께 조정한다.

### 3.2 숫자

- 타이머·이동 수·기록·퍼센트처럼 값이 갱신되는 숫자는 `--font-mono`와 `font-variant-numeric: tabular-nums`를 함께 사용한다.
- 재사용 클래스는 `index.css`의 `.u-numeric`이며, 별도 클래스를 만들 때도 `tabular-nums`를 반드시 포함한다.
- 숫자와 단위(초, 수, %) 사이에는 시각적 간격을 두되, 단위를 숫자보다 작은 크기로 표시할 때도 최소 12px를 지킨다.

### 3.3 대비

WCAG 2.1 상대 휘도로 계산한 주요 조합은 다음과 같다. 일반 텍스트는 4.5:1 이상, 큰 텍스트(24px 이상 또는 19px 굵게)와 UI 경계는 3:1 이상을 요구한다.

| 전경 | 배경 | 대비 |
| :--- | :--- | ---: |
| `--color-charcoal` | `--color-paper` | 14.87:1 |
| `--color-charcoal` | `--color-canvas` | 13.85:1 |
| `--color-graphite` | `--color-paper` | 7.81:1 |
| `--color-graphite` | `--color-canvas` | 7.27:1 |
| `--color-steel` | `--color-paper` | 5.73:1 |
| `--color-steel` | `--color-canvas` | 5.33:1 |
| `--color-signal-600` | `--color-paper` | 5.14:1 |
| `--color-signal-600` | `--color-canvas` | 4.78:1 |
| `--color-white` | `--color-signal-600` | 5.52:1 |
| `--color-white` | `--color-signal-700` | 7.31:1 |
| `--color-success-strong` | `--color-success-subtle` | 5.79:1 |
| `--color-warning` | `--color-warning-subtle` | 5.27:1 |
| `--color-danger-strong` | `--color-danger-subtle` | 6.17:1 |
| `--color-danger` | `--color-paper` | 4.83:1 |
| `--border-color-strong` | `--color-paper` | 3.61:1 |

- `--color-concrete`는 구조 보더용이며 대비가 1.42:1이므로 단독으로 상호작용 경계를 표시하지 않는다. 입력·버튼 경계는 `--border-color-strong` 또는 `--color-signal-600` 포커스 링을 함께 사용한다.
- `--color-signal-500`은 UI 보더·아이콘에 사용하며 종이 배경 대비 4.00:1로 3:1 기준을 충족한다.
- 색만으로 상태를 전달하지 않는다. 오류·성공·경고는 텍스트 라벨이나 아이콘을 함께 표시한다.

### 3.4 포커스·터치

- 키보드 포커스는 `2px solid var(--color-signal-600)`과 `outline-offset: 2px`를 유지한다. `outline: none`만 적용하는 것을 금지한다.
- 터치 가능한 컨트롤은 최소 **44×44px**의 히트 영역을 확보한다.
- 360px 폭에서 가로 스크롤이 발생하지 않아야 하며, 고정 높이 화면에서도 핵심 조작이 잘리지 않아야 한다.

---

## 4. AI 디자인 금지·지양 목록

### 4.1 금지

- 보라·파랑 그라데이션을 장식 배경이나 CTA에 사용하는 것
- glassmorphism, `backdrop-filter: blur()`, 반투명 유리 표면
- 네온 글로우, `box-shadow` 기반 발광, `text-shadow` 발광
- 기본 표면에 `border-radius: 9999px` pill을 남용하는 것
- 모든 카드에 큰 radius와 그림자를 동시에 적용하는 것
- 이모지 스파클(✨)과 UI 문구 속 이모지(🧩·🎬·💡·🔥·⚡·👣·🛡️)
- 의미 없는 중앙 정렬 히어로와 장식만을 위한 큰 빈 공간
- 화면마다 임의의 강조색을 추가하는 것
- 모드별 4색 카드와 과도한 spring·bounce·pulse 장식
- 장식 목적의 반복 애니메이션과 `prefers-reduced-motion` 미대응

### 4.2 지양

- 한 화면에 2개 이상의 그림자 단계를 사용하는 것
- 아이콘 라이브러리(lucide), PNG 스프라이트, 이모지를 한 화면에서 혼용하는 것
- 모든 텍스트를 중앙 정렬하는 것
- 의미 없는 구분선·점선·장식 배지를 추가하는 것
- hover에서 `translateY(-1px)`와 그림자 확대를 동시에 사용하는 것

### 4.3 허용 예외

- 테마 이미지·퍼즐 타일의 실제 이미지 표현
- `0.12s` 타일 슬라이드와 짧은 페이드·슬라이드 진입
- 승리·업적의 1회성 피드백(짧은 시간, 반복 없음, reduced motion에서 생략)
- `focus-visible` 포커스 링
- 성공·경고·오류 의미색
- 테마·난이도 선택처럼 정보 구조상 필요한 색상 구분(단, 4색 그라데이션 카드는 금지)

---

## 5. 화면별 마이그레이션 기준 (TASK-DEV-26)

| 화면·영역 | 현재 상태 | 목표 |
| :--- | :--- | :--- |
| 전역 셸 | TASK-DEV-25에서 평면 배경·시스템 폰트·토큰 적용 완료 | 유지. 새 전역 장식 추가 금지 |
| 타이틀 | 모드별 4색 그라데이션 카드, 이모지 히어로, 9999px pill, 다수 그라데이션 | 강한 워드마크, 텍스트·단일 아이콘 기반 모드 목록, 1차 CTA 1개, 1px 보더·8px radius |
| 헤더·HUD | 그라데이션 배지, 0.65~0.725rem 메타, pill 상태 표시 | 1줄 HUD, 세그먼트/텍스트 상태, 타이머·이동 수 `.u-numeric`, 메타 12px 이상 |
| 컨트롤 | 9999px pill, 버튼별 그라데이션, 0.7rem 라벨 | 텍스트·세그먼트 툴바, 4px radius, 1px 보더, 44px 터치 영역 |
| 보드·타일 | 빈 슬롯 네온 글로우, 힌트 radial-gradient·blur·text-shadow, 0.12s 슬라이드 유지 | 타일 이미지와 0.12s 슬라이드는 유지. 빈 슬롯은 1px 보더·단색 면, 힌트는 신호색 보더와 텍스트 라벨로 축소, 숫자 대비 강화 |
| 모달 | `backdrop-filter: blur(4~5px)`, `radius-xl`(→8px), `popIn` spring, 중앙 정렬 제목 | solid dim overlay, 평면 패널, 1px 보더, 8px radius, 좌측 정렬 제목. 기존 포커스 트랩·`inert` 유지 |
| 업적·토스트 | 금색 방사형 글로우, 그라데이션 진행 바, 0.58rem 텍스트 | 평면 리스트, 1px 보더, 단색 진행 바, 12px 이상 메타 |
| PWA·배너 | `shadow-xl`, 1.5px 강조 보더, 0.7rem 텍스트 | 평면 배너, 1px 보더, 12px 이상 텍스트, 단일 신호색 CTA |
| 다국어 문구 | 번역문·TSX에 UI 이모지 19곳 | 텍스트 또는 lucide 단일 아이콘으로 교체. 4개 국어 번역 키 유지 |
| 공유 카드 | 결과 카드 제목에 🧩 이모지 | 텍스트 워드마크 또는 기하학 마크로 교체 |

### 5.1 DEV-25 시점의 잔여 항목

TASK-DEV-25는 전역 토큰과 셸만 적용했으므로 화면별 CSS에는 다음 항목이 남아 있다. TASK-DEV-26에서 아래 순서로 제거한다.

1. 그라데이션 47건, `backdrop-filter` 14건, `9999px` pill 5건
2. 12px 미만 `font-size` 선언 38건(13개 CSS 파일)
3. UI 이모지 19곳과 800·900 굵기
4. `--shadow-xl`·`--radius-xl`·`--transition-spring` 등 레거시 별칭 사용처
5. `TitleScreen.css`·`Tile.css`·모달 CSS의 하드코딩 색상
6. PWA manifest의 `background_color`(`#0f172a`)·`theme_color`(`#2563eb`)와 설치 스플래시 색상. Service Worker 캐시 갱신을 함께 처리해야 하므로 DEV-26에서 SW 버전 갱신과 함께 검토함

---

## 6. 검증 방법

### 6.1 필수 검증

```powershell
npm test
npx tsc --noEmit
npm run build
```

### 6.2 토큰·가독성 검증

- 브라우저 개발자 도구에서 `getComputedStyle(document.documentElement).getPropertyValue('--color-canvas')` 등 토큰이 해석되는지 확인한다.
- 타이틀·게임 화면에서 `html`/`body`의 `font-family`가 시스템 스택이고, Google Fonts 요청이 0건인지 Network 패널로 확인한다.
- 360×800·1280×800에서 가로 스크롤·잘림·겹침이 없는지 확인한다.
- `prefers-reduced-motion: reduce` 에뮬레이션에서 모달·토스트 애니메이션이 반복되지 않는지 확인한다.
- 대비는 WCAG 2.1 상대 휘도 공식으로 계산하고, 새 색상 조합을 추가할 때 위 표에 수치를 갱신한다.

### 6.3 TASK-DEV-25 검증 결과

- `npm test`: 29개 파일/183개 케이스 PASS
- `npx tsc --noEmit`: 0 Errors
- `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지)
- 프로덕션 프리뷰(1000×700): `html`/`body`의 `font-family`가 시스템 스택으로 해석되고 `font-size` 16px·`line-height` 24px·`font-variant-numeric: tabular-nums`가 적용됨. `body`/`.app-container` 배경은 `rgb(239, 239, 234)`이고 `background-image`는 `none`임. Google Fonts 스타일시트·폰트 요청은 0건, 콘솔 error·warning은 0건임
- 토큰 해석: `--color-canvas` `#EFEFEA`, `--color-paper` `#F7F7F3`, `--color-signal-600` `#BB3E0B`, `--radius-xl` 8px, `--shadow-xl` `0 8px 24px rgba(23, 23, 19, .12)`, `--transition-spring` `180ms cubic-bezier(0.2, 0, 0, 1)`로 확인함
- 포커스: 키보드 Tab으로 이동했을 때 `outline: 2px solid #BB3E0B`, `outline-offset: 2px`가 적용됨
- 360×800 타이틀: 가로 오버플로 0건, 상단 바는 좌우 4~350px 범위에 들어옴. 세로 스크롤은 허용됨
- 360×800 게임: `bodyScrollHeight`/`documentElement.scrollHeight` 800px, 가로 오버플로 0건, 보드 310×310. 게임 카드는 1px 보더·4px radius(380px 이하 규칙)·그림자 없음
- 1280×800 게임: `bodyScrollHeight` 800px, 가로 오버플로 0건, 게임 카드는 1px 보더·8px radius·그림자 없음. 테마 모달 패널은 1px 보더·8px radius·축소된 그림자·0.18s 표준 easing으로 표시됨
- `prefers-reduced-motion: reduce` 전역 규칙이 빌드 CSS에 포함됨을 CSSOM에서 확인함. 실제 OS 설정 에뮬레이션은 수행하지 않음
- 미실행: 실제 모바일 실기기, Safari/Firefox 렌더링, 스크린리더 수동 검증, OS 수준 `prefers-reduced-motion` 에뮬레이션. 화면별 그라데이션·블러·작은 글자 제거는 TASK-DEV-26 범위임
