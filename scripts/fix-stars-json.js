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

// Helper: Remove white background and create smooth alpha
async function removeWhiteBackground(buffer, threshold = 240) {
  const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const w = info.width, h = info.height;
  const out = Buffer.from(data);

  for (let i = 0; i < out.length; i += 4) {
    const r = out[i], g = out[i + 1], b = out[i + 2];
    const brightness = (r * 0.299 + g * 0.587 + b * 0.114);

    if (r >= threshold && g >= threshold && b >= threshold) {
      out[i + 3] = 0;
    } else if (brightness > 220) {
      const factor = (255 - brightness) / (255 - 220);
      out[i + 3] = Math.round(out[i + 3] * Math.max(0, Math.min(1, factor)));
    }
  }

  return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
}

async function fixAndSyncSpritesheetJson() {
  console.log('🔧 Fixing exact pixel coordinates for ui_icons_spritesheet.json...\n');

  const uiSrc = path.join(userImgDir, 'ui_icons_spritesheet1.png');

  // Exact coordinates matching the visual elements in ui_icons_spritesheet1.png (1376 x 768)
  const exactFrames = {
    // Row 1: System Icons
    icon_sound_on: { x: 40, y: 45, w: 220, h: 185 },
    icon_sound_off: { x: 310, y: 40, w: 220, h: 195 },
    icon_pause: { x: 605, y: 40, w: 165, h: 195 },
    icon_play: { x: 865, y: 45, w: 180, h: 190 },
    icon_reset: { x: 1115, y: 35, w: 215, h: 205 },

    // Row 2: Utility & Badges
    icon_hint: { x: 35, y: 285, w: 235, h: 210 },
    icon_number_toggle: { x: 315, y: 290, w: 210, h: 210 },
    icon_theme_selector: { x: 575, y: 290, w: 220, h: 210 },
    ui_empty_slot_glow: { x: 835, y: 280, w: 240, h: 235 },
    badge_trophy: { x: 1100, y: 280, w: 245, h: 215 },

    // Row 3: 4 Star Rating Badges (FULL 3-STAR BOUNDING BOXES)
    stars_0: { x: 18, y: 560, w: 270, h: 165 },
    stars_1: { x: 355, y: 560, w: 300, h: 165 },
    stars_2: { x: 715, y: 560, w: 290, h: 165 },
    stars_3: { x: 1085, y: 550, w: 275, h: 175 }
  };

  // 1. Write ui_icons_spritesheet.json with complete exact coordinates
  const uiJson = {
    image: 'ui_icons_spritesheet.png',
    size: { w: 1376, h: 768 },
    format: 'RGBA8888',
    description: 'Exact pixel bounding boxes for all 14 UI elements in the 1376x768 spritesheet',
    frames: exactFrames
  };

  const uiJsonPath = path.join(spritesDir, 'ui_icons_spritesheet.json');
  fs.writeFileSync(uiJsonPath, JSON.stringify(uiJson, null, 2), 'utf-8');
  console.log(`✅ [ui_icons_spritesheet.json] Updated with exact pixel bounds!`);

  // 2. Re-extract each individual icon cleanly with full bounds and transparency
  console.log('\n📦 Re-extracting individual icons into public/assets/icons/ ...');
  for (const [id, box] of Object.entries(exactFrames)) {
    const rawCrop = await sharp(uiSrc)
      .extract({ left: box.x, top: box.y, width: box.w, height: box.h })
      .toBuffer();

    const transparentCrop = await removeWhiteBackground(rawCrop);

    // Save individual icon
    const dest = path.join(iconsDir, `${id}.png`);
    await sharp(transparentCrop).trim().png().toFile(dest);
    const stat = fs.statSync(dest);
    const meta = await sharp(dest).metadata();
    console.log(`  ✓ ${id}.png -> ${meta.width}x${meta.height} px (${(stat.size / 1024).toFixed(1)} KB)`);
  }

  // 3. Update sheet_ui_fx.png composite with full unclipped stars
  console.log('\n🎨 Updating sheet_ui_fx.png composite...');
  const composites = [];

  // Pack icons (48x48)
  const iconList = ['icon_sound_on', 'icon_sound_off', 'icon_pause', 'icon_play', 'icon_reset', 'icon_hint', 'icon_number_toggle', 'icon_theme_selector'];
  for (let i = 0; i < iconList.length; i++) {
    const id = iconList[i];
    const iconBuf = await sharp(path.join(iconsDir, `${id}.png`))
      .resize(44, 44, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(48, 48)
      .png()
      .toBuffer();
    composites.push({ input: iconBuf, left: i * 48, top: 0 });
  }

  // Pack trophy (80x80) & glow (64x64)
  const trophyBuf = await sharp(path.join(iconsDir, 'badge_trophy.png'))
    .resize(76, 76, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(80, 80)
    .png()
    .toBuffer();
  composites.push({ input: trophyBuf, left: 320, top: 48 });

  const glowBuf = await sharp(path.join(iconsDir, 'ui_empty_slot_glow.png'))
    .resize(60, 60, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .resize(64, 64)
    .png()
    .toBuffer();
  composites.push({ input: glowBuf, left: 256, top: 48 });

  // Pack Star Ratings (stars_0..3) with full horizontal aspect ratio (e.g. 64x36 or 64x64 contained)
  for (let i = 0; i <= 3; i++) {
    const id = `stars_${i}`;
    const starBuf = await sharp(path.join(iconsDir, `${id}.png`))
      .resize(60, 60, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .extend({ top: 2, bottom: 2, left: 2, right: 2, background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .resize(64, 64)
      .png()
      .toBuffer();
    composites.push({ input: starBuf, left: i * 64, top: 48 });
  }

  // Load sparkle and confetti from existing fx_animations_spritesheet
  const fxSrc = path.join(userImgDir, 'fx_animations_spritesheet.png');
  const fxMeta = await sharp(fxSrc).metadata();
  const fxSparkleW = fxMeta.width / 6;
  const fxSparkleH = fxMeta.height / 2;

  // Helper for black background
  async function removeBlackBackground(buffer, threshold = 18) {
    const { data, info } = await sharp(buffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const w = info.width, h = info.height;
    const out = Buffer.from(data);
    for (let i = 0; i < out.length; i += 4) {
      const maxVal = Math.max(out[i], out[i + 1], out[i + 2]);
      if (maxVal <= threshold) {
        out[i + 3] = 0;
      } else if (maxVal < 80) {
        const factor = (maxVal - threshold) / (80 - threshold);
        out[i + 3] = Math.round(out[i + 3] * Math.max(0, Math.min(1, factor)));
      }
    }
    return sharp(out, { raw: { width: w, height: h, channels: 4 } }).png().toBuffer();
  }

  for (let i = 0; i < 6; i++) {
    const left = Math.round(i * fxSparkleW);
    const cellBuf = await sharp(fxSrc).extract({ left, top: 0, width: Math.round((i + 1) * fxSparkleW) - left, height: Math.round(fxSparkleH) }).toBuffer();
    const transparentBuf = await removeBlackBackground(cellBuf);
    const sparkleBuf = await sharp(transparentBuf).trim().resize(54, 54, { fit: 'contain' }).extend({ top: 5, bottom: 5, left: 5, right: 5, background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize(64, 64).png().toBuffer();
    composites.push({ input: sparkleBuf, left: i * 64, top: 130 });
  }

  const fxConfettiW = fxMeta.width / 8;
  for (let i = 0; i < 8; i++) {
    const left = Math.round(i * fxConfettiW);
    const cellBuf = await sharp(fxSrc).extract({ left, top: Math.round(fxSparkleH), width: Math.round((i + 1) * fxConfettiW) - left, height: Math.round(fxSparkleH) }).toBuffer();
    const transparentBuf = await removeBlackBackground(cellBuf);
    const confettiBuf = await sharp(transparentBuf).trim().resize(112, 112, { fit: 'contain' }).extend({ top: 8, bottom: 8, left: 8, right: 8, background: { r: 0, g: 0, b: 0, alpha: 0 } }).resize(128, 128).png().toBuffer();
    const row = i < 4 ? 0 : 1;
    const col = i % 4;
    composites.push({ input: confettiBuf, left: col * 128, top: 200 + row * 128 });
  }

  const sheetPath = path.join(spritesDir, 'sheet_ui_fx.png');
  await sharp({
    create: { width: 512, height: 512, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
  })
    .composite(composites)
    .png({ compressionLevel: 9 })
    .toFile(sheetPath);

  console.log(`✅ [sheet_ui_fx.png] Re-composited without clipping (${(fs.statSync(sheetPath).size / 1024).toFixed(1)} KB)`);

  console.log('\n🎉 Star clipping issue resolved perfectly!');
}

fixAndSyncSpritesheetJson().catch((err) => {
  console.error('❌ Error fixing spritesheet json:', err);
  process.exit(1);
});
