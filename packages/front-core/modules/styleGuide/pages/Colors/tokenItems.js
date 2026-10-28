import { CUSTOM_TOKEN_KEYS } from './constants';

// Custom tokens: the bespoke top-level theme keys from CUSTOM_TOKEN_KEYS (leftSidebarBg,
// buttonBg, ...) — these live outside theme.palette entirely by definition, so every row is
// 'other' status *unless* its current value happens to coincide with a real palette color,
// which is worth surfacing as the same "duplicate literal" risk as everywhere else in this
// file: two values that agree today only by accident, with nothing keeping them in sync.
export const getCustomColorRows = (previewTheme) => {
  const paletteRefs = [
    ['palette.primary.main', previewTheme.palette.primary?.main],
    ['palette.secondary.main', previewTheme.palette.secondary?.main],
    ['palette.error.main', previewTheme.palette.error?.main],
    ['palette.background.default', previewTheme.palette.background?.default],
    ['palette.background.paper', previewTheme.palette.background?.paper],
    ['palette.text.primary', previewTheme.palette.text?.primary],
    ['palette.text.secondary', previewTheme.palette.text?.secondary]
  ];
  return CUSTOM_TOKEN_KEYS.map((entry) => {
    const nested = typeof entry === 'object';
    const key = nested ? entry.key : entry;
    const value = nested ? previewTheme[key]?.[entry.path] : previewTheme[key];
    if (typeof value !== 'string') {
      return null;
    }
    const match = paletteRefs.find(([, paletteValue]) => paletteValue === value);
    return {
      path: `theme.${key}${nested ? `.${entry.path}` : ''}`,
      value,
      status: match ? 'overridden' : 'other',
      note: match
        ? `Coincides with ${match[0]}'s current value (${value}) — an independent literal, not an actual reference; would silently diverge if either changes alone.`
        : 'A bespoke top-level token, outside theme.palette entirely — not derived from any palette value.'
    };
  }).filter(Boolean);
};
