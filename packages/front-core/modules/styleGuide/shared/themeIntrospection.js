export const getMuiStyleOverride = (previewTheme, component, slot) => previewTheme.components?.[component]?.styleOverrides?.[slot] || null;

// A styleOverrides slot can be a plain object or a function `({ theme, ownerState }) =>
// object` — MUI v5's documented shape for a style override that reads the live theme
// instead of duplicating a value as a literal (see MuiButton.sizeSmall/sizeLarge in both
// theme.js files, and CHANGES.md's Typography section). Resolve either shape to a plain
// object before reading properties off it. `ownerState` defaults to `{}` — fine for an
// override that only reads `theme`, but one that branches on e.g. `ownerState.variant`
// (MuiInputLabel's "Reddit style" override) needs the real shape passed in explicitly, or
// every property read off it is `undefined` and any direct access (not optional-chained)
// throws instead of just resolving to "no override here".
export const resolveMuiStyleOverride = (override, previewTheme, ownerState = {}) =>
  typeof override === 'function' ? override({ theme: previewTheme, ownerState }) : override;

// getMuiStyleOverride + resolveMuiStyleOverride, combined — the two were almost always
// called together anyway. Every color-bearing read in this file should go through this
// (not the bare getMuiStyleOverride) so a slot that gets converted to a function-valued
// override later — the "properly tokenized" fix, e.g. reading theme.palette.primary.main
// live instead of duplicating it as a literal — keeps reading correctly here instead of
// silently misreporting it as unset.
export const getResolvedMuiStyleOverride = (previewTheme, component, slot, ownerState) =>
  resolveMuiStyleOverride(getMuiStyleOverride(previewTheme, component, slot), previewTheme, ownerState);

export const readBackground = (styleObj) => (styleObj ? (styleObj.background !== undefined ? styleObj.background : styleObj.backgroundColor) : undefined);

export const readPseudoSlot = (styleObj, ...keys) => {
  if (!styleObj) return null;
  for (const key of keys) {
    if (styleObj[key]) return styleObj[key];
  }
  return null;
};

// Phrases a color/background fact as either "this app's literal happens to equal the
// current theme value" (a silent-drift risk, not a real visual difference) or a genuine
// override — rather than assuming every override actually diverges from the palette.
export const describeOverridden = (kind, overrideVal, themeVal, themePath) =>
  overrideVal === themeVal
    ? `${kind} — hardcodes ${overrideVal} here too, duplicating ${themePath}'s own current value; no visual difference today, but the two are independent literals that would silently diverge if either changed alone`
    : `${kind} — overridden to ${overrideVal} in this app; theme value is ${themeVal}`;

// Builds one ComponentColorTable row for a single color-bearing property, given the same
// three places every contextual color legend in this file already checks in order: this
// app's own override on the specific slot, then a hardcoded fallback on a shared root slot
// that would apply regardless of what's being asked for, then the live palette value.
// Returns null when none of the three actually apply (nothing to show).
export const resolveComponentColorRow = ({ label, overrideValue, overridePath, rootValue, rootPath, paletteValue, palettePath }) => {
  if (overrideValue !== undefined) {
    return {
      path: overridePath,
      value: overrideValue,
      status: 'overridden',
      note:
        paletteValue !== undefined
          ? overrideValue === paletteValue
            ? `${label} — duplicates ${palettePath}'s current value as a literal; would silently diverge if either changes alone.`
            : `${label} — overridden here; ${palettePath} is ${paletteValue}.`
          : `${label} — hardcoded in this app, no matching palette token.`
    };
  }
  if (rootValue !== undefined) {
    return {
      path: rootPath,
      value: rootValue,
      status: 'other',
      note: `${label} — hardcoded on ${rootPath}, applies to every instance regardless of color/variant${palettePath ? `; ${palettePath} (${paletteValue}) is never reached` : ''}.`
    };
  }
  if (paletteValue !== undefined) {
    return { path: palettePath, value: paletteValue, status: 'theme', note: `${label} — read live, no override.` };
  }
  return null;
};
