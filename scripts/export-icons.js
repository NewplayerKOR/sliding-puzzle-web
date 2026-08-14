import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const iconsDir = path.join(rootDir, 'public', 'assets', 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

const individualIcons = [
  {
    name: 'icon_sound_on.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 12 18 L 18 18 L 26 12 L 26 36 L 18 30 L 12 30 Z" fill="#2563EB" />
      <path d="M 30 18 Q 36 24, 30 30" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
      <path d="M 34 14 Q 42 24, 34 34" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    </svg>`
  },
  {
    name: 'icon_sound_off.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 12 18 L 18 18 L 26 12 L 26 36 L 18 30 L 12 30 Z" fill="#64748B" />
      <line x1="30" y1="18" x2="40" y2="30" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
      <line x1="40" y1="18" x2="30" y2="30" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
    </svg>`
  },
  {
    name: 'icon_pause.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <rect x="14" y="12" width="6" height="24" rx="3" fill="#2563EB" />
      <rect x="28" y="12" width="6" height="24" rx="3" fill="#2563EB" />
    </svg>`
  },
  {
    name: 'icon_play.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <polygon points="16,12 36,24 16,36" fill="#2563EB" />
    </svg>`
  },
  {
    name: 'icon_reset.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 34 20 A 12 12 0 1 0 36 26" fill="none" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" />
      <polygon points="34,13 40,21 32,22" fill="#2563EB" />
    </svg>`
  },
  {
    name: 'icon_hint.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 10 24 Q 24 12, 38 24 Q 24 36, 10 24 Z" fill="none" stroke="#2563EB" stroke-width="3" stroke-linejoin="round" />
      <circle cx="24" cy="24" r="5" fill="#2563EB" />
    </svg>`
  },
  {
    name: 'icon_number_toggle.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <line x1="18" y1="12" x2="15" y2="36" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
      <line x1="30" y1="12" x2="27" y2="36" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
      <line x1="12" y1="19" x2="36" y2="19" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
      <line x1="10" y1="29" x2="34" y2="29" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    </svg>`
  },
  {
    name: 'icon_theme_selector.svg',
    svg: `<svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M 24 10 C 14 10, 8 16, 8 24 C 8 32, 16 38, 22 38 C 24 38, 26 36, 26 34 C 26 32, 25 31, 25 29 C 25 27, 27 25, 30 25 L 34 25 C 38 25, 40 21, 40 18 C 40 13, 33 10, 24 10 Z" fill="none" stroke="#2563EB" stroke-width="3" stroke-linejoin="round" />
      <circle cx="16" cy="18" r="2.5" fill="#EF4444" />
      <circle cx="24" cy="15" r="2.5" fill="#F59E0B" />
      <circle cx="32" cy="18" r="2.5" fill="#10B981" />
      <circle cx="16" cy="27" r="2.5" fill="#8B5CF6" />
    </svg>`
  }
];

async function exportIcons() {
  for (const item of individualIcons) {
    const svgPath = path.join(iconsDir, item.name);
    fs.writeFileSync(svgPath, item.svg, 'utf-8');
    const pngName = item.name.replace('.svg', '.png');
    const pngPath = path.join(iconsDir, pngName);
    await sharp(Buffer.from(item.svg)).resize(48, 48).png().toFile(pngPath);
    console.log(`✅ Exported icon: ${item.name} & ${pngName}`);
  }
}

exportIcons().catch(console.error);
