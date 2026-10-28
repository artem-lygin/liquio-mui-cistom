import { getResolvedMuiStyleOverride, describeOverridden } from '../../shared/themeIntrospection';

// Real per-app MuiSvgIcon overrides, read live via getMuiStyleOverride — front-core (→
// cabinet) has none at all, so every color here is a plain palette read. admin-front
// hardcodes literal hex for `colorPrimary`/`colorError` (unrelated to
// palette.primary.main/palette.error.main), plus a `root`-level `fill`. That `fill` only
// reaches classic @mui/icons-material icons — their <path> has no fill of its own, so it
// inherits whatever the root <svg> sets. Material Symbols paths hardcode
// fill="currentColor" (confirmed in @material-symbols-svg/react's own source), which reads
// the CSS `color` property instead and so ignores this override entirely — Material Symbols
// icons here fall through to inherited text color regardless of `root.fill`.
export const getIconLibraryTokenItems = (color, size, previewTheme) => {
  const svgIconRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiSvgIcon', 'root');
  const colorSlot = color === 'primary' ? 'colorPrimary' : color === 'error' ? 'colorError' : null;
  const colorOverride = colorSlot ? getResolvedMuiStyleOverride(previewTheme, 'MuiSvgIcon', colorSlot) : null;

  const colorTokens = [];
  if (color === 'inherit') {
    const rootColor = svgIconRoot?.color;
    const rootFill = svgIconRoot?.fill;
    if (rootColor !== undefined) {
      colorTokens.push({ path: 'MuiSvgIcon.root', status: 'overridden', note: `color — hardcoded to ${rootColor} in this app` });
    } else if (rootFill !== undefined) {
      colorTokens.push({
        path: 'MuiSvgIcon.root',
        status: 'other',
        note: `fill — hardcoded to ${rootFill} in this app; only reaches classic @mui/icons-material icons (see this category's intro), not Material Symbols`
      });
      colorTokens.push({ path: 'palette.text.primary', note: `inherited text color — ${previewTheme.palette.text.primary}; what Material Symbols icons actually use here` });
    } else {
      colorTokens.push({ path: 'palette.text.primary', note: `inherited text color — ${previewTheme.palette.text.primary}; not overridden by this app` });
    }
  } else {
    const paletteMain = previewTheme.palette[color].main;
    const overrideColor = colorOverride?.color;
    if (overrideColor !== undefined) {
      colorTokens.push({
        path: `MuiSvgIcon.${colorSlot}`,
        status: 'overridden',
        note: describeOverridden('color', overrideColor, paletteMain, `palette.${color}.main`)
      });
    } else {
      colorTokens.push({ path: `palette.${color}.main`, note: `color — ${paletteMain}` });
    }
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Icon size',
      anchor: 'typography',
      tokens: [
        {
          path: 'theme.typography.pxToRem',
          note: `${size} — MuiSvgIcon derives its fontSize from theme.typography.pxToRem(${{ small: 20, medium: 24, large: 35 }[size]}), unlike Button/IconButton's hardcoded icon sizes — this one genuinely scales with the app's typography settings`
        }
      ]
    },
    {
      category: 'Package',
      tokens: [
        {
          path: '@material-symbols-svg/react/rounded/w400',
          status: 'other',
          note: 'Rounded, weight 400, filled — settled config for this app, chosen at import time per icon (see CHANGES.md)'
        }
      ]
    }
  ];
};
