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

#### [ ] TASK-DEV-43 — 모바일 문서 세로 스크롤 복구

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **목표**: Samsung Internet·Chromium 기반 모바일에서 타이틀·게임 화면의 문서 세로 스크롤이 동작하게 하고, 모달 열림/닫힘의 배경 스크롤 잠금과 보드 스와이프는 유지한다.
- **대상 파일**: `src/styles/index.css`, `e2e/mobile-scroll.spec.ts` 신규, 필요 시 `src/hooks/useBodyScrollLock.ts`
- **재현/증거**:
  - 2026-11-20 `vite preview`(127.0.0.1:4173), Playwright Chromium Pixel 7(412×839, touch)에서 타이틀 `scrollHeight` 1216px > `innerHeight` 839px이나 wheel·touch swipe 후 `scrollY`가 0에 머묾. 게임 화면도 947px > 839px에서 동일하게 재현됨.
  - `window.scrollTo(0, 200)`는 동작해 문서 자체는 스크롤 가능하지만 입력 스크롤만 차단됨.
  - computed style은 `html/body { overflow: hidden auto; overscroll-behavior: none; }`. `body`가 `overflow-x: hidden` 때문에 스크롤 컨테이너가 되고 `body`의 `overscroll-behavior: none`이 루트 문서로의 스크롤 체인을 끊음.
  - 페이지 내 `body { overscroll-behavior: auto }` 적용 시 타이틀 `scrollY` 377, 게임 `scrollY` 108까지 정상 스크롤됨. `touch-action: auto`만 바꾼 경우에는 해결되지 않음.
- **DoD**:
  - `body`의 `overscroll-behavior: none`을 제거하고 `html`에만 `overscroll-behavior-y: none`을 유지하는 최소 수정으로 루트 스크롤 체인을 복구한다. 수정 이유를 CSS 주석으로 남긴다.
  - 360×640·360×800·412×839에서 타이틀·게임 화면이 wheel·touch swipe로 스크롤되고 마지막 콘텐츠까지 도달한다. 가로 오버플로는 0건이어야 한다.
  - 모달 열림 중 배경 스크롤이 잠기고 닫힘 후 복원되며, 중첩 모달 회귀가 없어야 한다. 보드 스와이프는 타일 이동만 수행하고 페이지를 스크롤하지 않아야 한다.
  - Playwright 모바일 회귀 테스트를 추가해 수정 전 실패·수정 후 통과를 확인한다. touch swipe는 Chromium CDP `Input.dispatchTouchEvent`를 사용한다.
  - `npm test`, `npm run typecheck`, `npm run build`, `npm run test:e2e` 결과와 실제 Samsung Internet 실기기 확인 여부(미실행 시 사유)를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-40 — PWA 첫 설치 업데이트 배너 오탐 방지

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 첫 설치 중 controller가 먼저 활성화되는 WebKit 레이스에서 업데이트 배너를 표시하지 않고, 실제 새 워커가 준비된 경우에만 안내한다.
- **대상 파일**: `src/utils/swUpdateManager.ts`, `src/utils/swUpdateManager.test.ts`, 필요 시 `e2e/`
- **재현/증거**:
  - Playwright WebKit 신규 BrowserContext 첫 방문 약 1.2초 후 `.sw-update-banner` 표시. 이때 `navigator.serviceWorker.controller`는 `true`, `registration.waiting`·`registration.installing`은 모두 `null`.
  - 배너가 상단 고정 레이어로 헤더 BGM 버튼과 겹쳐 포인터 입력을 가로챔. 교차 브라우저 검증 중 배너를 닫은 뒤 나머지 흐름을 완료함.
  - 현재 조건은 `newWorker.state === 'installed' && navigator.serviceWorker.controller`로, 첫 설치에서도 controller가 먼저 true가 되면 업데이트로 오인함(`src/utils/swUpdateManager.ts:45-56`).
  - 증거: `root/archive/assets/task-qa-11/webkit-update-repro.json`, `cross-browser.json`, `findings.json`
- **DoD**:
  - 등록 시작 시점의 controller 유무 또는 기존 active/waiting 상태를 기준으로 첫 설치와 업데이트를 구분한다.
  - 첫 설치에서 controller가 늦게 활성화되는 레이스를 재현하는 단위 테스트를 추가하고, 첫 설치에는 이벤트가 발생하지 않게 한다.
  - 실제 대기 워커가 있는 업데이트에서는 기존처럼 배너·SKIP_WAITING·사용자 선택 새로고침이 동작한다.
  - `npm test`, `npm run typecheck`, `npm run build`, `npx playwright test` 결과와 WebKit 확인 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-41 — Daily 캘린더 grid row 구조 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: Daily 캘린더의 ARIA grid 구조를 유효하게 만들거나 단순 목록 구조로 바꿔 스크린리더 탐색을 일관되게 한다.
- **대상 파일**: `src/components/Modal/DailyModal.tsx`, `src/components/Modal/DailyModal.test.tsx`
- **재현/증거**:
  - `role="grid"` 아래에 `role="row"` 없이 `role="gridcell"` 30개가 직접 배치됨. Chrome Accessibility Tree에서도 rowCount 0, gridCellCount 30.
  - 셀 `aria-label`, 오늘 `aria-current="date"`는 정상 제공됨.
  - 증거: `root/archive/assets/task-qa-11/accessibility-tree.json`, `a11y-layout.json`, `findings.json`
- **DoD**:
  - 주 단위 `role="row"` 래퍼를 추가하거나 grid 대신 list/listitem 구조로 단순화한다.
  - 기존 날짜 label·완료 상태·오늘 상태를 유지하고 테스트로 구조와 값을 검증한다.
  - 360×640·1280×800 레이아웃 회귀와 `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-42 — BGM 모달 음소거 상태 라벨 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: BGM 설정 모달의 BGM/SFX 음소거 버튼이 동작과 현재 상태를 접근성 이름과 `aria-pressed`로 노출하게 한다.
- **대상 파일**: `src/components/Modal/BgmSelectModal.tsx`, `src/components/Modal/BgmSelectModal.test.tsx`
- **재현/증거**:
  - 음소거 버튼의 접근성 이름이 `BGM`, `SFX`뿐이고 `aria-label`·`aria-pressed`가 없음. 상태는 `title`과 아이콘에만 의존함.
  - AX Tree에서 버튼 이름이 `BGM`/`SFX`로만 노출됨.
  - 증거: `root/archive/assets/task-qa-11/accessibility-tree.json`, `a11y-layout.json`, `findings.json`
- **DoD**:
  - 타이틀·헤더 토글과 동일하게 동작·상태를 포함한 `aria-label`과 `aria-pressed`를 적용한다.
  - BGM/SFX 각각의 음소거·해제 상태를 테스트로 검증한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

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

- **TASK-QA-11** — P2 수정 전체 회귀·크로스브라우저 검증 (완료일: 2026-11-20)
  - 핵심 결과: DEV-32~39의 P2 수정 8건이 모두 통과함. AI 폴백 5.5초 유지·이동 시 해제, 모달 스크롤 잠금·중첩 방지, 커스텀 이미지 상태·손상 차단, Confetti 정리·공유 취소 무폴백, PWA v2.4/17건 오프라인, Web Audio 단일 볼륨 스케일·BGM 자동 전환, Time Attack 46초 이동 거부, 접근성·홈 확인을 확인함. 검증 중 WebKit 첫 설치 업데이트 배너 오탐, Daily grid row 누락, BGM 모달 음소거 상태 라벨 누락 등 신규 P2 3건을 DEV-40~42로 등록함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS, tsc 0 Errors, Vite 8.3.6 빌드 성공, Chromium E2E 16/16 PASS, Lighthouse 접근성 1.0. 독립 Playwright 86개 체크 PASS(Chromium·WebKit·Firefox·서브패스 포함). 실제 모바일 실기기·Safari 네이티브·스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-qa-11--p2-수정-전체-회귀크로스브라우저-검증)

- **TASK-DEV-39** — 접근성·파괴적 액션 UX 잔여 정비 (완료일: 2026-11-20)
  - 핵심 결과: 업적 토스트를 `role="status"`·`aria-live="polite"`로 바꾸고 PWA 설치 배너를 `aside` complementary landmark로 정리함. 업적 진행 바에 `progressbar` 값, Daily 캘린더에 `grid`/`gridcell`·`aria-current="date"`를 제공하고, 장식 모드 카드의 `div onClick`을 제거해 선택은 내부 버튼으로만 변경됨. BGM/SFX 토글에 동작·상태 라벨과 `aria-pressed`를 추가하고, 전역 텍스트 선택을 허용하며 커스텀 이미지 캔버스에 방향키 팬 대안을 추가함. 진행 중 홈 복귀는 확인 모달을 거치며 WinModal은 Escape로 닫지 않는 완료 상태 정책을 적용함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS, tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 16/16 PASS. 360×640·1280×800 홈 확인 모달 328px/400px·가로 오버플로 0건, Tab 순환·Escape 취소, 배경 스크롤 잠금 확인. 타이틀 화면 Lighthouse 접근성 1.0. 실제 모바일 실기기·Safari/Firefox·스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-39--접근성파괴적-액션-ux-잔여-정비)

- **TASK-DEV-38** — Time Attack 이동 시점 제한 시간 검사 (완료일: 2026-11-20)
  - 핵심 결과: `moveTile()` 진입 시 실제 경과 초를 확인해 제한 시간 이상이면 이동을 거부하고 `gameover`로 전환함. 250ms 인터벌과 이동 이벤트 사이의 틈·탭 복귀 직후에도 제한 시간 이후 승리와 기록 저장이 발생하지 않음. 만료 시 정답 미리보기는 닫고 GameOver만 표시함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(`usePuzzleGame` 13건, 틱 사이 이동·완성 수 거부 포함), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 16/16 PASS. 실제 모바일 실기기·Safari/Firefox·스크린리더는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-38--time-attack-이동-시점-제한-시간-검사)

- **TASK-DEV-37** — 오디오 볼륨·BGM 자동 연동 정합화 (완료일: 2026-11-20)
  - 핵심 결과: Web Audio master gain과 개별 gain에 중복 적용되던 `sfxVolume`을 개별 gain 1회로 정리해 HTMLAudio 폴백과 음량 스케일을 통일함. `setAutoThemeBgm(true)`가 현재 테마의 권장 BGM으로 즉시 전환하고 이후 테마 변경에도 동기화하도록 수정하고 4개 국어 설명을 실제 동작에 맞춤
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(`audioManager` 15건, `BgmSelectModal` 6건), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 16/16 PASS. 실제 기기 음량 청취·Safari/Firefox 오디오 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-37--오디오-볼륨bgm-자동-연동-정합화)

- **TASK-DEV-36** — PWA 브랜딩·매니페스트·프리캐시 자산 정리 (완료일: 2026-11-20)
  - 핵심 결과: 매니페스트 색상을 `#EFEFEA`/`#BB3E0B`로 맞추고 `orientation`을 제거해 가로 태블릿·데스크톱 설치를 허용함. 192·512·maskable·apple-touch 아이콘을 현재 심플·어반 팔레트로 재생성하고, 사용하지 않는 스프라이트·개별 아이콘을 프리캐시에서 제거해 v2.4/17건/약 1.21MB로 축소함. 설치 프롬프트 거부·오류·`appinstalled`를 안전하게 처리하고 배너를 complementary landmark로 전환함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(아이콘 규격·maskable safe zone·매니페스트·프리캐시 포함), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 16/16 PASS. 360×640·1280×800 설치 배너와 오프라인 재로드 확인. 실제 설치 프롬프트·실기기 홈 화면 아이콘·Safari/Firefox는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-36--pwa-브랜딩매니페스트프리캐시-자산-정리)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-DEV-29 (정답 보기 읽기 전용 미리보기·기록 무결성), TASK-DEV-30 (PWA 최초 설치 오프라인 프리캐시), TASK-DEV-31 (Daily 활성 컨텍스트·시작 날짜 무결성), TASK-DEV-32 (AI 힌트 폴백·토스트 타이머), TASK-DEV-33 (모달 배경 스크롤·중첩), TASK-DEV-34 (커스텀 이미지 상태·로드 실패), TASK-DEV-35 (Confetti·공유 후처리), TASK-DEV-36 (PWA 브랜딩·프리캐시 자산), TASK-DEV-37 (오디오 볼륨·BGM 자동 연동), TASK-DEV-38 (Time Attack 이동 시점 검사), TASK-DEV-39 (접근성·파괴적 액션 UX), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-QA-10 (P1 수정 독립 검증·회귀 테스트), TASK-QA-11 (P2 수정 전체 회귀·크로스브라우저 검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
