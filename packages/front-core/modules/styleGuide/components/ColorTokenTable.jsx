import React from 'react';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import AlphaColorSwatch from './AlphaColorSwatch';
import { withColorSwatches } from '../shared/colorUtils';

export const Swatch = ({ label, color, editMode, editable, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
    {editMode && editable ? (
      <AlphaColorSwatch color={color} onChange={onChange} size={32} />
    ) : (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          border: '1px solid rgba(0,0,0,0.15)',
          background: color || 'transparent',
          flexShrink: 0
        }}
      />
    )}
    <Typography variant="body2" style={{ fontFamily: 'monospace' }}>
      {label}: {color || '(not set)'}
    </Typography>
  </div>
);

// One row per color token: a preview swatch (or picker, in edit mode), the token's full
// path, and its raw value — used by the Colors section instead of a flat Swatch list so
// long custom-token lists (which vary per app, see CUSTOM_TOKEN_KEYS) scan as a table.
const COLOR_TABLE_CELL_STYLE = { padding: '4px 8px' };

const ColorTokenTable = ({ rows }) => (
  <Table size="small" style={{ tableLayout: 'fixed' }}>
    <TableHead>
      <TableRow>
        <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, width: 40, whiteSpace: 'nowrap' }}>Color</TableCell>
        <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, width: 260 }}>Token</TableCell>
        <TableCell style={COLOR_TABLE_CELL_STYLE}>Value</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rows.map((row) => (
        <TableRow key={row.token}>
          <TableCell style={COLOR_TABLE_CELL_STYLE}>
            {row.editMode && row.editable ? (
              <AlphaColorSwatch color={row.color} onChange={row.onChange} size={24} />
            ) : (
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: '1px solid rgba(0,0,0,0.15)',
                  background: row.color || 'transparent'
                }}
              />
            )}
          </TableCell>
          <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, fontFamily: 'monospace', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {row.token}
          </TableCell>
          <TableCell style={{ ...COLOR_TABLE_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>
            {row.color ? withColorSwatches(row.color) : '(not set)'}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
);

export default ColorTokenTable;
