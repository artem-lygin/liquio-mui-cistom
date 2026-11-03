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
- **`palette.action.active`**: same light-theme-default-left-untouched pattern as
  `text.secondary` above — was `rgba(0, 0, 0, 0.54)`, which is what a plain (`color="default"`)
  `IconButton`'s `color` resolves to. Surfaced by the Reddit-style input's new clear button
  (Style Guide): a classic `@mui/icons-material`-shaped icon in the same spot stayed visibly
  white because it inherits the unrelated `MuiSvgIcon.root.fill` override below instead, but
  this button uses a Material Symbols icon (`SymbolClose`), whose `<path>` hardcodes
  `fill="currentColor"` and so bypasses that override and falls through to the real
  (previously-broken) `action.active` — black-on-near-black, i.e. invisible. Fixed to `#fff`,
  matching MUI v5's actual dark-theme default (`createPalette.js`'s `dark.action.active:
  common.white`, not an alpha value like the light default). `hover`/`selected`/`disabled`/
  `disabledBackground` in the same block are still the unfixed light-theme defaults — see
  Worth addressing. _(2026-10-13)_
- **`palette.action.disabled`**: same pattern, fixed app-wide at the product designer's
  direction. Was the light-mode `rgba(0, 0, 0, 0.26)`, now MUI v5's dark default
  `rgba(255, 255, 255, 0.3)` (`createPalette.js` `dark.action.disabled`). MUI colors
  disabled IconButtons, Select arrows and Checkbox/Radio/Switch icons with this token, so
  all of them rendered black, i.e. invisible on `#0c0c0c`. It surfaced in the Style Guide's
  Text field gallery, where the Disabled state's arrows, password eye and calendar
  disappeared. This changes every disabled IconButton/Select/Checkbox/Radio/Switch in admin,
  from invisible to dimmed white. _(2026-11-03)_
- **`palette.divider`**: set to `rgba(255, 255, 255, 0.1)` (`#ffffff` at 10%) at the product
  designer's direction. Was the light-mode `rgba(0, 0, 0, 0.12)`, i.e. black and invisible
  on `#0c0c0c`. MUI reads it for `Divider`, list/menu item dividers, table cell borders,
  dialog dividers and similar hairlines, so those lines now show. It's a different token
  from `theme.borderColor` (`#4E4E4E`, the sidebar/header separators and the Text field's
  resting border), which is unchanged. _(2026-11-03)_
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
- **Button height is now fixed per size, independent of whether it shows an icon.**
  Previously height was purely content-driven: `padding×2 + max(label line-height, icon
  size)`. MUI's own icon glyph size (18/20/22px for small/medium/large — hardcoded in
  `Button.js`, not theme-derived) is taller than this app's Button label line-height, so a
  plain-label button rendered shorter than an icon+label button of the same size. Added an
  explicit `minHeight` to `MuiButton.sizeSmall`/`sizeMedium`/`sizeLarge` — `26`/`32`/`38`px
  — computed from MUI's own fixed padding + icon-size constants for the icon-present case
  (not an arbitrary number): every variant already converges on the same total height once
  an icon is shown, since `outlined`'s padding is 1px/side smaller than `text`/`contained`
  specifically to offset its 2px border (both MUI decisions), and this app mounts
  `CssBaseline` so `box-sizing: border-box` applies globally — e.g. small:
  `4px×2 + 18px icon = 26` (contained/text) = `3px×2 + 18 + 2px border = 26` (outlined). Set
  to the icon-present figure rather than the shorter label-only one, so plain-label buttons
  grow to match rather than icons ever needing to shrink. Style Guide's `getButtonHeightPx`
  updated to take `Math.max(contentDrivenHeight, minHeight)`, matching real CSS
  `min-height` semantics, and its properties table now shows the `minHeight` token.
  _(2026-08-26)_

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

## Buttons

- **Recreated `Button / Primary` (Contained, Outlined, Text) and `Icon Button / Primary` from
  the Figma design system** (`Liquio-AdminPanel-Design-System`, the "Buttons" page) in
  `theme.js`'s `MuiButton`/`MuiIconButton` overrides — previously these were well behind the
  design: `containedPrimary.backgroundColor`/`color` were hardcoded literals (`#BB86FC`,
  `#232f3d`) instead of theme tokens, had no hover or pressed state at all (hover kept the
  same background), no border, and no shadow; `outlinedPrimary`/`textPrimary` both hardcoded
  `color: '#fff'` instead of `primary.main`, with no hover/pressed background wash either.
  Now all three read live from `theme.palette.primary.*` and recreate Default/Hover/Pressed
  exactly: Contained gets a `primary.light` border + a `primary.main`-tinted glow at rest,
  turns `primary.light` on hover (bigger glow + a `primary.dark` bottom inner edge), and
  `primary.dark` on press (tight, uncolored shadow); Outlined/Text share one treatment —
  `primary.main` text at rest, a constant `alpha(primary.main, 0.3)` border (Outlined only),
  a `alpha(primary.main, 0.1)` background wash on hover and `alpha(primary.main, 0.3)` on
  press, with `primary.light` text in both. Icon Button's `colorPrimary` gets the same
  hover/press washes instead of a generic grey ripple. **Disabled is deliberately left as
  this app's own dimmed treatment** — Figma's own Disabled variant renders identically to
  Default (no dimming at all), which reads as an unfinished placeholder state there rather
  than a deliberate design choice; confirmed with the product designer before deciding not to
  copy it.
- **Fixed `palette.primary.light`/`dark`** (`#63ccff`/`#006db3`) — stale MUI-default blue
  values, leftover from before `main` was changed to purple and never updated, unrelated to
  `main` rather than a tonal ramp around it. Fixed to the Figma design system's own
  `primary/light`/`primary/dark` (`#cca5fd`/`#a365f0`), a proper purple ramp around the same
  `main`. Also fixed `palette.primary.contrastText` from `'#fff'` to the design system's
  `rgba(0, 0, 0, 0.8)` — white reads poorly against `#BB86FC`, a light pastel purple.
- **Added `theme.buttonCornerRadius`/`theme.buttonIconPadding`** (`{ small, medium, large }`
  maps), alongside this theme's existing custom top-level keys (`buttonHoverBg`, `borderColor`,
  ...) — `buttonCornerRadius` sets Button's per-size corner radius (`6`/`8`/`10`px, per the
  Figma design system) directly, and Button's own per-variant padding (below) is *derived*
  from it rather than reusing it as-is. Applied via new
  `contained/outlined/textSize{Small,Medium,Large}` override slots (MUI's own
  `${variant}Size${Size}` resolver pattern) instead of the shared `sizeSmall`/`sizeMedium`/
  `sizeLarge` slots, since padding differs per variant: **vertical** padding is
  `buttonCornerRadius` minus `1px` for Contained/Outlined specifically (both now have a 1px
  border — Text doesn't), so every variant's rendered height converges on the same number
  regardless of border; **horizontal** padding adds `8px` more than that on top (the same
  spacing Figma's own Label Wrapper uses around just the label text — MUI's Button has no
  such intermediate element to target, so it's folded into the button's own padding
  instead), so a plain-label button isn't cramped against its own edges even with no icon to
  provide that spacing. Recomputed `sizeSmall`/`sizeMedium`/`sizeLarge`'s `minHeight` to
  `32`/`36`/`42` (was `26`/`32`/`38`) — these three numbers are taken directly from the
  Figma design system's own per-size frame heights (confirmed identical across Contained/
  Outlined/Text and across Default/Hover/Pressed there), not derived from a padding+icon
  formula: that formula (real padding + MUI's own 18/20/22px icon glyph size + a 1px/side
  border on Contained/Outlined) naturally lands on 36/42 for medium/large, but comes up 2px
  short at small (30, not 32) — Figma's own mockup icons are a flat 20px at every size,
  unlike this app's real rendering, which is the likely source of that one gap — so
  `sizeSmall`'s `minHeight` does real work there instead of just being a floor that's
  already satisfied. Verified live via `/style-guide/buttons` that Contained/Outlined/Text
  now render at an identical height at every size (an earlier pass here had Contained 2px
  taller at every size, from missing its own border in that calculation — and a pass before
  that had all three sizes 2px short at Small specifically, since the above hadn't been
  checked against Figma's own stated frame heights yet, only internal consistency between
  variants; also added `color="primary"` to that page's own Icon Button demo, which had been
  demonstrating the *unstyled* default color instead of the new treatment above). Icon
  Button's own padding scale is close but not identical (`6`/`8`/`9`, not `6`/`8`/`10` —
  Large is 1px tighter there, and it has no border, so no compensation needed), hence the
  separate map. _(2026-11-03)_
- **Fixed the Contained/Outlined hover glow rendering *under* the border instead of on top
  of it, like Figma's own inner shadow does.** A real `border` always paints on top of an
  `inset` box-shadow on the same box — no combination of shadow layers changes that — so
  the bottom-edge highlight (`inset 0 -1px 0 primary.dark`, previously stacked into the same
  `boxShadow` as the glow/ring) could never actually sit over the 1px border the way it does
  in Figma. Moved that inset shadow onto a `&:hover::after` overlay instead — a decorative
  pseudo-element 1px larger than the button on every side (`inset: -1`, `borderRadius:
  'inherit'`, `pointerEvents: 'none'`), which paints as its own layer on top of the real
  border. Considered and rejected two alternatives: recoloring `borderBottomColor` on hover
  (creates a hard diagonal seam at the rounded corners instead of the smooth taper Figma's
  inner shadow has), and replacing the real border with an inset-shadow border entirely
  (would need +1px padding back on every side to keep the just-fixed 30/36/42px heights,
  reopening that work for no real benefit). _(2026-11-03)_
- **Removed the local `ColorButton` restyle from admin page toolbars; they now render the
  guide's own Contained / Primary.** Twelve admin files each defined an almost identical
  `const ColorButton = withStyles(...)(Button)`. Each copy overrode `color: theme.buttonBg`,
  `background: theme.searchInputBg`, hover `theme.listHover`, `borderRadius: 4`, an icon
  `fill`/`marginRight` and, in some, a margin. Nine more child components received it as a
  `ColorButton` prop. Because `withStyles` injects its class after MUI's, it silently won
  over `MuiButton.containedPrimary`, so these buttons never picked up any of the Button
  work above. They now render plain `<Button variant="contained" color="primary">`: the
  leading icon moved into `startIcon`, so the theme's icon gap applies, and
  `disableElevation` and the `ColorButton` prop were dropped. Pages affected: Workflow list,
  Workflow tags, Number templates, QR templates, UI filters, Custom interfaces, Registry
  list and keys, Users, Units, Unit, Translations. Deliberately *not* promoted to an official
  "toolbar" variant: the guide is the source of truth, so an existing look isn't adopted
  just because it exists. One behaviour change: Unit's "Upload CSV" had no `variant` at
  all (so it was Text underneath), and it is now Contained like its siblings. Not done here:
  the three front-core copies (`BpmnAi` ×2, `JsonSchema/elements/UserList`), since those
  also render in cabinet-front.
  **Two icon problems surfaced once these buttons went purple**, both found on the live page:
  - **The `<img src="*.svg">` icons disappeared.** `dowload-icon.svg`, `export_pink.svg`,
    `gg_import.svg`, `gg_export.svg`, `jsonFiolet.svg` and `add_icon.svg` all bake `#BB86FC`
    into their paths. That is exactly `primary.main`, so they were invisible on the
    Contained background; the old grey restyle was the only reason they ever showed.
    Replaced with the guide's own icon source, Material Symbols Rounded/w400/Fill, as
    `<SvgIcon component={…} inheritViewBox />`: import → `DownloadFill`, export →
    `UploadFill`, json → `DataObjectFill`, add → `AddFill`. The old `.svg` files are no
    longer imported by these buttons but were left on disk, since other places may use them.
  - **`@mui/icons-material` icons (e.g. Create's "+") stayed white instead of taking the
    label color.** The global `MuiSvgIcon.root.fill: rgba(255,255,255,0.7)` override wins
    over `currentColor`, and `MuiButton.root` only reset it for `outlinedPrimary`. That
    reset (`color: inherit` + `svg { fill: currentColor }` on start/end icons) is now
    unscoped, so it covers every Button variant. The global `MuiSvgIcon` fill itself is
    untouched: it's app-wide, and removing it is a separate decision. _(2026-11-03)_
- **Processes pages: one Contained per toolbar row, everything else Outlined.** Only the
  row's Create action stays Contained Primary; the other buttons in that row are now
  Outlined Primary:
  - Workflows (`/workflow`, `/workflow_test`, `WorkflowTableToolbar.jsx`): Import, and
    Export (shown only when rows are selected, and alone in read-only mode). Export also
    got the same 16px left margin as Import. It pointed at `classes.actionBtn`, which this
    file never defined, so it sat about 3px from Create instead of 20px. Both now share one
    `secondaryButton` class.
  - Number templates (`ImportTemplate.jsx`): Import templates.
  - Message templates (`MessageTemplatesList/index.jsx`): Export and Import.
  - QR templates, Categories and Tags have only a Create button in that row, so nothing
    changed there. Dialog-internal buttons (e.g. QR's three "Mapping fields / Template"
    buttons) were deliberately left out: they aren't part of the toolbar row.
  _(2026-11-03)_

## Inputs

- **Fixed outlined `Select`'s label getting crossed out by its own outline on hover**,
  found while auditing combo box/autocomplete behavior. An outlined `Select` needs a
  `label`/`labelId` prop synced to its sibling `InputLabel` so MUI can size the "notch" cut
  into the border for the floating label to sit in — without it, the notch is never sized,
  so the border runs straight across instead of parting around the label. Usually invisible
  at rest here because these call sites also hardcode `'& fieldset': { borderColor:
  'transparent' }` to hide the border for their dark-theme look, but MUI's own built-in
  hover rule for the notched outline (`&:hover .notchedOutline`) has higher CSS specificity
  and wins over that flat override, suddenly revealing the un-notched border crossing the
  label on hover. Confirmed by resolving the actual rendered/served code, not just reasoning
  from source.
- **Fixed in one shared component plus two independent one-offs** — all three had the
  identical pattern (`InputLabel` with no `id`, `Select` with no `labelId`/`label`):
  - `packages/front-core/components/JsonSchema/elements/Select.jsx` — the generic select
    field renderer used across schema-driven forms; real call sites include
    `WorkflowCategorySelect.jsx` and the three selects in admin-front's
    `WorkflowSettings/index.jsx` (Status Target Template ×2, Workflow Status), all passing
    `variant="outlined"` + `darkTheme`.
  - `components/cabinet-front/.../tasks/pages/Task/debugTools/CheckValidFunction.jsx`
  - `packages/front-core/layouts/components/DebugTools/tools/CustomInterfaceCheck.jsx`
- **Audited ~40 other raw `<Select>` usages in the repo** for the same pattern: the rest
  are either `variant="standard"` (no outline/notch mechanism to begin with), have no
  sibling `InputLabel` at all, or already route through the Autocomplete-based
  `components/Select` wrapper (which correctly passes `label` into its internal `TextField`
  already). None of those needed a change. _(2026-10-12)_
- **`MuiOutlinedInput`'s background was a standalone literal (`#2e2e2e`) with no relation to
  any palette value** — found while tracing which token produces the Text field's
  background. Tokenized instead: `lighten(theme.palette.background.paper,
  INPUT_SURFACE_LIGHTEN)`, a function-valued style override (same shape as the
  `MuiButton.sizeSmall`/`sizeLarge` fix above) so it reads `background.paper` live rather
  than duplicating a color. `INPUT_SURFACE_LIGHTEN` is `0.14` — not an arbitrary round
  number but tuned so `lighten()`'s own formula (`channel + (255 - channel) * coefficient`)
  reproduces the previous literal from `background.paper` (`#0c0c0c`) almost exactly:
  `12 + (255 - 12) * 0.14 ≈ 46 = 0x2e`. Confirmed by resolving the actual theme through
  `adaptV4Theme()` + `createTheme()` — resolves to `rgb(46, 46, 46)`, i.e. `#2e2e2e`, so this
  is a pure tokenization with **no visual change**. The matching autofill-background literal
  on `MuiOutlinedInput.input` (`WebkitBoxShadow`'s inset color) was the same flat `#2e2e2e`
  duplicated a second time — now reads the same computed value instead of its own copy.
  **A third, independent copy of the same literal was found afterwards**:
  `MuiAutocomplete.inputRoot.backgroundColor` — a separate override slot that applies to the
  same rendered surface (Autocomplete wraps a real `variant="outlined"` TextField) but isn't
  derived from `MuiOutlinedInput.root` at all, so the first pass missed it. Also converted to
  a function-valued override reading the same `INPUT_SURFACE_LIGHTEN` constant — kept in sync
  through one shared constant rather than one shared CSS rule, since the two are genuinely
  separate style slots. Also added a "Background" row to the Style Guide's Text field Color
  panel (previously missing entirely) and updated Autocomplete's existing one to describe the
  new tokenized value instead of "hardcoded, no matching palette token". Combo box's panel
  already correctly described the `MuiOutlinedInput.root` fallback and needed no change.
  **A fourth copy surfaced in a custom (non-MUI) theme key**: `buttonHoverBg`, also
  `#2e2e2e`, used directly as a `backgroundColor` in ~20 places across admin pages (Metrics,
  ProcessStatistics, Users/Unit, several Workflow sidebar/settings/dialog styles, plus shared
  front-core components rendered inside admin — DataTable pagination, SelectFilterHandler,
  JsonSchema Tags, the profile `LanguageSelector`) — sitting alongside other custom keys like
  `buttonBg`/`searchInputBg`/`chipColor`. **cabinet-front is unaffected**: front-core's own
  `theme.js` and the VisualEditor theme set `buttonHoverBg` to a different value (`#ffe565`)
  entirely. Confirmed deliberate (same surface tone as the input background, not a
  coincidence) and tokenized: since custom theme keys are read as plain strings by component
  stylesheets rather than through MUI's function-valued `styleOverrides` slots, it can't read
  `theme.palette.*` live the way `MuiOutlinedInput`/`MuiAutocomplete` do above — instead,
  `palette.background.paper` itself was pulled into a new `BACKGROUND_PAPER` constant (was
  *also* independently duplicated across `background.paper`/`background.default`), and
  `buttonHoverBg` now reads `INPUT_SURFACE_BG = lighten(BACKGROUND_PAPER,
  INPUT_SURFACE_LIGHTEN)` computed once at module load — a static snapshot, unlike the two
  live-reading overrides, since that's the most a plain custom key can do. Format changed
  from a hex string to `lighten()`'s own `rgb(46, 46, 46)` output — checked every usage for
  anything that appends hex alpha (e.g. `` `${color}80` ``, which would silently break on an
  `rgb()` string); none do, all consume it as a plain CSS color (including one
  `${theme.buttonHoverBg}!important`, still valid with the new format). Resolves to the same
  color either way — no visual change. **New side effect worth noting**: `background.paper`
  and `background.default` now share one literal (`BACKGROUND_PAPER`) instead of two
  independent `#0c0c0c` copies — correct if they're meant to always match, but either would
  need its own value again if they're ever meant to diverge. _(2026-10-13)_
- **A "Reddit style" input (`variant="filled"`, adapted from MUI's own docs reference at
  mui.com/material-ui/react-text-field → "Customized inputs" → `RedditTextField`) was tried
  as a global `MuiFilledInput`/`MuiInputLabel` theme override, then reverted** —
  `MuiInputLabel` is back to its original plain object, and the `MuiFilledInput` override is
  gone entirely. A global override affects every `variant="filled"` input app-wide, and
  admin-front already has one in production: the Header's search field
  (`layouts/components/Header.jsx`, its own custom background/radius/underline handling),
  which silently picked up an unwanted border and a redundant second focus ring once the
  global override shipped. The exploration now lives as a one-off `styled(TextField)`
  wrapper local to the Style Guide (`RedditTextField` in `StyleGuide.jsx`) instead — out of
  this file's scope per the note at the top (theme changes only, not the review tooling
  itself) — so see that component's own comments for the current implementation, reusing
  `theme.buttonHoverBg`/`theme.borderColor`/`palette.primary.main`/`palette.error.main`.
  **A second, more severe bug surfaced on the move**: the scoped version's label-color rule
  initially nested the `&&` trick one level inside a descendant selector
  (`'& .MuiInputLabel-root': { '&&': {...} }`), which compiles to `.wrap .label.wrap .label` —
  the wrapper's own class chained directly onto itself with no combinator, requiring one
  element that is simultaneously `.label` (from the descendant part) and `.wrap` (chained),
  which nothing is. The rule silently matched nothing at all — not a precedence loss, no rule
  applied — so the label quietly fell back to plain MUI defaults (white at rest, purple on
  focus, red only via real validation), with no visible error to signal the mistake. Caught by
  SSR-rendering the actual component and reading the generated CSS, same as before. Fixed by
  doubling the *wrapper's* class at the top level instead
  (`'&& .MuiInputLabel-root': {...}`), re-verified correct across all five states the same
  way.
  **The red-while-empty label color was then removed entirely, at the product designer's
  direction**: clearing a field's content shouldn't read as a validation error, so `shrink`/
  the label no longer carry any color override at all — `RedditTextField` now matches MUI's
  reference exactly (surface styling only; label behavior is 100% "filled" variant defaults).
  **Added a clear ("×") button**, MUI's own documented pattern (Input Adornments →
  `InputAdornment` + `IconButton` in `InputProps.endAdornment`), not a hand-rolled overlay —
  reuses the same `SymbolClose` (Material Symbols) icon already imported for the Style
  Guide's own Icon library/Buttons demos, shown only once the field has a value, hidden
  while disabled. **The error state's border color was then found missing entirely**: the
  `&.Mui-focused` rule flips `borderColor` to `palette.primary.main`, but there was no
  matching `&.Mui-error` rule, so an invalid field never turned its border red — only the
  label/helper text did, via MUI's own native defaults. Added `&.Mui-error { borderColor:
  theme.palette.error.main }`, declared after `&.Mui-focused` so it wins on equal specificity
  when a field is both focused and invalid (an invalid field should read red even while
  focused, not fall back to the primary ring).
  **Since removed from the Style Guide entirely, at the product designer's direction**,
  superseded by the top-label Text field below. `RedditTextField.jsx`, its demo section and
  its token rows (`getInputTokenItems`/`getInputColorRows`) are deleted. Nothing in production
  ever used it. The lessons above still apply: no global `MuiFilledInput`/`MuiInputLabel`
  override, and `&&` goes on the wrapper's own class at the top level. _(2026-11-03)_
- **Text field: one input design for all of admin, derived from Button / Primary's tokens.**
  Applied at the theme level, so every outlined and standard input renders as this field:
  TextField, Select, Autocomplete, date pickers, `StringElement` (schema forms) and the
  table search. It started as a Style-Guide-only exploration (a one-off `TopLabelTextField`
  component, since deleted) and was rolled out admin-wide at the product designer's
  direction. Shown in the Style Guide under Inputs → "Text field", now rendered with plain
  MUI components (`TextFieldGallery.jsx`), so the guide shows exactly what the theme draws.
  - **Where it lives:** the Text field block at the top of `admin-front/.../theme.js`
    (`inputFieldStyles`/`inputFieldSize`), applied to `MuiOutlinedInput.root` and
    `MuiInput.root`, plus `MuiInputLabel.root`, the padding part of
    `MuiAutocomplete.inputRoot`, and two default props (`MuiInputLabel.shrink: true`,
    `MuiAutocomplete.ChipProps.size: 'small'`).
  - **Variants:** outlined and standard both render as this field. The standard variant's
    underline look is gone, at the product designer's direction. `variant="filled"` (the
    Header search) is deliberately untouched; label rules are scoped to the outlined and
    standard label classes for that reason.
  - **Size:** small/medium/large from the `size` prop (medium default), read from MUI's
    `ownerState` in the function-valued overrides. Not from a class: MUI only ever adds
    `MuiInputBase-sizeSmall`, never a large class, so a class-based large silently fell back
    to medium (caught live). Autocomplete needs one more step: MUI passes `size` to its input only
    when it's small, so `MuiAutocomplete.inputRoot` restates height, radius and text size from
    Autocomplete's own `ownerState`. Each size reads Button's tokens:
    - height: `theme.buttonHeight`
    - radius: `theme.buttonCornerRadius` (6/8/10)
    - horizontal padding: `r + 7`, Outlined's
    - value text: `typography.button(.small).fontSize`

    One-line fields have a fixed height with the text centered. Measured live, Outlined's
    `r − 1` vertical padding overshot at Medium: 7 + 7 + 2 border + a 20.125px line = 36.125px.
    Multi-line fields use the height as a minimum with `r − 1` top and bottom. Fields holding
    chips (Autocomplete tags, the table search's filter chips) grow too, with an even inset
    so one row of small chips lands on the button height. Chips inside a field are capped to
    the small chip height (24px) and spaced 6px from the text after them. Measured live, the
    table search's medium filter chips had made it 40px, with the chip ✕ touching the
    placeholder.
  - **Fill:** `palette.background.paper`, i.e. elevation 0, Paper's flat color with no
    overlay. This replaces the old `#2e2e2e` input surface; autofill matches it.
  - **Border:** the field draws its own border and the notched outline (`fieldset`) is
    hidden, since there's nothing to notch with the label above. `theme.borderColor` at
    rest, Outlined's resting border (`primary.main` at 30%) on hover, `primary.main` plus a
    2px 25% ring on focus, `error.main` on error, `palette.text.disabled` for disabled text
    and adornments.
  - **Label:** static above the field (position/transform overridden, `opacity: 1`),
    `body2` size, `palette.text.secondary` (the designer's choice) in every state except
    disabled. It never moves or recolors on focus/error; error shows on the border and the
    helper text only. It's always shrunk, which also keeps placeholders visible: MUI hides
    them while a label is unshrunk. `MuiFormLabel.root`'s 0.5 opacity still applies to other
    form labels (e.g. radio-group legends).
  - **Inside the field:** icons use `currentColor`, beating the global `MuiSvgIcon` fill, so
    they follow state. Indicators sit `r` in from the right. Icon buttons (password toggle,
    date trigger, clear) scale with the text and cancel their padding, so they never add
    height.
  - **Local overrides removed** so they can't fight it. Each was admin-only, or scoped to
    `darkTheme`, which only admin passes (cabinet-front has zero uses), so cabinet is
    unaffected:
    - `StringElement` (`layout.js`): the `darkTheme` `#2e2e2e` fill, square bottom corners,
      transparent outline, white label and `#2e2e2e` select. In `darkTheme` it also skips
      the 16px label font, the −5px multiline label offset, the black read-only label and
      the floating-label width allowance, and always shrinks the label.
    - Table search (`DataTable/.../InputComponent.jsx`): in `darkTheme` it renders as an
      `OutlinedInput` instead of a bare `InputBase` (which the theme doesn't style), dropping
      its `#2a2a2a` box and underline.
    - `MultiSelectFilterHandler`'s search: its `#2e2e2e`/square-corner/padding rules now only
      apply outside `darkTheme`.
    - `CustomDatePicker`'s `darkThemeLabel`: header background, radius and outline removed.
    - The shared `Select` (`components/Select`): its `darkThemeLabel` (a `#2a2a2a` panel
      behind label and field, white label, transparent outline) is removed, and in
      `darkTheme` it skips its 16px label size. Found live on Statistics → Report List and
      Registry → Parent Registry.
    - The schema-form Select (`JsonSchema/elements/Select.jsx`): its `darkThemeLabel`
      `#2a2a2a` panel and 4px radius on the whole FormControl are removed. It showed as a grey
      band behind both label and field, e.g. Workflow → Statuses → Task or Event / Status
      Type, reported by the product designer.
    - Table pagination (`DataTable/DataTablePagination.jsx`): the Per Page select and the
      page-number input painted `theme.buttonHoverBg` (the old `#2e2e2e`) with square bottom
      corners and 5px padding on their inner element, a second box inside the field. Reported
      by the product designer. Removed in `darkTheme`. The page-number input also had a fixed
      digit-based width (≈24px) that the field's side padding exceeded, hiding the number.
      In `darkTheme` that width now sits on the input element and the field sizes around it.
      On focus the Per Page select still showed a tint inside the field. That's MUI's own
      Select focus background (`rgba(255,255,255,0.05)`, square corners) on its inner element,
      so it's fixed for every Select in the theme's Text field styles: the inner element is
      transparent on focus and the field's surface shows through in every state.
    - Table select filter (`DataTable/components/SelectFilterHandler.jsx`): the same
      leftovers: a header-colored panel, a white label, a transparent outline and a
      `buttonHoverBg` select fill. Removed in `darkTheme`.
    - Admin pages: the white labels and transparent outlines in the Workflow and Tags
      toolbars; the `#2e2e2e` date pickers in Metrics and Statistics; Statistics' filter
      field corners; the 2px primary outline in the Journal users filter; and IconSelect's
      outline/label colors. The Metrics filter row is now bottom-aligned, so its unlabeled
      Search lines up with the labeled date fields instead of sitting about 24px higher.
  - **New token `theme.buttonHeight`** (`{ small: 32, medium: 36, large: 42 }`). It replaces
    the three literals in `MuiButton.sizeSmall/Medium/Large`'s `minHeight`, which now read
    it, so Button and the Text field share one source. No change to how Button renders.
    Admin-only, like `buttonCornerRadius`. _(2026-11-03)_

- **Spacing unit is now 4px** (`spacing: 4`, so 1 = 4px, 2 = 8px, …; was MUI's default 8),
  at the product designer's direction. The designer chose to let existing layouts change
  rather than compensate. Every `theme.spacing(n)` (about 43 calls in front-core
  components), every numeric `sx` spacing and Grid/Stack `spacing` value in admin (about
  47), and MUI's own internal spacing (Toolbar gutters, CardContent/ListItem padding,
  Grid/Stack gaps, TablePagination…) now renders at half its previous size. The Text
  field's two gaps (label to field, chip to text) moved from `spacing(0.75)` to
  `spacing(1.5)` to stay at 6px. Literal px values are unaffected.
- **Default corner radius is now 8px** (`shape.borderRadius: 8`, was MUI's default 4), at
  the product designer's direction. MUI reads it for Paper, Card, Menu/Popover, Tooltip,
  Alert and similar surfaces, and for `sx` `borderRadius` multipliers. Buttons and the Text
  field keep their per-size `theme.buttonCornerRadius` (6/8/10); 8 matches their medium
  size. Literal radius values in component stylesheets (about 120 across admin and
  front-core) are unaffected. _(2026-11-03)_

- **Every surface has a hairline border**: `1px solid` `#ffffff` at 5%
  (`alpha(palette.common.white, 0.05)`), at the product designer's direction. It started as
  Card-only (`MuiCard`) and was then extended admin-wide, so it now lives on
  `MuiPaper.root`, scoped to `.MuiPaper-rounded`. That covers cards, menus, popovers,
  dialogs, the list-page panel, the Autocomplete list and the Style Guide's own section
  containers. Square Papers (the app bar, the nav drawer, other flush structural panels) stay
  borderless. The versions timeline card's own `1px solid theme.borderColor`
  (`VersionsTimeline.jsx`) beat the theme rule; it's removed. _(2026-11-03)_
- **Table borders use the divider** (10% white), at the product designer's direction:
  - `MuiTableCell.root` gets `borderBottom: 1px solid palette.divider`. MUI's own dark-mode
    default derives a solid grey from the divider instead (`rgb(81, 81, 81)`). **First
    attempt bug, caught live:** the border was added as a second `MuiTableCell` key in
    `overrides`, which silently replaced the existing one (a duplicate key in a JS object
    literal means the later one wins). That dropped the cells' `padding: 12`, so Registry
    keys' "Created" and "Updated" headers ran together. It's now merged into the original
    block. A sweep found the same collision on `MuiInput`, where the Text field's
    standard-variant block had replaced an older `'&$disabled': { color: '#000' }`. That rule
    was v4 `$`-syntax that never matched under v5 (see "Worth addressing" on adaptV4Theme),
    so nothing is lost; the dead block is gone. No duplicate keys remain in `overrides`.
  - The shared `DataTable`'s `cellDark` (rows and header, `darkTheme` = admin only) used the
    header's separator line (`theme.header.borderBottom`, `#4E4E4E`). It now reads
    `palette.divider`, so the list-page tables follow it and the header line is unchanged.
  - Admin pages with their own table cell, header and group borders on `theme.borderColor`
    now read `palette.divider` too: Metrics, Registry metrics, Process metrics, Statistics,
    Monitoring, Health check and Mocks. _(2026-11-03)_

- **Admin's own spacing and corner radii now read the theme**, at the product designer's
  direction. Spacing keeps its current size; corners follow the 8px default.
  - **What changed:** 266 hardcoded `padding`/`margin`/`gap` values (numbers and `'Npx …'`
    strings) in 52 files under `components/admin-front/src/application` became
    `theme.spacing(n)` at their current size, snapped to the 4px grid: 24px → `spacing(6)`.
  - **Off-grid values moved slightly:** the most common were 10 → 12 (×40), 30 → 32 (×20),
    5 → 4 (×18), 15 → 16 (×12), 11 → 12 (×6) and 43 → 44 (×6).
  - **Left alone:**
    - zero
    - 1–3px nudges
    - anything over 64px (offsets and widths, e.g. the sidebar's −300)
    - numeric `sx` spacing, which MUI already scales by the unit
    - inline `style={{}}` props and JSON-schema layout config (`schema.js`), which can't
      read the theme (62 values)
    - `theme.js` itself
  - **Radius:** admin's own rectangular corners of 1–8px became `theme.shape.borderRadius`
    (8px). Only 3 qualified: the Header (2px), the profile app bar (already 8) and Import
    register keys (4px). Most of the ~60 rectangular radii counted earlier are in
    front-core. Circles, pills, square and one-sided corners are unchanged.
  - **How:** a syntax-aware rewrite, not text replacement. It only edited values inside style
    functions that receive `theme` (`makeStyles`/`withStyles`/`styled`). Plain style objects
    passed only to `withStyles`/`makeStyles` were wrapped as `(theme) => ({…})`, and
    parameterless style callbacks got a `theme` parameter.
  - **Not yet:** front-core (about 1,800 spacing values) is shared with cabinet-front, whose
    theme differs, so it's a separate pass. _(2026-11-03)_

## Layout

- **Left sidebar is now elevation zero** — two separate tokens needed fixing, not one.
  `leftSidebarBg` (top-level, `#404040` → `BACKGROUND_PAPER`) only feeds front-core's shared
  `Layout` (`packages/front-core/layouts/LeftSidebar.jsx`), used by cabinet-front. **admin-
  front has its own, entirely separate local copy** —
  `components/admin-front/src/application/layouts/LeftSidebar.jsx` — which shadows the
  front-core one via webpack module resolution and reads a *different* token,
  `theme.navigator.sidebarBg`, completely untouched by the first fix. First pass changed only
  `leftSidebarBg`, so admin's actual rendered sidebar kept its old `#404040` and the fix had
  no visible effect — found when the sidebar still looked wrong after the first push.
  **Second pass initially set `navigator.sidebarBg` to `BACKGROUND_PAPER` too — wrong move,
  caught before shipping further**: that token turns out to be reused well beyond the actual
  sidebar, for backgrounds on five Workflow editor dialogs (Workflow page, Versions, New
  version, Workflow settings, Task element), the Right sidebar panel, and Version timeline
  cards (all under `modules/workflow/pages/Workflow/`) — none of which were meant to flatten
  to match the page. Reverted `navigator.sidebarBg` to its original `#404040`.
  **Third pass: `leftSidebarBg` turned out to have the exact same problem.** Despite the
  "dedicated solely to the actual nav sidebar" claim in the second pass, it's also read by
  front-core's shared `SchemaStepper.jsx` and `TreeListItem.jsx` — rendered inside admin's
  own schema-driven forms (28 admin files use front-core's JsonSchema) — which had been
  silently flattening to the page background since the *first* pass (not introduced by the
  second), just not noticed until this was checked specifically. `cabinet-front` was never
  at risk here — it reads `leftSidebarBg` from front-core's own `theme.js` (`#F2F7FF`),
  entirely separate from admin's. Resolution: stopped reusing any custom key for this at all.
  Reverted `leftSidebarBg` to its original `#404040` too, and admin's local
  `layouts/LeftSidebar.jsx` now reads `theme.palette.background.paper` **directly** — the
  actual MUI palette token for exactly this purpose, with no other hidden consumers to
  collide with. Net result unchanged from intent (sidebar flush with the page), reached by a
  more direct, lower-risk path after two reuse attempts both turned out to have the same
  class of problem. If `SchemaStepper`/`TreeListItem`/the seven Workflow surfaces should
  *also* go elevation-zero eventually, that's separate, not-yet-decided scope.
- **Content area gets outer padding**: admin's local `LeftSidebar.jsx` `appContent` class
  (the container wrapping every page's content, to the right of the sidebar) had no padding
  at all — content sat flush against the viewport edges. Added `padding: 24` (plus
  `boxSizing: border-box` so it doesn't push content outside its flex basis), giving every
  page's content a gutter on all sides. Admin-only for now — front-core's shared `Layout`
  (cabinet-front) has the equivalent `appContent` class but wasn't touched. **The workflow
  editor opts out** (`/workflow/:id`), at the product designer's direction: its BPMN canvas
  and settings panel run edge to edge. This goes through a new `disablePadding` prop on
  `LeftSidebarLayout` (default `false`, so every other page keeps the gutter). _(2026-11-03)_
- **List pages get an opt-in "panel" treatment**: `DataTable` (`packages/front-core/
  components/DataTable/index.jsx`) gained a `panel` prop (default `false`) that wraps its
  toolbar (search/buttons) + table + pagination — everything but a fullscreen dialog — in a
  single `<Paper>`. Deliberately opt-in, not a default-on change to the shared component:
  `DataTable` is also reused in embedded/nested contexts (schema editors, filter pickers,
  dialog content) where a raised panel would look wrong, and those weren't individually
  reviewed. `<Paper>`'s own elevation overlay (MUI's built-in dark-mode behavior — a white-
  alpha gradient over `background.paper`, confirmed active since this theme has
  `palette.mode: 'dark'` and no `theme.vars`) is what makes the panel read as raised now that
  the sidebar is flush with the same base color — no hand-picked panel color needed.
  **Elevation bumped from the default `1` (≈0.05 overlay alpha, too subtle) to `2`**
  (`getOverlayAlpha(2) ≈ 0.0694` — confirmed via MUI's own formula; `5` ≈ 0.1006 and then
  `4` ≈ 0.0924 were tried first, dialed back further to `2`) for clearer contrast against the
  now-flush sidebar/page. Enabled so far only on `WorkflowList`
  (`components/admin-front/.../workflow/pages/WorkflowList/index.jsx`), which covers both
  "Workflows" and "Test Processes" (same component, `isTestProcesses` flag) — matches the
  screenshot that prompted this change. Other list pages (Processes, Journals, Users,
  Registers, etc.) still render flat until `panel={true}` is added to each, a deliberate
  choice to verify this looks right before rolling it out further.
- **Consolidated the sidebar/header separator-line color onto the one existing system token
  instead of inventing anything new.** `header.borderBottom`, `navigator.borderBottom`, and
  `navigator.drawerPaper.borderRight` (the sidebar's nav-item dividers, and its border against
  the content panel) each independently hardcoded their own copy of the same line color —
  despite a top-level `borderColor: '#4E4E4E'` key already existing as, presumably, the
  intended system token for exactly this. None of the three actually read it. One copy had
  also silently drifted to `#4E4E4F` (one hex digit off) on `navigator.borderBottom`. All
  three now read a single `BORDER_COLOR` constant (same value as `borderColor`, `#4E4E4E`) —
  the drift is gone and there's one source instead of four. _(2026-10-13)_

## Worth addressing (known issues found, not yet fixed)

- **Text field rollout follow-ups** (from making the Text field admin-wide; not yet done):
  - The Style Guide's separate Autocomplete and Combo box sections, and their token tables,
    predate it and may still describe the old `#2e2e2e` surface. The Text field gallery now
    covers both cases.
  - `MuiAutocomplete.paper`'s `margin: '10px -14px'` was tuned to the old 14px input
    padding, so the options list may now sit 14px wider than the field on each side.
  - Dead `fieldset` rules remain where they no longer do anything, e.g. the quick-filter
    borders in `DataGridPremium` and the Metrics/Statistics leftovers; these can be removed.
  - The Header's filled search is still its own design.
  - Every page needs a live look: anything that sized itself around the old 56px outlined
    height will now get a 36px field. _(2026-11-03)_
- **Admin buttons that still bypass the guide's Button variants** (audit done after the
  `ColorButton` removal under Buttons; not yet fixed). Admin-owned:
  - Header (`layouts/components/Header.jsx`): a circular bordered `iconBtn` (`#797979`), a
    white `menuButton`, and fixed 40×40 IconButtons.
  - A copy-pasted `'&:hover': { backgroundColor: theme.buttonHoverBg }` plus
    `theme.navigator.navItem.linkActiveColor` text on Buttons/IconButtons, about 14 places
    across Workflow, WorkflowSettings, WorkflowVersions, Details/RightSidebar and Unit.
    Task's `actionWrapper` uses the literal `#2e2e2e` instead.
  - Journal `backBtn`: white outlined.
  - DeleteTemplate: red IconButton, `#ff0000`.
  - SyncStatusColumn `detailsButton`: a link-style text button with the literal
    `rgb(187, 134, 252)`.
  - Hand-rolled buttons: ProfileAppbar's `ButtonBase` pill, CabinetMenu IconSelect's
    `ButtonBase` tiles, and clickable `<div>`s in ProcessesMetrics and RightSidebar.

  Front-core pieces that render in admin (and also affect cabinet):
  - The JsonSchema VisualEditor's nested `ThemeProvider` re-skins every MuiButton and
    IconButton inside the form editor.
  - The front-core `ColorButton` copies: `BpmnAi` ×2 and `UserList`.
  - `#BB86FC` hardcoded in CreateControlSnippet/CreateGroup.
  - `color="yellow"` (no such palette key) on about 12 file-preview buttons.
  - Theme-spread hooks such as `theme.confirmDialogAcceptButton`.

  Many of these are duplicated across the `editor` / `editor-old` / `CodeEditDialog`
  copies. Some may turn out to be legitimate guide candidates (destructive red, link-style
  text, icon-only toolbar), so question each before either removing it or adding it to the
  guide. _(2026-11-03)_
- **The Style Guide's own Buttons page (`pages/Buttons/`) went stale after the Button /
  Primary recreation work above, in two ways — found while verifying that work live, not
  yet fixed.** First, its properties-table false-flags three now-tokenized values as
  hardcoded literals: `getResolvedMuiStyleOverride`
  (`shared/themeIntrospection.js:21`) resolves a function-valued override
  (`({ theme }) => ({ backgroundColor: theme.palette.primary.main })`) down to a plain value
  *before* `resolveComponentColorRow` (`shared/themeIntrospection.js:55`) compares it against
  the palette token — so it can no longer tell "reads the token live" apart from "someone
  typed the same hex by hand," and labels both "duplicates ... as a literal." Affects
  `containedPrimary` background, and `containedPrimary`/`outlinedPrimary`/`textPrimary`
  label color — all four were correctly *unflagged* before they were tokenized, and now
  incorrectly flagged after the fix that was supposed to resolve them; `textSecondary`
  (genuinely still a hardcoded literal) is correctly flagged throughout. Proposed fix: call
  the override function a second time with that one palette value swapped for a throwaway
  color — if the resolved output changes accordingly, it reads the token live; if not, it's
  a real hardcoded duplicate. Second, three separate rows in `tokenItems.js` are now
  factually wrong, written as fixed prose describing MUI's pre-override defaults rather than
  reading the theme live the way the color rows do: the padding note still says "hardcoded
  '6px 16px' in MUI's Button.js" (Medium Contained now actually renders `7px 15px`, from
  `theme.buttonCornerRadius`), the shape note still cites `theme.shape.borderRadius` (4px;
  Button no longer uses it at all, see `theme.buttonCornerRadius` above), and the elevation
  note still lists `shadows[4]`/`[6]`/`[8]` (Contained now uses its own
  `containedPrimary`-specific shadow, not a numbered elevation). _(2026-11-03)_
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
- **`palette.action.hover`/`selected`/`disabledBackground` are leftover light-theme
  values**: black-based rgba literals matching MUI's own light-mode defaults verbatim, in a
  theme whose `background.paper` is `#0c0c0c`. (`action.active`, `action.disabled` and
  `palette.divider` have since been fixed; see Colors & surfaces above.) _(2026-11-03)_
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
