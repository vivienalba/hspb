// Original captions, shuffled without consecutive repeats.
export const QUOTES = Object.freeze([
  'A little moment, kept forever.',
  'For the memories.',
  'Just us, being us.',
  'A very good day.',
  'Wish you were here.'
]);

export const STRIP = Object.freeze({ width: 600, height: 1800, x: 42, y: 180, photoWidth: 516, photoHeight: 387, gap: 22, count: 3 });

export const FONTS = Object.freeze({
  editorial: '"Booth Editorial", Georgia, serif',
  ui: 'Jost, Arial, sans-serif',
  script: '"Pink Room Script", cursive'
});

export function drawKeepsakeHeader(ctx, width) {
  ctx.textAlign = 'center';
  ctx.fillStyle = '#59142c';
  ctx.font = `400 84px ${FONTS.script}`;
  ctx.fillText('The Pink Room', width / 2, 100);
  ctx.font = `500 17px ${FONTS.ui}`;
  ctx.fillText('A LITTLE CAMERA CLUB', width / 2, 141);
}

export function createQuotePicker(random = Math.random) {
  let bag = [];
  let last;
  return () => {
    if (!bag.length) {
      bag = [...QUOTES];
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      if (bag[bag.length - 1] === last) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
    }
    last = bag.pop();
    return last;
  };
}

export function coverCrop(sourceWidth, sourceHeight, targetWidth, targetHeight) {
  if (Math.min(sourceWidth, sourceHeight, targetWidth, targetHeight) <= 0) throw new Error('The camera is not ready yet.');
  const scale = Math.max(targetWidth / sourceWidth, targetHeight / sourceHeight);
  const width = targetWidth / scale;
  const height = targetHeight / scale;
  return { x: (sourceWidth - width) / 2, y: (sourceHeight - height) / 2, width, height };
}

function centeredText(ctx, text, y, font, color) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  ctx.fillText(text, STRIP.width / 2, y);
}

export function wrapText(ctx, text, maxWidth) {
  const lines = [];
  let line = '';
  for (const word of text.split(' ')) {
    const test = line ? `${line} ${word}` : word;
    if (line && ctx.measureText(test).width > maxWidth) { lines.push(line); line = word; }
    else line = test;
  }
  if (line) lines.push(line);
  return lines;
}

export function drawStrip(canvas, photos = [], quote = '', date = null) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Your browser could not create the photo strip.');
  ctx.clearRect(0, 0, STRIP.width, STRIP.height);
  ctx.fillStyle = '#faf7ee';
  ctx.fillRect(0, 0, STRIP.width, STRIP.height);
  ctx.strokeStyle = '#e6a0b9';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(19, 19, 562, 1762);
  drawKeepsakeHeader(ctx, STRIP.width);

  for (let index = 0; index < STRIP.count; index++) {
    const y = STRIP.y + index * (STRIP.photoHeight + STRIP.gap);
    ctx.fillStyle = '#fff7fa';
    ctx.fillRect(STRIP.x - 5, y - 5, STRIP.photoWidth + 10, STRIP.photoHeight + 10);
    if (photos[index]) {
      ctx.drawImage(photos[index], STRIP.x, y, STRIP.photoWidth, STRIP.photoHeight);
    } else {
      ctx.fillStyle = '#efd3dd';
      ctx.fillRect(STRIP.x, y, STRIP.photoWidth, STRIP.photoHeight);
      centeredText(ctx, 'a little memory', y + 202, `400 66px ${FONTS.script}`, '#88536b');
      centeredText(ctx, 'YOUR MOMENT HERE', y + 244, `500 17px ${FONTS.ui}`, '#88536b');
    }
  }

  ctx.strokeStyle = '#e6a0b9';
  ctx.beginPath();
  ctx.moveTo(242, 1446); ctx.lineTo(358, 1446); ctx.stroke();
  const text = quote ? `“${quote}”` : 'For your\nmemory book.';
  ctx.font = `italic 600 46px ${FONTS.editorial}`;
  let lines = quote ? wrapText(ctx, text, 464) : text.split('\n');
  let fontSize = 46;
  while (lines.length > 3 && fontSize > 26) {
    fontSize -= 2;
    ctx.font = `italic 600 ${fontSize}px ${FONTS.editorial}`;
    lines = wrapText(ctx, text, 464);
  }
  const lineHeight = fontSize * 1.22;
  const firstBaseline = 1557 - (lines.length - 1) * lineHeight / 2;
  lines.forEach((line, index) => centeredText(ctx, line, firstBaseline + index * lineHeight, `italic 600 ${fontSize}px ${FONTS.editorial}`, '#2c1020'));
  if (date) {
    const label = new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(date).toUpperCase();
    centeredText(ctx, label, 1698, `500 18px ${FONTS.ui}`, '#67213e');
  }
}
