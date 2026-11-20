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
| Game Modes | Time Attack | 난이도별 제한 시간 적용: 3x3 45초, 4x4 120초, 5x5 300초. 시작 시각 기반 실제 경과 시간으로 만료 판정하고, 이동 처리 시점에도 경과 시간을 검사해 250ms 틱 사이·탭 복귀 직후의 제한 시간 초과 이동·승리를 거부 | `TIME_LIMITS` | `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| Game Modes | Move Limit | 난이도별 이동 수 제한 적용: 3x3 35회, 4x4 80회, 5x5 220회 | `MOVE_LIMITS` | `src/hooks/usePuzzleGame.ts` | 구현 완료 |
| AI Solver | AI 스마트 힌트 | Manhattan + Linear Conflict A*, 4x4 서브골 리덕션, 5x5 폴백. Web Worker 비동기 처리와 3초 쿨다운. 보드·그리드·게임 상태 변경 시 요청 무효화, Worker 오류·5초 시간 초과·힌트 없음 안내 | `findNextOptimalMove()`, `solver.worker.ts` | `src/utils/aiSolver.ts`, `src/workers/solver.worker.ts`, `src/App.tsx` | 구현 완료 |
| Themes | 4종 테마·숫자 모드 | 자연·픽셀아트·기하학·동물 테마와 이미지/숫자 모드 전환, 완성본 미리보기 | `ThemeModal`, `HintModal`, `themeData` | `src/components/Modal/ThemeModal.tsx`, `src/components/Modal/HintModal.tsx`, `src/utils/themeData.ts` | 구현 완료 |
| Custom Image | 내 사진 퍼즐 | JPG·PNG·WebP·GIF 업로드(10MB 이하, MIME 검증), 클릭·드래그 앤 드롭, 512x512 Canvas 1:1 크롭, 1~3배 줌·드래그·방향키 팬, LocalStorage 저장. 테마 모달 열기·닫기·모드 전환에는 유지하고 테마 적용 시 제거. 모달을 다시 열 때 저장소 상태와 동기화하고, 이미지 로드 전·실패 시 Apply를 비활성화해 빈 캔버스 저장을 막음 | `CustomImageModal` | `src/components/Modal/CustomImageModal.tsx`, `src/App.tsx` | 구현 완료 |
| Daily Challenge | 일일 챌린지 | 날짜 기반 Mulberry32 시드로 4x4 보드를 결정적으로 생성하고 하루 1회 완료 기록. 시작 날짜와 보드 식별자를 함께 보관해 실제 Daily 보드가 일치할 때만 해당 시작 날짜로 저장하고, 홈 복귀·커스텀 이미지·새 게임·다시 플레이·모드/그리드 변경 시 활성 컨텍스트를 해제함 | `generateDailyBoard()`, `createBoardKey()` | `src/utils/dailyChallenge.ts`, `src/utils/prng.ts`, `src/App.tsx` | 구현 완료 |
| Daily Challenge | 출석 스트릭 | 현재·최대 스트릭과 월간 캘린더 표시, 3일 연속 업적과 연동. 캘린더는 `ul`/`li` 목록과 `aria-labelledby`를 사용하고 날짜별 `aria-label`·완료 상태·오늘 `aria-current="date"`를 제공 | `DailyModal`, `getDailyStreakData()` | `src/components/Modal/DailyModal.tsx`, `src/utils/dailyChallenge.ts` | 구현 완료 |
| Achievements | 12종 업적 | 승리·속도·이동 수·5x5·3성 3회·No Undo·스트릭·테마·커스텀·챌린지·전체 달성 조건. 저장된 달성 상태·진행도는 유지하고 제목·설명·아이콘 등 정적 메타데이터는 최신 정의를 사용 | `checkGameCompletionAchievements()` | `src/utils/achievementManager.ts`, `src/utils/achievementData.ts` | 구현 완료 |
| Achievements | 업적 토스트·도감 | 다중 달성 시 4.5초 간격 큐로 모든 업적을 순차 알림하고 타이머를 정리, 도감 모달에서 달성률과 진행도 표시. 토스트는 `role="status"`·`aria-live="polite"`, 진행 바는 `progressbar` 값으로 스크린리더에 전달 | `AchievementToast`, `AchievementModal` | `src/components/Achievement/AchievementToast.tsx`, `src/components/Modal/AchievementModal.tsx` | 구현 완료 |
| Rating | 3성 별점 | 난이도·모드·시간·이동 수 기준 1~3성 산정, 승리 모달에서 조건 피드백 표시 | `calculateStars()` | `src/utils/starCalculator.ts`, `src/components/Modal/WinModal.tsx` | 구현 완료 |
| Audio | BGM 4트랙 | Lo-Fi Chill·Zen Nature·Cyber Synth·Jazz Lounge, 96kbps MP3, 볼륨·음소거·테마 자동 동기화, 0.3초 페이드 전환. 최초에는 현재 트랙만 로드. 자동 연동을 켜면 현재 테마의 권장 BGM으로 즉시 전환하고 이후 테마 변경에도 동기화. BGM 설정 모달의 음소거 버튼은 동작·상태를 포함한 `aria-label`과 `aria-pressed`를 제공 | `audioManager`, `BgmSelectModal`, `useAudio` | `src/utils/audioManager.ts`, `src/components/Modal/BgmSelectModal.tsx`, `src/hooks/useAudio.ts` | 구현 완료 |
| Audio | 테마 SFX·콤보 피치 | 5종 SFX와 테마별 4종 음색. 0.6초 내 연속 이동 시 최대 8콤보까지 +6% 피치 상승. Web Audio와 HTMLAudio 폴백 모두 `sfxVolume`을 한 번만 적용해 동일한 음량 스케일 유지 | `playThemeMoveSfx()`, `getComboPitchMultiplier()` | `src/utils/audioManager.ts` | 구현 완료 |
| Undo / Replay | 1수 Undo | 이동 히스토리 기반 1수 되돌리기. 멀티 타일 이동도 1회에 복구하며 Undo 사용 시 이동 수 +1 페널티 | `undoMove()` | `src/hooks/usePuzzleGame.ts`, `src/components/Controls/Controls.tsx` | 구현 완료 |
| Undo / Replay | 타임랩스 리플레이 | 승리 모달에서 이동 히스토리를 재생·일시정지·리셋하고 1x/2x 속도 전환 | `WinModal` | `src/components/Modal/WinModal.tsx` | 구현 완료 |
| Records | 난이도별 최고 기록 | 최고 시간·이동 수를 LocalStorage에 저장하고 신기록 여부 표시 | `getBestRecords()`, `saveBestRecord()` | `src/utils/recordStorage.ts`, `src/App.tsx` | 구현 완료 |
| Records | 읽기 전용 정답 보기 | 현재 보드·타이머·이동 수·Undo 기록을 바꾸지 않고 완성 보드를 이미지/숫자 모드로 미리 보여줌. 미리보기 경로에서는 승리·기록·업적·Daily 완료가 발생하지 않음 | `SolutionModal`, `generateSolvedBoard()` | `src/components/Modal/SolutionModal.tsx`, `src/App.tsx` | 구현 완료 |
| Sharing | 결과 카드 공유 | Canvas 1000x1000 PNG 생성 후 Web Share API → 클립보드 → 파일 다운로드 순으로 폴백. 공유 시트 취소(`AbortError`)는 폴백 없이 종료하고, 실제 실패·Blob 생성 실패·이미지 로드 타임아웃을 안내하며 다운로드 Object URL은 1초 후 해제 | `shareOrDownloadResult()` | `src/utils/shareCardGenerator.ts`, `src/components/Modal/WinModal.tsx` | 구현 완료 |
| PWA / Mobile | PWA 설치·오프라인 | manifest와 Service Worker v2.4로 설치 배너·오프라인 캐싱 지원. 매니페스트 색상은 `#EFEFEA`/`#BB3E0B`, `orientation`은 제거해 가로 태블릿·데스크톱 설치를 허용. 192·512 `any`·maskable 2종·apple-touch-icon을 현재 팔레트로 제공. Vite 빌드 시 해시된 엔트리 JS·CSS·solver worker를 `dist/sw.js` 프리캐시에 자동 주입해 최초 설치 직후 오프라인 재로드에서도 앱 셸이 실행됨. HTML Network First(비정상 응답·오프라인 시 캐시 폴백), 정적 자산 Cache First(`ignoreVary` 보정), 새 버전은 안내 배너에서 선택할 때만 반영. 등록 시작 시점의 controller·기존 active/waiting으로 첫 설치와 업데이트를 구분해 첫 설치 오탐을 막고, 업데이트 배너는 헤더 버튼을 가리지 않도록 아래에 표시. 프리캐시 17건/약 1.21MB, 현재 BGM·선택 테마는 첫 사용 시 런타임 캐시(오디오 Range 206 응답은 전체 파일로 보완). 설치 프롬프트 거부·오류·`appinstalled`를 안전하게 처리 | `PwaInstallBanner`, `ServiceWorkerUpdateBanner`, `public/sw.js`, `collectPrecacheAssets()` | `src/components/PWA/PwaInstallBanner.tsx`, `src/components/PWA/ServiceWorkerUpdateBanner.tsx`, `src/utils/swUpdateManager.ts`, `src/utils/swPrecache.ts`, `public/sw.js`, `public/manifest.webmanifest`, `public/assets/icons/icon-*.png`, `scripts/generate-pwa-icons.js` | 구현 완료 |
| PWA / Mobile | 모바일 제스처·햅틱 | 100dvh·Safe Area 레이아웃, 전역 `touch-action: manipulation`, 보드 non-passive 터치 스크롤 차단, 이동·승리·에러 진동 피드백. 문서 스크롤은 html이 담당하고 body는 `overflow-x: clip`으로 가로만 잘라 모바일 세로 스크롤을 유지함. 모달 열림 중에는 html·body overflow를 함께 잠그고 닫힘 시 복원 | `PuzzleBoard`, `haptics`, `useBodyScrollLock` | `src/components/Board/PuzzleBoard.tsx`, `src/utils/haptics.ts`, `src/styles/index.css`, `src/hooks/useBodyScrollLock.ts` | 구현 완료 |
| Performance | 초기 로딩·에셋 최적화 | 최초 로드에 코어 이미지·현재 테마·현재 BGM만 로드하고 나머지 테마는 테마 모달에서 지연 로드. BGM 96kbps MP3, 스프라이트·아이콘 팔레트 PNG 압축(3.59MB→0.52MB). dist 20.65→11.04MB, 초기 동일 출처 decodedBodySize 9,222,220→2,716,771바이트 | `assetPreloader`, `useAssetPreloader`, `audioManager`, SW | `src/utils/assetPreloader.ts`, `src/hooks/useAssetPreloader.ts`, `src/utils/audioManager.ts`, `public/sw.js` | 구현 완료 |
| Localization | 4개 국어 | KO·EN·JA·ZH 번역, 테마·업적·BGM·일일·공유 카드·접근성 라벨 포함. 언어 선택을 LocalStorage에 저장하고 `html lang` 동기화 | `translations`, `useTranslation`, `formatMessage` | `src/i18n/translations.ts`, `src/i18n/useTranslation.ts`, `src/i18n/format.ts` | 구현 완료 |
| Persistence | LocalStorage 영속화 | 커스텀 이미지·업적·업적 통계·오디오 설정·언어·일일 스트릭·최고 기록을 브라우저에 저장. 공통 storage 래퍼로 접근 차단·쓰기 실패·손상 JSON을 흡수하고, 일일 스트릭·기록·업적·오디오·언어·커스텀 이미지 값을 스키마 검증 후 기본값으로 폴백 | `localStorage`, `storage` | `src/utils/storage.ts`, `src/utils/*`, `src/App.tsx`, `src/i18n/useTranslation.ts` | 구현 완료 |
| UI / UX | 심플·어반 디자인 시스템 | off-white·concrete·charcoal 중립 팔레트와 단일 신호색, 시스템 grotesk·monospace 숫자, 1px 보더·0/4/8px radius·최소 그림자·기능성 모션·`prefers-reduced-motion` 전역 대응. 타이틀·HUD·컨트롤·보드·8종 모달·업적·PWA·공유 카드에 적용하고 그라데이션·블러·글로우·9999px pill·UI 이모지를 제거, lucide 단일 아이콘으로 통일 | 디자인 토큰 | `src/styles/index.css`, `src/styles/App.css`, `index.html`, `src/components/**`, `src/utils/shareCardGenerator.ts`, `root/DESIGN_SYSTEM.md` | 전 화면 적용 완료 |
| UI / UX | 반응형 UI·애니메이션·접근성 | 타이틀·HUD·툴바·8종 모달·토스트, 0.12s 타일 트랜지션과 60fps 하드웨어 가속. 360px 상단 바 2줄 배치·아이콘 툴바·높이 기반 보드 축소로 360×800·1280×800 1화면 배치, non-passive 터치 스크롤 차단. 모달 제목·카드명·스트릭 라벨은 한국어 단어 단위 줄바꿈과 2줄 이름 표시로 360px 잘림을 방지. 언어 select 32~34px·볼륨 슬라이더 32px·PWA CTA/닫기 44px로 터치 타깃을 확보하고, 400px 이하 아이콘 전용 업데이트 버튼에 `aria-label` 제공. PWA 설치 배너는 480px 이하에서 설명 2줄·액션 행 분리. 모달 포커스 트랩·배경 `inert`·보드 키 입력 차단, 모달 열림 중 html·body 루트 스크롤 잠금·`overscroll-behavior: contain`, 승리/게임오버 시 보조 모달 자동 종료, `main` landmark·보드 group 역할·확대 허용(`maximum-scale=5.0`)·WCAG AA 대비·`focus-visible` 외곽선 포함. 모바일 문서 세로 스크롤을 html 루트에서 유지하고, 업데이트 배너는 헤더 버튼 아래에 배치. 업적 토스트 polite status, PWA complementary landmark, Daily 캘린더 `list`/`aria-current`, 장식 모드 카드, 오디오 토글 `aria-pressed`, 전역 텍스트 선택, 캔버스 방향키 팬, 진행 중 홈 복귀 확인 모달 적용 | `App`, `components`, `useModalFocusTrap`, `useBodyScrollLock` | `src/App.tsx`, `src/components/**`, `src/styles/**`, `src/hooks/useModalFocusTrap.ts`, `src/hooks/useBodyScrollLock.ts`, `index.html` | 구현 완료 |

---

## 2. Changelog (변경 이력)

### v1.4.0 (2026-08-17)

- 멀티 타일 슬라이드(Multi-Tile Push) 엔진과 1회 Undo 복구 지원.
- 테마별 4종 특화 SFX(Classic/Wood/Neon/Nature)와 0.6초 연속 이동 콤보 피치 시스템 추가.
- Time Attack·기록 타이머를 시작 시각 기반으로 보정해 메인 스레드 지연·백그라운드 스로틀링에서도 실제 경과 시간을 반영.
- 테마·업적·BGM·일일 캘린더·공유 카드·단위·접근성 라벨의 잔여 하드코딩을 4개 국어 번역 키로 이관하고 `html lang`을 선택 언어와 동기화.
- 커스텀 이미지가 테마 모달 열기·닫기와 이미지/숫자 모드 전환에서 유지되고 테마 적용 시에만 제거되도록 수정. 드래그 앤 드롭과 MIME·10MB·저장 공간 오류 피드백 추가.
- AI 힌트 계산 중 보드·그리드·게임 상태가 바뀌면 이전 요청 결과를 무시하고, Worker 오류·시간 초과·힌트 없음 상태를 4개 국어로 안내.
- 모달이 열리면 포커스가 모달 내부에서 순환하고 닫을 때 이전 요소로 복원되며, 배경 콘텐츠는 `inert`·`aria-hidden`으로 비활성화됨. 보드는 모달 열림 중과 `SELECT`·`INPUT`·`TEXTAREA` 포커스 시 방향키/WASD 입력을 무시함.
- 보드를 유효한 `group`으로 단순화하고 타이틀에 `main` landmark를 추가함. 모드 카드의 중첩 버튼 역할을 제거하고 크기 pill에 `aria-pressed`를 적용함.
- 모바일 확대를 허용(`maximum-scale=5.0`)하고 툴바·크기 pill·강조 텍스트의 WCAG AA 대비를 보정함. BGM·SFX 라벨과 `alt`를 4개 국어로 적용하고 키보드 `focus-visible` 외곽선을 추가함.
- 360px에서 타이틀 상단 바를 2줄로 배치하고 400px 이하 인게임 툴바를 4열 아이콘으로 압축함. 보드를 화면 높이에 맞춰 축소해 360×800·1280×800 게임 화면을 스크롤 없이 한 화면에 배치함. 터치 스와이프 스크롤 차단을 non-passive 리스너로 전환함.
- PWA 매니페스트에 192×192·512×512 `any` 아이콘과 maskable 2종, apple-touch-icon을 추가함. Service Worker는 5xx 응답·오프라인 시 캐시된 셸로 폴백하고, 프리캐시 `addAll` 실패 시 자산별 캐시로 전환함. 새 버전은 업데이트 배너에서 사용자가 선택할 때만 적용해 진행 중 게임의 즉시 새로고침을 막음.
- BGM 4트랙을 192kbps에서 96kbps MP3로 변환하고 원본 WAV를 배포에서 제외함. 최초 로드에는 코어 이미지·현재 테마·현재 BGM만 로드하고 나머지 테마는 테마 모달에서 지연 로드함. 스프라이트·아이콘을 팔레트 PNG로 압축하고 SW 프리캐시를 필수 셸·기본 테마 중심 30건/1.31MB로 축소함. 현재 BGM은 Range 206 응답 시 전체 파일을 런타임 캐시함.
- 한 번의 승리로 여러 업적이 달성돼도 토스트를 큐에 보관해 4.5초 간격으로 모두 순차 표시하고, 표시 종료·언마운트 시 타이머를 정리함. 업적 효과음은 각 토스트가 표시될 때 재생함. 저장된 업적 데이터는 최신 제목·설명·아이콘 정의를 덮어쓰지 않고 `unlockedAt`·`progress`만 유지하도록 병합함.
- LocalStorage 접근·JSON 파싱·스키마 검증 실패를 흡수하는 공통 storage 래퍼를 추가함. 일일 스트릭·최고 기록·업적·업적 통계·오디오 설정의 잘못된 타입과 누락 필드를 정규화하고, 지원하지 않는 언어와 `data:image/`가 아닌 커스텀 이미지 값은 기본값으로 폴백함. 저장소가 차단돼도 타이틀·모달과 저장 함수가 예외 없이 동작함.
- 전역 디자인 토큰을 심플·어반 기준으로 재정의함. off-white·concrete·charcoal 중립 팔레트와 단일 신호색, 시스템 grotesk·monospace 숫자, 1px 보더·0/4/8px radius·최소 그림자·기능성 모션, `prefers-reduced-motion` 전역 대응을 적용하고 Google Fonts 의존을 제거함. 화면별 적용은 TASK-DEV-26에서 완료함.
- 타이틀·HUD·컨트롤·보드·8종 모달·업적·PWA·공유 카드에 디자인 시스템을 적용함. 그라데이션·`backdrop-filter`·네온 글로우·9999px pill·12px 미만 폰트·UI 이모지를 제거하고, PNG 아이콘을 lucide 단일 라인 아이콘으로 통일함. 선택 모드에만 신호색 CTA를 적용하고 타이머·이동 수는 monospace/tabular-nums로 정리함. 사용하지 않는 스프라이트 CSS·코어 PNG 프리로드도 제거함.
- 360px 모달의 텍스트 레이아웃을 정비함. 한국어는 `--text-word-break: keep-all`, 그 외 언어는 기본 줄바꿈을 사용하고, 모달 제목은 360px에서 16~18px로 낮춤. 테마 카드 이름과 카테고리를 세로로 분리하고 이름 2줄을 허용했으며, BGM 트랙명·장르 배지를 줄바꿈 가능하게 해 전체 이름이 잘리지 않도록 함. 일일 스트릭 라벨과 커스텀 이미지·힌트 제목도 카드·패널 안에서 단어 중간 줄바꿈 없이 표시됨.
- 모바일 터치 타깃과 PWA 배너 접근성을 정비함. 언어 select를 label 래퍼로 감싸 실제 히트 영역을 32~34px로 확대하고, 볼륨 슬라이더는 시각 트랙 4px를 유지하면서 input 박스 32px·thumb 16px로 넓힘. BGM 자동 연동 체크박스는 24×24px, PWA 설치·업데이트 CTA와 닫기·나중에 버튼은 44px로 맞춤. 400px 이하에서 아이콘만 표시되는 업데이트 버튼에 `aria-label`을 추가하고, PWA 설치 배너는 설명 2줄·모바일 액션 행 분리로 전체 문구를 표시함.
- `정답 보기`를 게임 상태를 바꾸지 않는 읽기 전용 미리보기 모달로 분리함. 정답 보기 후 2수 승리, GameOver 해답 보기 후 승리, Daily 정답 보기 후 완료가 발생하지 않으며 Time Attack 제한 시간·Move Limit 이동 수·Undo 기록이 유지됨. GameOver를 닫으면 홈으로 복귀함.
- Daily 완료를 시작 날짜와 시작 보드 식별자에 연결함. 자정을 넘겨 완료해도 시작 날짜로 저장하고, 홈 복귀·커스텀 이미지·새 게임·다시 플레이·모드/그리드 변경 시 Daily 활성 상태를 해제해 다른 모드의 승리가 Daily 완료로 기록되지 않음.
- Vite 빌드 시 해시된 JS·CSS·solver worker를 Service Worker 프리캐시에 자동 주입함. 최초 설치 직후 오프라인 재로드에서 타이틀 화면이 렌더링되고, `Vary: Origin`이 붙은 crossorigin 번들은 `ignoreVary` 매칭으로 캐시에서 제공함. 캐시는 v2.3으로 갱신한 뒤 TASK-DEV-36에서 v2.4/17건/약 1.21MB로 축소함.
- Worker 미지원 AI 힌트 폴백에서 5초 Worker 타임아웃을 먼저 취소해 폴백 힌트가 늦게 지워지지 않게 하고, 마지막 메시지 기준 3초를 보장하는 토스트 훅으로 연속 알림 조기 종료를 막음.
- 모달이 열린 동안 body 스크롤을 잠그고 모달 오버레이·콘텐츠에 `overscroll-behavior: contain`을 적용함. 승리·게임오버 시 보조 모달을 닫아 `aria-modal` 다이얼로그가 겹치지 않게 함.
- 커스텀 이미지 모달을 열 때 저장소 상태와 내부 크롭·줌·오프셋을 동기화하고, 이미지 로드 전·실패 시 Apply를 비활성화해 빈 캔버스 저장을 막음.
- 승리 Confetti의 RAF·캔버스를 모달 종료 시 정리하고, 공유 시트 취소는 폴백 없이 종료함. 실제 공유 실패·Blob 생성 실패·이미지 로드 타임아웃을 안내하고 다운로드 Object URL을 지연 해제함.
- PWA 매니페스트 색상을 `#EFEFEA`/`#BB3E0B`로 맞추고 orientation을 제거함. 192·512·maskable·apple-touch 아이콘을 현재 팔레트로 재생성하고, 프리캐시를 v2.4/17건/약 1.21MB로 축소함. 설치 프롬프트 거부·오류·`appinstalled`를 안전하게 처리함.
- Web Audio master gain과 개별 gain에 중복 적용되던 `sfxVolume`을 한 번으로 정리하고, BGM 자동 연동을 켜는 즉시 현재 테마의 권장 BGM으로 전환함.
- Time Attack 이동 처리 시점에 실제 경과 시간을 검사해 250ms 틱 사이·탭 복귀 직후의 제한 시간 초과 이동과 승리를 거부함.
- 업적 토스트를 polite status로 바꾸고 PWA 배너를 complementary landmark로 정리함. 업적 진행 바·Daily 캘린더에 스크린리더용 값을 제공하고, 장식 모드 카드·오디오 토글 상태·전역 텍스트 선택·캔버스 방향키 팬을 정비함. 진행 중 홈 복귀는 확인 모달을 거침.
- body의 `overscroll-behavior: none`을 제거하고 html에만 억제를 남겨 모바일 문서 세로 스크롤을 복구함. body의 `overflow-x`는 `clip`으로 바꾸고, 모달 열림 중 html·body overflow를 함께 잠가 루트 스크롤까지 차단함.
- PWA 첫 설치 중 controller 활성화를 업데이트로 오인하지 않도록 등록 시작 시점의 controller·기존 active/waiting으로 첫 설치를 구분함. 업데이트 배너는 헤더 버튼 아래로 이동함.
- Daily 캘린더를 `grid`/`gridcell`에서 `ul`/`li` 목록으로 바꾸고 캘린더 제목을 `aria-labelledby`로 연결함. BGM 설정 모달의 음소거 버튼에 동작·상태 `aria-label`과 `aria-pressed`를 적용하고 재생 이퀄라이저를 장식 처리함.
- v1.4.0 기준 기능 카탈로그를 2026-11-20에 갱신.

### v0.0.0 (초기화)

- 프로젝트 기본 거버넌스 및 문서 구조 생성 완료.

---

## 3. Verification (검증 기준)

- **단위·통합 테스트**: `npm test` — 41개 테스트 파일 / 251개 케이스 전건 PASS (2026-11-20, Node.js 26.13.0).
- **타입 검사**: `npx tsc --noEmit` — 0 Errors (`npm run build`의 tsc 단계에서 확인).
- **프로덕션 빌드**: `npm run build` — Vite 8.3.6(Rolldown) 빌드 성공 (2026-11-20, React 19.3.1·TypeScript 7.0.2·Vitest 5.1.0). CSS 83.36KB(gzip 11.09KB), JS 389.76KB(gzip 121.42KB), solver worker 8.73KB.
- **E2E**: `npm run test:e2e` — Playwright Chromium 31/31 PASS (기존 16 + 모바일 문서 스크롤 12 + PWA 첫 설치 2 + Daily 캘린더 레이아웃 1). WebKit은 `PW_WEBKIT=1 --project=webkit`로 `sw-first-install.spec.ts` 2/2 PASS.
- **접근성 감사**: 2026-11-20 TASK-DEV-39~42에서 타이틀 화면 Lighthouse 접근성 **1.0**을 확인했다. 게임 화면·모달은 Playwright로 landmark·progressbar·listitem·aria-pressed·포커스 트랩을 검증했으며, Lighthouse 점수는 타이틀 화면 범위다. SEO의 `robots.txt` 유효성 항목은 접근성 범위가 아니며 TASK-QA-08에서 다룬다.
- **반응형 레이아웃**: 360×800과 1280×800 게임 화면은 `bodyScrollHeight`가 각각 800px로 스크롤 없이 배치되고, 360×640은 가로 클리핑 없이 세로 스크롤만 허용한다(2026-11-08, TASK-DEV-20). 360×800 타이틀 상단 바는 341px/341px로 잘림이 없다.
- **PWA·오프라인**: 2026-11-08 TASK-DEV-21에서 서브패스(`/sliding-puzzle/`) 프로덕션 빌드를 검증했다. SW scope는 `/sliding-puzzle/`, 프리캐시 37건, 매니페스트 아이콘 4종은 192×192·512×512 규격과 200 응답을 확인했다. 서버가 502를 반환하거나 중단된 상태에서도 캐시된 셸로 타이틀 화면이 렌더링됐고, 업데이트는 배너 표시 후 "나중에"에서 새로고침 없이 유지되며 "지금 업데이트"에서 새 워커 활성화와 1회 새로고침이 확인됐다.
- **에셋 최적화**: 2026-11-08 TASK-DEV-22에서 프로덕션 `dist`를 20.65→11.04MB로 줄였다. BGM은 13.05→6.52MiB(192→96kbps MP3)로 변환했고, 스프라이트·아이콘은 3.59→0.52MB(팔레트 PNG, 합성 배경 SSIM 0.989~0.996)로 압축했다. 동일 출처 초기 decodedBodySize는 9,222,220→2,716,771바이트(-70.5%)였고, 최초 로드에는 현재 테마(`theme_nature`)와 현재 BGM만 포함됐다. SW 프리캐시는 37건/19.47MB에서 30건/1.31MB로 축소했으며, 오프라인 재로드에서 현재 테마·현재 BGM(2,173,327바이트, 181.1초)과 게임 시작을 확인했다. 미사용 테마·BGM은 502로 지연 로드 대상에서 제외됐다. 테마 모달을 열면 4개 테마를 모두 지연 로드하고 썸네일이 완료된 뒤 선택해 전환 깜빡임이 없음을 확인했다.
- **업적 알림·데이터 병합**: 2026-11-08 TASK-DEV-23에서 데스크톱 Chromium으로 3x3 30초 이내·Undo 0회 승리를 재현해 `first_victory`→`speed_demon`→`purist_no_undo`가 4.5초 간격으로 순차 표시되고 마지막 토스트 종료 후 14초 시점에 모두 사라지는 것을 확인했다(콘솔 오류 0건). 저장소에 옛 제목·설명·아이콘을 넣어도 최신 정의가 표시되고 `unlockedAt`·`progress`는 보존되며, 알 수 없는 ID는 목록에 추가되지 않았다. 초기 정의를 반환할 때도 복사본을 사용해 원본이 변경되지 않는다.
- **저장소 방어**: 2026-11-08 TASK-DEV-24에서 데스크톱 Chromium으로 손상 JSON·문자열 숫자·잘못된 타입을 저장한 뒤 새로고침해 타이틀 렌더링과 콘솔 오류 0건을 확인했다. 일일 스트릭은 빈 배열·0으로, 기록은 유효한 4×4 항목만, 업적은 12건 기본 목록과 유효한 `unlockedAt`만, 오디오는 기본 볼륨·BGM으로 폴백했다. `Storage.prototype` 접근을 강제로 예외 처리한 상태에서도 타이틀·업적 모달(0/12)·저장 함수·언어 전환·오디오 설정 변경이 예외 없이 동작했고, 유효한 저장값은 재로드 후 그대로 복원됐다.
- **디자인 시스템**: 2026-11-08 TASK-DEV-25에서 전역 토큰을 심플·어반 기준으로 재정의하고 `root/DESIGN_SYSTEM.md`에 색상·타이포·간격·radius·보더·그림자·모션 토큰과 금지 패턴·화면별 마이그레이션 기준을 기록했다. `npm test` 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 빌드 성공. 프로덕션 프리뷰에서 시스템 폰트 16px/24px·`tabular-nums`·평면 `#EFEFEA` 배경·Google Fonts 요청 0건·콘솔 오류 0건을 확인했고, 포커스 링은 2px `#BB3E0B`/offset 2px로 측정됐다. 360×800·1280×800 게임 화면은 `bodyScrollHeight` 800px·가로 오버플로 0건으로 유지됐다. 주요 텍스트·신호색·의미색 조합은 WCAG AA 4.5:1 이상(예: charcoal/paper 14.87:1, signal-600/paper 5.14:1, white/signal-600 5.52:1)으로 계산됐다. TASK-DEV-26에서 컴포넌트 CSS의 그라데이션 47건·`backdrop-filter` 14건·9999px pill 5건·12px 미만 폰트 38건·UI 이모지 19곳을 모두 제거했고, 800·900 굵기와 레거시 토큰 별칭도 0건으로 정리했다. 360×800·1280×800 타이틀·게임 화면과 주요 모달을 측정해 가로 오버플로 0건, 360×800 게임 `bodyScrollHeight` 800px, 44px 주요 액션 터치 영역을 확인했다. 변경 전·후 스크린샷은 `root/archive/assets/task-dev-26/`에 보관했다.
- **정답 보기 무결성**: 2026-11-20 TASK-DEV-29에서 `정답 보기`를 읽기 전용 모달로 분리했다. 보드·타이머·이동 수를 바꾸지 않으며, 정답 보기 후 2수 승리·GameOver 해답 보기 후 승리·Daily 정답 보기 후 완료가 재현되지 않는 회귀 테스트 8건과 E2E 3건이 통과했다. 360×640·360×800·1280×800에서 가로 오버플로 0건, 닫기 44×44px, Tab 포커스 순환·Escape 복귀를 확인했다. 증거는 `root/archive/assets/task-dev-29/`에 보관했다.
- **Daily 컨텍스트·날짜**: 2026-11-20 TASK-DEV-31에서 시작 날짜와 시작 보드 식별자를 함께 저장하고, 실제 시작 보드가 일치할 때만 해당 날짜로 완료를 기록하도록 변경했다. 23:59 시작·00:00 이후 승리 시 시작 날짜만 저장되고, Daily를 포기한 뒤 커스텀 이미지·일반 모드에서 이겨도 Daily 완료가 저장되지 않으며, 다시 플레이한 게임은 저장 함수를 다시 호출하지 않는다. 회귀 테스트 4건이 통과했다.
- **PWA 최초 설치 오프라인**: 2026-11-20 TASK-DEV-30에서 Vite 빌드 산출물의 해시 JS·CSS·solver worker를 `dist/sw.js` 프리캐시에 주입했다. 신규 BrowserContext 최초 방문 후 오프라인 재로드에서 타이틀 화면과 `#root` 자식이 표시됐고 script/stylesheet 실패 0건이었다. `Vary: Origin` crossorigin 번들은 `ignoreVary` 매칭으로 제공한다. TASK-DEV-36에서 캐시를 v2.4/17건/1,209,901바이트로 축소하고 미사용 스프라이트·개별 아이콘을 제거했으며, 매니페스트 색상과 아이콘을 현재 팔레트로 교체했다. E2E 1건이 통과했고 증거는 `root/archive/assets/task-dev-30/`·`task-dev-36/`에 보관했다.
- **AI 힌트·토스트**: 2026-11-20 TASK-DEV-32에서 Worker 미지원 폴백 성공 후 5초가 지나도 힌트가 유지되고 시간 초과 토스트가 발생하지 않음을 확인했다. 액션 토스트는 마지막 메시지 기준 3초를 보장하고 언마운트 시 타이머를 정리한다. 회귀 테스트 9건이 통과했다.
- **모달 수명주기**: 2026-11-20 TASK-DEV-33에서 모달 열림 중 body 스크롤 잠금·닫힘 복원, `overscroll-behavior: contain`, 승리/게임오버 시 보조 모달 종료를 확인했다. 360×640에서 휠·PageDown 후 `scrollY` 0, 1280×800에서 Tab 순환·Escape 복귀, BGM 모달 위 GameOver 발생 시 다이얼로그 1개만 표시됐다.
- **커스텀 이미지·공유**: 2026-11-20 TASK-DEV-34에서 외부 해제 후 재열기 시 드롭존 복귀와 손상 data URL의 Apply 비활성·저장 차단을 확인했다. TASK-DEV-35에서 모달 종료 시 Confetti RAF·캔버스 정리, 공유 취소 시 폴백 없음, 실제 실패 시 클립보드·지연 다운로드, Blob 실패 안내를 확인했다.
- **오디오·Time Attack**: 2026-11-20 TASK-DEV-37에서 `sfxVolume 0.5`가 Web Audio 개별 gain에 0.425로 한 번만 적용되고 master gain은 1임을 확인했으며, 자동 연동 활성화 즉시 현재 테마 권장 BGM으로 전환됐다. TASK-DEV-38에서 인터벌 틱 없이 46초를 넘긴 뒤 이동과 완성 수가 거부되고 `gameover`로 전환되며 기록 저장으로 이어지지 않음을 확인했다.
- **접근성·파괴적 액션**: 2026-11-20 TASK-DEV-39에서 업적 토스트 polite status, PWA complementary landmark, 업적 `progressbar` 2/3, Daily `grid`/`gridcell`·`aria-current="date"`, 오디오 토글 `aria-pressed`, 전역 `user-select: text`, 캔버스 방향키 팬을 확인했다. 진행 중 홈 복귀는 확인 모달을 거치며 360×640 328px·1280×800 400px로 화면 안에 배치되고 가로 오버플로가 0건이었다. Lighthouse 타이틀 접근성 1.0.
- **모바일 문서 스크롤**: 2026-11-20 TASK-DEV-43에서 `e2e/mobile-scroll.spec.ts`가 수정 전 8 failed/4 passed, 수정 후 12/12 PASS했다. 360×640·360×800·412×839에서 wheel·touch 스크롤, 412×839 타이틀 scrollY 377·게임 360×640 scrollY 100, 모달 열림 시 html·body overflow hidden·닫힘 복원, 보드 스와이프 후 페이지 scrollY 불변을 확인했다.
- **PWA 첫 설치·업데이트**: 2026-11-20 TASK-DEV-40에서 첫 설치 레이스 단위 테스트가 수정 전 1 failed/6 skipped, 수정 후 `swUpdateManager` 7/7 PASS했다. `e2e/sw-first-install.spec.ts` Chromium 2/2·WebKit 2/2 PASS. 배너는 360×640 top 96px(헤더 버튼 bottom 87px), 1280×800 top 96px(bottom 53px)로 교차 0건이었다. WebKit E2E는 수정 전 배너를 재현하지 못해 레이스 고정은 단위 테스트 실패로 확인했다.
- **Daily 목록·BGM 라벨**: 2026-11-20 TASK-DEV-41에서 Daily 캘린더를 `ul`/`li` 목록으로 바꾸고 360×640·1280×800에서 항목 30개·가로 오버플로 0건·오늘 `aria-current="date"`를 확인했다. TASK-DEV-42에서 BGM·SFX 음소거 버튼의 초기 `aria-pressed=true`, 토글 후 `false`·라벨 변경을 확인했다. 각각 `DailyModal` 4/4, `BgmSelectModal` 7/7 PASS.
- **미실행**: 실제 모바일 실기기(iOS Safari·Android Chrome)와 스크린리더 수동 검증은 수행하지 않았다. 데스크톱 Chromium에서는 TASK-DEV-15로 EN 전 화면·JA/ZH 핵심 화면과 공유 카드 PNG를, TASK-DEV-16으로 커스텀 이미지 드래그·보존·검증 오류를, TASK-DEV-17로 AI 힌트 무효화·힌트 없음·시간 초과를, TASK-DEV-18로 모달 포커스 순환·복원과 보드·언어 선택 키 입력 차단을, TASK-DEV-19로 타이틀·게임·테마·BGM 모달의 접근성 감사와 대비·확대·라벨을, TASK-DEV-20으로 360×640·360×800·1280×800 레이아웃과 터치 스크롤 차단을, TASK-DEV-21로 PWA 아이콘·SW 폴백·업데이트 안내를, TASK-DEV-22로 BGM 변환·초기 로딩·오프라인 캐시를, TASK-DEV-23으로 다중 업적 토스트 큐와 메타데이터 병합을, TASK-DEV-24로 손상 데이터·저장소 차단 폴백을, TASK-DEV-25로 전역 디자인 토큰·가독성 기준·360×800/1280×800 게임 레이아웃을, TASK-DEV-26으로 전 화면 평면 UI·주요 모달 6종·Win/GameOver 모달·변경 전후 스크린샷을, TASK-DEV-27로 360×640·360×800·1280×800 모달 5종의 제목·카드명·스트릭 라벨 줄바꿈과 EN/JA/ZH 360×640 회귀를, TASK-DEV-28로 언어 select·볼륨 슬라이더·PWA CTA 터치 타깃과 PWA 설치/업데이트 배너의 EN/JA/ZH 360×640 회귀를, TASK-DEV-29로 정답 보기 모달의 보드 불변·포커스·Escape·360×640/360×800/1280×800 레이아웃을, TASK-DEV-30으로 최초 설치 오프라인 프리캐시와 crossorigin 번들 캐시를, TASK-DEV-31로 Daily 포기·자정 경계·다시 플레이 회귀를, TASK-DEV-32로 AI 폴백·토스트 타이머를, TASK-DEV-33으로 모달 스크롤·중첩을, TASK-DEV-34로 커스텀 이미지 상태·로드 실패를, TASK-DEV-35로 Confetti·공유 취소/실패를, TASK-DEV-36으로 PWA 브랜딩·아이콘·프리캐시를, TASK-DEV-37로 오디오 스케일·즉시 자동 연동을, TASK-DEV-38로 이동 시점 Time Attack 검사를, TASK-DEV-39로 접근성·홈 복귀 확인을 확인했다. Samsung Internet 실기기, iOS Safari 실기기, Firefox 터치 스크롤, 실제 설치 PWA의 새 워커 업데이트·SKIP_WAITING, WebKit 첫 설치 레이스 실브라우저 재현, 스크린리더의 Daily 목록·BGM 음소거 상태 낭독, iOS Safari의 apple-touch-icon 적용, Firefox의 SW 업데이트 동작, 96kbps BGM의 주관적 청취 품질, Safari/Firefox의 Range 오디오 캐시·공유 다운로드 동작, 모바일·스크린리더의 연속 토스트 알림, 실제 시크릿 모드·쿠키 차단·저장 용량 초과 상황, OS 수준 `prefers-reduced-motion` 에뮬레이션, 실제 공유 시트·설치 프롬프트, 게임·모달 화면의 Lighthouse 점수, Vercel 재배포는 미확인이다.
- **Node.js 26 참고**: `src/test/setup.ts`가 jsdom Storage를 전역에 연결하므로 Node.js 26에서도 별도 `NODE_OPTIONS` 없이 `npm test`가 통과한다.
