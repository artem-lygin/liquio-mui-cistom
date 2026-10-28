import React from 'react';
import { Link } from 'react-router-dom';
import { List, ListItemButton, ListItemText, Divider } from '@mui/material';
import { SECTIONS, EXPLAINER_SECTIONS } from '../shared/sections';

// A real ListItemButton (not a styled div) so hover/focus-visible/selected all come from
// the theme's own action.hover/action.selected states instead of being hand-rolled — the
// left accent border on ".Mui-selected" is the one bit of custom styling on top of that.
const SideNavLink = ({ section, activeId }) => (
  <ListItemButton
    component={Link}
    to={`/style-guide/${section.id}`}
    selected={activeId === section.id}
    sx={{
      borderRadius: 1,
      marginBottom: '2px',
      borderLeft: '3px solid transparent',
      '&.Mui-selected': {
        borderLeft: '3px solid #BB86FC',
        backgroundColor: 'rgba(187, 134, 252, 0.12)'
      },
      '&.Mui-selected:hover': {
        backgroundColor: 'rgba(187, 134, 252, 0.18)'
      }
    }}
  >
    <ListItemText
      primary={section.label}
      primaryTypographyProps={{ variant: 'body2', style: { fontWeight: activeId === section.id ? 700 : 400 } }}
    />
  </ListItemButton>
);

// activeId is passed in literally by whichever page renders this (e.g. "buttons") — each
// page statically knows which section it is under one-route-per-page, so no scrollspy is
// needed to track it.
const SideNav = ({ activeId }) => (
  <List component="nav" disablePadding={true} style={{ background: 'none' }}>
    {SECTIONS.map((section) => (
      <SideNavLink key={section.id} section={section} activeId={activeId} />
    ))}
    <Divider style={{ margin: '12px 0' }} />
    {EXPLAINER_SECTIONS.map((section) => (
      <SideNavLink key={section.id} section={section} activeId={activeId} />
    ))}
  </List>
);

export default SideNav;
