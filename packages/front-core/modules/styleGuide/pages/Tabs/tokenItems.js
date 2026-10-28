import { getResolvedMuiStyleOverride, readBackground, resolveComponentColorRow } from '../../shared/themeIntrospection';

// Tabs tokens: unselected label color, plus whatever the selected state actually changes
// (label color, or just background if the app leaves the label alone) — mirrors
// getTabsTokenItems' own resting-state logic above.
const getTabsColorRows = (previewTheme) => {
  const rows = [];
  const tabRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiTab', 'root') || {};
  const tabTextColorInherit = getResolvedMuiStyleOverride(previewTheme, 'MuiTab', 'textColorInherit');
  const unselectedColor = tabTextColorInherit?.color ?? tabRoot.color;
  const unselectedPath = tabTextColorInherit?.color !== undefined ? 'MuiTab.textColorInherit' : 'MuiTab.root';
  const unselectedRow = resolveComponentColorRow({
    label: 'Tab label (unselected)',
    overrideValue: unselectedColor,
    overridePath: unselectedPath,
    rootValue: undefined,
    rootPath: undefined,
    paletteValue: previewTheme.palette.text.secondary,
    palettePath: 'palette.text.secondary'
  });
  if (unselectedRow) rows.push(unselectedRow);

  const selectedFromTextColorInherit = tabTextColorInherit?.['&.Mui-selected'];
  const selectedFromRoot = tabRoot['&.Mui-selected'];
  const selectedSlot = selectedFromTextColorInherit || selectedFromRoot;
  const selectedSlotPath = selectedFromTextColorInherit ? 'MuiTab.textColorInherit "&.Mui-selected"' : 'MuiTab.root "&.Mui-selected"';
  if (selectedSlot?.color !== undefined) {
    rows.push({
      path: selectedSlotPath,
      value: selectedSlot.color,
      status: 'overridden',
      note: 'Tab label (selected) — hardcoded in this app, no matching palette token.'
    });
  } else {
    const selectedBg = readBackground(selectedSlot);
    if (selectedBg !== undefined) {
      rows.push({
        path: selectedSlotPath,
        value: selectedBg,
        status: 'overridden',
        note: 'Tab background (selected) — hardcoded in this app; label color stays the same as unselected.'
      });
    }
  }

  return rows;
};

// Tab's unselected/selected label color is authored completely differently between the two
// apps: admin-front overrides MuiTab.textColorInherit (an unconditional label color, swapped
// for a different literal on "&.Mui-selected"); front-core (→ cabinet-front) instead overrides
// MuiTab.root (an unconditional label color that "&.Mui-selected" never touches — only the
// background changes there). Read live rather than assuming one app's override slot/shape
// applies to the other.
export const getTabsTokenItems = (previewTheme) => {
  const tabRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiTab', 'root') || {};
  const textTransformOverride = tabRoot.textTransform;
  const typographyTokens = [
    {
      path: 'theme.typography.button',
      note: `fontWeight ${previewTheme.typography.button.fontWeight}, fontSize ${previewTheme.typography.button.fontSize} — MuiTab reads these unless overridden below`
    }
  ];
  if (textTransformOverride !== undefined) {
    typographyTokens.push({
      path: 'MuiTab.root',
      status: 'overridden',
      note: `textTransform — hardcoded to "${textTransformOverride}" in this app, overriding typography.button.textTransform ("${previewTheme.typography.button.textTransform}")`
    });
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: getTabsColorRows(previewTheme) },
    { category: 'Typography', anchor: 'typography', tokens: typographyTokens },
    { category: 'Spacing', anchor: 'spacing', tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}, indicator height/padding` }] }
  ];
};
