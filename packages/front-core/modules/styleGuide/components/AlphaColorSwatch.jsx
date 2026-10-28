import React from 'react';
import { Popover } from '@mui/material';
// @uiw/react-color-chrome's alpha-aware, Chrome/Sketch-style picker (RGBA + HSLA input
// modes built in) — added specifically because the native <input type="color"> used
// everywhere else in this file (still fine for opaque colors) has no alpha channel at all
// per the HTML spec, and several real theme tokens (palette.text.secondary,
// palette.divider, etc.) are rgba() values.
import Chrome from '@uiw/react-color-chrome';
import { cssColorToRgba, rgbToHsva, CHECKERBOARD_BG } from '../shared/colorUtils';

// Alpha-aware color swatch: click to open a popover with @uiw/react-color-chrome's Chrome
// picker (Chrome/Sketch-style UI — saturation panel, hue/alpha sliders, and a built-in
// editable input that toggles between hex/RGBA/HSLA). Replaces the native
// <input type="color"> everywhere in edit mode — that input has no alpha channel at all per
// the HTML spec, and several real theme tokens (palette.text.secondary, palette.divider,
// ...) are rgba() values it couldn't represent. The swatch itself shows a checkerboard
// behind the color so partial transparency is actually visible, not just implied.
const AlphaColorSwatch = ({ color, onChange, size = 32 }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const hsva = React.useMemo(() => rgbToHsva(cssColorToRgba(color)), [color]);

  // Chrome's onChange gives back every representation already computed (hex, hexa, rgba
  // string, hsva, ...) — no need to build strings ourselves. Plain hex when fully opaque
  // (matching how this codebase already writes opaque colors, e.g. '#0c0c0c'), the ready
  // rgba() string only when alpha genuinely matters, so editing an opaque color's hue
  // doesn't rewrite it into a noisier, functionally-identical rgba(x, y, z, 1) form.
  const handlePickerChange = (nextColor) => onChange(nextColor.hsva.a >= 0.999 ? nextColor.hex : nextColor.rgba);

  return (
    <>
      <div
        onClick={(event) => setAnchorEl(event.currentTarget)}
        style={{
          width: size,
          height: size,
          borderRadius: size > 28 ? 6 : 4,
          border: '1px solid rgba(0,0,0,0.15)',
          cursor: 'pointer',
          flexShrink: 0,
          position: 'relative',
          overflow: 'hidden',
          ...CHECKERBOARD_BG
        }}
      >
        <div style={{ position: 'absolute', inset: 0, background: color || 'transparent' }} />
      </div>
      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
        <Chrome color={hsva} onChange={handlePickerChange} showEditableInput={true} />
      </Popover>
    </>
  );
};

export default AlphaColorSwatch;
