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

#### [ ] TASK-DEV-28 — 모바일 터치 타깃·PWA 배너 접근성 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 360px에서 작은 인터랙티브 타깃을 WCAG 2.5.8(24×24px) 이상으로 확대하고, 주요 PWA CTA를 44px로 맞추며, Service Worker 업데이트 아이콘 버튼에 접근 가능한 이름을 제공한다.
- **대상 파일**: `src/components/Title/TitleScreen.css`, `src/components/Header/Header.css`, `src/components/Modal/BgmSelectModal.css`, `src/components/PWA/PwaInstallBanner.css`, `src/components/PWA/ServiceWorkerUpdateBanner.css`, `src/components/PWA/ServiceWorkerUpdateBanner.tsx`
- **재현/증거**:
  - 언어 선택 `<select>`의 실제 클릭 영역이 64×16px이고, 36px 높이의 래퍼 오른쪽 여백을 클릭하면 `DIV.lang-select-wrapper`가 잡혀 select에 포커스가 가지 않음.
  - BGM 볼륨 슬라이더의 input 박스가 360에서 150×4px, 1280에서 274×4px로 터치·드래그 영역이 매우 얇음.
  - 360px에서 PWA 설치 버튼 116×40px, 업데이트 버튼 36×40px로 주요 CTA가 44px 기준에 미달함.
  - 400px 이하에서 `.btn-sw-update span`이 `display: none`이 되어 업데이트 버튼의 `ariaSnapshot`이 `- button`으로 나오고, `aria-label`도 없어 스크린리더가 동작을 알 수 없음.
  - PWA 설치 배너의 설명 문구가 360px에서 `text-overflow: ellipsis`로 잘림.
  - 증거: `root/archive/assets/task-qa-09/`의 `pwa-install-360x640.webp`, `sw-update-360x640.webp`, `bgm-360x640.webp` 및 QA 측정 결과.
- **DoD**:
  - 언어 select·볼륨 슬라이더의 실제 히트 영역을 최소 24×24px 이상(가능하면 32~44px)으로 확대
  - PWA 설치·업데이트 주요 CTA를 모바일에서 최소 44px 높이로 조정
  - 400px 이하에서도 업데이트 버튼에 텍스트 또는 `aria-label`로 접근 가능한 이름 제공
  - PWA 설치 배너 설명을 2줄 허용 또는 축약 문구와 전체 접근성 이름으로 제공
  - 360×640·360×800·1280×800 회귀 스크린샷과 `npm test`, `npx tsc --noEmit`, `npm run build` 결과 기록
- **선행 조건**: 없음

### [QA / DevOps]

---

## 3. Recent Completions (최근 완료 요약)

- **TASK-DEV-27** — 360px 모달 텍스트 줄바꿈·잘림 정비 (완료일: 2026-11-08)
  - 핵심 결과: 모달 5종의 제목·테마명·BGM 트랙명·일일 스트릭 라벨을 단어 중간 줄바꿈 없이 표시하도록 정비함. `--text-word-break` 토큰으로 한국어만 `keep-all`을 적용하고, 헤더 제목 그룹에 `flex: 1`·`min-width: 0`, 360px 제목 16~18px, 테마 카드 이름/카테고리 세로 배치·2줄 이름, BGM 트랙명/장르 2줄 허용, 스트릭 라벨 폭 확보를 적용함. 일본어 BGM의 긴 자동 연동·장르 라벨도 패널 안에 수용하도록 `min-width: 0`·`max-width: 100%`를 보강함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 6.4.5 빌드 성공, Playwright E2E 4/4 PASS. 360×640·360×800·1280×800 한국어 5개 모달에서 제목 1줄·단어 중간 줄바꿈 0건·가로 잘림 0건·패널/문서 오버플로 0건, EN·JA·ZH 360×640 15개 조합에서도 0건. 실제 모바일 실기기·Safari/Firefox·스크린리더는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-27--360px-모달-텍스트-줄바꿈잘림-정비)

- **TASK-PM-05** — Node.js 요구사항·배포 문서 링크 정합화 (완료일: 2026-11-08)
  - 핵심 결과: README·AGENTS의 Node/npm 요구사항을 `engines`·`.nvmrc`·CI 기준으로 맞추고, 기술 스택을 lockfile 버전(React 19.2.8·Vite 6.4.5 등)으로 갱신. `DEPLOYMENT.md`·CI·`robots.txt` 링크와 Vercel pause 상태를 문서에 연결
  - 검증 범위: 문서 링크 누락 0건, Node 26.13.0에서 `npm test` 29개 파일/183개 케이스 PASS, `npm run typecheck` 0 Errors, `npm run build` Vite 6.4.5 성공. GitHub Actions 원격 실행·Vercel 실제 배포·실기기 검증은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-pm-05--nodejs-요구사항배포-문서-링크-정합화)

- **TASK-QA-09** — 심플·어반 UI/UX·가독성·시각 회귀 검증 (완료일: 2026-11-08)
  - 핵심 결과: 360×640·360×800·1280×800에서 타이틀·게임·HUD·보드·8종 모달·Win/GameOver·토스트·PWA 배너를 검증함. 가로 오버플로·12px 미만 텍스트·그라데이션·blur·9999px pill·UI 이모지 0건, 모달 공통 평면 스타일·포커스 링·숫자 가독성·reduced motion 확인. 360px 모달 제목/카드명 줄바꿈·잘림과 언어 select·볼륨 슬라이더·PWA CTA 터치 타깃/업데이트 버튼 접근성 문제를 `TASK-DEV-27`·`TASK-DEV-28`로 발주함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공, Playwright E2E 4/4 PASS, Lighthouse 8개 화면 접근성·Best Practices·SEO 1.0. P0 0/P1 0/P2 2. 실제 모바일 실기기·Safari/Firefox·스크린리더·OS 수준 reduced-motion은 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-qa-09--심플어반-uiux가독성시각-회귀-검증)

- **TASK-QA-08** — CI/CD·테스트 환경·의존성·배포 문서 정비 (완료일: 2026-11-08)
  - 핵심 결과: GitHub Actions CI(`quality`·`e2e`)와 Node 24 기준 `.nvmrc`·`engines`를 추가하고, Node 26에서도 수동 환경 변수 없이 `npm test`가 통과하도록 jsdom Storage setup을 보정함. `npm audit fix`로 Vite 6.4.5·Vitest 4.1.12·sharp 0.35.5 등을 갱신해 전체 취약점 0건을 달성하고, Playwright E2E 4개 시나리오·`robots.txt`·배포 절차 문서를 추가함. README/AGENTS 문서 정합화는 `TASK-PM-05`로 PM에 전달함
  - 검증 범위: Node 24.15.0·26.13.0에서 `npm ci`·Vitest 29개 파일/183개 케이스 PASS·tsc 0 Errors·Vite 6.4.5 빌드 성공·Playwright 4/4 PASS, `npm audit` prod/전체 0건, CI YAML 파싱 성공. GitHub Actions 원격 실행·Vercel 실제 배포·실제 모바일 실기기는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-qa-08--cicd테스트-환경의존성배포-문서-정비)

- **TASK-DEV-26** — 전 화면 심플·어반 UI/UX 적용 및 가독성 개선 (완료일: 2026-11-08)
  - 핵심 결과: 타이틀을 좌측 워드마크·01~04 모드 목록·선택 모드 신호색 CTA로 재구성하고, HUD를 3셀 통계 바·monospace 숫자로 정리함. 보드의 빈 슬롯 글로우·힌트 방사형 글로우를 제거하고, 8종 모달을 solid overlay·1px 보더·8px radius·좌측 제목으로 통일함. 업적·PWA·토스트의 금색 글로우를 제거하고, 번역문·TSX의 UI 이모지와 PNG 아이콘을 lucide 단일 아이콘으로 교체함. 공유 카드도 평면 팔레트로 변경하고 사용하지 않는 스프라이트 CSS·코어 PNG 프리로드 16건을 제거함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공(스프라이트 CSS 경고 해소). 360×800·1280×800 변경 전후 스크린샷과 Win/GameOver 스크린샷 확보. 360×800 게임 화면 800px·가로 오버플로 0건·주요 액션 44px, 주요 모달 6종의 360/1280 레이아웃 확인. 그라데이션·blur·9999px pill·12px 미만 폰트·UI 이모지·800/900 굵기 0건. 실제 모바일 실기기·Safari/Firefox·OS 수준 reduced-motion·공유 카드 실제 공유는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-26--전-화면-심플어반-uiux-적용-및-가독성-개선)

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
