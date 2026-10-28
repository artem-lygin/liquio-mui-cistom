import { fontSizeToPx } from '../../shared/utils';
import { TYPOGRAPHY_PROPERTY_KEYS, TYPOGRAPHY_VARIANT_INFO } from './constants';

// Every typography variant's own token table — one row per defined property, read straight
// from theme.typography.<variant>.<key>. Unlike the component pages, there's no known
// per-variant component-level override anywhere in this app's theme.js, so these are all
// plain "theme" reads rather than "overridden"/"other".
export const getTypographyTokenItems = (variant, previewTheme, rootFontSize) => {
  const definition = previewTheme.typography?.[variant];
  if (!definition) {
    return [
      {
        category: 'Typography',
        tokens: [
          {
            path: `theme.typography.${variant}`,
            status: 'other',
            note: 'not defined in theme.typography — inherits default text styling'
          }
        ]
      }
    ];
  }
  const tokens = TYPOGRAPHY_PROPERTY_KEYS.filter((key) => definition[key] !== undefined).map((key) => {
    const value = definition[key];
    // fontSize is near-always authored as rem — pair it with its actual computed pixel
    // value (calculated from the live root font-size, not a hardcoded assumption) so the
    // px equivalent updates correctly if the root font-size is ever edited or changed.
    const note = key === 'fontSize' ? `${value} (${fontSizeToPx(value, rootFontSize).toFixed(2)}px)` : String(value);
    return { path: `theme.typography.${variant}.${key}`, note };
  });
  return [{ category: 'Typography', tokens }];
};

export const describeTypographyVariant = (variant) => {
  const info = TYPOGRAPHY_VARIANT_INFO[variant];
  if (!info) {
    return null;
  }
  const originText = info.native
    ? "MUI's own built-in variant."
    : "A custom variant this app adds on top of MUI's built-in set — it isn't part of MUI's own variant list.";
  const usageText =
    info.count > 0
      ? `Used ${info.count} time${info.count === 1 ? '' : 's'} in the app — e.g. ${info.files.join(', ')}${
          info.files.length < info.count ? ', and more' : ''
        }.`
      : `Confirmed zero usage anywhere in admin-front, cabinet-front, or front-core${info.note ? ` — ${info.note}` : ' — currently unused in this app'}.`;
  return `${originText} ${usageText}`;
};
