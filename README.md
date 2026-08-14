# Sliding Block Puzzle

React 19, TypeScript, Vite 기반으로 개발된 100% 클라이언트 사이드 인터랙티브 슬라이딩 퍼즐(N-Puzzle) 웹 애플리케이션입니다.

---

## 1. 프로젝트 개요 (Overview)

본 프로젝트는 고전적인 15-퍼즐 메커니즘을 현대적인 웹 표준 기술로 재해석한 오픈소스 웹 애플리케이션입니다. 백엔드 서버 없이 브라우저 런타임 자체 기술(HTML5, Canvas API, Web Audio API, Web Worker, Service Worker)을 극대화하여 100% 풀이가 보장되는 퍼즐 생성, 실시간 A* 탐색 AI 힌트, 단일 텍스처 아틀라스 렌더링, PWA 오프라인 구동을 지원합니다.

### 핵심 특징
* **100% 풀이 보장 (Solvability Validation)**: 반전수(Inversion Count) 및 패리티(Parity) 판별을 통한 불능 상태 원천 차단
* **고성능 아틀라스 렌더링**: 단일 텍스처를 CSS background-position 연산으로 실시간 분할 렌더링하여 네트워크 오버헤드 최소화
* **Web Worker 격리 AI 힌트**: 맨해튼 거리 + 선형 충돌 휴리스틱 기반 A* 알고리즘의 메인 스레드 비동기 분리
* **완벽한 반응형 1화면 UX**: `100dvh` 뷰포트 및 iOS Safe Area 적용으로 모바일/PC 전 환경 노스크롤 인터랙션 보장
* **PWA 오프라인 지원**: Service Worker 캐싱을 통한 제로 네트워크 환경 구동

---

## 2. 주요 기능 명세 (Features)

| 모듈 | 기능명 | 설명 |
| :--- | :--- | :--- |
| **Core Game** | 3단계 난이도 및 셔플 | 3x3 (Easy), 4x4 (Normal), 5x5 (Hard) 난이도 및 100회 상한 안전 셔플 |
| **Game Modes** | 하드코어 챌린지 | Standard (기본), Time Attack (제한시간), Move Limit (이동수 제한) 모드 지원 |
| **AI Solver** | AI 스마트 힌트 | A* 알고리즘 기반 다음 최적 1수 탐색, 타일 펄스 발광 및 이동 가이드 |
| **Themes** | 4종 마스터 테마 | 자연, 픽셀아트, 기하학 패턴, 동물 테마 프리셋 및 숫자 모드 즉시 전환 |
| **Custom Image** | 내 사진 업로드 & 스마트 크롭 | 로컬 이미지(JPG, PNG, WebP) 로드, 1:1 Canvas 실시간 팬/줌 크롭 및 퍼즐화 |
| **Daily Puzzle** | 일일 챌린지 & 스트릭 | Mulberry32 결정론적 PRNG 기반 날짜별 고유 시드 퍼즐 및 연속 출석 기록 |
| **Audio System** | Web Audio 매니저 | 4종 Lo-Fi/앰비언트 BGM 트랙(0.3초 크로스페이드) 및 3채널 SFX 풀링 |
| **Action / Undo** | 되돌리기 & 리플레이 | 1수 되돌리기(Undo) 및 게임 클리어 후 0.2초 간격 타임랩스 리플레이 |
| **Gamification** | 12종 로컬 업적 | 실시간 업적 판정, 슬라이드 토스트 알림, 트로피 도감 및 3성 별점 시스템 |
| **PWA & Mobile** | 오프라인 앱화 & 햅틱 | 홈 화면 설치 배너, Service Worker 캐싱, 조작 시 15ms 미세 햅틱 진동 |
| **Localization** | 글로벌 다국어 (i18n) | 한국어(KO), 영어(EN), 일본어(JA), 중국어(ZH) 4개 국어 지원 |
| **SNS Share** | 승리 결과 카드 생성 | Canvas 기반 1000x1000 고해상도 인포그래픽 즉시 생성 및 Web Share 연동 |

---

## 3. 기술 스택 (Tech Stack)

| 구분 | 기술 | 버전 | 도입 목적 |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | React | 19.0.0 | 컴포넌트 선언적 UI, 엄격한 상태 관리 및 가상 DOM 최적화 |
| **Language** | TypeScript | 5.7.3 | 정적 타입 시스템을 통한 런타임 안정성 및 유지보수성 확보 |
| **Build Tool** | Vite | 6.2.0 | 빠른 HMR 개발 환경 및 Rollup 기반 최적화된 ESM 번들링 |
| **Testing** | Vitest | 4.1.10 | Vite 통합 네이티브 유닛/통합 테스트 러너 |
| **DOM Testing** | Testing Library | 16.3.2 | 사용자 관점 인터랙션 검증 및 DOM 컴포넌트 격리 테스트 |
| **Styling** | Vanilla CSS / Modules | Standard | 제로 런타임 오버헤드, CSS Grid/Flexbox 및 100dvh 반응형 제어 |
| **Audio Engine** | Web Audio API | Standard | 브라우저 내장 오디오 노드 기반 다채널 풀링 및 볼륨/페이드 제어 |
| **Async Compute** | Web Worker | Standard | 복잡한 A* 탐색 연산을 백그라운드 스레드로 격리하여 UI 프리징 방지 |
| **Offline / PWA** | Service Worker | Standard | 정적 에셋 사전 캐싱을 통한 완전 오프라인 실행 보장 |

---

## 4. 코어 알고리즘 요약 (Core Algorithms)

### 4.1 수학적 가분성 검증 (Solvability Parity)
슬라이딩 퍼즐 순열의 반전수($I$)와 빈 슬롯의 위치 관계를 분석하여 풀이가 불가능한 상태를 방지합니다.

| 그리드 크기 ($N$) | 가분성 성립 조건 (Solvability Condition) |
| :--- | :--- |
| **홀수 그리드 (3x3, 5x5)** | $\text{Inversions}(I) \equiv 0 \pmod 2$ (반전수가 짝수) |
| **짝수 그리드 (4x4)** | $(I + R_{\text{bottom}}) \equiv 1 \pmod 2$ (반전수 + 하단 기준 빈 슬롯 행 번호가 홀수) |

### 4.2 A* 경로 탐색 휴리스틱
$$h(n) = h_{\text{manhattan}}(n) + 2 \times C_{\text{linear}}(n)$$
* **Manhattan Distance ($h_{\text{manhattan}}$)**: 각 타일의 현재 좌표와 목표 좌표 간의 최단 격자 거리 합
* **Linear Conflict ($C_{\text{linear}}$)**: 동일 행/열 내 목표 위치가 역전되어 상호 간섭하는 타일 쌍에 대한 추가 우회 비용($+2$) 반영

---

## 5. 프로젝트 실행 방법 (Getting Started)

### 사전 요구사항
* Node.js 18.0.0 이상
* npm 9.0.0 이상

### 설치 및 로컬 실행
```bash
# 1. 저장소 복제
git clone https://github.com/username/sliding-block-puzzle.git
cd sliding-block-puzzle

# 2. 의존성 패키지 설치
npm install

# 3. 로컬 개발 서버 구동 (http://localhost:5173)
npm run dev

# 4. 프로덕션 빌드
npm run build

# 5. 프로덕션 빌드 미리보기
npm run preview
```

### 테스트 실행
```bash
# Vitest 단위 및 통합 테스트 실행
npm test
```

---

## 6. 품질 검증 현황 (Quality Assurance)

| 검증 영역 | 도구 | 대상 | 결과 |
| :--- | :--- | :--- | :---: |
| **단위 / 통합 테스트** | Vitest | 14개 테스트 스위트 (71개 테스트 케이스) | **71 / 71 Passed (100%)** |
| **정적 타입 검사** | TypeScript (`tsc --noEmit`) | 전체 소스코드 타입 검사 | **0 Errors** |
| **프로덕션 빌드** | Vite Build | ESM 번들링 및 gzip 에셋 무결성 | **Success** |
| **오프라인 구동** | Service Worker | Network Offline 상태 로드 | **PASS** |

---

## 7. 프로젝트 참여자 및 역할 (Roles & Contributors)

| 역할 (Role) | 담당 업무 (Responsibilities) |
| :--- | :--- |
| **Project Manager (PM)** | 제품 요구사항 정의(PRD), 마일스톤 관리, 기능 범위 조율, 개발 지시서 발급 |
| **Frontend Developer (DEV)** | React/TS 기반 퍼즐 코어 엔진, A* 알고리즘, 반응형 UI, Web Audio/PWA 연동 |
| **UI/UX Designer & 2D Artist** | 테마별 1024x1024 고화질 퍼즐 그래픽, UI 아이콘 및 애니메이션 스프라이트 제작 |
| **QA Engineer** | 가분성/셔플 무결성 검증, 브라우저 프리징(BUG-01) RCA 트러블슈팅, 71개 TC 검수 |
| **Technical Writer** | 아키텍처 분석, 수학적 증명 공식화, 공식 기술 백서 및 GitHub README 문서화 |

---

## 8. 디렉토리 구조 (Directory Structure)

```
sliding-block-puzzle/
├── public/                  # 정적 에셋 (아이콘, 오디오, 테마 텍스처, PWA 매니페스트, sw.js)
├── src/
│   ├── components/          # React 프리젠테이션 컴포넌트 (Board, Controls, Modal, Title 등)
│   ├── hooks/               # 커스텀 훅 (usePuzzleGame, useAudio, useAssetPreloader 등)
│   ├── i18n/                # 4개 국어 다국어 딕셔너리 (translations.ts, useTranslation.ts)
│   ├── styles/              # CSS 스타일시트 (100dvh, CSS Grid, 모바일 최적화)
│   ├── types/               # TypeScript 인터페이스 및 타입 정의
│   ├── utils/               # 코어 로직, 알고리즘, 오디오 매니저, 스토리지 유틸리티
│   ├── workers/             # A* 탐색 Web Worker 스크립트 (solver.worker.ts)
│   ├── App.tsx              # 메인 애플리케이션 진입 컴포넌트
│   └── main.tsx             # React 루트 마운트
├── docs/                    # 공식 프로젝트 명세서 및 기술 백서
│   ├── PRD.md               # 제품 요구사항 정의서
│   ├── MILESTONES.md        # 프로젝트 마일스톤
│   ├── ROLES.md             # 역할 및 책임 정의서
│   └── WRITER/              # 기술 백서 (PROJECT_TECHNICAL_WHITE_PAPER.md)
└── package.json             # 프로젝트 메타데이터 및 의존성
```

---

## 9. 라이선스 (License)

본 프로젝트는 MIT License 하에 자유롭게 이용 및 수정이 가능합니다.
