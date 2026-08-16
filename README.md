# Sliding Block Puzzle

* **참여자**: NewplayerKOR
* **기술 스택**: React 19, TypeScript, Vite
* **📌 개발/QA 세션 진입 시**: [PROJECT_GUIDE.md](./PROJECT_GUIDE.md) (통합 참고 문서)를 먼저 읽으세요.

React와 TypeScript 기반으로 개발된 클라이언트 사이드 슬라이딩 퍼즐(N-Puzzle) 웹 애플리케이션입니다. 브라우저 표준 API(Canvas API, Web Audio API, Web Worker, Service Worker)를 활용하여 별도 백엔드 없이 모든 기능이 동작합니다.

---

## 1. 주요 특징 (Features)

* **풀이 가능성 검증 (Solvability Validation)**: 반전수(Inversion Count)와 패리티(Parity) 판별을 통한 풀이 가능한 퍼즐 생성
* **텍스처 분할 렌더링**: 단일 텍스처를 CSS `background-position` 연산으로 분할 표시
* **비동기 AI 힌트**: 맨해튼 거리 및 선형 충돌 휴리스틱 기반 A* 알고리즘 (Web Worker 분리)
* **반응형 레이아웃**: `100dvh` 및 Safe Area 인셋을 적용한 1화면 레이아웃
* **PWA 오프라인 지원**: Service Worker 캐싱을 통한 오프라인 구동

---

## 2. 세부 기능 목록

| 모듈 | 기능명 | 설명 |
| :--- | :--- | :--- |
| **Core Game** | 3단계 난이도 및 셔플 | 3x3, 4x4, 5x5 난이도 선택 및 100회 상한 셔플 |
| **Game Modes** | 챌린지 모드 | Standard, Time Attack(제한시간), Move Limit(이동수 제한) |
| **AI Solver** | AI 스마트 힌트 | A* 알고리즘 기반 다음 이동 타일 및 방향 안내 (3초 쿨다운) |
| **Themes** | 4종 테마 및 숫자 모드 | 자연, 픽셀아트, 기하학 패턴, 동물 테마 프리셋 및 숫자 모드 전환 |
| **Custom Image** | 이미지 업로드 및 크롭 | 로컬 이미지(JPG, PNG, WebP) 로드 및 Canvas 기반 1:1 크롭 |
| **Daily Puzzle** | 일일 챌린지 | Mulberry32 PRNG 기반 날짜별 시드 퍼즐 및 출석 스트릭 기록 |
| **Audio System** | 오디오 매니저 | 4종 BGM 트랙(크로스페이드) 및 3채널 SFX 풀링 |
| **Action / Undo** | 되돌리기 및 리플레이 | 1수 되돌리기(Undo) 및 클리어 후 타임랩스 리플레이 |
| **Gamification** | 12종 업적 | 업적 달성 검사, 토스트 알림, 트로피 도감 및 3성 별점 |
| **PWA & Mobile** | PWA 및 햅틱 | 웹 앱 설치 지원, 오프라인 캐싱, 15ms 조작 진동 |
| **Localization** | 다국어 지원 (i18n) | 한국어(KO), 영어(EN), 일본어(JA), 중국어(ZH) 지원 |
| **SNS Share** | 결과 카드 생성 | Canvas 기반 1000x1000 결과 이미지 생성 및 공유 API 연동 |

---

## 3. 기술 스택 (Tech Stack)

| 분류 | 기술 | 버전 | 비고 |
| :--- | :--- | :--- | :--- |
| **Framework** | React | 19.0.0 | UI 컴포넌트 렌더링 및 상태 관리 |
| **Language** | TypeScript | 5.7.3 | 정적 타입 검사 |
| **Build Tool** | Vite | 6.2.0 | 개발 서버 및 프로덕션 번들링 |
| **Testing** | Vitest | 4.1.10 | 유닛 및 통합 테스트 러너 |
| **DOM Testing** | Testing Library | 16.3.2 | React 컴포넌트 렌더링 테스트 |
| **Styling** | Vanilla CSS | Standard | CSS Grid/Flexbox 및 100dvh 레이아웃 |
| **Audio** | Web Audio API | Standard | 브라우저 내장 오디오 제어 |
| **Worker** | Web Worker | Standard | AI 힌트 탐색 연산 분리 |
| **PWA** | Service Worker | Standard | 정적 에셋 캐싱 |

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
* Node.js 18.0.0 이상
* npm 9.0.0 이상

### 설치 및 실행
```bash
# 저장소 복제
git clone https://github.com/NewplayerKOR/sliding-puzzle-web.git
cd sliding-puzzle-web

# 패키지 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 테스트 실행
npm test
```

---

## 6. 테스트 및 검증 현황

| 항목 | 도구 | 대상 | 결과 |
| :--- | :--- | :--- | :---: |
| **유닛 / 통합 테스트** | Vitest | 14개 테스트 파일 (71개 테스트 케이스) | **71 / 71 Passed** |
| **타입 검사** | TypeScript (`tsc --noEmit`) | 전체 소스코드 | **0 Errors** |
| **프로덕션 빌드** | Vite | 번들링 및 에셋 압축 | **정상 생성** |

---

## 7. 디렉토리 구조 (Directory Structure)

```
sliding-block-puzzle/
├── public/                  # 정적 에셋 (아이콘, 오디오, 테마 텍스처, PWA 매니페스트, sw.js)
├── src/
│   ├── components/          # React 컴포넌트 (Board, Controls, Modal, Title 등)
│   ├── hooks/               # 커스텀 훅 (usePuzzleGame, useAudio, useAssetPreloader 등)
│   ├── i18n/                # 4개 국어 딕셔너리 (translations.ts, useTranslation.ts)
│   ├── styles/              # CSS 스타일시트 (100dvh, CSS Grid, 모바일 스타일)
│   ├── types/               # TypeScript 인터페이스 및 타입 정의
│   ├── utils/               # 코어 로직, 알고리즘, 오디오 매니저, 스토리지
│   ├── workers/             # A* 탐색 Web Worker (solver.worker.ts)
│   ├── App.tsx              # 메인 애플리케이션 컴포넌트
│   └── main.tsx             # 진입점
├── docs/                    # 프로젝트 명세서 및 기술 백서
│   ├── PRD.md               # 요구사항 정의서
│   ├── MILESTONES.md        # 마일스톤
│   ├── ROLES.md             # 역할 정의서
│   └── WRITER/              # 기술 백서 (PROJECT_TECHNICAL_WHITE_PAPER.md)
└── package.json             # 프로젝트 메타데이터 및 의존성
```
