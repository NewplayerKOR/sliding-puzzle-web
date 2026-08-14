import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const userImgDir = path.join(rootDir, 'docs', 'DESIGN', 'img');
const imagesDir = path.join(rootDir, 'public', 'assets', 'images');
const spritesDir = path.join(rootDir, 'public', 'assets', 'sprites');
const iconsDir = path.join(rootDir, 'public', 'assets', 'icons');
const tempDir = path.join(rootDir, 'public', 'assets', 'temp_inspect');

[imagesDir, spritesDir, iconsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

// Helper: Make background transparent for light images
async function processLightBgImage(buffer, info, threshold = 238) {
  const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const out = Buffer.alloc(w * h * 4);

  for (let i = 0; i < w * h; i++) {
    const srcIdx = i * info.channels;
    const dstIdx = i * 4;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
    let alpha = 255;
    if (brightness > threshold) {
      const diff = brightness - threshold;
      alpha = Math.max(0, Math.min(255, Math.round(255 - (diff / (255 - threshold)) * 255)));
    }

    out[dstIdx] = r;
    out[dstIdx + 1] = g;
    out[dstIdx + 2] = b;
    out[dstIdx + 3] = alpha;
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

// Helper: Make background transparent for dark images (key out black)
async function processDarkBgImage(buffer, info, threshold = 20) {
  const { data } = await sharp(buffer).raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const out = Buffer.alloc(w * h * 4);

  for (let i = 0; i < w * h; i++) {
    const srcIdx = i * info.channels;
    const dstIdx = i * 4;
    const r = data[srcIdx];
    const g = data[srcIdx + 1];
    const b = data[srcIdx + 2];

    const maxCol = Math.max(r, g, b);
    let alpha = 255;
    if (maxCol < threshold * 2) {
      alpha = Math.max(0, Math.min(255, Math.round((maxCol / (threshold * 2)) * 255)));
    }

    out[dstIdx] = r;
    out[dstIdx + 1] = g;
    out[dstIdx + 2] = b;
    out[dstIdx + 3] = alpha;
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function integrateAssets() {
  console.log('🔄 Integrating User Assets from docs/DESIGN/img/ into project...\n');

  // 1. Process and Replace Theme Images (Sheet A)
  const themeFiles = [
    { src: 'theme_nature.png', dest: 'theme_nature.png', name: 'Theme 1 (Nature)' },
    { src: 'theme_pixel_art.png', dest: 'theme_pixel_art.png', name: 'Theme 2 (Pixel Art)' },
    { src: 'theme_abstract.png', dest: 'theme_abstract.png', name: 'Theme 3 (Abstract)' },
    { src: 'theme_animal.png', dest: 'theme_animal.png', name: 'Theme 4 (Animal)' }
  ];

  for (const t of themeFiles) {
    const srcPath = path.join(userImgDir, t.src);
    const destPath = path.join(imagesDir, t.dest);
    if (fs.existsSync(srcPath)) {
      await sharp(srcPath)
        .resize(1024, 1024, { fit: 'cover' })
        .png({ compressionLevel: 8 })
        .toFile(destPath);
      const stat = fs.statSync(destPath);
      console.log(`✅ [${t.name}] Replaced -> ${t.dest} (${(stat.size / 1024).toFixed(1)} KB)`);
    } else {
      console.warn(`⚠️ Source file not found: ${srcPath}`);
    }
  }

  // 2. Process UI Icons from ui_icons_spritesheet.png (1408 x 768)
  const uiSrcPath = path.join(userImgDir, 'ui_icons_spritesheet.png');
  const fxSrcPath = path.join(userImgDir, 'fx_animations_spritesheet.png');

  console.log('\n✂️ Extracting icons & FX sequences from new spritesheets...');

  // Define icon regions in ui_icons_spritesheet (1408x768)
  // Grid 3 rows x 5 columns: colWidth ~281.6, rowHeight ~256
  const iconDefinitions = [
    // Row 0
    { id: 'icon_sound_on', col: 0, row: 0, targetSize: 48, category: 'icon' },
    { id: 'icon_sound_off', col: 1, row: 0, targetSize: 48, category: 'icon' },
    { id: 'icon_pause', col: 2, row: 0, targetSize: 48, category: 'icon' },
    { id: 'icon_play', col: 3, row: 0, targetSize: 48, category: 'icon' },
    { id: 'icon_reset', col: 4, row: 0, targetSize: 48, category: 'icon' },

    // Row 1
    { id: 'icon_hint', col: 0, row: 1, targetSize: 48, category: 'icon' },
    { id: 'icon_number_toggle', col: 1, row: 1, targetSize: 48, category: 'icon' },
    { id: 'icon_theme_selector', col: 2, row: 1, targetSize: 48, category: 'icon' },
    { id: 'ui_empty_slot_glow', col: 3, row: 1, targetSize: 64, category: 'slot' },
    { id: 'badge_trophy', col: 4, row: 1, targetSize: 80, category: 'badge' },

    // Row 2
    { id: 'stars_0', col: 0, row: 2, targetSize: 64, category: 'star' },
    { id: 'stars_1', col: 1, row: 2, targetSize: 64, category: 'star' },
    { id: 'stars_2', col: 2, row: 2, targetSize: 64, category: 'star' },
    { id: 'stars_3', col: 3, row: 2, targetSize: 64, category: 'star' }
  ];

  const extractedElements = {};

  const uiMeta = await sharp(uiSrcPath).metadata();
  const colW = uiMeta.width / 5;
  const rowH = uiMeta.height / 3;

  for (const def of iconDefinitions) {
    const left = Math.floor(def.col * colW + 15);
    const top = Math.floor(def.row * rowH + 15);
    const width = Math.floor(colW - 30);
    const height = Math.floor(rowH - 30);

    const cellBuf = await sharp(uiSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    const cellInfo = { width, height, channels: uiMeta.channels };
    const transparentBuf = await processLightBgImage(cellBuf, cellInfo, 235);

    const trimmed = await sharp(transparentBuf)
      .trim()
      .resize(def.targetSize, def.targetSize, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    extractedElements[def.id] = trimmed;

    // Also write individual icon PNG & SVG fallback
    if (def.category === 'icon') {
      const pngOut = path.join(iconsDir, `${def.id}.png`);
      fs.writeFileSync(pngOut, trimmed);
    }
  }

  // 3. Extract Sparkle & Confetti from fx_animations_spritesheet.png (1408 x 768)
  // Sparkle: Row 0 (6 frames) -> Width / 6
  // Confetti: Row 1 (8 frames) -> Width / 8
  const fxMeta = await sharp(fxSrcPath).metadata();
  const sparkleW = fxMeta.width / 6;
  const sparkleH = fxMeta.height / 2;

  for (let i = 0; i < 6; i++) {
    const id = `fx_sparkle_0${i + 1}`;
    const left = Math.floor(i * sparkleW + 10);
    const top = Math.floor(10);
    const width = Math.floor(sparkleW - 20);
    const height = Math.floor(sparkleH - 20);

    const cellBuf = await sharp(fxSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    const cellInfo = { width, height, channels: fxMeta.channels };
    const transparentBuf = await processDarkBgImage(cellBuf, cellInfo, 25);

    const resized = await sharp(transparentBuf)
      .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    extractedElements[id] = resized;
  }

  const confettiW = fxMeta.width / 8;
  const confettiH = fxMeta.height / 2;
  for (let i = 0; i < 8; i++) {
    const id = `fx_confetti_0${i + 1}`;
    const left = Math.floor(i * confettiW + 10);
    const top = Math.floor(fxMeta.height / 2 + 10);
    const width = Math.floor(confettiW - 20);
    const height = Math.floor(confettiH - 20);

    const cellBuf = await sharp(fxSrcPath)
      .extract({ left, top, width, height })
      .toBuffer();

    const cellInfo = { width, height, channels: fxMeta.channels };
    const transparentBuf = await processDarkBgImage(cellBuf, cellInfo, 25);

    const resized = await sharp(transparentBuf)
      .resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();

    extractedElements[id] = resized;
  }

  // 4. Compose all elements into Sheet B (sheet_ui_fx.png - 512x512)
  console.log('\n🎨 Assembling composite 512x512 spritesheet (sheet_ui_fx.png)...');

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
  console.log(`✅ [Sheet B: sheet_ui_fx.png] Saved -> ${(spriteStat.size / 1024).toFixed(1)} KB`);

  // Write JSON
  const jsonPath = path.join(spritesDir, 'sheet_ui_fx.json');
  fs.writeFileSync(jsonPath, JSON.stringify(atlasCoordinates, null, 2), 'utf-8');
  console.log(`✅ [Atlas JSON] Saved -> ${jsonPath}`);

  // Clean up temp directory
  if (fs.existsSync(tempDir)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  console.log('\n🎉 User asset replacement and integration completed successfully!');
}

integrateAssets().catch((err) => {
  console.error('❌ Error integrating assets:', err);
  process.exit(1);
});
