import { getResolvedMuiStyleOverride } from '../../shared/themeIntrospection';
import { fontSizeToPx } from '../../shared/utils';
import { BUTTON_METRICS, BUTTON_ICON_METRICS } from './constants';

// Reads the fontSize a given size actually renders with, live from the theme: an explicit
// MuiButton.size{Small,Large} override if the app defines one (both app themes now derive
// this from theme.typography.button.fontSize via a function-valued style override — see
// CHANGES.md), otherwise typography.button.fontSize itself (what medium always uses, having
// no size-specific override). getMuiStyleOverride can return either a plain object or that
// function, hence resolveMuiStyleOverride before reading .fontSize off it.
export const getButtonSizeFontSize = (size, previewTheme) => {
  const override = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', `size${size[0].toUpperCase()}${size.slice(1)}`);
  return override?.fontSize !== undefined ? override.fontSize : previewTheme.typography.button.fontSize;
};

export const getButtonFontSizePx = (size, previewTheme, rootFontSize) => fontSizeToPx(getButtonSizeFontSize(size, previewTheme), rootFontSize);

// MuiButton.size{Small,Medium,Large} now carries an explicit minHeight (see theme.js) so a
// plain-label button doesn't render shorter than an icon+label button of the same size —
// read it live the same way the fontSize override is read, rather than assuming it exists.
export const getButtonMinHeightPx = (size, previewTheme) => {
  const override = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', `size${size[0].toUpperCase()}${size.slice(1)}`);
  return override?.minHeight;
};

// MUI doesn't publish a button height anywhere — content-driven height is vertical padding
// (×2) + the taller of the label's line-height or the icon's fontSize (an icon is often
// taller than the text line-height it sits next to — e.g. medium's 20px icon vs. a 16.8px
// text line — so it, not the label, ends up setting the button's height) + a 1px top/bottom
// border for outlined only (its padding is 1px shorter per side than contained/text
// specifically to cancel that border out). Verified against the real DOM
// (getBoundingClientRect) for every variant/size/icon combo. The real rendered height is
// then whichever is larger of that and the theme's own minHeight (CSS min-height
// semantics) — with minHeight set (see theme.js), this is what actually keeps height
// constant across icon/no-icon for the same size.
export const getButtonHeightPx = (variant, size, previewTheme, rootFontSize, showIcon) => {
  const metrics = BUTTON_METRICS[variant][size];
  const paddingVertical = parseFloat(metrics.padding);
  const fontSizePx = getButtonFontSizePx(size, previewTheme, rootFontSize);
  const lineHeightPx = fontSizePx * previewTheme.typography.button.lineHeight;
  const contentHeightPx = showIcon ? Math.max(lineHeightPx, BUTTON_ICON_METRICS[size].fontSize) : lineHeightPx;
  const borderPx = variant === 'outlined' ? 2 : 0;
  const contentDrivenHeightPx = paddingVertical * 2 + contentHeightPx + borderPx;
  const minHeightPx = getButtonMinHeightPx(size, previewTheme);
  return minHeightPx !== undefined ? Math.max(contentDrivenHeightPx, minHeightPx) : contentDrivenHeightPx;
};

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);
