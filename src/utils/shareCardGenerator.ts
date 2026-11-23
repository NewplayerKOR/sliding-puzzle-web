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

// 캔버스 공유 카드 팔레트: `src/styles/index.css` 디자인 토큰과 동기화함.
// canvas 2D는 CSS 변수를 참조할 수 없어 토큰 값을 상수로 복제함.
const SHARE_COLORS = {
  canvas: '#EFEFEA', // --color-canvas
  ink: '#171713', // --color-ink
  charcoal: '#22221D', // --color-charcoal
  graphite: '#4E4E47', // --color-graphite
  steel: '#62625A', // --color-steel
  concrete: '#D2D2C9', // --color-concrete
  concreteSoft: '#E4E4DC', // --color-concrete-soft
  paper: '#F7F7F3', // --color-paper
  signal: '#BB3E0B', // --color-signal-600
} as const;

export async function generateShareCardBlob(ctx: ShareCardContext): Promise<Blob | null> {
  const t = translations[getCurrentLanguage()] || translations.ko;
  const canvas = document.createElement('canvas');
  const size = 1000;
  canvas.width = size;
  canvas.height = size;
  const c = canvas.getContext('2d');
  if (!c) return null;

  // 1. Off-white Background
  c.fillStyle = SHARE_COLORS.canvas;
  c.fillRect(0, 0, size, size);

  // Outer Border
  c.strokeStyle = SHARE_COLORS.charcoal;
  c.lineWidth = 4;
  c.strokeRect(24, 24, size - 48, size - 48);

  // 2. Header Brand
  c.fillStyle = SHARE_COLORS.ink;
  c.font = 'bold 44px sans-serif';
  c.textAlign = 'center';
  c.fillText('SLIDING BLOCK PUZZLE', size / 2, 90);

  c.fillStyle = SHARE_COLORS.graphite;
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
    await new Promise<void>((resolve) => {
      let settled = false;
      let timer = 0;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (timer) window.clearTimeout(timer);
        resolve();
      };
      // 이미지 응답이 멈춰도 결과 카드 생성 전체가 대기하지 않도록 제한 시간을 둠
      img.onload = finish;
      img.onerror = finish;
      timer = window.setTimeout(finish, SHARE_IMAGE_TIMEOUT_MS);
      img.src = ctx.themeImageSrc;
    });
    if (img.naturalWidth === 0) {
      throw new Error('theme image is not ready');
    }
    c.drawImage(img, thumbX, thumbY, thumbSize, thumbSize);
  } catch {
    c.fillStyle = SHARE_COLORS.concreteSoft;
    c.fillRect(thumbX, thumbY, thumbSize, thumbSize);
  }
  c.restore();

  // Border around thumbnail
  c.strokeStyle = SHARE_COLORS.concrete;
  c.lineWidth = 2;
  c.strokeRect(thumbX, thumbY, thumbSize, thumbSize);

  // 4. Stars Rating
  const starSymbols = '★'.repeat(ctx.stars) + '☆'.repeat(3 - ctx.stars);
  c.fillStyle = SHARE_COLORS.signal;
  c.font = 'bold 64px sans-serif';
  c.textAlign = 'center';
  c.fillText(starSymbols, size / 2, 620);

  // 5. Stats Cards Box (Moves & Time)
  const cardW = 340;
  const cardH = 120;
  const cardY = 660;

  // Moves Card
  const mCardX = size / 2 - cardW - 20;
  c.fillStyle = SHARE_COLORS.paper;
  c.beginPath();
  c.roundRect(mCardX, cardY, cardW, cardH, 8);
  c.fill();
  c.strokeStyle = SHARE_COLORS.concrete;
  c.lineWidth = 2;
  c.stroke();

  c.fillStyle = SHARE_COLORS.graphite;
  c.font = 'bold 22px sans-serif';
  c.textAlign = 'center';
  c.fillText(t.totalMoves.toUpperCase(), mCardX + cardW / 2, cardY + 42);

  c.fillStyle = SHARE_COLORS.charcoal;
  c.font = 'bold 44px sans-serif';
  c.fillText(
    formatMessage(t.moveCountValue, { count: ctx.moveCount }),
    mCardX + cardW / 2,
    cardY + 92
  );

  // Time Card
  const tCardX = size / 2 + 20;
  c.fillStyle = SHARE_COLORS.paper;
  c.beginPath();
  c.roundRect(tCardX, cardY, cardW, cardH, 8);
  c.fill();
  c.strokeStyle = SHARE_COLORS.concrete;
  c.lineWidth = 2;
  c.stroke();

  const mins = Math.floor(ctx.elapsedTime / 60);
  const secs = ctx.elapsedTime % 60;
  const timeStr = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;

  c.fillStyle = SHARE_COLORS.graphite;
  c.font = 'bold 22px sans-serif';
  c.fillText(t.timeElapsed.toUpperCase(), tCardX + cardW / 2, cardY + 42);

  c.fillStyle = SHARE_COLORS.charcoal;
  c.font = 'bold 44px sans-serif';
  c.fillText(timeStr, tCardX + cardW / 2, cardY + 92);

  // 6. Footer Info
  c.fillStyle = SHARE_COLORS.steel;
  c.font = '500 22px sans-serif';
  c.textAlign = 'center';
  c.fillText(
    formatMessage(t.shareCardFooter, { size: ctx.gridSize, theme: ctx.themeName }),
    size / 2,
    840
  );

  c.fillStyle = SHARE_COLORS.signal;
  c.font = 'bold 24px sans-serif';
  c.fillText(t.shareCardPlayNow, size / 2, 890);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png');
  });
}

const SHARE_IMAGE_TIMEOUT_MS = 3000;
const DOWNLOAD_URL_LIFETIME_MS = 1000;

function isAbortError(error: unknown): boolean {
  return (
    (error instanceof DOMException && error.name === 'AbortError') ||
    (typeof error === 'object' &&
      error !== null &&
      'name' in error &&
      (error as { name?: string }).name === 'AbortError')
  );
}

export async function shareOrDownloadResult(
  ctx: ShareCardContext,
  onNotify: (msg: string) => void
): Promise<void> {
  const t = translations[getCurrentLanguage()] || translations.ko;
  const blob = await generateShareCardBlob(ctx);
  if (!blob) {
    onNotify(t.shareFailed);
    return;
  }

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
    } catch (error) {
      // 사용자가 공유 시트를 닫은 경우에는 의도한 취소이므로 폴백하지 않음
      if (isAbortError(error)) return;
      // 실제 공유 실패만 클립보드·다운로드 폴백으로 이어감
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
  a.rel = 'noopener';
  // 일부 브라우저는 문서에 연결되지 않은 앵커의 다운로드를 무시함
  document.body.appendChild(a);
  a.click();
  a.remove();
  // Safari/Firefox가 다운로드를 시작하기 전에 URL이 해제되지 않도록 지연함
  window.setTimeout(() => URL.revokeObjectURL(url), DOWNLOAD_URL_LIFETIME_MS);
  onNotify(t.shareDownloaded);
}
