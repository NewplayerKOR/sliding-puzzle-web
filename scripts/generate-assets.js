import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const imagesDir = path.join(rootDir, 'public', 'assets', 'images');
const spritesDir = path.join(rootDir, 'public', 'assets', 'sprites');
const iconsDir = path.join(rootDir, 'public', 'assets', 'icons');

[imagesDir, spritesDir, iconsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// 1. THEME 1: NATURE (1024x1024)
const createNatureSVG = () => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1A365D" />
      <stop offset="35%" stop-color="#2B6CB0" />
      <stop offset="60%" stop-color="#D69E2E" />
      <stop offset="75%" stop-color="#ED8936" />
      <stop offset="100%" stop-color="#FBD38D" />
    </linearGradient>
    <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFDF0" stop-opacity="1" />
      <stop offset="30%" stop-color="#F6E05E" stop-opacity="0.9" />
      <stop offset="70%" stop-color="#ED8936" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#ED8936" stop-opacity="0" />
    </radialGradient>
    <linearGradient id="mountBack" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A5568" />
      <stop offset="100%" stop-color="#2D3748" />
    </linearGradient>
    <linearGradient id="mountFront" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#EDF2F7" />
      <stop offset="25%" stop-color="#A0AEC0" />
      <stop offset="70%" stop-color="#4A5568" />
      <stop offset="100%" stop-color="#1A202C" />
    </linearGradient>
    <linearGradient id="lakeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2C7A7B" />
      <stop offset="30%" stop-color="#319795" />
      <stop offset="70%" stop-color="#285E61" />
      <stop offset="100%" stop-color="#1D4044" />
    </linearGradient>
    <linearGradient id="waterfallGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E6FFFA" />
      <stop offset="50%" stop-color="#81E6D9" />
      <stop offset="100%" stop-color="#319795" />
    </linearGradient>
    <linearGradient id="forestGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#276749" />
      <stop offset="100%" stop-color="#1C4532" />
    </linearGradient>
    <linearGradient id="meadowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#48BB78" />
      <stop offset="50%" stop-color="#38A169" />
      <stop offset="100%" stop-color="#22543D" />
    </linearGradient>
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Sky -->
  <rect width="1024" height="1024" fill="url(#skyGrad)" />

  <!-- Sun -->
  <circle cx="512" cy="380" r="140" fill="url(#sunGlow)" />
  <circle cx="512" cy="380" r="48" fill="#FFFBEA" />

  <!-- Sun rays / Cloud bands -->
  <path d="M 0 260 Q 250 240, 500 270 T 1024 250 L 1024 340 L 0 340 Z" fill="#FEB2B2" opacity="0.3" />
  <path d="M 0 310 Q 300 290, 600 320 T 1024 300 L 1024 390 L 0 390 Z" fill="#FEEBC8" opacity="0.4" />

  <!-- Distant Mountain Peaks -->
  <polygon points="120,440 280,240 450,440" fill="url(#mountBack)" opacity="0.8" />
  <polygon points="280,240 330,290 300,310 260,290 280,240" fill="#FFFFFF" opacity="0.9" />

  <polygon points="620,450 780,210 960,450" fill="url(#mountBack)" opacity="0.85" />
  <polygon points="780,210 830,280 800,300 760,280 780,210" fill="#FFFFFF" opacity="0.95" />

  <!-- Main Alpine Mountain Range -->
  <polygon points="280,480 512,180 740,480" fill="url(#mountFront)" />
  <!-- Snow Cap on Main Peak -->
  <path d="M 512 180 L 560 260 L 530 280 L 550 320 L 512 300 L 480 330 L 490 270 L 460 250 Z" fill="#FFFFFF" filter="url(#softGlow)" />
  <path d="M 512 180 L 560 260 L 530 280 L 550 320 L 512 300 Z" fill="#E2E8F0" />

  <!-- Left Ridge -->
  <polygon points="0,520 220,310 420,530" fill="url(#mountFront)" />
  <path d="M 220 310 L 250 370 L 230 380 L 260 410 L 210 390 L 190 360 Z" fill="#FFFFFF" />

  <!-- Right Ridge -->
  <polygon points="680,540 860,320 1024,530" fill="url(#mountFront)" />
  <path d="M 860 320 L 890 380 L 870 390 L 900 420 L 850 400 L 830 370 Z" fill="#FFFFFF" />

  <!-- Midground Pine Forest Hills -->
  <path d="M 0 510 C 150 480, 300 540, 480 500 C 650 460, 850 530, 1024 490 L 1024 680 L 0 680 Z" fill="url(#forestGrad)" />
  <!-- Forest Silhouettes -->
  ${Array.from({ length: 24 })
    .map((_, i) => {
      const x = i * 44 + (i % 3) * 6;
      const h = 50 + (i % 4) * 16;
      const y = 490 + (i % 3) * 10;
      return `<polygon points="${x},${y} ${x + 18},${y - h} ${x + 36},${y}" fill="#143224" />`;
    })
    .join('\n')}

  <!-- Cliff & Waterfall (Center-Right) -->
  <polygon points="460,510 580,510 560,720 440,720" fill="#2D3748" />
  <rect x="485" y="510" width="30" height="210" fill="url(#waterfallGrad)" opacity="0.95" />
  <ellipse cx="500" cy="720" rx="45" ry="16" fill="#E6FFFA" opacity="0.9" />

  <!-- Alpine Lake -->
  <path d="M 0 650 Q 300 600, 600 640 T 1024 620 L 1024 820 L 0 820 Z" fill="url(#lakeGrad)" />
  <!-- Lake Water Reflections -->
  <ellipse cx="512" cy="700" rx="180" ry="25" fill="#81E6D9" opacity="0.4" />
  <ellipse cx="500" cy="740" rx="140" ry="18" fill="#FBD38D" opacity="0.3" />
  <ellipse cx="320" cy="710" rx="90" ry="12" fill="#E6FFFA" opacity="0.3" />

  <!-- Foreground Meadow & Wildflowers -->
  <path d="M 0 760 Q 280 710, 600 780 T 1024 740 L 1024 1024 L 0 1024 Z" fill="url(#meadowGrad)" />

  <!-- Left Foreground Hill with Large Pines -->
  <path d="M 0 740 Q 200 720, 360 880 L 0 1024 Z" fill="#1C4532" />
  <polygon points="40,920 90,620 140,920" fill="#0E2319" />
  <polygon points="120,960 170,680 220,960" fill="#143224" />
  <polygon points="0,980 40,730 80,980" fill="#0E2319" />

  <!-- Wildflowers Foreground -->
  ${Array.from({ length: 45 })
    .map((_, i) => {
      const cx = 50 + (i * 22) + (i % 7) * 4;
      const cy = 820 + (i % 9) * 20;
      const colors = ['#FC8181', '#F6E05E', '#BEE3F8', '#FEB2B2', '#FAF089', '#9AE6B4'];
      const color = colors[i % colors.length];
      return `<circle cx="${cx}" cy="${cy}" r="${4 + (i % 3)}" fill="${color}" />
              <circle cx="${cx}" cy="${cy}" r="2" fill="#FFFFFF" />`;
    })
    .join('\n')}

  <!-- Wooden Rowboat on Lake -->
  <path d="M 280 735 Q 320 745, 360 735 Q 340 755, 300 755 Z" fill="#744210" />
  <line x1="320" y1="730" x2="305" y2="750" stroke="#FAF089" stroke-width="3" />
</svg>
`;

// 2. THEME 2: RETRO PIXEL ART (1024x1024)
const createPixelArtSVG = () => {
  const blockSize = 16;
  const gridW = 64;
  const gridH = 64;
  let rects = [];

  const skyColors = [
    '#0F172A', '#1E1B4B', '#312E81', '#4338CA', '#6366F1', '#818CF8', '#A5B4FC', '#F472B6', '#FBBF24'
  ];

  for (let y = 0; y < 28; y++) {
    const colIdx = Math.min(Math.floor((y / 28) * skyColors.length), skyColors.length - 1);
    rects.push(`<rect x="0" y="${y * blockSize}" width="1024" height="${blockSize}" fill="${skyColors[colIdx]}" />`);
  }

  const moonPixels = [
    [52, 4], [53, 4], [54, 4], [55, 4],
    [51, 5], [52, 5], [53, 5], [54, 5], [55, 5], [56, 5],
    [50, 6], [51, 6], [52, 6], [53, 6], [54, 6], [55, 6], [56, 6], [57, 6],
    [50, 7], [51, 7], [52, 7], [53, 7], [54, 7], [55, 7], [56, 7], [57, 7],
    [50, 8], [51, 8], [52, 8], [53, 8], [54, 8], [55, 8], [56, 8], [57, 8],
    [51, 9], [52, 9], [53, 9], [54, 9], [55, 9], [56, 9],
    [52, 10], [53, 10], [54, 10], [55, 10]
  ];
  moonPixels.forEach(([px, py]) => {
    rects.push(`<rect x="${px * blockSize}" y="${py * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FEF08A" />`);
  });

  const stars = [
    [6, 3], [14, 6], [22, 2], [35, 5], [44, 3], [8, 12], [28, 10], [40, 14], [18, 16], [48, 12]
  ];
  stars.forEach(([px, py]) => {
    rects.push(`<rect x="${px * blockSize}" y="${py * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FFFFFF" />`);
    rects.push(`<rect x="${(px-1) * blockSize}" y="${py * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FDE047" opacity="0.6" />`);
    rects.push(`<rect x="${(px+1) * blockSize}" y="${py * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FDE047" opacity="0.6" />`);
    rects.push(`<rect x="${px * blockSize}" y="${(py-1) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FDE047" opacity="0.6" />`);
    rects.push(`<rect x="${px * blockSize}" y="${(py+1) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#FDE047" opacity="0.6" />`);
  });

  for (let x = 0; x < gridW; x++) {
    const peak1 = 20 + Math.abs(Math.sin(x * 0.12) * 8);
    for (let y = Math.floor(peak1); y < 35; y++) {
      const col = y < peak1 + 2 ? '#E2E8F0' : y < peak1 + 6 ? '#475569' : '#1E293B';
      rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${col}" />`);
    }
  }

  for (let x = 0; x < gridW; x++) {
    const hillY = 32 + Math.floor(Math.sin(x * 0.15) * 3);
    for (let y = hillY; y < gridH; y++) {
      const col = y === hillY ? '#86EFAC' : y < hillY + 4 ? '#22C55E' : y < hillY + 12 ? '#15803D' : '#166534';
      rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${col}" />`);
    }
  }

  for (let y = 45; y < gridH; y++) {
    const pathCenter = 32 + Math.floor(Math.sin(y * 0.2) * 5);
    const pathHalfW = 6 + Math.floor((y - 45) * 0.35);
    for (let x = pathCenter - pathHalfW; x <= pathCenter + pathHalfW; x++) {
      if (x >= 0 && x < gridW) {
        const isBorder = x === pathCenter - pathHalfW || x === pathCenter + pathHalfW;
        const col = isBorder ? '#78716C' : (x + y) % 2 === 0 ? '#D6D3D1' : '#A8A29E';
        rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${col}" />`);
      }
    }
  }

  const drawHouse = (startX, startY, w, h, roofCol, wallCol, doorCol, winCol) => {
    for (let row = 0; row < 6; row++) {
      const rw = w + 4 - row * 2;
      const rx = startX - 2 + row;
      for (let x = rx; x < rx + rw; x++) {
        rects.push(`<rect x="${x * blockSize}" y="${(startY - 6 + row) * blockSize}" width="${blockSize}" height="${blockSize}" fill="${roofCol}" />`);
      }
    }
    rects.push(`<rect x="${(startX + w - 3) * blockSize}" y="${(startY - 9) * blockSize}" width="${2 * blockSize}" height="${4 * blockSize}" fill="#7F1D1D" />`);
    rects.push(`<rect x="${(startX + w - 2) * blockSize}" y="${(startY - 11) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#E2E8F0" opacity="0.8" />`);
    rects.push(`<rect x="${(startX + w - 1) * blockSize}" y="${(startY - 13) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#E2E8F0" opacity="0.6" />`);
    rects.push(`<rect x="${(startX + w) * blockSize}" y="${(startY - 15) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#E2E8F0" opacity="0.4" />`);

    for (let y = startY; y < startY + h; y++) {
      for (let x = startX; x < startX + w; x++) {
        rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${wallCol}" />`);
      }
    }
    for (let y = startY + 2; y < startY + 5; y++) {
      for (let x = startX + 2; x < startX + 5; x++) {
        rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${winCol}" />`);
      }
    }
    for (let y = startY + 4; y < startY + h; y++) {
      for (let x = startX + w - 4; x < startX + w - 1; x++) {
        rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="${doorCol}" />`);
      }
    }
  };

  drawHouse(6, 36, 12, 10, '#DC2626', '#FED7AA', '#9A3412', '#FEF08A');
  drawHouse(46, 38, 14, 11, '#2563EB', '#E0E7FF', '#1E3A8A', '#FEF08A');

  const wmX = 52;
  const wmY = 22;
  for (let y = wmY; y < wmY + 12; y++) {
    const curW = 6 - Math.floor((y - wmY) * 0.15);
    for (let x = wmX; x < wmX + curW; x++) {
      rects.push(`<rect x="${x * blockSize}" y="${y * blockSize}" width="${blockSize}" height="${blockSize}" fill="#F8FAFC" />`);
    }
  }
  for (let i = -7; i <= 7; i++) {
    rects.push(`<rect x="${(wmX + 3 + i) * blockSize}" y="${(wmY + 2) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#92400E" />`);
    rects.push(`<rect x="${(wmX + 3) * blockSize}" y="${(wmY + 2 + i) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#92400E" />`);
  }

  const drawLamp = (lx, ly) => {
    rects.push(`<rect x="${lx * blockSize}" y="${(ly - 4) * blockSize}" width="${blockSize}" height="${4 * blockSize}" fill="#1E293B" />`);
    rects.push(`<rect x="${(lx - 1) * blockSize}" y="${(ly - 5) * blockSize}" width="${3 * blockSize}" height="${2 * blockSize}" fill="#FDE047" />`);
    rects.push(`<rect x="${lx * blockSize}" y="${(ly - 6) * blockSize}" width="${blockSize}" height="${blockSize}" fill="#0F172A" />`);
  };

  drawLamp(20, 52);
  drawLamp(42, 54);
  drawLamp(16, 59);

  return `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  ${rects.join('\n')}
</svg>
`;
};

// 3. THEME 3: GEOMETRIC ABSTRACT (1024x1024)
const createAbstractSVG = () => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="absBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E1B4B" />
      <stop offset="100%" stop-color="#311042" />
    </linearGradient>
    <linearGradient id="coralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FF5E62" />
      <stop offset="100%" stop-color="#FF9966" />
    </linearGradient>
    <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#00F2FE" />
      <stop offset="100%" stop-color="#4FACFE" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFE000" />
      <stop offset="100%" stop-color="#799F0C" />
    </linearGradient>
    <linearGradient id="purpleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#B224EF" />
      <stop offset="100%" stop-color="#7579FF" />
    </linearGradient>
    <pattern id="stripes" width="40" height="40" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="0" y2="40" stroke="#FFFFFF" stroke-width="12" opacity="0.15" />
    </pattern>
    <pattern id="dots" width="30" height="30" patternUnits="userSpaceOnUse">
      <circle cx="15" cy="15" r="4" fill="#00F2FE" opacity="0.3" />
    </pattern>
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="12" dy="16" stdDeviation="12" flood-color="#000000" flood-opacity="0.4" />
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#absBg)" />
  <rect width="1024" height="1024" fill="url(#stripes)" />

  <circle cx="260" cy="260" r="200" fill="url(#coralGrad)" filter="url(#dropShadow)" />
  <circle cx="260" cy="260" r="130" fill="none" stroke="#FFFFFF" stroke-width="16" opacity="0.8" />
  <path d="M 60 260 A 200 200 0 0 1 260 60 L 260 260 Z" fill="#FFE000" opacity="0.7" />

  <path d="M 0 680 C 300 420, 650 780, 1024 380 L 1024 540 C 650 940, 300 580, 0 840 Z" fill="url(#tealGrad)" filter="url(#dropShadow)" />

  <g filter="url(#dropShadow)">
    <polygon points="680,120 940,120 810,340" fill="url(#purpleGrad)" />
    <polygon points="760,180 980,420 620,420" fill="none" stroke="#FF5E62" stroke-width="14" />
  </g>
  <circle cx="850" cy="220" r="70" fill="url(#dots)" />

  <circle cx="512" cy="512" r="180" fill="none" stroke="#FFE000" stroke-width="28" stroke-dasharray="80 30" filter="url(#dropShadow)" />
  <circle cx="512" cy="512" r="90" fill="url(#coralGrad)" />

  <g filter="url(#dropShadow)">
    <polygon points="120,700 240,630 360,700 240,770" fill="#00F2FE" />
    <polygon points="120,700 240,770 240,890 120,820" fill="#007799" />
    <polygon points="360,700 240,770 240,890 360,820" fill="#00B4D8" />

    <polygon points="280,780 400,710 520,780 400,850" fill="#FF5E62" />
    <polygon points="280,780 400,850 400,970 280,900" fill="#B91C1C" />
    <polygon points="520,780 400,850 400,970 520,900" fill="#DC2626" />
  </g>

  <g filter="url(#dropShadow)">
    <circle cx="800" cy="800" r="180" fill="url(#purpleGrad)" />
    <path d="M 800 800 L 980 800 A 180 180 0 0 1 800 980 Z" fill="#FFE000" />
    <circle cx="800" cy="800" r="100" fill="#0F172A" />
    <circle cx="800" cy="800" r="40" fill="#00F2FE" />
  </g>

  <line x1="80" y1="120" x2="240" y2="40" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" />
  <line x1="120" y1="160" x2="280" y2="80" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.6" />
  <line x1="160" y1="200" x2="320" y2="120" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round" opacity="0.3" />

  <rect x="470" y="240" width="70" height="70" fill="none" stroke="#FFFFFF" stroke-width="10" transform="rotate(45 505 275)" />
  <rect x="580" y="680" width="60" height="60" fill="#FFE000" transform="rotate(25 610 710)" filter="url(#dropShadow)" />
</svg>
`;

// 4. THEME 4: ANIMAL CHARACTERS (1024x1024)
const createAnimalSVG = () => `
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="forestSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#E0F2FE" />
      <stop offset="40%" stop-color="#BAE6FD" />
      <stop offset="100%" stop-color="#FEF08A" />
    </linearGradient>
    <linearGradient id="foxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FB923C" />
      <stop offset="100%" stop-color="#EA580C" />
    </linearGradient>
    <linearGradient id="bearGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="bunnyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="100%" stop-color="#F1F5F9" />
    </linearGradient>
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#86EFAC" />
      <stop offset="50%" stop-color="#4ADE80" />
      <stop offset="100%" stop-color="#16A34A" />
    </linearGradient>
    <filter id="charShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="#1E293B" flood-opacity="0.25" />
    </filter>
  </defs>

  <rect width="1024" height="1024" fill="url(#forestSky)" />

  <g fill="#FFFFFF" opacity="0.9">
    <ellipse cx="220" cy="180" rx="90" ry="40" />
    <ellipse cx="280" cy="160" rx="60" ry="45" />
    <ellipse cx="170" cy="190" rx="50" ry="35" />

    <ellipse cx="780" cy="220" rx="100" ry="45" />
    <ellipse cx="850" cy="200" rx="70" ry="50" />
    <ellipse cx="720" cy="230" rx="60" ry="38" />
  </g>

  <circle cx="200" cy="620" r="320" fill="#86EFAC" opacity="0.6" />
  <circle cx="820" cy="600" r="340" fill="#A7F3D0" opacity="0.7" />
  <circle cx="512" cy="650" r="380" fill="#6EE7B7" opacity="0.8" />

  <path d="M 0 680 Q 512 600, 1024 680 L 1024 1024 L 0 1024 Z" fill="url(#groundGrad)" />

  <polygon points="260,820 764,820 860,980 164,980" fill="#FEE2E2" filter="url(#charShadow)" />
  <polygon points="290,820 330,820 250,980 210,980" fill="#EF4444" opacity="0.7" />
  <polygon points="410,820 450,820 390,980 350,980" fill="#EF4444" opacity="0.7" />
  <polygon points="530,820 570,820 530,980 490,980" fill="#EF4444" opacity="0.7" />
  <polygon points="650,820 690,820 670,980 630,980" fill="#EF4444" opacity="0.7" />

  <!-- Bear -->
  <g filter="url(#charShadow)">
    <ellipse cx="380" cy="680" rx="140" ry="160" fill="url(#bearGrad)" />
    <ellipse cx="380" cy="710" rx="85" ry="105" fill="#FDE68A" />

    <circle cx="280" cy="460" r="38" fill="url(#bearGrad)" />
    <circle cx="280" cy="460" r="22" fill="#FDE68A" />
    <circle cx="480" cy="460" r="38" fill="url(#bearGrad)" />
    <circle cx="480" cy="460" r="22" fill="#FDE68A" />

    <circle cx="380" cy="530" r="115" fill="url(#bearGrad)" />

    <ellipse cx="380" cy="565" rx="52" ry="38" fill="#FDE68A" />
    <ellipse cx="380" cy="548" rx="20" ry="14" fill="#1E293B" />
    <path d="M 368 566 Q 380 578, 392 566" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round" />

    <circle cx="335" cy="515" r="10" fill="#1E293B" />
    <circle cx="338" cy="512" r="3" fill="#FFFFFF" />
    <circle cx="425" cy="515" r="10" fill="#1E293B" />
    <circle cx="428" cy="512" r="3" fill="#FFFFFF" />

    <circle cx="310" cy="545" r="15" fill="#FCA5A5" opacity="0.6" />
    <circle cx="450" cy="545" r="15" fill="#FCA5A5" opacity="0.6" />

    <ellipse cx="380" cy="760" rx="35" ry="40" fill="#F59E0B" />
    <rect x="355" y="715" width="50" height="15" rx="6" fill="#D97706" />
    <text x="380" y="768" font-family="sans-serif" font-weight="bold" font-size="14" fill="#78350F" text-anchor="middle">HONEY</text>
  </g>

  <!-- Fox -->
  <g filter="url(#charShadow)">
    <path d="M 720 720 C 820 740, 880 620, 830 520 C 790 480, 740 560, 700 620 Z" fill="url(#foxGrad)" />
    <path d="M 830 520 C 800 490, 770 530, 750 560 C 780 560, 810 540, 830 520 Z" fill="#FFFFFF" />

    <ellipse cx="640" cy="700" rx="90" ry="120" fill="url(#foxGrad)" />
    <ellipse cx="640" cy="720" rx="50" ry="75" fill="#FFFFFF" />

    <polygon points="560,490 530,360 610,440" fill="url(#foxGrad)" />
    <polygon points="565,470 545,385 595,435" fill="#FFFFFF" />
    <polygon points="720,490 750,360 670,440" fill="url(#foxGrad)" />
    <polygon points="715,470 735,385 685,435" fill="#FFFFFF" />

    <ellipse cx="640" cy="520" rx="85" ry="75" fill="url(#foxGrad)" />
    <path d="M 570 530 Q 640 610, 710 530 Q 640 570, 570 530 Z" fill="#FFFFFF" />
    <circle cx="640" cy="570" r="10" fill="#1E293B" />

    <path d="M 590 505 Q 605 490, 620 505" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round" />
    <path d="M 660 505 Q 675 490, 690 505" fill="none" stroke="#1E293B" stroke-width="4" stroke-linecap="round" />

    <circle cx="580" cy="535" r="12" fill="#FDA4AF" opacity="0.7" />
    <circle cx="700" cy="535" r="12" fill="#FDA4AF" opacity="0.7" />
  </g>

  <!-- Bunny -->
  <g filter="url(#charShadow)">
    <ellipse cx="495" cy="740" rx="14" ry="42" fill="url(#bunnyGrad)" transform="rotate(-15 495 740)" />
    <ellipse cx="495" cy="740" rx="7" ry="28" fill="#FDA4AF" transform="rotate(-15 495 740)" />
    <ellipse cx="535" cy="740" rx="14" ry="42" fill="url(#bunnyGrad)" transform="rotate(15 535 740)" />
    <ellipse cx="535" cy="740" rx="7" ry="28" fill="#FDA4AF" transform="rotate(15 535 740)" />

    <ellipse cx="512" cy="860" rx="42" ry="50" fill="url(#bunnyGrad)" />
    <circle cx="512" cy="800" r="36" fill="url(#bunnyGrad)" />

    <circle cx="498" cy="795" r="5" fill="#1E293B" />
    <circle cx="499" cy="793" r="1.5" fill="#FFFFFF" />
    <circle cx="526" cy="795" r="5" fill="#1E293B" />
    <circle cx="527" cy="793" r="1.5" fill="#FFFFFF" />
    <polygon points="509,804 515,804 512,808" fill="#F43F5E" />

    <circle cx="488" cy="805" r="8" fill="#FDA4AF" opacity="0.6" />
    <circle cx="536" cy="805" r="8" fill="#FDA4AF" opacity="0.6" />
  </g>

  <!-- Food & Music -->
  <g filter="url(#charShadow)">
    <circle cx="340" cy="890" r="18" fill="#EF4444" />
    <path d="M 340 872 Q 345 862, 352 865" stroke="#78350F" stroke-width="3" fill="none" />
    <circle cx="335" cy="885" r="3" fill="#FFFFFF" opacity="0.7" />

    <ellipse cx="680" cy="900" rx="26" ry="16" fill="#D97706" transform="rotate(-15 680 900)" />
    <ellipse cx="680" cy="898" rx="18" ry="10" fill="#F59E0B" transform="rotate(-15 680 900)" />
  </g>

  <g fill="#6366F1" opacity="0.8">
    <text x="320" y="380" font-family="sans-serif" font-size="36" font-weight="bold">♪</text>
    <text x="680" y="340" font-family="sans-serif" font-size="44" font-weight="bold">♫</text>
    <text x="512" y="320" font-family="sans-serif" font-size="28" font-weight="bold">♩</text>
  </g>
</svg>
`;

// 5. SHEET B: SPRITESHEET (512x512)
const createSpritesheetSVG = () => `
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="goldStar" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <linearGradient id="trophyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FDE047" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FFFFFF" />
      <stop offset="40%" stop-color="#93C5FD" />
      <stop offset="100%" stop-color="#3B82F6" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="emptyGlowGrad" cx="50%" cy="50%" r="50%">
      <stop offset="60%" stop-color="#3B82F6" stop-opacity="0" />
      <stop offset="85%" stop-color="#60A5FA" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#2563EB" stop-opacity="0.9" />
    </radialGradient>
  </defs>

  <!-- 1. SYSTEM ICONS (48x48) -->
  <!-- icon_sound_on (0, 0) -->
  <g transform="translate(0, 0)">
    <rect width="48" height="48" fill="none" />
    <path d="M 12 18 L 18 18 L 26 12 L 26 36 L 18 30 L 12 30 Z" fill="#2563EB" />
    <path d="M 30 18 Q 36 24, 30 30" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    <path d="M 34 14 Q 42 24, 34 34" fill="none" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- icon_sound_off (48, 0) -->
  <g transform="translate(48, 0)">
    <rect width="48" height="48" fill="none" />
    <path d="M 12 18 L 18 18 L 26 12 L 26 36 L 18 30 L 12 30 Z" fill="#64748B" />
    <line x1="30" y1="18" x2="40" y2="30" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
    <line x1="40" y1="18" x2="30" y2="30" stroke="#EF4444" stroke-width="3.5" stroke-linecap="round" />
  </g>

  <!-- icon_pause (96, 0) -->
  <g transform="translate(96, 0)">
    <rect width="48" height="48" fill="none" />
    <rect x="14" y="12" width="6" height="24" rx="3" fill="#2563EB" />
    <rect x="28" y="12" width="6" height="24" rx="3" fill="#2563EB" />
  </g>

  <!-- icon_play (144, 0) -->
  <g transform="translate(144, 0)">
    <rect width="48" height="48" fill="none" />
    <polygon points="16,12 36,24 16,36" fill="#2563EB" />
  </g>

  <!-- icon_reset (192, 0) -->
  <g transform="translate(192, 0)">
    <rect width="48" height="48" fill="none" />
    <path d="M 34 20 A 12 12 0 1 0 36 26" fill="none" stroke="#2563EB" stroke-width="3.5" stroke-linecap="round" />
    <polygon points="34,13 40,21 32,22" fill="#2563EB" />
  </g>

  <!-- icon_hint (240, 0) -->
  <g transform="translate(240, 0)">
    <rect width="48" height="48" fill="none" />
    <path d="M 10 24 Q 24 12, 38 24 Q 24 36, 10 24 Z" fill="none" stroke="#2563EB" stroke-width="3" stroke-linejoin="round" />
    <circle cx="24" cy="24" r="5" fill="#2563EB" />
  </g>

  <!-- icon_number_toggle (288, 0) -->
  <g transform="translate(288, 0)">
    <rect width="48" height="48" fill="none" />
    <line x1="18" y1="12" x2="15" y2="36" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    <line x1="30" y1="12" x2="27" y2="36" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    <line x1="12" y1="19" x2="36" y2="19" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
    <line x1="10" y1="29" x2="34" y2="29" stroke="#2563EB" stroke-width="3" stroke-linecap="round" />
  </g>

  <!-- icon_theme_selector (336, 0) -->
  <g transform="translate(336, 0)">
    <rect width="48" height="48" fill="none" />
    <path d="M 24 10 C 14 10, 8 16, 8 24 C 8 32, 16 38, 22 38 C 24 38, 26 36, 26 34 C 26 32, 25 31, 25 29 C 25 27, 27 25, 30 25 L 34 25 C 38 25, 40 21, 40 18 C 40 13, 33 10, 24 10 Z" fill="none" stroke="#2563EB" stroke-width="3" stroke-linejoin="round" />
    <circle cx="16" cy="18" r="2.5" fill="#EF4444" />
    <circle cx="24" cy="15" r="2.5" fill="#F59E0B" />
    <circle cx="32" cy="18" r="2.5" fill="#10B981" />
    <circle cx="16" cy="27" r="2.5" fill="#8B5CF6" />
  </g>

  <!-- 2. STARS RATING (64x64) & TROPHY (80x80) -->
  <!-- stars_0 (0, 48) -->
  <g transform="translate(0, 48)">
    <rect width="64" height="64" fill="none" />
    <polygon points="16,22 19,29 27,29 20,34 23,41 16,37 9,41 12,34 5,29 13,29" fill="#CBD5E1" />
    <polygon points="32,16 36,25 46,25 38,31 41,40 32,35 23,40 26,31 18,25 28,25" fill="#94A3B8" />
    <polygon points="48,22 51,29 59,29 52,34 55,41 48,37 41,41 44,34 37,29 45,29" fill="#CBD5E1" />
  </g>

  <!-- stars_1 (64, 48) -->
  <g transform="translate(64, 48)">
    <rect width="64" height="64" fill="none" />
    <polygon points="16,22 19,29 27,29 20,34 23,41 16,37 9,41 12,34 5,29 13,29" fill="url(#goldStar)" />
    <polygon points="32,16 36,25 46,25 38,31 41,40 32,35 23,40 26,31 18,25 28,25" fill="#94A3B8" />
    <polygon points="48,22 51,29 59,29 52,34 55,41 48,37 41,41 44,34 37,29 45,29" fill="#CBD5E1" />
  </g>

  <!-- stars_2 (128, 48) -->
  <g transform="translate(128, 48)">
    <rect width="64" height="64" fill="none" />
    <polygon points="16,22 19,29 27,29 20,34 23,41 16,37 9,41 12,34 5,29 13,29" fill="url(#goldStar)" />
    <polygon points="32,16 36,25 46,25 38,31 41,40 32,35 23,40 26,31 18,25 28,25" fill="url(#goldStar)" />
    <polygon points="48,22 51,29 59,29 52,34 55,41 48,37 41,41 44,34 37,29 45,29" fill="#CBD5E1" />
  </g>

  <!-- stars_3 (192, 48) -->
  <g transform="translate(192, 48)">
    <rect width="64" height="64" fill="none" />
    <polygon points="16,22 19,29 27,29 20,34 23,41 16,37 9,41 12,34 5,29 13,29" fill="url(#goldStar)" />
    <polygon points="32,14 36,24 47,24 38,30 42,40 32,34 22,40 26,30 17,24 28,24" fill="url(#goldStar)" stroke="#FFFBEB" stroke-width="1.5" />
    <polygon points="48,22 51,29 59,29 52,34 55,41 48,37 41,41 44,34 37,29 45,29" fill="url(#goldStar)" />
  </g>

  <!-- ui_empty_slot_glow (256, 48, 64, 64) -->
  <g transform="translate(256, 48)">
    <rect width="64" height="64" fill="none" />
    <rect x="4" y="4" width="56" height="56" rx="8" fill="url(#emptyGlowGrad)" />
    <rect x="6" y="6" width="52" height="52" rx="6" fill="none" stroke="#60A5FA" stroke-width="2" stroke-dasharray="6 4" />
  </g>

  <!-- badge_trophy (320, 48, 80, 80) -->
  <g transform="translate(320, 48)">
    <rect width="80" height="80" fill="none" />
    <path d="M 20 54 Q 14 34, 28 20 Q 24 36, 32 44" fill="#FBBF24" />
    <path d="M 60 54 Q 66 34, 52 20 Q 56 36, 48 44" fill="#FBBF24" />
    <rect x="28" y="62" width="24" height="6" rx="3" fill="#B45309" />
    <rect x="34" y="52" width="12" height="12" fill="#D97706" />
    <path d="M 26 22 L 54 22 C 54 42, 44 48, 40 52 C 36 48, 26 42, 26 22 Z" fill="url(#trophyGrad)" />
    <path d="M 26 26 Q 16 26, 18 36 Q 22 42, 28 40" fill="none" stroke="#F59E0B" stroke-width="3" />
    <path d="M 54 26 Q 64 26, 62 36 Q 58 42, 52 40" fill="none" stroke="#F59E0B" stroke-width="3" />
    <polygon points="40,28 42,33 47,33 43,36 45,41 40,38 35,41 37,36 33,33 38,33" fill="#FFFBEB" />
  </g>

  <!-- 3. SPARKLE FX SEQUENCE (64x64 x 6) -->
  <!-- fx_sparkle_01 (0, 130) -->
  <g transform="translate(0, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="32" cy="32" r="3" fill="#93C5FD" />
  </g>

  <!-- fx_sparkle_02 (64, 130) -->
  <g transform="translate(64, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="32" cy="32" r="6" fill="#60A5FA" />
    <line x1="32" y1="20" x2="32" y2="44" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
    <line x1="20" y1="32" x2="44" y2="32" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" />
  </g>

  <!-- fx_sparkle_03 (128, 130) -->
  <g transform="translate(128, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="32" cy="32" r="14" fill="url(#sparkleGlow)" />
    <path d="M 32 12 Q 32 32, 52 32 Q 32 32, 32 52 Q 32 32, 12 32 Q 32 32, 32 12 Z" fill="#FFFFFF" />
    <circle cx="32" cy="32" r="4" fill="#FDE047" />
  </g>

  <!-- fx_sparkle_04 (192, 130) -->
  <g transform="translate(192, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="32" cy="32" r="22" fill="url(#sparkleGlow)" />
    <path d="M 32 6 Q 32 32, 58 32 Q 32 32, 32 58 Q 32 32, 6 32 Q 32 32, 32 6 Z" fill="#FFFFFF" />
    <circle cx="32" cy="32" r="6" fill="#FDE047" />
    <circle cx="20" cy="20" r="2" fill="#60A5FA" />
    <circle cx="44" cy="44" r="2" fill="#60A5FA" />
    <circle cx="44" cy="20" r="2" fill="#60A5FA" />
    <circle cx="20" cy="44" r="2" fill="#60A5FA" />
  </g>

  <!-- fx_sparkle_05 (256, 130) -->
  <g transform="translate(256, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="32" cy="32" r="16" fill="url(#sparkleGlow)" opacity="0.7" />
    <path d="M 32 16 Q 32 32, 48 32 Q 32 32, 32 48 Q 32 32, 16 32 Q 32 32, 32 16 Z" fill="#93C5FD" />
    <circle cx="14" cy="14" r="2.5" fill="#FDE047" />
    <circle cx="50" cy="50" r="2.5" fill="#FDE047" />
    <circle cx="50" cy="14" r="2.5" fill="#FDE047" />
    <circle cx="14" cy="50" r="2.5" fill="#FDE047" />
  </g>

  <!-- fx_sparkle_06 (320, 130) -->
  <g transform="translate(320, 130)">
    <rect width="64" height="64" fill="none" />
    <circle cx="10" cy="10" r="1.5" fill="#93C5FD" opacity="0.5" />
    <circle cx="54" cy="54" r="1.5" fill="#93C5FD" opacity="0.5" />
    <circle cx="54" cy="10" r="1.5" fill="#93C5FD" opacity="0.5" />
    <circle cx="10" cy="54" r="1.5" fill="#93C5FD" opacity="0.5" />
    <circle cx="32" cy="32" r="2" fill="#FDE047" opacity="0.4" />
  </g>

  <!-- 4. CONFETTI FX SEQUENCE (128x128 x 8) -->
  <!-- Frame 01 (0, 200) -->
  <g transform="translate(0, 200)">
    <rect width="128" height="128" fill="none" />
    <circle cx="64" cy="64" r="8" fill="#EF4444" />
    <circle cx="64" cy="64" r="5" fill="#FBBF24" />
  </g>

  <!-- Frame 02 (128, 200) -->
  <g transform="translate(128, 200)">
    <rect width="128" height="128" fill="none" />
    <circle cx="64" cy="64" r="14" fill="#FBBF24" opacity="0.8" />
    <rect x="60" y="48" width="8" height="8" rx="2" fill="#EF4444" transform="rotate(15 64 52)" />
    <rect x="74" y="60" width="8" height="8" rx="2" fill="#3B82F6" transform="rotate(30 78 64)" />
    <rect x="60" y="74" width="8" height="8" rx="2" fill="#10B981" transform="rotate(45 64 78)" />
    <rect x="46" y="60" width="8" height="8" rx="2" fill="#EC4899" transform="rotate(60 50 64)" />
  </g>

  <!-- Frame 03 (256, 200) -->
  <g transform="translate(256, 200)">
    <rect width="128" height="128" fill="none" />
    <rect x="58" y="32" width="10" height="6" rx="2" fill="#EF4444" transform="rotate(35 63 35)" />
    <rect x="86" y="42" width="10" height="6" rx="2" fill="#F59E0B" transform="rotate(70 91 45)" />
    <rect x="94" y="64" width="10" height="6" rx="2" fill="#3B82F6" transform="rotate(15 99 67)" />
    <rect x="82" y="88" width="10" height="6" rx="2" fill="#10B981" transform="rotate(-40 87 91)" />
    <rect x="58" y="96" width="10" height="6" rx="2" fill="#8B5CF6" transform="rotate(20 63 99)" />
    <rect x="32" y="84" width="10" height="6" rx="2" fill="#EC4899" transform="rotate(60 37 87)" />
    <rect x="24" y="60" width="10" height="6" rx="2" fill="#06B6D4" transform="rotate(-30 29 63)" />
    <rect x="34" y="38" width="10" height="6" rx="2" fill="#FBBF24" transform="rotate(45 39 41)" />
  </g>

  <!-- Frame 04 (384, 200) -->
  <g transform="translate(384, 200)">
    <rect width="128" height="128" fill="none" />
    <path d="M 64 20 Q 75 25, 70 36" stroke="#EF4444" stroke-width="4" fill="none" />
    <path d="M 104 50 Q 112 60, 100 68" stroke="#3B82F6" stroke-width="4" fill="none" />
    <path d="M 72 104 Q 60 112, 54 100" stroke="#10B981" stroke-width="4" fill="none" />
    <path d="M 22 70 Q 14 60, 26 52" stroke="#F59E0B" stroke-width="4" fill="none" />
    <rect x="42" y="16" width="12" height="7" rx="2" fill="#EC4899" transform="rotate(-25 48 19)" />
    <rect x="100" y="28" width="12" height="7" rx="2" fill="#8B5CF6" transform="rotate(55 106 31)" />
    <rect x="108" y="86" width="12" height="7" rx="2" fill="#FBBF24" transform="rotate(15 114 89)" />
    <rect x="40" y="106" width="12" height="7" rx="2" fill="#06B6D4" transform="rotate(-50 46 109)" />
    <rect x="12" y="38" width="12" height="7" rx="2" fill="#EF4444" transform="rotate(75 18 41)" />
  </g>

  <!-- Frame 05 (0, 328) -->
  <g transform="translate(0, 328)">
    <rect width="128" height="128" fill="none" />
    <path d="M 60 12 Q 76 18, 68 32" stroke="#EF4444" stroke-width="4" fill="none" />
    <path d="M 112 42 Q 124 56, 108 68" stroke="#3B82F6" stroke-width="4" fill="none" />
    <path d="M 78 114 Q 62 124, 52 108" stroke="#10B981" stroke-width="4" fill="none" />
    <path d="M 12 76 Q 4 62, 18 52" stroke="#F59E0B" stroke-width="4" fill="none" />
    <rect x="30" y="10" width="10" height="6" rx="2" fill="#8B5CF6" transform="rotate(40 35 13)" />
    <rect x="110" y="18" width="10" height="6" rx="2" fill="#EC4899" transform="rotate(-65 115 21)" />
    <rect x="116" y="98" width="10" height="6" rx="2" fill="#06B6D4" transform="rotate(30 121 101)" />
    <rect x="28" y="112" width="10" height="6" rx="2" fill="#FBBF24" transform="rotate(-30 33 115)" />
    <circle cx="88" cy="88" r="4" fill="#EF4444" />
    <circle cx="44" cy="48" r="4" fill="#3B82F6" />
    <circle cx="86" cy="38" r="4" fill="#10B981" />
  </g>

  <!-- Frame 06 (128, 328) -->
  <g transform="translate(128, 328)">
    <rect width="128" height="128" fill="none" />
    <rect x="18" y="8" width="9" height="5" rx="1.5" fill="#EF4444" transform="rotate(60 22 10)" />
    <rect x="116" y="12" width="9" height="5" rx="1.5" fill="#3B82F6" transform="rotate(-45 120 14)" />
    <rect x="120" y="110" width="9" height="5" rx="1.5" fill="#10B981" transform="rotate(75 124 112)" />
    <rect x="12" y="116" width="9" height="5" rx="1.5" fill="#F59E0B" transform="rotate(-15 16 118)" />
    <circle cx="98" cy="94" r="3.5" fill="#EC4899" />
    <circle cx="34" cy="38" r="3.5" fill="#8B5CF6" />
    <circle cx="92" cy="28" r="3.5" fill="#06B6D4" />
    <circle cx="28" cy="88" r="3.5" fill="#FBBF24" />
  </g>

  <!-- Frame 07 (256, 328) -->
  <g transform="translate(256, 328)">
    <rect width="128" height="128" fill="none" />
    <rect x="12" y="18" width="7" height="4" rx="1" fill="#EF4444" opacity="0.8" transform="rotate(80 15 20)" />
    <rect x="118" y="24" width="7" height="4" rx="1" fill="#3B82F6" opacity="0.8" transform="rotate(-30 121 26)" />
    <rect x="114" y="118" width="7" height="4" rx="1" fill="#10B981" opacity="0.8" transform="rotate(45 117 120)" />
    <rect x="8" y="120" width="7" height="4" rx="1" fill="#F59E0B" opacity="0.8" transform="rotate(-60 11 122)" />
    <circle cx="104" cy="102" r="2.5" fill="#EC4899" opacity="0.7" />
    <circle cx="26" cy="46" r="2.5" fill="#8B5CF6" opacity="0.7" />
    <circle cx="98" cy="36" r="2.5" fill="#06B6D4" opacity="0.7" />
  </g>

  <!-- Frame 08 (384, 328) -->
  <g transform="translate(384, 328)">
    <rect width="128" height="128" fill="none" />
    <circle cx="8" cy="28" r="2" fill="#EF4444" opacity="0.4" />
    <circle cx="122" cy="36" r="2" fill="#3B82F6" opacity="0.4" />
    <circle cx="118" cy="122" r="2" fill="#10B981" opacity="0.4" />
    <circle cx="4" cy="124" r="2" fill="#F59E0B" opacity="0.4" />
    <circle cx="108" cy="110" r="1.5" fill="#EC4899" opacity="0.3" />
    <circle cx="20" cy="54" r="1.5" fill="#8B5CF6" opacity="0.3" />
  </g>
</svg>
`;

// 6. JSON ATLAS & CSS GENERATION
const atlasCoordinates = {
  frames: {
    icon_sound_on: { x: 0, y: 0, w: 48, h: 48 },
    icon_sound_off: { x: 48, y: 0, w: 48, h: 48 },
    icon_pause: { x: 96, y: 0, w: 48, h: 48 },
    icon_play: { x: 144, y: 0, w: 48, h: 48 },
    icon_reset: { x: 192, y: 0, w: 48, h: 48 },
    icon_hint: { x: 240, y: 0, w: 48, h: 48 },
    icon_number_toggle: { x: 288, y: 0, w: 48, h: 48 },
    icon_theme_selector: { x: 336, y: 0, w: 48, h: 48 },

    stars_0: { x: 0, y: 48, w: 64, h: 64 },
    stars_1: { x: 64, y: 48, w: 64, h: 64 },
    stars_2: { x: 128, y: 48, w: 64, h: 64 },
    stars_3: { x: 192, y: 48, w: 64, h: 64 },
    ui_empty_slot_glow: { x: 256, y: 48, w: 64, h: 64 },
    badge_trophy: { x: 320, y: 48, w: 80, h: 80 },

    fx_sparkle_01: { x: 0, y: 130, w: 64, h: 64 },
    fx_sparkle_02: { x: 64, y: 130, w: 64, h: 64 },
    fx_sparkle_03: { x: 128, y: 130, w: 64, h: 64 },
    fx_sparkle_04: { x: 192, y: 130, w: 64, h: 64 },
    fx_sparkle_05: { x: 256, y: 130, w: 64, h: 64 },
    fx_sparkle_06: { x: 320, y: 130, w: 64, h: 64 },

    fx_confetti_01: { x: 0, y: 200, w: 128, h: 128 },
    fx_confetti_02: { x: 128, y: 200, w: 128, h: 128 },
    fx_confetti_03: { x: 256, y: 200, w: 128, h: 128 },
    fx_confetti_04: { x: 384, y: 200, w: 128, h: 128 },
    fx_confetti_05: { x: 0, y: 328, w: 128, h: 128 },
    fx_confetti_06: { x: 128, y: 328, w: 128, h: 128 },
    fx_confetti_07: { x: 256, y: 328, w: 128, h: 128 },
    fx_confetti_08: { x: 384, y: 328, w: 128, h: 128 }
  },
  meta: {
    image: 'sheet_ui_fx.png',
    size: { w: 512, h: 512 },
    scale: 1,
    format: 'RGBA8888'
  }
};

const createCSSAtlas = () => `/* ==========================================================================
   SPRITESHEET UI & FX UTILITY CLASSES
   Spritesheet Dimensions: 512px x 512px
   ========================================================================== */

.sprite {
  background-image: url('/assets/sprites/sheet_ui_fx.png');
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
}

/* System & Utility Icons (48x48) */
.sprite-icon {
  width: 48px;
  height: 48px;
}
.sprite-icon-sound-on       { background-position: 0px 0px; }
.sprite-icon-sound-off      { background-position: -48px 0px; }
.sprite-icon-pause          { background-position: -96px 0px; }
.sprite-icon-play           { background-position: -144px 0px; }
.sprite-icon-reset          { background-position: -192px 0px; }
.sprite-icon-hint           { background-position: -240px 0px; }
.sprite-icon-number-toggle  { background-position: -288px 0px; }
.sprite-icon-theme-selector { background-position: -336px 0px; }

/* Star Ratings & Badges */
.sprite-stars-0             { width: 64px; height: 64px; background-position: 0px -48px; }
.sprite-stars-1             { width: 64px; height: 64px; background-position: -64px -48px; }
.sprite-stars-2             { width: 64px; height: 64px; background-position: -128px -48px; }
.sprite-stars-3             { width: 64px; height: 64px; background-position: -192px -48px; }
.sprite-empty-slot-glow     { width: 64px; height: 64px; background-position: -256px -48px; }
.sprite-badge-trophy        { width: 80px; height: 80px; background-position: -320px -48px; }

/* FX Sparkle Sequence (64x64) */
.sprite-sparkle-1 { width: 64px; height: 64px; background-position: 0px -130px; }
.sprite-sparkle-2 { width: 64px; height: 64px; background-position: -64px -130px; }
.sprite-sparkle-3 { width: 64px; height: 64px; background-position: -128px -130px; }
.sprite-sparkle-4 { width: 64px; height: 64px; background-position: -192px -130px; }
.sprite-sparkle-5 { width: 64px; height: 64px; background-position: -256px -130px; }
.sprite-sparkle-6 { width: 64px; height: 64px; background-position: -320px -130px; }

/* FX Confetti Sequence (128x128) */
.sprite-confetti-1 { width: 128px; height: 128px; background-position: 0px -200px; }
.sprite-confetti-2 { width: 128px; height: 128px; background-position: -128px -200px; }
.sprite-confetti-3 { width: 128px; height: 128px; background-position: -256px -200px; }
.sprite-confetti-4 { width: 128px; height: 128px; background-position: -384px -200px; }
.sprite-confetti-5 { width: 128px; height: 128px; background-position: 0px -328px; }
.sprite-confetti-6 { width: 128px; height: 128px; background-position: -128px -328px; }
.sprite-confetti-7 { width: 128px; height: 128px; background-position: -256px -328px; }
.sprite-confetti-8 { width: 128px; height: 128px; background-position: -384px -328px; }
`;

// MAIN BUILD RUNNER
async function buildAllAssets() {
  console.log('🚀 Starting 2D Asset & Spritesheet Generation Pipeline...\n');

  const themes = [
    { name: 'theme_nature.png', svg: createNatureSVG(), label: 'Theme 1 (Nature)' },
    { name: 'theme_pixel_art.png', svg: createPixelArtSVG(), label: 'Theme 2 (Pixel Art)' },
    { name: 'theme_abstract.png', svg: createAbstractSVG(), label: 'Theme 3 (Abstract)' },
    { name: 'theme_animal.png', svg: createAnimalSVG(), label: 'Theme 4 (Animal)' }
  ];

  for (const theme of themes) {
    const filePath = path.join(imagesDir, theme.name);
    const svgBuffer = Buffer.from(theme.svg);
    await sharp(svgBuffer)
      .resize(1024, 1024)
      .png({ compressionLevel: 9, quality: 95 })
      .toFile(filePath);
    const stat = fs.statSync(filePath);
    console.log(`✅ [${theme.label}] Succeeded -> ${filePath} (${(stat.size / 1024).toFixed(1)} KB)`);
  }

  const spritesheetSVG = createSpritesheetSVG();
  const spritePngPath = path.join(spritesDir, 'sheet_ui_fx.png');
  await sharp(Buffer.from(spritesheetSVG))
    .resize(512, 512)
    .png({ compressionLevel: 9 })
    .toFile(spritePngPath);
  const spriteStat = fs.statSync(spritePngPath);
  console.log(`\n✅ [Sheet B: Spritesheet] Succeeded -> ${spritePngPath} (${(spriteStat.size / 1024).toFixed(1)} KB)`);

  const jsonPath = path.join(spritesDir, 'sheet_ui_fx.json');
  fs.writeFileSync(jsonPath, JSON.stringify(atlasCoordinates, null, 2), 'utf-8');
  console.log(`✅ [Atlas JSON] Succeeded -> ${jsonPath}`);

  const cssPath = path.join(spritesDir, 'sheet_ui_fx.css');
  fs.writeFileSync(cssPath, createCSSAtlas(), 'utf-8');
  console.log(`✅ [Atlas CSS] Succeeded -> ${cssPath}`);

  console.log('\n🎉 All design assets compiled successfully!');
}

buildAllAssets().catch((err) => {
  console.error('❌ Error generating assets:', err);
  process.exit(1);
});
