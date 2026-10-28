export const PALETTE_GROUPS = [
  ['primary', 'light', 'main', 'dark'],
  ['secondary', 'light', 'main', 'dark'],
  ['error', 'light', 'main', 'dark']
];

export const GREY_KEYS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

// The union of top-level custom color keys seen across every theme.js this guide can run
// under (front-core's own base — what cabinet-front uses as-is — and admin-front's fully
// independent theme.js, confirmed via each app's webpack `resolve.modules` order: admin's
// own App.jsx imports plain 'theme', never front-core's). The two files don't share one
// base — admin doesn't import/extend front-core/theme.js at all — so their custom-key sets
// only partially overlap. Rendered below filtered to whichever keys actually resolve to a
// string in the theme currently active, so each app's guide only ever shows its own real
// tokens instead of a shared list padded with "(not set)" rows for the other app's keys.
export const CUSTOM_TOKEN_KEYS = [
  // Shared by both front-core (→ cabinet) and admin-front
  'leftSidebarBg',
  'buttonBg',
  'buttonHoverBg',
  'textColorDark',
  'headerBg',
  'borderColor',
  'navLinkActive',
  'categoryWrapperActive',
  // front-core only (→ cabinet-front)
  'outlineColor',
  'dataTableHighlights',
  'categoryHeaderPrimary',
  // admin-front only
  'checkboxBg',
  'chipColor',
  'dataTableHoverColor',
  'dataTableHoverBg',
  'iconButtonFill',
  'searchInputBg',
  'listHover',
  // admin-front only, and nested — listBackground is an object, not a plain color string;
  // its `background` is the one sub-value worth showing, and it's a gradient, not a flat
  // color (see ColorTokenTable's gradient-stop preview).
  { key: 'listBackground', path: 'background' }
];
