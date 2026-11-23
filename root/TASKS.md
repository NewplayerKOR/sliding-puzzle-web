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

#### [ ] TASK-QA-13 — 전수 점검 후속 전체 회귀·간헐 실패·가이드 대조 검증

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P1
- **목표**: DEV-44~48 수정 전 기준선을 고정하고 간헐 실패를 재현하며 `modern-web-guidance`·`frontend-design` 대조로 누락을 막는다.
- **대상 파일**: `e2e/*.spec.ts`, `src/test/setup.ts`, `.github/workflows/ci.yml`, `root/archive/assets/task-qa-13/*`
- **재현/증거**:
  - 2026-11-23 `npm test` 1회차 1 failed(`App.daily.test.tsx:162 Daily를 포기하고 일반 모드에서 이겨도`)·250 passed, 2회차 251/251 PASS. 단일 파일 실행은 4/4 PASS로 병렬·순서 의존 간헐 실패로 판단함.
  - `modern-web-guidance` retrieve `dialog,accessibility,performance,responsive-design,form-factor-adaptation` 92.8KB 가이드를 대조함. native `dialog`·`aria-disabled`·`touch-action` 축 한정·이미지 우선순위·토스트 중앙화 기준에서 DEV-44~47 항목을 도출함.
  - `frontend-design` 냉정 평가로 번호·대문자·중점·mono·SaaS 카드·푸터 기술 자랑·진입 fade·무한 nudge를 DEV-48로 분리함.
  - Vercel은 소유자 의도 pause 상태이며 장애로 보고하지 않음.
- **DoD**:
  - 전체 `npm test`를 3회 반복(1회는 `--sequence`·단일 워커)하고 간헐 실패 로그·리포트를 보관한다.
  - `npm run typecheck`, `npm run build`, `npx playwright test`(Chromium 31/31), `npm audit` 전체·prod 0건을 확인한다.
  - DEV-44~48 수정 전후 동일 조건 비교표를 남기고 테스트 약화·스킵 추가 없이 검증한다.
  - Lighthouse 타이틀·게임 접근성, 360×640·1280×800 오버플로, 키보드 Tab·Escape, reduced-motion을 스팟 확인하고 미실행(실기기·Safari 네이티브·스크린리더)을 명시한다.
  - `root/AGENTS.md`·`root/DESIGN_SYSTEM.md` 버전 기록 변경이 필요하면 PM에 전달한다.
- **선행 조건**: DEV-44~48 수정 전 기준선 1회를 먼저 고정한다.

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-48** — 타이틀·히어로 디자인 감점 해소 (완료일: 2026-11-24)
  - 핵심 결과: 순차 의미 없는 `01/02/03/04` 번호를 제거하고 뱃지를 sentence case(`Speed/Tactics/Streak`)로 바꿈. `size-pill` mono→sans, `stat-label`·`toast-tag` 대문자→sentence case, `•` 3곳 제거. Standard 카드에 `featured` 위계(신호 인셋 상시+큰 제목, 641px↑ 전폭)를 부여해 4카드 동일 밀도를 깸. 진입 `fadeIn` 제거, 히어로 상단 28px 신호 바 추가
  - 검증 범위: Vitest 42개 파일/257개 케이스 PASS, tsc 0 Errors, Vite 8.3.8 빌드 성공, Chromium E2E 31/31 PASS. 스팟 360×640·1280×800 가로 오버플로 0건·`mode-index` 0건·대문자 뱃지 0건, `uppercase` 잔재 0건. PM 문구·배치 최종 확인은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-48--타이틀히어로-디자인-감점-해소)

- **TASK-DEV-47** — 저장·에셋·공유·PWA·i18n 정합화 (완료일: 2026-11-24)
  - 핵심 결과: 커스텀 이미지 읽기·쓰기에 4MB 상한을 적용하고 초과분은 파기·안내함. 공유 카드 팔레트 `SHARE_COLORS`·컨페티 `WIN_CONFETTI_COLORS` 상수화, BGM CSS 7곳 `var(--border-default)` 교체. manifest `lang` 제거, 푸터 `footerOfflineReady` 4개 국어 교체, 속도 토글 `replaySpeedLabel` 4개 국어 라벨, BGM·SFX `preload none` 지연 로드
  - 검증 범위: Vitest 42개 파일/257개 케이스 PASS(oversize 파기·속도 라벨 신규), tsc 0 Errors, Vite 8.3.8 빌드 성공, Chromium E2E 31/31 PASS(PWA 오프라인 포함). `index.html` 영문 기본값 유지 근거 기록. 스크린리더·저사양 체감 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-47--저장에셋공유pwa-i18n-정합화)

- **TASK-DEV-46** — 타일·힌트 접근성·터치·모션 정합화 (완료일: 2026-11-24)
  - 핵심 결과: 비이동 타일 `disabled`→`aria-disabled`+활성화 가드로 포커스 탐색 유지. 빈 슬롯 `role=none`, 힌트 오버레이 live-region 중첩 제거(문구는 버튼 이름에 포함). 타일 `touch-action manipulation`, 힌트 화살표 1회성, `:focus-visible` 미지원 대체 링 추가
  - 검증 범위: Vitest 42개 파일/257개 케이스 PASS(`Tile.test.tsx` 4건 신규), tsc 0 Errors, Vite 8.3.8 빌드 성공, Chromium E2E 31/31 PASS(보드 스와이프·키보드 포함). 수치 정렬용 mono·스크린리더 실측은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-46--타일힌트-접근성터치모션-정합화)

- **TASK-DEV-45** — 보드 입력·타이머·리플레이 상태 안정화 (완료일: 2026-11-24)
  - 핵심 결과: 쿨다운 `setTimeout` 체인, Solver Worker lazy 생성, 리플레이 updater 순수화+종료 effect 분리, 토스트 `current?.id` 기준 4.5초 보장, `FileReader` abort·중단 가드 추가. `aiHint` 테스트 4건은 lazy 생성 순서에 맞춰 동일 동작으로 검증
  - 검증 범위: Vitest 42개 파일/257개 케이스 PASS, tsc 0 Errors, Vite 8.3.8 빌드 성공, Chromium E2E 31/31 PASS
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-45--보드-입력타이머리플레이-상태-안정화)

- **TASK-DEV-44** — 모달 inert 범위·오버레이 dialog 구조 정합화 (완료일: 2026-11-24)
  - 핵심 결과: 10개 모달 오버레이 `role="dialog"`를 내부 콘텐츠 컨테이너로 이동(WinModal light-dismiss 없음 유지). SW 업데이트 배너를 `.app-content` 안으로 이동해 모달 중 비활성화, 토스트는 발표 보존을 위해 밖에 유지. overflow 잠금 유지 근거를 `useBodyScrollLock`에 기록(native `dialog` 마이그레이션 계획 포함)
  - 검증 범위: Vitest 42개 파일/257개 케이스 PASS, tsc 0 Errors, Vite 8.3.8 빌드 성공, Chromium E2E 31/31 PASS(`modal-lifecycle`·`accessibility-ux` 포함). native 마이그레이션·실기기 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-44--모달-inert-범위오버레이-dialog-구조-정합화)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-DEV-29 (정답 보기 읽기 전용 미리보기·기록 무결성), TASK-DEV-30 (PWA 최초 설치 오프라인 프리캐시), TASK-DEV-31 (Daily 활성 컨텍스트·시작 날짜 무결성), TASK-DEV-32 (AI 힌트 폴백·토스트 타이머), TASK-DEV-33 (모달 배경 스크롤·중첩), TASK-DEV-34 (커스텀 이미지 상태·로드 실패), TASK-DEV-35 (Confetti·공유 후처리), TASK-DEV-36 (PWA 브랜딩·프리캐시 자산), TASK-DEV-37 (오디오 볼륨·BGM 자동 연동), TASK-DEV-38 (Time Attack 이동 시점 검사), TASK-DEV-39 (접근성·파괴적 액션 UX), TASK-DEV-40 (PWA 첫 설치 업데이트 배너), TASK-DEV-41 (Daily 캘린더 목록 구조), TASK-DEV-42 (BGM 모달 음소거 라벨), TASK-DEV-43 (모바일 문서 스크롤), TASK-DEV-44 (모달 inert·dialog 구조), TASK-DEV-45 (보드 입력·타이머·리플레이), TASK-DEV-46 (타일·힌트 접근성), TASK-DEV-47 (저장·에셋·공유·PWA·i18n), TASK-DEV-48 (타이틀·히어로 디자인), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-QA-10 (P1 수정 독립 검증·회귀 테스트), TASK-QA-11 (P2 수정 전체 회귀·크로스브라우저 검증), TASK-QA-12 (Context7 기반 최신 도구체인 적용 준비·검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-DEV-29 (정답 보기 읽기 전용 미리보기·기록 무결성), TASK-DEV-30 (PWA 최초 설치 오프라인 프리캐시), TASK-DEV-31 (Daily 활성 컨텍스트·시작 날짜 무결성), TASK-DEV-32 (AI 힌트 폴백·토스트 타이머), TASK-DEV-33 (모달 배경 스크롤·중첩), TASK-DEV-34 (커스텀 이미지 상태·로드 실패), TASK-DEV-35 (Confetti·공유 후처리), TASK-DEV-36 (PWA 브랜딩·프리캐시 자산), TASK-DEV-37 (오디오 볼륨·BGM 자동 연동), TASK-DEV-38 (Time Attack 이동 시점 검사), TASK-DEV-39 (접근성·파괴적 액션 UX), TASK-DEV-40 (PWA 첫 설치 업데이트 배너), TASK-DEV-41 (Daily 캘린더 목록 구조), TASK-DEV-42 (BGM 모달 음소거 라벨), TASK-DEV-43 (모바일 문서 스크롤), TASK-DEV-44 (모달 inert·dialog 구조), TASK-DEV-45 (보드 입력·타이머·리플레이), TASK-DEV-46 (타일·힌트 접근성), TASK-DEV-47 (저장·에셋·공유·PWA·i18n), TASK-DEV-48 (타이틀·히어로 디자인), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-QA-10 (P1 수정 독립 검증·회귀 테스트), TASK-QA-11 (P2 수정 전체 회귀·크로스브라우저 검증), TASK-QA-12 (Context7 기반 최신 도구체인 적용 준비·검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
