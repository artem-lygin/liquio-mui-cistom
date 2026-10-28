import { getResolvedMuiStyleOverride, readBackground, readPseudoSlot, resolveComponentColorRow } from '../../shared/themeIntrospection';
import { BUTTON_METRICS, BUTTON_ICON_METRICS, ICON_BUTTON_SIZE_METRICS } from './constants';
import { getButtonFontSizePx, getButtonMinHeightPx, capitalize } from './metrics';

// Buttons tokens: background + label color for each contained/outlined/text × primary/
// secondary combination (resting state — hover/focus/disabled color facts live in the
// Buttons demo's own contextual properties panel, not duplicated here), plus IconButton's
// icon color since it's part of the same component family in the demo nav.
// activeVariant/activeColor (the demo's own current selection) don't filter this table —
// it's meant to be a complete, always-static reference — they just mark which row(s)
// match what's actually showing above right now, via `active: true` (see
// PropertyCategoryCard's ▸ marker).
export const getButtonColorRows = (previewTheme, activeVariant, activeColor) => {
  const rows = [];
  const rootSlot = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', 'root');
  const rootBg = readBackground(rootSlot);
  const rootColor = rootSlot?.color;

  ['primary', 'secondary'].forEach((color) => {
    const paletteMain = previewTheme.palette[color].main;
    const paletteContrastText = previewTheme.palette[color].contrastText;
    ['contained', 'outlined', 'text'].forEach((variant) => {
      const slotKey = `${variant}${capitalize(color)}`;
      const overrideSlot = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', slotKey);
      const overrideBg = readBackground(overrideSlot);
      const overrideColor = overrideSlot?.color;
      const label = `Button ${variant}/${color}`;
      const isActive = variant === activeVariant && color === activeColor;

      if (variant === 'contained') {
        const bgRow = resolveComponentColorRow({
          label: `${label} background`,
          overrideValue: overrideBg,
          overridePath: `MuiButton.${slotKey}`,
          rootValue: rootBg,
          rootPath: 'MuiButton.root',
          paletteValue: paletteMain,
          palettePath: `palette.${color}.main`
        });
        if (bgRow) rows.push({ ...bgRow, active: isActive });
      } else if (overrideBg !== undefined) {
        // MUI's own default for text/outlined is a transparent background — this app
        // painting one in isn't "replacing a palette value" (there isn't one to begin
        // with), so this doesn't go through resolveComponentColorRow's palette-compare path.
        rows.push({
          path: `MuiButton.${slotKey}`,
          value: overrideBg,
          status: 'overridden',
          active: isActive,
          note: `${label} background — MUI's own default is transparent for ${variant}; this app paints one in.`
        });
      }

      const colorRow = resolveComponentColorRow({
        label: `${label} label`,
        overrideValue: overrideColor,
        overridePath: `MuiButton.${slotKey}`,
        rootValue: rootColor,
        rootPath: 'MuiButton.root',
        paletteValue: variant === 'contained' ? paletteContrastText : paletteMain,
        palettePath: variant === 'contained' ? `palette.${color}.contrastText` : `palette.${color}.main`
      });
      if (colorRow) rows.push({ ...colorRow, active: isActive });
    });
  });

  const iconRow = resolveComponentColorRow({
    label: 'IconButton icon',
    overrideValue: getResolvedMuiStyleOverride(previewTheme, 'MuiIconButton', 'root')?.color,
    overridePath: 'MuiIconButton.root',
    rootValue: undefined,
    rootPath: undefined,
    paletteValue: previewTheme.palette.action.active,
    palettePath: 'palette.action.active'
  });
  if (iconRow) rows.push(iconRow);

  return rows;
};

// Button.js hardcodes its own padding per variant+size rather than calling
// theme.spacing()/deriving from theme.spacing — confirmed by grepping
// @mui/material/Button/Button.js directly: no theme.spacing( call anywhere in its style
// function. It used to also hardcode its own pxToRem() font-size per size (13px/15px for
// small/large, overriding typography.button.fontSize — medium was the only size left
// alone), but both app themes now pin MuiButton.sizeSmall/sizeLarge.fontSize to match
// typography.button.fontSize explicitly (see CHANGES.md, Typography), so font-size is no
// longer part of this per-size metrics table — see getButtonFontSizePx, which reads
// the live theme instead of a hardcoded default.
//
// `theme.js` files in this codebase author their MuiButton customization via the legacy v4
// `overrides` key. Both admin-front's App.jsx and front-core's own App.jsx (used as-is by
// cabinet-front) feed that theme through `createTheme(adaptV4Theme(theme))` — and
// adaptV4Theme (@mui/material/styles/adaptV4Theme.js) rebuilds `theme.components` from
// scratch out of the legacy `overrides`/`props`/`styleOverrides` keys only, discarding
// whatever `components` block the theme.js file itself already defined. Concretely: this
// means front-core/theme.js's own `components.MuiButton.styleOverrides` (the small
// textTransform-only block near the top of the file) is dead code at runtime — only the far
// larger legacy `overrides.MuiButton` further down actually reaches the page. So
// `previewTheme.components.MuiButton.styleOverrides` is the one reliable place to read what
// each app's Button *actually* renders, for either app, instead of assuming one app's
// override shape (e.g. admin's per-color `containedPrimary`/`outlinedPrimary`/`textPrimary`/
// `textSecondary` slots) applies universally.
//
// Color is a static, always-complete reference (every variant/color combo at once — see
// getButtonColorRows), independent of the state tabs above; the ▸ marker on the row(s)
// matching the current variant+color is what ties it back to whatever's actually showing in
// the demo. Elevation is the one category that genuinely still changes per interaction
// state (and only for `contained` — text/outlined never cast a shadow), so it stays
// state-dependent below.
export const getButtonTokenItems = (variant, color, size, state, previewTheme, showStartIcon, showEndIcon) => {
  const items = [];
  const elevationTokens = [];
  const slotKey = `${variant}${capitalize(color)}`;
  const overrideSlot = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', slotKey);

  items.push({ category: 'Color', anchor: 'colors', tokens: getButtonColorRows(previewTheme, variant, color) });

  if (variant === 'contained') {
    if (state === 'disabled') {
      elevationTokens.push({ path: 'shadows[0]', note: 'flat — no shadow while disabled' });
    } else if (state === 'resting') {
      elevationTokens.push({ path: 'shadows[4]', note: 'resting' });
    } else if (state === 'hover') {
      elevationTokens.push({ path: 'shadows[4]', inheritsFrom: 'Resting', note: 'hover only swaps the background, not the shadow' });
    } else if (state === 'focus') {
      elevationTokens.push({ path: 'shadows[6]', note: 'focus-visible ring' });
    } else if (state === 'pressed') {
      elevationTokens.push({ path: 'shadows[8]', note: 'pressed/active' });
    }
  }
  if (elevationTokens.length) {
    items.push({ category: 'Elevation', tokens: elevationTokens });
  }

  const notResting = state !== 'resting' ? 'Resting' : undefined;

  items.push({
    category: 'Shape',
    anchor: 'shape',
    tokens: [{ path: 'theme.shape.borderRadius', inheritsFrom: notResting, note: `${previewTheme.shape.borderRadius}px` }]
  });

  const metrics = BUTTON_METRICS[variant][size];
  const typographyTokens = [
    {
      path: 'theme.typography.button',
      inheritsFrom: notResting,
      note: `fontSize ${previewTheme.typography.button.fontSize}, fontWeight ${previewTheme.typography.button.fontWeight}, textTransform ${previewTheme.typography.button.textTransform} — same for every size`
    }
  ];
  const sizeSlot = `size${size[0].toUpperCase()}${size.slice(1)}`;
  const sizeOverride = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', sizeSlot);
  if (sizeOverride?.fontSize !== undefined) {
    // MUI's Button.js hardcodes a *different* pxToRem() fontSize per size by default
    // (13px/15px for small/large, overriding typography.button.fontSize — medium was
    // always the one size left alone). Both app themes now add this explicit
    // sizeSmall/sizeLarge override — a function reading the theme live, not a duplicated
    // literal — specifically to cancel that default back out, so font-size is one
    // consistent "Buttons" typography across every size instead of three different ones.
    // Once resolved (see resolveMuiStyleOverride), figure out which token it actually read:
    // theme.typography.button.small/.large if that app has since opted a size into its own
    // distinct value, otherwise the shared theme.typography.button.fontSize every size
    // defaults to today.
    const perSizeKey = size === 'small' || size === 'large' ? size : null;
    const perSizeFontSize = perSizeKey ? previewTheme.typography.button[perSizeKey]?.fontSize : undefined;
    const sourcePath = perSizeFontSize !== undefined ? `theme.typography.button.${perSizeKey}.fontSize` : 'theme.typography.button.fontSize';
    typographyTokens.push({
      path: `MuiButton.${sizeSlot}`,
      status: 'overridden',
      inheritsFrom: notResting,
      note: `fontSize — function-valued override, reads ${sourcePath} live (currently ${sizeOverride.fontSize}) instead of duplicating it as a literal, so this size stays in sync automatically if the token changes`
    });
  } else {
    typographyTokens.push({
      path: 'theme.typography.button.fontSize',
      inheritsFrom: notResting,
      note: `${previewTheme.typography.button.fontSize} — medium has no size-specific override`
    });
  }

  items.push({ category: 'Typography', anchor: 'typography', tokens: typographyTokens });

  const spacingTokens = [
    {
      path: 'padding',
      status: 'other',
      inheritsFrom: notResting,
      note: `hardcoded '${metrics.padding}' in MUI's Button.js for size="${size}" — not derived from theme.spacing()`
    }
  ];
  const minHeightPx = getButtonMinHeightPx(size, previewTheme);
  if (minHeightPx !== undefined) {
    spacingTokens.push({
      path: `MuiButton.size${size[0].toUpperCase()}${size.slice(1)}`,
      status: 'overridden',
      inheritsFrom: notResting,
      note: `minHeight: ${minHeightPx}px — keeps this size's height constant whether or not the button shows an icon (see theme.js for the derivation); without it, height is content-driven and icon buttons render taller`
    });
  }

  if (variant === 'contained') {
    // Read live rather than assumed: front-core's containedPrimary/containedSecondary have
    // no marginRight at all (this quirk is admin-front-only), so this row is correctly
    // omitted entirely when running under cabinet-front instead of asserting a fact that
    // isn't true there.
    const siblingColor = color === 'primary' ? 'secondary' : 'primary';
    const siblingSlot = getResolvedMuiStyleOverride(previewTheme, 'MuiButton', `contained${capitalize(siblingColor)}`);
    const marginRight = overrideSlot?.marginRight;
    const siblingMarginRight = siblingSlot?.marginRight;
    if (marginRight !== undefined) {
      spacingTokens.push({
        path: `MuiButton.${slotKey} marginRight`,
        status: 'overridden',
        inheritsFrom: notResting,
        note:
          siblingMarginRight === undefined
            ? `hardcoded to ${marginRight}px in this app — MuiButton.contained${capitalize(siblingColor)} has no equivalent, so switching color to ${siblingColor} removes this ${marginRight}px and visibly shifts the gap to the next button`
            : `hardcoded to ${marginRight}px in this app, same as contained${capitalize(siblingColor)}`
      });
    } else if (siblingMarginRight !== undefined) {
      spacingTokens.push({
        path: `MuiButton.contained${capitalize(siblingColor)} marginRight`,
        inheritsFrom: notResting,
        note: `${siblingMarginRight}px — this app only adds the extra marginRight to contained${capitalize(siblingColor)}, not this color`
      });
    }
  }

  items.push({ category: 'Spacing', tokens: spacingTokens });

  if (showStartIcon || showEndIcon) {
    const iconMetrics = BUTTON_ICON_METRICS[size];
    const iconTokens = [
      {
        path: `MuiButton size${size[0].toUpperCase()}${size.slice(1)} icon`,
        status: 'other',
        inheritsFrom: notResting,
        note: `fontSize — hardcoded ${iconMetrics.fontSize}px in MUI's Button.js for size="${size}", independent of the button's own fontSize; shared by startIcon and endIcon`
      }
    ];
    if (showStartIcon) {
      iconTokens.push({
        path: 'MuiButton startIcon',
        status: 'other',
        inheritsFrom: notResting,
        note: `spacing — hardcoded marginRight: 8px, marginLeft: ${iconMetrics.marginLeft}px in MUI's Button.js, not theme.spacing()`
      });
    }
    if (showEndIcon) {
      iconTokens.push({
        path: 'MuiButton endIcon',
        status: 'other',
        inheritsFrom: notResting,
        note: `spacing — hardcoded marginLeft: 8px, marginRight: ${iconMetrics.endMarginRight}px in MUI's Button.js — the mirror image of startIcon's margins, not theme.spacing()`
      });
    }
    iconTokens.push({
      path: 'color: inherit',
      inheritsFrom: notResting,
      note: "icon color follows the button's own label color — no separate token, same for start and end"
    });
    items.push({ category: 'Icon', tokens: iconTokens });
  }

  return items;
};

// IconButton's own color prop is never used in this app's real code (verified above), so
// every real icon button actually renders through this chain: MUI's own
// palette.action.active default, this app's real hover/disabled overrides (if any), read
// live via getMuiStyleOverride rather than assumed — front-core and admin-front diverge here
// (front-core overrides IconButton hover via a shared MuiButtonBase rule; admin-front doesn't
// touch it at all), same reasoning as the Buttons section above.
export const getIconButtonTokenItems = (size, state, previewTheme) => {
  const metrics = ICON_BUTTON_SIZE_METRICS[size];
  const iconButtonRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiIconButton', 'root');
  const buttonBaseRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiButtonBase', 'root');
  const hoverOverride = readPseudoSlot(buttonBaseRoot, '&.MuiIconButton-root:hover');
  const disabledOverride = readPseudoSlot(iconButtonRoot, '&.Mui-disabled');
  const hoverBg = readBackground(hoverOverride);
  const notResting = state !== 'resting' ? 'Resting' : undefined;

  const colorTokens = [];
  if (state === 'resting') {
    colorTokens.push({
      path: 'palette.action.active',
      note: `icon color — ${previewTheme.palette.action.active}; real usage never passes a color prop (confirmed: 0/281 real <IconButton> instances), so this is what every icon button in this app actually renders`
    });
  } else if (state === 'hover') {
    if (hoverBg !== undefined) {
      colorTokens.push({
        path: 'MuiButtonBase.root "&.MuiIconButton-root:hover"',
        status: 'overridden',
        note: `background — hardcoded to ${hoverBg} in this app, replacing MUI's default alpha(palette.action.active, action.hoverOpacity) tint`
      });
    } else {
      colorTokens.push({
        path: 'palette.action.hoverOpacity',
        note: `background — MUI's own default hover tint, alpha(palette.action.active, ${previewTheme.palette.action.hoverOpacity}); not overridden by this app`
      });
    }
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color — unaffected by hover, only the background tints in' });
  } else if (state === 'focus') {
    colorTokens.push({
      path: 'palette.action.focusOpacity',
      note: `${previewTheme.palette.action.focusOpacity} — MUI's default keyboard focus-visible ring, not overridden by this app`
    });
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color' });
  } else if (state === 'pressed') {
    colorTokens.push({ path: 'TouchRipple', status: 'other', note: 'a transient ripple animation on press, not a static color token' });
    colorTokens.push({ path: 'palette.action.active', inheritsFrom: 'Resting', note: 'icon color' });
  } else if (state === 'disabled') {
    if (disabledOverride && disabledOverride.opacity !== undefined) {
      colorTokens.push({
        path: 'MuiIconButton.root "&.Mui-disabled"',
        status: 'overridden',
        note: `opacity — hardcoded to ${disabledOverride.opacity} in this app, layered on top of MUI's own disabled color (palette.action.disabled) rather than replacing it`
      });
    } else {
      colorTokens.push({
        path: 'palette.action.disabled',
        note: `disabled icon color — ${previewTheme.palette.action.disabled}; MUI's own default, not overridden by this app`
      });
    }
  }

  const sizeSlot = size === 'medium' ? 'MuiIconButton.root' : `MuiIconButton size${size[0].toUpperCase()}${size.slice(1)}`;

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Icon size',
      tokens: [
        {
          path: sizeSlot,
          status: 'other',
          inheritsFrom: notResting,
          note:
            `fontSize — hardcoded to theme.typography.pxToRem(${metrics.fontSize}) in MUI's IconButton.js for size="${size}", ` +
            'but only reaches the icon glyph if it\'s given fontSize="inherit" — real usage never does (confirmed: 83 real ' +
            'size="large" instances, none pair it with a matching fontSize on their child icon), so in this app the icon ' +
            "itself stays a fixed 24px regardless of size — only the button's own padding/hit-area actually changes. The " +
            'demo below uses fontSize="inherit" so the size difference is visible; toggle "Measure" in the header to see ' +
            "the real padding change even where the demo matches production and the icon doesn't visibly grow."
        }
      ]
    },
    {
      category: 'Spacing',
      anchor: 'spacing',
      tokens: [
        {
          path: sizeSlot,
          status: 'other',
          inheritsFrom: notResting,
          note: `padding — hardcoded to ${metrics.padding}px in MUI's IconButton.js for size="${size}" — not derived from theme.spacing()`
        }
      ]
    }
  ];
};
