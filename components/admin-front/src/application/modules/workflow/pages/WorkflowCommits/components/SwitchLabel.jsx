// PoC (poc/git-version-control): the small labelled switch used in this PoC's toolbars
// ("Releases only" on the versions list, "Show difference" in the file viewer). Switch first,
// then its label, with a gap between them (MUI puts the label right against the switch).
import React from 'react';
import { FormControlLabel, Switch } from '@mui/material';

// Gap between the switch and its label, in spacing units (8px).
const LABEL_GAP = 2;

const SwitchLabel = ({ label, checked, onChange, sx }) => (
  <FormControlLabel
    sx={{ columnGap: LABEL_GAP, ...sx }}
    control={
      <Switch size="small" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    }
    label={label}
  />
);

export default SwitchLabel;
