import React from 'react';
import { Typography } from '@mui/material';

// "On this page" sub-nav for a page that splits into its own anchor-able sub-items (e.g.
// every Typography variant, or Buttons' nested Icon Buttons card) — now purely intra-page:
// each item scrolls within the current page only, no cross-page concern. Renders nothing
// when there are no sub-items.
const SubNav = ({ heading, items, activeSubId, onSelect }) => {
  if (!items || !items.length) {
    return null;
  }

  return (
    <nav>
      <Typography
        variant="overline"
        color="textSecondary"
        style={{ display: 'block', padding: '0 8px 4px' }}
      >
        {heading}
      </Typography>
      {items.map((section) => {
        const active = activeSubId === section.id;
        return (
          <div
            key={section.id}
            onClick={() => onSelect(section.id)}
            style={{
              cursor: 'pointer',
              // Constant padding regardless of `active` — varying box size with state (as an
              // earlier version of this did) shifts every item below it when the active item
              // changes while scrolling. Only color/border/weight vary here, never size.
              padding: '3px 8px 3px 12px',
              marginBottom: 2,
              borderLeft: active ? '2px solid #BB86FC' : '2px solid transparent'
            }}
          >
            <Typography
              variant="caption"
              style={{ display: 'block', color: active ? '#BB86FC' : 'inherit', fontWeight: active ? 700 : 400 }}
            >
              {section.label}
            </Typography>
          </div>
        );
      })}
    </nav>
  );
};

export default SubNav;
