import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const spritesDir = path.join(rootDir, 'public', 'assets', 'sprites');
const previewDir = path.join(rootDir, 'public', 'assets', 'preview_art');

if (!fs.existsSync(previewDir)) fs.mkdirSync(previewDir, { recursive: true });

// =============================================================================
// 1. PREMIUM 3D GOLD TROPHY BADGE (80x80 px)
// =============================================================================
const createTrophySVG = () => `
<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Gold Metallic Gradients -->
    <linearGradient id="goldLight" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="goldCup" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="20%" stop-color="#FDE047" />
      <stop offset="55%" stop-color="#F59E0B" />
      <stop offset="85%" stop-color="#B45309" />
      <stop offset="100%" stop-color="#78350F" />
    </linearGradient>
    <linearGradient id="goldSpec" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#D97706" />
      <stop offset="25%" stop-color="#FFFBEB" />
      <stop offset="50%" stop-color="#FBBF24" />
      <stop offset="75%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="pedestal" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="50%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="laurelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FEF08A" />
      <stop offset="50%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <radialGradient id="trophyGlow" cx="50%" cy="40%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.6" />
      <stop offset="50%" stop-color="#F59E0B" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="3" stdDeviation="2.5" flood-color="#000000" flood-opacity="0.35" />
    </filter>
  </defs>

  <!-- Ambient Glow Behind Trophy -->
  <circle cx="40" cy="38" r="34" fill="url(#trophyGlow)" />

  <!-- Laurel Wreath Leaves (Left Side) -->
  <g fill="url(#laurelGrad)" filter="url(#softShadow)">
    <path d="M 22 56 C 14 48, 14 32, 24 22 C 23 28, 20 42, 26 50 Z" />
    <ellipse cx="16" cy="32" rx="4.5" ry="2.5" transform="rotate(-35 16 32)" />
    <ellipse cx="18" cy="42" rx="4.5" ry="2.5" transform="rotate(-15 18 42)" />
    <ellipse cx="23" cy="24" rx="4.5" ry="2.5" transform="rotate(-55 23 24)" />
    <ellipse cx="22" cy="52" rx="4" ry="2.2" transform="rotate(10 22 52)" />
  </g>

  <!-- Laurel Wreath Leaves (Right Side) -->
  <g fill="url(#laurelGrad)" filter="url(#softShadow)">
    <path d="M 58 56 C 66 48, 66 32, 56 22 C 57 28, 60 42, 54 50 Z" />
    <ellipse cx="64" cy="32" rx="4.5" ry="2.5" transform="rotate(35 64 32)" />
    <ellipse cx="62" cy="42" rx="4.5" ry="2.5" transform="rotate(15 62 42)" />
    <ellipse cx="57" cy="24" rx="4.5" ry="2.5" transform="rotate(55 57 24)" />
    <ellipse cx="58" cy="52" rx="4" ry="2.2" transform="rotate(-10 58 52)" />
  </g>

  <!-- Handles (Left and Right) -->
  <g filter="url(#softShadow)">
    <!-- Left Handle Outer & Inner Cut -->
    <path d="M 27 24 C 14 24, 14 42, 28 46 L 29 42 C 18 39, 18 28, 28 28 Z" fill="url(#goldLight)" />
    <path d="M 26 26 C 17 26, 17 40, 27 43 L 28 41 C 20 38, 20 29, 27 29 Z" fill="#92400E" opacity="0.4" />
    
    <!-- Right Handle Outer & Inner Cut -->
    <path d="M 53 24 C 66 24, 66 42, 52 46 L 51 42 C 62 39, 62 28, 52 28 Z" fill="url(#goldLight)" />
    <path d="M 54 26 C 63 26, 63 40, 53 43 L 52 41 C 60 38, 60 29, 53 29 Z" fill="#92400E" opacity="0.4" />
  </g>

  <!-- Pedestal Base (Black/Gold Trim) -->
  <g filter="url(#softShadow)">
    <!-- Sub-base plate -->
    <rect x="24" y="67" width="32" height="6" rx="2.5" fill="#1E293B" stroke="#F59E0B" stroke-width="1.2" />
    <!-- Gold Plaque on base -->
    <rect x="29" y="68.5" width="22" height="3" rx="1" fill="url(#goldSpec)" />
    
    <!-- Pedestal Block -->
    <polygon points="28,67 52,67 49,58 31,58" fill="url(#pedestal)" stroke="#D97706" stroke-width="1" />
    <!-- Stem Ring -->
    <ellipse cx="40" cy="58" rx="7" ry="2.5" fill="url(#goldSpec)" />
    <rect x="36" y="52" width="8" height="6" fill="url(#goldCup)" />
    <ellipse cx="40" cy="52" rx="6" ry="2" fill="url(#goldLight)" />
  </g>

  <!-- Main Trophy Cup Body -->
  <g filter="url(#softShadow)">
    <!-- Cup Rim & Bowl -->
    <path d="M 24 20 L 56 20 C 56 36, 49 48, 40 52 C 31 48, 24 36, 24 20 Z" fill="url(#goldCup)" stroke="#FFFBEB" stroke-width="0.8" />
    
    <!-- 3D Specular Highlight Band on Cup -->
    <path d="M 28 22 C 31 34, 34 44, 38 49 C 34 45, 30 35, 27 22 Z" fill="#FFFBEB" opacity="0.65" />
    
    <!-- Top Opening Rim (Ellipse) -->
    <ellipse cx="40" cy="20" rx="16" ry="4.5" fill="url(#goldSpec)" stroke="#FFFBEB" stroke-width="1" />
    <ellipse cx="40" cy="20" rx="13.5" ry="3" fill="#B45309" opacity="0.75" />

    <!-- Center Star Emblem on Cup -->
    <polygon points="40,28 42.2,33.5 48,33.8 43.6,37.3 45.2,43 40,39.8 34.8,43 36.4,37.3 32,33.8 37.8,33.5" fill="url(#goldLight)" stroke="#78350F" stroke-width="0.8" filter="url(#softShadow)" />
    <polygon points="40,29 41.5,33.2 46,33.5 42.5,36.2 43.8,40.5 40,38 36.2,40.5 37.5,36.2 34,33.5 38.5,33.2" fill="#FFFDF0" />

    <!-- Twinkle Sparkle on Rim (Top Right) -->
    <path d="M 53 17 Q 53 20, 56 20 Q 53 20, 53 23 Q 53 20, 50 20 Q 53 20, 53 17 Z" fill="#FFFFFF" />
    <circle cx="53" cy="20" r="1.5" fill="#FEF08A" />
  </g>
</svg>
`;

// =============================================================================
// 2. PREMIUM 3D METALLIC STARS (64x64 px each)
// =============================================================================
// Helper: Draw 3D Star with Bevel Highlights & Soft Shadow
function draw3DStar(cx, cy, r, isActive, isHero = false) {
  const points = [];
  const innerR = r * 0.44;
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * (Math.PI / 180);
    const cr = i % 2 === 0 ? r : innerR;
    points.push(`${(cx + cr * Math.cos(angle)).toFixed(2)},${(cy + cr * Math.sin(angle)).toFixed(2)}`);
  }
  const ptsStr = points.join(' ');

  if (!isActive) {
    // Inactive Slate Star
    return `
    <g filter="url(#starShadow)">
      <!-- Outer Inactive Star -->
      <polygon points="${ptsStr}" fill="url(#inactiveStarGrad)" stroke="#475569" stroke-width="1.2" stroke-linejoin="round" />
      <!-- Subtle Inner Chamfer -->
      <polygon points="${points.map((p, idx) => {
        const [x, y] = p.split(',').map(Number);
        return `${(cx + (x - cx) * 0.72).toFixed(2)},${(cy + (y - cy) * 0.72).toFixed(2)}`;
      }).join(' ')}" fill="#1E293B" opacity="0.6" />
    </g>`;
  }

  // Active Brilliant 3D Gold Star
  const innerPtsStr = points.map((p) => {
    const [x, y] = p.split(',').map(Number);
    return `${(cx + (x - cx) * 0.65).toFixed(2)},${(cy + (y - cy) * 0.65).toFixed(2)}`;
  }).join(' ');

  const spark = isHero ? `
    <!-- Hero Star Diamond Sparkle -->
    <path d="M ${cx} ${cy - r - 4} Q ${cx} ${cy}, ${cx + r + 4} ${cy} Q ${cx} ${cy}, ${cx} ${cy + r + 4} Q ${cx} ${cy}, ${cx - r - 4} ${cy} Q ${cx} ${cy}, ${cx} ${cy - r - 4} Z" fill="#FFFFFF" opacity="0.85" />
    <circle cx="${cx}" cy="${cy}" r="3" fill="#FFFBEB" />
  ` : '';

  return `
  <g filter="url(#goldGlow)">
    <!-- Ambient Radiance Behind Active Star -->
    <circle cx="${cx}" cy="${cy}" r="${r * 1.35}" fill="url(#starRadiance)" />
    
    <!-- Outer Star Body with Rich Metallic Gradient -->
    <polygon points="${ptsStr}" fill="url(#activeGoldGrad)" stroke="#FFFBEB" stroke-width="1.2" stroke-linejoin="round" />
    
    <!-- 3D Bevel Facets (Top Left Light, Bottom Right Shade) -->
    <polygon points="${ptsStr}" fill="url(#starFacetShading)" opacity="0.45" />

    <!-- Inner Core Star -->
    <polygon points="${innerPtsStr}" fill="url(#innerGoldGrad)" />

    <!-- Top-Left Specular Glint on Top Tip -->
    <circle cx="${cx}" cy="${cy - r + 3}" r="${Math.max(1.5, r * 0.15)}" fill="#FFFFFF" />
    ${spark}
  </g>`;
}

const createStarsSVG = (activeCount) => `
<svg width="64" height="64" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Inactive Star Gradient -->
    <linearGradient id="inactiveStarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#94A3B8" />
      <stop offset="45%" stop-color="#64748B" />
      <stop offset="100%" stop-color="#334155" />
    </linearGradient>

    <!-- Active Gold Metallic Gradients -->
    <linearGradient id="activeGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFBEB" />
      <stop offset="25%" stop-color="#FDE047" />
      <stop offset="60%" stop-color="#F59E0B" />
      <stop offset="100%" stop-color="#B45309" />
    </linearGradient>
    <linearGradient id="innerGoldGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="40%" stop-color="#FDE047" />
      <stop offset="100%" stop-color="#D97706" />
    </linearGradient>
    <linearGradient id="starFacetShading" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#F59E0B" stop-opacity="0" />
      <stop offset="100%" stop-color="#78350F" stop-opacity="0.9" />
    </linearGradient>

    <!-- Bloom & Radiance -->
    <radialGradient id="starRadiance" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FDE047" stop-opacity="0.6" />
      <stop offset="55%" stop-color="#F59E0B" stop-opacity="0.25" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>

    <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" flood-color="#000000" flood-opacity="0.35" />
    </filter>
    <filter id="goldGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#F59E0B" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Left Star (Smaller) -->
  ${draw3DStar(14, 38, 11, activeCount >= 1)}

  <!-- Center Hero Star (Larger, Elevated) -->
  ${draw3DStar(32, 28, 16.5, activeCount >= 2, activeCount === 3)}

  <!-- Right Star (Smaller) -->
  ${draw3DStar(50, 38, 11, activeCount >= 3)}
</svg>
`;

async function renderArtRevisions() {
  console.log('✨ Rendering Premium Trophy and 3D Metallic Stars...\n');

  // 1. Render Trophy (80x80)
  const trophySvg = createTrophySVG();
  const trophyPath = path.join(previewDir, 'badge_trophy.png');
  await sharp(Buffer.from(trophySvg)).resize(80, 80).png().toFile(trophyPath);
  console.log(`✅ [badge_trophy.png] Rendered -> 80x80 px`);

  // 2. Render Stars 0 ~ 3 (64x64)
  for (let i = 0; i <= 3; i++) {
    const starSvg = createStarsSVG(i);
    const starPath = path.join(previewDir, `stars_${i}.png`);
    await sharp(Buffer.from(starSvg)).resize(64, 64).png().toFile(starPath);
    console.log(`✅ [stars_${i}.png] Rendered -> 64x64 px (Active: ${i} stars)`);
  }

  // 3. Composite into public/assets/sprites/sheet_ui_fx.png
  console.log('\n📦 Re-packing sheet_ui_fx.png with revised assets...');

  const currentSheetPath = path.join(spritesDir, 'sheet_ui_fx.png');

  // Load existing spritesheet
  const baseSheet = sharp(currentSheetPath);

  // Replacement overlays
  const replacements = [
    { input: path.join(previewDir, 'stars_0.png'), left: 0, top: 48 },
    { input: path.join(previewDir, 'stars_1.png'), left: 64, top: 48 },
    { input: path.join(previewDir, 'stars_2.png'), left: 128, top: 48 },
    { input: path.join(previewDir, 'stars_3.png'), left: 192, top: 48 },
    { input: path.join(previewDir, 'badge_trophy.png'), left: 320, top: 48 }
  ];

  // Composite over the base sheet
  await baseSheet
    .composite(replacements)
    .png({ compressionLevel: 9 })
    .toFile(path.join(spritesDir, 'sheet_ui_fx.png.tmp'));

  fs.renameSync(path.join(spritesDir, 'sheet_ui_fx.png.tmp'), currentSheetPath);

  const stat = fs.statSync(currentSheetPath);
  console.log(`✅ [sheet_ui_fx.png] Re-packed successfully! Total Size: ${(stat.size / 1024).toFixed(1)} KB`);

  // Clean up preview dir
  fs.rmSync(previewDir, { recursive: true, force: true });

  console.log('\n🎉 ART Revision Tasks (ART-01 & ART-02) Completed Perfectly!');
}

renderArtRevisions().catch((err) => {
  console.error('❌ Error rendering art revisions:', err);
  process.exit(1);
});
