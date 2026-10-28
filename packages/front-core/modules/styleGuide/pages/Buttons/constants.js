export const BUTTON_METRICS = {
  text: {
    small: { padding: '4px 5px' },
    medium: { padding: '6px 8px' },
    large: { padding: '8px 11px' }
  },
  outlined: {
    small: { padding: '3px 9px' },
    medium: { padding: '5px 15px' },
    large: { padding: '7px 21px' }
  },
  contained: {
    small: { padding: '4px 10px' },
    medium: { padding: '6px 16px' },
    large: { padding: '8px 22px' }
  }
};

// Icon size/spacing per size, read straight from MUI's Button.js: commonIconStyles()
// (fontSize 18/20/22 for small/medium/large), ButtonStartIcon's own styled() rule
// (marginRight: 8, marginLeft: -4, or -2 for small), and ButtonEndIcon's mirrored rule
// (marginLeft: 8, marginRight: -4, or -2 for small). All literal px, unrelated to the
// button's own fontSize or to theme.spacing().
export const BUTTON_ICON_METRICS = {
  small: { fontSize: 18, marginLeft: -2, endMarginRight: -2 },
  medium: { fontSize: 20, marginLeft: -4, endMarginRight: -4 },
  large: { fontSize: 22, marginLeft: -4, endMarginRight: -4 }
};

// Interaction states shown as tabs above each interactive component's token table, so a
// note only ever has to describe ONE state at a time (e.g. plain "(background)") instead of
// packing resting/hover/focus/pressed/disabled facts into one row's text.
export const BUTTON_STATES = [
  { key: 'resting', label: 'Resting' },
  { key: 'hover', label: 'Hover' },
  { key: 'focus', label: 'Focus' },
  { key: 'pressed', label: 'Pressed' },
  { key: 'disabled', label: 'Disabled' }
];

// Real per-size fontSize/padding, read straight from MUI's IconButton.js: the base `root`
// style sets fontSize: pxToRem(24), padding: 8 (what "medium" — the implicit default —
// actually uses, with no size-specific override of its own); `sizeSmall`/`sizeLarge` then
// override both. All three are literal px, unrelated to theme.spacing() or any typography
// variant.
export const ICON_BUTTON_SIZE_METRICS = {
  small: { padding: 5, fontSize: 18 },
  medium: { padding: 8, fontSize: 24 },
  large: { padding: 12, fontSize: 28 }
};

// Confirmed by grepping every real <IconButton> across admin-front, cabinet-front, and
// front-core (excluding this guide's own demo): 281 instances total, 0 pass a color prop,
// 51 pass size="large", 2 pass size="small", 0 explicitly pass size="medium" (228 just omit
// size, which resolves to medium), 7 are disabled, 0 pass an edge prop.
export const ICON_BUTTON_USAGE_NOTES = {
  small: 'Rare in practice — only 2 of 281 real instances explicitly pass size="small".',
  medium: 'The implicit default — 228 of 281 real instances omit size entirely, which resolves to medium (0 pass size="medium" explicitly).',
  large: '51 of 281 real instances explicitly pass size="large" — the only size this app deliberately opts into.'
};
