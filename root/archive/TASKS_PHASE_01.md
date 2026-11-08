# TASKS Phase 01 — 완료 보관

## TASK-PM-01 — 거버넌스 정합화 및 프로젝트 환경 요약 작성

- **Phase**: 01
- **담당**: PM
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: AGENTS.md를 단일 거버넌스로 확정하고, 구 운영 문서인 PROJECT_GUIDE.md를 제거하며, AGENTS.md 4장에 프로젝트 환경을 실제 소스 기준으로 기록한다.
- **완료 기준(DoD)**:
  - PROJECT_GUIDE.md 삭제 및 관련 참조 정리
  - AGENTS.md 4장 프로젝트 환경 요약 작성 (프로젝트명·한 줄 요약·기술 스택·실행/테스트/빌드 명령·주요 구조)
  - README의 세션 진입 안내가 AGENTS.md와 TASKS.md를 가리키도록 수정
  - 문서 링크·경로 정합성 확인

### 진행 결과

- `PROJECT_GUIDE.md`를 `git rm`으로 삭제함.
- `root/AGENTS.md` 4장에 프로젝트 환경 요약을 작성함.
- `README.md` 5행의 세션 진입 링크를 `root/AGENTS.md`, `root/TASKS.md`로 교체하고 7장 디렉터리 구조를 실제 구조로 갱신함.
- `.gitignore`에서 삭제된 `PROJECT_GUIDE.md` 항목을 제거함.
- `root/TASKS.md`에 본 작업의 완료 요약과 Phase 01 보관 링크를 등록함.

### 검증

- **실행·확인 방법**:
  - `git status --short`로 변경 파일과 삭제 상태를 확인함.
  - `git ls-files`로 추적 파일 목록에서 `PROJECT_GUIDE.md`가 제거됐는지 확인함.
  - `grep`으로 `README.md`, `root/AGENTS.md`, `root/TASKS.md`에 남은 `PROJECT_GUIDE.md` 참조를 확인함.
  - README의 링크 대상인 `root/AGENTS.md`, `root/TASKS.md` 존재 여부를 확인함.
- **결과**: 문서 링크와 경로 정합성 확인 완료. 삭제된 문서를 가리키는 활성 링크 없음. 보관 기록에 남긴 과거 문서명 언급은 이력으로만 유지함.
- **미실행**: `npm test`, `npm run build` — 현재 세션 셸에 Node.js와 npm이 PATH에 없어 실행하지 못함. 문서 작업이라 제품 코드 변경은 없지만, 환경 요약에 기재한 검증 명령은 Node.js 설치 후 재확인해야 함.
- **정정 (2026-11-08)**: WebStorm 번들 Node.js 경로를 확인한 뒤 TASK-PM-03에서 `npm test` 104/104 PASS와 `npm run build` 성공을 재확인함.
- **증거**: `root/AGENTS.md`, `README.md`, `.gitignore`, `root/TASKS.md`, `root/archive/TASKS_PHASE_01.md`

---

## TASK-PM-02 — FEATURES.md v1.4.0 기능 카탈로그 작성

- **Phase**: 01
- **담당**: PM
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: 현재 구현·검증된 사용자 기능을 v1.4.0 기준으로 FEATURES.md 기능 카탈로그에 정리한다.
- **완료 기준(DoD)**:
  - 기능 카탈로그에 도메인·기능명·설명·컴포넌트/함수·주요 파일·상태를 기록
  - v1.4.0 변경 이력과 검증 기준을 기록
  - 실제 소스와 대조해 누락·과장 없이 작성
- **진행 결과**:
  - Core Game, Game Modes, AI Solver, Themes, Custom Image, Daily Challenge, Achievements, Rating, Audio, Undo/Replay, Records, Sharing, PWA/Mobile, Localization, Persistence, UI/UX 도메인 27개 항목을 등록함.
  - v1.4.0 Changelog와 검증 기준을 추가함.
  - 실제 확인한 제약(Undo +1 페널티, 커스텀 이미지 10MB·512px, 일일 챌린지 4x4, 콤보 0.6초·최대 8콤보 등)을 반영함.
- **검증**:
  - 소스 대조: `src/App.tsx`, `src/hooks/usePuzzleGame.ts`, `src/utils/*`, `src/components/*` 확인.
  - 문서 정합성: FEATURES.md의 표·경로·버전 표기 확인.
  - 실행 검증: TASK-PM-03의 `npm test` 104/104 PASS 및 `npm run build` 성공 결과를 근거로 사용.
- **증거**: `root/FEATURES.md`

---

## TASK-PM-03 — Node.js 검증 환경 연결 및 테스트·빌드 실측

- **Phase**: 01
- **담당**: PM
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: WebStorm 번들 Node.js를 사용해 테스트·타입 검사·프로덕션 빌드를 실행하고, 실제 결과를 문서에 반영한다.
- **완료 기준(DoD)**:
  - Node.js/npm 버전 확인
  - `npm test` 전체 PASS 및 케이스 수 확인
  - `npm run build` 성공 확인
  - README 테스트 수치와 AGENTS.md 환경 요약을 실제 결과로 갱신
- **진행 결과**:
  - Node.js v26.13.0, npm 12.2.2 확인. PATH에는 미등록이라 전체 경로로 실행함.
  - `npm test` 1차 실행: Node 26의 `localStorage` 미초기화로 7개 파일/23개 테스트 실패. 제품 결함이 아닌 실행 환경 호환 문제로 판단함.
  - `NODE_OPTIONS=--localstorage-file=<임시 파일>` 지정 후 재실행: 14개 파일/104개 테스트 전건 PASS.
  - `npm run build`: tsc 0 Errors, Vite 6.4.3 프로덕션 빌드 성공. `dist/sw.js`, `dist/manifest.webmanifest`, `dist/assets/sprites/sheet_ui_fx.css` 생성 확인.
  - Vite가 `./assets/sprites/sheet_ui_fx.css`를 빌드 시점에 찾지 못한다는 경고 1건을 출력했으나, public 정적 자산으로 dist에 복사돼 빌드 결과는 정상임.
  - README의 테스트 수치를 104/104로 갱신하고 AGENTS.md에 최근 검증 결과·Node 26 실행 조건을 기록함.
- **검증**:
  - `node --version` → v26.13.0
  - `npm --version` → 12.2.2
  - `npm test` → 14 files / 104 tests passed
  - `npm run build` → tsc 0 errors, Vite build success
  - `Test-Path dist\...` → `sw.js`, `manifest.webmanifest`, `sheet_ui_fx.css` 모두 True
- **미실행**: 실제 브라우저·모바일 실기기 수동 검증.
- **증거**: 터미널 실행 결과, `README.md`, `root/AGENTS.md`, `root/FEATURES.md`

---

## TASK-PM-04 — v1.4.0 버전 표기 정렬

- **Phase**: 01
- **담당**: PM
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: `package.json`과 `package-lock.json`의 버전을 제품 기준 v1.4.0으로 정렬한다.
- **완료 기준(DoD)**:
  - `package.json`의 `version`이 `1.4.0`
  - `package-lock.json`의 루트 및 `packages[""]` 버전이 `1.4.0`
  - 빌드·테스트 재실행 시 버전 표기 확인
- **진행 결과**:
  - `package.json`과 `package-lock.json`의 버전을 `1.4.0`으로 변경함.
  - `npm test` 출력에서 `sliding-block-puzzle@1.4.0` 확인.
  - `npm run build` 출력에서도 `sliding-block-puzzle@1.4.0` 확인.
- **검증**:
  - `npm test` → 104/104 PASS
  - `npm run build` → 성공
- **증거**: `package.json`, `package-lock.json`

---

## TASK-QA-07 — v1.4.0 전면 품질·성능·안정성 검토 및 DEV 개선 업무 발주

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P1
- **완료일**: 2026-11-08
- **검토 대상**: 현재 working tree (main 최신 커밋 `995227d` + TASK-PM-01~04 문서 변경), `package.json` v1.4.0, `dist` 프로덕션 빌드
- **목표**: v1.4.0 구현 전체를 기능·버그·성능·안정성·접근성·PWA·배포 관점에서 검토하고, 수정·개선 항목을 근거와 함께 DEV 업무로 발주한다.
- **완료 기준(DoD)**:
  - 검토 범위 전 항목의 확인 방법·결과·미실행 범위 기록
  - `npm test`, `npx tsc --noEmit`, `npm run build`, `npm audit` 결과 기록
  - 데스크톱·360px 모바일 뷰포트 핵심 플로우 확인
  - 결함·개선 항목 P0/P1/P2 분류 및 재현·기대·실제·영향 파일·증거 정리
  - `TASK-DEV-14` 이후 DEV 업무 등록 및 메타데이터 명시
  - 비즈니스 로직 미수정, 완료 원문 보관 및 TASKS.md 요약 전환

### 1. 진행 결과 요약

- 자동 검증: Vitest 14개 파일/104개 케이스 PASS, `tsc --noEmit` 0 Errors, Vite 6.4.3 프로덕션 빌드 성공.
- 보안 감사: `npm audit --omit=dev` 0건. 전체 감사는 moderate 2건·high 4건(모두 dev 도구 체인)이며 수정 버전이 제공됨.
- 브라우저 검증: OpenCode 데스크톱 패널(564×1245), 1280×800 iframe, 360×800 iframe에서 타이틀·테마·게임·모달·PWA·서브패스 배포를 확인함.
- 핵심 플로우: 3×3 실제 승리(25수/4초/3성/신기록/업적 3종), 4×4 Move Limit 80수 게임오버, 3×3 Time Attack 45초 게임오버, 일일 챌린지 시드 재현, 결과 카드 1000×1000 PNG 생성, 리플레이 재생·일시정지·리셋을 확인함.
- 발견 분류: **P0 0건 / P1 2건 / P2 17건(DEV 발주) + P2 5건(보고만)**.
- 발주: `TASK-DEV-14`~`TASK-DEV-24` 11건, `TASK-QA-08` 1건.
- QA는 제품 코드·설정·문서(거버넌스)를 수정하지 않았고, TASKS.md와 본 보관 기록만 갱신함.

### 2. 검토 범위 체크리스트

| 검토 범위 | 결과 | 확인 방법·근거 |
| :--- | :--- | :--- |
| 코어 퍼즐: 셔플·가분성·이동·멀티 타일·승리/게임오버·Undo | 통과 | 104개 자동 테스트, 4×4에서 2칸 멀티 타일 이동·Undo 실측, 3×3 BFS 승리 |
| 게임 모드: Standard/Time Attack/Move Limit | 대부분 통과 | 3×3 TA 45초 게임오버, 4×4 Move Limit 80수 게임오버, 모드별 제한값 표기 확인. 타이머 정확성 결함 F-01 |
| AI 힌트: 3×3/4×4/5×5 정확도·응답·Worker·레이스·쿨다운 | 부분 통과 | 4×4 103ms(캐시 26ms), 5×5 368ms, 자동 solver 완주 테스트. 레이스 F-05, 실패 처리 F-06 |
| 테마·커스텀 이미지: 4종·숫자 모드·크롭·용량 | 부분 통과 | 테마 전환·숫자/이미지 모드·업로드·적용 확인. 테마 모달 열기 시 삭제 F-03, 드래그 미동작 F-04 |
| 일일 챌린지·업적·별점·기록: 시드·스트릭·중복·신기록 | 부분 통과 | 일일 보드 2회 동일 시드 확인, 3성·신기록·업적 3종·기록 영속 확인. 다중 토스트 F-17 |
| 오디오: BGM 4트랙·SFX·테마 음색·콤보·음소거·자동재생 | 부분 통과 | UI 상태·localStorage·자동 테스트 확인. 실제 음성 출력·모바일 자동재생 정책은 미실행 |
| 기록·공유: 최고 기록·Canvas·Web Share/클립보드/다운로드 | 통과 | 최고 기록 영속, 리플레이, 1000×1000 PNG 다운로드 폴백 확인. 클립보드 권한은 미실행 |
| PWA·모바일: 캐싱·업데이트·설치·360px·Safe Area·햅틱 | 부분 통과 | SW 캐시 36개 항목·controller 활성·서브패스 scope 확인. 매니페스트 아이콘 F-14, 502 폴백 F-15 |
| i18n: KO/EN/JA/ZH 누락·깨짐·전환 | 실패 | 언어 전환·영속은 통과. 업적·테마·BGM·일일·힌트·공유 카드 한국어 잔존 F-02 |
| 성능: 60fps·리렌더·번들·에셋·메모리 | 부분 통과 | JS 329.20kB(gzip 103.26), CSS 68.24kB(gzip 11.18). 단기 trace 장시간 작업 0건. 에셋 20.45MB F-16 |
| 접근성·UX: 키보드·ARIA·포커스·Escape·대비·에러 | 실패 | Lighthouse 0.79/0.89, 포커스 트랩·키보드 충돌·ARIA·대비 F-07~F-11 |
| 보안·의존성: audit·외부 폰트·LocalStorage·XSS | 대부분 통과 | prod audit 0, `dangerouslySetInnerHTML`/`eval`/`innerHTML` 미사용. dev 취약점 F-19, LocalStorage 방어 F-18 |
| 코드 품질·테스트 공백 | 부분 통과 | strict tsc 0, 핵심 로직 테스트 충실. 컴포넌트·PWA·E2E 공백 F-19 및 보고만 항목 |
| 빌드·배포: test·tsc·build·SW 캐시 경로 | 통과 | 빌드 성공, `base: './'` 서브패스 `/sub/`에서 앱·SW scope·캐시 경로 정상. CI 부재 F-19 |

### 3. 자동 검증 결과

| 명령 | 환경 | 결과 |
| :--- | :--- | :--- |
| `npm test` | Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>` | **14 files / 104 tests PASS**, 실패 0·대기 0, exit 0 |
| `npm test` (환경 변수 없음) | Node.js 26.13.0 | localStorage 미초기화 경고와 함께 실패. 알려진 실행 환경 문제이며 제품 결함 아님 |
| `npx tsc --noEmit` | Node.js 26.13.0 | **0 Errors**, exit 0 |
| `npm run build` | Node.js 26.13.0 | **성공**, Vite 6.4.3, exit 0 |
| `npm audit --json` | npm 12.2.2 | 전체 6건(moderate 2·high 4), 모두 dev 도구 체인. `--omit=dev` 0건 |
| `npm outdated --json` | npm 12.2.2 | react 19.2.8→19.3.1, vite 6.4.3→8.3.6 등 주요 갱신 후보 확인 |
| `dist` 용량 | 빌드 산출물 | 총 20.45MB: audio 13.83MB, sprites 2.63MB, images 2.62MB, icons 0.98MB |

- 빌드 산출물: `dist/assets/index-Nsd-g6IP.js` 329.20kB(gzip 103.26kB), `dist/assets/index-BAR08Dhp.css` 68.24kB(gzip 11.18kB), `dist/assets/solver.worker-DT22KFGs.js` 9.09kB.
- Vite의 `sheet_ui_fx.css` 빌드 시점 경고는 기존과 동일하게 1건 발생했으나, 프로덕션에서 HTTP 200으로 로드되고 SW 캐시에도 포함됨을 확인함(제품 결함 아님).
- `npm audit` 상세: sharp(<0.35.5), vite(<=6.4.3), vitest(2.1.0-beta.1~4.1.10), undici(8.0.0~8.12.1), source-map-js(1.0.0~1.2.1). 모두 `fixAvailable: true`.

### 4. 브라우저 검증 환경과 플로우

| 환경 | 방법 | 확인 내용 |
| :--- | :--- | :--- |
| 데스크톱 패널 | OpenCode 브라우저 564×1245 | 타이틀·테마 모달·게임·모든 모달·리플레이·공유 |
| 데스크톱 1280×800 | 동일 앱을 1280×800 iframe으로 로드 | 타이틀 2열·가로 오버플로 없음, 게임 4열 툴바. 게임 `scrollHeight` 959px |
| 모바일 360×800 | 동일 앱을 360×800 iframe으로 로드(내부 356×796) | 타이틀 상단 바 클리핑, 게임 `bodyScrollHeight` 925px·보드 하단 812px |
| 프로덕션 빌드 | `vite preview` 4173, `dist` | 3×3 실제 승리, Auto Clear 버튼 미노출, PWA 캐시·매니페스트 |
| 개발 빌드 | Vite dev 5174 | 리플레이·결과 카드 공유·업적 토스트·다중 달성 확인 |
| 서브패스 배포 | `dist`를 `/sub/` 경로로 정적 서빙(4180) | 앱 로드, SW scope `/sub/`, 캐시 URL `/sub/...` 확인 |

- 3×3 승리: BFS로 25수 경로를 생성해 실제 클릭으로 완료. 4초·3성·신기록·`first_victory`/`speed_demon`/`purist_no_undo` 달성.
- 4×4 Move Limit: 80수 소진 후 게임오버 모달, "정답 보기"로 정답 보드 복귀 확인.
- 3×3 Time Attack: 45초 경과 후 게임오버 모달 확인.
- 일일 챌린지: 같은 날짜에 두 번 시작해 동일 보드 `[13,3,4,1,9,8,2,12,11,7,10,6,0,5,15,14]` 재현.
- 멀티 타일·Undo: 4×4에서 빈 칸과 2칸 떨어진 타일 클릭 시 2개 타일 연쇄 이동, Undo 1회로 복구, 이동 수 +1 페널티 확인.
- AI 힌트: 4×4 첫 응답 103ms·캐시 경로 26ms, 5×5 368ms. 오버레이 타일·방향 표시 확인.
- 결과 카드: Web Share 미지원 환경에서 다운로드 폴백, PNG 1000×1000·1,082,512바이트 확인.
- PWA: SW active·controller true, 캐시 36개 항목, 매니페스트 파싱, 서브패스 캐시 경로 확인.
- Lighthouse: 게임 화면 접근성 0.79·Best Practices 1.0·SEO 0.83, 타이틀 접근성 0.89·Best Practices 1.0·SEO 0.83.

### 5. 발견 항목 및 발주

#### 5.1 P1

| ID | 항목 | 재현·실제 결과 | 기대 결과 | 영향 파일 | 발주 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F-01 | Time Attack·기록 타이머가 틱 누적 방식 | 3×3 TA 00:44에서 메인 스레드 5.017초 블로킹 후 00:43(1초만 감소) | 실제 경과 5초 반영으로 00:39, 백그라운드·절전에도 동일 | `src/hooks/usePuzzleGame.ts` | TASK-DEV-14 |
| F-02 | 4개 국어 잔여 하드코딩·`html lang` 미동기화 | EN 전환 후 업적 12종·테마 4종·BGM 설명·일일 모달·힌트 모달·공유 카드에 한국어, 단위 `일/회/초`, `html lang=ko` | EN/JA/ZH에서 사용자 노출 한국어 0건, 문서 언어 동기화 | `translations.ts`, `components/**`, `themeData.ts`, `achievementData.ts`, `audioManager.ts`, `shareCardGenerator.ts`, `index.html` | TASK-DEV-15 |

#### 5.2 P2

| ID | 항목 | 재현·실제 결과 | 기대 결과 | 영향 파일 | 발주 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| F-03 | 테마 모달 열기만으로 커스텀 이미지 삭제 | 저장 728,626바이트 → 모달 열기 직후 0바이트, 보드가 이전 테마로 복귀 | 테마 확정/변경 시에만 제거 | `src/App.tsx` | TASK-DEV-16 |
| F-04 | 커스텀 이미지 드래그 미동작·검증 부재 | 문구는 드래그 안내, `onDrop` 없음. 10MB 초과 alert 한국어, quota 실패 무시, MIME 검증 없음 | 드래그 구현 또는 문구 수정, 형식·용량·quota 피드백 | `CustomImageModal.tsx` | TASK-DEV-16 |
| F-05 | AI 힌트 레이스 컨디션 | 5×5 힌트 요청 8ms 후 이동, 368ms 뒤 이전 보드 기준 힌트 표시 | 보드 변경 시 요청 무효화·힌트 미표시 | `App.tsx`, `solver.worker.ts`, `aiSolver.ts` | TASK-DEV-17 |
| F-06 | AI Worker 실패·힌트 없음 무피드백 | `onerror`/timeout 없음, `null` 결과 시 안내 없이 3초 쿨다운 | 오류·시간 초과·힌트 없음 안내와 상태 해제 | `App.tsx`, `solver.worker.ts` | TASK-DEV-17 |
| F-07 | 모달 포커스 트랩 부재 | 테마 모달에서 Tab 12회 모두 배경 툴바 버튼으로 이동 | 모달 내부 포커스 순환·복원, 배경 inert | `components/Modal/**`, `App.tsx` | TASK-DEV-18 |
| F-08 | 전역 키보드 핸들러가 모달·select 입력 가로챔 | 모달 중 ArrowUp으로 보드 이동(4→5), 언어 select에서 ArrowDown 시 언어 `ko` 유지·보드 이동(1→2) | 모달·폼 컨트롤 입력 우선, 보드 키 입력 차단 | `PuzzleBoard.tsx` | TASK-DEV-18 |
| F-09 | ARIA 구조·랜드마크·중첩 인터랙티브 | Lighthouse `role=grid`에 `row` 없음, 타이틀 `main` 없음, 모드 카드 내부 버튼 중첩, 접근성 0.79/0.89 | 유효한 ARIA 구조·랜드마크·중첩 제거 | `PuzzleBoard.tsx`, `TitleScreen.tsx`, `Controls.tsx` | TASK-DEV-19 |
| F-10 | 색 대비 미달 | 툴바 2.36/1.81, 크기 pill 3.97 (AA 4.5:1 기준) | WCAG AA 충족 | `Controls.css`, `TitleScreen.css` 등 | TASK-DEV-19 |
| F-11 | 확대 금지 viewport | `maximum-scale=1.0, user-scalable=no` | 확대 허용(`maximum-scale>=5`) | `index.html` | TASK-DEV-19 |
| F-12 | 360px 타이틀 상단 바 클리핑 | 콘텐츠 392px > 컨테이너 337px, 배지 53×81·51×81 세로 줄바꿈, 오디오 컨트롤 우측 잘림 | 360px에서 배지·오디오 컨트롤 판독·조작 가능 | `TitleScreen.css` | TASK-DEV-20 |
| F-13 | 1화면 레이아웃 미충족 | 360×800 게임 925px·보드 하단 812px, 1280×800 게임 959px | 360×800·1280×800에서 핵심 플레이 화면 스크롤 없이 표시 또는 문구 조정 | `App.css`, `Header.css`, `PuzzleBoard.css` | TASK-DEV-20 |
| F-14 | PWA 매니페스트 아이콘 크기 불일치 | 192/512 선언, 실제 224×197, maskable·apple-touch 없음 | 192·512 정사각형·maskable·apple-touch 아이콘 | `manifest.webmanifest`, `public/assets/icons/**` | TASK-DEV-21 |
| F-15 | SW 502 미폴백·업데이트 즉시 새로고침 위험 | 서버 중단 시 502 페이지 반환, `controllerchange`에서 무조건 reload, `cache.addAll` 원자적 실패 | `!response.ok` 캐시 폴백, 안전한 업데이트, 자산별 캐시 | `public/sw.js`, `src/main.tsx` | TASK-DEV-21 |
| F-16 | 오디오·이미지 에셋 과다 | dist 20.45MB(오디오 13.83MB WAV), 초기 decodedBodySize 9.9MB, SW가 BGM 4트랙 전체 프리캐시 | 압축 포맷·현재 테마/BGM 지연 로드·프리캐시 축소 | `assets/audio/**`, `assetPreloader.ts`, `audioManager.ts`, `sw.js` | TASK-DEV-22 |
| F-17 | 다중 업적 토스트 중 마지막 1건만 표시 | 3건 동시 달성, 토스트는 `purist_no_undo` 1건만 표시. 저장 업적 병합이 최신 정의를 덮어씀 | 모두 순차/통합 표시, 정적 메타데이터는 최신 유지 | `AchievementToast.tsx`, `achievementManager.ts` | TASK-DEV-23 |
| F-18 | LocalStorage 접근·스키마 방어 부족 | 초기화 경로에 try/catch 없는 `getItem`, 스트릭·기록·업적 JSON 스키마 검증 없음 | 저장소 차단·손상 JSON에서도 기본값으로 렌더 | `useTranslation.ts`, `App.tsx`, `utils/*` | TASK-DEV-24 |
| F-19 | CI·Node 요구사항·테스트 환경·dev 의존성 | `.github` 없음, README Node 18+ vs Vitest 20+/jsdom 22.22+, Node 26 테스트 플래그 필요, dev 취약점 6건, E2E·robots·배포 절차 없음 | CI 자동화·요구사항 정합화·무설정 테스트·의존성 정리·E2E·배포 문서 | `package.json`, CI, 문서 | TASK-QA-08 |

### 6. 주요 증거 상세

- **F-01 타이머**: 3×3 Time Attack에서 `00:44` 확인 → `performance.now()+5000` 동안 메인 스레드 점유 → 5.017초 후 `00:43` 확인. `setInterval` 콜백이 지연된 동안 `elapsedTime`이 1만 증가해 제한 시간이 실제보다 길어짐.
- **F-02 i18n**: EN 전환 후 DOM에서 업적 12종 설명, 테마 4종 이름·설명, BGM 장르·설명, `년/월/일/완료`, `완성본 미리보기`, `25회`, 테마명이 한국어로 남음. `document.documentElement.lang`은 `ko`. 언어 선택값은 `localStorage`에 `en`으로 저장되고 새로고침 후에도 유지됨.
- **F-03 커스텀 이미지**: `sliding_puzzle_custom_image` 728,626바이트 저장 확인 → 테마 모달 열기 직후 0바이트, 보드 배경이 `theme_pixel_art.png`로 복귀. 모달을 닫아도 복구되지 않음.
- **F-04 드래그**: 모달 문구의 드롭 영역에 이미지 파일을 드롭했으나 파일 선택·캔버스 로드가 발생하지 않음. 코드에 `onDrop`/`onDragOver` 없음.
- **F-05 AI 레이스**: 5×5 힌트 요청 후 8ms에 타일 9를 이동, 368ms에 타일 5 `↓` 오버레이 표시. 힌트는 이동 전 보드 기준.
- **F-07/F-08 포커스·키보드**: 테마 모달 열린 상태에서 Tab 12회 모두 `.theme-modal-content` 밖. ArrowUp으로 이동 수 4→5. `.lang-select` 포커스에서 ArrowDown 시 `ko` 유지·이동 수 1→2.
- **F-09/F-10/F-11 Lighthouse**: 게임 접근성 0.79, 타이틀 0.89. `aria-required-children`/`aria-required-parent`(gridcell에 row 없음), `color-contrast`, `meta-viewport`, `landmark-one-main`(타이틀) 실패.
- **F-12/F-13 모바일**: 360×800에서 타이틀 상단 바 `scrollWidth 392 > 337`, 배지 53×81·51×81, 오디오 컨트롤 x=227·width=171로 뷰포트 356 초과. 게임 `bodyScrollHeight 925`, 보드 하단 812 > 796. 1280×800 게임 `scrollHeight 959`.
- **F-14 PWA**: 매니페스트 선언 192×192·512×512, 실제 `badge_trophy.png` 224×197. `purpose` 없음, apple-touch-icon 없음.
- **F-15 SW**: 컨트롤러 활성·캐시 36개 항목 확인. 서버 중단 후 reload는 502 페이지를 표시(SW network-first가 응답 코드를 검사하지 않음). `controllerchange` 리로드 경로는 코드 확인.
- **F-16 에셋**: BGM WAV 2.01/3.41/3.48/4.15MB, 스프라이트 1.20/1.15MB, 테마 이미지 0.62~0.92MB. 초기 리소스 46건 decoded 9.9MB.
- **F-17 업적**: 3×3 승리에서 3건 잠금 해제, 토스트 1건. `checkGameCompletionAchievements`는 3건을 반환하지만 `AchievementToast`가 단일 `current` 상태만 유지.
- **F-18 LocalStorage**: `getInitialLanguage`와 `App` 커스텀 이미지 초기화가 try/catch 없이 `getItem` 호출. 일일 데이터는 `completedDates` 필드 누락 시 `.includes` 예외 가능.
- **F-19 CI/환경**: `.github` 파일 없음. Vitest 4.1.10 engines `^20 || ^22 || >=24`, jsdom 30 engines `^22.22.2 || ^24.15 || >=26`, README/AGENTS는 Node 18+. `npm test`는 Node 26에서 `--localstorage-file` 없이 실패.

### 7. 보고만 한 항목 (P2, 발주 제외)

- **R-01 일일 챌린지 플래그 잔존**: 일일 승리 후 "다시 플레이"로 시작한 랜덤 게임에서 `isDailyGameActive`가 유지되어, 이후 승리가 일일 완료로 기록될 수 있음. `startNewGame`에서 플래그를 초기화하는 보완 권장.
- **R-02 공유 카드 이미지 로드 타임아웃 없음**: 테마 이미지 로드가 지연되면 `generateShareCardBlob`의 Promise가 무기한 대기할 수 있음. 타임아웃·폴백 권장.
- **R-03 PM 문서 정합성**: README/AGENTS의 Node 18+ 안내가 실제 의존성 요구(Vitest 20+, jsdom 22.22+)와 불일치. README의 React 19.0.0/Vite 6.2.0 표기도 설치본 19.2.8/6.4.3과 다름. PM이 DEV/DevOps 결과와 함께 갱신 필요.
- **R-04 코드 품질 정리**: `TitleScreen`의 `currentTheme`/`onSelectTheme`, `Controls`의 `onSelectGridSize`/`onSelectChallengeMode` 미사용, `App.tsx`의 `dir: any`, `findNextOptimalMove`의 `firstMove` 미사용, `Header`/`TitleScreen`의 매 렌더 localStorage 읽기, Error Boundary 부재.
- **R-05 외부 폰트 의존**: `index.html`이 Google Fonts를 로드해 최초 오프라인·폐쇄망에서 폰트가 대체됨. SRI·로컬 번들·오프라인 폴백 정책 검토 권장.

### 8. 미실행·제한 사항

- 실제 모바일 실기기(iOS Safari·Android Chrome)와 햅틱·Safe Area·Pull-to-refresh 물리 동작은 미실행. 360×800은 iframe 뷰포트로 근사함.
- 완전 오프라인 네트워크 전환은 브라우저 도구 제약으로 직접 재현하지 못함. SW 캐시·scope는 확인했고, 서버 중단 시 502 응답 경로만 확인함.
- BGM·SFX의 실제 가청 출력과 모바일 자동재생 정책은 미확인. UI 상태·localStorage·단위 테스트로 대체함.
- Web Share API 실제 공유 시트와 클립보드 복사 권한은 미확인. 파일 다운로드 폴백(1000×1000 PNG)은 확인함.
- `beforeinstallprompt` 설치 배너의 실제 노출·설치 플로우는 미확인. 매니페스트·SW 캐시·서브패스 scope만 확인함.
- 일일 챌린지 4×4 실제 완주·스트릭 증가와 5×5 실제 완주는 브라우저에서 수행하지 않음. 일일 시드 재현, solver 완주 자동 테스트, 코드 검토로 대체함.
- Lighthouse는 성능 점수를 산출하지 않았고, trace는 짧은 구간만 기록해 장시간 성능을 대표하지 않음.
- 백그라운드 탭 스로틀링 자체는 환경상 직접 재현하지 못했고, 메인 스레드 5초 블로킹으로 동일한 틱 누적 결함을 재현함.

### 9. PM 전달 사항

- README/AGENTS Node.js 요구사항을 실제 의존성(Vitest 4·jsdom 30)과 맞춰 Node 24 LTS 이상으로 정리 필요.
- README 기술 스택 버전(React 19.0.0, Vite 6.2.0)과 lockfile 설치본(19.2.8, 6.4.3) 차이 갱신 검토.
- FEATURES.md의 "1화면 레이아웃", "4개 국어 전역 반영", "PWA 설치", "드래그 업로드" 문구는 TASK-DEV-15·16·20·21 완료 후 실제 동작과 일치하도록 갱신 필요.
- 배포 절차(정적 호스팅·서브패스·SW 캐시 갱신·롤백)와 `robots.txt` 부재는 TASK-QA-08에서 문서·설정으로 보완 예정.
- QA는 위 문서를 직접 수정하지 않았고, 본 보고서에 전달 사항으로만 기록함.

### 10. DoD 확인

- [x] 검토 범위 전 항목을 실제로 확인하고, 확인 방법·결과·미실행 범위를 기록했다.
- [x] `npm test`(Node 26 조건 포함), `npx tsc --noEmit`, `npm run build`, `npm audit` 결과를 기록했다.
- [x] 실제 브라우저에서 데스크톱(564×1245·1280×800)과 360×800 모바일 뷰포트의 핵심 플로우를 확인했다.
- [x] 발견한 결함·개선 항목을 P0/P1/P2로 분류하고, 재현·기대·실제·영향 파일·증거를 정리했다.
- [x] 수정·개선이 필요한 항목을 `TASK-DEV-14` 이후 ID로 TASKS.md DEV Backlog에 등록했다.
- [x] 각 DEV 업무에 Phase·담당·우선순위·목표·대상 파일·선행 조건·DoD·재현/증거를 명시했다.
- [x] QA가 비즈니스 로직을 직접 수정하지 않았다.
- [x] 완료 원문을 `root/archive/TASKS_PHASE_01.md`에 보관하고 TASKS.md를 요약으로 전환했다.

### 11. 증거 경로

- **소스·설정**: `src/**`, `public/sw.js`, `public/manifest.webmanifest`, `index.html`, `vite.config.ts`, `package.json`, `package-lock.json`, `tsconfig.json`
- **자동 검증 산출물**: Vitest JSON `C:\Users\parkt\AppData\Local\Temp\opencode\qa07-vitest-pass.json`, 빌드 로그·`dist/**`
- **브라우저 캡처(세션 임시 경로)**:
  - 360×800 타이틀: `C:\Users\parkt\AppData\Local\Temp\opencode-browser-vVqUj6\0\screenshot.png`
  - 360×800 게임: `C:\Users\parkt\AppData\Local\Temp\opencode-browser-C2tycP\0\screenshot.png`
  - 1280×800 게임(패널 캡처): `C:\Users\parkt\AppData\Local\Temp\opencode-browser-7chIUX\0\screenshot.png`
  - 결과 카드 PNG: `C:\Users\parkt\AppData\Local\Temp\opencode-browser-v6uzZX\0\sliding-puzzle-victory.png`
- **Lighthouse JSON(세션 임시 경로)**:
  - 게임 화면: `C:\Users\parkt\AppData\Local\Temp\opencode-browser-eNKLX2\0\lighthouse.json`
  - 타이틀 화면: `C:\Users\parkt\AppData\Local\Temp\opencode-browser-njk06s\0\lighthouse.json`
- 본 보관 기록과 `root/TASKS.md`의 DEV/QA 발주 항목

---

## TASK-DEV-14 — Time Attack·기록 타이머를 벽시계 기준으로 보정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: `setInterval` 틱 누적 방식 대신 시작 시각 기반 경과 시간으로 계산해, 탭 스로틀링·메인 스레드 블로킹·절전 후에도 제한 시간과 기록이 실제 경과 시간과 일치하게 한다.
- **완료 기준(DoD)**:
  - 모든 모드의 `elapsedTime`을 시작·재개 시각 기반으로 계산
  - Time Attack 만료, 최고 기록·별점·업적 입력이 동일한 시간 기준을 사용
  - 시간 점프·메인 스레드 지연·탭 복귀 시나리오 테스트 추가
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS

### 진행 결과

- `usePuzzleGame`에 `timerStartedAtRef`와 `getElapsedSeconds()`를 추가하고 `Date.now()` 기준 실제 경과 초를 계산하도록 변경함.
- 게임 시작(`startNewGame`, `startSeededGame`, `changeGridSize`)과 idle 첫 이동에서 시작 시각을 기록하고, `resetGame`에서 타이머를 정지함.
- 타이머 Effect를 250ms 주기로 조정하고 `visibilitychange` 리스너를 추가해 탭 복귀·절전 해제 시 즉시 경과 시간을 보정하도록 함.
- Time Attack 만료 판정을 실제 경과 시간 기준으로 변경함.
- 승리 수와 Move Limit 게임오버 시점에 마지막 틱 이후 경과분을 `elapsedTime`에 반영해 기록·별점·업적이 같은 시간 값을 사용하게 함.
- 게임 종료(승리·Time Attack 만료·Move Limit 게임오버·자동 클리어) 시 시작 시각을 해제해 늦게 도착한 틱이 종료 후 기록을 덮어쓰지 않게 함.
- `App.tsx`는 별도 타이머 없이 Hook의 `elapsedTime`을 최고 기록·별점·업적에 전달하는 구조임을 확인함(코드 변경 없음).
- `usePuzzleGame.test.ts`에 메인 스레드 지연, Time Attack 만료, 탭 복귀, 승리 시각 기록, 리셋 후 재시작 시나리오 5건을 추가함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 3×3 Time Attack 시작 후 메인 스레드 5초 블로킹 전후 타이머 확인
- **결과**:
  - `npm test`: 14개 파일/109개 테스트 PASS(신규 5건 포함). 최초 전체 실행에서 `recordStorage.test.ts`의 `localStorage.clear()`가 `database is locked`로 1건 실패했으나, 새 임시 `--localstorage-file`로 재실행해 109/109 PASS를 확인함. 제품 코드가 아닌 Node 26 localStorage 파일 공유 환경 문제로 판단함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저(최종 리비전): 3×3 Time Attack에서 타이머 `00:45` 확인 → 메인 스레드 5초 블로킹 → `00:40`으로 5초 감소. 수정 전 QA 재현(`00:44`에서 5.017초 블로킹 후 `00:43`)과 달리 실제 경과 시간을 반영함.
  - 탭 복귀 보정은 `visibilitychange` 이벤트 단위 테스트로 확인함.
- **미실행**: 실제 백그라운드 탭 장시간 방치, 기기 절전, OS 시계 변경은 직접 재현하지 않음. 단위 테스트의 시스템 시각 점프와 `visibilitychange` 시뮬레이션으로 대체함.
- **증거**: `src/hooks/usePuzzleGame.ts`, `src/hooks/usePuzzleGame.test.ts`, `src/App.tsx`, 터미널 실행 결과, 브라우저 127.0.0.1:5173 확인 결과
- **PM 전달**: `README.md`, `root/AGENTS.md`의 테스트 수치가 104건으로 남아 있어 109건으로 갱신 필요.

---

## TASK-DEV-15 — KO/EN/JA/ZH 잔여 하드코딩 문자열 및 `html lang` 정리

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: 언어 전환 시 사용자에게 노출되는 모든 텍스트와 메타데이터를 4개 언어로 제공하고, 문서 언어(`html lang`)를 선택 언어와 동기화한다.
- **완료 기준(DoD)**:
  - EN/JA/ZH에서 사용자 노출 한국어 하드코딩 0건(모달·업적·테마·BGM·단위·공유 카드 포함)
  - 테마·업적·BGM 메타데이터와 공유 카드 문자열을 번역 키로 이관
  - 언어 변경 시 `document.documentElement.lang` 갱신
  - 4개 언어 키 누락·빈 문자열 검사 테스트 보강
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS

### 진행 결과

- `translations.ts`에 테마 4종·업적 12종·BGM 4트랙 메타데이터, 일일 캘린더, 공유 카드, 단위, 접근성 라벨, 템플릿 문구를 4개 언어로 추가함.
- `ThemeDefinition`·`Achievement`·`BgmTrack`이 번역 키(`nameKey`, `titleKey`, `genreKey` 등)를 보관하고, 표시 시점에 현재 언어로 해석하도록 변경함.
- `themeData`에 `localizeTheme`·`getLocalizedTheme`를 추가하고 App·ThemeModal·HintModal·WinModal이 현재 언어의 테마명·설명을 사용하게 함.
- `achievementManager`가 저장 데이터 병합 시 최신 정적 메타데이터를 유지하고 `unlockedAt`·`progress`만 저장값을 사용하게 함(F-17 메타데이터 덮어쓰기 일부 선반영).
- `TitleScreen`, `Header`, `Controls`, `Tile`, `PuzzleBoard`, `WinModal`, `GameOverModal`, `HintModal`, `ThemeModal`, `AchievementModal`, `AchievementToast`, `BgmSelectModal`, `DailyModal`, `CustomImageModal`, `PwaInstallBanner`의 하드코딩 문자열·`alt`·`aria-label`을 번역 키로 이관함.
- 공유 카드 Canvas 문구와 Web Share·클립보드·다운로드 알림을 현재 언어로 생성하도록 변경함.
- `useTranslation`에 `getCurrentLanguage`·`setGlobalLanguage`를 추가하고 초기화·언어 변경 시 `document.documentElement.lang`를 동기화함. `index.html`에 저장 언어 기반 초기 `lang` 보정 스크립트를 추가함.
- `formatMessage` 템플릿 헬퍼를 추가하고 `starCalculator`의 미사용 한국어 `summary`를 제거함.
- `i18n.test.ts`에 4개 언어 키 집합 일치·빈 문자열·EN/JA/ZH Hangul 금지·`html lang` 동기화·템플릿 치환 검증을 추가함.
- `App.test.tsx`에 EN 테마·업적 메타데이터 검증, `BgmSelectModal.test.tsx`·`DailyModal.test.tsx`에 EN 메타데이터 검증을 추가함.
- `README.md`, `root/AGENTS.md`의 테스트 수치를 15개 파일/115건으로 동기화해 이전 TASK-DEV-14의 PM 전달 사항을 해소함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker 캐시를 제거한 뒤 EN/JA/ZH 전환 및 전 화면 스캔
- **결과**:
  - `npm test`: 15개 파일/115개 테스트 PASS(신규 i18n·DailyModal·BGM EN 테스트 포함). 최초 전체 실행에서 `achievementManager.test.ts`의 `localStorage.clear()`가 `database is locked`로 1건 실패했으나, 새 임시 `--localstorage-file` 재실행에서 115/115 PASS. `--no-file-parallelism` 실행에서도 115/115 PASS. 제품 코드가 아닌 Node 26 localStorage 파일 공유 환경 문제로 판단함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저 EN: 타이틀·테마·게임·업적·일일·BGM·힌트·승리 모달의 `innerText`와 `aria-label`/`title`/`alt`에서 Hangul 0건. `document.documentElement.lang=en`. 공유 카드 PNG에서 `TOTAL MOVES`, `16 moves`, `Difficulty`, `Theme: Nature & Scenery` 등 영문 표시 확인.
  - 브라우저 JA: 게임·테마·업적에서 Hangul 0건, `html lang=ja`.
  - 브라우저 ZH: 게임·테마·업적·BGM·일일에서 Hangul 0건, `html lang=zh`.
  - 언어 선택 옵션도 현재 UI 언어로 표시해 EN/JA/ZH DOM에 `한국어`가 남지 않도록 함.
- **미실행**: 실제 모바일 실기기(iOS Safari·Android Chrome), OS·브라우저 언어 자동 감지, PWA manifest의 다국어화는 수행하지 않음. 데스크톱 Chromium 뷰포트에서만 확인함.
- **증거**: `src/i18n/translations.ts`, `src/i18n/useTranslation.ts`, `src/i18n/format.ts`, `src/i18n/i18n.test.ts`, `src/utils/themeData.ts`, `src/utils/achievementData.ts`, `src/utils/audioManager.ts`, `src/utils/shareCardGenerator.ts`, `src/components/**`, `index.html`, 터미널 실행 결과, 공유 카드 PNG `C:\Users\parkt\AppData\Local\Temp\opencode-browser-jmEu2A\0\sliding-puzzle-victory.png`

---

## TASK-DEV-16 — 커스텀 이미지 보존·드래그 앤 드롭·업로드 검증 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 테마 모달을 열기만 해도 커스텀 이미지가 삭제되는 문제를 없애고, 안내 문구와 실제 업로드 동작을 일치시키며, 용량·형식 오류를 사용자에게 알린다.
- **완료 기준(DoD)**:
  - 테마 모달 열기·닫기만으로 커스텀 이미지를 삭제하지 않고, 테마 확정/변경 시에만 제거
  - 드래그 앤 드롭 구현 또는 안내 문구 수정
  - 파일 형식·크기·quota 오류를 현재 언어로 피드백하고 실패 시 적용 상태를 명확히 표시
  - 관련 브라우저 수동 확인과 회귀 테스트 추가

### 진행 결과

- `Controls`의 테마 선택 버튼에서 커스텀 이미지를 즉시 삭제하던 동작을 제거해, 테마 모달을 열고 닫기만 해서는 저장 이미지와 현재 테마가 유지되게 함.
- `ThemeModal`에 `onModeChange`를 추가해 게임 중 이미지/숫자 모드 전환이 테마·커스텀 이미지를 삭제하지 않게 함.
- 시작 전 테마 선택은 모달 내부 선택으로만 유지하고, `이 테마로 게임 시작` 확정 시 `onSelectTheme`·`onConfirmStart`로 반영하도록 변경함. 게임 중 테마 카드 선택은 즉시 적용·모달 닫힘과 함께 커스텀 이미지를 제거함.
- `CustomImageModal`에 `onDragOver`/`onDragLeave`/`onDrop`을 구현하고 드래그 중 `.drag-active` 시각 피드백을 추가함. 드롭존에 Enter/Space 키보드 업로드도 추가함.
- 업로드 검증을 `SUPPORTED_IMAGE_TYPES`(PNG·JPEG·WebP·GIF)와 10MB 상한으로 통일하고, `alert` 대신 모달 내 `role="alert"` 메시지로 표시함.
- `localStorage.setItem` quota 실패 시 모달을 닫지 않고 적용하지 않은 상태로 오류를 표시해 실패 상태를 명확히 함. 재시도 성공 시 정상 적용됨.
- `FileReader.onerror`, `Image.onerror`, `canvas.toDataURL` 예외도 현재 언어의 로드 실패 메시지로 처리함.
- `imageUnsupportedType`·`imageStorageQuotaExceeded`·`imageLoadFailed` 번역 키를 KO/EN/JA/ZH에 추가함.
- `CustomImageModal.css`에 드래그 활성 상태와 오류 메시지 스타일을 추가하고, 드롭존 자식 요소에 `pointer-events: none`을 적용해 드래그 이벤트가 끊기지 않게 함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker 캐시 제거 후 데스크톱 Chromium으로 커스텀 이미지 드래그·적용·보존·검증 오류 확인
- **결과**:
  - `npm test`: 17개 파일/123개 테스트 PASS. 신규 `CustomImageModal.test.tsx` 6건(형식·10MB·EN 오류·드래그 활성·적용·quota)과 `App.customImage.test.tsx` 2건(모달 열기/닫기·모드 전환 보존, 테마 적용 시 제거) 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저: 테마 이미지 파일(623,798바이트)을 드롭존에 드롭해 적용했고, 저장된 data URL 809,414자 확인. 테마 모달 열기·닫기 후에도 동일 길이 유지.
  - 브라우저: 테마 모달에서 `숫자 모드`로 전환해도 저장 이미지가 유지되고, 미리보기 제목이 `완성본 미리보기: 내 사진 (Custom)`으로 표시됨.
  - 브라우저: 테마 카드 `자연 & 풍경` 적용 시 저장 이미지가 제거되고 미리보기 제목이 `완성본 미리보기: 자연 & 풍경`으로 변경됨.
  - 브라우저: 텍스트 파일 드롭 시 `지원하지 않는 이미지 형식입니다...`, 11MB 파일 드롭 시 `이미지 파일 크기는 10MB 이하만 가능합니다.` 표시. 드래그 중 `.drag-active` 적용 확인.
  - 브라우저: `Storage.prototype.setItem`을 quota 예외로 대체했을 때 `이미지를 저장할 공간이 부족해 적용하지 못했습니다...` 오류와 함께 모달이 열린 상태로 유지되고 저장소는 비어 있음. 예외 해제 후 재적용은 성공(672,186자).
  - 브라우저 콘솔 uncaught error 0건.
- **미실행**: 실제 모바일 실기기(iOS Safari·Android Chrome)와 OS별 파일 드래그, 실제 저장소 한도 소진(quota는 `Storage.prototype.setItem` 예외로 재현)은 수행하지 않음. 데스크톱 Chromium에서만 확인함.
- **증거**: `src/components/Modal/CustomImageModal.tsx`, `src/components/Modal/CustomImageModal.css`, `src/components/Modal/CustomImageModal.test.tsx`, `src/components/Modal/ThemeModal.tsx`, `src/App.tsx`, `src/App.customImage.test.tsx`, `src/i18n/translations.ts`, 터미널 실행 결과, 브라우저 확인 결과
