import React from 'react';
import { Typography, Divider, Card, CardContent } from '@mui/material';
import ExpandableDescription from './ExpandableDescription';

// Layout is always: demo (`children`), a splitter, `description`, then — when `properties`
// is provided (i.e. "Show properties" is on) — a stronger splitter and the theme-tokens
// table. The tokens table sits flush inside the same outer card, just nested one elevation
// lower (2 vs 4) so it still reads as "reference" without a gap breaking up the surface.
const Section = ({ id, title, titleVariant = 'h2', actions, description, properties, propertiesHeading, children }) => (
  <div id={id} style={{ marginBottom: 32, scrollMarginTop: 24 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant={titleVariant} gutterBottom={true}>
        {title}
      </Typography>
      {actions}
    </div>
    <Divider style={{ marginBottom: 16 }} />
    <Card elevation={4}>
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
          <Card elevation={2} square={true}>
            <Typography
              variant="overline"
              color="textSecondary"
              style={{ display: 'block', padding: '10px 16px 0' }}
            >
              {propertiesHeading || 'Theme tokens'}
            </Typography>
            <div style={{ padding: '8px 16px 16px' }}>{properties}</div>
          </Card>
        </>
      ) : null}
    </Card>
  </div>
);

export default Section;
