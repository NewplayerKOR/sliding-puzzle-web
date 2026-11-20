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

#### [ ] TASK-QA-11 — P2 수정 전체 회귀·크로스브라우저 검증

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P2
- **목표**: TASK-DEV-32~39의 P2 수정이 기능·접근성·시각 회귀를 만들지 않았는지 전체 검증한다.
- **검증 범위**:
  - AI 폴백·토스트, 모달 배경 스크롤·중첩, 커스텀 이미지, Confetti·공유, PWA 브랜딩·프리캐시, 오디오·Time Attack, 접근성·파괴적 액션
  - 360×640·360×800·1280×800 레이아웃과 핵심 플레이·테마·BGM·업적·PWA 업데이트
  - Chromium 외 WebKit/Firefox 가능 범위, 실제 모바일·스크린리더는 가능한 범위에서 확인
- **DoD**:
  - 수정 항목별 재현·수정 후 결과와 P0/P1/P2 재분류를 기록한다.
  - Vitest·tsc·Vite 빌드·Playwright E2E·Lighthouse 결과를 기록한다.
  - 실제 모바일·Safari/Firefox·스크린리더 등 미실행 범위와 제한을 명시한다.
  - 새 결함은 재현 조건과 영향도를 포함해 DEV Backlog에 등록한다.
- **선행 조건**: TASK-DEV-32~39 완료 후

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-39** — 접근성·파괴적 액션 UX 잔여 정비 (완료일: 2026-11-20)
  - 핵심 결과: 업적 토스트를 `role="status"`·`aria-live="polite"`로 바꾸고 PWA 설치 배너를 `aside` complementary landmark로 정리함. 업적 진행 바에 `progressbar` 값, Daily 캘린더에 `grid`/`gridcell`·`aria-current="date"`를 제공하고, 장식 모드 카드의 `div onClick`을 제거해 선택은 내부 버튼으로만 변경됨. BGM/SFX 토글에 동작·상태 라벨과 `aria-pressed`를 추가하고, 전역 텍스트 선택을 허용하며 커스텀 이미지 캔버스에 방향키 팬 대안을 추가함. 진행 중 홈 복귀는 확인 모달을 거치며 WinModal은 Escape로 닫지 않는 완료 상태 정책을 적용함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS, tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 15/15 PASS. 360×640·1280×800 홈 확인 모달 328px/400px·가로 오버플로 0건, Tab 순환·Escape 취소, 배경 스크롤 잠금 확인. 타이틀 화면 Lighthouse 접근성 1.0. 실제 모바일 실기기·Safari/Firefox·스크린리더 수동 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-39--접근성파괴적-액션-ux-잔여-정비)

- **TASK-DEV-38** — Time Attack 이동 시점 제한 시간 검사 (완료일: 2026-11-20)
  - 핵심 결과: `moveTile()` 진입 시 실제 경과 초를 확인해 제한 시간 이상이면 이동을 거부하고 `gameover`로 전환함. 250ms 인터벌과 이동 이벤트 사이의 틈·탭 복귀 직후에도 제한 시간 이후 승리와 기록 저장이 발생하지 않음. 만료 시 정답 미리보기는 닫고 GameOver만 표시함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(`usePuzzleGame` 13건, 틱 사이 이동·완성 수 거부 포함), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 15/15 PASS. 실제 모바일 실기기·Safari/Firefox·스크린리더는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-38--time-attack-이동-시점-제한-시간-검사)

- **TASK-DEV-37** — 오디오 볼륨·BGM 자동 연동 정합화 (완료일: 2026-11-20)
  - 핵심 결과: Web Audio master gain과 개별 gain에 중복 적용되던 `sfxVolume`을 개별 gain 1회로 정리해 HTMLAudio 폴백과 음량 스케일을 통일함. `setAutoThemeBgm(true)`가 현재 테마의 권장 BGM으로 즉시 전환하고 이후 테마 변경에도 동기화하도록 수정하고 4개 국어 설명을 실제 동작에 맞춤
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(`audioManager` 15건, `BgmSelectModal` 6건), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 15/15 PASS. 실제 기기 음량 청취·Safari/Firefox 오디오 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-37--오디오-볼륨bgm-자동-연동-정합화)

- **TASK-DEV-36** — PWA 브랜딩·매니페스트·프리캐시 자산 정리 (완료일: 2026-11-20)
  - 핵심 결과: 매니페스트 색상을 `#EFEFEA`/`#BB3E0B`로 맞추고 `orientation`을 제거해 가로 태블릿·데스크톱 설치를 허용함. 192·512·maskable·apple-touch 아이콘을 현재 심플·어반 팔레트로 재생성하고, 사용하지 않는 스프라이트·개별 아이콘을 프리캐시에서 제거해 v2.4/17건/약 1.21MB로 축소함. 설치 프롬프트 거부·오류·`appinstalled`를 안전하게 처리하고 배너를 complementary landmark로 전환함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(아이콘 규격·maskable safe zone·매니페스트·프리캐시 포함), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 15/15 PASS. 360×640·1280×800 설치 배너와 오프라인 재로드 확인. 실제 설치 프롬프트·실기기 홈 화면 아이콘·Safari/Firefox는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-36--pwa-브랜딩매니페스트프리캐시-자산-정리)

- **TASK-DEV-35** — 승리 Confetti·공유 흐름 후처리 안정성 (완료일: 2026-11-20)
  - 핵심 결과: 승리 모달을 닫거나 언마운트할 때 Confetti RAF와 캔버스를 정리함. 공유 시트 취소(`AbortError`)는 다운로드·클립보드 폴백 없이 종료하고, 실제 공유 실패에만 폴백하며 Blob 생성 실패를 안내함. 테마 이미지 로드에 3초 타임아웃을 두고 다운로드 앵커를 문서에 연결한 뒤 Object URL을 1초 후 해제함
  - 검증 범위: Vitest 41개 파일/247개 케이스 PASS(`WinModal` 2건, `shareCardGenerator` 5건), tsc 0 Errors, Vite 8.3.6 빌드 성공, Playwright E2E 15/15 PASS. 실제 공유 시트·Safari/Firefox 다운로드 동작은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-35--승리-confetti공유-흐름-후처리-안정성)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-DEV-29 (정답 보기 읽기 전용 미리보기·기록 무결성), TASK-DEV-30 (PWA 최초 설치 오프라인 프리캐시), TASK-DEV-31 (Daily 활성 컨텍스트·시작 날짜 무결성), TASK-DEV-32 (AI 힌트 폴백·토스트 타이머), TASK-DEV-33 (모달 배경 스크롤·중첩), TASK-DEV-34 (커스텀 이미지 상태·로드 실패), TASK-DEV-35 (Confetti·공유 후처리), TASK-DEV-36 (PWA 브랜딩·프리캐시 자산), TASK-DEV-37 (오디오 볼륨·BGM 자동 연동), TASK-DEV-38 (Time Attack 이동 시점 검사), TASK-DEV-39 (접근성·파괴적 액션 UX), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-QA-10 (P1 수정 독립 검증·회귀 테스트), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
