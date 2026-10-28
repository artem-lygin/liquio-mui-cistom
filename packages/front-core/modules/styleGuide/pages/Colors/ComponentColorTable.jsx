import React from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { StatusBadge } from '../../components/PropertiesPanel';
import { withColorSwatches } from '../../shared/colorUtils';

// One row per color-bearing property on a component — used by the Colors section's
// "Components" breakdown (see getCustomColorRows) so the same palette shown in the Palette
// tables above can be cross-checked against where each component actually gets its color
// from: read live from theme.palette (status 'theme'), replaced with a literal by this app
// (status 'overridden' — even when that literal currently matches the palette, since it's
// still an independent value, not a reference), or hardcoded by MUI itself with no palette
// token involved at all (status 'other'). Unlike TokenLegend, Value is its own column (the
// resolved literal, always shown with a swatch) rather than folded into free-text Notes.
const COMPONENT_COLOR_CELL_STYLE = { padding: '4px 8px', verticalAlign: 'top' };

const ComponentColorTable = ({ rows }) => (
  <Table size="small" style={{ tableLayout: 'fixed', marginBottom: 8 }}>
    <TableHead>
      <TableRow>
        <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, width: 260 }}>Theme color token</TableCell>
        <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, width: 200 }}>Value</TableCell>
        <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, width: 60, textAlign: 'center' }}>Status</TableCell>
        <TableCell style={COMPONENT_COLOR_CELL_STYLE}>Notes</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.length ? (
        rows.map((row, index) => (
          <TableRow key={`${row.path}-${index}`}>
            <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>{row.path}</TableCell>
            <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>
              {row.value ? withColorSwatches(row.value) : '(not set)'}
            </TableCell>
            <TableCell style={{ ...COMPONENT_COLOR_CELL_STYLE, textAlign: 'center' }}>
              <StatusBadge status={row.status} />
            </TableCell>
            <TableCell style={COMPONENT_COLOR_CELL_STYLE}>
              <Typography variant="caption" color="textSecondary">
                {row.note}
              </Typography>
            </TableCell>
          </TableRow>
        ))
      ) : (
        <TableRow>
          <TableCell colSpan={4} style={COMPONENT_COLOR_CELL_STYLE}>
            <Typography variant="caption" color="textSecondary">
              No color-bearing overrides found for this component in the active theme.
            </Typography>
          </TableCell>
        </TableRow>
      )}
    </TableBody>
  </Table>
);

export default ComponentColorTable;
