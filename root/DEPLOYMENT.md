# Deployment Guide

## 1. 현재 배포 구성

- 정적 Vite 번들(`dist/`)을 배포하는 클라이언트 전용 앱이다. 백엔드·DB·서버 환경 변수는 없다.
- GitHub 저장소 `NewplayerKOR/sliding-puzzle-web`의 `main` 브랜치와 Vercel 자동 배포가 연결돼 있다.
- **2026-11-08 기준 Vercel 프로젝트는 소유자가 의도적으로 pause한 상태다.** 따라서 현재 `main` push 후 자동 배포는 실행되지 않는다. 이는 장애가 아니며, 프로젝트를 resume하면 기존 연결 설정으로 다시 배포된다.
- GitHub Actions CI는 Vercel pause와 무관하게 `push`·`pull_request`마다 테스트·타입 검사·빌드·감사·E2E를 수행한다.
- 자격 증명, Vercel 토큰, GitHub 토큰은 저장소·문서·CI 로그에 기록하지 않는다. Vercel 연동은 Vercel의 GitHub App 연결을 사용한다.

## 2. 로컬 검증

요구사항: Node.js 24.15 이상(24.x) 또는 26.0.0 이상, npm 10 이상(`package.json` `engines`). CI와 Vercel은 `.nvmrc`의 Node.js 26.13.0을 기준으로 한다.

```bash
npm ci
npm test
npm run typecheck
npm run build
npm run test:e2e
```

- `npm test`는 Node 26에서도 별도 `NODE_OPTIONS` 없이 동작한다. `src/test/setup.ts`가 Vitest jsdom 환경의 Storage를 전역에 연결한다.
- E2E는 프로덕션 빌드를 만든 뒤 `vite preview`(127.0.0.1:4173)를 자동 기동한다. 최초 1회 `npx playwright install chromium`이 필요하다.
- `npm audit --omit=dev`는 배포 산출물 의존성만 검사하며 0건이어야 한다. 개발 도구 취약점은 `npm audit`로 별도 확인한다.

## 3. Vercel 설정

Vercel 프로젝트가 pause 상태에서 재개될 때 아래 설정을 유지한다.

| 항목 | 값 |
| :--- | :--- |
| Framework Preset | Vite |
| Root Directory | 저장소 루트 |
| Install Command | `npm ci` |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Node.js Version | 26.x (`.nvmrc` 26.13.0 기준) |
| Environment Variables | 없음 |

- Vercel은 `dist/`를 정적 호스팅하고, `public/`의 `manifest.webmanifest`·`sw.js`·`robots.txt`·에셋을 함께 배포한다.
- SPA rewrite는 필요 없다. `vite.config.ts`의 `base: './'`와 상대 경로 자산·Service Worker를 사용하므로 루트 도메인과 서브패스 배포를 모두 지원한다.

## 4. 서브패스 배포

- `base: './'`이므로 `https://example.com/sub/` 같은 경로에 `dist/`를 올려도 된다.
- Service Worker scope·캐시 URL은 배포 경로를 기준으로 계산된다. 서브패스에서도 `/sub/sw.js`가 루트 범위를 침범하지 않는지 확인한다.
- 서브패스 호스팅은 HTTPS(또는 localhost)여야 Service Worker가 등록된다.
- `public/robots.txt`는 모든 crawler를 차단해 Vercel 트래픽·자원 소진을 막는다. 서브패스 배포에서도 도메인 루트에 동일한 차단 정책을 배치한다.

## 5. 배포 후 확인

1. 배포 URL에서 타이틀·모드 카드·테마 모달이 표시되는지 확인한다.
2. 3×3 게임을 시작해 타일 이동·Undo·AI 힌트·승리 모달을 확인한다.
3. 새로고침 후 업데이트 배너가 표시되면 "나중에"와 "지금 업데이트" 동작을 확인한다.
4. DevTools → Application에서 `manifest.webmanifest` 파싱, 아이콘 192/512·maskable·apple-touch 로드, Service Worker active를 확인한다.
5. 네트워크를 오프라인으로 전환하고 새로고침해 타이틀과 기본 테마가 표시되는지 확인한다.
6. `robots.txt`가 배포 루트에서 200으로 응답하고 `Disallow: /`가 포함되는지 확인한다.
7. 콘솔에 예기치 않은 오류가 없는지 확인한다.

## 6. 캐시·업데이트 절차

- 빌드마다 JS/CSS 파일명에 해시가 붙는다. `public/sw.js`의 `CACHE_NAME` 버전을 올리면 이전 캐시를 정리한다.
- HTML은 Network First, 정적 자산은 Cache First다. 새 버전은 업데이트 배너에서 사용자가 선택할 때만 `skipWaiting`으로 반영한다.
- 배포 직후 이전 탭이 열려 있으면 이전 해시 자산을 참조할 수 있다. 새로고침 또는 업데이트 배너 적용 후 최신 버전인지 확인한다.
- 긴급 롤백 시 Vercel의 이전 배포를 promote하거나 이전 커밋을 redeploy한다. Service Worker 캐시는 새 배포의 `CACHE_NAME`이 달라야 자동 정리되므로, 롤백 시 버전 문자열도 함께 확인한다.

## 7. CI 실패 시 대응

- `npm test` 실패: 실패한 테스트 파일과 환경(Node 버전, jsdom Storage)을 확인한다.
- `npm run typecheck` 실패: `tsc --noEmit` 오류를 수정한다. 빌드(`tsc && vite build`)도 같은 검사를 수행한다.
- `npm run build` 실패: 정적 자산 경로와 Vite 설정을 확인한다.
- `npm audit --omit=dev` 실패: 배포 의존성 취약점이므로 배포를 중단하고 수정 버전을 적용한다.
- E2E 실패: 업로드된 `playwright-report`·`test-results` 아티팩트에서 스크린샷·trace를 확인한다.
