import { GridSize } from '../types/puzzle';
import { translations } from '../i18n/translations';
import { getCurrentLanguage } from '../i18n/useTranslation';
import { formatMessage } from '../i18n/format';

export interface ShareCardContext {
  gridSize: GridSize;
  moveCount: number;
  elapsedTime: number;
  stars: number;
  themeName: string;
  themeImageSrc: string;
}

export async function generateShareCardBlob(ctx: ShareCardContext): Promise<Blob | null> {
  const t = translations[getCurrentLanguage()] || translations.ko;
  const canvas = document.createElement('canvas');
  const size = 1000;
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext('2d');
  if (!c) return null;

  // 1. Off-white Background
  c.fillStyle = '#EFEFEA';
  c.fillRect(0, 0, size, size);

  // Outer Border
  c.strokeStyle = '#22221D';
  c.lineWidth = 4;
  c.strokeRect(24, 24, size - 48, size - 48);

  // 2. Header Brand
  c.fillStyle = '#171713';
  c.font = 'bold 44px sans-serif';
  c.textAlign = 'center';
  c.fillText('SLIDING BLOCK PUZZLE', size / 2, 90);

  c.fillStyle = '#4E4E47';
  c.font = '500 24px sans-serif';
  c.fillText(t.shareCardSubtitle, size / 2, 130);

  // 3. Theme Thumbnail Preview in Center
  const thumbSize = 380;
  const thumbX = (size - thumbSize) / 2;
  const thumbY = 170;

  c.save();
  c.beginPath();
  c.roundRect(thumbX, thumbY, thumbSize, thumbSize, 8);
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
    c.fillStyle = '#E4E4DC';
    c.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  }
  c.restore();

  // Border around thumbnail
  c.strokeStyle = '#D2D2C9';
  c.lineWidth = 2;
  c.strokeRect(thumbX, thumbY, thumbSize, thumbSize);

  // 4. Stars Rating
  const starSymbols = '★'.repeat(ctx.stars) + '☆'.repeat(3 - ctx.stars);
  c.fillStyle = '#BB3E0B';
  c.font = 'bold 64px sans-serif';
  c.textAlign = 'center';
  c.fillText(starSymbols, size / 2, 620);

  // 5. Stats Cards Box (Moves & Time)
  const cardW = 340;
  const cardH = 120;
  const cardY = 660;

  // Moves Card
  const mCardX = size / 2 - cardW - 20;
  c.fillStyle = '#F7F7F3';
  c.beginPath();
  c.roundRect(mCardX, cardY, cardW, cardH, 8);
  c.fill();
  c.strokeStyle = '#D2D2C9';
  c.lineWidth = 2;
  c.stroke();

  c.fillStyle = '#4E4E47';
  c.font = 'bold 22px sans-serif';
  c.textAlign = 'center';
  c.fillText(t.totalMoves.toUpperCase(), mCardX + cardW / 2, cardY + 42);

  c.fillStyle = '#22221D';
  c.font = 'bold 44px sans-serif';
  c.fillText(
    formatMessage(t.moveCountValue, { count: ctx.moveCount }),
    mCardX + cardW / 2,
    cardY + 92
  );

  // Time Card
  const tCardX = size / 2 + 20;
  c.fillStyle = '#F7F7F3';
  c.beginPath();
  c.roundRect(tCardX, cardY, cardW, cardH, 8);
  c.fill();
  c.strokeStyle = '#D2D2C9';
  c.lineWidth = 2;
  c.stroke();

  const mins = Math.floor(ctx.elapsedTime / 60);
  const secs = ctx.elapsedTime % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  c.fillStyle = '#4E4E47';
  c.font = 'bold 22px sans-serif';
  c.fillText(t.timeElapsed.toUpperCase(), tCardX + cardW / 2, cardY + 42);

  c.fillStyle = '#22221D';
  c.font = 'bold 44px sans-serif';
  c.fillText(timeStr, tCardX + cardW / 2, cardY + 92);

  // 6. Footer Info
  c.fillStyle = '#62625A';
  c.font = '500 22px sans-serif';
  c.textAlign = 'center';
  c.fillText(
    formatMessage(t.shareCardFooter, { size: ctx.gridSize, theme: ctx.themeName }),
    size / 2,
    840
  );

  c.fillStyle = '#BB3E0B';
  c.font = 'bold 24px sans-serif';
  c.fillText(t.shareCardPlayNow, size / 2, 890);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

export async function shareOrDownloadResult(
  ctx: ShareCardContext,
  onNotify: (msg: string) => void
): Promise<void> {
  const t = translations[getCurrentLanguage()] || translations.ko;
  const blob = await generateShareCardBlob(ctx);
  if (!blob) return;

  const file = new File([blob], `sliding-puzzle-${ctx.gridSize}x${ctx.gridSize}-victory.png`, {
    type: 'image/png',
  });

  // Try Web Share API with files first
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: t.shareTitle,
        text: formatMessage(t.shareText, { size: ctx.gridSize, moves: ctx.moveCount }),
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
      onNotify(t.shareCopied);
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
  onNotify(t.shareDownloaded);
}
