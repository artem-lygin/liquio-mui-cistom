import React from 'react';
import { Typography, Divider } from '@mui/material';

// The page's own title, above its cards. Every card below carries its own (h4) title inside
// it, so this is the only heading that sits outside a card.
const PageHeading = ({ title, actions }) => (
  <div style={{ marginBottom: 8 }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <Typography variant="h2" gutterBottom={true}>
        {title}
      </Typography>
      {actions}
    </div>
    <Divider style={{ marginBottom: 16 }} />
  </div>
);

export default PageHeading;
