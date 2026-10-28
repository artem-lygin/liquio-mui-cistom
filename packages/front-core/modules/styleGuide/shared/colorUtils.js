let colorParseCanvasCtx = null;

export const cssColorToRgba = (colorStr) => {
  if (!colorParseCanvasCtx) {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    colorParseCanvasCtx = canvas.getContext('2d', { willReadFrequently: true });
  }
  const ctx = colorParseCanvasCtx;
  ctx.fillStyle = '#000000'; // reset — an invalid assignment below is silently ignored by canvas, not thrown
  ctx.fillStyle = typeof colorStr === 'string' ? colorStr : '';
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
  return { r, g, b, a: Math.round((a / 255) * 1000) / 1000 };
};

// Standard RGB -> HSV conversion (h: 0-360, s/v: 0-100) — @uiw/react-color-chrome's `color`
// prop takes an HSVA object, not a hex/rgba string, so this bridges from cssColorToRgba's
// output. Plain math, no extra dependency for something this small.
export const rgbToHsva = ({ r, g, b, a }) => {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rNorm) h = ((gNorm - bNorm) / delta) % 6;
    else if (max === gNorm) h = (bNorm - rNorm) / delta + 2;
    else h = (rNorm - gNorm) / delta + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : (delta / max) * 100, v: max * 100, a };
};

export const CHECKERBOARD_BG = {
  backgroundImage:
    'linear-gradient(45deg, #808080 25%, transparent 25%), linear-gradient(-45deg, #808080 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #808080 75%), linear-gradient(-45deg, transparent 75%, #808080 75%)',
  backgroundSize: '8px 8px',
  backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px'
};

// Notes and values (TokenLegend, ColorTokenTable) are free-text that often contains a raw
// color literal (e.g. "overridden to #BB86FC in this app", or a whole gradient() value with
// several rgba() stops) — this finds every hex/rgb/rgba literal in a string and inlines a
// small color circle right before each one, so a color is never just a code you have to
// mentally render yourself.
const HEX_COLOR_PATTERN = /#(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})\b|rgba?\([^)]*\)/gi;

export const withColorSwatches = (text) => {
  if (typeof text !== 'string' || !text) {
    return text;
  }
  const parts = [];
  let lastIndex = 0;
  let match;
  HEX_COLOR_PATTERN.lastIndex = 0;
  while ((match = HEX_COLOR_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    parts.push(
      <span key={`${match.index}-${match[0]}`} style={{ whiteSpace: 'nowrap' }}>
        <span
          style={{
            display: 'inline-block',
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: match[0],
            border: '1px solid rgba(255, 255, 255, 0.4)',
            marginRight: 4,
            verticalAlign: 'middle'
          }}
        />
        {match[0]}
      </span>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
};
