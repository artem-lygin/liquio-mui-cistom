import { getResolvedMuiStyleOverride, describeOverridden } from '../../shared/themeIntrospection';

// Chip's color/typography facts differ structurally between the two apps: front-core (→
// cabinet-front) overrides MuiChip.root (height, fontSize, label color, textTransform) and
// filledError.color; admin-front defines no MuiChip override at all, so its Chip renders with
// MUI's own untouched 32px/13px defaults. Read live rather than asserting one app's facts (or
// MUI's own defaults) as if they held for both — confirmed live via the mounted theme object.
export const getChipTokenItems = (previewTheme) => {
  const chipRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiChip', 'root');
  const overrideColor = chipRoot?.color;
  const overrideFontSize = chipRoot?.fontSize;
  const overrideHeight = chipRoot?.height;

  const colorTokens = [
    { path: 'palette.primary.main', note: 'colored variant' },
    { path: 'palette.error.main', note: 'colored variant' },
    { path: 'palette.grey', note: 'default fill' }
  ];
  if (overrideColor !== undefined) {
    colorTokens.push({
      path: 'MuiChip.root',
      status: 'overridden',
      note: describeOverridden('default/grey label text', overrideColor, previewTheme.palette.text.primary, 'palette.text.primary')
    });
  } else {
    colorTokens.push({ path: 'palette.text.primary', note: `default/grey label text — ${previewTheme.palette.text.primary}` });
  }

  const typographyTokens = [
    overrideFontSize !== undefined
      ? {
          path: 'MuiChip.root',
          status: 'overridden',
          note: `font size — hardcoded to ${overrideFontSize}px in this app, overriding MUI's own default 13px Chip font size`
        }
      : { path: 'theme.typography.fontFamily', note: "font size is a fixed 13px (MUI's own Chip.js default), not a named variant" }
  ];

  const spacingTokens = [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}, height/padding` }];
  if (overrideHeight !== undefined) {
    spacingTokens.push({
      path: 'MuiChip.root',
      status: 'overridden',
      note: `height — hardcoded to ${overrideHeight}px in this app, overriding MUI's own default 32px Chip height`
    });
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorTokens },
    {
      category: 'Shape',
      anchor: 'shape',
      tokens: [{ path: 'theme.shape.borderRadius', status: 'other', note: '— not used; Chip hardcodes a fixed 16px pill radius instead' }]
    },
    { category: 'Typography', anchor: 'typography', tokens: typographyTokens },
    { category: 'Spacing', anchor: 'spacing', tokens: spacingTokens }
  ];
};
