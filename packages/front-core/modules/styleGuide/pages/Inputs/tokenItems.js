import { getResolvedMuiStyleOverride, readBackground } from '../../shared/themeIntrospection';

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

// Top-label Text field (see TopLabelTextField.jsx): every row here is a token the component
// reads directly, not a theme.components override, so values come straight off the theme.
// Size rows describe the selected size; color rows mark the active state with ▸.
export const getTopLabelInputTokenItems = (state, size, previewTheme) => {
  const { palette } = previewTheme;
  const radius = previewTheme.buttonCornerRadius?.[size];
  const missing = '— not defined in this app\'s theme (admin-only token); falls back to MUI default';

  return [
    {
      category: 'Size',
      anchor: 'spacing',
      tokens: [
        {
          path: `theme.buttonHeight.${size}`,
          value: previewTheme.buttonHeight?.[size] !== undefined ? `${previewTheme.buttonHeight[size]}px` : undefined,
          status: 'theme',
          note: previewTheme.buttonHeight ? 'Field min height — the same map MuiButton.size* minHeight reads, so a one-line field and a button of the same size line up exactly. Multi-line and chip fields grow past it.' : missing
        },
        {
          path: `theme.buttonCornerRadius.${size}`,
          value: radius !== undefined ? `${radius}px` : undefined,
          status: 'theme',
          note: radius !== undefined ? 'Corner radius — same per-size map as Button.' : missing
        },
        {
          path: `theme.buttonCornerRadius.${size} − 1 / + 7`,
          value: radius !== undefined ? `${radius - 1}px ${radius + 7}px` : undefined,
          status: 'theme',
          note: "Padding — same derivation as Outlined's own padding, so the value text starts where an Outlined button's label would. Fields with chips use a smaller, even inset instead, so one row of small chips still fits the same height."
        },
        {
          path: `theme.buttonCornerRadius.${size}`,
          value: radius !== undefined ? `${radius}px` : undefined,
          status: 'theme',
          note: "Right inset of Select's arrow and Autocomplete's clear/open buttons — the same as the field's corner radius."
        }
      ]
    },
    {
      category: 'Color',
      anchor: 'colors',
      tokens: [
        {
          path: 'palette.background.paper',
          value: palette.background.paper,
          status: 'theme',
          note: 'Fill, every state — elevation 0 (Paper\'s flat color, no overlay).'
        },
        {
          path: 'theme.borderColor',
          value: previewTheme.borderColor ?? palette.divider,
          status: 'theme',
          active: state === 'resting' || state === 'disabled',
          note: 'Border at rest and when disabled — the same line color as the sidebar/header separators.'
        },
        {
          path: 'alpha(palette.primary.main, 0.3)',
          value: palette.primary.main,
          status: 'theme',
          note: "Border on hover — Outlined button's own resting border."
        },
        {
          path: 'palette.primary.main',
          value: palette.primary.main,
          status: 'theme',
          active: state === 'focus',
          note: 'Border on focus, plus a 2px ring at 25% — the button\'s main color.'
        },
        {
          path: 'palette.error.main',
          value: palette.error.main,
          status: 'theme',
          active: state === 'error',
          note: 'Border on error (ring turns red too while focused). Helper text turns red; the label does not.'
        },
        {
          path: 'theme.typography.body1.color',
          value: previewTheme.typography.body1.color,
          status: 'theme',
          active: state !== 'disabled',
          note: 'Label — the same color in every state except disabled: it sits above the field and never moves or recolors on focus/error.'
        }
      ]
    },
    {
      category: 'Typography',
      anchor: 'typography',
      tokens: [
        { path: 'theme.typography.body2.fontSize', value: previewTheme.typography.body2.fontSize, status: 'theme', note: 'Label.' },
        {
          path: size === 'small' ? 'theme.typography.button.small.fontSize' : 'theme.typography.button.fontSize',
          value: size === 'small' ? previewTheme.typography.button.small?.fontSize ?? previewTheme.typography.button.fontSize : previewTheme.typography.button.fontSize,
          status: 'theme',
          note: "Value text — the same size as a button label at this size."
        },
        { path: 'theme.typography.caption', status: 'theme', note: 'Helper text (MUI default).' }
      ]
    }
  ];
};
