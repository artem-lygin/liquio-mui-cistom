import React from 'react';
import { FormControl, InputLabel, InputBase, FormHelperText } from '@mui/material';
import { styled, alpha } from '@mui/material/styles';

// Top-label Text field: an input designed from Button / Primary's own tokens rather than
// MUI's outlined/filled defaults. Built the way MUI's own docs build a label-above input
// (mui.com/material-ui/react-text-field → "Customized inputs" → BootstrapInput):
// FormControl + a shrunk InputLabel + a bare InputBase, so there is no notched outline for
// the label to float into and no float animation.
//
// Like RedditTextField, this is a ONE-OFF component scoped to the Style Guide, not a global
// MuiInputBase/MuiInputLabel override: a global override reaches every existing input in the
// app (a previous attempt silently restyled the Header's search field).
//
// Every visual value is read from an existing token, per size:
// - height         theme.buttonHeight[size]        (same map MuiButton.sizeX's minHeight reads)
// - corner radius  theme.buttonCornerRadius[size]  (same map MuiButton.sizeX's radius reads)
// - side padding   buttonCornerRadius + 7, i.e. the same derivation as Outlined's own
//                  horizontal padding (MuiButton.outlinedSize*), so text sits where an
//                  Outlined button's label would
// - value text     theme.typography.button(.small).fontSize, same as the button label
// - background     palette.background.paper (elevation 0: Paper's flat color, no overlay)
// - border         theme.borderColor at rest; Outlined's own resting border
//                  (primary.main at 30%) on hover; primary.main on focus; error.main on error
//
// These are admin-front theme keys: cabinet-front's theme doesn't define buttonHeight/
// buttonCornerRadius yet, so there the size-dependent values fall back to MUI's defaults.
const SIDE_PADDING_EXTRA = 7; // mirrors MuiButton.outlinedSize*: `${r - 1}px ${r + 7}px`

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

const TopLabelInput = styled(InputBase, {
  shouldForwardProp: (prop) => prop !== 'inputSize'
})(({ theme, inputSize }) => {
  const radius = theme.buttonCornerRadius?.[inputSize];
  const height = theme.buttonHeight?.[inputSize];
  const fontSize =
    inputSize === 'small'
      ? theme.typography.button.small?.fontSize ?? theme.typography.button.fontSize
      : theme.typography.button.fontSize;
  const borderRest = theme.borderColor ?? theme.palette.divider;

  return {
    boxSizing: 'border-box',
    height,
    borderRadius: radius,
    padding: radius !== undefined ? `0 ${radius + SIDE_PADDING_EXTRA}px` : undefined,
    fontSize,
    backgroundColor: theme.palette.background.paper,
    border: `1px solid ${borderRest}`,
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    '& .MuiInputBase-input': {
      padding: 0,
      height: '100%'
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
      cursor: 'not-allowed'
    }
  };
});

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
}) => {
  const helperTextId = helperText ? `${id}-helper-text` : undefined;

  return (
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
      <TopLabelInput id={id} inputSize={size} aria-describedby={helperTextId} {...inputProps} />
      {helperText ? <FormHelperText id={helperTextId}>{helperText}</FormHelperText> : null}
    </FormControl>
  );
};

export default TopLabelTextField;
