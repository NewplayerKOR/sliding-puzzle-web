import { GridSize } from '../types/puzzle';

export interface ShareCardContext {
  gridSize: GridSize;
  moveCount: number;
  elapsedTime: number;
  stars: number;
  themeName: string;
  themeImageSrc: string;
}

export async function generateShareCardBlob(ctx: ShareCardContext): Promise<Blob | null> {
  const canvas = document.createElement('canvas');
  const size = 1000;
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext('2d');
  if (!c) return null;

  // 1. Background Gradient
  const bgGrad = c.createLinearGradient(0, 0, size, size);
  bgGrad.addColorStop(0, '#0f172a');
  bgGrad.addColorStop(0.5, '#1e293b');
  bgGrad.addColorStop(1, '#090d16');
  c.fillStyle = bgGrad;
  c.fillRect(0, 0, size, size);

  // Outer Border
  c.strokeStyle = '#3b82f6';
  c.lineWidth = 8;
  c.strokeRect(20, 20, size - 40, size - 40);

  // 2. Header Brand
  c.fillStyle = '#ffffff';
  c.font = 'bold 44px sans-serif';
  c.textAlign = 'center';
  c.fillText('🧩 SLIDING BLOCK PUZZLE', size / 2, 90);

  c.fillStyle = '#94a3b8';
  c.font = '500 24px sans-serif';
  c.fillText('PERFECT CLEAR RECORD', size / 2, 130);

  // 3. Theme Thumbnail Preview in Center
  const thumbSize = 380;
  const thumbX = (size - thumbSize) / 2;
  const thumbY = 170;

  c.save();
  c.beginPath();
  c.roundRect(thumbX, thumbY, thumbSize, thumbSize, 24);
  c.clip();

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = ctx.themeImageSrc;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    c.drawImage(img, thumbX, thumbY, thumbSize, thumbSize);
  } catch {
    c.fillStyle = '#334155';
    c.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  }
  c.restore();

  // Border around thumbnail
  c.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  c.lineWidth = 4;
  c.strokeRect(thumbX, thumbY, thumbSize, thumbSize);

  // 4. Stars Rating in Gold
  const starSymbols = '★'.repeat(ctx.stars) + '☆'.repeat(3 - ctx.stars);
  c.fillStyle = '#fbbf24';
  c.font = 'bold 64px sans-serif';
  c.textAlign = 'center';
  c.fillText(starSymbols, size / 2, 620);

  // 5. Stats Cards Box (Moves & Time)
  const cardW = 340;
  const cardH = 120;
  const cardY = 660;

  // Moves Card
  const mCardX = size / 2 - cardW - 20;
  c.fillStyle = '#1e293b';
  c.beginPath();
  c.roundRect(mCardX, cardY, cardW, cardH, 16);
  c.fill();
  c.strokeStyle = '#334155';
  c.lineWidth = 2;
  c.stroke();

  c.fillStyle = '#94a3b8';
  c.font = 'bold 22px sans-serif';
  c.textAlign = 'center';
  c.fillText('TOTAL MOVES', mCardX + cardW / 2, cardY + 42);

  c.fillStyle = '#38bdf8';
  c.font = 'bold 44px sans-serif';
  c.fillText(`${ctx.moveCount}회`, mCardX + cardW / 2, cardY + 92);

  // Time Card
  const tCardX = size / 2 + 20;
  c.fillStyle = '#1e293b';
  c.beginPath();
  c.roundRect(tCardX, cardY, cardW, cardH, 16);
  c.fill();
  c.strokeStyle = '#334155';
  c.lineWidth = 2;
  c.stroke();

  const mins = Math.floor(ctx.elapsedTime / 60);
  const secs = ctx.elapsedTime % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  c.fillStyle = '#94a3b8';
  c.font = 'bold 22px sans-serif';
  c.fillText('TIME ELAPSED', tCardX + cardW / 2, cardY + 42);

  c.fillStyle = '#4ade80';
  c.font = 'bold 44px sans-serif';
  c.fillText(timeStr, tCardX + cardW / 2, cardY + 92);

  // 6. Footer Info
  c.fillStyle = '#64748b';
  c.font = '500 22px sans-serif';
  c.textAlign = 'center';
  c.fillText(`Difficulty: ${ctx.gridSize}×${ctx.gridSize} | Theme: ${ctx.themeName}`, size / 2, 840);

  c.fillStyle = '#3b82f6';
  c.font = 'bold 24px sans-serif';
  c.fillText('Play now: Web Sliding Puzzle', size / 2, 890);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function shareOrDownloadResult(
  ctx: ShareCardContext,
  onNotify: (msg: string) => void
): Promise<void> {
  const blob = await generateShareCardBlob(ctx);
  if (!blob) return;

  const file = new File([blob], `sliding-puzzle-${ctx.gridSize}x${ctx.gridSize}-victory.png`, {
    type: 'image/png',
  });

  // Try Web Share API with files first
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Sliding Block Puzzle 승리!',
        text: `${ctx.gridSize}×${ctx.gridSize} 퍼즐을 ${ctx.moveCount}수만에 클리어했습니다! 🧩`,
        files: [file],
      });
      return;
    } catch {
      // user cancelled or share failed, fallback below
    }
  }

  // Fallback 1: Clipboard image copy (if supported)
  if (navigator.clipboard && (window as any).ClipboardItem) {
    try {
      await navigator.clipboard.write([
        new (window as any).ClipboardItem({
          'image/png': blob,
        }),
      ]);
      onNotify('결과 카드가 클립보드에 복사되었습니다!');
      return;
    } catch {
      // fallback to download
    }
  }

  // Fallback 2: Direct PNG Download
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `sliding-puzzle-victory.png`;
  a.click();
  URL.revokeObjectURL(url);
  onNotify('결과 카드가 이미지 파일로 다운로드되었습니다!');
}
