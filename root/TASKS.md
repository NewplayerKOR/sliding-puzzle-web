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

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: PWA 설치 요건을 충족하는 아이콘을 제공하고, 서버 오류·업데이트 시 캐시 폴백과 게임 진행 보호를 강화한다.
- **대상 파일**: `public/manifest.webmanifest`, `public/assets/icons/**`, `public/sw.js`, `src/main.tsx`
- **재현/증거**: 매니페스트는 `badge_trophy.png`를 192×192·512×512로 선언하지만 실제 이미지는 224×197이고 maskable·apple-touch 아이콘이 없음. 서버 중단 후 재로드 시 SW가 502 응답을 그대로 반환해 캐시 폴백이 동작하지 않음. `controllerchange`에서 무조건 `location.reload()`를 호출해 업데이트 시 게임이 중단될 수 있음.
- **DoD**:
  - 192×192·512×512 정사각형 아이콘과 maskable 아이콘, apple-touch-icon 추가
  - Navigation Network First에서 `!response.ok`도 캐시 폴백 처리
  - `cache.addAll` 실패 시 자산별 캐시 또는 설치 실패 처리
  - 업데이트 시 진행 중 게임을 즉시 새로고침하지 않고 안내 후 반영
  - 서브패스 배포와 오프라인 재로드 재검증
- **선행 조건**: 없음

#### [ ] TASK-DEV-22 — BGM·이미지 에셋 경량화 및 초기 로딩 최적화

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 초기 다운로드·SW 프리캐시 용량을 줄이고, 현재 테마·현재 BGM만 우선 로드한다.
- **대상 파일**: `public/assets/audio/**`, `src/utils/audioManager.ts`, `src/utils/assetPreloader.ts`, `src/hooks/useAssetPreloader.ts`, `public/sw.js`, `scripts/**`
- **재현/증거**: `dist` 총 20.45MB 중 오디오 13.83MB(4개 WAV 2.01~4.15MB), 스프라이트 2.63MB, 테마 이미지 2.62MB. 초기 리소스 46건의 decodedBodySize 합계 9.9MB(현재 BGM 3.4MB + 프리로드 이미지 약 4.9MB). SW가 4개 BGM 전체를 설치 시 프리캐시.
- **DoD**:
  - BGM 4트랙을 MP3/OGG 등 압축 포맷으로 전환하고 원본 WAV는 배포에서 제외
  - 최초 로드 시 현재 테마 이미지·현재 BGM만 로드하고 나머지는 지연 로드
  - 스프라이트·아이콘 압축 또는 SVG 전환 검토
  - SW 프리캐시를 필수 셸과 현재 테마 중심으로 축소
  - 변경 전후 `dist` 용량·초기 decodedBodySize·테마 전환 깜빡임·오프라인 동작 비교 기록
- **선행 조건**: 없음

#### [ ] TASK-DEV-23 — 업적 토스트 다중 달성 큐 및 메타데이터 병합 수정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 한 번의 승리로 여러 업적이 달성돼도 모두 순차 표시하고, 저장된 업적 데이터가 최신 정의를 덮어쓰지 않게 한다.
- **대상 파일**: `src/components/Achievement/AchievementToast.tsx`, `src/utils/achievementManager.ts`, `src/utils/achievementData.ts`, 관련 테스트
- **재현/증거**: 3x3 승리에서 `first_victory`, `speed_demon`, `purist_no_undo` 3건이 동시에 잠금 해제됐지만 토스트는 마지막 `purist_no_undo` 1건만 표시됨. `getStoredAchievements`가 `{ ...init, ...found }` 순서로 병합해 저장된 옛 제목·설명이 최신 정의를 덮어씀.
- **DoD**:
  - 다중 달성 시 큐 또는 통합 토스트로 모든 업적 표시, 타이머 정리
  - 정적 메타데이터는 최신 정의를 사용하고 `unlockedAt`·`progress`만 저장값 유지
  - 다중 달성·저장 데이터 병합 테스트 추가
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS
- **선행 조건**: 없음

#### [ ] TASK-DEV-24 — LocalStorage 접근·스키마 방어

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 저장소 접근 차단·손상된 JSON·예상 밖 스키마에서도 앱이 빈 화면으로 죽지 않고 기본값으로 동작하게 한다.
- **대상 파일**: `src/i18n/useTranslation.ts`, `src/App.tsx`(커스텀 이미지 초기화), `src/utils/recordStorage.ts`, `src/utils/dailyChallenge.ts`, `src/utils/achievementManager.ts`, `src/utils/audioManager.ts`, 공통 storage 유틸(신설 가능)
- **재현/증거**: `getInitialLanguage`와 `App.tsx` 67~70행이 `localStorage.getItem`을 try/catch 없이 호출하므로 저장소 접근이 차단된 환경에서 모듈 초기화가 실패할 수 있음. 일일 스트릭·기록·업적 JSON은 파싱 후 스키마 검증이 없어 `completedDates` 등 필드가 없으면 `.includes`에서 예외가 발생할 수 있음.
- **DoD**:
  - 안전한 storage 래퍼로 읽기·쓰기·파싱 실패를 흡수하고 기본값 반환
  - 일일 스트릭·기록·업적·오디오 설정 스키마 검증
  - 저장소 차단·손상 JSON·필드 누락 테스트 추가
  - 앱 초기 화면이 정상 렌더링됨을 확인
- **선행 조건**: 없음

### [QA / DevOps]

#### [ ] TASK-QA-08 — CI/CD·테스트 환경·의존성·배포 문서 정비

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P2
- **목표**: PR마다 테스트·타입 검사·빌드·보안 감사를 자동 수행하고, Node 요구사항과 테스트 실행 조건을 정합화하며, 핵심 E2E와 배포 절차를 마련한다.
- **근거**:
  - `.github` 워크플로가 없어 `npm test`·`npx tsc --noEmit`·`npm run build`·`npm audit`가 자동 검증되지 않음.
  - README/AGENTS는 Node.js 18+를 안내하지만 Vitest 4는 Node 20+, jsdom 30은 Node 22.22.2/24.15/26+를 요구함.
  - Node 26에서 `NODE_OPTIONS=--localstorage-file` 없이 `npm test`를 실행하면 localStorage 관련 테스트가 실패함(제품 결함 아님).
  - `npm audit` 전체 6건(moderate 2·high 4, sharp/vite/vitest/undici/source-map-js), `npm audit --omit=dev`는 0건.
  - 공유 카드·모달·모바일 뷰포트·PWA를 포함한 E2E가 없고, `robots.txt`·배포 절차 문서가 없음.
- **DoD**:
  - Node 24 LTS(또는 팀 합의 버전) 기준 CI 워크플로에서 `npm ci` → test → tsc → build → `npm audit --omit=dev` 실행
  - `package.json` `engines`와 README/AGENTS Node 요구사항 정합화(문서는 PM에 전달)
  - 수동 환경 변수 없이 `npm test`가 통과하도록 setup 파일 또는 스크립트 정비
  - dev 의존성 취약점 6건 수정 또는 예외 사유 기록, `npm outdated` 주요 항목 갱신 검토
  - Playwright E2E 스모크(타이틀→테마→게임→이동/Undo→AI 힌트→3x3 승리, 360px 레이아웃, 모달 포커스, EN 전환) 추가
  - `public/robots.txt`와 배포·캐시 갱신 절차 문서 추가
  - CI·로컬 실행 결과와 미실행 범위 기록
- **선행 조건**: 없음 (TASK-DEV-18~24와 병행 가능. E2E는 DEV 수정 완료 후 최종 확인)

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-21** — PWA 매니페스트 아이콘·Service Worker 폴백/업데이트 안정화 (완료일: 2026-11-08)
  - 핵심 결과: 192×192·512×512 `any` 아이콘과 maskable 2종, apple-touch-icon(180×180)을 추가하고 매니페스트 `scope`·purpose를 정비. SW Navigation에서 502 등 `!response.ok` 응답도 캐시 셸로 폴백하고, `cache.addAll` 실패 시 자산별 캐시로 전환. 새 워커는 자동 활성화하지 않고 업데이트 배너에서 사용자가 선택할 때만 `SKIP_WAITING` 후 새로고침
  - 검증 범위: Vitest 24개 파일/152개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. 서브패스(`/sliding-puzzle/`) 프로덕션 빌드에서 SW scope·캐시 37건·아이콘 4종 규격 확인, 502 응답·서버 중단 재로드에서 캐시 셸 렌더링 확인, 업데이트 배너 표시→나중에(무새로고침)→지금 업데이트(새 워커 활성·1회 새로고침) 확인. 실제 모바일 실기기·Safari는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-21--pwa-매니페스트-아이콘service-worker-폴백업데이트-안정화)

- **TASK-DEV-20** — 360px 모바일·1화면 레이아웃 및 터치 처리 정비 (완료일: 2026-11-08)
  - 핵심 결과: 헤더 클래스 불일치를 바로잡고 360px에서 타이틀 상단 바를 2줄로 배치해 배지·오디오 컨트롤 잘림 해소. 400px 이하 툴바를 4열 아이콘으로 압축하고 보드·여백을 높이에 맞춰 축소해 360×800·1280×800 게임 화면을 스크롤 없이 배치. 터치 스크롤 차단을 non-passive 리스너로 전환
  - 검증 범위: Vitest 21개 파일/136개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공, 360×640·360×800·1280×800 iframe 뷰포트 측정과 스크린샷 4종, 데스크톱 Chromium 터치 이벤트·콘솔 오류 0건 확인. 실제 모바일 실기기·iOS Safari는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-20--360px-모바일1화면-레이아웃-및-터치-처리-정비)

- **TASK-DEV-19** — ARIA 구조·색 대비·확대 허용·접근성 라벨 정비 (완료일: 2026-11-08)
  - 핵심 결과: 보드를 `role="group"`으로 단순화하고 타이틀에 `main` landmark 추가, 모드 카드 중첩 버튼 역할 제거, 크기 pill `aria-pressed` 추가. `maximum-scale=5.0` 확대 허용, WCAG AA 대비 보정, BGM/SFX 라벨·alt 4개 국어화. Lighthouse 접근성 타이틀·게임 1.0
  - 검증 범위: Vitest 20개 파일/134개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공, 데스크톱 Chromium Lighthouse 접근성 타이틀·게임·테마 모달·BGM 모달 1.0. 실제 모바일 실기기·스크린리더 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-19--aria-구조색-대비확대-허용접근성-라벨-정비)

- **TASK-DEV-18** — 모달 포커스 트랩 및 전역 키보드 입력 충돌 해결 (완료일: 2026-11-08)
  - 핵심 결과: 공통 `useModalFocusTrap` Hook으로 8종 모달의 초기 포커스·Tab/Shift+Tab 순환·닫기 후 포커스 복원을 처리하고, 모달 열림 동안 배경 `.app-content`를 `inert`·`aria-hidden` 처리. 보드는 모달 열림 중과 `SELECT`·`INPUT`·`TEXTAREA` 포커스 시 키 입력을 무시
  - 검증 범위: Vitest 19개 파일/130개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공, 데스크톱 Chromium에서 테마·BGM·커스텀 이미지·승리 모달 포커스 순환과 보드·언어 선택 키 입력 차단 확인. 실제 모바일 실기기·스크린리더는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-18--모달-포커스-트랩-및-전역-키보드-입력-충돌-해결)

- **TASK-DEV-17** — AI 힌트 레이스 컨디션·Worker 실패 처리 (완료일: 2026-11-08)
  - 핵심 결과: 보드·그리드·게임 상태 변경 시 진행 중 힌트 요청을 즉시 무효화하고, Worker 오류·5초 시간 초과·힌트 없음 시 계산 상태 해제와 4개 국어 토스트 안내 추가. 실패한 Worker는 다음 요청에서 재생성
  - 검증 범위: Vitest 18개 파일/127개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공, 데스크톱 Chromium에서 정상 힌트·보드 변경 무효화·힌트 없음·시간 초과·재시도 확인. 실제 모바일 실기기·Worker 스크립트 로드 실패는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-17--ai-힌트-레이스-컨디션worker-실패-처리)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화)
