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

const uiSrcPath = path.join(userImgDir, 'ui_icons_spritesheet1.png');
const fxSrcPath = path.join(userImgDir, 'fx_animations_spritesheet.png');

async function processTransparentSpritesheets() {
  console.log('🚀 Processing transparent spritesheets from docs/DESIGN/img/ ...\n');

  const uiMeta = await sharp(uiSrcPath).metadata();
  const fxMeta = await sharp(fxSrcPath).metadata();

  console.log(`UI Source: ${uiSrcPath} (${uiMeta.width}x${uiMeta.height}, alpha: ${uiMeta.hasAlpha})`);
  console.log(`FX Source: ${fxSrcPath} (${fxMeta.width}x${fxMeta.height}, alpha: ${fxMeta.hasAlpha})`);

  const extractedElements = {};

  // 1. Extract UI Icons & Badges from ui_icons_spritesheet1.png (1408x768 -> 5 cols x 3 rows)
  const colW = uiMeta.width / 5; // 281.6
  const rowH = uiMeta.height / 3; // 256

  const uiDefinitions = [
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

  for (const def of uiDefinitions) {
    const left = Math.round(def.col * colW);
    const top = Math.round(def.row * rowH);
    const width = Math.round((def.col + 1) * colW) - left;
    const height = Math.round((def.row + 1) * rowH) - top;

    // Direct crop from transparent image
    const cropped = await sharp(uiSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    // Auto-trim transparent borders and scale to target size with padding
    const padding = Math.round(def.targetSize * 0.12);
    const innerSize = def.targetSize - padding * 2;

    const trimmed = await sharp(cropped)
      .trim()
      .resize(innerSize, innerSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
      .resize(def.targetSize, def.targetSize)
      .png()
      .toBuffer();

    extractedElements[def.id] = trimmed;

    // Save individual icon to public/assets/icons/
    if (def.isIcon) {
      const iconPath = path.join(iconsDir, `${def.id}.png`);
      fs.writeFileSync(iconPath, trimmed);
      console.log(`  ✓ Exported individual icon: ${def.id}.png (${def.targetSize}x${def.targetSize})`);
    }
  }

  // 2. Extract FX Sparkles from fx_animations_spritesheet.png (Row 0: 6 frames)
  const sparkleW = fxMeta.width / 6; // 234.67
  const sparkleH = fxMeta.height / 2; // 384

  for (let i = 0; i < 6; i++) {
    const id = `fx_sparkle_0${i + 1}`;
    const left = Math.round(i * sparkleW);
    const top = 0;
    const width = Math.round((i + 1) * sparkleW) - left;
    const height = Math.round(sparkleH);

    const cropped = await sharp(fxSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    const resized = await sharp(cropped)
      .trim()
      .resize(54, 54, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 5, bottom: 5, left: 5, right: 5, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(64, 64)
      .png()
      .toBuffer();

    extractedElements[id] = resized;
    console.log(`  ✓ Extracted sparkle frame: ${id} (64x64)`);
  }

  // 3. Extract FX Confetti from fx_animations_spritesheet.png (Row 1: 8 frames)
  const confettiW = fxMeta.width / 8; // 176
  const confettiH = fxMeta.height / 2; // 384

  for (let i = 0; i < 8; i++) {
    const id = `fx_confetti_0${i + 1}`;
    const left = Math.round(i * confettiW);
    const top = Math.round(fxMeta.height / 2);
    const width = Math.round((i + 1) * confettiW) - left;
    const height = Math.round(confettiH);

    const cropped = await sharp(fxSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    const resized = await sharp(cropped)
      .trim()
      .resize(112, 112, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(128, 128)
      .png()
      .toBuffer();

    extractedElements[id] = resized;
    console.log(`  ✓ Extracted confetti frame: ${id} (128x128)`);
  }

  // 4. Assemble into 512x512 sheet_ui_fx.png
  console.log('\n🎨 Packing elements into sheet_ui_fx.png (512x512)...');

  const atlasCoordinates = {
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

      // Badges & Ratings (64x64 / 80x80)
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

  const compositeInputs = [];
  for (const [id, frame] of Object.entries(atlasCoordinates.frames)) {
    if (extractedElements[id]) {
      compositeInputs.push({
        input: extractedElements[id],
        left: frame.x,
        top: frame.y
      });
    }
  }

  const spritesheetPath = path.join(spritesDir, 'sheet_ui_fx.png');
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  })
    .composite(compositeInputs)
    .png({ compressionLevel: 9 })
    .toFile(spritesheetPath);

  const spriteStat = fs.statSync(spritesheetPath);
  console.log(`✅ [sheet_ui_fx.png] Successfully generated (${(spriteStat.size / 1024).toFixed(1)} KB)`);

  const jsonPath = path.join(spritesDir, 'sheet_ui_fx.json');
  fs.writeFileSync(jsonPath, JSON.stringify(atlasCoordinates, null, 2), 'utf-8');
  console.log(`✅ [sheet_ui_fx.json] Updated`);

  console.log('\n🎉 Transparent spritesheet replacement finished perfectly!');
}

processTransparentSpritesheets().catch((err) => {
  console.error('❌ Error processing spritesheets:', err);
  process.exit(1);
});
