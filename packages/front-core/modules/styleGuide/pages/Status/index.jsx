import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import StyleGuideStateProvider, { useStyleGuideState } from '../../shared/StyleGuideStateProvider';
import StyleGuideChrome from '../../components/StyleGuideChrome';
import Section from '../../components/Section';
import { Swatch } from '../../components/ColorTokenTable';

// theme.js defines no palette.warning/success/info — these four concepts are drawn
// instead from two separate, hardcoded, disagreeing places in the codebase. `snackbar`
// describes packages/front-core/components/Snackbars/Snackbar.jsx (the real toast system,
// wired in via addMessage) and `formControl` describes
// packages/front-core/components/JsonSchema/components/FormControlMessage.jsx (inline
// form-field messages). `resolve`, when present, reads a value that genuinely comes from
// the live theme (error/info reuse theme.palette.error.dark/primary.dark); everything else
// is a literal hex/MUI-swatch constant copied into that file, confirmed by reading both
// files directly — not derived from the theme at all.
const STATUS_COLOR_ROWS = [
  {
    key: 'success',
    label: 'Success',
    snackbar: { note: 'green[600]', resolve: () => '#43a047' },
    formControl: { note: "MUI's default success.main", color: '#4caf50' }
  },
  {
    key: 'warning',
    label: 'Warning',
    snackbar: { note: 'amber[700]', resolve: () => '#ffa000' },
    formControl: { note: "MUI's default warning.main", color: '#ff9800' }
  },
  {
    key: 'error',
    label: 'Error',
    snackbar: { note: 'theme.palette.error.dark — themed', resolve: (theme) => theme.palette.error.dark },
    formControl: { note: 'hardcoded literal — matches palette.error.main by coincidence', color: '#f44336' }
  },
  {
    key: 'info',
    label: 'Info',
    snackbar: {
      note: 'theme.palette.primary.dark — repurposed, not a real "info" color',
      resolve: (theme) => theme.palette.primary.dark
    },
    formControl: { note: "hardcoded literal, MUI's default info.main", color: '#2196f3' }
  }
];

const StatusPageContent = () => {
  const { previewTheme } = useStyleGuideState();

  return (
    <StyleGuideChrome activeId="status">
      <Section
        id="status"
        title="Status colors"
        description={
          <>
            theme.js has no palette.warning, success, or info — only primary, secondary,
            and error are defined. Nothing in the app actually uses{' '}
            <span style={{ fontFamily: 'monospace' }}>color=&quot;warning&quot;</span> or{' '}
            <span style={{ fontFamily: 'monospace' }}>color=&quot;success&quot;</span> on a
            themed component (confirmed: zero matches) — instead these four concepts come
            from two separate, hardcoded color maps that don&apos;t agree with each other.
            Not editable here — neither source reads from theme.overrides.json.
          </>
        }
      >
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell style={{ width: 90 }}>Concept</TableCell>
              <TableCell>Snackbars/Snackbar.jsx (real toast system)</TableCell>
              <TableCell>FormControlMessage.jsx (inline field messages)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {STATUS_COLOR_ROWS.map((row) => (
              <TableRow key={row.key}>
                <TableCell style={{ fontWeight: 700, verticalAlign: 'top' }}>{row.label}</TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>
                  <Swatch
                    label={row.snackbar.note}
                    color={row.snackbar.resolve(previewTheme)}
                    editMode={false}
                    editable={false}
                  />
                </TableCell>
                <TableCell style={{ verticalAlign: 'top' }}>
                  <Swatch
                    label={row.formControl.note}
                    color={row.formControl.color}
                    editMode={false}
                    editable={false}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </StyleGuideChrome>
  );
};

const StatusPage = () => (
  <StyleGuideStateProvider>
    <StatusPageContent />
  </StyleGuideStateProvider>
);

export default StatusPage;
