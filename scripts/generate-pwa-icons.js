import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'assets', 'icons');

fs.mkdirSync(iconsDir, { recursive: true });

const COLORS = {
  ink: '#171713',
  paper: '#EFEFEA',
  signal: '#BB3E0B',
};

/**
 * 홈 화면 아이콘은 index.html 파비콘과 같은 2×2 타일 모티프를 사용함.
 * any 아이콘은 가장자리 여백을 두고, maskable 아이콘은 중앙 안전 영역 안에 축소 배치함.
 */
function createTileSvg({ padding, gap }) {
  const size = 512;
  const tile = (size - padding * 2 - gap) / 2;
  const positions = [
    { x: padding, y: padding, fill: COLORS.paper },
    { x: padding + tile + gap, y: padding, fill: COLORS.paper },
    { x: padding, y: padding + tile + gap, fill: COLORS.paper },
    { x: padding + tile + gap, y: padding + tile + gap, fill: COLORS.signal },
  ];

  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${size}" height="${size}" fill="${COLORS.ink}" />
    ${positions
      .map(
        (tilePosition) =>
          `<rect x="${tilePosition.x}" y="${tilePosition.y}" width="${tile}" height="${tile}" fill="${tilePosition.fill}" />`
      )
      .join('')}
  </svg>`;
}

const standardSvg = createTileSvg({ padding: 64, gap: 24 });
const maskableSvg = createTileSvg({ padding: 112, gap: 24 });

const outputs = [
  { name: 'icon-192.png', size: 192, svg: standardSvg },
  { name: 'icon-512.png', size: 512, svg: standardSvg },
  { name: 'icon-maskable-192.png', size: 192, svg: maskableSvg },
  { name: 'icon-maskable-512.png', size: 512, svg: maskableSvg },
  { name: 'apple-touch-icon.png', size: 180, svg: standardSvg },
];

async function generateIcons() {
  for (const output of outputs) {
    await sharp(Buffer.from(output.svg))
      .resize(output.size, output.size)
      .png({ compressionLevel: 9 })
      .toFile(path.join(iconsDir, output.name));
    console.log(`Generated ${output.name} (${output.size}×${output.size})`);
  }
}

generateIcons().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
