import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';
import sharp from 'sharp';

const root = process.cwd();
const manifest = JSON.parse(
  readFileSync(resolve(root, 'public/manifest.webmanifest'), 'utf8')
) as {
  background_color: string;
  theme_color: string;
  orientation?: string;
  icons: Array<{ src: string; sizes: string; purpose?: string }>;
};

const ICON_FILES = [
  { file: 'public/assets/icons/icon-192.png', size: 192 },
  { file: 'public/assets/icons/icon-512.png', size: 512 },
  { file: 'public/assets/icons/icon-maskable-192.png', size: 192 },
  { file: 'public/assets/icons/icon-maskable-512.png', size: 512 },
  { file: 'public/assets/icons/apple-touch-icon.png', size: 180 },
];

async function getContentBounds(file: string) {
  const { data, info } = await sharp(resolve(root, file))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let minX = info.width;
  let minY = info.height;
  let maxX = -1;
  let maxY = -1;

  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * info.channels;
      const differsFromBackground =
        Math.abs(data[offset] - 0x17) > 8 ||
        Math.abs(data[offset + 1] - 0x17) > 8 ||
        Math.abs(data[offset + 2] - 0x13) > 8;

      if (differsFromBackground) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  return { minX, minY, maxX, maxY, width: info.width, height: info.height };
}

describe('PWA branding and icons', () => {
  it('uses the current design tokens for manifest and browser theme colors', () => {
    expect(manifest.background_color).toBe('#EFEFEA');
    expect(manifest.theme_color).toBe('#BB3E0B');
    expect(manifest.orientation).toBeUndefined();

    const html = readFileSync(resolve(root, 'index.html'), 'utf8');
    expect(html).toContain('<meta name="theme-color" content="#EFEFEA" />');
  });

  it('declares any and maskable icons with matching source files', () => {
    expect(manifest.icons).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ sizes: '192x192', purpose: 'any' }),
        expect.objectContaining({ sizes: '512x512', purpose: 'any' }),
        expect.objectContaining({ sizes: '192x192', purpose: 'maskable' }),
        expect.objectContaining({ sizes: '512x512', purpose: 'maskable' }),
      ])
    );
  });

  it.each(ICON_FILES)('renders $file at $size×$size', async ({ file, size }) => {
    const metadata = await sharp(resolve(root, file)).metadata();
    expect(metadata.width).toBe(size);
    expect(metadata.height).toBe(size);
  });

  it('keeps maskable artwork inside the 80% safe zone', async () => {
    const bounds = await getContentBounds('public/assets/icons/icon-maskable-512.png');
    const safeMin = Math.floor(bounds.width * 0.1);
    const safeMax = Math.ceil(bounds.width * 0.9);

    expect(bounds.minX).toBeGreaterThanOrEqual(safeMin);
    expect(bounds.minY).toBeGreaterThanOrEqual(safeMin);
    expect(bounds.maxX).toBeLessThanOrEqual(safeMax);
    expect(bounds.maxY).toBeLessThanOrEqual(safeMax);
  });
});
