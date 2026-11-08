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

---

## TASK-DEV-17 — AI 힌트 레이스 컨디션·Worker 실패 처리

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 힌트 계산 중 보드가 바뀌면 이전 보드 기준 결과를 표시하지 않고, Worker 오류·시간 초과·힌트 없음 상태를 사용자에게 알린다.
- **완료 기준(DoD)**:
  - 보드 변경·새 게임·그리드 변경 시 진행 중 요청을 무효화(요청 ID 또는 보드 해시 검증)
  - Worker 오류·시간 초과·힌트 없음 시 계산 상태 해제와 사용자 안내
  - 레이스 컨디션·실패 경로 테스트 추가
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS

### 진행 결과

- 힌트 요청마다 단조 증가하는 `requestSequenceRef` ID를 부여하고 `latestRequestIdRef`·`pendingRequestIdRef`로 현재 요청만 유효하게 처리하도록 변경함.
- `board`·`gridSize`·`status` 변경 시 `useLayoutEffect`에서 진행 중 요청 ID를 무효화하고 타이머·계산 상태·힌트 오버레이를 즉시 해제함. 보드가 바뀐 뒤 도착한 이전 요청 응답은 무시됨.
- Worker `onerror`·`onmessageerror` 처리 추가. 오류 시 계산 상태를 해제하고 3초 쿨다운과 함께 사용자 안내를 표시하며, 오류가 난 Worker는 종료하고 다음 요청에서 새 Worker를 생성함.
- 5초(`AI_HINT_TIMEOUT_MS`) 시간 초과 처리 추가. 시간 초과 시 요청을 무효화하고 Worker를 종료하며, 다음 요청에서 새 Worker를 생성함.
- Worker 결과가 `null`이면 힌트 없음 안내를 표시하고 계산 상태를 해제함.
- Worker를 생성할 수 없는 환경의 동기 계산 폴백에도 결과 없음·예외 처리와 요청 ID 검증을 적용함.
- 안내 문구 `aiHintUnavailable`·`aiHintFailed`·`aiHintTimeout`을 KO/EN/JA/ZH에 추가하고 기존 글로벌 토스트로 표시함.
- `src/App.aiHint.test.tsx`를 추가해 보드 변경 후 오래된 응답 무시, 힌트 없음, Worker 오류, 시간 초과 후 늦은 응답 무시를 검증함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker를 unregister한 뒤 데스크톱 Chromium으로 AI 힌트 시나리오 확인
- **결과**:
  - `npm test`: 18개 파일/127개 테스트 PASS. 신규 `App.aiHint.test.tsx` 4건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저 정상 경로: 3×3에서 AI 힌트 요청 후 힌트 오버레이 1개 표시, 버튼 `3s` 쿨다운, 오류 토스트 없음.
  - 브라우저 레이스 컨디션: `Worker.prototype.postMessage`를 700ms 지연시킨 뒤 힌트 요청 직후 새 게임을 실행했고, 1초 후 힌트 오버레이 0개·버튼 `AI 힌트`·오류 토스트 없음 확인.
  - 브라우저 힌트 없음: Worker 응답을 `result: null`로 대체했을 때 `이동 가능한 힌트를 찾지 못했습니다...` 토스트, 오버레이 0개, 버튼 `3s` 확인.
  - 브라우저 시간 초과: `postMessage`를 무응답으로 대체했을 때 5초 후 `AI 힌트 계산 시간이 초과되었습니다...` 토스트, 오버레이 0개, 버튼 `3s` 확인.
  - 브라우저 재시도: 시간 초과 후 쿨다운이 끝난 뒤 다시 요청해 힌트 오버레이 1개가 표시되어 Worker 재생성 경로가 동작함을 확인.
  - 브라우저 콘솔 uncaught error 0건.
- **미실행**: 실제 Worker 스크립트 로드 실패(네트워크·번들 오류)와 실제 5×5 장시간 탐색으로 인한 시간 초과는 직접 재현하지 않았고, 시간 초과는 `postMessage` 무응답으로 재현함. 실제 모바일 실기기 검증도 수행하지 않음. 데스크톱 Chromium에서만 확인함.
- **증거**: `src/App.tsx`, `src/App.aiHint.test.tsx`, `src/i18n/translations.ts`, 터미널 실행 결과, 브라우저 확인 결과

---

## TASK-DEV-18 — 모달 포커스 트랩 및 전역 키보드 입력 충돌 해결

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 모달이 열린 동안 포커스를 모달 내부에 가두고, 보드 키보드 핸들러가 모달·폼 컨트롤 입력을 가로채지 않게 한다.
- **완료 기준(DoD)**:
  - 모달 열기 시 초기 포커스 이동, Tab/Shift+Tab 순환, 닫기 시 이전 포커스 복원
  - 배경 콘텐츠 `inert`/`aria-hidden` 처리
  - 모달 열림 중 보드 키 입력 차단, `SELECT`·`INPUT`·`TEXTAREA` 포커스 시 전역 단축키 무시
  - 키보드 전용 회귀 테스트 추가

### 진행 결과

- 공통 `useModalFocusTrap` Hook을 신설함. 모달이 열리면 이전 포커스를 저장하고 첫 번째 포커스 가능 요소(없으면 컨테이너)로 이동하며, Tab/Shift+Tab 입력을 직접 계산해 모달 내부에서 순환시킴. 닫히면 이전 포커스가 DOM에 연결되어 있을 때 복원함.
- 숨겨진 `input[type="file"]`, `hidden`·`aria-hidden`·`inert` 하위 요소를 포커스 후보에서 제외해 커스텀 이미지 모달의 숨김 파일 입력으로 포커스가 이동하지 않게 함.
- Hint·Theme·CustomImage·Daily·Achievement·Bgm·GameOver·Win 8종 모달 콘텐츠 컨테이너에 Hook과 `tabIndex={-1}`을 적용함.
- `App`에서 타이틀·게임 화면·푸터·PWA 배너를 `.app-content`로 감싸고, 모달이 하나라도 열려 있으면 `inert`와 `aria-hidden`을 적용함. 배경 레이아웃 유지를 위한 `.app-content` flex 스타일을 추가함.
- `PuzzleBoard`에 `isInputBlocked` prop을 추가해 모달 열림 동안 키보드·터치·클릭 이동을 차단함. 키보드 핸들러는 `SELECT`·`INPUT`·`TEXTAREA`·`contentEditable` 포커스, 수정 키 조합, 이미 처리된 이벤트에서도 동작하지 않음.
- `src/App.keyboard.test.tsx`를 추가해 테마 모달 Tab/Shift+Tab 순환과 포커스 복원, 모달 열림 중 보드 이동 차단, 언어 `<select>` 포커스 중 보드 이동 차단을 검증함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker를 unregister한 뒤 데스크톱 Chromium으로 포커스·키 입력 시나리오 확인
- **결과**:
  - `npm test`: 19개 파일/130개 테스트 PASS. 신규 `App.keyboard.test.tsx` 3건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저 테마 모달: 열기 직후 포커스가 닫기 버튼으로 이동하고 `.app-content`에 `inert`·`aria-hidden`이 적용됨. 실제 Tab 30회가 모두 모달 내부에서 순환했고 Shift+Tab은 마지막 버튼으로 역순 이동함.
  - 브라우저 포커스 복원: Escape로 모달을 닫은 뒤 포커스가 `게임 시작 (4×4)` 트리거 버튼으로 복원되고 `inert`·`aria-hidden`이 해제됨.
  - 브라우저 보드 차단: 정답 보기로 이동 수 0인 3×3 보드에서 테마 모달을 연 뒤 ArrowDown을 눌러도 이동 수 0 유지, 모달을 닫은 뒤 같은 키로 1 증가함.
  - 브라우저 언어 선택: 게임 화면 언어 `<select>`에 포커스한 뒤 ArrowDown을 누르면 선택 언어가 `ko`→`en`으로 바뀌고 보드 이동 수는 1로 유지됨(전역 단축키 미가로채기).
  - 브라우저 BGM 모달: Tab 12회가 모두 모달 내부(볼륨 슬라이더·체크박스·트랙 카드 포함)에서 순환하고 Escape 후 BGM 트리거로 포커스가 복원됨.
  - 브라우저 커스텀 이미지 모달: 초기 포커스가 숨김 파일 입력이 아닌 닫기 버튼으로 이동하고 Escape 후 사진 버튼으로 복원됨.
  - 브라우저 승리 모달: Tab 8회가 공유·다시 플레이·다음 단계 버튼 사이에서만 순환함.
  - 브라우저 콘솔 error 0건. `aria-hidden` 적용에 따른 포커스 경고도 발생하지 않음.
- **미실행**: 실제 모바일 실기기와 스크린리더(NVDA·VoiceOver) 검증은 수행하지 않음. Firefox·Safari의 `inert` 지원 차이는 확인하지 않았고, 데스크톱 Chromium에서만 확인함. 두 개 이상 모달이 동시에 열리는 중첩 시나리오는 현재 UI에서 발생하지 않아 검증하지 않음.
- **증거**: `src/hooks/useModalFocusTrap.ts`, `src/components/Modal/*.tsx`, `src/App.tsx`, `src/components/Board/PuzzleBoard.tsx`, `src/styles/App.css`, `src/App.keyboard.test.tsx`, 터미널 실행 결과, 브라우저 확인 결과

---

## TASK-DEV-19 — ARIA 구조·색 대비·확대 허용·접근성 라벨 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: Lighthouse 접근성 실패 항목을 해소하고, 스크린리더·저시력 사용자가 보드와 모달을 정상 탐색할 수 있게 한다.
- **완료 기준(DoD)**:
  - 보드 그리드 역할 구조를 유효하게 만들거나 단순한 버튼 그룹으로 단순화
  - 타이틀에 `main` landmark 추가, 중첩 인터랙티브 요소 제거
  - WCAG AA 대비 충족, `maximum-scale=5` 이상 및 확대 허용
  - 접근성 라벨·`alt` 4개 언어 적용
  - Lighthouse 접근성 실패 0건 확인 및 결과 기록

### 진행 결과

- 보드의 `role="grid"`·`role="gridcell"` 구조를 `role="group"`과 타일 버튼 목록으로 단순화하고, 보드 설명을 조작 안내 문단(`board-controls-guide`)과 `aria-describedby`로 연결함.
- 타이틀 화면 루트를 `<main>` landmark로 변경함. 게임 화면은 기존 `<main className="game-main">`을 유지해 한 화면에 main landmark가 하나만 존재함.
- 모드 카드의 `role="button"`·`tabIndex`·`onKeyDown`·`aria-pressed`를 제거해 카드 내부 크기 pill·시작 버튼과의 중첩 인터랙티브 요소를 해소함. 크기 pill에 `aria-pressed`를 추가하고, 난이도 pill 묶음에 `role="group"`과 `difficultyLabel` 라벨을 적용함.
- `index.html` viewport를 `maximum-scale=5.0`으로 변경하고 `user-scalable=no`를 제거해 확대를 허용함.
- 색 대비를 WCAG AA 기준으로 보정함. `--text-muted`를 `hsl(215, 20%, 42%)`로 조정하고, 푸터를 `text-muted`로 변경함. 크기 pill·테마 pill 텍스트를 `text-main`으로, 일일·업적·긴급·이동 제한 강조색과 주요 액션 버튼 gradient를 더 어두운 색으로 변경함.
- BGM·SFX 오디오 버튼의 하드코딩된 `aria-label`·`alt`를 `t.bgm`·`t.sfx`로 교체해 KO/EN/JA/ZH 번역을 적용함.
- 키보드 사용자를 위해 `select`·`input`·`textarea`·`[role="button"]`의 `:focus-visible` 외곽선을 공통 스타일로 추가함.
- `src/App.accessibility.test.tsx`를 추가해 viewport 확대 허용, 타이틀 main landmark·중첩 카드 버튼 제거·크기 pill `aria-pressed`, 보드 group 역할·gridcell 제거·조작 안내 연결, JA/ZH 오디오 라벨·alt 번역을 검증함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker를 unregister한 뒤 데스크톱 Chromium Lighthouse 접근성 감사와 DOM 확인
- **결과**:
  - `npm test`: 20개 파일/134개 테스트 PASS. 신규 `App.accessibility.test.tsx` 4건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - Lighthouse 수정 전: 타이틀 접근성 0.93(`landmark-one-main`, `meta-viewport`), 게임 접근성 0.79(`aria-required-children`, `aria-required-parent`, `color-contrast`, `meta-viewport`). 대비 실패는 일일 챌린지 버튼 2.36, 업적 도감 버튼 1.81이었음.
  - Lighthouse 수정 후: 타이틀 접근성 1.0, 게임 접근성 1.0. 테마 선택 모달 1.0, BGM 설정 모달 1.0. 접근성 실패 0건.
  - Lighthouse에 남은 유일한 실패는 SEO의 `robots.txt` 유효성 항목으로, 접근성 범위가 아니며 `TASK-QA-08`에서 다룰 항목임.
  - 색 대비 실측: 일일 챌린지 6.18, 업적 도감 5.99, 크기 pill 15.11, 푸터 5.31(모두 AA 4.5 이상).
  - DOM 확인: 문서 내 `main` 1개, 보드 `role="group"`, `gridcell` 0개, 4×4 보드의 타일 버튼 15개, `aria-describedby="board-controls-guide"` 연결 확인.
  - 브라우저 콘솔 error 0건.
- **미실행**: 실제 모바일 실기기와 스크린리더(NVDA·VoiceOver) 검증은 수행하지 않음. Firefox·Safari의 landmark·확대 동작 차이는 확인하지 않았고 데스크톱 Chromium에서만 확인함. JA/ZH 화면과 Time Attack·이동 제한의 긴급 상태는 Lighthouse로 각각 감사하지 않았고, Daily·Achievement·CustomImage·Win·GameOver 모달도 개별 Lighthouse 감사 대상에서 제외함(테마·BGM 모달만 확인).
- **증거**: `index.html`, `src/components/Board/PuzzleBoard.tsx`, `src/components/Title/TitleScreen.tsx`, `src/components/Title/TitleScreen.css`, `src/components/Header/Header.tsx`, `src/components/Header/Header.css`, `src/components/Controls/Controls.css`, `src/styles/index.css`, `src/styles/App.css`, `src/App.accessibility.test.tsx`, Lighthouse JSON/HTML 보고서, 브라우저 DOM 확인 결과

---

## TASK-DEV-20 — 360px 모바일·1화면 레이아웃 및 터치 처리 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 360px 폭에서 상단 컨트롤이 잘리지 않게 하고, 360×800·1280×800에서 핵심 플레이 화면이 한 화면에 들어오도록 레이아웃을 조정한다.
- **완료 기준(DoD)**:
  - 360×640·360×800·1280×800에서 가로 클리핑 0, 상단 컨트롤·배지 판독 가능
  - 360×800에서 보드와 핵심 컨트롤이 스크롤 없이 보이도록 조정하거나, 불가피하면 PM과 FEATURES 문구 조정
  - 터치 스크롤 차단을 non-passive 리스너 또는 CSS로 일관 처리하고 콘솔 오류 제거
  - 뷰포트별 스크린샷과 측정값 기록

### 진행 결과

- `Header`의 클래스명이 CSS와 어긋나 상단 컨트롤이 스타일 없이 세로로 쌓이던 문제를 수정함. `btn-home-return`→`home-btn`, `header-top-right`→`header-actions-right`, `daily-streak-btn`→`daily-streak-badge-btn`으로 맞춰 홈·스트릭·언어·오디오 컨트롤이 한 줄 flex 레이아웃을 사용하도록 복구함.
- 420px 이하에서 타이틀 상단 바를 2줄로 배치하고 좌우 그룹을 중앙 정렬함. 배지에 `white-space: nowrap`을 적용해 스트릭·업적 배지가 세로로 쪼개지지 않게 함.
- 400px 이하에서 인게임 기능·보조 툴바를 4열 아이콘 전용으로 전환하고 라벨을 숨김. 아이콘만 남아도 접근성 이름이 유지되도록 각 버튼에 `aria-label`을 추가함. 동시에 컨트롤 간격과 버튼 높이를 줄임.
- 보드 폭을 `calc(100dvh - 470px)` 기반으로 계산해 800px 높이에서 330px로 제한하고, 380px 이하에서는 최대 310px로 축소함. 850px 이하·481px 이상에서는 앱 패딩·게임 간격·카드 패딩을 압축함. 380px 이하에서는 게임 카드 패딩과 간격을 추가로 줄임.
- `PuzzleBoard`의 React `onTouchMove`를 제거하고 보드 DOM에 `{ passive: false }` 네이티브 `touchmove` 리스너를 등록해 스와이프 중 스크롤·Pull-to-refresh 차단이 콘솔 오류 없이 동작하도록 변경함.
- `src/components/Board/PuzzleBoard.test.tsx`를 추가해 취소 가능한 `touchmove`가 실제로 `preventDefault`되고, `touchend` 스와이프가 방향 이동 콜백을 호출하는지 검증함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - Vite dev 서버(127.0.0.1:5173)에서 Service Worker를 unregister한 뒤 데스크톱 Chromium에 360×640·360×800·1280×800 iframe 뷰포트를 만들어 CSS viewport·`scrollWidth`·`bodyScrollHeight`·요소 위치를 측정
- **결과**:
  - `npm test`: 21개 파일/136개 테스트 PASS. 신규 `PuzzleBoard.test.tsx` 2건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 수정 전 360×800: 타이틀 상단 바 `scrollWidth` 392px > 컨테이너 341px, 스트릭 배지 53×81px·업적 배지 51×81px, 오디오 컨트롤 우측 398px로 뷰포트 밖. 게임 `bodyScrollHeight` 929px, 보드 하단 816px.
  - 수정 전 1280×800: 게임 `bodyScrollHeight` 959px, 보드 하단 848px.
  - 수정 후 360×800: 타이틀 상단 바 `scrollWidth` 341px = 폭 341px, 스트릭 배지 97×30px·업적 배지 86×30px, 오디오 컨트롤 우측 314px. 게임 `bodyScrollHeight` 800px, `scrollWidth` 360px = `clientWidth` 360px, 보드 310×310px(하단 653px), 보드 안내 하단 696px, 푸터 하단 792px.
  - 수정 후 360×640: 타이틀 상단 바 341px/341px, 배지 높이 30px. 게임 `scrollWidth` 354px = `clientWidth` 354px로 가로 클리핑 없음, 보드 282×282px. 세로 `bodyScrollHeight` 731px로 스크롤이 필요하지만 360×640의 DoD는 가로 클리핑·상단 컨트롤 판독만 요구하므로 충족함.
  - 수정 후 1280×800: 타이틀 `scrollWidth` 1280px = `clientWidth`, 상단 바 600px. 게임 `bodyScrollHeight` 800px, `scrollWidth` 1280px = `clientWidth`, 보드 330×330px(하단 679px), 보드 안내 하단 706px, 푸터 하단 792px.
  - 터치: 보드에 취소 가능한 `touchmove`를 전달했을 때 `defaultPrevented=true`, `dispatchEvent` 반환값 `false`로 non-passive 차단이 동작함. 스와이프로 타일이 실제 이동함. 깨끗한 탭에서 콘솔 error 0건.
  - Lighthouse 접근성은 수정 후에도 타이틀·게임 1.0을 유지함.
  - 스크린샷: [타이틀 360×800](./assets/task-dev-20/title-360x800.webp), [게임 360×800](./assets/task-dev-20/game-360x800.webp), [게임 360×640](./assets/task-dev-20/game-360x640.webp), [게임 1280×800](./assets/task-dev-20/game-1280x800.webp). 1280×800은 1280×800 iframe을 0.72배로 축소 촬영한 뒤 원해상도로 복원함.
- **미실행**: 실제 모바일 실기기(iOS Safari·Android Chrome)와 실제 손가락 스와이프·Pull-to-refresh는 확인하지 않았음. Firefox의 `dvh`·터치 리스너 동작도 미확인. 360×640은 설계상 세로 스크롤을 허용했고 1화면 요구 대상이 아님.
- **증거**: `src/components/Header/Header.tsx`, `src/components/Header/Header.css`, `src/components/Title/TitleScreen.css`, `src/components/Controls/Controls.tsx`, `src/components/Controls/Controls.css`, `src/components/Board/PuzzleBoard.tsx`, `src/components/Board/PuzzleBoard.css`, `src/components/Board/PuzzleBoard.test.tsx`, `src/styles/App.css`, `root/archive/assets/task-dev-20/*.webp`, 터미널 실행 결과, 브라우저 iframe 측정·스크린샷 결과

---

## TASK-DEV-21 — PWA 매니페스트 아이콘·Service Worker 폴백/업데이트 안정화

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: PWA 설치 요건을 충족하는 아이콘을 제공하고, 서버 오류·업데이트 시 캐시 폴백과 게임 진행 보호를 강화한다.
- **대상 파일**: `public/manifest.webmanifest`, `public/assets/icons/**`, `public/sw.js`, `src/main.tsx`
- **재현/증거**: 매니페스트는 `badge_trophy.png`를 192×192·512×512로 선언하지만 실제 이미지는 224×197이고 maskable·apple-touch 아이콘이 없음. 서버 중단 후 재로드 시 SW가 502 응답을 그대로 반환해 캐시 폴백이 동작하지 않음. `controllerchange`에서 무조건 `location.reload()`를 호출해 업데이트 시 게임이 중단될 수 있음.
- **완료 기준(DoD)**:
  - 192×192·512×512 정사각형 아이콘과 maskable 아이콘, apple-touch-icon 추가
  - Navigation Network First에서 `!response.ok`도 캐시 폴백 처리
  - `cache.addAll` 실패 시 자산별 캐시 또는 설치 실패 처리
  - 업데이트 시 진행 중 게임을 즉시 새로고침하지 않고 안내 후 반영
  - 서브패스 배포와 오프라인 재로드 재검증

### 진행 결과

- `sharp`로 3×3 슬라이딩 퍼즐 그리드 아이콘을 생성해 `icon-192.png`·`icon-512.png`(purpose `any`), `icon-maskable-192.png`·`icon-maskable-512.png`(purpose `maskable`), `apple-touch-icon.png`(180×180)을 추가함. maskable 아이콘은 80% 안전 영역 안에 그리드가 들어오도록 축소하고 배경을 꽉 채워 마스킹 시 잘림을 막음.
- `manifest.webmanifest`에 `scope: "./"`를 추가하고 아이콘 4종을 `any`/`maskable` purpose로 분리 선언함. 모든 경로를 상대 경로로 유지해 서브패스 배포에서도 해석되게 함.
- `index.html`에 180×180 `apple-touch-icon` 링크와 `apple-mobile-web-app-capable`·status-bar·title 메타를 추가함.
- `public/sw.js`를 v2.1로 올리고 다음을 반영함.
  - `self.location.href` 기준으로 `INDEX_URL`을 계산해 서브패스에서도 캐시 셸을 찾도록 함.
  - Navigation Network First에서 `response.ok`가 아닌 4xx·5xx 응답도 캐시된 `index.html`로 폴백하고, 네트워크 예외 시에도 캐시 셸을 반환함.
  - `cache.addAll` 실패 시 `cache.add`로 자산별 재시도하고 실패 자산만 경고로 남겨 설치 전체가 비지 않게 함.
  - install에서 자동 `skipWaiting()`을 제거하고, `SKIP_WAITING` 메시지를 받을 때만 대기 워커를 활성화함. activate에서는 이전 캐시 정리 후 `clients.claim()`을 수행함.
  - 성공한 Navigation 응답을 요청 URL과 `INDEX_URL` 양쪽에 캐시하고, 캐시 쓰기 실패는 경고만 남겨 응답을 막지 않음.
- `src/utils/swUpdateManager.ts`를 추가해 등록·대기 워커 감지·업데이트 이벤트·적용 요청·`controllerchange` 새로고침을 분리함. 새로고침은 사용자가 적용을 선택한 뒤 한 번만 수행하고, 테스트를 위해 reload 콜백을 주입할 수 있게 함.
- `ServiceWorkerUpdateBanner`를 추가해 `role="status"`·`aria-live="polite"` 배너로 새 버전을 안내하고, "지금 업데이트"에서 `SKIP_WAITING`을 요청하며 "나중에"에서는 배너만 닫음. 4개 국어 문구를 추가하고 400px 이하에서는 버튼 라벨을 숨겨 아이콘으로 표시함.
- `App.tsx`에서 배너를 `.app-content` 밖에 렌더링해 모달 열림 중에도 업데이트 안내를 조작할 수 있게 함. `main.tsx`는 `registerServiceWorker(getAssetUrl('sw.js'))`만 호출하도록 단순화함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - `dist`를 `http://127.0.0.1:4173/sliding-puzzle/` 서브패스로 서빙하는 Node 정적 서버에서 데스크톱 Chromium으로 SW 등록·캐시·매니페스트·오프라인·업데이트 흐름을 확인
- **결과**:
  - `npm test`: 24개 파일/152개 테스트 PASS. 신규 `serviceWorkerScript.test.ts` 9건, `swUpdateManager.test.ts` 5건, `ServiceWorkerUpdateBanner.test.tsx` 2건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지). `dist`에 프리캐시 대상 36개 파일과 `sw.js`·`manifest.webmanifest`가 포함됨을 확인.
  - 서브패스 등록: SW scope `http://127.0.0.1:4173/sliding-puzzle/`, controller `.../sliding-puzzle/sw.js`, `sliding-puzzle-v2.1` 캐시 37건(셸 2건 포함), `index.html`·`/sliding-puzzle/`·아이콘 캐시 확인.
  - 매니페스트: 아이콘 4종 모두 200 응답, `any` 192×192·512×512와 `maskable` 192×192·512×512의 실제 디코딩 크기가 선언과 일치함. `apple-touch-icon` 링크는 `./assets/icons/apple-touch-icon.png`로 확인.
  - 502 폴백: 서버를 502 모드로 전환한 뒤 새로고침해도 타이틀 화면이 렌더링되고 document 요청은 200(SW 캐시)으로 기록됨.
  - 오프라인: 테스트 서버를 중단한 뒤 새로고침해도 타이틀 화면이 캐시에서 렌더링됨. 브라우저 연결 프록시가 직접 요청에 502를 반환하는 환경이었으나 SW가 캐시 셸로 폴백함.
  - 업데이트: 서버의 `sw.js`를 변경한 뒤 `registration.update()`를 호출하면 대기 워커와 함께 배너가 표시되고, `window` 프로브가 유지돼 즉시 새로고침되지 않음. "나중에"는 배너만 닫고 새로고침하지 않음. 페이지를 다시 열면 대기 워커가 있어 배너가 재표시됨. "지금 업데이트"는 `SKIP_WAITING` 전송 후 `controllerchange`에서 1회 새로고침하고, 새 워커의 `GET_BUILD` 응답 `sw-build-update`와 `registration.waiting === null`, 단일 캐시(`sliding-puzzle-v2.1`)를 확인함.
  - 브라우저 콘솔 error 0건.
- **미실행**: 실제 모바일 실기기·iOS Safari의 홈 화면 아이콘 적용, Firefox의 SW 업데이트 동작, 실제 정적 호스팅(GitHub Pages 등) 배포 환경은 확인하지 않았음. Chrome 설치 프롬프트 UI와 Lighthouse PWA 카테고리 감사도 실행하지 않았음(제공 도구는 접근성·SEO·모범 사례만 지원).
- **증거**: `public/manifest.webmanifest`, `public/sw.js`, `public/assets/icons/icon-192.png`, `public/assets/icons/icon-512.png`, `public/assets/icons/icon-maskable-192.png`, `public/assets/icons/icon-maskable-512.png`, `public/assets/icons/apple-touch-icon.png`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/utils/swUpdateManager.ts`, `src/components/PWA/ServiceWorkerUpdateBanner.tsx`, `src/components/PWA/ServiceWorkerUpdateBanner.css`, `src/utils/serviceWorkerScript.test.ts`, `src/utils/swUpdateManager.test.ts`, `src/components/PWA/ServiceWorkerUpdateBanner.test.tsx`, 터미널 실행 결과, 브라우저 등록·캐시·업데이트 측정 결과

---

## TASK-DEV-22 — BGM·이미지 에셋 경량화 및 초기 로딩 최적화

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 초기 다운로드·SW 프리캐시 용량을 줄이고, 현재 테마·현재 BGM만 우선 로드한다.
- **대상 파일**: `public/assets/audio/**`, `src/utils/audioManager.ts`, `src/utils/assetPreloader.ts`, `src/hooks/useAssetPreloader.ts`, `public/sw.js`, `scripts/**`
- **재현/증거**: `dist` 총 20.45MB 중 오디오 13.83MB(4개 WAV 2.01~4.15MB), 스프라이트 2.63MB, 테마 이미지 2.62MB. 초기 리소스 46건의 decodedBodySize 합계 9.9MB(현재 BGM 3.4MB + 프리로드 이미지 약 4.9MB). SW가 4개 BGM 전체를 설치 시 프리캐시.
- **완료 기준(DoD)**:
  - BGM 4트랙을 MP3/OGG 등 압축 포맷으로 전환하고 원본 WAV는 배포에서 제외
  - 최초 로드 시 현재 테마 이미지·현재 BGM만 로드하고 나머지는 지연 로드
  - 스프라이트·아이콘 압축 또는 SVG 전환 검토
  - SW 프리캐시를 필수 셸과 현재 테마 중심으로 축소
  - 변경 전후 `dist` 용량·초기 decodedBodySize·테마 전환 깜빡임·오프라인 동작 비교 기록

### 진행 결과

- BGM 4트랙이 실제로는 192kbps MP3 데이터를 `.wav` 확장자로 배포하고 있음을 확인함. ffmpeg(libmp3lame)로 96kbps stereo MP3(`.mp3`)로 변환하고 44.1kHz·2ch·길이를 유지함. 원본 `bgm_*.wav` 4개는 배포에서 제거함.
- `src/utils/audioManager.ts`의 BGM 경로를 `.mp3`로 변경함. 현재 트랙만 `preload='auto'`로 로드하는 기존 동작은 유지함.
- `public/assets/sprites/*.png` 3종과 PWA 아이콘을 제외한 `public/assets/icons/*.png` 14종을 sharp 팔레트 PNG(compressionLevel 9, palette, quality 90, effort 10)로 재압축함. 스프라이트·아이콘 합계 3,680KB → 534KB(-85%). 알파를 배경색으로 합성한 SSIM은 0.989~0.996으로 확인함. 테마 이미지는 일러스트 화질 보존을 위해 원본 PNG를 유지함.
- `assetPreloader`를 코어 이미지(스프라이트 2 + 아이콘 14)와 테마 이미지로 분리함. `preloadCoreAssets(themeId)`는 코어 + 현재 테마만 로드하고, `preloadAllThemeAssets()`는 테마 모달을 열 때만 호출함. 사용하지 않는 `sheet_ui_fx.png`는 코어/프리캐시 목록에서 제외함.
- `useAssetPreloader(themeId)`가 현재 테마를 인자로 받아 테마 변경 시 해당 이미지를 추가 로드하도록 변경함. `App`은 테마 모달이 열릴 때만 `preloadAllThemeAssets()`를 호출해 썸네일 전환 깜빡임을 방지함.
- `index.html`에서 사용 빈도가 낮은 `fx_animations_spritesheet.png` preload를 제거하고, 코어 UI 스프라이트와 기본 테마(`theme_nature.png`) preload만 유지함.
- `public/sw.js`를 v2.2로 올리고 프리캐시를 필수 셸·PWA 아이콘·SFX MP3·코어 스프라이트/아이콘·기본 테마 30건/1.31MB로 축소함. 4개 BGM과 나머지 3개 테마는 프리캐시에서 제외하고 첫 사용 시 런타임 캐시에 저장함.
- 오디오가 Range 요청으로 206 응답을 받는 경우 `cache.add(url)`로 전체 파일을 별도 캐시해 오프라인 재생을 보장함. 정적 자산 Cache First와 Navigation 폴백은 유지함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - `dist`를 `http://127.0.0.1:4174/sliding-puzzle/` 서브패스로 서빙하는 Node 정적 서버에서 데스크톱 Chromium으로 초기 로딩·테마 지연 로드·오프라인 재로드를 측정
  - 초기 로딩 비교는 SW 프리캐시 간섭을 막기 위해 빈 stub `sw.js`를 서빙한 상태에서 `performance.getEntriesByType('resource')`의 `decodedBodySize`를 합산함
- **결과**:
  - `npm test`: 25개 파일/156개 테스트 PASS. 신규 `useAssetPreloader.test.tsx` 1건과 `assetPreloader.test.ts` 보강 2건, `serviceWorkerScript.test.ts` 보강 1건 포함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - `dist`: 20.65MB → 11.04MB(-46.5%). 오디오 13.83→7.29MB, 스프라이트 2.63→0.31MB, 아이콘 1.14→0.38MB, 테마 이미지 2.62MB 유지.
  - BGM: 13.05MiB(13,685,294바이트) → 6.52MiB(6,833,181바이트, -50.1%). 4곡 모두 96kbps·44.1kHz·2ch, 길이 87.4·148.7·152.0·181.1초를 유지하고 ffmpeg 디코딩 오류가 없음. 배포 `dist`에 `bgm_*.wav` 0건.
  - 초기 동일 출처 리소스: 41건/9,222,220바이트 → 37건/2,716,771바이트(-70.5%). 최초 로드 테마는 `theme_nature.png` 1종, BGM은 `bgm_chill.mp3` 1곡만 확인됨. 이전에 로드하던 `sheet_ui_fx.png` 276KB와 나머지 3개 테마 2.08MB, 나머지 BGM 3곡이 제외됨.
  - SW 프리캐시: 37건/19.47MB → 30건/1.31MB(-93.3%). 등록 후 캐시 30건에 기본 테마만 포함되고 BGM은 설치 시 포함되지 않음.
  - 테마 지연 로드: 테마 모달을 열면 4개 테마가 모두 로드되고 썸네일 `naturalWidth=1024`로 완료된 뒤 선택·게임 시작이 가능함. 선택한 `theme_animal`이 보드 타일 배경에 적용됐고 콘솔 error 0건.
  - 오프라인: 서버 중단 후 재로드해도 타이틀이 캐시에서 렌더링됨. `theme_nature.png` 200, `theme_animal.png` 502(미사용 테마), 현재 BGM `bgm_jazz_cafe.mp3` 200/2,173,327바이트와 메타데이터 181.1초 로드, 미사용 `bgm_zen_nature.mp3`는 오류. 오프라인에서 타이틀→테마 모달→게임 시작이 동작하고 현재 테마 보드가 표시됨. 미캐시 테마 썸네일과 테마 동기화 BGM은 502 콘솔 오류가 발생하는 지연 로드 한계를 확인함.
- **미실행**: 실제 모바일 실기기·iOS Safari·Android Chrome에서의 초기 로딩·오프라인 재생, Safari/Firefox의 Range 오디오 캐시 동작, 96kbps BGM의 주관적 청취 품질, 실제 정적 호스팅(GitHub Pages 등)의 Range·캐시 헤더 동작은 확인하지 않았음. 테마 이미지 WebP 전환과 미캐시 테마의 오프라인 placeholder UX는 이번 범위에서 제외함.
- **증거**: `public/assets/audio/bgm_chill.mp3`, `bgm_zen_nature.mp3`, `bgm_cyber_synth.mp3`, `bgm_jazz_cafe.mp3`, 삭제된 `public/assets/audio/bgm_*.wav`, `public/assets/sprites/*.png`, `public/assets/icons/*.png`, `src/utils/audioManager.ts`, `src/utils/assetPreloader.ts`, `src/hooks/useAssetPreloader.ts`, `src/utils/assetPreloader.test.ts`, `src/hooks/useAssetPreloader.test.tsx`, `src/utils/audioManager.test.ts`, `src/utils/serviceWorkerScript.test.ts`, `public/sw.js`, `index.html`, `src/App.tsx`, 터미널 실행 결과, 브라우저 리소스 타이밍·캐시·오프라인 측정 결과

---

## TASK-DEV-23 — 업적 토스트 다중 달성 큐 및 메타데이터 병합 수정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 한 번의 승리로 여러 업적이 달성돼도 모두 순차 표시하고, 저장된 업적 데이터가 최신 정의를 덮어쓰지 않게 한다.
- **대상 파일**: `src/components/Achievement/AchievementToast.tsx`, `src/utils/achievementManager.ts`, `src/utils/achievementData.ts`, 관련 테스트
- **재현/증거**: 3x3 승리에서 `first_victory`, `speed_demon`, `purist_no_undo` 3건이 동시에 잠금 해제됐지만 토스트는 마지막 `purist_no_undo` 1건만 표시됨. `getStoredAchievements`가 `{ ...init, ...found }` 순서로 병합해 저장된 옛 제목·설명이 최신 정의를 덮어씀.
- **완료 기준(DoD)**:
  - 다중 달성 시 큐 또는 통합 토스트로 모든 업적 표시, 타이머 정리
  - 정적 메타데이터는 최신 정의를 사용하고 `unlockedAt`·`progress`만 저장값 유지
  - 다중 달성·저장 데이터 병합 테스트 추가
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS

### 진행 결과

- `AchievementToast`가 업적 알림을 큐에 보관하고 큐의 첫 항목만 표시하도록 변경함. 기존에는 동기적으로 3건이 알림되면서 `current`가 마지막 항목으로 덮어써져 1건만 보였음.
- 각 토스트는 4.5초 표시 후 큐에서 제거되어 다음 업적으로 넘어가며, 표시 시간 종료·언마운트·다음 항목 전환 시 `clearTimeout`으로 타이머를 정리함. `key={current.id}`로 항목마다 슬라이드 애니메이션이 다시 재생되도록 함.
- 업적 효과음은 기존처럼 알림 시점이 아니라 각 토스트가 실제 표시될 때 `audioManager.playSfx('victory')`로 1회씩 재생하도록 이동함. 3건 동시 달성 시 효과음 3개가 겹쳐 재생되지 않음.
- `getStoredAchievements`의 `{ ...init, ...found }` 병합은 v1.0.0 초기 코드에 있었으나 TASK-DEV-15 커밋 `b428458`에서 이미 최신 정적 메타데이터 + 저장된 `unlockedAt`·`progress` 구조로 수정돼 있었음. 이번 작업에서는 현재 동작을 회귀 테스트로 고정하고, 저장 데이터가 없을 때 `INITIAL_ACHIEVEMENTS` 원본을 직접 반환해 달성 처리 중 정의가 변경되던 경로를 `cloneInitialAchievements()` 복사본 반환으로 보강함.
- `achievementData.ts`는 12종 업적의 최신 제목·설명·아이콘 키를 이미 보유하고 있어 변경하지 않음.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run dev` 개발 서버의 데스크톱 Chromium에서 `checkGameCompletionAchievements()`로 3x3·25초·Undo 0회 승리를 재현하고 `.toast-title`을 1초·5초·9.5초·14초 시점에 관찰
  - 같은 브라우저에서 옛 제목·설명·아이콘과 알 수 없는 ID를 `sliding_puzzle_achievements`에 저장한 뒤 `getStoredAchievements()` 결과 확인
- **결과**:
  - `npm test`: 26개 파일/161개 테스트 PASS. `AchievementToast.test.tsx` 2건 신규, `achievementManager.test.ts` 3건 추가(알림 순서, 메타데이터 병합, 초기 정의 불변).
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 브라우저 큐: 3건 동시 달성 시 1초 시점 `첫 승리의 기쁨`, 5초 시점 `스피드 데몬`, 9.5초 시점 `완벽한 직관 (No Undo)`가 각각 1개 컨테이너로 표시되고 14초 시점에 모두 사라짐. 콘솔 error 0건.
  - 브라우저 메타데이터 병합: 저장된 옛 `titleKey`·`descriptionKey`·`iconName`을 무시하고 `achFirstVictoryTitle`·`achFirstVictoryDesc`·`Trophy`, `achStarCollectorTitle`·`Star`를 사용함. 저장된 `unlockedAt`(`2025-01-02T03:04:05.000Z`)과 `progress`(7, 2)는 유지하고 `maxProgress`는 최신 정의(3)를 사용함. 알 수 없는 ID는 12건 목록에 추가되지 않음.
- **미실행**: 실제 모바일 실기기·iOS Safari·Android Chrome과 스크린리더에서 연속 토스트의 시각·청각 알림, 백그라운드 탭 스로틀링 중 타이머 동작은 확인하지 않았음. 여러 탭이 동시에 업적을 갱신하는 경합과 토스트 표시 중 언어 전환은 이번 범위에서 제외함.
- **증거**: `src/components/Achievement/AchievementToast.tsx`, `src/components/Achievement/AchievementToast.test.tsx`, `src/utils/achievementManager.ts`, `src/utils/achievementManager.test.ts`, `src/utils/achievementData.ts`, 터미널 실행 결과, 브라우저 토스트 타이틀 시계열·메타데이터 병합 측정 결과

---

## TASK-DEV-24 — LocalStorage 접근·스키마 방어

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **완료일**: 2026-11-08
- **목표**: 저장소 접근 차단·손상된 JSON·예상 밖 스키마에서도 앱이 빈 화면으로 죽지 않고 기본값으로 동작하게 한다.
- **대상 파일**: `src/i18n/useTranslation.ts`, `src/App.tsx`(커스텀 이미지 초기화), `src/utils/recordStorage.ts`, `src/utils/dailyChallenge.ts`, `src/utils/achievementManager.ts`, `src/utils/audioManager.ts`, 공통 storage 유틸(신설 가능)
- **재현/증거**: `getInitialLanguage`와 `App.tsx` 67~70행이 `localStorage.getItem`을 try/catch 없이 호출하므로 저장소 접근이 차단된 환경에서 모듈 초기화가 실패할 수 있음. 일일 스트릭·기록·업적 JSON은 파싱 후 스키마 검증이 없어 `completedDates` 등 필드가 없으면 `.includes`에서 예외가 발생할 수 있음.
- **완료 기준(DoD)**:
  - 안전한 storage 래퍼로 읽기·쓰기·파싱 실패를 흡수하고 기본값 반환
  - 일일 스트릭·기록·업적·오디오 설정 스키마 검증
  - 저장소 차단·손상 JSON·필드 누락 테스트 추가
  - 앱 초기 화면이 정상 렌더링됨을 확인

### 진행 결과

- `src/utils/storage.ts`를 신설해 `readStorageItem`·`writeStorageItem`·`removeStorageItem`·`readStorageJson`·`writeStorageJson`·`isRecord`를 제공함. `window.localStorage` 접근, `getItem`·`setItem`·`removeItem` 호출, `JSON.parse`, 스키마 normalizer 실행을 각각 try/catch로 감싸 실패 시 `null`·`false` 또는 no-op으로 흡수함.
- `useTranslation`: `getInitialLanguage`가 래퍼와 지원 언어 목록(`ko`·`en`·`ja`·`zh`)으로 값 검증. 저장소 차단·미지원 언어 값(`fr`)은 `ko`로 폴백하고 `setGlobalLanguage` 쓰기 실패도 무시함.
- `App`: 커스텀 이미지 초기화를 래퍼로 전환하고 `data:image/` 접두사가 있는 값만 복원. 테마 적용·선택 시 직접 호출하던 `localStorage.removeItem` 3곳을 `removeStorageItem`으로 통일.
- `CustomImageModal`: 저장된 이미지 읽기를 래퍼로 전환하고 `data:image/` 값만 로드. 적용 시 저장 실패(`writeStorageItem`이 `false`)면 기존처럼 용량 초과 오류를 표시하고 모달을 닫지 않음.
- `dailyChallenge`: `completedDates`는 `YYYY-MM-DD` 문자열만 중복 제거해 보존하고, `currentStreak`·`maxStreak`는 음이 아닌 정수로, `lastCompletedDate`는 유효한 날짜 문자열 또는 `null`로 정규화함. 객체가 아닌 JSON·손상 JSON은 빈 스트릭으로 폴백하고 `maxStreak`는 최소 `currentStreak` 이상으로 보정함.
- `recordStorage`: 3·4·5 난이도별 기록에서 `bestTime`·`bestMoves`가 유한한 음이 아닌 수인지 검증하고 `clearedAt` 문자열만 유지함. 손상된 개별 기록은 `null`로 버리고, 기본값을 매 호출마다 새 객체로 생성해 저장 실패 시 모듈 기본값이 변경되지 않게 함.
- `achievementManager`: 저장된 업적은 배열·문자열 `id`·문자열 `unlockedAt`·음이 아닌 숫자 `progress`만 인정하고 나머지 항목은 무시함. 통계는 `threeStarCount`를 음이 아닌 정수로, `clearedThemes`를 실제 테마 ID 4종으로 제한해 중복 제거하고, `hasUsedUndoInGame`은 `true`일 때만 인정함.
- `audioManager`: 저장된 boolean은 `'true'`·`'false'`만 인정하고, 볼륨은 유한한 수를 0~1로 clamp하며, BGM ID는 `BGM_TRACKS`에 존재하는 값만 반영함. `normalizeStoredAudioConfig()`를 분리해 단위 테스트 가능하게 하고, `loadSettings`·`saveSettings`를 래퍼 기반으로 전환함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run dev` 개발 서버의 데스크톱 Chromium에서 일일·기록·업적·통계·오디오·언어 키에 손상 JSON과 잘못된 타입을 넣고 새로고침해 타이틀 렌더링·모듈 반환값·콘솔 오류 확인
  - 같은 브라우저에서 `Storage.prototype.getItem`·`setItem`·`removeItem`·`clear`가 강제로 예외를 던지도록 덮은 뒤 업적 모달·저장 함수·언어 전환·오디오 설정 변경 확인 후 원복
  - 유효한 일일·기록·업적·오디오·언어 값을 저장하고 새로고침해 정상 복원 확인
- **결과**:
  - `npm test`: 29개 파일/183개 테스트 PASS. `storage.test.ts` 5건, `dailyChallenge.test.ts` 5건, `App.storage.test.tsx` 1건 신규. `recordStorage.test.ts` 3건, `achievementManager.test.ts` 4건, `audioManager.test.ts` 2건, `i18n.test.ts` 2건 추가.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 손상 데이터 브라우저 검증: 타이틀 렌더링, 콘솔 error 0건. `currentStreak: '3'`은 0, `maxStreak: 2.9`는 2, `completedDates: 'broken'`은 `[]`로 정규화. 기록 3번의 문자열 `bestTime`은 제거되고 4번은 `bestTime: 20`·`bestMoves: 30`·`clearedAt: ''`로 유지. 업적은 12건으로 복구되고 `first_victory`의 숫자 `unlockedAt`은 `null`, `star_collector`의 문자열 `unlockedAt`은 유지·음수 `progress`는 0으로 정규화. 오디오는 `sfxVolume 0.8`·`bgmVolume 1`·`currentBgmTrackId chill`로 폴백. 언어는 `ko`.
  - 저장소 차단 브라우저 검증: 타이틀 렌더링과 업적 모달 `달성률: 0 / 12 (0%)` 표시. `getDailyStreakData`·`getBestRecords`·`getStoredAchievements`·`saveDailyCompletion`·`saveBestRecord`·`saveStoredAchievements`·`setGlobalLanguage`·`setBgmVolume`·`toggleBgmMute` 모두 예외 없이 실행됨. `saveDailyCompletion`은 메모리상 `currentStreak 1`을 반환하고 `saveBestRecord`는 신기록 객체를 반환함. 콘솔 error 0건.
  - 유효 데이터 브라우저 검증: 재로드 후 `currentStreak 3`·`maxStreak 5`·오늘 완료일, 3×3 기록 45초/20수, `first_victory.unlockedAt`, `star_collector.progress 2`, `bgmVolume 0.6`·`currentBgmTrackId zen`·`lang en`이 그대로 복원됨.
- **미실행**: 실제 모바일 실기기·iOS Safari·Android Chrome의 시크릿 모드·쿠키 차단 환경, 실제 저장 용량 초과(QuotaExceededError) 상황, 여러 탭의 동시 저장 경합은 확인하지 않았음. 저장소 차단은 브라우저에서 `Storage.prototype` 예외와 테스트의 메서드 예외로만 재현함.
- **증거**: `src/utils/storage.ts`, `src/utils/storage.test.ts`, `src/utils/dailyChallenge.ts`, `src/utils/dailyChallenge.test.ts`, `src/utils/recordStorage.ts`, `src/utils/recordStorage.test.ts`, `src/utils/achievementManager.ts`, `src/utils/achievementManager.test.ts`, `src/utils/audioManager.ts`, `src/utils/audioManager.test.ts`, `src/i18n/useTranslation.ts`, `src/i18n/i18n.test.ts`, `src/App.tsx`, `src/components/Modal/CustomImageModal.tsx`, `src/App.storage.test.tsx`, 터미널 실행 결과, 브라우저 손상·차단·복원 측정 결과

---

## TASK-DEV-25 — 심플·어반 디자인 시스템 및 가독성 기준 수립

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: 현재의 그라데이션·글로우·파스텔 카드 중심 UI에서 벗어나 심플하고 도시적인 디자인 토큰과 가독성 기준을 수립한다.
- **디자인 방향**:
  - 도시적 유틸리티(교통 표지판·건축 도면·편집 디자인)를 참고해 장식보다 정보 구조와 여백으로 위계를 만든다.
  - off-white·concrete·charcoal 중립 팔레트에 단일 신호색 1개를 사용하고, 의미색은 경고·성공·오류에만 제한한다.
  - Plus Jakarta Sans·Google Fonts 의존을 제거하고 시스템 grotesk + monospace 숫자 조합을 사용한다.
  - 1px 보더 중심, radius 0/4/8px, shadow-xl·네온 글로우·backdrop-filter 최소화.
  - 기능성 타일 슬라이드만 유지하고 pulse·bounce·spring 장식은 제거하며 `prefers-reduced-motion`에 대응한다.
  - 이모지·PNG 스프라이트·lucide 혼용을 줄이고 단일 라인 아이콘 또는 텍스트 라벨로 통일한다.
- **AI 디자인 금지·지양 목록**:
  - 보라·파랑 그라데이션, glassmorphism/backdrop blur, 네온 글로우
  - 9999px pill, 큰 둥근 카드, 모든 요소의 그림자+둥근 모서리
  - 이모지 스파클(✨), 의미 없는 중앙 정렬 히어로, 무작위 강조색
  - 모드별 4색 카드, 과도한 spring/bounce, 장식 목적의 애니메이션
- **대상 파일**: `src/styles/index.css`, `src/styles/App.css`, `index.html`, 필요 시 디자인 토큰 주석/문서
- **완료 기준(DoD)**:
  - 색상·타이포·간격·radius·보더·그림자·모션 토큰을 CSS 변수로 정의
  - AI 디자인 금지·지양 목록과 화면별 마이그레이션 기준 작성
  - 전역 배경·앱 셸·공통 버튼/표면에 토큰 적용
  - 최소 폰트 크기·대비·line-height·tabular-nums 기준 명시
  - `npm test`, `npx tsc --noEmit`, `npm run build` PASS

### 진행 결과

- `src/styles/index.css`의 `:root`를 심플·어반 디자인 토큰으로 교체함. `--color-*`(중립 10종·신호색 7종·의미색 9종), `--font-*`(시스템 grotesk·monospace·12~40px 크기·행간·굵기), `--space-*`(4px 기준 11단계), `--radius-0|1|2`, `--border-*`, `--focus-ring-*`, `--shadow-*`, `--motion-*`, `--z-*`, `--layout-*`를 정의함.
- 기존 화면과의 호환을 위해 `--bg-*`, `--text-*`, `--primary-*`, `--success-*`, `--amber-*`, `--radius-sm|md|lg|xl`, `--shadow-lg|xl`, `--transition-*`를 새 토큰의 별칭으로 매핑함. `--radius-xl`은 8px, `--transition-spring`은 표준 easing으로 바꿔 spring 장식을 제거함. 레거시 별칭은 TASK-DEV-26에서 화면별 CSS와 함께 제거할 예정임.
- `html`/`body`에 시스템 폰트, `#EFEFEA` 평면 배경, `#22221D` 기본 텍스트, `line-height: 1.5`, `font-variant-numeric: tabular-nums`를 적용함. 타이머·이동 수용 `.u-numeric` 유틸리티(monospace + tabular-nums)를 추가함.
- `App.css`의 `.app-container` radial-gradient를 단색 `--color-canvas`로 교체하고, `.game-card`를 1px 보더·8px radius·그림자 없음으로 정리함. `.global-toast-banner`는 신호색 700 배경·4px radius·최소 그림자로, `.app-footer`는 12px 메타 텍스트로 토큰화함. 480px·380px·낮은 높이 미디어 쿼리의 여백도 `--space-*`로 통일함.
- `index.html`에서 Google Fonts preconnect·stylesheet 3건을 제거하고 `theme-color`를 `#EFEFEA`, `color-scheme`을 `light`로 설정함. 이모지 파비콘을 흑백 격자 + 신호색 타일 SVG로 교체함.
- 전역 키프레임 `fadeIn`의 scale, `pulseGlow`의 파란 box-shadow, `popIn`의 1.04배 overshoot를 제거해 opacity·짧은 translateY 기반으로 바꿈. `@media (prefers-reduced-motion: reduce)`에서 애니메이션·트랜지션 시간을 0.01ms, 반복을 1회로 제한하는 전역 규칙을 추가함.
- `root/DESIGN_SYSTEM.md`를 신설해 토큰 표, 가독성 기준(최소 12px·행간·굵기·tabular-nums·WCAG AA 대비·포커스·44px 터치), 금지·지양·허용 예외 목록, 화면별 마이그레이션 기준과 DEV-26 잔여 항목을 기록함.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - `npm run preview` 프로덕션 프리뷰의 데스크톱 Chromium에서 computed style·CSS 변수·Google Fonts 요청·콘솔 메시지 확인
  - 360×800·1280×800 iframe 뷰포트에서 타이틀·게임 화면의 `scrollWidth`/`scrollHeight`, 보드·게임 카드·모달 스타일 측정
  - 키보드 Tab으로 타이틀 버튼에 포커스한 뒤 `outline` computed style 확인
  - WCAG 2.1 상대 휘도 공식으로 주요 전경·배경 조합의 대비 계산
- **결과**:
  - `npm test`: 29개 파일/183개 테스트 PASS. CSS 변경만 있어 테스트 추가·수정은 없음.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공(기존 `sheet_ui_fx.css` 빌드 시점 경고 1건 유지).
  - 토큰 해석: `--color-canvas #EFEFEA`, `--color-paper #F7F7F3`, `--color-signal-600 #BB3E0B`, `--radius-xl 8px`, `--shadow-xl 0 8px 24px rgba(23, 23, 19, .12)`, `--transition-spring 180ms cubic-bezier(0.2, 0, 0, 1)` 확인.
  - 전역 렌더링: `body` `font-family`가 시스템 스택, `font-size 16px`·`line-height 24px`·`font-variant-numeric tabular-nums`, 배경 `rgb(239, 239, 234)`, `.app-container` `background-image: none`. Google Fonts 스타일시트·폰트 요청 0건, 콘솔 error·warning 0건. `theme-color #EFEFEA`, `color-scheme light` 확인.
  - 포커스: `outline: 2px solid #BB3E0B`, `outline-offset: 2px` 확인.
  - 360×800 타이틀: 가로 오버플로 0건, 상단 바 좌우 4~350px. 세로 스크롤은 허용됨.
  - 360×800 게임: `bodyScrollHeight`/`documentElement.scrollHeight` 800px, 가로 오버플로 0건, 보드 310×310, 게임 카드 1px 보더·4px radius·그림자 없음(380px 이하 규칙).
  - 1280×800 게임: `bodyScrollHeight` 800px, 가로 오버플로 0건, 게임 카드 1px 보더·8px radius·그림자 없음. 테마 모달 패널 1px 보더·8px radius·축소 그림자·0.18s 표준 easing. `backdrop-filter: blur(4px)`는 TASK-DEV-26 제거 대상으로 남음.
  - 대비: charcoal/paper 14.87:1, graphite/paper 7.81:1, steel/paper 5.73:1, signal-600/paper 5.14:1, white/signal-600 5.52:1, success-strong/success-subtle 5.79:1, warning/warning-subtle 5.27:1, danger-strong/danger-subtle 6.17:1, border-strong/paper 3.61:1. 일반 텍스트 4.5:1, UI 경계 3:1 기준 충족.
  - 잔여 마이그레이션 규모: 컴포넌트 CSS의 그라데이션 47건, `backdrop-filter` 14건, `border-radius: 9999px` 5건, 12px 미만 `font-size` 선언 38건(13개 CSS 파일), UI 이모지 19곳. PWA manifest의 `background_color #0f172a`·`theme_color #2563eb`는 SW 캐시 갱신과 함께 TASK-DEV-26에서 처리할 대상으로 남김.
- **미실행**: 실제 모바일 실기기·Safari/Firefox 렌더링·스크린리더 수동 검증, OS 수준 `prefers-reduced-motion` 에뮬레이션은 수행하지 않았음. 360×800·1280×800 측정은 브라우저 창 크기 변경 대신 동일 출처 iframe 뷰포트로 수행함. 화면별 그라데이션·블러·작은 글자·이모지 제거와 스크린샷 비교는 TASK-DEV-26·TASK-QA-09 범위임.
- **증거**: `src/styles/index.css`, `src/styles/App.css`, `index.html`, `root/DESIGN_SYSTEM.md`, `root/FEATURES.md`, `README.md`, 터미널 실행 결과, 프로덕션 프리뷰 computed style·네트워크·콘솔 측정 결과, 360×800/1280×800 iframe 레이아웃 측정 결과, 대비 계산 결과

---

## TASK-DEV-26 — 전 화면 심플·어반 UI/UX 적용 및 가독성 개선

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **완료일**: 2026-11-08
- **목표**: TASK-DEV-25에서 수립한 디자인 시스템을 타이틀·게임 HUD·컨트롤·보드·모달·업적·PWA 화면에 적용해 심플하고 도시적인 UI/UX와 읽기 쉬운 정보 위계를 완성한다.
- **적용 범위**:
  - 타이틀: 그라데이션 로고 배지·이모지 히어로·4색 모드 카드를 축소하고 강한 워드마크·명확한 모드 목록·1차 CTA 중심으로 재구성
  - HUD·컨트롤: 카드·필·그라데이션을 줄이고 1줄 HUD·세그먼트/텍스트 툴바 적용, 타이머·이동 수는 monospace/tabular-nums
  - 보드: 테마 이미지와 0.12s 타일 슬라이드는 유지하고 빈 슬롯·힌트의 네온 글로우와 text-shadow 축소, 숫자 대비 강화
  - 모달: solid dim overlay, flat panel, 1px border, 8px radius, 좌측 정렬 제목. 기존 포커스 트랩 유지
  - 업적·PWA·토스트: 금색 글로우와 과한 그림자를 제거하고 플랫 리스트·보더 중심으로 정리
  - 문구: UI 이모지(🧩·🎬·💡·🔥·⚡·👣·🛡️)를 제거하고 텍스트 또는 단일 아이콘 체계로 통일
- **완료 기준(DoD)**:
  - 전 화면에서 그라데이션·네온 글로우·과도한 radius/shadow·이모지 UI를 제거하거나 최소화
  - 360px·데스크톱에서 정보 위계·줄바꿈·오버플로·터치 영역 확인
  - 본문·메타 텍스트 최소 크기와 WCAG AA 대비 충족, 타이머·이동 수 가독성 개선
  - `prefers-reduced-motion` 대응, 키보드 포커스 가시성 유지
  - 변경 전·후 360×800·1280×800 스크린샷과 `npm test`, `npx tsc --noEmit`, `npm run build` 결과 기록

### 진행 결과

- `TitleScreen`: 그라데이션 로고 배지·이모지 히어로·모드별 4색 카드·9999px pill 제거. 좌측 정렬 워드마크, 01~04 모드 인덱스, 단일 신호색 선택 보더, 선택 모드에만 채워지는 신호색 CTA, 1px 보더·8px radius·그림자 없는 모드 카드로 재구성함. 상단 유틸리티와 모드 크기 선택은 텍스트·세그먼트 컨트롤로 정리하고, PNG 트로피·사운드·재생 아이콘을 lucide 아이콘으로 교체함.
- `Header`: 상단 유틸리티와 3셀 통계 바를 1줄 HUD로 정리함. 이동 수·시간·최고 기록 라벨은 12px, 값은 monospace/tabular-nums로 표시하고, 카드별 그림자·호버 이동을 제거함. 시간 초과/이동 수 부족 상태는 의미색 배경과 inset 보더로만 표시하도록 정리함(당시 `urgent-timer` 클래스와 CSS `urgent-time` 불일치는 기존 동작 보존을 위해 변경하지 않음).
- `Controls`: 잠금 모드 표시를 평면 보더 바로, AI 힌트·사진·일일·업적·Undo·테마·미리보기·번호 힌트를 lucide 아이콘 텍스트 툴바로 교체함. 주요 툴바·액션 버튼은 44px 터치 영역, 액션 버튼은 선택 모드 신호색/보조 아웃라인으로 정리함.
- `Board·Tile`: 보드 2px 보더·그림자를 1px 보더·그림자 없음으로 바꾸고 그리드 슬롯의 점선 보더를 단색 보더로 교체함. 빈 슬롯 글로우 PNG·애니메이션과 미사용 스파클 상태를 제거하고, 힌트 방사형 그라데이션·blur·text-shadow를 신호색 2px 보더와 charcoal 화살표 배지로 교체함. 숫자 오버레이는 12px·불투명 charcoal 배경으로 대비를 강화함.
- `Modal`: 8종 모달의 공통 패턴을 solid dim overlay(`rgba(23, 23, 19, 0.62)`), `backdrop-filter: none`, 평면 패널, 1px 보더, 8px radius, 그림자 없음, 좌측 정렬 제목, 0.18s 표준 easing으로 통일함. 테마·업적·BGM·커스텀 이미지·일일·힌트 모달의 PNG 아이콘을 lucide로 교체하고, 12px 미만 텍스트를 모두 12px 이상으로 올림. WinModal은 트로피 PNG·별 PNG를 lucide Trophy·Star로, GameOverModal은 PNG 버튼 아이콘을 lucide로 교체함. 기존 포커스 트랩·`inert`·Escape 닫기는 유지함.
- `AchievementToast·PWA`: 업적 토스트의 금색 그라데이션·방사형 글로우·Sparkles를 제거하고 charcoal 평면 카드·신호색 테두리·Trophy 아이콘으로 정리함. PWA 설치/업데이트 배너의 `shadow-xl`·1.5px 강조 보더·trophy PNG를 제거하고 평면 1px 보더·lucide 아이콘·신호색 CTA로 교체함.
- `i18n·shareCardGenerator`: 번역문의 💡·🏆·🎵·🧩와 TSX의 🔥·⚡·👣·🛡️·🎬·🧩·📸를 제거함. 공유 카드의 다크 그라데이션·파랑/금색 강조·🧩를 off-white·charcoal·signal 팔레트의 평면 카드로 교체하고, 제목을 텍스트 워드마크로 변경함.
- `index.css`: 사용하지 않는 스프라이트 CSS·`pulseGlow`·`sparklePop` 키프레임과 `--shadow-lg|xl`·`--radius-sm|md|lg|xl`·`--transition-normal|spring` 등 레거시 별칭을 제거함. `--color-board`·`--color-tile`·`--color-tile-text`·`--color-tile-empty`를 1급 토큰으로 승격하고 게임 표면 CSS를 새 토큰으로 교체함.
- `index.html`·`assetPreloader`: 스프라이트 스타일시트·이미지 프리로드를 제거하고, 코어 PNG 16건 프리로드를 0건으로 줄여 최초 프리로드를 현재 테마 이미지 1건으로 축소함. `public/sw.js` 프리캐시 목록은 TASK-DEV-26 범위 제외로 수정하지 않음.

### 검증

- **실행·확인 방법**:
  - `npm test` (Node.js 26.13.0, `NODE_OPTIONS=--localstorage-file=<임시 파일>`)
  - `npx tsc --noEmit`
  - `npm run build`
  - 프로덕션 프리뷰(4173)의 데스크톱 Chromium에서 computed style·Google Fonts/스프라이트 요청·콘솔 메시지 확인
  - 동일 출처 iframe 360×800·1280×800에서 타이틀·게임·주요 모달의 `scrollWidth`/`scrollHeight`·패널 보더·radius·그림자·backdrop-filter·12px 미만 텍스트·오버플로 측정
  - 헤드리스 Edge로 변경 전·후 타이틀·게임 360×800·1280×800과 Win/GameOver 1280×800 캡처
  - `dist` CSS/HTML 정적 감사로 그라데이션·backdrop-filter·9999px pill·스프라이트 참조·UI 이모지·800/900 굵기 확인
- **결과**:
  - `npm test`: 29개 파일/183개 테스트 PASS. 첫 전체 실행에서 localStorage 병렬 실행 영향으로 `audioManager.test.ts` 1건이 일시 실패했으나 단독 실행과 전체 재실행에서 통과함.
  - `npx tsc --noEmit`: 0 Errors.
  - `npm run build`: Vite 6.4.3 프로덕션 빌드 성공. `sheet_ui_fx.css` 링크 제거로 기존 빌드 시점 경고도 해소됨. `dist/index.html` 2.27KB, CSS 73.65KB(gzip 9.86KB), JS 360.74KB(gzip 112.10KB).
  - 정적 감사: 컴포넌트/빌드 CSS의 그라데이션 0건, `backdrop-filter` 0건, `border-radius: 9999px` 0건, 12px 미만 `font-size` 0건, 800·900 굵기 0건. 빌드 HTML의 스프라이트 CSS·프리로드 0건, UI 문구 이모지 0건.
  - 타이틀: 360×800 가로 오버플로 0건·4개 모드 카드·좌측 정렬 48px 워드마크·`img` 요소 0건. 1280×800에서 2×2 모드 그리드와 선택 모드 신호색 CTA 확인.
  - 게임: 360×800 `bodyScrollHeight`/`documentElement.scrollHeight` 800px, 가로 오버플로 0건, 보드 310×310, 툴바·액션 버튼 44px, 상단 유틸리티 36px, 푸터 12px. 1280×800 `bodyScrollHeight` 800px, 가로 오버플로 0건, 게임 카드 1px 보더·8px radius·그림자 없음.
  - 모달: 360×800·1280×800에서 업적·일일·BGM·커스텀 이미지·테마·힌트 모달의 overlay가 `rgba(23, 23, 19, 0.62)`·`backdrop-filter: none`, 패널이 1px 보더·8px radius·`box-shadow: none`, 12px 미만 텍스트 0건, 가로 오버플로 0건임을 확인. Win/GameOver는 1280×800 스크린샷과 CSS 검사로 확인.
  - 접근성 테스트: PNG `alt` 검증을 lucide 아이콘을 포함한 버튼의 접근성 이름 검증으로 대체함. 버튼 `aria-label`과 내부 SVG 존재를 확인해 동등한 접근성 계약을 유지함.
  - reduced motion: `prefers-reduced-motion: reduce` 전역 규칙이 빌드 CSS에 포함됨을 확인. 실제 OS 설정 에뮬레이션은 미실행.
- **미실행**: 실제 모바일 실기기·Safari/Firefox 렌더링·스크린리더 수동 검증, OS 수준 `prefers-reduced-motion` 에뮬레이션, 공유 카드의 실제 공유 시트·다운로드 이미지, PWA manifest 색상(`#0f172a`/`#2563eb`)과 SW 프리캐시 목록 갱신은 확인하지 않았음. 360×800·1280×800 측정은 브라우저 창 크기 변경 대신 동일 출처 iframe/헤드리스 뷰포트로 수행함. 시각 회귀·잔여 문제 발주는 TASK-QA-09 범위임.
- **증거**: `src/components/Title/**`, `src/components/Header/**`, `src/components/Controls/**`, `src/components/Board/**`, `src/components/Modal/**`, `src/components/Achievement/**`, `src/components/PWA/**`, `src/i18n/translations.ts`, `src/utils/shareCardGenerator.ts`, `src/utils/assetPreloader.ts`, `src/styles/index.css`, `src/styles/App.css`, `index.html`, `root/DESIGN_SYSTEM.md`, `root/archive/assets/task-dev-26/title-before-360x800.webp`, `title-after-360x800.webp`, `game-before-360x800.webp`, `game-after-360x800.webp`, `title-before-1280x800.webp`, `title-after-1280x800.webp`, `game-before-1280x800.webp`, `game-after-1280x800.webp`, `win-after-1280x800.webp`, `gameover-after-1280x800.webp`, 터미널 실행 결과, 브라우저 computed style·레이아웃 측정 결과
