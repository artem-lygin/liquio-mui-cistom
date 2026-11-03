import React from 'react';
import { FormControl, InputLabel, InputBase, FormHelperText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Top-label Text field: an input designed from Button / Primary's own tokens rather than
// MUI's outlined/filled defaults. Built the way MUI's own docs build a label-above input
// (mui.com/material-ui/react-text-field → "Customized inputs" → BootstrapInput):
// FormControl + a shrunk InputLabel + a bare InputBase, so there is no notched outline for
// the label to float into and no float animation.
//
// This is a ONE-OFF component scoped to the Style Guide, not a global MuiInputBase/
// MuiInputLabel override: a global override reaches every existing input in the app (an
// earlier attempt, the since-removed "Reddit style" input, silently restyled the Header's
// search field).
//
// Three exports, so the same field works for every input type in the demo:
// - TopLabelField  the frame: FormControl + label above + helper text below
// - TopLabelInput  the field itself (a styled InputBase); also what Autocomplete's
//                  renderInput and Select's `input` prop receive
// - TopLabelTextField  the two combined, for a plain text field
//
// Every visual value is read from an existing token, per size:
// - min height     theme.buttonHeight[size]        (same map MuiButton.sizeX's minHeight reads)
// - corner radius  theme.buttonCornerRadius[size]  (same map MuiButton.sizeX's radius reads)
// - padding        `${r - 1}px ${r + 7}px`, the same derivation as Outlined's own padding
//                  (MuiButton.outlinedSize*), so a single line lands on the button height and
//                  text starts where an Outlined button's label would
// - value text     theme.typography.button(.small).fontSize, same as the button label
// - background     palette.background.paper (elevation 0: Paper's flat color, no overlay)
// - border         theme.borderColor at rest; Outlined's own resting border
//                  (primary.main at 30%) on hover; primary.main on focus; error.main on error
//
// One-line fields have a fixed height; multi-line and chip fields use it as a min height,
// so they can grow past one line.
//
// These are admin-front theme keys: cabinet-front's theme doesn't define buttonHeight/
// buttonCornerRadius yet, so there the size-dependent values fall back to MUI's defaults.

// MUI's own Autocomplete indicator button width (28px: a 24px icon + 2px padding each side,
// from Autocomplete.js), needed to reserve room for one or two of them on the right.
const AUTOCOMPLETE_INDICATOR_WIDTH = 28;
// A small Chip (24px) plus Autocomplete's own 3px tag margin on each side, plus the field's
// 1px border on each side: the height of a field holding one row of chips with no padding.
const CHIP_ROW_HEIGHT = 24 + 3 * 2 + 1 * 2;

const getSize = (theme, inputSize) => {
  const radius = theme.buttonCornerRadius?.[inputSize];
  return {
    radius,
    height: theme.buttonHeight?.[inputSize],
    padY: radius !== undefined ? radius - 1 : undefined,
    padX: radius !== undefined ? radius + 7 : undefined
  };
};

export const TopLabel = styled(InputLabel)(({ theme }) => ({
  // Doubled class: beats InputLabel's own formControl/shrink positioning (an absolute
  // position plus a translate/scale transform) regardless of stylesheet order.
  '&&': {
    position: 'relative',
    transform: 'none',
    maxWidth: '100%',
    marginBottom: theme.spacing(0.75),
    fontSize: theme.typography.body2.fontSize
  },
  // The label never reacts to state (no purple on focus, no red on error); only the field
  // itself does. Disabled is left to the app's own MuiFormLabel disabled color.
  '&&:not(.Mui-disabled)': {
    color: theme.typography.body1.color ?? theme.palette.text.secondary
  }
}));

export const TopLabelInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'inputSize'
})(({ theme, inputSize = 'medium' }) => {
  const { radius, height, padY, padX } = getSize(theme, inputSize);
  const fontSize =
    inputSize === 'small'
      ? theme.typography.button.small?.fontSize ?? theme.typography.button.fontSize
      : theme.typography.button.fontSize;
  const borderRest = theme.borderColor ?? theme.palette.divider;
  const px = (value) => (value !== undefined ? `${value}px` : undefined);
  const chipInset = height !== undefined ? Math.max(0, (height - CHIP_ROW_HEIGHT) / 2) : undefined;

  return {
    // Tripled class: Autocomplete applies its own (theme) inputRoot override at two-class
    // specificity (".MuiAutocomplete-root .MuiAutocomplete-inputRoot" — radius 4px and the
    // grey input surface), so the field's own look has to outrank it, not tie with it.
    '&&&': {
      boxSizing: 'border-box',
      // One line: exactly the button height, text centered by InputBase's own flex
      // alignment. Padding is horizontal only, since content-driven height would overshoot:
      // the text line is 1.4375em (20.125px at 14px), so r − 1 padding top and bottom gives
      // 36.125px at Medium instead of 36.
      height,
      borderRadius: radius,
      padding: padX !== undefined ? `0 ${padX}px` : undefined,
      // Multi-line and chip fields grow instead: same height as a floor, and Outlined's
      // r − 1 vertical padding so the first line sits where a one-line field's text does.
      '&.MuiInputBase-multiline': {
        height: 'auto',
        minHeight: height,
        paddingTop: padY,
        paddingBottom: padY
      },
      // Icons inside the field follow its color. The app's global MuiSvgIcon.root.fill would
      // otherwise keep MUI's own icons (Select arrow, Autocomplete arrow, chip ✕) white in
      // every state, including disabled.
      '& .MuiSvgIcon-root': {
        fill: 'currentColor'
      },
      fontSize,
      backgroundColor: theme.palette.background.paper,
      border: `1px solid ${borderRest}`,
      transition: theme.transitions.create(['border-color', 'box-shadow']),

      '& .MuiInputBase-input:not(.MuiSelect-select)': {
        padding: 0
      },
      // Select keeps MUI's own paddingRight (room for its arrow); only the vertical/left
      // padding is handed over to the field.
      '& .MuiSelect-select': {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0
      },
      // Indicators (Select's arrow, Autocomplete's clear/open buttons) sit `radius` in from
      // the right edge — the same inset as the field's own corner.
      '& .MuiSelect-icon': {
        right: px(radius)
      },
      '& .MuiAutocomplete-endAdornment': {
        right: px(radius !== undefined ? radius - 2 : undefined)
      },
      '.MuiAutocomplete-hasPopupIcon &, .MuiAutocomplete-hasClearIcon &': {
        paddingRight: px(radius !== undefined ? radius + AUTOCOMPLETE_INDICATOR_WIDTH : undefined)
      },
      '.MuiAutocomplete-hasPopupIcon.MuiAutocomplete-hasClearIcon &': {
        paddingRight: px(radius !== undefined ? radius + AUTOCOMPLETE_INDICATOR_WIDTH * 2 : undefined)
      },
      // With chips, the chips themselves set the row height: padding shrinks so one row of
      // small chips still lands exactly on the button height, with the same inset on the
      // left as above and below (so the chips sit evenly inside the field).
      '&:has(.MuiAutocomplete-tag)': {
        height: 'auto',
        minHeight: height,
        paddingTop: px(chipInset),
        paddingBottom: px(chipInset),
        paddingLeft: px(chipInset)
      },
      // Icon buttons inside the field (password toggle, date trigger, clear) scale with the
      // field's own text size and don't add height: their padding is cancelled by an equal
      // negative margin.
      '& .MuiInputAdornment-root .MuiIconButton-root': {
        fontSize: '1.25em',
        padding: 2,
        margin: -2
      },
      '& .MuiInputAdornment-root > .MuiSvgIcon-root': {
        fontSize: '1.25em'
      },

      // Order matters (equal specificity, last wins): hover < focused < error < disabled.
      '&:hover': {
        borderColor: alpha(theme.palette.primary.main, 0.3)
      },
      '&.Mui-focused': {
        borderColor: theme.palette.primary.main,
        boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.25)}`
      },
      '&.Mui-error': {
        borderColor: theme.palette.error.main
      },
      '&.Mui-error.Mui-focused': {
        boxShadow: `0 0 0 2px ${alpha(theme.palette.error.main, 0.25)}`
      },
      '&.Mui-disabled': {
        borderColor: borderRest,
        cursor: 'not-allowed',
        // A start/end adornment keeps MUI's action.active color even when the field is
        // disabled (e.g. the Search magnifier); inherit the field's own disabled color.
        '& .MuiInputAdornment-root': {
          color: 'inherit'
        }
      }
    }
  };
});

export const TopLabelField = ({
  id,
  label,
  helperText,
  error,
  disabled,
  focused,
  fullWidth,
  style,
  className,
  children
}) => (
  <FormControl
    variant="standard"
    error={error}
    disabled={disabled}
    focused={focused}
    fullWidth={fullWidth}
    style={style}
    className={className}
  >
    {label ? (
      <TopLabel shrink={true} disableAnimation={true} htmlFor={id}>
        {label}
      </TopLabel>
    ) : null}
    {children}
    {helperText ? <FormHelperText id={`${id}-helper-text`}>{helperText}</FormHelperText> : null}
  </FormControl>
);

const TopLabelTextField = ({
  id,
  label,
  helperText,
  size = 'medium',
  error,
  disabled,
  focused,
  fullWidth,
  style,
  className,
  ...inputProps
}) => (
  <TopLabelField
    id={id}
    label={label}
    helperText={helperText}
    error={error}
    disabled={disabled}
    focused={focused}
    fullWidth={fullWidth}
    style={style}
    className={className}
  >
    <TopLabelInput
      id={id}
      inputSize={size}
      aria-describedby={helperText ? `${id}-helper-text` : undefined}
      {...inputProps}
    />
  </TopLabelField>
);

export default TopLabelTextField;
