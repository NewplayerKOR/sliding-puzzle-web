import { describe, expect, it } from 'vitest';
import swSource from '../../public/sw.js?raw';
import { collectPrecacheAssets, injectPrecacheAssets } from './swPrecache';

describe('collectPrecacheAssets', () => {
  it('현재 빌드의 루트 JS·CSS·worker 청크만 상대 경로로 수집한다', () => {
    const assets = collectPrecacheAssets([
      'index.html',
      'manifest.webmanifest',
      'assets/index-abc123.js',
      'assets/index-def456.css',
      'assets/solver.worker-ghi789.js',
      'assets/sprites/sheet_ui_fx.css',
      'assets/audio/bgm_chill.mp3',
      'assets/images/theme_nature.png',
    ]);

    expect(assets).toEqual([
      './assets/index-abc123.js',
      './assets/index-def456.css',
      './assets/solver.worker-ghi789.js',
    ]);
  });

  it('중복 파일명을 제거하고 정렬한다', () => {
    expect(
      collectPrecacheAssets([
        'assets/index-b.js',
        'assets/index-a.js',
        'assets/index-b.js',
      ])
    ).toEqual(['./assets/index-a.js', './assets/index-b.js']);
  });
});

describe('injectPrecacheAssets', () => {
  it('public/sw.js의 BUILD_ASSETS 마커를 실제 목록으로 치환한다', () => {
    const injected = injectPrecacheAssets(swSource, [
      './assets/index-abc123.js',
      './assets/index-def456.css',
    ]);

    expect(injected).not.toContain('const BUILD_ASSETS = [];');
    expect(injected).toContain('const BUILD_ASSETS = [');
    expect(injected).toContain('"./assets/index-abc123.js"');
    expect(injected).toContain('"./assets/index-def456.css"');
    expect(injected).toContain('...BUILD_ASSETS');
  });

  it('마커가 없으면 빌드 오류로 처리한다', () => {
    expect(() => injectPrecacheAssets('const CACHE_NAME = "x";', [])).toThrow(
      /BUILD_ASSETS/
    );
  });
});
