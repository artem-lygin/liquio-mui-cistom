# Theme Changes

Log of changes made to `admin-front`'s theme (`components/admin-front/src/application/theme.js`)
and directly-related files, kept for handoff to the frontend team alongside access to this fork.
Grouped by area rather than by date, since entries here tend to get revised as things evolve —
each entry ends with the date it was last touched. This file intentionally does **not** cover the
internal design-review tooling used to find/preview these changes (a `/style-guide` page in the
running app) — only the resulting theme changes themselves.

All changes below are scoped to **`admin-front` only** unless noted otherwise. `cabinet-front`
uses `packages/front-core/theme.js`, which has only one change so far (see Typography below).

## Colors & surfaces

- **`palette.background.paper`**: was `'#fff'` and never actually used — every `<Paper>`
  got its background from a hardcoded `overrides.MuiPaper.root.backgroundColor: '#404040'`
  instead. Moved the value onto the proper palette token, then changed it to **`#0c0c0c`**
  per design direction. Also removed a redundant `color: '#fff'` from `MuiPaper.root` (it
  exactly duplicated `palette.text.primary`, which Paper already uses by default).
  _(2026-08-22 → 2026-08-23)_
- **`palette.background.default`** changed from `'#404040'` to **`#0c0c0c`**, unifying it
  with `background.paper`. MUI's dark-mode convention keeps these two identical by design
  (both `#121212` by default) and produces the "lighter as you go up" effect purely via the
  elevation overlay (a `linear-gradient` on top of the flat color), not via a separate,
  lighter page background. Our previous `#404040` page / `#0c0c0c` paper split inverted
  that convention — surfaces read *darker* than the page instead of lighter. Verified via
  the Style Guide's Surfaces section (elevated `Card` now visibly lightens against the flat
  base, as intended) and spot-checked the Users list and Registers list pages for contrast
  regressions — none found. Also updated the matching static-CSS sync
  (`components/admin-front/public/css/style.css`, `body, #root` background) to `#0c0c0c` to
  match. _(2026-08-23)_
- **`palette.text.secondary`**: was `rgba(0, 0, 0, 0.54)` — a light-theme value, essentially
  invisible on dark surfaces (confirmed via the Card component in the design-review tool).
  Fixed to `rgba(255, 255, 255, 0.7)`, matching MUI's own dark-mode default for this token.
  _(2026-08-22)_
- **Removed a dead `overrides.MuiDrawer.paper.backgroundColor: '#232f3d'`.** Traced it in
  `packages/front-core/layouts/LeftSidebar.jsx`: the app's real navigation `Drawer` already
  overrides its own paper color locally (`classes={{ paper: classes.drawerPaper }}` →
  `theme.leftSidebarBg`), which always wins over this global rule — so it never actually
  rendered anywhere. `Drawer` now correctly falls through to `palette.background.paper` like
  every other surface, instead of carrying a one-off override. _(2026-08-23)_
- **Removed `overrides.MuiAlert.standardInfo`/`standardWarning`, which made those two Alert
  severities barely legible.** They hardcoded light-theme pastel backgrounds
  (`#c6e0f5`/`#fceda1`) without touching the message text color, which stayed MUI's
  dark-mode default (a light tint meant to sit on a dark background) — text and background
  ended up almost the same luminance (confirmed via computed styles before the fix: info
  background `rgb(198,224,245)` vs. text `rgb(184,231,251)`). `standardError`/
  `standardSuccess` had no such override and already rendered correctly, so the fix simply
  removes the override block — all four severities now fall through to MUI's own
  dark-mode-aware `standard`-variant color math, the same one error/success were already
  using. Verified via the Style Guide's new Alert section: all four now render as dark,
  legible surfaces with strong text contrast. Real usage confirmed for error (`CabinetMenuDialog`,
  `CabinetMenuTranslationsDialog`, `VideoPlayer`, `Map`) and warning/info
  (cabinet-front's `ImportantMessages` banner); no confirmed `severity="success"` usage
  anywhere. _(2026-08-23)_

## Typography

- **Fixed inconsistent hardcoded colors across typography variants.** Every variant had its
  own `color`, split arbitrarily between near-black (`rgba(0,0,0,0.87)`/`0.54`) and white
  (`#fff`) with no consistent logic (e.g. `h1`–`h3` were black while `h4`–`h6` were white).
  Set an explicit `color: '#fff'` on every variant that was missing it or had the wrong
  one: `display1`–`display4`, `headline`, `title`, `subheading`, `caption`, `button`,
  `h1`–`h3`, `body1Next`, `body2Next`, `buttonNext`, `captionNext`, `overline` — matching
  the variants that already worked (`h4`–`h6`, `subtitle1`/`2`, `body1`/`2`). Note: this
  app doesn't mount `CssBaseline` (see below), so an *unset* color does **not** inherit
  `palette.text.primary` — it falls back to the browser's plain black default. That's why
  simply deleting the wrong colors (tried first) didn't work; each variant needs the
  correct color set explicitly. _(2026-08-22)_
- **Replaced Roboto with Inter.** All 26 `fontFamily` entries in `theme.typography` now
  read `"Inter", "Helvetica", "Arial", sans-serif`. Added
  `components/admin-front/src/application/assets/css/fonts.css` (an admin-only override of
  the shared `packages/front-core/assets/css/fonts.css`) loading Inter via Google Fonts
  (`@import`, variable font, weights 100–900), replacing core's self-hosted Roboto
  `@font-face` rules for this app. _(2026-08-22)_
- **New heading scale for `h1`–`h6`**: `3rem / 2.375rem / 2.125rem / 1.5rem / 1.25rem /
  1.125rem` (previously `6rem / 3.75rem / 3rem / 30px / 26px / 1.25rem` — `h4`/`h5` were
  also stored as unitless px numbers rather than `rem`, now consistent).
  `body1`/`body2`/`subtitle1`/`subtitle2`/`overline`/`caption` already matched the target
  scale, so left untouched. _(2026-08-22)_

- **Unified Button font-size across all three sizes (`small`/`medium`/`large`).** MUI's own
  `Button.js` hardcodes a different `pxToRem()` fontSize per size by default (13px/15px for
  small/large), which silently overrode `theme.typography.button.fontSize` — `medium` was
  the only size that ever actually rendered with this app's "Buttons" typography (`0.875rem`
  / `14px`); small and large rendered one step smaller/larger than every other button on the
  page, and had done so unnoticed since neither size carried an explicit override to catch
  it. First pass added `overrides.MuiButton.sizeSmall`/`sizeLarge` with a hardcoded
  `fontSize: '0.875rem'` — visually correct but a **second literal duplicating**
  `typography.button.fontSize`, not a reference to it (the exact anti-pattern this project
  is trying to avoid — see `CLAUDE.md`). Revised to a function-valued style override that
  reads the token live instead: `sizeSmall: ({ theme }) => ({ fontSize:
  theme.typography.button.small?.fontSize ?? theme.typography.button.fontSize })` (and the
  mirror for `sizeLarge`/`.large`). Confirmed `adaptV4Theme()` forwards function values
  through the legacy `overrides.MuiButton` shape unchanged (it's a plain object copy into
  `components.MuiButton.styleOverrides`), so this works through the bridge with no other
  changes. The `.small`/`.large` lookups made it trivial to give a size its own genuinely
  distinct value once that was actually wanted (see below) — no change needed in `MuiButton`
  itself. Verified via the Style Guide's Buttons section: the properties table correctly
  shows which token each size resolved from. _(2026-08-25 → 2026-08-26)_
- **`small` now has its own distinct value: `theme.typography.button.fontSize` is `1rem`**
  (what `medium`/`large` render at — `large` has no `.large` override of its own, so it
  falls back to this shared base), **`theme.typography.button.small.fontSize` is
  `0.875rem`.** Previously `0.875rem` was the shared value for everything; product-designer
  direction changed it to `1rem` as the base with `small` deliberately a step down, using
  the `.small`/`.large` room-to-grow mechanism from the fix above. _(2026-08-26)_
- **Root font-size (`typography.htmlFontSize`) is now `14` and actually takes effect.**
  Previously "worth addressing" (below): the theme option only fed MUI's internal px→rem
  math, with no `html { font-size }` rule anywhere to make the DOM match — so `1rem` in code
  didn't actually render as the declared size. Fixed the same way as the background-color
  static-CSS sync: added `html { font-size: 14px }` to
  `components/admin-front/public/css/style.css`, kept in sync with `theme.js` by hand (a
  plain CSS file can't read the JS theme) with a comment explaining why. **How this was
  found**: the Style Guide's "Edit mode" → "Bake into theme.overrides.json" flow had, in an
  earlier session, baked `typography.htmlFontSize: 14` *and* `typography.button.fontSize:
  '1rem'` into that file on one machine — undocumented, uncommitted, invisible from `theme.js`
  alone, and silently making the live app render differently than the checked-in source
  implied. Traced the discrepancy, confirmed the bake endpoint itself is correct (a proper
  `merge(current, incoming)` write, not the bug), then promoted both baked values into
  `theme.js` as real, deliberate, documented decisions and removed them from
  `theme.overrides.json`. This file has no "remove one baked field" UI yet (only a full
  reset) — see "Worth addressing" for the other stray/undocumented values still sitting in
  it, not yet audited. _(2026-08-26)_

## Typography (cabinet-front / `packages/front-core/theme.js`)

- **Registered `variantMapping` for the custom typography variants.** `title`,
  `subheading`, `subheading2`, `label`, `label1`, `label2`, `breadcrumbs` are defined in
  `packages/front-core/theme.js` but were never registered via
  `components.MuiTypography.defaultProps.variantMapping` anywhere in the codebase. Per
  MUI's docs, an unmapped custom variant renders as an inline `<span>` by default — which
  broke layout for real usages, not just the design-review tool: `label`, `label1`, and
  `breadcrumbs` are used in `packages/front-core/components/JsonSchema/SchemaStepper.jsx`
  (the multi-step form wizard header, live in cabinet's task-filling flow). Mapped all
  seven variants to `div`. Verified in cabinet-front's `/style-guide` page: each variant's
  rendered element changed from `<span>` to `<div>`. **Scope note:** this file is shared
  but `admin-front` has its own separate, non-merging `theme.js` that doesn't define these
  variants at all (confirmed dormant/unused there), so this fix only affects
  `cabinet-front`. _(2026-08-23)_
- **Unified Button font-size across all three sizes**, same underlying MUI default-override
  issue as `admin-front` (see Typography above). Also caught a second, app-specific
  duplicate here: `MuiButton.root` hardcoded its own `fontSize: 14`, numerically equal to
  `typography.button.fontSize` (`0.875rem` = 14px) but not actually derived from it — Button
  already spreads `...theme.typography.button` onto root by default, so the literal was
  pure redundancy. Removed it, and added `sizeSmall`/`sizeLarge` as function-valued style
  overrides reading `theme.typography.button.fontSize` live (mirroring the admin-front fix
  — see Typography above for the exact shape and the `.small`/`.large` room-to-grow lookup).
  All three sizes now trace back to the one token with zero duplicated literals. Verified in
  cabinet-front's `/style-guide` page. _(2026-08-25 → 2026-08-26)_

## Infrastructure

- **`theme.js` now imports and deep-merges `theme.overrides.json`** over its base theme
  object at load time. This file is the target for future design tweaks made via the
  internal review tool (colors/typography) and is meant to be a real, committed file —
  safe to hand-edit directly, or reset to `{}` to clear all overrides. Currently empty.
  _(2026-08-22)_
- **Synced a static stylesheet that had drifted from the theme.**
  `components/admin-front/public/css/style.css` had its own hardcoded
  `body, #root { background: #4E4E4E }`, set independently of `theme.js` and out of sync
  with `palette.background.default`. Updated it to match, with a comment explaining it must
  be kept in sync by hand — a plain CSS file can't read the JS theme. (Value updated again
  to `#0c0c0c` when `background.default` changed — see Colors & surfaces above.)
  _(2026-08-22 → 2026-08-23)_

## Infrastructure (continued)

- **Added `<CssBaseline />`** to `components/admin-front/src/application/App.jsx` (inside
  `ThemeProvider`, before the rest of the app). This app previously never mounted it, which
  was the root cause behind most of the fixes above: without it, nothing wires
  `palette.background.default` / `palette.text.primary` onto `<body>` automatically, so
  individual components ended up with their own manual color overrides that then silently
  drifted from the palette (the typography colors, the Paper/Drawer backgrounds, and the
  static-CSS page background were all instances of this). `CssBaseline` is a global CSS
  reset (removes default margins, sets `box-sizing: border-box` everywhere), so this was
  tested beyond just the design-review tool before landing: confirmed `body`
  background/margin and `html` box-sizing now come from the theme automatically, and
  spot-checked the Units, Workflow, and Registry list pages plus a dialog (Registry's "New
  Register" modal) for layout regressions — all rendered correctly, nothing overlapping or
  misaligned. Not exhaustive (the BPMN workflow designer canvas and most other dialogs
  weren't checked) — worth a broader pass before shipping. _(2026-08-23)_

## Icons

- **Added `@material-symbols-svg/react` as a second icon source, alongside the existing
  `@mui/icons-material`.** Not a migration — no existing `<XIcon />` usage was touched;
  this makes Material Symbols *available* for new icon usage going forward. Installed in
  both `components/admin-front/package.json` and `components/cabinet-front/package.json`
  (plus a `"*"` peer declaration in `packages/front-core/package.json`, matching how
  `@mui/icons-material` is already declared there). Settled on **Rounded style, weight
  400, filled** (`DeleteFill` from `@material-symbols-svg/react/rounded/w400` in the PoC) —
  style/weight/fill are each a separate named export chosen at import time, not a runtime
  prop, so switching any of them means importing a different component.
- **Usage pattern**: the package renders a plain `<svg>`, so it wraps in MUI's own
  `SvgIcon` via the `component` prop — `<SvgIcon component={DeleteFill} inheritViewBox
  color="primary" fontSize="small" />` — picking up this app's existing `color`/`fontSize`
  theming conventions with no new theming layer. **`inheritViewBox` is required**:
  Material Symbols' SVGs use a `viewBox="0 -960 960 960"` coordinate space, not the
  classic 24×24 grid MUI's own `SvgIcon` defaults to — without it, the icon renders
  squished. Verified: both icon sets resolve to identical computed colors per `color`
  value (confirmed via `getComputedStyle` — `inherit`/`primary`/`error` all matched
  between `@mui/icons-material`'s `DeleteIcon` and the wrapped `DeleteFill`).
- **Where to see it**: the Style Guide's "Icon library" section (`packages/front-core/
  modules/styleGuide/pages/StyleGuide.jsx`, id `icon-library`) — a side-by-side
  comparison of both icon sources, not yet used in any production page. _(2026-08-25)_
- **Switched the Style Guide's own Buttons/Icon Buttons demos over to Material Symbols**,
  so every interactive-component demo in the guide is now consistent on one icon source.
  The Buttons demo already used it (`SymbolDelete`/`SymbolArrowForward` for
  `startIcon`/`endIcon`); Icon Buttons still rendered classic `@mui/icons-material`'s
  `DeleteIcon` — swapped for `<SvgIcon component={SymbolDelete} inheritViewBox
  fontSize="inherit" />`, the same wrapping pattern documented above. Purely a demo change
  (no production `<IconButton>` usage was touched). _(2026-08-25)_

## Worth addressing (known issues found, not yet fixed)

- **`theme.overrides.json` still has other un-audited baked values, not yet reconciled into
  `theme.js` or discarded.** The committed file (as of this writing) has `h5`/`h6`/
  `subtitle1`/`subtitle2` `fontWeight`, `h1.textTransform`, and `button.textTransform`/
  `fontWeight`/`letterSpacing`/`lineHeight` — none of it documented here despite having
  been live since the Style Guide's own first commit. Separately, the Windows-PC checkout's
  *local, uncommitted* copy of this file has even more: `caption.fontSize`/`lineHeight`,
  `overline.lineHeight`/`fontWeight`, and `palette.primary.light`/`dark` — none of that has
  reached this Mac checkout or git at all, since the file was never re-committed after
  c85a27f. Each one is either a real design decision that belongs in `theme.js` (and this
  log) or leftover experimentation that should just be deleted — needs going through
  key-by-key, the same way `htmlFontSize`/`button.fontSize` just were, above. _(2026-08-26)_
- **`palette.divider` (`rgba(0, 0, 0, 0.12)`) looks like the same class of leftover
  light-theme value** as the ones already fixed above — not yet checked against how
  dividers actually render on this dark theme. _(2026-08-23)_
- **`theme.js` still uses the legacy v4 theme shape** (`overrides`, `props` top-level
  keys), adapted at runtime via `adaptV4Theme()` in `App.jsx`, rather than v5's native
  `components.<Name>.styleOverrides`. Not urgent — `adaptV4Theme` still works — but it's a
  v4→v5 migration bridge, not the current recommended API, and is worth migrating off of
  eventually. _(2026-08-23)_
- **None of the `admin-front`-specific fixes above are wired up for `cabinet-front`.**
  It still uses `packages/front-core/theme.js` with no override infrastructure, no font
  change, no color/scale changes — the `variantMapping` fix above is the only change made
  to that shared file so far. _(2026-08-23)_
- **No `palette.warning`/`success`/`info` defined — real success/warning/error/info colors
  live in three separate, disagreeing, hardcoded places instead of the theme.** `theme.js`
  only defines `primary`/`secondary`/`error`/`grey`; nothing in the app actually uses
  `color="warning"`/`"success"` on a themed component (confirmed: zero matches). But the
  concepts are used constantly through two independent non-themed color maps that don't
  even agree with each other: `packages/front-core/components/Snackbars/Snackbar.jsx` (the
  real toast system, wired in via `addMessage`) uses `green[600]`/`amber[700]` (MUI stock
  swatches) for success/warning, while
  `packages/front-core/components/JsonSchema/components/FormControlMessage.jsx` (inline
  form-field messages) uses `#4caf50`/`#ff9800` (MUI's *different* default `success.main`/
  `warning.main` shades) for the same concepts. `error` in both happens to match this app's
  themed `palette.error.main` (`#f44336`) but only by coincidence — it's still a hardcoded
  literal in each file, not a `theme.palette.error.main` reference. Fixing this would mean
  defining `palette.warning`/`success`/`info` for real and pointing both message systems at
  them, so a future color change only has to happen in one place. _(2026-08-23)_
