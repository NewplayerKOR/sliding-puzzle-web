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

#### [ ] TASK-DEV-29 — 정답 보기(리셋) 승리·기록·일일 완료 무결성 수정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **목표**: `정답 보기(리셋)` 또는 GameOver의 해답 보기로 만든 정답 보드를 플레이해 승리·최고 기록·업적·일일 완료가 인정되는 경로를 제거한다.
- **대상 파일**: `src/hooks/usePuzzleGame.ts`, `src/App.tsx`, 관련 테스트
- **재현/증거**:
  - 3×3 Standard → `정답 보기 (리셋)` → 타일 8을 밖으로 이동 → 1.3초 대기 → 타일 8을 안으로 이동 시 승리 모달(2수·00:01·3성), `bestTime: 1`·`bestMoves: 2` 기록, `first_victory`·`speed_demon`·`purist_no_undo` 업적이 저장됨.
  - Daily 4×4에서 동일 재현 시 `currentStreak: 1`, `lastCompletedDate` 저장.
  - `resetGame()`은 정답 보드와 `idle` 상태를 만들고 `isAutoSolved`를 false로 유지함(`src/hooks/usePuzzleGame.ts:198-209`). 이후 `moveTile()`의 승리 판정과 `App`의 후처리가 그대로 실행됨(`:284-288`, `src/App.tsx:358-397`). GameOver의 `onViewSolution`·`onClose`도 같은 함수를 호출함(`src/App.tsx:639-640`).
- **DoD**:
  - `정답 보기`는 읽기 전용 미리보기이거나, 새 셔플 전까지 승리·기록·업적·일일 저장이 발생하지 않도록 상태를 분리한다.
  - Time Attack은 리셋으로 제한 시간을 초기화할 수 없고, Move Limit은 이동 수를 초기화할 수 없다.
  - 정답 보기 후 2수 승리, GameOver 해답 보기 후 승리, Daily 정답 보기 후 완료가 모두 재현되지 않는 회귀 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과와 변경 전·후 재현 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-30 — PWA 최초 설치 오프라인 프리캐시 수정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **목표**: Vite가 생성한 해시 번들과 solver worker를 프리캐시해, 최초 설치 직후 오프라인에서도 앱 셸이 실행되게 한다.
- **대상 파일**: `public/sw.js`, `vite.config.ts`, `src/utils/serviceWorkerScript.test.ts`, `e2e/`, 필요한 빌드 스크립트
- **재현/증거**:
  - 신규 BrowserContext에서 최초 방문 후 SW controller는 `true`였지만 `sliding-puzzle-v2.2` 캐시에 `dist/assets/index-*.js`와 `index-*.css`가 없었음.
  - 오프라인 재로드 시 `#root` 자식 0개·본문 길이 0, JS/CSS 요청은 `net::ERR_FAILED`.
  - 현재 SW 프리캐시는 정적 목록만 포함함(`public/sw.js:6-37`, `:40-56`). 서비스 워커 테스트도 목록 포함 여부만 확인함(`src/utils/serviceWorkerScript.test.ts:107-130`).
- **DoD**:
  - 최초 설치·최초 방문 직후 오프라인 재로드에서 타이틀 화면이 렌더링된다.
  - 현재 빌드의 JS·CSS 해시 번들과 `solver.worker` 청크가 프리캐시에 포함된다.
  - 업데이트 배너·캐시 정리 동작이 기존과 동일하게 유지된다.
  - 최초 설치 오프라인 E2E와 서비스 워커 테스트를 추가하고 `npm test`, `npm run typecheck`, `npm run build`, `npx playwright test` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-31 — 일일 챌린지 활성 컨텍스트·날짜 무결성 수정

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P1
- **목표**: Daily 완료를 실제 Daily 보드와 시작 날짜에만 연결하고, 홈 복귀·커스텀 이미지·다시 플레이에서 이전 Daily 상태가 남지 않게 한다.
- **대상 파일**: `src/App.tsx`, `src/utils/dailyChallenge.ts`, 관련 테스트
- **재현/증거**:
  - Daily 시작 → 홈 복귀 → 타이틀에서 커스텀 사진 적용 → 해당 게임에서 승리 시, Daily 보드를 풀지 않았는데도 `currentStreak: 1`과 오늘 완료가 저장됨.
  - 완료 저장은 승리 시점의 `getTodayDateString()`을 사용해, 자정을 넘겨 완료하면 다음 날짜의 Daily로 기록될 수 있음(`src/App.tsx:369-371`, 시작 날짜 `:411`).
  - `handleStartDailyChallenge`는 `isDailyGameActive`를 true로 설정하지만 홈 복귀·커스텀 이미지 시작·WinModal의 `onPlayAgain`에서 해제하지 않음(`src/App.tsx:408-414`, `:446-450`, `:511-514`, `:654`).
- **DoD**:
  - `activeDaily: { date, boardKey }`처럼 시작 날짜와 보드 식별자를 보관하고, 완료 시 실제 보드가 일치할 때만 해당 시작 날짜로 저장한다.
  - 홈 복귀·커스텀 이미지 적용·다시 플레이·새 게임에서 Daily 활성 상태를 해제한다.
  - 자정 경계와 Daily를 포기한 뒤 다른 모드를 플레이하는 시나리오의 회귀 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-32 — AI 힌트 폴백·토스트 타이머 정리

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: Worker를 만들 수 없는 환경의 AI 힌트 폴백에서 이전 타임아웃이 남아 힌트를 지우는 문제와, 액션 토스트 타이머가 새 토스트를 조기 종료하는 문제를 정리한다.
- **대상 파일**: `src/App.tsx`, 관련 테스트
- **재현/증거**:
  - `Worker`를 비활성화한 Chromium에서 AI 힌트를 요청하면 힌트가 표시된 뒤 약 5.3초 후 사라지고 `AI 힌트 계산 시간이 초과되었습니다` 토스트가 표시됨.
  - 5초 타임아웃(`src/App.tsx:285-291`)을 폴백의 30ms 타임아웃(`:317-334`)이 `aiHintTimerRef`에서 덮어써 기존 타임아웃을 정리하지 못함.
  - `handleNotify`도 이전 3초 타이머를 정리하지 않아 연속 알림에서 새 토스트가 조기 종료될 수 있음(`:453-457`).
- **DoD**:
  - 폴백 성공 시 5초 타임아웃을 확실히 취소하고, 힌트는 보드·게임 상태가 바뀔 때까지 유지된다.
  - 액션 토스트는 새 메시지마다 이전 타이머를 정리하고 마지막 메시지 기준으로 3초를 보장한다.
  - Worker 미지원·Worker 오류·5초 타임아웃·폴백 성공 경로를 테스트로 구분해 검증한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-33 — 모달 배경 스크롤·중첩·오버스크롤 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 모달이 열린 동안 배경 페이지가 스크롤되지 않게 하고, Time Attack 만료 시 모달이 중첩되지 않도록 모달 수명주기를 정리한다.
- **대상 파일**: `src/App.tsx`, `src/components/Modal/**/*.css`, `src/hooks/useModalFocusTrap.ts`, 관련 테스트
- **재현/증거**:
  - 360×640 타이틀에서 테마 모달을 연 채 PageDown 시 `scrollY`가 0→560, 휠 입력 시 649까지 증가했고 포커스는 모달 안에 있었음.
  - Time Attack 중 BGM 모달을 연 채 제한 시간이 만료되면 `[role="dialog"]`가 `bgm-modal-overlay`와 `gameover-modal-overlay` 두 개 동시에 열림.
  - 모달 내용에 `overscroll-behavior: contain`이 없고, 모달 열림 시 body scroll lock도 없음.
- **DoD**:
  - 모달이 하나라도 열려 있으면 배경 문서 스크롤을 잠그고, 모달 내부 스크롤은 `overscroll-behavior: contain`으로 페이지에 전달하지 않는다.
  - Time Attack 만료 등으로 GameOver/Win이 발생하면 기존 모달을 닫거나 포커스·z-index 정책을 정리해 `aria-modal` 다이얼로그가 동시에 두 개 열리지 않게 한다.
  - 360×640·1280×800에서 모달 스크롤·포커스·Escape·Tab 순환 회귀를 확인한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-34 — 커스텀 이미지 모달 상태·로드 실패 처리

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 테마 적용으로 커스텀 이미지가 해제된 뒤 모달을 다시 열 때 이전 크롭이 남지 않게 하고, 이미지 로드 실패 시 빈 캔버스가 저장되지 않게 한다.
- **대상 파일**: `src/components/Modal/CustomImageModal.tsx`, 관련 테스트
- **재현/증거**:
  - 커스텀 이미지 적용 후 테마를 선택해 저장소 값이 `null`이 됐는데도, 모달을 다시 열면 512px 크롭 캔버스가 그대로 표시됨.
  - 저장된 data URL이 손상돼 이미지 로드가 실패해도 크롭 UI와 Apply가 남아 있어 빈 캔버스를 저장할 수 있음.
  - 저장 이미지 로드 효과가 `!imageSrc`일 때만 실행되고(`src/components/Modal/CustomImageModal.tsx:41-46`), Apply는 `imageObjRef` 유효성을 확인하지 않음(`:204-225`).
- **DoD**:
  - 모달을 닫거나 외부에서 커스텀 이미지가 해제되면 내부 `imageSrc`·`zoom`·`offset` 상태를 초기화하고, 다음 열기에서 저장소 상태와 동기화한다.
  - 이미지 로드 실패 시 Apply를 비활성화하거나 오류 상태로 전환해 빈 캔버스 저장을 막는다.
  - 저장소 삭제 후 재열기·손상 data URL·정상 적용 시나리오의 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-35 — 승리 Confetti·공유 흐름 후처리 안정성

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 승리 모달을 닫은 뒤 Confetti 루프가 남지 않게 하고, 공유 취소·실패·지연 상황에서 사용자가 예측 가능한 결과를 받게 한다.
- **대상 파일**: `src/components/Modal/WinModal.tsx`, `src/utils/shareCardGenerator.ts`, 관련 테스트
- **재현/증거**:
  - 승리 모달에서 `다시 플레이`를 눌러 모달이 닫힌 뒤에도 고정 Confetti 캔버스가 남고, `requestAnimationFrame` 루프가 최대 2.5초 계속됨(`src/components/Modal/WinModal.tsx:54-93`).
  - 공유 시트 취소(`AbortError`)도 클립보드 복사·다운로드 폴백으로 진행되고(`src/utils/shareCardGenerator.ts:170-197`), 이미지 로드 타임아웃·`toBlob` 실패 시 무응답.
  - Object URL을 `a.click()` 직후 즉시 해제해 Safari/Firefox에서 다운로드가 취소될 위험이 있음(`:190-197`).
- **DoD**:
  - 모달 닫기·언마운트 시 Confetti RAF와 캔버스를 정리한다.
  - 사용자가 공유를 취소하면 다운로드·복사 폴백을 실행하지 않고, 실제 실패·타임아웃에만 폴백하며 실패 사유를 안내한다.
  - 이미지 로드 타임아웃·Blob 생성 실패·다운로드 앵커 수명을 보강하고 관련 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-36 — PWA 브랜딩·매니페스트·프리캐시 자산 정리

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: PWA 설치 아이콘·스플래시 색상을 현재 심플·어반 디자인 시스템에 맞추고, 사용하지 않는 프리캐시 자산을 정리한다.
- **대상 파일**: `public/manifest.webmanifest`, `public/assets/icons/*`, `public/sw.js`, `index.html`, `src/components/PWA/PwaInstallBanner.tsx`
- **재현/증거**:
  - 매니페스트는 `background_color: #0f172a`, `theme_color: #2563eb`로 현재 `#EFEFEA`/`#BB3E0B` 토큰과 불일치함(`public/manifest.webmanifest:8-10`).
  - 홈 화면 아이콘은 구형 블루 그라데이션 디자인이며, `portrait-primary`로 가로 태블릿 사용을 제한함.
  - 프리캐시 1.37MB 중 사용하지 않는 스프라이트·PNG 아이콘 약 0.5MB가 포함됨(`public/sw.js:15-35`).
  - 설치 프롬프트의 `prompt()`/`userChoice` 거부가 처리되지 않음(`src/components/PWA/PwaInstallBanner.tsx:22-30`).
- **DoD**:
  - 매니페스트 색상을 현재 디자인 토큰과 맞추고, 192·512·maskable·apple-touch 아이콘을 새 팔레트로 재생성한다.
  - `orientation`을 유지할지 제거할지 제품 기준을 정하고 문서화한다.
  - 프리캐시에서 실제 사용 자산만 남기고, 설치 프롬프트 거부·`appinstalled` 이벤트를 안전하게 처리한다.
  - manifest·아이콘 응답과 360×640·1280×800 설치 배너 회귀를 확인하고 `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: TASK-DEV-30 완료 후(`public/sw.js` 충돌 방지)

#### [ ] TASK-DEV-37 — 오디오 볼륨·BGM 자동 연동 정합화

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: Web Audio와 HTMLAudio의 SFX 음량을 동일한 기준으로 맞추고, BGM 자동 연동 체크박스의 동작을 명확히 한다.
- **대상 파일**: `src/utils/audioManager.ts`, `src/components/Modal/BgmSelectModal.tsx`, 관련 테스트
- **재현/증거**:
  - Web Audio 경로는 master gain에 `sfxVolume`을 적용한 뒤 개별 gain에도 `sfxVolume`을 곱해 실제 음량이 제곱으로 줄어듦(`src/utils/audioManager.ts:552-556`, `:575`, `:601`, `:629`, `:651`).
  - `setAutoThemeBgm(true)`는 설정만 저장하고 현재 테마의 권장 BGM으로 즉시 전환하지 않음(`:473-476`). UI 문구가 즉시 전환을 기대하게 함.
- **DoD**:
  - Web Audio와 HTMLAudio 폴백의 SFX 음량이 같은 입력에서 같은 체감 음량이 되도록 스케일링을 한 번만 적용한다.
  - 자동 연동을 켜는 즉시 현재 테마의 권장 BGM으로 전환하거나, 다음 테마부터 적용된다는 문구로 동작을 명확히 한다.
  - 볼륨·음소거·트랙 전환·자동 연동 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: 없음

#### [ ] TASK-DEV-38 — Time Attack 이동 시점 제한 시간 검사

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: Time Attack에서 250ms 인터벌과 이동 이벤트 사이의 틈으로 제한 시간 이후 이동·승리가 인정되지 않게 한다.
- **대상 파일**: `src/hooks/usePuzzleGame.ts`, 관련 테스트
- **재현/증거**:
  - 제한 시간 검사는 타이머 인터벌에서만 수행하고(`src/hooks/usePuzzleGame.ts:106-130`), `moveTile()`은 이동 시점의 경과 시간을 확인하지 않음(`:244-293`).
  - 메인 스레드 지연·탭 복귀 직후에는 제한 시간을 넘긴 이동이 승리로 이어질 수 있음.
- **DoD**:
  - 이동 처리 전에 실제 경과 시간을 확인해 제한 시간 이상이면 이동을 거부하고 `gameover`로 전환한다.
  - 제한 시간 직후 이동·승리·기록 저장이 발생하지 않는 테스트를 추가한다.
  - `npm test`, `npm run typecheck`, `npm run build` 결과를 기록한다.
- **선행 조건**: TASK-DEV-29 완료 후(리셋으로 인한 시간 초기화 경로와 분리해 검증)

#### [ ] TASK-DEV-39 — 접근성·파괴적 액션 UX 잔여 정비

- **Phase**: 01
- **담당**: DEV
- **우선순위**: P2
- **목표**: 토스트·PWA landmark·진행 바·캘린더·모드 카드·아이콘 버튼·전역 선택 스타일의 접근성 문제와, 홈 복귀 같은 파괴적 액션의 확인 절차를 정비한다.
- **대상 파일**: `src/components/Title/TitleScreen.tsx`, `src/components/PWA/PwaInstallBanner.tsx`, `src/components/Achievement/AchievementToast.tsx`, `src/components/Modal/AchievementModal.tsx`, `src/components/Modal/DailyModal.tsx`, `src/components/Modal/CustomImageModal.tsx`, `src/components/Modal/WinModal.tsx`, `src/styles/index.css`
- **재현/증거**:
  - 업적 토스트가 `role="alert"`와 `aria-live="assertive"`를 함께 사용해 비긴급 알림이 스크린리더 발화를 끊음(`src/components/Achievement/AchievementToast.tsx:40-45`).
  - 하단 PWA 설치 배너가 `role="banner"`를 사용해 landmark가 중복·오배치됨(`src/components/PWA/PwaInstallBanner.tsx:39`).
  - 업적 진행 바에 `role="progressbar"`/`aria-value*`가 없고, Daily 캘린더의 완료·오늘 상태가 `title`/아이콘에만 의존함(`AchievementModal.tsx:123-134`, `DailyModal.tsx:136-143`).
  - 타이틀 모드 카드가 `div onClick`으로 선택 상태를 바꾸며 키보드 동등 조작·상태 노출이 없고, BGM/SFX 아이콘 버튼 라벨이 동작·상태를 설명하지 않음(`TitleScreen.tsx:129-149`, `:165-168`, `:215-216`, `:269-270`, `:322-323`).
  - `html/body`의 전역 `user-select: none`이 규칙·설명 텍스트 복사를 막고(`src/styles/index.css:144-161`), 커스텀 이미지 캔버스 팬은 포인터 전용임(`CustomImageModal.tsx:289-300`).
  - 홈 복귀가 진행 중 게임을 확인 없이 폐기함(`Header.tsx:64-76`, `App.tsx:511-514`).
- **DoD**:
  - 업적 토스트를 `role="status"`/`aria-live="polite"`로 조정하고, PWA 배너를 올바른 `region`/`complementary` landmark로 바꾼다.
  - 진행 바·캘린더에 스크린리더용 상태와 값을 제공한다.
  - 모드 카드의 키보드 선택 또는 장식 처리, BGM/SFX 버튼의 동작·상태 라벨, 텍스트 선택 범위, 캔버스 팬 키보드 대안을 정리한다.
  - WinModal의 Escape/닫기 정책과 홈 복귀 확인·Undo 중 하나를 결정해 적용한다.
  - Lighthouse 접근성과 키보드·스크린리더 수동 확인 결과, 360×640·1280×800 회귀, `npm test`·`npm run typecheck`·`npm run build` 결과를 기록한다.
- **선행 조건**: 없음

### [QA / DevOps]

#### [ ] TASK-QA-10 — P1 수정 독립 검증 및 회귀 테스트

- **Phase**: 01
- **담당**: QA_DEVOPS
- **우선순위**: P1
- **목표**: TASK-DEV-29~31이 실제 사용자 경로에서 Reset 치트, PWA 최초 설치 오프라인 실패, Daily 완료 누수를 제거했는지 독립 검증한다.
- **검증 범위**:
  - `정답 보기` 후 2수 승리, GameOver 해답 보기 후 승리, Standard·Time Attack·Move Limit·Daily에서 기록·업적·완료 저장 여부
  - 신규 브라우저 프로필에서 최초 설치 후 오프라인 재로드, 해시 번들·worker 캐시 포함 여부
  - Daily 시작 → 홈 복귀 → 커스텀 이미지·다시 플레이, 자정 경계에서 완료 날짜 귀속
  - 기존 핵심 플레이·모달 포커스·언어 전환·360px 레이아웃 회귀
- **DoD**:
  - 수정 전 재현 시나리오를 먼저 확인하고, 수정 후에는 승리 모달·기록·업적·Daily 저장이 발생하지 않음을 증거와 함께 기록한다.
  - 수정 전후 재현 결과를 비교하고 `npm test`, `npm run typecheck`, `npm run build`, `npx playwright test` 실행 결과를 기록한다.
  - 실기기·Safari/Firefox·스크린리더 등 미실행 범위를 명시한다.
  - 실패 시 재현 조건·기대·실제 결과를 새 DEV 작업으로 등록한다.
- **선행 조건**: TASK-DEV-29·30·31 완료 후

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

- **TASK-DEV-28** — 모바일 터치 타깃·PWA 배너 접근성 정비 (완료일: 2026-11-08)
  - 핵심 결과: 언어 선택 래퍼를 label로 바꾸고 select를 64×32px(타이틀)·64×34px(게임 헤더)로 확장해 래퍼 여백 클릭도 select 포커스로 연결함. BGM 볼륨 슬라이더는 시각 트랙 4px를 유지하면서 input 32px·thumb 16px로 확대하고, 자동 연동 체크박스를 24×24px로 맞춤. PWA 설치·업데이트 CTA와 닫기·나중에 버튼을 44px로 조정하고, 400px 이하 아이콘 전용 업데이트 버튼에 `aria-label`을 추가함. PWA 설치 배너는 설명 2줄·480px 이하 액션 행 분리로 전체 문구를 표시함
  - 검증 범위: Vitest 29개 파일/183개 케이스 PASS, tsc 0 Errors, Vite 6.4.5 빌드 성공, Playwright E2E 4/4 PASS. 360×640·360×800·1280×800에서 select·슬라이더·PWA CTA 크기와 배너 오버플로를 측정했고, 24px 미만 타깃 0건, EN·JA·ZH 360×640 이슈 0건. 실제 모바일 실기기·Safari/Firefox·스크린리더·실제 설치/업데이트 이벤트는 미실행
  - 원문: [archive/TASKS_PHASE_01.md](./archive/TASKS_PHASE_01.md#task-dev-28--모바일-터치-타깃pwa-배너-접근성-정비)

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

---

## 4. Phase Archives (Phase별 보관 목록)

- [Phase 01 완료 원문](./archive/TASKS_PHASE_01.md) — TASK-PM-01~04 (거버넌스 정합화, 기능 카탈로그, 검증 환경, 버전 정렬), TASK-QA-07 (v1.4.0 전면 품질·성능·안정성 검토), TASK-DEV-14 (벽시계 기준 타이머 보정), TASK-DEV-15 (4개 국어 하드코딩 정리), TASK-DEV-16 (커스텀 이미지 보존·업로드 검증), TASK-DEV-17 (AI 힌트 요청 무효화·실패 처리), TASK-DEV-18 (모달 포커스 트랩·키보드 입력 충돌 해결), TASK-DEV-19 (ARIA 구조·대비·확대·라벨 정비), TASK-DEV-20 (360px·1화면 레이아웃·터치 처리), TASK-DEV-21 (PWA 아이콘·SW 폴백·업데이트 안정화), TASK-DEV-22 (BGM·이미지 경량화·초기 로딩 최적화), TASK-DEV-23 (업적 토스트 다중 달성 큐·메타데이터 병합), TASK-DEV-24 (LocalStorage 접근·스키마 방어), TASK-DEV-25 (심플·어반 디자인 시스템·가독성 기준), TASK-DEV-26 (전 화면 심플·어반 UI/UX·가독성 개선), TASK-DEV-27 (360px 모달 텍스트 줄바꿈·잘림 정비), TASK-DEV-28 (모바일 터치 타깃·PWA 배너 접근성 정비), TASK-QA-08 (CI/CD·테스트 환경·의존성·배포 문서 정비), TASK-QA-09 (심플·어반 UI/UX·가독성·시각 회귀 검증), TASK-PM-05 (Node.js 요구사항·배포 문서 링크 정합화)
