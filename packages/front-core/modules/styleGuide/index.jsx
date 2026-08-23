import React from 'react';
import PaletteIcon from '@mui/icons-material/Palette';

const StyleGuidePage = React.lazy(() => import('./pages/StyleGuide'));

export default {
  routes: [
    {
      path: '/style-guide',
      component: StyleGuidePage,
      title: 'StyleGuide'
    }
  ],
  navigation: [
    {
      id: 'StyleGuide',
      path: '/style-guide',
      icon: <PaletteIcon />
    }
  ]
};
