# 📖 PROJECT GUIDE — 통합 운영 문서 (Single Source of Truth)

> **대상**: 새로 시작하는 모든 세션 (Frontend DEV, QA 등)
> **목적**: 프로젝트 구조·업무 배분·진행 상황·작업 규칙을 본 문서 하나로 파악한다.
> **운영 원칙**: `README.md`(대외용 소개)를 제외한 모든 운영 정보는 본 문서에만 기록한다. `docs/` 폴더는 **이력 자료일 뿐 수정 대상이 아니다.**
> **갱신 규칙**: 모든 세션은 종료 시 본 문서의 `5. 업무 파트 배분표`에 직접 `[x]` 체크하고 `7. 진행 상태 대시보드`를 갱신한다.

* **최종 갱신일**: 2026-08-17
* **문서 버전**: v2.0

---

## 1. 프로젝트 스냅샷 (Project Snapshot)

| 항목 | 내용 |
| :--- | :--- |
| **프로젝트명** | Sliding Block Puzzle (N-Puzzle 웹 게임) |
| **형태** | 100% 서버리스 클라이언트 사이드 웹 앱 (백엔드 없음) |
| **기술 스택** | React 19, TypeScript 5.7, Vite 6, Vanilla CSS |
| **핵심 Web API** | Canvas, Web Audio, Web Worker, Service Worker, Web Vibration, Web Share |
| **현재 버전** | v1.0.0 (Phase 1~5 기능 전부 구현 완료) |
| **테스트** | Vitest 14개 파일 / **71개 케이스 전부 PASS** |
| **타입 검사** | `npx tsc --noEmit` — 0 Errors |
| **git 상태** | `main` 브랜치, 커밋 2개 (`v1.0.0`, `README.md 수정`) |
| **현재 오픈 업무** | `5. 업무 파트 배분표` 참조 (DEV01, DEV02, QA01, QA02) |

### 실행 명령
```bash
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # tsc + vite 프로덕션 빌드
npm test         # Vitest 전체 테스트 (71개)
npx tsc --noEmit # 타입 검사
```

---

## 2. 아키텍처 한 눈 (Architecture Overview)

### 2.1 디렉토리 구조

```
sliding-block-puzzle/
├── PROJECT_GUIDE.md            # 📌 본 문서 (유일한 운영 문서 / 모든 세션의 진입점)
├── README.md                   # 대외용 소개 (개발 상세는 본 문서 참조)
├── public/                     # 정적 에셋: 아이콘, 오디오, 테마 이미지, 스프라이트, sw.js, manifest
├── src/
│   ├── components/             # UI 컴포넌트 (영역별 폴더 + 동일 이름 CSS)
│   │   ├── Board/              #   PuzzleBoard, Tile (퍼즐 보드 렌더링)
│   │   ├── Controls/           #   조작 툴바 (난이도/모드/Undo/힌트/셔플 등)
│   │   ├── Header/             #   상단 HUD (타이머, 이동수, 기록)
│   │   ├── Title/              #   타이틀 화면
│   │   ├── Modal/              #   Win/Hint/Theme/CustomImage/Daily/Achievement/GameOver/Bgm 모달
│   │   ├── Achievement/        #   업적 토스트
│   │   └── PWA/                #   설치 배너
│   ├── hooks/
│   │   ├── usePuzzleGame.ts    #   ⭐ 게임 전체 상태의 중심 (보드/상태/타이머/Undo/챌린지)
│   │   ├── useAudio.ts         #   오디오 훅 (BGM/SFX 컨트롤)
│   │   └── useAssetPreloader.ts#   에셋 사전 로딩 훅
│   ├── utils/                  # 순수 로직 및 브라우저 API 유틸 (대부분 단위 테스트 존재)
│   ├── workers/                # solver.worker.ts (A* 탐색 Web Worker)
│   ├── i18n/                   # translations.ts (KO/EN/JA/ZH), useTranslation.ts
│   ├── types/                  # puzzle.ts, theme.ts, achievement.ts
│   ├── styles/                 # index.css(전역), App.css
│   ├── App.tsx                 # ⭐ 오케스트레이션 (모달/화면 전환/AI 힌트/승리 후처리)
│   └── main.tsx                # 진입점
├── docs/                       # ⚠️ 이력 자료 폴더 (과거 역할별 문서. 참고용, 수정 대상 아님)
└── scripts/                    # 에셋 생성/가공용 Node 스크립트 (유지보수 시 사용)
```

### 2.2 데이터 흐름 (Data Flow)

```mermaid
graph LR
    subgraph UI
        A[App.tsx<br/>오케스트레이션] --> B[Controls / Header / Title]
        A --> PB[PuzzleBoard]
        PB --> T[Tile]
        A --> M[Modal x 8종]
    end
    subgraph 상태
        H[usePuzzleGame 훅<br/>board / status / gridSize / moveHistory]
    end
    subgraph 순수 로직
        PL[puzzleLogic.ts<br/>셔플/가분성/이동/승리]
        SC[spriteCalculator.ts<br/>타일 스프라이트 좌표]
        AI[aiSolver.ts<br/>A* 알고리즘]
    end
    subgraph 브라우저 API
        W[Web Worker<br/>solver.worker.ts]
        AM[audioManager.ts<br/>Web Audio]
        LS[(LocalStorage<br/>기록/업적/스트릭/커스텀이미지)]
        SW[Service Worker<br/>public/sw.js]
    end

    A -->|moveTile / startNewGame / undo| H
    H -->|shuffleBoard 등| PL
    T -->|targetPos, gridSize| SC
    A -->|postMessage board| W
    W -->|requestId + result| A
    A -->|playSfx / playBgm| AM
    A -->|saveBestRecord 등| LS
    SW -->|캐싱| LS
```

**핵심 규칙**
- 게임 상태의 단일 소유자는 `usePuzzleGame` 훅. UI 컴포넌트는 상태를 직접 가지지 않고 props/callback으로만 동작.
- 순수 로직(`utils/*`)은 React 비의존. 변경 시 반드시 대응 `*.test.ts` 갱신.
- 비동기 응답(AI 힌트)은 반드시 `requestId` 대조 후 반영 (레이스 컨디션 방지 패턴).

---

## 3. 기능 ↔ 파일 매핑 (Feature-File Map)

수정 작업 전 **반드시 이 표로 연관 파일을 먼저 확인**한다. 파일 하나가 여러 기능에 걸쳐 있으면 연쇄 영향 범위를 미리 파악한다.

| # | 기능 영역 | 담당 파일 | 주요 연관 기능 |
| :---: | :--- | :--- | :--- |
| 1 | **코어 퍼즐 엔진** (셔플/가분성/이동/승리) | `src/utils/puzzleLogic.ts`, `src/types/puzzle.ts`, `src/hooks/usePuzzleGame.ts` | 3, 7, 11 (모든 게임 플로우의 기반) |
| 2 | **보드 렌더링** (스프라이트 분할) | `src/components/Board/PuzzleBoard.tsx`, `Tile.tsx`, `*.css`, `src/utils/spriteCalculator.ts` | 5, 6 (테마·커스텀이미지 렌더링) |
| 3 | **챌린지 모드** (Standard/Time Attack/Move Limit) | `src/hooks/usePuzzleGame.ts` (TIME_LIMITS, MOVE_LIMITS), `src/components/Modal/GameOverModal.tsx`, `src/components/Header/Header.tsx` | 1, 8 |
| 4 | **AI 스마트 힌트** (A* Web Worker) | `src/utils/aiSolver.ts`, `src/workers/solver.worker.ts`, `src/App.tsx` (requestId 검증, 쿨다운) | 1 |
| 5 | **테마 시스템** (4종 프리셋/숫자 모드) | `src/utils/themeData.ts`, `src/types/theme.ts`, `src/components/Modal/ThemeModal.tsx`, `src/components/Board/Tile.tsx` | 2, 6, 16 |
| 6 | **커스텀 이미지 업로드/크롭** | `src/components/Modal/CustomImageModal.tsx`, `src/App.tsx` (customImageSrc) | 2, 5, 16 |
| 7 | **일일 챌린지 & 스트릭** | `src/utils/dailyChallenge.ts`, `src/utils/prng.ts` (Mulberry32), `src/components/Modal/DailyModal.tsx` | 1, 8 |
| 8 | **업적 & 별점** | `src/utils/achievementManager.ts`, `achievementData.ts`, `src/types/achievement.ts`, `src/utils/starCalculator.ts`, `src/components/Modal/AchievementModal.tsx`, `Achievement/AchievementToast.tsx` | 3, 7, 11 |
| 9 | **오디오** (BGM 4트랙/SFX 풀) | `src/utils/audioManager.ts`, `src/hooks/useAudio.ts`, `src/components/Modal/BgmSelectModal.tsx`, `public/assets/audio/` | 전역 사용 |
| 10 | **기록 저장** (난이도별 최고 기록) | `src/utils/recordStorage.ts`, `src/App.tsx` (승리 시 saveBestRecord) | 8 |
| 11 | **Undo / 리플레이** | `src/hooks/usePuzzleGame.ts` (moveHistory, undoMove), `src/components/Controls/Controls.tsx`, `src/components/Modal/WinModal.tsx` | 1, 8 |
| 12 | **PWA / 오프라인 / 설치** | `public/sw.js`, `public/manifest.webmanifest`, `src/components/PWA/PwaInstallBanner.tsx` | 16 (경로 일관성) |
| 13 | **햅틱 진동** | `src/utils/haptics.ts` (이동/승리/에러 피드백) | 1 |
| 14 | **다국어 i18n** | `src/i18n/translations.ts` (KO/EN/JA/ZH), `useTranslation.ts` — 문자열 추가 시 4개 국어 전부 수정 필수 | UI 전역 |
| 15 | **결과 카드 공유** | `src/utils/shareCardGenerator.ts` (Canvas 1000x1000), `src/components/Modal/WinModal.tsx` | 11 |
| 16 | **에셋 로딩/경로** | `src/utils/assetPreloader.ts`, `assetPath.ts`, `src/hooks/useAssetPreloader.ts` | 2, 5, 6, 12 |

### 테스트 파일 목록 (14개 / 71케이스)
`puzzleLogic`, `spriteCalculator`, `starCalculator`, `recordStorage`, `prng`, `audioManager`, `assetPreloader`, `assetPath`, `aiSolver`, `achievementManager`, `usePuzzleGame`, `i18n`, `App`, `BgmSelectModal` — 각각 동일 이름의 `*.test.ts(x)` 존재.

---

## 4. 문서 체계 (Documentation Policy)

| 문서 | 위치 | 용도 | 수정 주체 |
| :--- | :--- | :--- | :--- |
| **PROJECT_GUIDE.md** | 루트 | **유일한 운영 문서.** 업무 배분·상태·규칙의 단일 소스 | PM + 각 세션(체크/대시보드만) |
| README.md | 루트 | 대외용 소개 (상세 내용은 본 문서 참조) | PM |
| docs/ 폴더 | docs/ | ⚠️ **이력 자료.** 과거 역할별 문서(PRD, 마일스톤, QA 리포트 등) 보관용. **신규 문서 발행·수정 금지** — 내용이 오래되어도 정정하지 않으며, 현행 상태는 항상 본 문서가 우선 | 수정 금지 |

> docs/ 폴더에 포함된 과거 문서들의 상태 표기는 본 문서 `7. 진행 상태 대시보드`에서만 관리한다.

---

## 5. 업무 파트 배분표 (Part Allocation Board)

### 5.1 발번 규칙
- PM이 신규 업무(기능 추가·결함 수정) 발생 시 **역할군 + 연번**으로 파트 ID를 발번한다: `DEV01, DEV02, ... / QA01, QA02, ...`
- 번호는 재사용하지 않고 계속 증가시킨다. 완료된 파트는 삭제하지 않고 `[x]`로 남긴다 (이력).
- 하나의 파트는 **한 세션이 하나의 기능 영역**만 담당하도록 분할한다 (세션 과부하 방지).
- 의존 관계가 있으면 "의존" 열에 표기한다. 의존 파트가 `[x]`가 되기 전에는 시작할 수 없다.

### 5.2 세션 작업 원칙
- 세션은 **배분받은 파트의 파일만 수정**한다. 그 외 파일 수정 금지.
- 세션 종료 시 **자신의 파트에 직접 `[x]` 체크 + 완료일 기입** (타 파트 체크 금지 → 업무 중복 방지).
- 파트 수행 중 추가 결함 발견 시: 코드 수정하지 말고 PM에게 보고 → PM이 새 파트 ID로 발번.

### 5.3 현재 배분표 (2026-08-17 기준)

| 파트 ID | 역할 | 업무 내용 | 대상 파일 | 의존 | DoD | 상태 |
| :--- | :---: | :--- | :--- | :---: | :--- | :---: |
| **DEV01** | DEV | CSS 하드코딩 절대 경로 5건 검증 (BUG-06 잔여) — Vite 파이프라인상 정상 판정, 수정 불필요 | `src/styles/index.css` L133·162·178, `src/components/Board/Tile.css` L36, `src/components/Modal/WinModal.css` L119 | 없음 | npm test 71 PASS / tsc 0 에러 / build 정상 / 대시보드 갱신 | [x] 완료 2026-08-17 |
| **DEV02** | DEV | 자동 클리어 버튼을 `import.meta.env.PROD`에서 비활성화 (완료 보고서 약속 이행) | `src/components/Controls/Controls.tsx` | 없음 | 동일 | [x] 2026-08-17 |
| **QA01** | QA | BUG-00~10 11건 결함의 코드 반영 여부 회귀 검증 (DEV01·02 산출물 포함) | 전체 소스 대조 + 동적 테스트 | DEV01·DEV02 완료 후 | 검증 결과를 본 문서 대시보드에 반영 | [ ] |
| **QA02** | QA | 실기기 검수: 모바일(360px) 3x3/4x4/5x5 렌더링, PWA 오프라인 캐싱, SW 404 부재 확인 | 브라우저 실기기 테스트 | 없음 (병렬 가능) | 검증 결과를 본 문서 대시보드에 반영 | [ ] |

### 5.4 완료 이력 (파트 종료 시 이곳으로 이동)

| 파트 ID | 역할 | 업무 | 완료일 | 완료 세션 |
| :--- | :---: | :--- | :---: | :--- |
| DEV01 | DEV | CSS 절대경로 5건 검증 완료 (Vite 파이프라인상 정상 판정) + `vite.config.ts` base 신규 파트 요청 | 2026-08-17 | DEV01 세션 |

### 5.5 세션 지시 템플릿 (PM이 세션 발주 시 사용)

```markdown
# 🚀 [세션 지시] {파트ID} - {업무 요약}
## 1. 역할 및 파트
* 파트 ID: {DEV01} / 역할: {DEV} / 관련 결함: {BUG-06}
* 필독: PROJECT_GUIDE.md (특히 3절 매핑표, 6절 규칙)
## 2. 업무 내용
- [ ] {구체 항목 1 — 파일명 명시}
- [ ] {구체 항목 2}
## 3. 제약 (건드리지 말 것)
* {의존 파트 / 타 세션 파일 / 금지 사항}
## 4. 완료 정의 (DoD)
* [ ] npm test 전체 PASS, npx tsc --noEmit 0 에러
* [ ] PROJECT_GUIDE.md 5.3절 본인 파트에 [x] 체크 + 완료일 기입
* [ ] PROJECT_GUIDE.md 7절 대시보드 갱신
```

---

## 6. 세션 작업 규칙 (Session Rules)

### 6.1 세션 진입 시
1. **본 문서(PROJECT_GUIDE.md)** 전체 숙지 — 구조(2절)·파트(5절)·규칙(6절) 확인
2. `5. 업무 파트 배분표`에서 자신의 파트 ID·스코프·의존 상태 확인
3. `3. 기능↔파일 매핑`으로 담당 파일 및 **연관 파일** 파악
4. 작업 시작 (docs/ 폴더는 이력 자료이므로 열람만 가능)

### 6.2 코드 연관성 원칙 (필수 준수)
A코드를 무심코 고쳐 B코드에서 에러가 나는 사태를 방지하기 위한 공통 원칙:

1. **수정 전 영향 범위 탐색**
   - 3절 매핑표의 "주요 연관 기능" 열 확인
   - Grep으로 해당 함수/컴포넌트의 모든 사용처 검색 (예: `usePuzzleGame` 수정 시 이를 소비하는 `App.tsx`, `Controls.tsx`, `Header.tsx` 확인)
2. **계약(Contract) 보존**
   - export된 함수의 시그니처, props 인터페이스(`src/types/*`) 변경 금지 (확장은 허용)
   - `usePuzzleGame`의 반환 객체는 다수 컴포넌트가 소비 — 필드 제거·타입 변경 금지
3. **테스트 동반 수정**
   - `utils/*` 로직 수정 시 대응 `*.test.ts` 반드시 함께 갱신
4. **완료 후 전체 회귀**
   - 부분 테스트가 아닌 `npm test` 전체 실행으로 타 기능 파손 여부 확인
   - `npx tsc --noEmit`으로 타입 연쇄 오류 확인

### 6.3 파트 종료 시 (Definition of Done 공통 항목)
- [ ] `npm test` 전체 PASS 및 `npx tsc --noEmit` 0 에러
- [ ] `5.3` 현재 배분표의 **본인 파트에 직접 `[x]` 체크 + 완료일 기입** (타 파트 수정 금지)
- [ ] `7. 진행 상태 대시보드` 갱신 (결함 상태/파트 상태 반영)
- [ ] 작업 내역 git 커밋 (메시지에 파트 ID 포함)

### 6.4 금지 사항
- ❌ 타 세션 파트의 파일 수정
- ❌ 타 세션 파트의 체크박스 조작
- ❌ docs/ 폴더의 문서 수정·신규 발행
- ❌ 프로젝트 운영 정보를 본 문서 외부에 별도 문서로 기록

---

## 7. 진행 상태 대시보드 (Progress Dashboard)

### 7.1 마일스톤

| 단계 | 내용 | 상태 |
| :--- | :--- | :---: |
| Phase 1 | 코어 엔진 (셔플/이동/승리, 3x3~5x5) | ✅ 완료 |
| Phase 2 | 에셋 & 사운드 (4종 테마, 오디오, VFX) | ✅ 완료 |
| Phase 3 | 반응형 & 모바일 (100dvh, Safe Area) | ✅ 완료 |
| Phase 4 | v1.0 릴리즈 (프리로더, 에셋 통합) | ✅ 완료 |
| Phase 5 | 고도화 9대 모듈 (커스텀이미지/AI힌트/Undo/일일챌린지/업적/챌린지모드/PWA/i18n/공유) | ✅ **코드 구현 완료** |
| v1.1 정비 | BUG-06 잔여·PROD 게이팅 수정 및 회귀 검증 | 🔄 진행 중 (DEV01 종료·DEV02 커밋됨 → QA01·02 회귀 검증) |

### 7.2 결함 현황 (QA_COMPREHENSIVE_DEFECT_REPORT 기준 11건)

| ID | 요약 | 심각도 | 상태 | 담당 파트 |
| :--- | :--- | :---: | :--- | :---: |
| BUG-00 | 난이도 전환 렌더링 왜곡 | P0 | ✅ 코드 반영 | — |
| BUG-01 | Undo 버튼 누락 | P0 | ✅ 코드 반영 | — |
| BUG-02 | SW 캐시 404 (sfx_snap.mp3) | P0 | ✅ 코드 반영 | — |
| BUG-03 | 커스텀 이미지 잔존 | P1 | ✅ 코드 반영 | — |
| BUG-04 | 스트릭 표시 시점 불일치 | P1 | ✅ 코드 반영 | — |
| BUG-05 | 자동 클리어 치트 | P1 | ✅ 코드 반영 | — |
| BUG-06 | 하드코딩 절대 경로 | P2 | ✅ CSS 5건 검증 완료 — Vite 파이프라인상 정상, 변경 불필요 | — |
| BUG-07 | AI 힌트 레이스 컨디션 | P2 | ✅ 코드 반영 | — |
| BUG-08 | 게임오버 모달 닫기 잠금 | P2 | ✅ 코드 반영 | — |
| BUG-09 | SFX WAV 폴백 미적용 | P3 | ✅ 코드 반영 | — |
| BUG-10 | 표준모드 별점 밸런스 | P3 | ✅ 코드 반영 | — |

> **✅ 별도 발견 (PM 세션)**: 자동 클리어 버튼의 `import.meta.env.PROD` 게이팅 미적용 → **DEV02** 파트로 발번 → 2026-08-17 수정 완료 (`Controls.tsx`에서 PROD 시 렌더링 제외, 프로덕션 번들에서 제거 확인).
> "코드 반영" 표시된 10건은 수정이 반영되었으나 검증(회귀 테스트)은 QA01에서 수행한다.
> **📝 DEV01 검증 결과**: CSS 5건은 Vite 빌드가 public 에셋 URL을 올바르게 재배치하므로 수정 불필요. `/assets/...`→`./assets/...` 변경은 번들 CSS(`dist/assets/index-*.css`) 기준 해석으로 프로덕션 404를 유발하여 미적용. 서브패스 배포의 올바른 조치는 `vite.config.ts` `base` 설정 → **신규 파트 발번 요청 (PM)**.

### 7.3 문서 이력 자료 현황 (docs/ 폴더 — 수정 금지, 참고용)

| 문서 | 내용 | 현행 상태와의 차이 |
| :--- | :--- | :--- |
| docs/MILESTONES.md | 마일스톤 | ⚠️ Phase 5 "0% 준비 완료" 표기 — **구식** (실제 완료, 본 문서 7.1이 정확) |
| docs/PM/PM_COMPLETION_REPORT.md | v1.0 완료 보고서 | ⚠️ Phase 5 이전 기준 — **구식** |
| docs/QA/QA_TASKS.md | QA 체크리스트 | ⚠️ "스프린트 3 진행 중" 표기 — **구식** |
| docs/DEV/DEV_FIX_GUIDE_QA_DEFECTS.md | 11건 수정 가이드 | ⚠️ "진행 대기" 표기 — 수정은 반영됨 (현행: 7.2) |
| docs/PRD.md | 요구사항 정의서 | ⚠️ 기술스택 표기(Howler.js/Zustand) — 실제는 Web Audio API / React 상태 |
| 그 외 docs/* | 이력 | 참고용 |

---

## 8. 변경 이력

| 일자 | 버전 | 내용 | 작성 세션 |
| :--- | :--- | :--- | :--- |
| 2026-08-17 | v2.1 | DEV02: 자동 클리어 버튼 `import.meta.env.PROD` 게이팅 적용 (BUG-05 보완) | DEV02 |
| 2026-08-17 | v2.0 | 문서 단일화 개편: 업무 파트 배분표(역할군+번호) 신설, 세션 직접 체크 프로토콜, 코드 연관성 원칙 강화, docs/ 이력화 | PM |
| 2026-08-17 | v1.0 | 최초 작성 (통합 참고 문서 신설) | PM |
