const BUILD_ASSETS_MARKER = 'const BUILD_ASSETS = [];';

/**
 * Vite 번들 파일명 중 루트 assets 아래의 JS·CSS만 프리캐시 목록으로 만듦.
 * 스프라이트 하위 CSS와 오디오·이미지 정적 자산은 기존 목록에서 별도로 처리함.
 */
export function collectPrecacheAssets(fileNames: string[]): string[] {
  const assets = fileNames
    .filter((fileName) => /^assets\/[^/]+\.(js|css)$/.test(fileName))
    .map((fileName) => `./${fileName}`);

  return Array.from(new Set(assets)).sort();
}

/** public/sw.js의 빈 BUILD_ASSETS 마커를 실제 빌드 산출물 목록으로 치환함. */
export function injectPrecacheAssets(source: string, assets: string[]): string {
  if (!source.includes(BUILD_ASSETS_MARKER)) {
    throw new Error('public/sw.js에서 BUILD_ASSETS 마커를 찾지 못했습니다.');
  }

  const replacement = `const BUILD_ASSETS = ${JSON.stringify(assets, null, 2)};`;
  return source.replace(BUILD_ASSETS_MARKER, replacement);
}
