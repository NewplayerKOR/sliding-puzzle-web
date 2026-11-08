# Sliding Block Puzzle

* **참여자**: NewplayerKOR
* **기술 스택**: React 19, TypeScript, Vite
* **📌 개발/QA 세션 진입 시**: [AGENTS.md](./root/AGENTS.md)와 [TASKS.md](./root/TASKS.md)를 먼저 읽으세요.

React와 TypeScript 기반으로 개발된 클라이언트 사이드 슬라이딩 퍼즐(N-Puzzle) 웹 애플리케이션입니다. 브라우저 표준 API(Canvas API, Web Audio API, Web Worker, Service Worker)를 활용하여 별도 백엔드 없이 모든 기능이 동작합니다.

---

## 1. 주요 특징 (Features)

* **풀이 가능성 검증 (Solvability Validation)**: 반전수(Inversion Count)와 패리티(Parity) 판별을 통한 풀이 가능한 퍼즐 생성
* **텍스처 분할 렌더링**: 단일 텍스처를 CSS `background-position` 연산으로 분할 표시
* **비동기 AI 힌트**: 맨해튼 거리 및 선형 충돌 휴리스틱 기반 A* 알고리즘 (Web Worker 분리)
* **반응형 레이아웃**: `100dvh` 및 Safe Area 인셋을 적용한 1화면 레이아웃
* **심플·어반 디자인 시스템**: off-white·concrete·charcoal 중립 팔레트, 단일 신호색, 시스템 폰트·monospace 숫자, 1px 보더·0/4/8px radius·기능성 모션을 전 화면에 적용. 그라데이션·블러·네온 글로우·UI 이모지를 제거하고 lucide 단일 아이콘으로 통일. 상세 기준은 [DESIGN_SYSTEM.md](./root/DESIGN_SYSTEM.md)
* **PWA 오프라인 지원**: Service Worker 캐싱을 통한 오프라인 구동

---

## 2. 세부 기능 목록

| 모듈 | 기능명 | 설명 |
| :--- | :--- | :--- |
| **Core Game** | 3단계 난이도 및 셔플 | 3x3, 4x4, 5x5 난이도 선택 및 100회 상한 셔플 |
| **Game Modes** | 챌린지 모드 | Standard, Time Attack(제한시간), Move Limit(이동수 제한) |
| **AI Solver** | AI 스마트 힌트 | A* 알고리즘 기반 다음 이동 타일 및 방향 안내 (3초 쿨다운) |
| **Themes** | 4종 테마 및 숫자 모드 | 자연, 픽셀아트, 기하학 패턴, 동물 테마 프리셋 및 숫자 모드 전환 |
| **Custom Image** | 이미지 업로드 및 크롭 | 로컬 이미지(JPG, PNG, WebP, GIF) 드래그 앤 드롭·형식/용량 검증 및 Canvas 기반 1:1 크롭 |
| **Daily Puzzle** | 일일 챌린지 | Mulberry32 PRNG 기반 날짜별 시드 퍼즐 및 출석 스트릭 기록 |
| **Audio System** | 오디오 매니저 | 4종 BGM 트랙(96kbps MP3, 크로스페이드) 및 3채널 SFX 풀링. 최초에는 현재 트랙만 로드 |
| **Action / Undo** | 되돌리기 및 리플레이 | 1수 되돌리기(Undo) 및 클리어 후 타임랩스 리플레이 |
| **Gamification** | 12종 업적 | 업적 달성 검사, 다중 달성 순차 토스트, 트로피 도감 및 3성 별점 |
| **PWA & Mobile** | PWA 및 햅틱 | 웹 앱 설치 지원, maskable·apple-touch 아이콘, 필수 셸 중심 오프라인 캐싱과 현재 테마·BGM 런타임 캐시, 업데이트 안내, 15ms 조작 진동 |
| **Storage Resilience** | LocalStorage 방어 | 손상 JSON·잘못된 타입·저장소 차단 시 기본값 폴백, 일일·기록·업적·오디오·언어 스키마 검증 |
| **Design System** | 심플·어반 디자인 시스템 | off-white·concrete·charcoal 중립 팔레트, 단일 신호색, 시스템 grotesk·monospace 숫자, 1px 보더·0/4/8px radius·최소 그림자·기능성 모션·`prefers-reduced-motion` 대응. 타이틀·HUD·컨트롤·보드·8종 모달·업적·PWA·공유 카드에 적용하고 lucide 단일 아이콘으로 통일 |
| **Localization** | 다국어 지원 (i18n) | 한국어(KO), 영어(EN), 일본어(JA), 중국어(ZH) 지원 |
| **SNS Share** | 결과 카드 생성 | Canvas 기반 1000x1000 결과 이미지 생성 및 공유 API 연동 |

---

## 3. 기술 스택 (Tech Stack)

| 분류 | 기술 | 버전 | 비고 |
| :--- | :--- | :--- | :--- |
| **Runtime** | Node.js | 24.15.0+ (24.x) 또는 26.0.0+ | `.nvmrc` 24, `package.json` `engines` 기준 |
| **Framework** | React | 19.2.8 | UI 컴포넌트 렌더링 및 상태 관리 |
| **Language** | TypeScript | 5.9.3 | 정적 타입 검사 |
| **Build Tool** | Vite | 6.4.5 | 개발 서버 및 프로덕션 번들링 |
| **Testing** | Vitest | 4.1.12 | 유닛 및 통합 테스트 러너 |
| **DOM Testing** | Testing Library | 16.3.2 | React 컴포넌트 렌더링 테스트 |
| **E2E Testing** | Playwright | 1.65.0 | Chromium 스모크 테스트 |
| **Styling** | Vanilla CSS | Standard | CSS Grid/Flexbox 및 100dvh 레이아웃 |
| **Audio** | Web Audio API | Standard | 브라우저 내장 오디오 제어 |
| **Worker** | Web Worker | Standard | AI 힌트 탐색 연산 분리 |
| **PWA** | Service Worker | Standard | 셸·코어 자산 프리캐시 및 현재 테마·BGM 런타임 캐싱 |

---

## 4. 코어 알고리즘 (Core Algorithms)

### 4.1 가분성 판별 (Solvability Parity)
1차원 타일 배열의 반전수(Inversion Count, $I$)와 빈 슬롯의 위치를 기준으로 풀이 가능 여부를 검증합니다.

| 그리드 크기 ($N$) | 풀이 가능 조건 |
| :--- | :--- |
| **홀수 그리드 (3x3, 5x5)** | $I \equiv 0 \pmod 2$ (반전수가 짝수) |
| **짝수 그리드 (4x4)** | $(I + R_{\text{bottom}}) \equiv 1 \pmod 2$ (반전수 + 하단 기준 빈 슬롯 행 번호의 합이 홀수) |

### 4.2 A* 경로 탐색 휴리스틱
$$h(n) = h_{\text{manhattan}}(n) + 2 \times C_{\text{linear}}(n)$$
* **Manhattan Distance ($h_{\text{manhattan}}$)**: 각 타일의 현재 좌표와 목표 좌표 간 격자 거리의 총합
* **Linear Conflict ($C_{\text{linear}}$)**: 동일 행/열에서 목표 순서가 서로 역전된 타일 쌍의 개수

---

## 5. 실행 방법 (Getting Started)

### 요구사항
* Node.js 24.15.0 이상(24.x) 또는 26.0.0 이상 (`.nvmrc`: 24)
* npm 10.0.0 이상

### 설치 및 실행
```bash
# 저장소 복제
git clone https://github.com/NewplayerKOR/sliding-puzzle-web.git
cd sliding-puzzle-web

# 패키지 설치 (lockfile 기준)
npm ci

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test

# 타입 검사
npm run typecheck

# E2E 테스트 (최초 1회 npx playwright install chromium)
npm run test:e2e
```

---

## 6. 배포 및 CI

- **배포 절차**: [root/DEPLOYMENT.md](./root/DEPLOYMENT.md) — Vercel 설정, 서브패스 배포, 배포 후 확인, 캐시·업데이트·롤백 절차를 정리했다.
- **CI**: [.github/workflows/ci.yml](./.github/workflows/ci.yml) — Node 24 기준으로 `npm ci` → 테스트 → 타입 검사 → 빌드 → 프로덕션 의존성 감사를 수행하고, 이어서 Playwright Chromium E2E를 실행한다.
- **Vercel 상태**: 2026-11-08 기준 Vercel 프로젝트는 소유자가 의도적으로 pause한 상태다. `main` push 자동 배포는 실행되지 않지만 장애가 아니며, resume하면 기존 설정으로 재개된다. 자세한 내용은 배포 문서를 따른다.
- **robots.txt**: [public/robots.txt](./public/robots.txt)는 전체 크롤링 허용 정책이다. 서브패스 배포에서 도메인 루트 정책이 필요하면 배포 문서를 따른다.

---

## 7. 테스트 및 검증 현황

| 항목 | 도구 | 대상 | 결과 |
| :--- | :--- | :--- | :---: |
| **유닛 / 통합 테스트** | Vitest | 29개 테스트 파일 (183개 테스트 케이스) | **183 / 183 Passed** |
| **타입 검사** | TypeScript (`tsc --noEmit`) | 전체 소스코드 | **0 Errors** |
| **프로덕션 빌드** | Vite | 번들링 및 에셋 압축 | **정상 생성** |
| **에셋 최적화** | Vitest·브라우저 측정 | dist 용량 및 초기 로딩 | **20.65→11.04MB / 9,222,220→2,716,771바이트 (-70.5%)** |
| **업적 토스트** | Vitest·브라우저 측정 | 다중 달성 큐 | **3건 순차 표시·14초 후 소멸 확인** |
| **저장소 방어** | Vitest·브라우저 측정 | 손상 데이터·차단 | **기본값 폴백·타이틀/모달 정상 렌더링 확인** |
| **디자인 토큰** | Vitest·브라우저 측정 | 전 화면 심플·어반 UI | **그라데이션·블러·pill·이모지 0건, 360×800/1280×800 1화면 확인** |
| **E2E 스모크** | Playwright | Chromium 4개 시나리오 | **4 / 4 Passed** |

---

## 8. 디렉토리 구조 (Directory Structure)

```
sliding-puzzle-web/
├── .github/workflows/       # CI (quality + e2e)
├── e2e/                     # Playwright E2E 스모크 테스트
├── root/                    # 거버넌스 (AGENTS.md, TASKS.md, FEATURES.md, DEPLOYMENT.md, DESIGN_SYSTEM.md)
├── roles/                   # 역할별 행동 수칙 (PM, DEV, QA_DEVOPS)
├── public/                  # 정적 에셋 (아이콘, 오디오, 테마 텍스처, PWA 매니페스트, sw.js, robots.txt)
├── src/
│   ├── components/          # React 컴포넌트 (Board, Controls, Modal, Title 등)
│   ├── hooks/               # 커스텀 훅 (usePuzzleGame, useAudio, useAssetPreloader 등)
│   ├── i18n/                # 4개 국어 딕셔너리 (translations.ts, useTranslation.ts)
│   ├── styles/              # 디자인 토큰·전역/컴포넌트 스타일
│   ├── test/                # Vitest setup
│   ├── types/               # TypeScript 인터페이스 및 타입 정의
│   ├── utils/               # 코어 로직, 알고리즘, 오디오 매니저, 스토리지
│   ├── workers/             # A* 탐색 Web Worker (solver.worker.ts)
│   ├── App.tsx              # 메인 애플리케이션 컴포넌트
│   └── main.tsx             # 진입점
├── scripts/                 # 에셋 생성·가공용 Node 스크립트
├── .nvmrc                   # Node 24
├── playwright.config.ts     # Playwright 설정
└── package.json             # 프로젝트 메타데이터 및 의존성
```
