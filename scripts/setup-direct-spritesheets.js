import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const userImgDir = path.join(rootDir, 'docs', 'DESIGN', 'img');
const spritesDir = path.join(rootDir, 'public', 'assets', 'sprites');
const iconsDir = path.join(rootDir, 'public', 'assets', 'icons');

async function setupDirectSpritesheets() {
  console.log('📂 Copying and setting up user-provided spritesheets directly...\n');

  const uiSrc = path.join(userImgDir, 'ui_icons_spritesheet1.png');
  const fxSrc = path.join(userImgDir, 'fx_animations_spritesheet.png');

  // 1. Copy directly to public/assets/sprites/
  const uiDest = path.join(spritesDir, 'ui_icons_spritesheet.png');
  const uiDest1 = path.join(spritesDir, 'ui_icons_spritesheet1.png');
  const fxDest = path.join(spritesDir, 'fx_animations_spritesheet.png');

  fs.copyFileSync(uiSrc, uiDest);
  fs.copyFileSync(uiSrc, uiDest1);
  fs.copyFileSync(fxSrc, fxDest);

  console.log(`✅ Copied UI Spritesheet -> ${uiDest} (${(fs.statSync(uiDest).size / 1024).toFixed(1)} KB)`);
  console.log(`✅ Copied FX Spritesheet -> ${fxDest} (${(fs.statSync(fxDest).size / 1024).toFixed(1)} KB)`);

  // 2. Extract Individual Icons (48x48, 64x64, 80x80) directly from ui_icons_spritesheet1.png
  const uiMeta = await sharp(uiSrc).metadata();
  const colW = uiMeta.width / 5; // 281.6
  const rowH = uiMeta.height / 3; // 256

  const uiItems = [
    { id: 'icon_sound_on', col: 0, row: 0, size: 48 },
    { id: 'icon_sound_off', col: 1, row: 0, size: 48 },
    { id: 'icon_pause', col: 2, row: 0, size: 48 },
    { id: 'icon_play', col: 3, row: 0, size: 48 },
    { id: 'icon_reset', col: 4, row: 0, size: 48 },
    { id: 'icon_hint', col: 0, row: 1, size: 48 },
    { id: 'icon_number_toggle', col: 1, row: 1, size: 48 },
    { id: 'icon_theme_selector', col: 2, row: 1, size: 48 },
    { id: 'ui_empty_slot_glow', col: 3, row: 1, size: 64 },
    { id: 'badge_trophy', col: 4, row: 1, size: 80 },
    { id: 'stars_0', col: 0, row: 2, size: 64 },
    { id: 'stars_1', col: 1, row: 2, size: 64 },
    { id: 'stars_2', col: 2, row: 2, size: 64 },
    { id: 'stars_3', col: 3, row: 2, size: 64 }
  ];

  for (const item of uiItems) {
    const left = Math.round(item.col * colW);
    const top = Math.round(item.row * rowH);
    const width = Math.round((item.col + 1) * colW) - left;
    const height = Math.round((item.row + 1) * rowH) - top;

    const cropped = await sharp(uiSrc)
      .extract({ left, top, width, height })
      .toBuffer();

    const trimmed = await sharp(cropped)
      .trim()
      .resize(item.size, item.size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    const outPath = path.join(iconsDir, `${item.id}.png`);
    fs.writeFileSync(outPath, trimmed);
    console.log(`  ✓ Exported individual icon: ${item.id}.png`);
  }

  // 3. Generate JSON metadata for ui_icons_spritesheet.json
  const uiJson = {
    image: 'ui_icons_spritesheet.png',
    size: { w: 1408, h: 768 },
    grid: { cols: 5, rows: 3, cellW: 281.6, cellH: 256 },
    frames: {
      icon_sound_on: { col: 0, row: 0, x: 0, y: 0, w: 282, h: 256 },
      icon_sound_off: { col: 1, row: 0, x: 282, y: 0, w: 282, h: 256 },
      icon_pause: { col: 2, row: 0, x: 563, y: 0, w: 282, h: 256 },
      icon_play: { col: 3, row: 0, x: 845, y: 0, w: 282, h: 256 },
      icon_reset: { col: 4, row: 0, x: 1126, y: 0, w: 282, h: 256 },
      icon_hint: { col: 0, row: 1, x: 0, y: 256, w: 282, h: 256 },
      icon_number_toggle: { col: 1, row: 1, x: 282, y: 256, w: 282, h: 256 },
      icon_theme_selector: { col: 2, row: 1, x: 563, y: 256, w: 282, h: 256 },
      ui_empty_slot_glow: { col: 3, row: 1, x: 845, y: 256, w: 282, h: 256 },
      badge_trophy: { col: 4, row: 1, x: 1126, y: 256, w: 282, h: 256 },
      stars_0: { col: 0, row: 2, x: 0, y: 512, w: 282, h: 256 },
      stars_1: { col: 1, row: 2, x: 282, y: 512, w: 282, h: 256 },
      stars_2: { col: 2, row: 2, x: 563, y: 512, w: 282, h: 256 },
      stars_3: { col: 3, row: 2, x: 845, y: 512, w: 282, h: 256 }
    }
  };
  fs.writeFileSync(path.join(spritesDir, 'ui_icons_spritesheet.json'), JSON.stringify(uiJson, null, 2), 'utf-8');

  // 4. Generate JSON metadata for fx_animations_spritesheet.json
  const fxJson = {
    image: 'fx_animations_spritesheet.png',
    size: { w: 1408, h: 768 },
    sparkles: {
      grid: { cols: 6, rows: 1, cellW: 234.67, cellH: 384 },
      frames: Array.from({ length: 6 }).map((_, i) => ({
        id: `fx_sparkle_0${i + 1}`,
        col: i,
        row: 0,
        x: Math.round(i * 234.67),
        y: 0,
        w: 235,
        h: 384
      }))
    },
    confetti: {
      grid: { cols: 8, rows: 1, cellW: 176, cellH: 384 },
      frames: Array.from({ length: 8 }).map((_, i) => ({
        id: `fx_confetti_0${i + 1}`,
        col: i,
        row: 1,
        x: Math.round(i * 176),
        y: 384,
        w: 176,
        h: 384
      }))
    }
  };
  fs.writeFileSync(path.join(spritesDir, 'fx_animations_spritesheet.json'), JSON.stringify(fxJson, null, 2), 'utf-8');

  // 5. Generate CSS Sprite utility file
  const css = `/* ==========================================================================
   DIRECT USER SPRITESHEETS: UI ICONS & FX ANIMATIONS
   ========================================================================== */

/* Base UI Icon Sprite (1408x768 -> 5 columns x 3 rows) */
.sprite,
.sprite-ui {
  background-image: url('/assets/sprites/ui_icons_spritesheet.png');
  background-size: 500% 300%;
  background-repeat: no-repeat;
  display: inline-block;
  vertical-align: middle;
}

/* System & Utility Icons (48x48) */
.sprite-icon {
  width: 48px;
  height: 48px;
}
.sprite-icon-sound-on       { background-position: 0% 0%; }
.sprite-icon-sound-off      { background-position: 25% 0%; }
.sprite-icon-pause          { background-position: 50% 0%; }
.sprite-icon-play           { background-position: 75% 0%; }
.sprite-icon-reset          { background-position: 100% 0%; }

.sprite-icon-hint           { background-position: 0% 50%; }
.sprite-icon-number-toggle  { background-position: 25% 50%; }
.sprite-icon-theme-selector { background-position: 50% 50%; }
.sprite-empty-slot-glow     { width: 64px; height: 64px; background-position: 75% 50%; }
.sprite-badge-trophy        { width: 80px; height: 80px; background-position: 100% 50%; }

/* Star Ratings (64x64 or custom) */
.sprite-stars-0             { width: 64px; height: 64px; background-position: 0% 100%; }
.sprite-stars-1             { width: 64px; height: 64px; background-position: 25% 100%; }
.sprite-stars-2             { width: 64px; height: 64px; background-position: 50% 100%; }
.sprite-stars-3             { width: 64px; height: 64px; background-position: 75% 100%; }

/* FX Sparkle Sequence (6 columns x 2 rows -> background-size: 600% 200%) */
.sprite-sparkle {
  background-image: url('/assets/sprites/fx_animations_spritesheet.png');
  background-size: 600% 200%;
  background-repeat: no-repeat;
  width: 64px;
  height: 64px;
  display: inline-block;
}
.sprite-sparkle-1 { background-position: 0% 0%; }
.sprite-sparkle-2 { background-position: 20% 0%; }
.sprite-sparkle-3 { background-position: 40% 0%; }
.sprite-sparkle-4 { background-position: 60% 0%; }
.sprite-sparkle-5 { background-position: 80% 0%; }
.sprite-sparkle-6 { background-position: 100% 0%; }

/* FX Confetti Sequence (8 columns x 2 rows -> background-size: 800% 200%) */
.sprite-confetti {
  background-image: url('/assets/sprites/fx_animations_spritesheet.png');
  background-size: 800% 200%;
  background-repeat: no-repeat;
  width: 128px;
  height: 128px;
  display: inline-block;
}
.sprite-confetti-1 { background-position: 0% 100%; }
.sprite-confetti-2 { background-position: 14.2857% 100%; }
.sprite-confetti-3 { background-position: 28.5714% 100%; }
.sprite-confetti-4 { background-position: 42.8571% 100%; }
.sprite-confetti-5 { background-position: 57.1428% 100%; }
.sprite-confetti-6 { background-position: 71.4285% 100%; }
.sprite-confetti-7 { background-position: 85.7142% 100%; }
.sprite-confetti-8 { background-position: 100% 100%; }
`;

  fs.writeFileSync(path.join(spritesDir, 'sheet_ui_fx.css'), css, 'utf-8');
  console.log(`✅ Generated Sprite CSS -> ${path.join(spritesDir, 'sheet_ui_fx.css')}`);

  console.log('\n🎉 Direct user spritesheets setup complete!');
}

setupDirectSpritesheets().catch((err) => {
  console.error('❌ Error setting up direct spritesheets:', err);
  process.exit(1);
});
