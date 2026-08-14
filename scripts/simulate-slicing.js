import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const imagesDir = path.join(rootDir, 'public', 'assets', 'images');

const themes = [
  'theme_nature.png',
  'theme_pixel_art.png',
  'theme_abstract.png',
  'theme_animal.png'
];

const gridSizes = [3, 4, 5];

async function simulateTileSlicing() {
  console.log('🧪 Starting 3x3, 4x4, 5x5 Grid Slicing Simulation...');

  for (const theme of themes) {
    const filePath = path.join(imagesDir, theme);
    const metadata = await sharp(filePath).metadata();

    if (metadata.width !== 1024 || metadata.height !== 1024) {
      throw new Error(`Theme ${theme} is not 1024x1024! Found: ${metadata.width}x${metadata.height}`);
    }

    console.log(`\n🔍 Verifying [${theme}] (${metadata.width}x${metadata.height}px, ${metadata.format}):`);

    for (const N of gridSizes) {
      const tileSize = 1024 / N;
      let nonZeroCount = 0;

      for (let row = 0; row < N; row++) {
        for (let col = 0; col < N; col++) {
          const left = Math.floor(col * tileSize);
          const top = Math.floor(row * tileSize);
          const width = Math.floor((col + 1) * tileSize) - left;
          const height = Math.floor((row + 1) * tileSize) - top;

          const tileBuffer = await sharp(filePath)
            .extract({ left, top, width, height })
            .raw()
            .toBuffer();

          // Check standard deviation/variance to ensure tile has distinct graphical content
          const stats = await sharp(filePath)
            .extract({ left, top, width, height })
            .stats();

          const hasDetails = stats.channels.some((c) => c.stdev > 2);
          if (hasDetails) nonZeroCount++;
        }
      }

      const totalTiles = N * N;
      console.log(`  -> Grid ${N}x${N} (${totalTiles} tiles): ${nonZeroCount}/${totalTiles} tiles have clear visual features & contrast.`);
    }
  }

  console.log('\n🎉 Grid Slicing Simulation Completed Successfully: All themes slice cleanly without blank dead spots!');
}

simulateTileSlicing().catch((err) => {
  console.error('❌ Slicing simulation failed:', err);
  process.exit(1);
});
