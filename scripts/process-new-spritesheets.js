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

if (!fs.existsSync(spritesDir)) fs.mkdirSync(spritesDir, { recursive: true });
if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });

// Helper: Remove white background and create smooth alpha
async function removeWhiteBackground(buffer, threshold = 240) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

    if (r >= threshold && g >= threshold && b >= threshold) {
      // Pure white -> 0 alpha
      out[i + 3] = 0;
    } else if (brightness > 220) {
      // Anti-aliased white fringe -> smooth alpha falloff
      const factor = (255 - brightness) / (255 - 220);
      out[i + 3] = Math.round(out[i + 3] * Math.max(0, Math.min(1, factor)));
    }
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// Helper: Remove black background for FX glows
async function removeBlackBackground(buffer, threshold = 18) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const maxVal = Math.max(r, g, b);

    if (maxVal <= threshold) {
      out[i + 3] = 0;
    } else if (maxVal < 80) {
      const factor = (maxVal - threshold) / (80 - threshold);
      out[i + 3] = Math.round(out[i + 3] * Math.max(0, Math.min(1, factor)));
    }
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function processNewSpritesheets() {
  console.log('🔄 Processing newly updated spritesheets from docs/DESIGN/img/ ...\n');

  const uiSrc = path.join(userImgDir, 'ui_icons_spritesheet1.png');
  const fxSrc = path.join(userImgDir, 'fx_animations_spritesheet.png');

  const uiMeta = await sharp(uiSrc).metadata();
  const fxMeta = await sharp(fxSrc).metadata();

  console.log(`UI Source: ${uiSrc} (${uiMeta.width}x${uiMeta.height})`);
  console.log(`FX Source: ${fxSrc} (${fxMeta.width}x${fxMeta.height})\n`);

  const extracted = {};

  // 1. Process UI Sheet (1376x768 -> 5 cols x 3 rows)
  const uiColW = uiMeta.width / 5; // 275.2
  const uiRowH = uiMeta.height / 3; // 256

  const uiItems = [
    // Row 0
    { id: 'icon_sound_on', col: 0, row: 0, targetSize: 48, isIcon: true },
    { id: 'icon_sound_off', col: 1, row: 0, targetSize: 48, isIcon: true },
    { id: 'icon_pause', col: 2, row: 0, targetSize: 48, isIcon: true },
    { id: 'icon_play', col: 3, row: 0, targetSize: 48, isIcon: true },
    { id: 'icon_reset', col: 4, row: 0, targetSize: 48, isIcon: true },

    // Row 1
    { id: 'icon_hint', col: 0, row: 1, targetSize: 48, isIcon: true },
    { id: 'icon_number_toggle', col: 1, row: 1, targetSize: 48, isIcon: true },
    { id: 'icon_theme_selector', col: 2, row: 1, targetSize: 48, isIcon: true },
    { id: 'ui_empty_slot_glow', col: 3, row: 1, targetSize: 64, isIcon: false },
    { id: 'badge_trophy', col: 4, row: 1, targetSize: 80, isIcon: false },

    // Row 2
    { id: 'stars_0', col: 0, row: 2, targetSize: 64, isIcon: false },
    { id: 'stars_1', col: 1, row: 2, targetSize: 64, isIcon: false },
    { id: 'stars_2', col: 2, row: 2, targetSize: 64, isIcon: false },
    { id: 'stars_3', col: 3, row: 2, targetSize: 64, isIcon: false }
  ];

  for (const item of uiItems) {
    const left = Math.round(item.col * uiColW);
    const top = Math.round(item.row * uiRowH);
    const width = Math.round((item.col + 1) * uiColW) - left;
    const height = Math.round((item.row + 1) * uiRowH) - top;

    const cellBuf = await sharp(uiSrc).extract({ left, top, width, height }).toBuffer();
    const transparentBuf = await removeWhiteBackground(cellBuf);

    const pad = Math.round(item.targetSize * 0.1);
    const inner = item.targetSize - pad * 2;

    const finalBuf = await sharp(transparentBuf)
      .trim()
      .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(item.targetSize, item.targetSize)
      .png()
      .toBuffer();

    extracted[item.id] = finalBuf;

    // Save individual icon file
    const iconDest = path.join(iconsDir, `${item.id}.png`);
    fs.writeFileSync(iconDest, finalBuf);
    console.log(`  ✓ Saved: ${item.id}.png (${item.targetSize}x${item.targetSize})`);
  }

  // 2. Process FX Sparkles (Row 0: 6 frames)
  const fxSparkleW = fxMeta.width / 6; // 229.33
  const fxSparkleH = fxMeta.height / 2; // 384

  for (let i = 0; i < 6; i++) {
    const id = `fx_sparkle_0${i + 1}`;
    const left = Math.round(i * fxSparkleW);
    const top = 0;
    const width = Math.round((i + 1) * fxSparkleW) - left;
    const height = Math.round(fxSparkleH);

    const cellBuf = await sharp(fxSrc).extract({ left, top, width, height }).toBuffer();
    const transparentBuf = await removeBlackBackground(cellBuf);

    const finalBuf = await sharp(transparentBuf)
      .trim()
      .resize(54, 54, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 5, bottom: 5, left: 5, right: 5, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(64, 64)
      .png()
      .toBuffer();

    extracted[id] = finalBuf;
    console.log(`  ✓ Saved FX Frame: ${id} (64x64)`);
  }

  // 3. Process FX Confetti (Row 1: 8 frames)
  const fxConfettiW = fxMeta.width / 8; // 172
  const fxConfettiH = fxMeta.height / 2; // 384

  for (let i = 0; i < 8; i++) {
    const id = `fx_confetti_0${i + 1}`;
    const left = Math.round(i * fxConfettiW);
    const top = Math.round(fxMeta.height / 2);
    const width = Math.round((i + 1) * fxConfettiW) - left;
    const height = Math.round(fxConfettiH);

    const cellBuf = await sharp(fxSrc).extract({ left, top, width, height }).toBuffer();
    const transparentBuf = await removeBlackBackground(cellBuf);

    const finalBuf = await sharp(transparentBuf)
      .trim()
      .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(128, 128)
      .png()
      .toBuffer();

    extracted[id] = finalBuf;
    console.log(`  ✓ Saved FX Frame: ${id} (128x128)`);
  }

  // 4. Assemble Unified 512x512 Sprite Atlas (sheet_ui_fx.png)
  console.log('\n🎨 Assembling unified sheet_ui_fx.png (512x512)...');

  const atlas = {
    frames: {
      // Icons (48x48)
      icon_sound_on: { x: 0, y: 0, w: 48, h: 48 },
      icon_sound_off: { x: 48, y: 0, w: 48, h: 48 },
      icon_pause: { x: 96, y: 0, w: 48, h: 48 },
      icon_play: { x: 144, y: 0, w: 48, h: 48 },
      icon_reset: { x: 192, y: 0, w: 48, h: 48 },
      icon_hint: { x: 240, y: 0, w: 48, h: 48 },
      icon_number_toggle: { x: 288, y: 0, w: 48, h: 48 },
      icon_theme_selector: { x: 336, y: 0, w: 48, h: 48 },

      // Badges (64x64 / 80x80)
      stars_0: { x: 0, y: 48, w: 64, h: 64 },
      stars_1: { x: 64, y: 48, w: 64, h: 64 },
      stars_2: { x: 128, y: 48, w: 64, h: 64 },
      stars_3: { x: 192, y: 48, w: 64, h: 64 },
      ui_empty_slot_glow: { x: 256, y: 48, w: 64, h: 64 },
      badge_trophy: { x: 320, y: 48, w: 80, h: 80 },

      // FX Sparkle (64x64)
      fx_sparkle_01: { x: 0, y: 130, w: 64, h: 64 },
      fx_sparkle_02: { x: 64, y: 130, w: 64, h: 64 },
      fx_sparkle_03: { x: 128, y: 130, w: 64, h: 64 },
      fx_sparkle_04: { x: 192, y: 130, w: 64, h: 64 },
      fx_sparkle_05: { x: 256, y: 130, w: 64, h: 64 },
      fx_sparkle_06: { x: 320, y: 130, w: 64, h: 64 },

      // FX Confetti (128x128)
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

  const composites = [];
  for (const [id, frame] of Object.entries(atlas.frames)) {
    if (extracted[id]) {
      composites.push({ input: extracted[id], left: frame.x, top: frame.y });
    }
  }

  const sheetPath = path.join(spritesDir, 'sheet_ui_fx.png');
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(sheetPath);

  console.log(`✅ [sheet_ui_fx.png] Generated (${(fs.statSync(sheetPath).size / 1024).toFixed(1)} KB)`);

  // Write JSON
  fs.writeFileSync(path.join(spritesDir, 'sheet_ui_fx.json'), JSON.stringify(atlas, null, 2), 'utf-8');
  console.log(`✅ [sheet_ui_fx.json] Updated`);

  // 5. Also create transparent high-res standalone sheets
  // Transparent UI sheet (1376x768)
  const fullTransparentUI = await removeWhiteBackground(fs.readFileSync(uiSrc));
  fs.writeFileSync(path.join(spritesDir, 'ui_icons_spritesheet.png'), fullTransparentUI);
  fs.writeFileSync(path.join(spritesDir, 'ui_icons_spritesheet1.png'), fullTransparentUI);

  // Transparent FX sheet (1376x768)
  const fullTransparentFX = await removeBlackBackground(fs.readFileSync(fxSrc));
  fs.writeFileSync(path.join(spritesDir, 'fx_animations_spritesheet.png'), fullTransparentFX);

  console.log(`✅ [ui_icons_spritesheet.png] (Transparent 1376x768) updated`);
  console.log(`✅ [fx_animations_spritesheet.png] (Transparent 1376x768) updated`);

  console.log('\n🎉 New spritesheets integrated and deployed to assets successfully!');
}

processNewSpritesheets().catch((err) => {
  console.error('❌ Error processing new spritesheets:', err);
  process.exit(1);
});
