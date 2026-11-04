import React from 'react';
import { Typography, Divider, Card, CardContent } from '@mui/material';
import ExpandableDescription from './ExpandableDescription';

// Layout is always: demo (`children`), a splitter, `description`, then — when `properties`
// is provided (i.e. "Show properties" is on) — a stronger splitter and the theme-tokens
// table. The tokens table sits flush inside the same outer card, just nested one elevation
// lower (0 vs 1) so it still reads as "reference" without a gap breaking up the surface.
//
// `controls` (the demo's tab bar: size, state, color...) sits at the very top of the card and
// `propertiesControls` at the top of the tokens table, each above a full-width divider, so the
// tabs' selection indicator lands on a line that runs edge to edge of the card.
//
// A page-level section (titleVariant h2, the default) keeps its title above the card, as the
// page heading. A subsection (h4) carries its title inside the card, as its first
// row, so each subsection reads as one self-contained block. A full-width divider runs under
// the title, or under the tab bar when there is one, never both.
const ControlBar = ({ children, style }) => (
  <>
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-end', flexWrap: 'wrap', padding: '8px 16px 0', ...style }}>
      {children}
    </div>
    <Divider />
  </>
);

const Section = ({
  id,
  title,
  titleVariant = 'h2',
  actions,
  controls,
  description,
  properties,
  propertiesControls,
  propertiesHeading,
  children
}) => (
  <div id={id} style={{ marginBottom: 32, scrollMarginTop: 24 }}>
    {titleVariant === 'h2' ? (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant={titleVariant} gutterBottom={true}>
            {title}
          </Typography>
          {actions}
        </div>
        <Divider style={{ marginBottom: 16 }} />
      </>
    ) : null}
    <Card elevation={1}>
      {titleVariant !== 'h2' ? (
        <>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: controls ? '16px 16px 0' : 16
            }}
          >
            <Typography variant={titleVariant}>{title}</Typography>
            {actions}
          </div>
          {/* With a tab bar, the tab bar's own full-width divider is the one under the title. */}
          {controls ? null : <Divider />}
        </>
      ) : null}
      {controls ? <ControlBar>{controls}</ControlBar> : null}
      <CardContent>{children}</CardContent>
      {description ? (
        <>
          <Divider />
          <CardContent>
            <ExpandableDescription>{description}</ExpandableDescription>
          </CardContent>
        </>
      ) : null}
      {properties ? (
        <>
          <Divider style={{ borderBottomWidth: 2 }} />
          <Card elevation={0} square={true}>
            <Typography
              variant="overline"
              color="textSecondary"
              style={{ display: 'block', padding: '10px 16px 0' }}
            >
              {propertiesHeading || 'Theme tokens'}
            </Typography>
            {propertiesControls ? <ControlBar style={{ paddingTop: 0 }}>{propertiesControls}</ControlBar> : null}
            <div style={{ padding: '8px 16px 16px' }}>{properties}</div>
          </Card>
        </>
      ) : null}
    </Card>
  </div>
);

export default Section;
