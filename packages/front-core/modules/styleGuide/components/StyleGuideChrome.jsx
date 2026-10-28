import React from 'react';
import { Typography, AppBar, Toolbar, Button, FormControlLabel, Switch, Drawer, Snackbar } from '@mui/material';
import { useStyleGuideState } from '../shared/StyleGuideStateProvider';
import { isEmpty } from '../shared/utils';
import { DRAWER_WIDTH, RIGHT_DRAWER_WIDTH } from '../shared/constants';
import SideNav from './SideNav';

// Shared chrome for every Style Guide page: the top AppBar (title + Edit mode/Show
// properties/Measure toggles + Bake flow), the left SideNav drawer, the scrollable content
// column, an optional right-side "on this page" sub-nav slot, and the bake-result Snackbar.
// `activeId` is a literal string each page passes (e.g. "buttons") — under one-route-per-page
// every page statically knows which section it is, so no scrollspy is needed to track it.
const StyleGuideChrome = ({ activeId, subNav, children }) => {
  const { editMode, setEditMode, showProperties, setShowProperties, measureEnabled, setMeasureEnabled, draft, resetDraft, baking, handleBake, snackbarMessage, setSnackbarMessage } =
    useStyleGuideState();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            Style Guide
          </Typography>
          {editMode ? (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Button variant="outlined" disabled={isEmpty(draft)} onClick={resetDraft}>
                Reset draft
              </Button>
              <Button variant="contained" color="primary" disabled={isEmpty(draft) || baking} onClick={handleBake}>
                {baking ? 'Baking…' : 'Bake into theme.overrides.json'}
              </Button>
            </div>
          ) : null}
          <FormControlLabel
            control={<Switch size="small" checked={editMode} onChange={(event) => setEditMode(event.target.checked)} />}
            label="Edit mode"
            style={{ marginLeft: 16 }}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={showProperties}
                onChange={(event) => setShowProperties(event.target.checked)}
              />
            }
            label="Show properties"
            style={{ marginLeft: 8 }}
          />
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={measureEnabled}
                onChange={(event) => setMeasureEnabled(event.target.checked)}
              />
            }
            label="Measure"
            style={{ marginLeft: 8 }}
          />
        </Toolbar>
      </AppBar>
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <Drawer
          variant="permanent"
          anchor="left"
          elevation={0}
          sx={{ flexShrink: 0 }}
          PaperProps={{
            style: {
              position: 'relative',
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
              padding: 12,
              // MUI's default docked-drawer border-right is rgba(0,0,0,0.12) — a
              // light-theme-style divider color, unfixed for dark mode (same leftover
              // issue as palette.divider elsewhere in this file).
              borderRight: '1px solid rgba(255, 255, 255, 0.12)'
            }
          }}
        >
          <SideNav activeId={activeId} />
        </Drawer>
        <div style={{ flex: 1, minWidth: 0, overflowY: 'auto', boxSizing: 'border-box', padding: '24px 32px' }}>
          <Typography variant="body2" color="textSecondary" gutterBottom={true} style={{ marginBottom: 40, maxWidth: 540 }}>
            Live reference rendered with this app's actual theme ({`packages/front-core/theme.js`}
            {' overridden by '}
            {`src/application/theme.js`} when present). Toggle Edit mode to tweak colors and
            typography live, then Bake to persist your changes — restart `npm start` afterwards
            to make the baked result the new baseline everywhere.
          </Typography>

          <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
            <div style={{ maxWidth: 960, minWidth: 0, flex: '1 1 auto' }}>{children}</div>
            {subNav ? (
              <div
                style={{
                  width: RIGHT_DRAWER_WIDTH,
                  flexShrink: 0,
                  position: 'sticky',
                  top: 24,
                  boxSizing: 'border-box',
                  padding: '12px 12px 12px 0',
                  borderLeft: '1px solid rgba(255, 255, 255, 0.12)'
                }}
              >
                {subNav}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage('')}
        message={snackbarMessage}
      />
    </div>
  );
};

export default StyleGuideChrome;
