import { getResolvedMuiStyleOverride, readBackground, resolveComponentColorRow } from '../../shared/themeIntrospection';

// Builds TokenLegend items for a text field in one specific interaction state. TextField
// defaults to variant="outlined" in MUI v5 (confirmed in @mui/material/TextField/TextField.js),
// which matters here: front-core's MuiInputBase.input disabled override is scoped to
// "&.MuiInput-input.Mui-disabled" — the Standard/underline variant's class only — so on
// cabinet-front it silently never applies to this (outlined) demo field; confirmed live via
// getComputedStyle, the disabled value text there actually renders palette.text.disabled
// (MUI's own default), while the disabled label still gets front-core's own MuiFormLabel
// override (which isn't variant-scoped) — two different colors, not the same one. admin-front's
// override has no such variant qualifier, so both apply there and do share one literal. Read
// live via getMuiStyleOverride rather than assuming one app's shape (and un-scoped selector)
// holds for the other. No MuiOutlinedInput/MuiFormLabel "&.Mui-focused" or "&.Mui-error" rule
// exists in either app's theme.js, so focus/error colors are MUI's own unmodified defaults.
export const readDisabledOverride = (styleObj) => {
  if (!styleObj) {
    return { applies: false };
  }
  if (styleObj['&.Mui-disabled']) {
    return { applies: true, value: styleObj['&.Mui-disabled'] };
  }
  const scopedKey = Object.keys(styleObj).find((key) => key !== '&.Mui-disabled' && /Mui-disabled/.test(key));
  return scopedKey ? { applies: false, scopedKey, value: styleObj[scopedKey] } : { applies: false };
};

// Input tokens: just the value text color at rest — the one color fact resting state
// actually establishes (see getInputTokenItems); focus/error/disabled colors live in
// the Inputs demo's own contextual properties panel.
// Every state's color facts (resting/focus/error/disabled) as static rows, independent of
// the state tabs above — the ▸ marker on the row(s) matching activeState is what ties this
// back to what's actually showing in the demo.
// Covers every color-bearing part of a Text field — Label, Input value text, Border
// (OutlinedInput's notched outline), and Helper text — not just the input value color. Two
// non-obvious mechanisms, both confirmed by resolving each app's real theme through
// adaptV4Theme()+createTheme() rather than reasoning from theme.js source alone:
// - FormLabel.js/FormHelperText.js (MUI source) both set a sensible resting default
//   (palette.text.secondary) *then* spread theme.typography.body1/.caption afterwards — so
//   when a typography variant defines its own `color` (both apps' body1/caption do), that
//   literal silently wins over the documented default. InputBase.js does the opposite order
//   (color set *after* the typography spread), which is why the input value text itself
//   isn't affected by the same thing.
// - admin-front's MuiFormLabel.root also carries an unconditional `opacity` (every state, not
//   just one), further dimming whatever color actually applies.
export const getInputColorRows = (previewTheme, activeState) => {
  const rows = [];
  const formLabelRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiFormLabel', 'root');
  const formHelperTextRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiFormHelperText', 'root');
  const labelOpacity = formLabelRoot?.opacity;

  // Label — RedditTextField (see its own component file) no longer touches label color at
  // all (a red-while-empty override was tried and removed at the product designer's
  // direction: clearing a field shouldn't read as an error), so these are the same plain
  // facts that apply to any Text field, Reddit-styled or not.
  rows.push({
    path: 'theme.typography.body1',
    value: previewTheme.typography.body1.color,
    status: 'other',
    active: activeState === 'resting',
    note:
      "Label at rest — not palette.text.secondary as MUI's FormLabel.js default would suggest: it spreads theme.typography.body1 in *after* that default, so body1's own color (both apps define one) silently wins." +
      (labelOpacity !== undefined ? ` This app also applies MuiFormLabel.root opacity: ${labelOpacity} unconditionally (every state), further dimming it.` : '')
  });
  rows.push({
    path: 'palette.primary.main',
    value: previewTheme.palette.primary.main,
    status: 'theme',
    active: activeState === 'focus',
    note: "Label on focus — MUI's own default (&.Mui-focused), not overridden by this app."
  });
  rows.push({
    path: 'palette.error.main',
    value: previewTheme.palette.error.main,
    status: 'theme',
    active: activeState === 'error',
    note: "Label on error — MUI's own default, not overridden by this app."
  });
  const labelDisabled = readDisabledOverride(formLabelRoot);
  rows.push(
    labelDisabled.applies && labelDisabled.value?.color !== undefined
      ? {
          path: 'MuiFormLabel.root "&.Mui-disabled"',
          value: labelDisabled.value.color,
          status: 'overridden',
          active: activeState === 'disabled',
          note: 'Label on disabled — hardcoded in this app.'
        }
      : {
          path: 'palette.text.disabled',
          value: previewTheme.palette.text.disabled,
          status: 'theme',
          active: activeState === 'disabled',
          note: "Label on disabled — MUI's own default, not overridden by this app."
        }
  );

  // Input value text
  const restingRow = resolveComponentColorRow({
    label: 'Input value text (resting)',
    overrideValue: getResolvedMuiStyleOverride(previewTheme, 'MuiInputBase', 'input')?.color,
    overridePath: 'MuiInputBase.input',
    rootValue: undefined,
    rootPath: undefined,
    paletteValue: previewTheme.palette.text.primary,
    palettePath: 'palette.text.primary'
  });
  if (restingRow) rows.push({ ...restingRow, active: activeState === 'resting' });

  const inputDisabled = readDisabledOverride(getResolvedMuiStyleOverride(previewTheme, 'MuiInputBase', 'input'));
  if (inputDisabled.applies && inputDisabled.value?.color !== undefined) {
    rows.push({
      path: 'MuiInputBase.input "&.Mui-disabled"',
      value: inputDisabled.value.color,
      status: 'overridden',
      active: activeState === 'disabled',
      note: 'Value text on disabled — hardcoded in this app, not palette.text.disabled.'
    });
  } else if (inputDisabled.scopedKey) {
    rows.push({
      path: `MuiInputBase.input "${inputDisabled.scopedKey}"`,
      value: previewTheme.palette.text.disabled,
      status: 'other',
      active: activeState === 'disabled',
      note: "Value text on disabled — this override only targets the Standard/underline variant's class, not the Outlined variant this app's TextField actually uses, so it never applies — falls through to palette.text.disabled instead."
    });
  } else {
    rows.push({
      path: 'palette.text.disabled',
      value: previewTheme.palette.text.disabled,
      status: 'theme',
      active: activeState === 'disabled',
      note: "Value text on disabled — MUI's own default, not overridden by this app."
    });
  }

  // Fill + border — RedditTextField's own scoped "& .MuiFilledInput-root" rule (no notched
  // outline, unlike the old OutlinedInput-based facts this replaces). Not a theme.components
  // override, so these read straight off theme.buttonHoverBg/theme.borderColor/palette.* —
  // the same tokens RedditTextField's own styled() callback uses.
  rows.push({
    path: 'RedditTextField "& .MuiFilledInput-root"',
    value: previewTheme.buttonHoverBg,
    status: 'overridden',
    active: activeState === 'resting',
    note: "Fill at rest — theme.buttonHoverBg, the same key this app already uses for button/sidebar hover fills, not a new literal. Not a universally safe reuse, though: cabinet-front's own buttonHoverBg is a bright yellow (#ffe565) serving a different purpose there, not just a different shade of the same idea — this demo likely looks broken, not just differently themed, under cabinet."
  });
  rows.push({
    path: 'RedditTextField "& .MuiFilledInput-root"',
    value: previewTheme.borderColor,
    status: 'overridden',
    active: activeState === 'resting',
    note: 'Border at rest — theme.borderColor, the same line color the sidebar/header separators use (see Layout section above), not a new literal.'
  });
  rows.push({
    path: 'RedditTextField "& .MuiFilledInput-root:hover"',
    value: previewTheme.palette.background.paper,
    status: 'overridden',
    note: "Fill on hover — goes transparent, revealing palette.background.paper (the page behind it) as a darken-on-hover cue; border color doesn't change on hover (matching MUI's own Reddit-input reference)."
  });
  rows.push({
    path: 'RedditTextField "& .MuiFilledInput-root.Mui-focused"',
    value: previewTheme.palette.primary.main,
    status: 'overridden',
    active: activeState === 'focus',
    note: 'Border + a 2px alpha(primary.main, 0.25) focus ring on focus — reads the same palette.primary.main as the label above (two independent reads of the same token, not one shared implementation); fill also goes transparent here, same as hover.'
  });
  rows.push({
    path: 'RedditTextField "& .MuiFilledInput-root.Mui-error"',
    value: previewTheme.palette.error.main,
    status: 'overridden',
    active: activeState === 'error',
    note: 'Border on error — reads palette.error.main, declared after &.Mui-focused so it wins when a field is both focused and invalid.'
  });
  rows.push({
    active: activeState === 'disabled',
    note: "Border/fill on disabled — still not handled: there's no \"&.Mui-disabled\" rule here, matching MUI's own Reddit-input reference (which doesn't address it either). A disabled field's border and fill currently look identical to resting — only the label and helper text show the disabled color."
  });

  // Helper text
  if (formHelperTextRoot?.color !== undefined) {
    rows.push({
      path: 'MuiFormHelperText.root',
      value: formHelperTextRoot.color,
      status: 'overridden',
      active: activeState === 'resting',
      note: 'Helper text at rest — hardcoded in this app (overrides whatever theme.typography.caption.color would otherwise win, via the same spread-order mechanism as Label above).'
    });
  } else {
    rows.push({
      path: 'theme.typography.caption',
      value: previewTheme.typography.caption.color,
      status: 'other',
      active: activeState === 'resting',
      note: "Helper text at rest — same mechanism as Label: FormHelperText.js's own palette.text.secondary default is overwritten by theme.typography.caption's own color, since no override exists in this app."
    });
  }
  rows.push({
    path: 'palette.error.main',
    value: previewTheme.palette.error.main,
    status: 'theme',
    active: activeState === 'error',
    note: "Helper text on error — MUI's own default, not overridden by this app."
  });
  rows.push({
    path: 'palette.text.disabled',
    value: previewTheme.palette.text.disabled,
    status: 'theme',
    active: activeState === 'disabled',
    note: "Helper text on disabled — MUI's own default, not overridden by this app."
  });

  return rows;
};

export const getInputTokenItems = (state, previewTheme) => {
  const notResting = state !== 'resting' ? 'Resting' : undefined;

  return [
    { category: 'Color', anchor: 'colors', tokens: getInputColorRows(previewTheme, state) },
    {
      category: 'Typography',
      anchor: 'typography',
      tokens: [
        {
          path: 'theme.typography.body1',
          inheritsFrom: notResting,
          note: `Label — shares body1 with the input value text below, but FormLabel.js hardcodes lineHeight: 1.4375em after spreading it (confirmed in source), overriding body1's own lineHeight (${previewTheme.typography.body1.lineHeight} in this app).`
        },
        { path: 'theme.typography.body1', inheritsFrom: notResting, note: 'Input value text.' },
        {
          path: 'theme.typography.caption',
          inheritsFrom: notResting,
          note: "Helper text — a different variant from the label/input text above, not body1 (confirmed in FormHelperText.js)."
        }
      ]
    },
    {
      category: 'Spacing',
      anchor: 'spacing',
      tokens: [
        {
          path: 'theme.spacing',
          inheritsFrom: notResting,
          note: `unit: ${previewTheme.spacing(1)}, field height/margins`
        }
      ]
    }
  ];
};

// adaptV4Theme() only renames v4's overrides/props slot *keys* (e.g. root → styleOverrides.
// root) — it does NOT translate a nested JSS "$ruleName" class reference inside a slot's own
// style object. admin-front's MuiFormControlLabel.label still writes the v4 form
// ("&$disabled"), which survives adaptV4Theme() unchanged and so never matches v5's actual
// ".Mui-disabled" class — confirmed by resolving admin-front's real theme through
// adaptV4Theme()+createTheme() and inspecting the result: the key comes out as the literal
// string "&$disabled", not "&.Mui-disabled". front-core writes the v5 form directly and
// resolves correctly. This distinguishes that dead-but-present override from no override at
// all — readDisabledOverride (above) can't do this since its own "Mui-disabled" substring
// check doesn't match "$disabled" either.
export const readLegacyDisabledOverride = (styleObj) => {
  if (!styleObj) {
    return { applies: false };
  }
  if (styleObj['&.Mui-disabled']) {
    return { applies: true, value: styleObj['&.Mui-disabled'] };
  }
  if (styleObj['&$disabled']) {
    return { applies: false, dead: true, value: styleObj['&$disabled'] };
  }
  return { applies: false };
};

// Autocomplete renders a TextField internally (via renderInput), so its input chrome,
// typography and spacing are identical to Text field's — the one place the two apps
// actually diverge is MuiAutocomplete itself, which only admin-front defines at all
// (inputRoot background, popup paper margin, noOptions/loading text color); front-core has
// no MuiAutocomplete override, so cabinet-front's Autocomplete popup/input are plain MUI
// defaults. admin-front's inputRoot background is a *separate* slot from Text field's
// MuiOutlinedInput.root (both apply to the same rendered surface, since Autocomplete wraps
// a real variant="outlined" TextField) — kept in sync via the same INPUT_SURFACE_LIGHTEN
// constant in theme.js, not one shared CSS rule.
export const getAutocompleteTokenItems = (previewTheme) => {
  const inputRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiAutocomplete', 'inputRoot');
  const noOptions = getResolvedMuiStyleOverride(previewTheme, 'MuiAutocomplete', 'noOptions');

  const colorRows = [
    inputRoot?.backgroundColor !== undefined
      ? {
          path: 'MuiAutocomplete.inputRoot',
          value: inputRoot.backgroundColor,
          status: 'overridden',
          note: 'Input background — derived from palette.background.paper (lighten(), same computation as Text field\'s MuiOutlinedInput.root, see INPUT_SURFACE_LIGHTEN in theme.js), not a standalone literal.'
        }
      : {
          path: 'palette.background.paper',
          value: previewTheme.palette.background.paper,
          status: 'theme',
          note: 'Input background — no MuiAutocomplete override here, same Outlined chrome as Text field.'
        },
    {
      path: 'palette.background.paper',
      value: previewTheme.palette.background.paper,
      status: 'theme',
      note: "Popup listbox surface — MUI's own Paper default; neither app repaints it."
    }
  ];
  if (noOptions?.color !== undefined) {
    colorRows.push({
      path: 'MuiAutocomplete.noOptions',
      value: noOptions.color,
      status: 'overridden',
      note: '"No options" / loading text — hardcoded in this app, not palette.text.secondary.'
    });
  }

  return [
    { category: 'Color', anchor: 'colors', tokens: colorRows },
    {
      category: 'Typography',
      anchor: 'typography',
      tokens: [{ path: 'theme.typography.body1', note: 'Same input text styling as Text field — Autocomplete renders a TextField internally.' }]
    },
    {
      category: 'Spacing',
      anchor: 'spacing',
      tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}, shared with Text field's own field height/margins` }]
    }
  ];
};

// Select defaults to variant="outlined" internally (same as TextField, confirmed in
// Select.js) — so a Select with no dedicated MuiSelect override falls through to the same
// MuiOutlinedInput override Text field uses. front-core instead fully reskins Select via its
// own MuiSelect.root: a flat background plus an explicit, standalone type scale
// (fontSize/fontWeight/lineHeight/letterSpacing) that references no theme.typography variant
// at all — the exact "second literal, not a derived value" pattern this project's theme work
// is meant to catch, just for a whole component's typography rather than one property.
export const getComboBoxTokenItems = (previewTheme) => {
  const selectRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiSelect', 'root');
  const outlinedRoot = getResolvedMuiStyleOverride(previewTheme, 'MuiOutlinedInput', 'root');
  const selectBg = readBackground(selectRoot);

  const colorRows = [];
  if (selectBg !== undefined) {
    colorRows.push({
      path: 'MuiSelect.root',
      value: selectBg,
      status: 'overridden',
      note: 'Closed-state background — hardcoded in this app, no matching palette token.'
    });
  } else if (outlinedRoot?.backgroundColor !== undefined) {
    colorRows.push({
      path: 'MuiOutlinedInput.root',
      value: outlinedRoot.backgroundColor,
      status: 'other',
      note: 'Closed-state background — no MuiSelect override here, so this falls through to the same MuiOutlinedInput override Text field uses (Select defaults to variant="outlined").'
    });
  } else {
    colorRows.push({
      path: 'palette.background.paper',
      value: previewTheme.palette.background.paper,
      status: 'theme',
      note: 'Closed-state background — no override on either slot.'
    });
  }

  const typographyTokens =
    selectRoot?.fontSize !== undefined
      ? [
          {
            path: 'MuiSelect.root',
            status: 'overridden',
            note: `Hardcoded to ${selectRoot.fontSize}px / weight ${selectRoot.fontWeight} / line-height ${selectRoot.lineHeight} — a standalone type scale, not a reference to theme.typography.body1 or any other named variant.`
          }
        ]
      : [{ path: 'theme.typography.body1', note: 'No MuiSelect typography override here — same as Text field.' }];

  const spacingTokens =
    selectRoot?.padding !== undefined
      ? [{ path: 'MuiSelect.root', status: 'overridden', note: `Hardcoded padding (${selectRoot.padding}) and box-sizing, not theme.spacing().` }]
      : [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}` }];

  return [
    { category: 'Color', anchor: 'colors', tokens: colorRows },
    { category: 'Typography', anchor: 'typography', tokens: typographyTokens },
    { category: 'Spacing', anchor: 'spacing', tokens: spacingTokens }
  ];
};

// Checked color is MUI's own unmodified default color="primary" in both apps (confirmed in
// Checkbox.js) — neither overrides it. Disabled and the adjoining FormControlLabel are where
// the two apps actually diverge, including a dead override: admin-front's
// MuiFormControlLabel.label disabled color is written in v4's "&$disabled" form, which
// survives adaptV4Theme() untranslated and so never matches v5's ".Mui-disabled" class (see
// readLegacyDisabledOverride) — a real, currently-inert override, not merely "no override".
export const getCheckboxRadioColorRows = (previewTheme, component, hoverSelector, disabledLabel) => {
  const rootDisabled = readDisabledOverride(getResolvedMuiStyleOverride(previewTheme, component, 'root'));
  const hoverOverride = getResolvedMuiStyleOverride(previewTheme, 'MuiButtonBase', 'root')?.[hoverSelector];
  const labelDisabled = readLegacyDisabledOverride(getResolvedMuiStyleOverride(previewTheme, 'MuiFormControlLabel', 'label'));

  const rows = [
    {
      path: 'palette.primary.main',
      value: previewTheme.palette.primary.main,
      status: 'theme',
      note: `Checked — MUI's own default color="primary" on ${disabledLabel}, not overridden by this app.`
    }
  ];

  rows.push(
    rootDisabled.applies
      ? {
          path: `${component}.root "&.Mui-disabled"`,
          value: rootDisabled.value.color,
          status: 'overridden',
          note: 'Disabled icon — hardcoded in this app, not palette.action.disabled.'
        }
      : {
          path: 'palette.action.disabled',
          value: previewTheme.palette.action.disabled,
          status: 'theme',
          note: `Disabled icon — MUI's own default (confirmed in ${component.replace('Mui', '')}.js), not overridden by this app.`
        }
  );

  rows.push(
    hoverOverride?.backgroundColor !== undefined
      ? {
          path: `MuiButtonBase.root "${hoverSelector}"`,
          value: hoverOverride.backgroundColor,
          status: 'overridden',
          note: "Hover fill — a flat hardcoded color, replacing MUI's own built-in alpha(color, action.hoverOpacity) tint. The same literal also appears, independently, on Checkbox/Radio/Switch's own hover selectors here — one value duplicated three times rather than derived once."
        }
      : {
          path: 'palette.action.hoverOpacity',
          value: previewTheme.palette.action.hoverOpacity,
          status: 'theme',
          note: "Hover fill — MUI's own built-in tint (alpha of the control's own color against action.hoverOpacity), not overridden by this app."
        }
  );

  rows.push(
    labelDisabled.applies
      ? {
          path: 'MuiFormControlLabel.label "&.Mui-disabled"',
          value: labelDisabled.value.color,
          status: 'overridden',
          note: 'Disabled label text — hardcoded here, independent of the control color above.'
        }
      : labelDisabled.dead
        ? {
            path: 'MuiFormControlLabel.label "&$disabled"',
            value: previewTheme.palette.text.disabled,
            status: 'other',
            note: `Disabled label text — this app writes a v4-style "&$disabled" override (would-be color ${labelDisabled.value.color}), but adaptV4Theme() never translates that selector, so it silently never applies — falls through to palette.text.disabled instead.`
          }
        : {
            path: 'palette.text.disabled',
            value: previewTheme.palette.text.disabled,
            status: 'theme',
            note: "Disabled label text — MUI's own default, not overridden by this app."
          }
  );

  return rows;
};

export const getCheckboxTokenItems = (previewTheme) => [
  { category: 'Color', anchor: 'colors', tokens: getCheckboxRadioColorRows(previewTheme, 'MuiCheckbox', '&.MuiCheckbox-root:hover', 'Checkbox') },
  { category: 'Typography', anchor: 'typography', tokens: [{ path: 'theme.typography.body1', note: "The adjoining FormControlLabel's own label text." }] },
  { category: 'Spacing', anchor: 'spacing', tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}` }] }
];

export const getRadioTokenItems = (previewTheme) => [
  { category: 'Color', anchor: 'colors', tokens: getCheckboxRadioColorRows(previewTheme, 'MuiRadio', '&.MuiRadio-root:hover', 'Radio') },
  { category: 'Typography', anchor: 'typography', tokens: [{ path: 'theme.typography.body1', note: "The adjoining FormControlLabel's own label text." }] },
  { category: 'Spacing', anchor: 'spacing', tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}` }] }
];

// Switch dims its disabled state with opacity (thumb 0.5, track 0.12/0.2 by mode — confirmed
// in Switch.js) rather than swapping to palette.action.disabled the way Checkbox/Radio do, so
// it gets its own color-rows function rather than sharing getCheckboxRadioColorRows.
export const getSwitchTokenItems = (previewTheme) => {
  const hoverOverride = getResolvedMuiStyleOverride(previewTheme, 'MuiButtonBase', 'root')?.['&.MuiSwitch-switchBase.Mui-checked:hover'];
  const labelDisabled = readLegacyDisabledOverride(getResolvedMuiStyleOverride(previewTheme, 'MuiFormControlLabel', 'label'));

  const colorRows = [
    {
      path: 'palette.primary.main',
      value: previewTheme.palette.primary.main,
      status: 'theme',
      note: 'Checked thumb/track — MUI\'s own default color="primary", not overridden by this app.'
    },
    {
      path: 'theme.palette.mode',
      value: previewTheme.palette.mode,
      status: 'theme',
      note: `Disabled — MUI dims via opacity, not a color swap (thumb 0.5; track 0.12 in light mode / 0.2 in dark mode, confirmed in Switch.js) — not overridden by this app.`
    },
    hoverOverride?.backgroundColor !== undefined
      ? {
          path: 'MuiButtonBase.root "&.MuiSwitch-switchBase.Mui-checked:hover"',
          value: hoverOverride.backgroundColor,
          status: 'overridden',
          note: 'Checked hover fill — the same hardcoded literal also used, independently, for Checkbox/Radio hover above.'
        }
      : {
          path: 'palette.action.hoverOpacity',
          value: previewTheme.palette.action.hoverOpacity,
          status: 'theme',
          note: "Checked hover fill — MUI's own built-in tint, not overridden by this app."
        },
    labelDisabled.dead
      ? {
          path: 'MuiFormControlLabel.label "&$disabled"',
          value: previewTheme.palette.text.disabled,
          status: 'other',
          note: `Disabled label text — this app's "&$disabled" override (would-be color ${labelDisabled.value.color}) never applies under adaptV4Theme(); falls through to palette.text.disabled.`
        }
      : labelDisabled.applies
        ? {
            path: 'MuiFormControlLabel.label "&.Mui-disabled"',
            value: labelDisabled.value.color,
            status: 'overridden',
            note: 'Disabled label text — hardcoded here.'
          }
        : {
            path: 'palette.text.disabled',
            value: previewTheme.palette.text.disabled,
            status: 'theme',
            note: "Disabled label text — MUI's own default, not overridden by this app."
          }
  ];

  return [
    { category: 'Color', anchor: 'colors', tokens: colorRows },
    { category: 'Typography', anchor: 'typography', tokens: [{ path: 'theme.typography.body1', note: "The adjoining FormControlLabel's own label text." }] },
    { category: 'Spacing', anchor: 'spacing', tokens: [{ path: 'theme.spacing', note: `unit: ${previewTheme.spacing(1)}` }] }
  ];
};
