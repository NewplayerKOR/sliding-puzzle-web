# FEATURES.md - Feature Registry & Release Notes

[기록 기준]

- 기록 대상: 사용자 또는 클라이언트 관점에서 실제로 구현 및 검증이 완료된 기능을 기록한다. 예정 기능과 미완료 요구사항은 TASKS.md에서 관리한다.
- 현재 명세 유지: 기존 기능을 변경하면 기능 카탈로그의 동작·API 계약·제약·관련 파일을 최신 상태로 갱신한다. 같은 기능의 옛 설명을 계속 덧붙이지 않는다.
- 버그 수정 반영: 버그 수정이라도 사용자 동작·응답·예외 처리 등 공개 계약이 바뀌면 기존 기능 명세와 필요한 변경 요약을 갱신한다. 사용자 동작이나 계약에 영향이 없는 내부 변경은 작업 기록으로 관리한다.
- 제외 대상: 단순 리팩토링·패키지 설치·내부 구현 변경을 별도 사용자 기능으로 등록하지 않는다. 작업 원문·실패 이력·상세 검증 근거는 TASKS.md의 활성 작업 또는 Phase별 완료 보관 기록에 남긴다.
- 검증 범위: 기록한 검증 범위를 넘어 완료를 주장하지 않는다. 개발 자체 검증·독립 QA·배포/운영 여부는 필요한 경우 관련 완료 기록으로 연결해 구분한다.
- 변경 이력: 사용자에게 의미 있는 변경을 짧게 기록한다. 실제로 정한 버전이나 변경 날짜를 사용하고, 작업마다 임의의 릴리스 버전을 만들지 않는다.
- 최종 갱신: 2026-11-08 / 대상 버전: v1.4.0

---

## 1. Feature Catalog (기능 카탈로그)

| 도메인 / 분류 | 기능명 | 설명 | 엔드포인트 / 컴포넌트 | 주요 파일 | 상태 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Core Game | 난이도 선택 | 3x3·4x4·5x5 보드와 난이도별 기록·제한값을 분리 운영 | `TitleScreen`, `usePuzzleGame` | `src/components/Title/TitleScreen.tsx`, `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| Core Game | 풀이 가능한 셔플 | 반전수·패리티 검사로 항상 풀 수 있는 보드를 생성하고 최대 100회 재시도 | `shuffleBoard()`, `isSolvable()` | `src/utils/puzzleLogic.ts` | 구현 완료 |
| Core Game | 타일 조작 | 클릭, 방향키/WASD, 터치 스와이프로 타일 이동. 80ms 입력 락으로 연타 시 애니메이션 깨짐 방지 | `PuzzleBoard` | `src/components/Board/PuzzleBoard.tsx` | 구현 완료 |
| Core Game | 멀티 타일 슬라이드 | 같은 행/열의 2~4칸 떨어진 타일을 클릭·스와이프하면 중간 타일까지 연쇄 슬라이드. 이동 수는 1회만 증가 | `getLineTilesToMove()`, `moveTileLine()` | `src/utils/puzzleLogic.ts`, `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| Core Game | 승리·게임오버 판정 | 목표 배열과 일치하면 승리, 제한 시간·이동 수를 넘기면 게임오버 | `checkWinCondition()` | `src/utils/puzzleLogic.ts`, `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| Game Modes | Standard | 제한 없이 플레이하고 시간·이동 수를 기록 | `usePuzzleGame`, `Header` | `src/hooks/usePuzzleGame.ts`, `src/components/Header/Header.tsx` | 구현 완료 |
| Game Modes | Time Attack | 난이도별 제한 시간 적용: 3x3 45초, 4x4 120초, 5x5 300초. 시작 시각 기반 실제 경과 시간으로 만료 판정 | `TIME_LIMITS` | `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| Game Modes | Move Limit | 난이도별 이동 수 제한 적용: 3x3 35회, 4x4 80회, 5x5 220회 | `MOVE_LIMITS` | `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| AI Solver | AI 스마트 힌트 | Manhattan + Linear Conflict A*, 4x4 서브골 리덕션, 5x5 폴백. Web Worker 비동기 처리와 3초 쿨다운. 보드·그리드·게임 상태 변경 시 요청 무효화, Worker 오류·5초 시간 초과·힌트 없음 안내 | `findNextOptimalMove()`, `solver.worker.ts` | `src/utils/aiSolver.ts`, `src/workers/solver.worker.ts`, `src/App.tsx` | 구현 완료 |
| Themes | 4종 테마·숫자 모드 | 자연·픽셀아트·기하학·동물 테마와 이미지/숫자 모드 전환, 완성본 미리보기 | `ThemeModal`, `HintModal`, `themeData` | `src/components/Modal/ThemeModal.tsx`, `src/components/Modal/HintModal.tsx`, `src/utils/themeData.ts` | 구현 완료 |
| Custom Image | 내 사진 퍼즐 | JPG·PNG·WebP·GIF 업로드(10MB 이하, MIME 검증), 클릭·드래그 앤 드롭, 512x512 Canvas 1:1 크롭, 1~3배 줌·드래그, LocalStorage 저장. 테마 모달 열기·닫기·모드 전환에는 유지하고 테마 적용 시 제거 | `CustomImageModal` | `src/components/Modal/CustomImageModal.tsx`, `src/App.tsx` | 구현 완료 |
| Daily Challenge | 일일 챌린지 | 날짜 기반 Mulberry32 시드로 4x4 보드를 결정적으로 생성하고 하루 1회 완료 기록 | `generateDailyBoard()` | `src/utils/dailyChallenge.ts`, `src/utils/prng.ts` | 구현 완료 |
| Daily Challenge | 출석 스트릭 | 현재·최대 스트릭과 월간 캘린더 표시, 3일 연속 업적과 연동 | `DailyModal`, `getDailyStreakData()` | `src/components/Modal/DailyModal.tsx`, `src/utils/dailyChallenge.ts` | 구현 완료 |
| Achievements | 12종 업적 | 승리·속도·이동 수·5x5·3성 3회·No Undo·스트릭·테마·커스텀·챌린지·전체 달성 조건 | `checkGameCompletionAchievements()` | `src/utils/achievementManager.ts`, `src/utils/achievementData.ts` | 구현 완료 |
| Achievements | 업적 토스트·도감 | 달성 즉시 토스트 알림, 도감 모달에서 달성률과 진행도 표시 | `AchievementToast`, `AchievementModal` | `src/components/Achievement/AchievementToast.tsx`, `src/components/Modal/AchievementModal.tsx` | 구현 완료 |
| Rating | 3성 별점 | 난이도·모드·시간·이동 수 기준 1~3성 산정, 승리 모달에서 조건 피드백 표시 | `calculateStars()` | `src/utils/starCalculator.ts`, `src/components/Modal/WinModal.tsx` | 구현 완료 |
| Audio | BGM 4트랙 | Lo-Fi Chill·Zen Nature·Cyber Synth·Jazz Lounge, 볼륨·음소거·테마 자동 동기화, 0.3초 페이드 전환 | `audioManager`, `BgmSelectModal`, `useAudio` | `src/utils/audioManager.ts`, `src/components/Modal/BgmSelectModal.tsx`, `src/hooks/useAudio.ts` | 구현 완료 |
| Audio | 테마 SFX·콤보 피치 | 5종 SFX와 테마별 4종 음색. 0.6초 내 연속 이동 시 최대 8콤보까지 +6% 피치 상승 | `playThemeMoveSfx()`, `getComboPitchMultiplier()` | `src/utils/audioManager.ts` | 구현 완료 |
| Undo / Replay | 1수 Undo | 이동 히스토리 기반 1수 되돌리기. 멀티 타일 이동도 1회에 복구하며 Undo 사용 시 이동 수 +1 페널티 | `undoMove()` | `src/hooks/usePuzzleGame.ts`, `src/components/Controls/Controls.tsx` | 구현 완료 |
| Undo / Replay | 타임랩스 리플레이 | 승리 모달에서 이동 히스토리를 재생·일시정지·리셋하고 1x/2x 속도 전환 | `WinModal` | `src/components/Modal/WinModal.tsx` | 구현 완료 |
| Records | 난이도별 최고 기록 | 최고 시간·이동 수를 LocalStorage에 저장하고 신기록 여부 표시 | `getBestRecords()`, `saveBestRecord()` | `src/utils/recordStorage.ts`, `src/App.tsx` | 구현 완료 |
| Sharing | 결과 카드 공유 | Canvas 1000x1000 PNG 생성 후 Web Share API → 클립보드 → 파일 다운로드 순으로 폴백 | `shareOrDownloadResult()` | `src/utils/shareCardGenerator.ts`, `src/components/Modal/WinModal.tsx` | 구현 완료 |
| PWA / Mobile | PWA 설치·오프라인 | manifest와 Service Worker v2.0으로 설치 배너·오프라인 캐싱 지원. HTML Network First, 정적 자산 Cache First | `PwaInstallBanner`, `public/sw.js` | `src/components/PWA/PwaInstallBanner.tsx`, `public/sw.js`, `public/manifest.webmanifest` | 구현 완료 |
| PWA / Mobile | 모바일 제스처·햅틱 | 100dvh·Safe Area 레이아웃, `touch-action: none`, Pull-to-refresh 차단, 이동·승리·에러 진동 피드백 | `PuzzleBoard`, `haptics` | `src/components/Board/PuzzleBoard.tsx`, `src/utils/haptics.ts`, `src/styles/index.css` | 구현 완료 |
| Localization | 4개 국어 | KO·EN·JA·ZH 번역, 테마·업적·BGM·일일·공유 카드·접근성 라벨 포함. 언어 선택을 LocalStorage에 저장하고 `html lang` 동기화 | `translations`, `useTranslation`, `formatMessage` | `src/i18n/translations.ts`, `src/i18n/useTranslation.ts`, `src/i18n/format.ts` | 구현 완료 |
| Persistence | LocalStorage 영속화 | 커스텀 이미지·업적·업적 통계·오디오 설정·언어·일일 스트릭·최고 기록을 브라우저에 저장 | `localStorage` | `src/utils/*`, `src/App.tsx`, `src/i18n/useTranslation.ts` | 구현 완료 |
| UI / UX | 반응형 UI·애니메이션 | 타이틀·HUD·툴바·8종 모달·토스트, 0.12s 타일 트랜지션과 60fps 하드웨어 가속 | `App`, `components` | `src/App.tsx`, `src/components/**`, `src/styles/**` | 구현 완료 |

---

## 2. Changelog (변경 이력)

### v1.4.0 (2026-08-17)

- 멀티 타일 슬라이드(Multi-Tile Push) 엔진과 1회 Undo 복구 지원.
- 테마별 4종 특화 SFX(Classic/Wood/Neon/Nature)와 0.6초 연속 이동 콤보 피치 시스템 추가.
- Time Attack·기록 타이머를 시작 시각 기반으로 보정해 메인 스레드 지연·백그라운드 스로틀링에서도 실제 경과 시간을 반영.
- 테마·업적·BGM·일일 캘린더·공유 카드·단위·접근성 라벨의 잔여 하드코딩을 4개 국어 번역 키로 이관하고 `html lang`을 선택 언어와 동기화.
- 커스텀 이미지가 테마 모달 열기·닫기와 이미지/숫자 모드 전환에서 유지되고 테마 적용 시에만 제거되도록 수정. 드래그 앤 드롭과 MIME·10MB·저장 공간 오류 피드백 추가.
- AI 힌트 계산 중 보드·그리드·게임 상태가 바뀌면 이전 요청 결과를 무시하고, Worker 오류·시간 초과·힌트 없음 상태를 4개 국어로 안내.
- v1.4.0 기준 기능 카탈로그를 2026-11-08에 정리.

### v0.0.0 (초기화)

- 프로젝트 기본 거버넌스 및 문서 구조 생성 완료.

---

## 3. Verification (검증 기준)

- **단위·통합 테스트**: `npm test` — 18개 테스트 파일 / 127개 케이스 전건 PASS (2026-11-08, Node.js 26.13.0).
- **타입 검사**: `npx tsc --noEmit` — 0 Errors (`npm run build`의 tsc 단계에서 확인).
- **프로덕션 빌드**: `npm run build` — Vite 6.4.3 빌드 성공 (2026-11-08).
- **미실행**: 실제 모바일 실기기(iOS Safari·Android Chrome) 수동 검증은 수행하지 않았다. 데스크톱 Chromium에서는 TASK-DEV-15로 EN 전 화면·JA/ZH 핵심 화면과 공유 카드 PNG를, TASK-DEV-16으로 커스텀 이미지 드래그·보존·검증 오류를, TASK-DEV-17로 AI 힌트 무효화·힌트 없음·시간 초과를 확인했다.
- **Node.js 26 참고**: Vitest 실행 시 jsdom의 `localStorage` 초기화를 위해 `NODE_OPTIONS=--localstorage-file=<임시 파일>` 지정이 필요하다. 지정하지 않으면 localStorage 관련 테스트가 실패한다.
