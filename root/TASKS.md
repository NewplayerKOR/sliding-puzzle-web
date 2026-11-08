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

#### [ ] TASK-QA-09 — 심플·어반 UI/UX·가독성·시각 회귀 검증

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P2
- **목표**: TASK-DEV-26 적용 결과를 360px·데스크톱에서 검증하고, 가독성·일관성·접근성·AI 디자인 잔재를 확인해 잔여 문제를 DEV 업무로 발주한다.
- **검증 범위**:
  - 타이틀·HUD·컨트롤·보드·8종 모달·업적·PWA·토스트의 시각 일관성
  - 360×640·360×800·1280×800에서 오버플로·잘림·터치 영역·스크롤
  - 본문·메타 폰트 크기, 대비, 숫자 가독성, 포커스 가시성, `prefers-reduced-motion`
  - 그라데이션·글로우·이모지·과도한 radius/shadow 잔재
  - 기존 기능 회귀(테마·모달·키보드·Undo·AI 힌트·PWA)
- **DoD**:
  - 화면별 스크린샷과 발견 항목(P0/P1/P2) 기록
  - 문제 항목을 `TASK-DEV-27` 이후 ID로 DEV Backlog에 등록
  - `npm test`, `npx tsc --noEmit`, `npm run build` 결과 기록
  - 실제 모바일 실기기 미실행 시 명시
- **선행 조건**: TASK-DEV-26 완료 후

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-26** — 전 화면 심플·어반 UI/UX 적용 및 가독성 개선 (완료일: 2026-11-08)
  - 핵심 결과: 타이틀을 좌측 워드마크·01~04 모드 목록·선택 모드 신호색 CTA로 재구성하고, HUD를 3셀 통계 바·monospace 숫자로 정리함. 보드의 빈 슬롯 글로우·힌트 방사형 글로우를 제거하고, 8종 모달을 solid overlay·1px 보더·8px radius·좌측 제목으로 통일함. 업적·PWA·토스트의 금색 글로우를 제거하고, 번역문·TSX의 UI 이모지와 PNG 아이콘을 lucide 단일 아이콘으로 교체함. 공유 카드도 평면 팔레트로 변경하고 사용하지 않는 스프라이트 CSS·코어 PNG 프리로드 16건을 제거함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공(스프라이트 CSS 경고 해소). 360×800·1280×800 변경 전후 스크린샷과 Win/GameOver 스크린샷 확보. 360×800 게임 화면 800px·가로 오버플로 0건·주요 액션 44px, 주요 모달 6종의 360/1280 레이아웃 확인. 그라데이션·blur·9999px pill·12px 미만 폰트·UI 이모지·800/900 굵기 0건. 실제 모바일 실기기·Safari/Firefox·OS 수준 reduced-motion·공유 카드 실제 공유는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-26--전-화면-심플어반-uiux-적용-및-가독성-개선)

- **TASK-DEV-25** — 심플·어반 디자인 시스템 및 가독성 기준 수립 (완료일: 2026-11-08)
  - 핵심 결과: `src/styles/index.css`에 off-white·concrete·charcoal 중립 팔레트와 단일 신호색, 시스템 grotesk·monospace 숫자, 4px 간격, 0/4/8px radius, 1px 보더, 최소 그림자, 기능성 모션 토큰을 정의함. `App.css`의 전역 셸을 평면 배경·1px 보더·토큰 여백으로 교체하고, `index.html`에서 Google Fonts와 이모지 파비콘을 제거함. pulse·bounce·spring 장식을 줄이고 `prefers-reduced-motion` 전역 규칙을 추가함. `root/DESIGN_SYSTEM.md`에 금지·지양 목록과 화면별 TASK-DEV-26 마이그레이션 기준을 작성함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. 프로덕션 프리뷰에서 시스템 폰트 16px/24px·`tabular-nums`·평면 `#EFEFEA` 배경·Google Fonts 요청 0건·콘솔 오류 0건, 포커스 링 2px `#BB3E0B` 확인. 360×800·1280×800 게임 화면은 스크롤·가로 오버플로 없이 1화면 유지. 주요 텍스트·신호색 조합 WCAG AA 4.5:1 이상. 실제 모바일 실기기·Safari/Firefox·OS 수준 reduced-motion은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-25--심플어반-디자인-시스템-및-가독성-기준-수립)

- **TASK-DEV-24** — LocalStorage 접근·스키마 방어 (완료일: 2026-11-08)
  - 핵심 결과: `readStorageItem`·`writeStorageItem`·`readStorageJson` 공통 래퍼로 저장소 접근 차단·쓰기 실패·손상 JSON을 흡수. 일일 스트릭은 날짜 배열·정수 필드를 검증하고, 최고 기록은 시간·이동 수가 유한한 음이 아닌 수인지 확인. 업적은 배열·ID·`unlockedAt`·`progress`만 정규화하고 통계의 3성 횟수·클리어 테마도 검증. 오디오 설정은 boolean·0~1 볼륨·존재하는 BGM ID만 반영. 커스텀 이미지는 `data:image/` 값만 복원하고 언어는 지원 4개 국어만 허용
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. 데스크톱 Chromium에서 손상 JSON·문자열 필드·잘못된 타입을 넣고도 타이틀 렌더링·콘솔 오류 0건 확인, `Storage.prototype` 접근을 강제로 예외 처리한 상태에서 타이틀·업적 모달(0/12)·저장 함수·언어 전환·오디오 설정 변경이 예외 없이 동작함을 확인. 유효한 저장값은 재로드 후 그대로 복원됨. 실제 모바일 실기기·시크릿 모드 저장소 차단은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-24--localstorage-접근스키마-방어)

- **TASK-DEV-23** — 업적 토스트 다중 달성 큐 및 메타데이터 병합 수정 (완료일: 2026-11-08)
  - 핵심 결과: 업적 알림을 큐에 보관해 한 번의 승리로 여러 업적이 달성돼도 4.5초 간격으로 모두 순차 표시하고, 표시 시간 종료·언마운트 시 타이머를 정리. 효과음은 각 토스트가 표시될 때 재생. `getStoredAchievements`는 최신 정적 메타데이터를 쓰고 저장된 `unlockedAt`·`progress`만 유지하며, 초기 정의를 직접 변경하지 않도록 복사본 반환
  - 검증 범위: Vitest 26개 파일/161개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. 데스크톱 Chromium에서 3건 동시 달성 시 `first_victory`→`speed_demon`→`purist_no_undo` 순차 표시·14초 후 소멸·콘솔 오류 0건, 옛 메타데이터 저장값 병합 시 최신 제목·아이콘 유지와 `unlockedAt`·`progress` 보존 확인. 실제 모바일 실기기·스크린리더는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-23--업적-토스트-다중-달성-큐-및-메타데이터-병합-수정)

- **TASK-DEV-22** — BGM·이미지 에셋 경량화 및 초기 로딩 최적화 (완료일: 2026-11-08)
  - 핵심 결과: BGM 4트랙을 192kbps MP3에서 96kbps MP3로 변환하고 원본 `.wav`를 배포에서 제외. 최초 로드에는 코어 이미지+현재 테마+현재 BGM만 로드하고 나머지 테마는 테마 모달에서 지연 로드. 스프라이트·아이콘을 팔레트 PNG로 압축(3.59MB→0.52MB). SW 프리캐시를 필수 셸·코어 UI·기본 테마 30건/1.31MB로 축소하고 현재 BGM은 206 Range 응답 시 전체 파일을 런타임 캐시
  - 검증 범위: Vitest 25개 파일/156개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. dist 20.65→11.04MB, 초기 동일 출처 decodedBodySize 9,222,220→2,716,771바이트(-70.5%), BGM 13.05→6.52MiB. 서브패스 오프라인 재로드·현재 테마/BGM 캐시·미사용 테마 502·테마 모달 지연 로드 확인. 실제 모바일 실기기·Safari/Firefox·청취 품질 평가는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-22--bgm이미지-에셋-경량화-및-초기-로딩-최적화)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선)
