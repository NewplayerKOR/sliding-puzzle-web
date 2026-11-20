# TASKS.md - Single Source of Tasks

[작성 및 수정 규칙]

- 상태 표기: [ ] 대기 | [-] 진행 중 | [x] 완료 | [!] 블로커/이슈. 상태 변경과 블로커 판단은 AGENTS.md의 공통 기준을 따른다.
- 우선순위: P0 (긴급) > P1 (중요) > P2 (개선/선택). 결함의 영향과 긴급도는 AGENTS.md의 분류 기준으로 판단한다.
- 업무 식별: 작업마다 프로젝트 내 고유 작업 ID·Phase·담당·목표·완료 기준(DoD)을 명시한다. 첫 Phase는 01이며 이후 증가시키고, 작업 ID는 보관 후에도 재사용하지 않는다.
- 검증 및 완료: AGENTS.md의 작업 유형별 검증 기준을 적용하고, DoD·실제 결과·검증 범위·증거·미실행 사항을 확인한 뒤 [x]로 변경한다. 다른 역할의 미완료 작업을 임의로 완료 처리하지 않는다.
- 활성 작업 단일화: 진행·대기·보류 업무는 본 파일에서만 관리한다. 완료 원문 보관과 정정 절차는 AGENTS.md의 작업 라이프사이클을 따른다.
- 최근 완료 요약: 완료 작성자가 원문 보관과 링크 확인을 마친 뒤 요약으로 전환한다. 작업 ID·제목·완료일·핵심 결과·검증 범위·원문 링크를 완료 시각 내림차순으로 최대 5개 유지한다. 초과 요약을 제거해도 보관 원문은 유지한다.
- 보관 위치: 본 파일과 같은 디렉터리의 archive/TASKS_PHASE_01.md 등 해당 Phase 파일에 원문을 보관하고 아래 Phase별 보관 목록에 연결한다. 실제 완료 작업이 없으면 빈 보관 파일이나 링크를 미리 만들지 않는다.
- 문서 구분: FEATURES.md에는 구현·검증된 사용자 기능의 현재 명세를 반영하고, 작업 원문과 상세 이력은 Phase별 보관 파일에 유지한다.

---

## 1. Active Tasks (진행 중인 작업)

(현재 진행 중인 작업 없음)

---

## 2. Backlog (대기 중인 작업)

### [PM]

(대기 중인 작업 없음)

### [DEV]

(대기 중인 작업 없음)

### [QA / DevOps]

#### [ ] TASK-QA-12 — Context7 기반 최신 도구체인 적용 준비·검증

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P2
- **목표**: Context7 최신 문서와 npm registry를 대조해 현재 도구체인의 호환성·breaking change를 확인하고, 위험도가 낮은 patch·minor 업데이트와 `@testing-library/jest-dom` 8을 적용한 뒤 전체 회귀를 검증한다. 소스 수정이 필요한 변경은 DEV 후속 작업으로 분리한다.
- **대상 파일**: `package.json`, `package-lock.json`, 필요 시 `.github/workflows/ci.yml`
- **재현/증거**:
  - 2026-11-20 `npm outdated --long`: `vite` 8.3.6→8.3.8, `vitest` 5.1.0→5.1.1, `@vitejs/plugin-react` 6.2.1→6.3.0, `jsdom` 31.0.0→31.0.1, `@playwright/test` 1.65.0→1.65.1, `lucide-react` 1.70.0→1.77.0, `@testing-library/jest-dom` 7.0.1→8.0.0. React 19.3.1·TypeScript 7.0.2는 최신.
  - `npm audit` prod·전체 모두 0건.
  - Context7 `/vitejs/vite`: Vite 8 Rolldown, Node `^20.19` 또는 `>=22.12`, plugin hook 변경. 현재 Node 26.13.0과 `generateBundle`·`closeBundle` 사용은 지원 범위.
  - Context7 `/vitest-dev/vitest`: `environment: 'browser'` 금지, jsdom 설정·`setupFiles` 병합·`base: '/'` 변경. 현재 jsdom 단일 설정과 `setupFiles` 구조는 해당 없음.
  - Context7 `/react/react`: 19.3은 수정 중심이며 `react`·`react-dom` 정확한 버전 일치 필요. 현재 19.3.1로 일치.
  - `@testing-library/jest-dom` 8.0.0은 Vitest 5 미만 지원을 제거하고 `>=5 <6`을 지원한다. 현재 Vitest 5.1.0과 호환. Context7 문서는 v6.9.1까지만 있어 GitHub release note로 보완.
- **DoD**:
  - Context7 라이브러리 ID·질의·문서 한계와 `npm outdated`·`npm audit` 결과를 완료 기록에 남긴다.
  - patch·minor 업데이트와 `@testing-library/jest-dom` 8.0.0을 lockfile 기준으로 적용하고 `npm ci`를 통과한다. 현재 테스트에서 `jest-dom` matcher를 직접 사용하지 않는 점은 기록하고, 제거 여부는 별도 정리 작업으로 남긴다.
  - 소스 수정이 필요한 변경은 강제 적용하지 않고 DEV 후속 작업으로 등록한다.
  - 전체 `npm test`, `npm run typecheck`, `npm run build`, `npm run test:e2e`, `npm audit` 0건을 확인한다. DEV-43 신규 테스트가 있으면 해당 수치를 포함한다.
  - `root/AGENTS.md`·`root/DESIGN_SYSTEM.md`의 도구체인 버전 기록은 PM에 전달하거나 PM이 갱신한다.
- **선행 조건**: 없음

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-43** — 모바일 문서 세로 스크롤 복구 (완료일: 2026-11-20)
  - 핵심 결과: `body`의 `overscroll-behavior: none`을 제거하고 `html`에만 `overscroll-behavior-y: none`을 유지함. `body`의 `overflow-x`를 `clip`으로 바꿔 스크롤 컨테이너화를 막고, 문서 스크롤이 html로 이동한 뒤 모달 잠금이 뚫리지 않도록 `useBodyScrollLock`이 html·body overflow를 함께 잠그고 복원하게 수정함. CDP touch swipe 기반 모바일 회귀 E2E를 추가함
  - 검증 범위: Vitest 41개 파일/251개 케이스 PASS, tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 31/31 PASS. `e2e/mobile-scroll.spec.ts`는 수정 전 8 failed/4 passed, 수정 후 12/12 PASS. 360×640·360×800·412×839에서 wheel·touch 스크롤, 412×839 타이틀 scrollY 377·게임 360×640 scrollY 100, 모달 잠금·보드 스와이프 확인. Lighthouse 타이틀 접근성 1.0. Samsung Internet 실기기·iOS Safari·Firefox 터치 스크롤은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-43--모바일-문서-세로-스크롤-복구)

- **TASK-DEV-42** — BGM 모달 음소거 상태 라벨 정비 (완료일: 2026-11-20)
  - 핵심 결과: BGM·SFX 음소거 버튼에 동작·상태를 포함한 `aria-label`과 `aria-pressed`를 적용해 타이틀·헤더 토글과 규칙을 통일함. 재생 이퀄라이저의 role 없는 `aria-label`을 제거하고 트랙 아이콘 영역을 `aria-hidden`으로 장식 처리함
  - 검증 범위: Vitest 41개 파일/251개 케이스 PASS(`BgmSelectModal` 7/7), tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 31/31 PASS. 초기 `aria-pressed=true`, 토글 후 `false`·라벨 변경·오디오 상태 확인. 실제 스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-42--bgm-모달-음소거-상태-라벨-정비)

- **TASK-DEV-41** — Daily 캘린더 grid row 구조 정비 (완료일: 2026-11-20)
  - 핵심 결과: 비대화형 날짜 현황에 맞춰 `role="grid"`/`gridcell`을 제거하고 `ul`/`li` 목록으로 전환함. 캘린더 제목을 `aria-labelledby`로 연결하고 날짜 `aria-label`·완료 상태·오늘 `aria-current="date"`를 유지함
  - 검증 범위: Vitest 41개 파일/251개 케이스 PASS(`DailyModal` 4/4), tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 31/31 PASS. 360×640·1280×800에서 목록 항목 30개, 첫 날짜 36px/50.86px, 가로 오버플로 0건 확인. 실제 스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-41--daily-캘린더-grid-row-구조-정비)

- **TASK-DEV-40** — PWA 첫 설치 업데이트 배너 오탐 방지 (완료일: 2026-11-20)
  - 핵심 결과: 등록 시작 시점의 controller와 기존 active/waiting으로 `isFirstInstall`을 계산해, 첫 설치 중 controller가 먼저 활성화돼도 업데이트 배너를 표시하지 않게 함. 실제 대기 워커 업데이트의 배너·SKIP_WAITING·새로고침 흐름은 유지하고, 배너를 헤더 버튼 아래로 이동함
  - 검증 범위: Vitest 41개 파일/251개 케이스 PASS(`swUpdateManager` 7/7, 첫 설치 레이스 테스트는 수정 전 1 failed/6 skipped), tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 31/31 PASS. `e2e/sw-first-install.spec.ts` Chromium 2/2·WebKit 2/2 PASS. WebKit E2E는 수정 전 배너를 재현하지 못해 레이스 고정은 단위 테스트 실패로 확인함. 배너 360×640 top 96px/헤더 버튼 bottom 87px, 1280×800 top 96px/bottom 53px로 교차 0건. 실제 설치 PWA 업데이트·Safari 네이티브 설치는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-40--pwa-첫-설치-업데이트-배너-오탐-방지)

- **TASK-QA-11** — P2 수정 전체 회귀·크로스브라우저 검증 (완료일: 2026-11-20)
  - 핵심 결과: DEV-32~39의 P2 수정 8건이 모두 통과함. AI 폴백 5.5초 유지·이동 시 해제, 모달 스크롤 잠금·중첩 방지, 커스텀 이미지 상태·손상 차단, Confetti 정리·공유 취소 무폴백, PWA v2.4/17건 오프라인, Web Audio 단일 볼륨 스케일·BGM 자동 전환, Time Attack 46초 이동 거부, 접근성·홈 확인을 확인함. 검증 중 WebKit 첫 설치 업데이트 배너 오탐, Daily grid row 누락, BGM 모달 음소거 상태 라벨 누락 등 신규 P2 3건을 DEV-40~42로 등록함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS, tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 16/16 PASS, Lighthouse 접근성 1.0. 독립 Playwright 86개 체크 PASS(Chromium·WebKit·Firefox·서브패스 포함). 실제 모바일 실기기·Safari 네이티브·스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-qa-11--p2-수정-전체-회귀크로스브라우저-검증)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-DEV-29 (정답 보기 읽기 전용 미리보기·기록 무결성), TASK-DEV-30 (PWA 최초 설치 오프라인 프리캐시), TASK-DEV-31 (Daily 활성 컨텍스트·시작 날짜 무결성), TASK-DEV-32 (AI 힌트 폴백·토스트 타이머), TASK-DEV-33 (모달 배경 스크롤·중첩), TASK-DEV-34 (커스텀 이미지 상태·로드 실패), TASK-DEV-35 (Confetti·공유 후처리), TASK-DEV-36 (PWA 브랜딩·프리캐시 자산), TASK-DEV-37 (오디오 볼륨·BGM 자동 연동), TASK-DEV-38 (Time Attack 이동 시점 검사), TASK-DEV-39 (접근성·파괴적 액션 UX), TASK-DEV-40 (PWA 첫 설치 업데이트 배너), TASK-DEV-41 (Daily 캘린더 목록 구조), TASK-DEV-42 (BGM 모달 음소거 라벨), TASK-DEV-43 (모바일 문서 스크롤), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-QA-10 (P1 수정 독립 검증·회귀 테스트), TASK-QA-11 (P2 수정 전체 회귀·크로스브라우저 검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
