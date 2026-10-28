import React from 'react';
import { Typography, Card, Collapse, Chip, Tooltip, SvgIcon, Table, TableHead, TableBody, TableRow, TableCell } from '@mui/material';
import { KeyboardArrowDownFill as SymbolKeyboardArrowDown } from '@material-symbols-svg/react/rounded/w400';
import { withColorSwatches } from '../shared/colorUtils';

// A token's `status` (defaults to 'theme' when omitted, since that's the common case) says
// whether the value shown actually comes from the live theme, or whether it's a fact about
// the app/MUI overriding or ignoring the theme entirely. Only tokens that deviate need to set
// this explicitly — see getButtonTokenItems and the Chips/Alert legends below for the
// 'overridden'/'other' cases.
const TOKEN_STATUS = {
  theme: { color: '#4caf50', label: 'Theme value — read directly from the active theme' },
  overridden: { color: '#ffca28', label: 'Overridden — this app replaces the theme value' },
  other: { color: '#f44336', label: "Other — hardcoded in MUI or elsewhere, not theme-derived" }
};

export const StatusBadge = ({ status }) => {
  const meta = TOKEN_STATUS[status] || TOKEN_STATUS.theme;
  return (
    <Tooltip title={meta.label} arrow={true} placement="top">
      <span
        style={{
          display: 'inline-block',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: meta.color,
          border: '1px solid rgba(255, 255, 255, 0.4)',
          cursor: 'default'
        }}
      />
    </Tooltip>
  );
};

// Shown on a token row whose value isn't actually redefined for the currently-selected
// state tab (see BUTTON_STATES/INPUT_STATES) — it's just carried over from another state,
// most often Resting. Keeps that fact out of the note text, which only has to describe
// what the token IS in this state, not which other states share it.
export const InheritsChip = ({ from }) => (
  <Tooltip title={`Inherits from ${from} — not redefined for this state`} arrow={true} placement="top">
    <Chip
      label={from}
      size="small"
      variant="outlined"
      style={{ height: 20, fontSize: 11, marginRight: 8, verticalAlign: 'middle' }}
    />
  </Tooltip>
);

// Names which theme categories (color/shape/typography/spacing/elevation) an element category
// draws from, and where in the theme — the same idea as the property list under each typography
// row, but pointing at the underlying token path instead of the CSS output of one instance.
// Each category lists one or more { path, note } tokens: `path` (the theme reference, e.g.
// "palette.primary.main") is the only part rendered as a link — `note` (a resolved value or
// caveat) stays plain text, in its own column so long notes don't run into the next token.
// `anchor`, when set on the category, links every path in it to the page that owns that
// token category (navigates there — see shared/navigation.js). One row per token; the
// category cell spans every row it owns.
// One collapsible card per token category — replaces the old single flat table (Category
// grouped via rowSpan) so a properties region with many categories (Color/Typography/
// Spacing/Shape/Icon) reads as independent, individually-expandable cards instead of one
// long table. Falls back to a Token/Status/Notes shape (no Value column) for categories
// whose tokens don't carry an explicit `value` field — see getButtonColorRows and friends
// below for the ones that do. A token with `active: true` — the row matching whatever's
// currently selected in the demo above (e.g. the current variant+color) — gets a ▸ marker,
// since these tables are otherwise static and always show every combination at once.
const PROPERTY_CARD_CELL_STYLE = { padding: '4px 8px', verticalAlign: 'top' };

const PropertyCategoryCard = ({ category, anchor, tokens, onNavigate }) => {
  const [open, setOpen] = React.useState(true);
  const hasValue = tokens.some((token) => token.value !== undefined);

  return (
    <Card variant="outlined" style={{ marginBottom: 8 }}>
      <div
        onClick={() => setOpen((prev) => !prev)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', cursor: 'pointer' }}
      >
        <Typography variant="h5">{category}</Typography>
        <SvgIcon
          component={SymbolKeyboardArrowDown}
          inheritViewBox={true}
          style={{ fontSize: 18, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}
        />
      </div>
      <Collapse in={open}>
        <Table size="small" style={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, width: hasValue ? 220 : 280 }}>Token</TableCell>
              {hasValue ? <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, width: 190 }}>Value</TableCell> : null}
              <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, width: 60, textAlign: 'center' }}>Status</TableCell>
              <TableCell style={PROPERTY_CARD_CELL_STYLE}>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tokens.map((token, index) => (
              <TableRow key={`${category}-${index}`}>
                <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>
                  {token.active ? (
                    <span title="Matches the currently selected demo above" style={{ marginRight: 4 }}>
                      ▸
                    </span>
                  ) : null}
                  {anchor ? (
                    <a
                      href={`#${anchor}`}
                      onClick={(event) => {
                        event.preventDefault();
                        onNavigate(anchor);
                      }}
                      style={{ color: 'inherit', textDecoration: 'underline', cursor: 'pointer' }}
                    >
                      {token.path}
                    </a>
                  ) : (
                    token.path
                  )}
                </TableCell>
                {hasValue ? (
                  <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, fontFamily: 'monospace', fontSize: 12 }}>
                    {token.value === undefined ? '' : token.value ? withColorSwatches(token.value) : '(not set)'}
                  </TableCell>
                ) : null}
                <TableCell style={{ ...PROPERTY_CARD_CELL_STYLE, textAlign: 'center' }}>
                  <StatusBadge status={token.status} />
                </TableCell>
                <TableCell style={PROPERTY_CARD_CELL_STYLE}>
                  {token.inheritsFrom ? <InheritsChip from={token.inheritsFrom} /> : null}
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    style={{ display: token.inheritsFrom ? 'inline' : undefined }}
                  >
                    {withColorSwatches(token.note || '')}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Collapse>
    </Card>
  );
};

export const PropertiesCardGroup = ({ items, onNavigate }) => (
  <div>
    {items.map((item) => (
      <PropertyCategoryCard key={item.category} category={item.category} anchor={item.anchor} tokens={item.tokens} onNavigate={onNavigate} />
    ))}
  </div>
);
